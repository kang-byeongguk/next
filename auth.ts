import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { getUser } from './app/lib/data';
import { SignInSchema } from './app/lib/schema';



export const { auth, signIn, signOut } = NextAuth({
    ...authConfig,
    providers: [Credentials({
        async authorize(credentials) {
            const parsedCredentials = SignInSchema.safeParse(credentials);

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

