"use client"
import "../globals.css";
import Snackbar from "@/components/snackbar";
import Footer from "@/components/footer";
import Header from "@/components/header";
import { Suspense } from "react";

export default function RootLayout({ children }) {
  let backTo = localStorage.getItem('cameFrom');
  if (backTo === 'projects') {
    backTo = '/projects';
  } else {
    backTo = '/';
  }

  return (
    <Suspense>
      <div className="dark-theme h-screen overflow-auto flex flex-col gap-4">
        <Header hideLogo backNav={backTo} />
        <div className="relative flex-1 min-h-screen">{children}</div>
        <Footer />
        <Snackbar />
      </div>
    </Suspense>
  );
}

export const dynamic = "force-dynamic";
export const revalidate = 0;