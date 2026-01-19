import { signIn } from "@/auth"
import { KakaoLogo } from "./icons"
import { handleKaKaoLogin } from "../lib/actions"

export default function KaKaoSocialLogin(){
    return(<form action={handleKaKaoLogin}>
              <button className=" shadow btn w-full btn-sm h-10 min-h-10 bg-[#FEE502] text-[#181600] border-[#f1d800] hover:bg-[#ebd300] hover:border-[#ebd300]">
                <KakaoLogo />
                Continue with Kakao
              </button>
    
              </form>)
}