import { z } from 'zod';

// export const SignInSchema = z.object({
//   email: z.email({ message: "Enter valid email address" }),
//   password: z
//     .string()
//     .min(8, { message: "Be at least 8 characters long" })
//     .regex(/[a-z]/, { message: "Contain at least one lowercase letter" })
//     .regex(/[A-Z]/, { message: "Contain at least one uppercase letter" })
//     .regex(/[0-9]/, { message: "Contain at least one number" }),
// });

// 최소 8자, 소문자 1개, 대문자 1개, 숫자 1개 포함 정규식
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

export const SignInSchema = z.object({
  email: z.email({ message: "Enter valid email address" }),
  password: z
    .string()
    .regex(passwordRegex, {
      message: "Must be more than 8 characters, including\n at least one number, one lowercase, one uppercase letter",
    }),
});