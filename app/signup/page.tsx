import Link from "next/link";

export default function Signup() {
    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-base-100 p-4">

            {/* 카드 컨테이너 */}
            <div className="w-full max-w-100 bg-base-100 rounded-2xl shadow-2xl border border-base-200 overflow-hidden transition-all duration-300 ease-in-out">

                <div className="p-10 flex flex-col w-full">

                    {/* 1. 헤더 */}
                    <div className="text-center mb-8">
                        <h3 className="text-xl font-bold text-base-content tracking-tight mb-2">
                            Create your account
                        </h3>
                        <p className="text-sm text-base-content/60">
                            Welcome! Please fill in the details to get started.
                        </p>
                    </div>

                    {/* 2. 소셜 로그인 (Kakao) */}
                    <button className="btn w-full btn-sm h-10 min-h-10 bg-[#FEE502] text-[#181600] border-[#f1d800] hover:bg-[#ebd300] hover:border-[#ebd300]">
                        <svg aria-label="Kakao logo" width="18" height="18" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                            <path fill="#181600" d="M255.5 48C299.345 48 339.897 56.5332 377.156 73.5996C414.415 90.666 443.871 113.873 465.522 143.22C487.174 172.566 498 204.577 498 239.252C498 273.926 487.174 305.982 465.522 335.42C443.871 364.857 414.46 388.109 377.291 405.175C340.122 422.241 299.525 430.775 255.5 430.775C241.607 430.775 227.262 429.781 212.467 427.795C148.233 472.402 114.042 494.977 109.892 495.518C107.907 496.241 106.012 496.15 104.208 495.248C103.486 494.706 102.945 493.983 102.584 493.08C102.223 492.177 102.043 491.365 102.043 490.642V489.559C103.126 482.515 111.335 453.169 126.672 401.518C91.8486 384.181 64.1974 361.2 43.7185 332.575C23.2395 303.951 13 272.843 13 239.252C13 204.577 23.8259 172.566 45.4777 143.22C67.1295 113.873 96.5849 90.666 133.844 73.5996C171.103 56.5332 211.655 48 255.5 48Z"></path>
                        </svg>
                        Continue with Kakao
                    </button>

                    {/* 3. 구분선 */}
                    <div className="my-4 divider text-xs text-base-content/50 uppercase">OR</div>

                    {/* 4. Form 영역 */}
                    <form className="flex flex-col gap-4">

                        {/* Email Input */}
                        <div className="w-full">
                            <label htmlFor="email" className="label pt-0 pb-1 cursor-pointer justify-start">
                                <span className="label-text text-sm font-medium text-base-content/80">Email address</span>
                            </label>


                            <label className="input  flex items-center gap-2 validator w-full h-10 text-sm bg-base-100">
                                <svg className="h-[1em] text-base-content/50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                    <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor">
                                        <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                                    </g>
                                </svg>
                                <input id="email" type="email" placeholder="mail@site.com" required className="grow text-base-content" />
                            </label>

                            <div className=" validator-hint block text-xs mt-1 text-error ">Enter valid email address</div>
                        </div>

                        {/* Password Input */}
                        <div className="w-full" style={{ marginTop: "-14px" }}>
                            <label htmlFor="password" className="label pt-0 pb-1 cursor-pointer justify-start">
                                <span className="label-text text-sm font-medium text-base-content/80">Password</span>
                            </label>

                            <label className="  input flex items-center gap-2 validator w-full h-10 text-sm bg-base-100">
                                <svg className="h-[1em] text-base-content/50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                    <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor">
                                        <path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"></path>
                                        <circle cx="16.5" cy="7.5" r=".5" fill="currentColor"></circle>
                                    </g>
                                </svg>
                                <input
                                    id="password"
                                    type="password"
                                    required
                                    placeholder="Password"
                                    minLength={8}
                                    pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                                    title="Must be more than 8 characters, including number, lowercase letter, uppercase letter"
                                    className="grow text-base-content"
                                />
                            </label>

                            <p className="validator-hint hidden text-xs mt-1 text-error">
                                Must be more than 8 characters, including <br />
                                At least one number, one lowercase, one uppercase letter
                            </p>
                        </div>

                        {/* 메인 버튼 */}
                        <button className="btn btn-primary w-full mt-2 h-10 min-h-10 font-bold ">
                            Continue
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="mt-8 text-center text-sm">
                        <span className="text-base-content/60">Already have an account? </span>
                        <Link href="/signin" className="text-primary font-semibold hover:underline">
                            Sign in
                        </Link>
                    </div>

                </div>

                {/* 보안 뱃지 */}
                <div className="bg-base-200/50 py-3 text-center border-t border-base-200">
                    <p className="text-[10px] text-base-content/40 font-medium uppercase tracking-wider flex items-center justify-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                        </svg>
                        Secured by NextCart
                    </p>
                </div>
            </div>
        </div>
    );
}