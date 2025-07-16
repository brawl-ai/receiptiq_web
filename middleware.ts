import { NextRequest, NextResponse } from 'next/server'

export const config = {
    matcher: [
        '/projects/:path*',
    ]
}

const isAuthenticated = (request: NextRequest) => {
    return request.cookies.get("access_token") ? true : false
}

export function middleware(request: NextRequest) {
    if (!isAuthenticated(request)) {
        console.log("middleware.ts isAuthenticated:false")
        const loginUrl = new URL('/login', request.url)
        loginUrl.searchParams.set('redirect', request.nextUrl.pathname)
        return NextResponse.redirect(loginUrl)
    } else {
        console.log("middleware.ts isAuthenticated:true")
        return NextResponse.next()
    }
}