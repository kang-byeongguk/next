'use client'
import { useEffect, useState } from "react";

export default function ThemeController() {
  const [isdark, setIsdark] = useState(false);

  // 1. 마운트 시점: 현재 HTML에 적용된 테마가 무엇인지 확인하여 스위치 상태 동기화
  useEffect(() => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    setIsdark(currentTheme === 'forest');
  }, []);

  // 2. 토글 핸들러: 사용자가 클릭했을 때 실행
  const toggleTheme = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    setIsdark(isChecked);

    if (isChecked) {
      document.documentElement.setAttribute('data-theme', 'forest');
      localStorage.setItem('theme', 'forest');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <label className="toggle text-base-content ml-1.5 cursor-pointer ">
      {/* DaisyUI의 theme-controller 클래스는 CSS만으로 테마를 바꾸려 시도하므로,
         직접 JS로 제어하기 위해 해당 클래스를 제거하거나 충돌나지 않게 주의해야 합니다.
         여기서는 state와 JS로 명시적 제어를 하므로 theme-controller 클래스는 빼도 됩니다.
         하지만 스타일 유지를 위해 남겨둔다면 value 속성은 제거하는 게 안전합니다.
      */}
      <input 
        type="checkbox" 
        className="theme-controller" 
        checked={isdark} 
        onChange={toggleTheme} 
        // value="forest" <- 이 부분은 제거하거나 무시됩니다 (JS로 직접 setAttribute 하므로)
      />

      <svg aria-label="sun" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2"></path><path d="M12 20v2"></path><path d="m4.93 4.93 1.41 1.41"></path><path d="m17.66 17.66 1.41 1.41"></path><path d="M2 12h2"></path><path d="M20 12h2"></path><path d="m6.34 17.66-1.41 1.41"></path><path d="m19.07 4.93-1.41 1.41"></path></g></svg>

      <svg aria-label="moon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" fill="none" stroke="currentColor"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path></g></svg>

    </label>
  );
}