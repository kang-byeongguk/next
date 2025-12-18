import Navbar from "../ui/nav-bar";

export default function Layout({children}:{children:React.ReactNode}){
    return(
        <div className="flex flex-col">
            <div className="w-full"><Navbar/></div>
            <div className="grow p-6 md:p-12">{children}</div>
        </div>
    )
}