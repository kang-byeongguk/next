import type { NextAuthConfig } from 'next-auth';
 
export const authConfig = {
  pages: {
    signIn: '/signin',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      if (isLoggedIn){
        if (nextUrl.pathname==='/signin'||nextUrl.pathname==='/signup') {
            return Response.redirect(new URL('/',nextUrl))
        }
        return true

      }else{
        if (nextUrl.pathname==='/signin'||nextUrl.pathname==='/signup'||nextUrl.pathname==='/'||nextUrl.pathname.startsWith('/product')) {
            return true}
        return false
      }

    },
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;