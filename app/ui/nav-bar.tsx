import { Menu, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import ThemeController from "./theme-controller";

export default function Navbar() {

  const menuLinkClass = `hover:text-base-content hover:bg-transparent transition`

  return (<div className="navbar bg-base-100 border-b border-base-content/30 text-base-content px-5 md:px-20">
    <div className="navbar-start">
      <div className="dropdown ">
        <div tabIndex={0} role="button" className=" md:hidden">
          <Menu className="cursor-pointer" strokeWidth={1.5} />
        </div>
        <ul
          tabIndex={-1}
          className="menu menu-md dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow text-base-content/80">
          <li><Link className={menuLinkClass} href="/product">Shop</Link></li>
          <li><Link className={menuLinkClass} href="/">Home</Link></li>
          <li><Link className={menuLinkClass} href="/">About us</Link></li>
          <li><Link className={menuLinkClass} href="/">Contact</Link></li>
          <li><Link className={menuLinkClass} href="/product/add">Seller Dashboard</Link></li>
        </ul>
      </div>
      <Link href="/" >
        <Image width={682} height={446} alt="logo" src="/logo.png" className="w-18" ></Image>
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
    <div className="navbar-end">
      <Link href="/my">
        <div className="flex shrink-0 justify-center items-center gap-1">
          <User className="w-5 h-5" strokeWidth={1.5} />
          <div className="text-sm">Account</div>
        </div>
      </Link>
      <ThemeController/>
    </div>
  </div>)
}