# NextCart

> Next.js 16 App Router와 Server Actions를 활용한 이커머스 플랫폼

## 프로젝트 정보

**개발 기간:** 2025.12 ~ 2026.02  
**개발 인원:** 1인 (Full Stack)

## 링크

- **배포 사이트:** https://next-6ew1.vercel.app
- **GitHub:** https://github.com/kang-byeongguk/next

## 목차

1. [프로젝트 소개](#프로젝트-소개)
2. [기술 스택](#기술-스택)
3. [아키텍처](#아키텍처)
4. [주요 기능](#주요-기능)
5. [트러블 슈팅](#트러블-슈팅)
6. [화면 구성](#화면-구성)

---

## 프로젝트 소개

Next.js App Router와 Server Actions를 활용한 이커머스 플랫폼입니다.  
REST API 대신 Server Actions를 사용하여 서버 로직을 구현했으며, Neon DB(Serverless Postgres)와 NextAuth를 통해 데이터 관리 및 인증 기능을 구현했습니다.

## 기술 스택

**Environment**  
![Visual Studio Code](https://img.shields.io/badge/Visual%20Studio%20Code-007ACC?style=for-the-badge&logo=Visual%20Studio%20Code&logoColor=white)
![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=Git&logoColor=white)
![Github](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=GitHub&logoColor=white)

**Development**  
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=Next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=TypeScript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![DaisyUI](https://img.shields.io/badge/DaisyUI-5A0EF8?style=for-the-badge&logo=daisyui&logoColor=white)

**Database & Auth**  
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Neon](https://img.shields.io/badge/Neon-00E599?style=for-the-badge&logo=neon&logoColor=black)
![NextAuth](https://img.shields.io/badge/NextAuth.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)

**Deployment**  
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

## 아키텍처

### 시스템 구조도

<img width="2816" alt="시스템 아키텍처" src="https://github.com/user-attachments/assets/3681d6bc-e0fb-4c6f-9964-ca09a1f65ad9" />

- **Frontend:** Next.js 16 (App Router)
- **Backend:** Next.js Server Actions
- **Database:** Neon (PostgreSQL)
- **Deployment:** Vercel

### 페이지 구조도

<img width="2638" alt="페이지 구조도" src="https://github.com/user-attachments/assets/27c22f98-66b7-4620-b6e8-45f87657b9d6" />

## 주요 기능

### 인증/인가

- NextAuth.js v5 기반 인증 시스템
- Credentials Provider를 통한 이메일/비밀번호 로그인 (bcrypt 암호화)
- 카카오 OAuth 소셜 로그인 연동
- Zod를 활용한 서버 측 입력값 검증

### 상품 및 데이터 관리

- Neon Serverless Postgres 데이터베이스 연동
- Server Actions를 통한 CRUD 구현 (API Route 불필요)
- SSR 기반 상품 목록 및 상세 페이지 렌더링

### UI/UX

- Tailwind CSS 및 DaisyUI 기반 반응형 디자인
- 다크모드 지원
- Suspense를 활용한 로딩 UI

## 트러블 슈팅

### 1. Server Actions와 클라이언트 컴포넌트 간 데이터 통신

**문제**  
Server Component에서 가져온 데이터를 Client Component로 전달 시 직렬화 이슈 및 타입 불일치 발생

**해결**  
- 데이터 Fetching 로직을 Server Actions로 모듈화
- 직렬화 가능한 형태로 데이터 가공 후 Props 전달
- `useTransition` 훅을 활용한 비동기 상태 관리

### 2. 소셜 로그인과 기존 계정 통합

**문제**  
동일 이메일을 가진 사용자의 소셜 로그인 시도 시 DB 처리 모호성 발생

**해결**  
- NextAuth Adapter 패턴을 활용하여 Account와 User 테이블 분리
- 이메일 중복 시 계정 연동 로직 커스터마이징

### 3. Neon DB 연결 최적화

**문제**  
Serverless 환경에서 잦은 DB 연결로 인한 Latency 우려

**해결**  
- Neon의 Connection Pooling 기능 활용
- Next.js Cache를 통한 데이터 캐싱 전략 도입

## 화면 구성

<table>
  <tr>
    <th>홈 화면 (Desktop)</th>
    <th>홈 화면 (Mobile)</th>
    <th>다크모드</th>
    <th>Suspense UI</th>
  </tr>
  <tr>
    <td><img src="https://github.com/user-attachments/assets/61d7fb1f-96ed-4b97-8d74-29516eb3fb49" alt="홈 화면 Desktop" /></td>
    <td><img src="https://github.com/user-attachments/assets/751f7d23-a7d0-4bc0-9bc6-1e48fda2f350" alt="홈 화면 Mobile" /></td>
    <td><img src="https://github.com/user-attachments/assets/f0a40b47-e57e-4100-9222-2641235de830" alt="다크모드" /></td>
    <td><img src="https://github.com/user-attachments/assets/acbb3bad-6fd3-4b5c-989c-66faecf0bc6d" alt="Suspense UI" /></td>
  </tr>
</table>

<table>
  <tr>
    <th>상품 리스트 (Desktop)</th>
    <th>상품 리스트 (Mobile)</th>
    <th>상품 상세 (Desktop)</th>
    <th>상품 상세 (Mobile)</th>
  </tr>
  <tr>
    <td><img src="https://github.com/user-attachments/assets/13ada92e-c722-46a8-9d90-e7aa07c1d856" alt="상품 리스트 Desktop" /></td>
    <td><img src="https://github.com/user-attachments/assets/65e8ec16-6a6e-4203-9642-a2b74c9767d5" alt="상품 리스트 Mobile" /></td>
    <td><img src="https://github.com/user-attachments/assets/ca477088-391a-4a4d-b681-9fc0826ed23a" alt="상품 상세 Desktop" /></td>
    <td><img src="https://github.com/user-attachments/assets/f830e499-8911-43bc-8c03-7580891f8b3c" alt="상품 상세 Mobile" /></td>
  </tr>
</table>

<table>
  <tr>
    <th>장바구니 (Desktop)</th>
    <th>장바구니 (Mobile)</th>
    <th>주소 입력 (Desktop)</th>
    <th>주소 입력 (Mobile)</th>
  </tr>
  <tr>
    <td><img src="https://github.com/user-attachments/assets/8eb4c163-1c2d-4c78-b55d-d001c4366ca8" alt="장바구니 Desktop" /></td>
    <td><img src="https://github.com/user-attachments/assets/2a0c1811-15db-46a0-b6c6-ecc5a8e7ec88" alt="장바구니 Mobile" /></td>
    <td><img src="https://github.com/user-attachments/assets/1b9288ef-2007-4d82-8d8d-5bd92665540c" alt="주소 입력 Desktop" /></td>
    <td><img src="https://github.com/user-attachments/assets/43de6f7e-caf8-4058-bc9a-10496799ba73" alt="주소 입력 Mobile" /></td>
  </tr>
</table>

<table>
  <tr>
    <th>주문내역 (Desktop)</th>
    <th>주문내역 (Mobile)</th>
    <th>로그인 (Desktop)</th>
    <th>로그인 (Mobile)</th>
  </tr>
  <tr>
    <td><img src="https://github.com/user-attachments/assets/a8b6db73-3b80-4eb8-ba2c-d09fedeb39de" alt="주문내역 Desktop" /></td>
    <td><img src="https://github.com/user-attachments/assets/420f66d8-653a-4ee1-b4bf-b818f85ac17e" alt="주문내역 Mobile" /></td>
    <td><img src="https://github.com/user-attachments/assets/2162d546-08d1-4c45-8845-f7df7d2f3dd5" alt="로그인 Desktop" /></td>
    <td><img src="https://github.com/user-attachments/assets/eabaf0af-93c4-4236-8ba6-0c1c0c27a289" alt="로그인 Mobile" /></td>
  </tr>
</table>
