'use client'

import React, { useRef } from 'react'
import { useReactToPrint } from 'react-to-print'
import { Button } from '@/components/ui/button'
import { Printer } from 'lucide-react'
import { MemoryPost } from '@/types'
import { getRelativeTime } from '@/lib/utils'

interface GuestbookPrintComponentProps {
    memories: MemoryPost[]
    memorialName: string
}

const GuestbookPrintContent = React.forwardRef<HTMLDivElement, GuestbookPrintComponentProps>(
    ({ memories, memorialName }, ref) => {
        return (
            <div ref={ref} className="bg-white text-black p-12 print-content">
                <style type="text/css" media="print">
                    {`
                        @page { size: auto;  margin: 20mm; }
                        .print-content { display: block !important; }
                    `}
                </style>
                <div className="text-center mb-12 border-b-2 border-black pb-8">
                    <h1 className="text-4xl font-serif mb-4">In Loving Memory</h1>
                    <h2 className="text-2xl font-sans text-gray-600">{memorialName}</h2>
                </div>

                <div className="space-y-8">
                    {memories.map((memory) => (
                        <div key={memory.id} className="break-inside-avoid border-b border-gray-200 pb-6">
                            <div className="flex justify-between items-baseline mb-2">
                                <h3 className="font-bold text-lg">{memory.name}</h3>
                                <span className="text-sm text-gray-500">
                                    {new Date(memory.created_at).toLocaleDateString()}
                                </span>
                            </div>
                            <p className="whitespace-pre-wrap text-gray-800 font-serif leading-relaxed">
                                {memory.message}
                            </p>
                            {memory.photo_url && (
                                <div className="mt-4">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={memory.photo_url} alt="Memory" className="max-h-64 object-contain rounded-lg border border-gray-200" />
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="mt-16 text-center text-sm text-gray-400">
                    Generated from Reg Fulmer Memorial
                </div>
            </div>
        )
    }
)
GuestbookPrintContent.displayName = 'GuestbookPrintContent'

export function GuestbookPrinter({ memories, memorialName }: GuestbookPrintComponentProps) {
    const componentRef = useRef<HTMLDivElement>(null)
    const handlePrint = useReactToPrint({
        contentRef: componentRef,
        documentTitle: `Guestbook - ${memorialName}`
    })

    return (
        <>
            <div style={{ display: 'none' }}>
                <GuestbookPrintContent
                    ref={componentRef}
                    memories={memories}
                    memorialName={memorialName}
                />
            </div>
            <Button
                variant="secondary"
                size="sm"
                onClick={() => handlePrint()}
                leftIcon={<Printer className="w-4 h-4" />}
            >
                Print Guestbook
            </Button>
        </>
    )
}
