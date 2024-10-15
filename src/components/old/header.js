import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Header({ theme = 'dark-theme' }) {
    const [showLinks, setShowLinks] = useState(false);

    const toggleLinks = () => {
        setShowLinks(!showLinks);
    };

    return (
        <div className={`flex justify-between items-center left-0 right-0 m-auto w-full ${theme} z-50`}>
            <div className="w-full page-section flex justify-between items-center">
                <Link href="/">
                    <Image
                        src={theme === 'light-theme' || theme === 'transparent-theme' ? `/images/logo/logo_black.svg` : `/images/logo/logo_white.svg`}
                        width={150}
                        height={150}
                        alt="Logo"
                        quality={100}
                    />
                </Link>
                <div className={`header-links flex flex-col fixed w-full h-full top-0 left-0 items-center justify-center z-40 gap-5 ${showLinks ? 'left-0' : 'left-[-200%]'} transition-all duration-300 ease-in-out md:flex-row md:relative md:left-0 md:h-auto md:w-auto ${theme === 'transparent-theme' ? 'bg-white md:bg-transparent' : theme}`}>
                    <div className="flex flex-col md:flex-row gap-8 text-3xl font-semibold md:text-sm">
                        <Link href="/">home</Link>
                        <Link href="/about">about us</Link>
                        <Link href="/projects">portfolio</Link>
                        <Link href="/press">press release</Link>
                        <Link href="/contact">contact us</Link>
                    </div>
                </div>
                <div className="block z-50" onClick={toggleLinks}>
                    <div className="block md:hidden">
                        <Image
                            src={theme === 'light-theme' || theme === 'transparent-theme' ? `/icons/ham_black.svg` : `/icons/ham_white.svg`}
                            height={40}
                            width={40}
                            quality={100}
                            alt="Menu Icon"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
