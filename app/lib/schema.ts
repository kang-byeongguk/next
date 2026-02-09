import { z } from 'zod';




// 최소 8자, 소문자 1개, 대문자 1개, 숫자 1개 포함 정규식
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
const phoneRegex = /^[0-9\-\+\(\)\s]{10,20}$/;


export const productSchema = z.object({
  title: z.string().min(1, "제목을 입력해주세요."),
  // coerce: 문자열로 들어온 가격을 강제로 숫자로 변환해서 검증
  price: z.coerce.number().min(0, "가격은 0원 이상이어야 합니다."),
  description: z.string().optional(), // DB에서 NULL 허용은 아니지만 빈 문자열 가능
  category: z.string().min(1, "카테고리를 선택해주세요."),
  // 파일 검증: 파일 인스턴스인지, 그리고 사이즈가 0보다 큰지 확인
  image: z.instanceof(File).refine((file) => file.size > 0, "이미지 파일이 필요합니다."),
});

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