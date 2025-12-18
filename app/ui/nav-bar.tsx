import Link from "next/link";

export default function Navbar(){
    return(<div className="navbar bg-base-100 shadow-sm ">
  <div className="navbar-start">
    <div className="dropdown">
      <div tabIndex={0} role="button" className="btn btn-ghost md:hidden">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /> </svg>
      </div>
      <ul
        tabIndex="-1"
        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
        <li><Link href="/landing">Home</Link></li>
        <li><Link href="/landing">Shop</Link></li>
        <li><Link href="/landing">About us</Link></li>
        <li><Link href="/landing">Contact</Link></li>
        <li><Link href="/landing">Seller Dashboard</Link></li>
      </ul>
    </div>
    <Link href="/landing" className="btn btn-ghost text-2xl"><div><span className="text-primary text-2xl">N</span>ext</div></Link>
  </div>
  <div className="navbar-center hidden md:flex md:gap-0">
    <ul className="menu menu-horizontal px-1">
      <li><Link href="/landing">Home</Link></li>
    </ul>
    <ul className="menu menu-horizontal px-1">
      <li><Link href="/landing">Shop</Link></li>
    </ul>
    <ul className="menu menu-horizontal px-1">
      <li><Link href="/landing">About us</Link></li>
    </ul>
    <ul className="menu menu-horizontal px-1">
      <li><Link href="/landing">Contact</Link></li>
    </ul>
    <ul className="menu menu-horizontal px-1">
      <li><Link href="/landing">seller Dashboard</Link></li>
    </ul>
  </div>
  <div className="navbar-end">
    <Link href="/landing" className="btn">Button</Link>
    <Link href="/landing" className="btn">Button</Link>
    <Link href="/landing" className="btn">Button</Link>
  </div>
</div>)
}