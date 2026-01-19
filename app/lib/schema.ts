import { z } from 'zod';

// 최소 8자, 소문자 1개, 대문자 1개, 숫자 1개 포함 정규식
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

export const SignSchema = z.object({
  email: z.email({ message: "Enter valid email address" }).trim(),
  password: z
    .string()
    .regex(passwordRegex, {
      message: "Must be more than 8 characters, including\n at least one number, one lowercase, one uppercase letter",
    }).trim(),
});