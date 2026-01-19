'use client'
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { createAccount } from "../lib/actions";
import { EmailIcon, PasswordIcon } from "../ui/icons";
import ErrorToast from "../ui/toast";
import KaKaoSocialLogin from "../ui/kakao-social-login";


export default function Signin() {

    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl') || '/';
    const [errorMessage, formAction, isPending] = useActionState(
        createAccount,
        undefined,
    );

    const [showToast, setShowToast] = useState(false);
    const [touched, setTouched] = useState({ email: false, password: false });
    // 에러 메시지가 들어오면 토스트를 띄우고 3초 후 닫음, touched 초기화
    useEffect(() => {
        if (errorMessage) {
            setShowToast(true);
            setTouched({ email: false, password: false });
            const timer = setTimeout(() => setShowToast(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [errorMessage]);



    const handleChange = (field: 'email' | 'password') => {
        if (touched[field]) return;
        setTouched((prev) => ({ ...prev, [field]: true }))
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-base-100 p-4">

            {/* 카드 컨테이너 */}
            <div className="w-full max-w-100 bg-base-100 rounded-2xl shadow-2xl border border-base-200 overflow-hidden">

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
                    <KaKaoSocialLogin />


                    {/* 3. 구분선 */}
                    <div className="my-4 divider text-xs text-base-content/50 uppercase">OR</div>

                    {/* 4. Form 영역 */}
                    <form noValidate action={formAction} className="flex flex-col gap-4 noValidate">



                        {/* Email Input */}
                        <div className="w-full relative">
                            <label htmlFor="email" className="label pt-0 pb-1 cursor-pointer justify-start">
                                <span className="label-text text-sm font-medium text-base-content/80">Email address</span>
                            </label>


                            <label className="input  flex items-center gap-2 validator w-full h-10 text-sm bg-base-100">
                                <EmailIcon />
                                <input name="email" id="email" type="email" placeholder="mail@site.com" required className="grow text-base-content " onChange={() => handleChange('email')} />
                            </label>
                            <div className=" validator-hint block text-xs mt-1 text-error  ">Enter valid email address</div>
                            {errorMessage?.errors?.email && !touched.email && <div className="absolute left-0 bottom-0 text-xs text-error">{errorMessage.errors.email[0]}</div>}
                        </div>

                        {/* Password Input */}
                        <div className="w-full relative" style={{ marginTop: "-14px" }}>
                            <label htmlFor="password" className="label pt-0 pb-1 cursor-pointer justify-start">
                                <span className="label-text text-sm font-medium text-base-content/80">Password</span>
                            </label>

                            <label className="  input flex items-center gap-2 validator w-full h-10 text-sm bg-base-100">
                                <PasswordIcon />
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    placeholder="Password"
                                    minLength={8}
                                    pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                                    title="Must be more than 8 characters, including number, lowercase letter, uppercase letter"
                                    className="grow text-base-content"
                                    onChange={() => handleChange('password')}
                                />
                            </label>

                            <p className="validator-hint hidden text-xs mt-1 text-error">
                                Must be more than 8 characters, including <br />
                                At least one number, one lowercase, one uppercase letter
                            </p>
                            {errorMessage?.errors?.password && !touched.password && <div className="mt-1 text-xs text-error whitespace-pre-line">{errorMessage.errors.password[0]}</div>}

                        </div>

                        <input type="hidden" name="redirectTo" value={callbackUrl} />
                        {/* 메인 버튼 */}
                        <button className="btn btn-primary w-full mt-2 h-10 min-h-10 font-bold ">
                            {isPending ? <span className="loading loading-spinner loading-sm"></span> : <span>Continue</span>}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="mt-8 text-center text-sm">
                        <span className="text-base-content/60">Already have an account?
                        </span>
                        <Link href="/signup" className="text-primary font-semibold hover:underline">
                            sign in
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


            <ErrorToast
                isVisible={showToast}
                onClose={() => setShowToast(false)}
                message={errorMessage?.message}
            />
        </div>
    );
}