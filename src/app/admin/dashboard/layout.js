"use client";
import Sidebar from "@/components/sidebar";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "../../globals.css";

export default function RootLayout({ children }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    async function authUser() {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("Token not found");
        }

        const response = await fetch("/api/admin/auth", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
          cache: "no-store",
          next: { revalidate: 10 },
        });

        if (!response.ok) {
          toast.error("Unauthorized");
        }

        const data = await response.json();
        // console.log(data);
        if (data.status === 200) {
          setIsAuthorized(true);
          // console.log("User authorized");
        } else {
          toast.error("Unauthorized");
        }
      } catch (error) {
        console.error("Authentication error:", error.message);
        setIsAuthorized(false);
        toast.error("Unauthorized access");
      } finally {
        setIsLoading(false);
      }
    }

    authUser();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        Loading...
      </div>
    ); // Display a loading indicator
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex justify-center items-center text-red-700 font-bold text-4xl">
        Unauthorized access
      </div>
    ); // Display unauthorized access message
  }

  return (
    <div className="flex flex-row h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 overflow-auto h-full min-h-screen">
        {children}
      </div>
    </div>
  );
}
