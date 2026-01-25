import NextAuth, { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  /**
   * Session의 user 객체에 스키마의 id와 role 추가
   */
  interface Session {
    user: {
      id: string;   // User.id
      role: string; // User.role
    } & DefaultSession["user"];
  }

  /**
   * User 객체 확장
   */
  interface User {
    id?: string;
    role?: string;
  }
}

declare module "next-auth/jwt" {
  /**
   * JWT 토큰에 id와 role 추가
   */
  interface JWT {
    id: string;
    role: string;
  }
}