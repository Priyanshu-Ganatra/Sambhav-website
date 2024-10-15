import Header from "@/components/header";
import { ToastContainer } from "react-toastify";
import Footer from "@/components/footer";

import "../globals.css";

export default function RootLayout({ children }) {
  if (process.env.NODE_ENV === "development") {
    console.warn = () => {};
    console.error = () => {};
  }

  return (
    <div className="dark-theme h-screen overflow-hidden flex flex-col gap-4">
      <Header />
      <div className="flex-1 min-h-screen">{children}</div>

      <ToastContainer />
    </div>
  );
}
