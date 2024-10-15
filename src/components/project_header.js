"use client"
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Header({ theme = 'dark-theme' }) {
    const [showLinks, setShowLinks] = useState(false);

    const toggleLinks = () => {
        setShowLinks(!showLinks);
    };

    return (
        <div className={`flex justify-between items-center left-0 right-0 m-auto w-full ${theme} z-50 header`}>
            <div className="w-full page-section flex justify-between items-center">
                <Link href="#" className="pl-12">
                    <Image className="filter brightness-200"
                        src={`/images/logo/logo.png`}
                        width={150}
                        height={150}
                        quality={100}
                        alt="Logo"
                    />
                </Link>
                <div className={`header-links flex flex-col fixed w-full h-full top-0 left-0 items-center justify-center z-40 gap-5 ${showLinks ? 'left-0' : 'left-[-150%]'} transition-all duration-700 ease-in-out ${theme} bg-black `}>
                    <div className="flex flex-col gap-8 text-3xl font-semibold text-white">
                        <Link onClick={toggleLinks} className="hover:text-white text-gray-500" href="/">Home</Link>
                        <Link onClick={toggleLinks} className="hover:text-white text-gray-500" href="/about">About us</Link>
                        <Link onClick={toggleLinks} className="hover:text-white text-gray-500" href="/projects">Portfolio</Link>
                        <Link onClick={toggleLinks} className="hover:text-white text-gray-500" href="/press">Press release</Link>
                        <Link onClick={toggleLinks} target="_blank" className="hover:text-white text-gray-500" href="https://sambhavgrp.blogspot.com/">Blogs</Link>
                        <Link onClick={toggleLinks} className="hover:text-white text-gray-500" href="/contact">Contact us</Link>
                    </div>
                </div>
                <div className="block z-50" onClick={toggleLinks}>
                    <div className="block">
                        <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" ><path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M4 6l16 0" />
                            <path d="M4 12l16 0" />
                            <path d="M4 18l16 0" />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );
}
