import NextAuth from 'next-auth'
import GitHub from 'next-auth/providers/github'

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID!,
      clientSecret: process.env.AUTH_GITHUB_SECRET!,
    }),
  ],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      if (nextUrl.pathname === '/admin/login') return true
      return !!auth?.user
    },
    async signIn({ profile }) {
      const adminUsername = process.env.ADMIN_GITHUB_USERNAME
      if (!adminUsername) return false
      return (profile as { login?: string })?.login === adminUsername
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          login: token.login as string,
        },
      }
    },
    async jwt({ token, profile }) {
      if (profile) {
        token.login = (profile as { login?: string }).login
      }
      return token
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60,
  },
  pages: {
    signIn: '/admin/login',
    error: '/admin/login',
  },
})
