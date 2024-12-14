"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePathname } from 'next/navigation'
import { useState } from "react";

export default function Header({ theme = "dark-theme", hideLogo, backNav }) {
  const [showLinks, setShowLinks] = useState(false);
  const router = useRouter();
  const pathname = usePathname()

  const toggleLinks = () => {
    setShowLinks(!showLinks);
  };

  const goBack = () => {
    router.back();
  }

  const shouldBeFullWidth = (path) => {
    if (path.includes("projects")) {
      return true;
    }
  }

  return (
    <div className={`fixed top-0 flex items-center w-screen z-40 mb-2 min-h-14 max-h-[100px] bg-black`}>
      <div className={`flex justify-between items-center w-full  max-h-[100px] ${shouldBeFullWidth(pathname) && 'min-w-[100vw]'} page-section`}>
        {backNav && (
          <button
            title="Go back"
            onClick={goBack}
            className="text-white z-50 bg-black p-2 rounded-sm opacity-50 hover:opacity-100"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="icon icon-tabler icons-tabler-outline icon-tabler-arrow-left"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M5 12l14 0" />
              <path d="M5 12l6 6" />
              <path d="M5 12l6 -6" />
            </svg>
          </button>
        )}

        {!hideLogo ? (
          <Link href="/" className="bg-black bg-opacity-50 h-[100px] max-h-[100px] p-2 rounded-sm">
            <Image
              className="filter brightness-200 h-[100px]"
              src={`/images/logo/logo_white.svg`}
              width={100}
              height={50}
              quality={200}
              alt="Logo"
            />
          </Link>
        ) : (
          <span />
        )}

        <div
          className={`header-links flex flex-col fixed w-full h-full top-0 left-0 items-center justify-center z-40 gap-5 ${showLinks ? "left-0" : "left-[-150%]"
            } transition-all duration-700 ease-in-out ${theme} bg-white `}
        >
          <div className="flex flex-col gap-8 text-3xl font-semibold text-white">
            <Link
              onClick={toggleLinks}
              className="hover:text-white text-gray-500"
              href="/"
            >
              Home
            </Link>
            <Link
              onClick={toggleLinks}
              className="hover:text-white text-gray-500"
              href="/about"
            >
              About us
            </Link>
            <Link
              onClick={toggleLinks}
              className="hover:text-white text-gray-500"
              href="/projects"
            >
              Portfolio
            </Link>
            <Link
              onClick={toggleLinks}
              className="hover:text-white text-gray-500"
              href="/press"
            >
              Press release
            </Link>
            <Link
              onClick={toggleLinks}
              target="_blank"
              className="hover:text-white text-gray-500"
              href="https://sambhavgrp.blogspot.com/"
            >
              Blogs
            </Link>
            <Link
              onClick={toggleLinks}
              className="hover:text-white text-gray-500"
              href="/contact"
            >
              Contact us
            </Link>
          </div>
        </div>
        <div className="block z-50" onClick={toggleLinks}>
          <div
            role="button"
            className="block cursor-pointer bg-black rounded-sm p-2"
          >
            {showLinks ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="35"
                height="35"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M18 6L6 18" />
                <path d="M6 6l12 12" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="35"
                height="35"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M4 6l16 0" />
                <path d="M4 12l16 0" />
                <path d="M4 18l16 0" />
              </svg>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}