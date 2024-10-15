import { Poppins } from "next/font/google";
import Snackbar from "@/components/snackbar";
import "./globals.css";

const poppins = Poppins({
  weight: "400",
  subsets: ["latin"],
});

export const metadata = {
  title: "Sambhav Group",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${poppins.className} min-h-screen scroll-m-0 overflow-hidden`}
      >
        {children}
        <Snackbar />
      </body>
    </html>
  );
}

export const dynamic = "force-dynamic";
export const revalidate = 0;
