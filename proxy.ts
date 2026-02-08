
import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import { NextResponse } from 'next/server';

const { auth } = NextAuth(authConfig);

export default auth(async (req) => {
  const { nextUrl } = req;
  const response = NextResponse.next();

  // 1. 이미 오늘 방문했는지 쿠키 확인
  const visitedCookie = req.cookies.get('visited_today');

  // 2. 쿠키가 없다면 (오늘 첫 방문)
  if (!visitedCookie) {
    try {
      // API 라우트로 요청 보내기 (비동기로 실행하여 사용자 대기 시간 최소화)
      // fetch는 Edge Runtime에서도 잘 작동합니다.
      fetch(`${nextUrl.origin}/api/visit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pathname: nextUrl.pathname }),
      }).catch((err) => console.error('Visit tracking failed:', err));

      // 3. '방문했음' 쿠키 설정 (자정까지만 유효하게 설정하거나 24시간 설정)
      response.cookies.set('visited_today', 'true', {
        maxAge: 60 * 60 * 24, // 24시간 유지
        httpOnly: true,
        path: '/',
      });
    } catch (e) {
      console.error('Middleware Error:', e);
    }
  }

  return response;
});

export const config = {
  // https://nextjs.org/docs/app/api-reference/file-conventions/proxy#matcher
  // static 파일, 이미지, API 등은 제외하고 실제 페이지 접속만 카운팅
  matcher: ['/((?!api|seed|_next/static|_next/image|.*\\.png$).*)'],
};