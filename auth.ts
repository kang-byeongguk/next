import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { getUser, sql } from './app/lib/data';
import { SignSchema } from './app/lib/schema';
import Kakao from 'next-auth/providers/kakao';

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Kakao,
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = SignSchema.safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await getUser(email);

          if (!user || !user.password) return null;

          const passwordsMatch = await bcrypt.compare(password, user.password);
          if (passwordsMatch) return user;
        }

        console.log('Invalid credentials');
        return null;
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'credentials') return true;

    
      const uniqueId = account?.providerAccountId ?? user.id;

      if (account?.provider === 'kakao' && !uniqueId) {
        console.error("카카오 고유 ID를 찾을 수 없습니다.");
        return false;
      }

      if (!user.email) {
        user.email = `${uniqueId}@kakao.local`;
      }

      try {
        const existingUser = await getUser(user.email);
        if (existingUser) {
          return true;
        } else {
          const provider = account?.provider || 'oauth';
          await sql`
            INSERT INTO users (email, name, image, provider, role)
            VALUES (${user.email}, ${user.name ?? '사용자'}, ${user.image ?? null}, ${provider}, 'user')
          `;
          return true;
        }
      } catch (error) {
        console.error('Social Login Error:', error);
        return false;
      }
    },

    async jwt({ token, user, account }) {
      // [수정] 로그인 시점(account 존재)에만 정확한 이메일 재구성이 가능함
      if (user && account?.provider === 'kakao') {
        
        // signIn에서 만든 로직과 동일하게 고유번호로 이메일 추출
        const uniqueId = account.providerAccountId ?? user.id;
        const fakeEmail = `${uniqueId}@kakao.local`;

        try {
          // user.email이 null일 수 있으므로 재구성한 fakeEmail로 조회
          const dbUser = await getUser(user.email ?? fakeEmail);
          
          if (dbUser) {
            token.id = dbUser.id;     // DB의 UUID (users 테이블의 id)
            token.role = dbUser.role; // DB의 권한
          }
        } catch (error) {
          console.error('JWT User Fetch Error:', error);
        }
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role=token.role??'user';
      }
      return session;
    },
  },
});