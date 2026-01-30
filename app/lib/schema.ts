import { z } from 'zod';

// 최소 8자, 소문자 1개, 대문자 1개, 숫자 1개 포함 정규식
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
const phoneRegex = /^[0-9\-\+\(\)\s]{10,20}$/;

export const SignSchema = z.object({
  email: z.email({ message: "Enter valid email address" }).trim(),
  password: z
    .string()
    .regex(passwordRegex, {
      message: "Must be more than 8 characters, including\n at least one number, one lowercase, one uppercase letter",
    }).trim(),
});

export const AddressSchema = z.object({
  fullName: z.string().min(2, { message: "Name must be at least 2 characters long." }),
  phoneNumber: z.string().regex(phoneRegex, { message: "Please enter a valid phone number." }),
  pinCode: z.string().min(4, { message: "Invalid Zip/Pin code." }),
  addressDetail: z.string().min(5, { message: "Address is too short. Please provide details." }),
  city: z.string().min(1, { message: "City is required." }),
  state: z.string().min(1, { message: "State is required." }),
});

export const idSchema = z.uuid();