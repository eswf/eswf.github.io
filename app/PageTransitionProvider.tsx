'use client'

import { ReactNode, useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'

export const FADE_DURATION_MS = 150

interface Props {
    children: ReactNode
}

export default function PageTransitionProvider({ children }: Props) {
    const router = useRouter()
    const pathname = usePathname()

    const [displayedPathname, setDisplayedPathname] = useState(pathname)
    const [isTransitioning, setIsTransitioning] = useState(false)
    const [content, setContent] = useState(children)

    useEffect(() => {
        if (pathname !== displayedPathname) {
            setIsTransitioning(true)
            const timeout = setTimeout(() => {
                setDisplayedPathname(pathname)
                setContent(children)
                setIsTransitioning(false)
            }, FADE_DURATION_MS)

            return () => clearTimeout(timeout)
        } else {
            setContent(children)
            setIsTransitioning(false)
        }
    }, [pathname, children, displayedPathname])

    return (
        <>
            <div
                id="page-wrapper"
                style={{
                    opacity: isTransitioning ? 0 : 1,
                    transition: `opacity ${FADE_DURATION_MS}ms linear`,
                    minHeight: '100vh',
                    position: 'relative',
                }}
            >
                {content}
            </div>

            {isTransitioning && (
                <div
                    style={{
                        position: 'fixed',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        fontSize: '1.5rem',
                        fontWeight: 'bold',
                        pointerEvents: 'none',
                        userSelect: 'none',
                        color: '#555',
                        zIndex: 9999,
                    }}
                >
                    Loading...
                </div>
            )}
        </>
    )
}
