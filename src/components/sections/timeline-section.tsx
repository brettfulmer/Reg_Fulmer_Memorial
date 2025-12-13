'use client'

import { motion } from 'framer-motion'
import { Calendar, Heart, Home, Star, Baby, Briefcase } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface TimelineEvent {
    year: string
    title: string
    description: string
    icon: React.ElementType
}

const TIMELINE_EVENTS: TimelineEvent[] = [
    {
        year: '1942',
        title: 'A Life Begins',
        description: 'Born on November 26th. The beginning of a journey that would touch so many hearts.',
        icon: Baby,
    },
    {
        year: 'Early Years',
        title: 'Growing up in Maroubra',
        description: 'Spent his formative years by the ocean, developing a lifelong love for the surf and sand.',
        icon: Home,
    },
    {
        year: 'Career',
        title: 'Hard Work & Dedication',
        description: 'Known for his strong work ethic and dry humour, making colleagues into lifelong friends.',
        icon: Briefcase,
    },
    {
        year: 'Family',
        title: 'Building a Legacy',
        description: 'A devoted family man who cherished every moment with his loved ones.',
        icon: Heart,
    },
    {
        year: '2025',
        title: 'Rest in Peace',
        description: 'December 10th. Leaving behind a legacy of love, laughter, and loyalty. Forever in our hearts.',
        icon: Star,
    },
]

export function TimelineSection() {
    return (
        <section className="section overflow-hidden">
            <div className="container-narrow">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="font-serif text-display-sm md:text-display-md text-foreground mb-4">
                        Reg's Journey
                    </h2>
                    <p className="text-body-md text-foreground-muted">
                        Celebrating the milestones of a life well lived.
                    </p>
                </motion.div>

                <div className="relative">
                    {/* Vertical Line */}
                    <div className="absolute left-4 md:left-1/2 top-4 bottom-4 w-px bg-gradient-to-b from-accent-gold/0 via-accent-gold/50 to-accent-gold/0 bg-border" />

                    <div className="space-y-12">
                        {TIMELINE_EVENTS.map((event, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.7, delay: index * 0.1 }}
                                className={cn(
                                    "relative flex flex-col md:flex-row gap-8 md:gap-0",
                                    index % 2 === 0 ? "md:flex-row-reverse" : ""
                                )}
                            >
                                {/* Content Side */}
                                <div className="flex-1 md:w-1/2 flex md:items-center">
                                    <div className={cn(
                                        "flex-1",
                                        index % 2 === 0 ? "md:text-left md:pr-12" : "md:text-right md:pl-12",
                                        "pl-12 md:pl-0" // Mobile padding for line
                                    )}>
                                        <Card variant="glass" className="p-6 relative group hover:bg-background-elevated/50 transition-colors">
                                            <span className="inline-block px-3 py-1 rounded-full bg-accent-gold/10 text-accent-gold text-sm font-medium mb-3">
                                                {event.year}
                                            </span>
                                            <h3 className="font-serif text-heading-md mb-2">{event.title}</h3>
                                            <p className="text-foreground-muted">{event.description}</p>
                                        </Card>
                                    </div>
                                </div>

                                {/* Center Icon */}
                                <div className="absolute left-4 md:left-1/2 -translate-x-1/2 flex items-center justify-center">
                                    <div className="w-10 h-10 rounded-full bg-background border-4 border-background-subtle relative z-10 flex items-center justify-center shadow-elevated">
                                        <event.icon className="w-5 h-5 text-accent-gold" />
                                    </div>
                                </div>

                                {/* Empty Side (Desktop) */}
                                <div className="hidden md:block md:w-1/2" />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
