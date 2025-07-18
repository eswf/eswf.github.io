'use client'

import { AnchorHTMLAttributes } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { FADE_DURATION_MS } from '@/app/PageTransitionProvider'  // adjust path if needed

interface FadeLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
    href: string
    children: React.ReactNode
}

export default function FadeLink({ href, children, ...props }: FadeLinkProps) {
    const router = useRouter()
    const pathname = usePathname() // get current path

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        // If the href matches current pathname, do nothing
        if (href === pathname || (href === '' && pathname === '/')) {
            e.preventDefault()
            return
        }

        e.preventDefault()
        const pageWrapper = document.getElementById('page-wrapper')

        const navigate = () => {
            if (href === 'BACK') {
                router.back()
            } else {
                router.push(href)
            }
        }

        if (pageWrapper) {
            pageWrapper.style.opacity = '0'
            setTimeout(() => {
                navigate()
            }, FADE_DURATION_MS)
        } else {
            navigate()
        }
    }

    // Optionally show pointer cursor only if clickable
    const isCurrent = href === pathname || (href === '' && pathname === '/')

    return (
        <a
            href={href}
            {...props}
            onClick={handleClick}
            style={{ cursor: isCurrent ? 'default' : 'pointer', pointerEvents: isCurrent ? 'none' : 'auto' }}
            aria-current={isCurrent ? 'page' : undefined}
        >
            {children}
        </a>
    )
}
