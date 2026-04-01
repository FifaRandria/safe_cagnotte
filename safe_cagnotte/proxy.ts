// import { auth } from "@/auth"
// import { NextResponse } from "next/server"
// import type { NextRequest } from "next/server"

// export async function proxy(request: NextRequest) {
//   const session = await auth()
//   const isLoggedIn = !!session
//   const isAuthPage = request.nextUrl.pathname.startsWith("/login")
//   const isPublicPage = request.nextUrl.pathname.startsWith("/public")

//   if (!isLoggedIn && !isAuthPage && !isPublicPage) {
//     return NextResponse.redirect(new URL("/login", request.url))
//   }

//   return NextResponse.next()
// }

// export const config = {
//   matcher: ["/((?!api|_next/static|_next/image|favicon.ico|login).*)"],
// }


import { auth } from "@/auth"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function proxy(request: NextRequest) {
  const session = await auth()
  const isLoggedIn = !!session
  const isAuthPage = request.nextUrl.pathname.startsWith("/login") 
                  || request.nextUrl.pathname.startsWith("/register")
  const isPublicPage = request.nextUrl.pathname.startsWith("/public")

  if (!isLoggedIn && !isAuthPage && !isPublicPage) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}