import { Menu } from "lucide-react";
import Link from "next/link";
import ThemeController from "./theme-controller";
import Logo from "../logo";
import { auth } from "@/auth";
import SigninBefore from "./signin-before";
import SigninAfter from "./signin-after";
import UserDropdown from "./signin-after";

export default async function Navbar() {

  const menuLinkClass = `hover:text-base-content hover:bg-transparent transition`
  const session = await auth();
  return (<div className="navbar bg-base-100 border-b border-base-content/30 text-base-content px-5 md:px-20">
    <div className="navbar-start">
      <div className="dropdown ">
        <div tabIndex={0} role="button" className=" md:hidden">
          <Menu className="cursor-pointer" strokeWidth={1.5} />
        </div>
        <ul
          tabIndex={-1}
          className="menu menu-md dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow text-base-content/80">
          <li><Link className={menuLinkClass} href="/">Home</Link></li>
          <li><Link className={menuLinkClass} href="/product">Shop</Link></li>
          <li><Link className={menuLinkClass} href="/">About us</Link></li>
          <li><Link className={menuLinkClass} href="/">Contact</Link></li>
          <li><Link className={menuLinkClass} href="/">Seller Dashboard</Link></li>
        </ul>
      </div>
      <Link href="/" >
        <Logo />
      </Link>
    </div>
    <div className="navbar-center hidden md:flex lg:gap-0">
      <ul className="menu menu-horizontal px-1 text-base-content/90 flex items-center">
        <li><Link className={menuLinkClass} href="/">Home</Link></li>
        <li><Link className={menuLinkClass} href="/product">Shop</Link></li>
        <li><Link className={menuLinkClass} href="/">About us</Link></li>
        <li><Link className={menuLinkClass} href="/">Contact</Link></li>
        <li><Link className={`${menuLinkClass} border-base-content/90 border rounded-full text-xs py-1.5 px-4`} href="/product/add" >Seller Dashboard</Link></li>
      </ul>

    </div>
    <div className="navbar-end ">
      {session ? <UserDropdown /> : <SigninBefore />}
      <ThemeController />
    </div>
  </div>)
}


