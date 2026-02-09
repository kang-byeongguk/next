# NextCart

> Next.js 16 App Router와 Server Actions를 활용한 이커머스 플랫폼

## 프로젝트 정보

**개발 기간:** 2025.12 ~ 2026.02  
**개발 인원:** 1인 (Next.js 기반 프런트엔드, 백엔드 통합 개발)

## 링크

- **배포 사이트:** https://next-6ew1.vercel.app
- **GitHub:** https://github.com/kang-byeongguk/next

---

## 목차

1. [시연 영상](#시연-영상)
2. [프로젝트 소개](#프로젝트-소개)
3. [기술 스택](#기술-스택)
4. [아키텍처](#아키텍처)
5. [주요 기능 구현](#주요-기능-구현)
6. [트러블 슈팅](#트러블-슈팅)
7. [기타 기술 적용 사항](#기타-기술-적용-사항)
8. [화면 구성](#화면-구성)

---

## 시연 영상
https://github.com/user-attachments/assets/e4a9a3f3-5a52-4c72-9f78-56828f4d400c

---

## 프로젝트 소개

Next.js App Router와 Server Actions를 활용한 이커머스 플랫폼입니다.  
REST API 대신 Server Actions를 사용하여 서버 로직을 구현했으며, Neon DB(Serverless Postgres)와 NextAuth를 통해 데이터 관리 및 인증 기능을 구현했습니다.

---

## 기술 스택

### Environment  
![Visual Studio Code](https://img.shields.io/badge/Visual%20Studio%20Code-007ACC?style=for-the-badge&logo=Visual%20Studio%20Code&logoColor=white)
![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=Git&logoColor=white)
![Github](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=GitHub&logoColor=white)

### Development  
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=Next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=TypeScript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![DaisyUI](https://img.shields.io/badge/DaisyUI-5A0EF8?style=for-the-badge&logo=daisyui&logoColor=white)

### Database & Auth  
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Neon](https://img.shields.io/badge/Neon-00E599?style=for-the-badge&logo=neon&logoColor=black)
![NextAuth](https://img.shields.io/badge/NextAuth.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)

### Deployment  
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

---

## 아키텍처

### 시스템 구조도

<img width="2816" alt="시스템 아키텍처" src="https://github.com/user-attachments/assets/3681d6bc-e0fb-4c6f-9964-ca09a1f65ad9" />

- **Frontend:** Next.js 16 (App Router)
- **Backend:** Next.js Server Actions
- **Database:** Neon (PostgreSQL)
- **Deployment:** Vercel

### 페이지 구조도

<img width="2638" alt="페이지 구조도" src="https://github.com/user-attachments/assets/27c22f98-66b7-4620-b6e8-45f87657b9d6" />

---

## 주요 기능 구현

### 1. URL 기반 실시간 필터링 시스템
- `useSearchParams`, `useRouter`를 활용한 URL 상태 동기화 구현
- debounce(300ms)로 불필요한 서버 요청 최소화

### 2. NextAuth 멀티 인증 시스템
- Credentials Provider: 이메일/비밀번호 로그인 (bcrypt 암호화)
- OAuth Provider: 카카오 소셜 로그인
- Proxy(Middleware)를 활용한 보호된 라우트 접근 제어

### 3. 커스텀 UI 컴포넌트 라이브러리
- 라이브러리 없이 직접 구현한 컴포넌트
  - 캐러셀 (터치/드래그 지원)
  - 드롭다운 셀렉트
  - 페이지네이션
- 재사용 가능한 컴포넌트 설계 및 Props 인터페이스 정의

### 4. useActionState 기반 실시간 폼 검증
- Server Actions와 `useActionState`를 결합한 폼 검증 시스템
- 서버 측 에러 메시지를 클라이언트에서 실시간 표시
- 로그인, 주소 입력 등 다양한 폼에 적용

### 5. Chart.js 기반 관리자 대시보드
- **일별 판매 분석 차트**
  - 최근 일주일 상품 판매 개수 및 판매액 시각화
  - Line/Bar Chart로 일별 트렌드 파악
- **카테고리별 판매 분석**
  - 도넛 차트를 활용한 카테고리별 총 판매량 비율 표시
- **주간 성과 지표 카드**
  - 전주 대비 방문자 수, 상품 판매 개수, 판매 총액 증감률 표시
  - 이번 주 실시간 지표 현황 제공

### 6. 판매자 상품 등록 시스템
- **폼 기반 상품 등록**
  - 이미지, 제목, 설명, 가격, 카테고리 입력 폼 구현
  - 유효성 검증을 통한 데이터 무결성 보장
- **Vercel Blob 이미지 업로드**
  - 상품 이미지 파일을 Vercel Blob 스토리지에 저장
  - 업로드 전 이미지 미리보기 기능 (State 기반)
  - 최적화된 이미지 URL 자동 생성

---

## 트러블 슈팅

<details>
<summary><b>1. 다크모드 FOUC(깜빡임) 문제 해결</b></summary>

### 문제 상황
![ezgif-884ed5c743835f05](https://github.com/user-attachments/assets/d5aab63e-3250-4bf8-961b-c1a9db4f16db)

다크모드 설정을 localStorage로 관리했습니다. 페이지 새로고침 시 라이트 모드가 먼저 표시된 후 다크 모드로 전환되는 깜빡임이 발생했습니다. SSR은 localStorage에 접근할 수 없고, useEffect는 초기 렌더링 이후 실행되기 때문에 hydration 후에야 다크모드가 적용되었습니다.

### 해결 방법
HTML 파싱 단계에서 동기 스크립트가 실행되도록 `<script dangerouslySetInnerHTML>`을 추가했습니다. 이 스크립트는 localStorage를 읽어 React가 실행되기 전에 `<html>` 태그에 `data-theme` 속성을 설정합니다. 브라우저가 첫 Paint 단계에서부터 다크모드를 적용하도록 개선했습니다.

### 학습 내용
- 브라우저 렌더링 파이프라인(HTML 파싱 → CSSOM 생성 → Render Tree → Paint) 이해
- SSR/CSR의 차이와 hydration 시점 학습
- 성능 최적화를 위한 스크립트 실행 타이밍 제어 방법 습득

</details>

<details>
<summary><b>2. NextAuth 세션 상태 동기화 문제</b></summary>

### 문제 상황
![로그인시세션정보딜레이](https://github.com/user-attachments/assets/c6a631c8-3666-4a28-833e-7cab765dbbfe)

첫 로그인 성공 시 쿠키에는 세션 토큰이 저장되지만 `useSession()`이 null을 반환했습니다. 새로고침 후에는 정상적으로 세션 정보가 로드되었습니다. SessionProvider가 클라이언트 메모리(React State)에 세션을 캐싱하는데, 첫 로그인 시 쿠키에서 메모리로의 동기화가 자동으로 이루어지지 않았습니다.

### 해결 방법
`useSession()`의 `update()` 함수를 `useEffect`와 결합하여 세션을 강제로 갱신했습니다. 세션이 없거나 로딩 중일 때 서버에 쿠키를 전송하여 세션 데이터를 요청합니다. 

### 학습 내용
- NextAuth의 세션 관리 메커니즘(쿠키 저장소 ↔ React State 캐시) 이해
- HttpOnly 쿠키의 보안 특성(클라이언트 JavaScript 접근 불가) 학습
- 클라이언트-서버 간 세션 동기화 전략 습득

</details>

<details>
<summary><b>3. 수량 입력 debounce 엣지 케이스 처리</b></summary>

### 문제 상황
장바구니 수량을 타이핑으로 변경할 때 UX 향상을 위해 debounce를 적용했습니다. 사용자가 수량을 전체 삭제하면 빈 문자열(`""`)이 전송되어 상품이 삭제되는 버그가 발생했습니다. `Number.isNaN`으로 빈 값을 차단한 후에는 "10"을 "3"으로 변경할 때 "10"을 지우면 마지막 성공값 "1"로 자동 복원되는 새로운 버그가 발생했습니다.

### 해결 방법
빈 문자열 입력 시 `debounce.cancel()`을 호출하여 대기 중인 모든 요청을 취소했습니다. 추가로 엣지 케이스 처리를 위해 `Number.isNaN()`과 `parseInt()`로 숫자가 아닌 입력을 차단했습니다. `onBlur` 이벤트에서 유효하지 않은 값이면 수정 전 원본 데이터로 복원하도록 했습니다. 사용자가 입력을 완료할 때까지 UI 상태를 유지했습니다.

### 학습 내용
- debounce의 내부 동작 원리와 `cancel()` 메서드 활용법 습득
- 사용자 입력 패턴 분석 및 UX 시나리오 설계 능력 향상
- 엣지 케이스를 단계적으로 발견하고 해결하는 문제 해결 프로세스 체득

</details>

<details>
<summary><b>4. LCP 60% 개선을 통한 초기 로딩 성능 최적화</b></summary>

### 문제 상황
Lighthouse 성능 점수가 낮았고, LCP(Largest Contentful Paint)가 3.2초로 목표치(2.5초)를 초과했습니다. 큰 이미지 파일, 순차적 API 요청(waterfall), 폰트 로딩 지연이 주요 원인이었습니다.

### 해결 방법
**이미지 최적화**
- `next/image`의 `priority` 속성을 LCP 요소에 적용
- `sizes` 속성으로 반응형 이미지 크기 최적화
- WebP 포맷 자동 변환 활용

**폰트 최적화**
- `next/font`로 폰트 파일 사전 로드 및 서브셋 적용

**API 요청 병렬화**
- 순차적 `await` 호출을 `Promise.all()`로 변경하여 waterfall 제거

**Suspense 활용**
- Below-the-fold 콘텐츠에 Suspense를 적용하여 LCP가 아닌 요소 지연 로딩

**SSR 최대 활용**
- Server Component로 데이터 페칭하여 클라이언트 로딩 시간 단축

### 학습 내용
- Web Vitals 지표(LCP, FCP, TBT) 측정 및 개선 방법론 학습
- Chrome DevTools Performance/Network 탭을 활용한 병목 지점 분석
- Next.js의 이미지/폰트 최적화 기능 실전 활용
- 결과: LCP 3.2s → 1.3s (60% 개선)

</details>

---

## 기타 기술 적용 사항

- Next.js 예외 처리 페이지 구현 (loading.tsx, error.tsx, not-found.tsx)
- Zod를 활용한 서버 측 입력값 검증
- bcryptjs를 통한 비밀번호 암호화
- Tailwind CSS 기반 반응형 디자인
- react-hot-toast를 활용한 사용자 알림 시스템
- Chart.js를 활용한 데이터 시각화
- Vercel Blob 스토리지를 통한 이미지 파일 관리

---

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
