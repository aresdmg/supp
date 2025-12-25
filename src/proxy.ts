import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
    const path = request.nextUrl.pathname
    const isPublicPath = path == "/" || path == "/auth/sign-up" || path === "/auth/sign-in"

    const accessToken = request.cookies.get("accessToken")?.value || ''

    if (!isPublicPath && !accessToken) {
        return NextResponse.redirect(new URL('/auth/sign-in', request.url))
    }

    if (isPublicPath && accessToken) {
        return NextResponse.redirect(new URL('/chats', request.url))
    }
}

export const config = {
    matcher: [
        "/",
        "/auth/:path",
        "/chats"
    ],
}