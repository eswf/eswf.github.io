'use client'

import { AnchorHTMLAttributes } from 'react'
import { useRouter } from 'next/navigation'
import { FADE_DURATION_MS } from '@/app/PageTransitionProvider'  // adjust path if needed

interface FadeLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
    href: string
    children: React.ReactNode
}

export default function FadeLink({ href, children, ...props }: FadeLinkProps) {
    const router = useRouter()

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault()
        const pageWrapper = document.getElementById('page-wrapper')
        if (pageWrapper) {
            pageWrapper.style.opacity = '0'
            setTimeout(() => {
                router.push(href)
            }, FADE_DURATION_MS)
        } else {
            router.push(href)
        }
    }

    return (
        <a href={href} {...props} onClick={handleClick} style={{ cursor: 'pointer' }}>
            {children}
        </a>
    )
}
