import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { getUser } from './app/lib/data';
import { SignSchema } from './app/lib/schema';
import Kakao from 'next-auth/providers/kakao';



export const { handlers,auth, signIn, signOut } = NextAuth({
    ...authConfig,
    providers: [Kakao,Credentials({
        async authorize(credentials) {
            const parsedCredentials = SignSchema.safeParse(credentials);

            if (parsedCredentials.success) {
                const { email, password } = parsedCredentials.data;
                const user = await getUser(email)
                if (!user || !user.password) return null;
                const passwordsMatch = await bcrypt.compare(password, user.password)

                if (passwordsMatch) return user;
            }
            console.log('Invalid credentials');
            return null
        }
    })],
});

