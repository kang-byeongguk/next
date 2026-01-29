import { User } from "lucide-react";
import Link from "next/link";

export default function SigninBefore(){
    return(
        <Link href="/signin">
        <div className="flex shrink-0 justify-center items-center gap-1">
          <User  className="w-5 h-5" strokeWidth={1.5} />
          <div className="text-sm">Account</div>
        </div>
      </Link>
    )
}