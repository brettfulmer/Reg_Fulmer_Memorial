'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'

// Placeholder images for when we don't have enough uploads yet
const PLACEHOLDERS = [
  '/images/placeholder-1.jpg', // You might need to add these or handle empty state
]

interface Photo {
  id: string
  url: string
}

export function LivingWall() {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [gridState, setGridState] = useState<(Photo | null)[]>([])
  const containerRef = useRef<HTMLDivElement>(null)
  
  // Grid configuration
  const COLS = 4 // Desktops
  const ROWS = 3
  const TOTAL_CELLS = COLS * ROWS

  // 1. Fetch initial photos
  useEffect(() => {
    const supabase = createClient()
    
    async function fetchPhotos() {
        // Fetch photos from memories table
        const { data } = await supabase
            .from('memories')
            .select('id, photo_url')
            .not('photo_url', 'is', null)
            .order('created_at', { ascending: false })
            .limit(50) // Keep pool reasonable

        if (data) {
            const mappedPhotos = data.map(m => ({ id: m.id, url: m.photo_url }))
            setPhotos(mappedPhotos)
            
            // Initial fill
            const initialGrid = Array(TOTAL_CELLS).fill(null).map((_, i) => 
                mappedPhotos[i % mappedPhotos.length] || null
            )
            setGridState(initialGrid)
        }
    }

    fetchPhotos()

    // Realtime subscription
    const channel = supabase
        .channel('schema-db-changes')
        .on(
            'postgres_changes',
            {
                event: 'INSERT',
                schema: 'public',
                table: 'memories',
                filter: 'photo_url=neq.null'
            },
            (payload) => {
                const newPhoto = { id: payload.new.id, url: payload.new.photo_url }
                setPhotos(prev => [newPhoto, ...prev])
                // Immediately inject into a random slot to show responsiveness
                setGridState(prev => {
                    const next = [...prev]
                    const randomIdx = Math.floor(Math.random() * TOTAL_CELLS)
                    next[randomIdx] = newPhoto
                    return next
                })
            }
        )
        .subscribe()

    return () => {
        supabase.removeChannel(channel)
    }
  }, [])

  // 2. The "Living" Loop - Swap images randomly
  useEffect(() => {
    if (photos.length <= TOTAL_CELLS) return // No need to swap if we show everything

    const interval = setInterval(() => {
        setGridState(currentState => {
            const nextState = [...currentState]
            // Pick a random cell to update
            const cellIndex = Math.floor(Math.random() * TOTAL_CELLS)
            
            // Pick a random photo from the pool that ISN'T currently displayed
            const currentIds = new Set(currentState.map(p => p?.id))
            const availablePhotos = photos.filter(p => !currentIds.has(p.id))
            
            if (availablePhotos.length > 0) {
                const randomPhoto = availablePhotos[Math.floor(Math.random() * availablePhotos.length)]
                nextState[cellIndex] = randomPhoto
            }
            
            return nextState
        })
    }, 4000) // Change one image every 4 seconds

    return () => clearInterval(interval)
  }, [photos])

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-background">
      {/* Overlay to ensure text readability */}
      <div className="absolute inset-0 bg-background/85 backdrop-blur-[2px] z-10" />
      
      {/* Mosaic Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 h-full w-full opacity-60 grayscale-[20%] sepia-[10%]">
        {gridState.map((photo, idx) => (
            <div key={idx} className="relative w-full h-full overflow-hidden border-r border-b border-white/5">
                <AnimatePresence mode="popLayout">
                    {photo && (
                        <motion.div
                            key={photo.id}
                            initial={{ opacity: 0, scale: 1.1 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 2.5, ease: "easeInOut" }}
                            className="absolute inset-0"
                        >
                            <Image
                                src={photo.url}
                                alt="Memory"
                                fill
                                className="object-cover"
                                sizes="25vw"
                                priority={idx < 8} // Prioritize visible ones
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        ))}
      </div>
    </div>
  )
}
