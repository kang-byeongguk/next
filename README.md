# [프로젝트 이름, 예: Coupang-Clone]

## 팀 구성
**1인 개인 프로젝트** (Full Stack Development)

## 한 줄 소개
Next.js App Router와 Server Actions를 활용하여 구현한 쿠팡 스타일의 이커머스 플랫폼

## 진행 기간
2025.12 ~ 2026.01 (진행 중)

## 목차
1. [간단 소개](#1-간단-소개)
2. [관련 링크](#2-관련-링크)
3. [기술 스택](#3-기술-스택)
4. [구현 기능](#4-구현-기능)
5. [트러블 슈팅](#5-트러블-슈팅)
6. [아키텍처](#6-아키텍처)
7. [주요 기능 이미지](#7-주요-기능-이미지)

---

### 1. 간단 소개
💡
이 프로젝트는 대규모 트래픽을 처리하는 커머스 사이트(쿠팡)의 UI/UX를 벤치마킹하여 제작한 포트폴리오 프로젝트입니다.
기존의 REST API 방식 대신 **Next.js 14(App Router)의 Server Actions**를 적극 도입하여 백엔드와 프론트엔드의 간극을 줄이고 생산성을 극대화했습니다. 
또한 **Serverless Postgres인 Neon DB**를 연동하여 효율적인 데이터 관리를 구현했으며, 웹 표준과 보안(Auth.js)을 고려한 풀스택 개발 역량을 쌓는 것을 목표로 했습니다.

### 2. 관련 링크
* **GitHub**: [깃허브 레포지토리 주소 입력]
* **배포 사이트**: [Vercel 등 배포 주소 입력]

### 3. 기술 스택

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

### 4. 구현 기능

* **인증/인가 (Auth)**
    * **NextAuth.js (v5)** 기반의 인증 시스템 구축
    * **Credentials Provider**: 이메일/비밀번호 회원가입 및 로그인 (bcrypt를 이용한 비밀번호 암호화)
    * **OAuth**: 카카오 소셜 로그인 연동 및 계정 연결 처리
    * **Security**: Zod 라이브러리를 활용한 회원가입 입력값 유효성 검사 (Server-side Validation)
    
* **상품 및 데이터 관리 (Server Actions & DB)**
    * **Neon (Serverless Postgres)** 데이터베이스 연동
    * **Server Actions**: 별도의 API Route 없이 서버 함수 직접 호출을 통한 CRUD 구현 (생산성 향상)
    * 상품 목록 조회, 상세 페이지 렌더링 (SSR 기반 최적화)
    
* **UI/UX**
    * **Tailwind CSS & DaisyUI**: 유틸리티 클래스 기반의 신속한 UI 스타일링 및 반응형 웹 구현
    * 쿠팡 스타일의 직관적인 GNB(Global Navigation Bar) 및 상품 레이아웃 구성

### 5. 문제점 & 해결 방법 (Troubleshooting)

**1. Server Actions와 클라이언트 컴포넌트 간의 데이터 통신**
* **문제**: Server Component에서 가져온 데이터를 Client Component로 전달할 때 직렬화(Serialization) 이슈 및 타입 불일치 발생
* **해결**: 데이터 Fetching 로직을 Server Actions로 모듈화하고, 필요한 경우 직렬화 가능한 형태로 데이터를 가공하여 Props로 전달. 비동기 상태 관리를 위해 `useTransition` 훅 활용.

**2. 소셜 로그인과 기존 계정 통합 이슈**
* **문제**: 동일한 이메일을 가진 사용자가 소셜 로그인 시도 시 DB 처리 모호성 발생
* **해결**: NextAuth의 Adapter 패턴을 활용하여 Account 테이블과 User 테이블을 분리하고, 이메일 중복 시 계정 연동 로직을 커스텀하여 해결.

**3. Neon DB 연결 최적화**
* **문제**: Serverless 환경에서 잦은 DB 연결로 인한 Latency 발생 우려
* **해결**: Neon의 Connection Pooling 기능을 활용하고, 불필요한 호출을 줄이기 위해 데이터 캐싱 전략(Next.js Cache) 도입 고려.

### 6. 아키텍처
* **Frontend**: Next.js 14 (App Router)
* **Backend Logic**: Next.js Server Actions
* **Database**: Neon (PostgreSQL)
* **Deployment**: Vercel

### 7. 주요 기능 이미지
*(프로젝트의 실제 스크린샷을 이곳에 `![설명](이미지경로)` 형태로 첨부해주세요)*
* 메인 페이지
* 로그인/회원가입 화면
* 상품 상세 페이지
