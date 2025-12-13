'use client'

import { useState, useRef, useEffect } from 'react'
import { Mic, Square, Play, Trash2, StopCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface AudioRecorderProps {
    onRecordingComplete: (audioBlob: Blob) => void
}

export function AudioRecorder({ onRecordingComplete }: AudioRecorderProps) {
    const [isRecording, setIsRecording] = useState(false)
    const [recordingTime, setRecordingTime] = useState(0)
    const [audioUrl, setAudioUrl] = useState<string | null>(null)

    const mediaRecorderRef = useRef<MediaRecorder | null>(null)
    const chunksRef = useRef<Blob[]>([])
    const timerRef = useRef<NodeJS.Timeout | null>(null)

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (timerRef.current) clearInterval(timerRef.current)
            if (audioUrl) URL.revokeObjectURL(audioUrl)
        }
    }, [audioUrl])

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
            mediaRecorderRef.current = new MediaRecorder(stream)
            chunksRef.current = []

            mediaRecorderRef.current.ondataavailable = (e) => {
                if (e.data.size > 0) chunksRef.current.push(e.data)
            }

            mediaRecorderRef.current.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
                const url = URL.createObjectURL(blob)
                setAudioUrl(url)
                onRecordingComplete(blob)
                stream.getTracks().forEach(track => track.stop()) // Stop mic
            }

            mediaRecorderRef.current.start()
            setIsRecording(true)
            setRecordingTime(0)

            timerRef.current = setInterval(() => {
                setRecordingTime(prev => prev + 1)
            }, 1000)

        } catch (err) {
            console.error('Error accessing microphone:', err)
            alert('Could not access microphone. Please allow permissions.')
        }
    }

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop()
            setIsRecording(false)
            if (timerRef.current) clearInterval(timerRef.current)
        }
    }

    const deleteRecording = () => {
        setAudioUrl(null)
        setRecordingTime(0)
        chunksRef.current = []
    }

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    return (
        <div className="flex flex-col items-center gap-4 p-4 border rounded-xl bg-background-subtle">
            {audioUrl ? (
                <div className="w-full flex items-center gap-3">
                    <audio src={audioUrl} controls className="flex-1 h-10" />
                    <Button
                        type="button"
                        variant="danger"
                        size="icon"
                        onClick={deleteRecording}
                        className="h-10 w-10 shrink-0"
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            ) : (
                <div className="flex items-center gap-4">
                    {isRecording ? (
                        <>
                            <div className="flex items-center gap-2">
                                <span className="relative flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-error opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-error"></span>
                                </span>
                                <span className="font-mono text-error font-medium">{formatTime(recordingTime)}</span>
                            </div>
                            <Button
                                type="button"
                                variant="danger"
                                onClick={stopRecording}
                                className="animate-pulse"
                            >
                                <StopCircle className="mr-2 w-4 h-4" />
                                Stop Recording
                            </Button>
                        </>
                    ) : (
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={startRecording}
                        >
                            <Mic className="mr-2 w-4 h-4" />
                            Record Voice Message
                        </Button>
                    )}
                </div>
            )}
        </div>
    )
}
