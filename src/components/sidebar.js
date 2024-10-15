"use client"
import Image from "next/image";
import Link from "next/link";

export default function Sidebar() {

    const logOut = () => {
        localStorage.removeItem('token');
    }

    return (
        <>
            <div className="sidebar flex flex-col px-20 py-16 bg-gray-100 min-h-screen gap-10 whitespace-nowrap">
                <div className="font-bold text-xl border border-transparent border-b-black">
                    <h3>
                        Admin Panel
                    </h3>
                </div>
                <div className="Links text-lg font-semibold flex flex-col gap-5 ">
                    {/* <Link href="/admin/dashboard">Dashboard</Link> */}
                    <Link href="/admin/dashboard/projects" className="flex gap-2">
                        <Image src='/icons/home.svg' height={25} width={25} />
                        Projects
                    </Link>
                    <Link href="/admin/dashboard/about" className="flex gap-2">
                        <Image src='/icons/about.svg' height={25} width={25} />
                        About
                    </Link>
                    <Link href="/admin/dashboard/press" className="flex gap-2">
                        <Image src='/icons/press.svg' height={25} width={25} />
                        Press Release
                    </Link>
                    <Link href="/admin/dashboard/socials" className="flex gap-2">
                        <Image src='/icons/link.svg' height={25} width={25} />
                        Redirection Links
                    </Link>
                    <Link href="/admin/dashboard/messages" className="flex gap-2">
                        <Image src='/icons/message.svg' height={25} width={25} />
                        Messages
                    </Link>
                    <Link href="https://www.blogger.com/blog/posts/4903685674683903822" target="_blank" className="flex gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-brand-blogger"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M8 21h8a5 5 0 0 0 5 -5v-3a3 3 0 0 0 -3 -3h-1v-2a5 5 0 0 0 -5 -5h-4a5 5 0 0 0 -5 5v8a5 5 0 0 0 5 5z" /><path d="M7 7m0 1.5a1.5 1.5 0 0 1 1.5 -1.5h3a1.5 1.5 0 0 1 1.5 1.5v0a1.5 1.5 0 0 1 -1.5 1.5h-3a1.5 1.5 0 0 1 -1.5 -1.5z" /><path d="M7 14m0 1.5a1.5 1.5 0 0 1 1.5 -1.5h7a1.5 1.5 0 0 1 1.5 1.5v0a1.5 1.5 0 0 1 -1.5 1.5h-7a1.5 1.5 0 0 1 -1.5 -1.5z" /></svg>
                        Blogs
                        <Image src='/icons/link.svg' height={15} width={15} />
                    </Link>
                    <Link onClick={logOut} href="/admin" className="flex gap-2">
                        <Image src='/icons/logout.svg' height={25} width={25} />
                        Logout
                    </Link>
                </div>
            </div>
        </>
    )
}