"use client";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import "@/app/globals.css";

const Login = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loggingIn, setLoggingIn] = useState("Login");

  // useEffect(() => {
  //   const createAdmin = async () => {
  //     const response = await fetch("/api/admin/create", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ username: "admin", password: "admin" }),
  //     });
  //   };
  //   createAdmin();
  // }, [password, username]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoggingIn("Please wait...");
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        // console.log(data);
        localStorage.setItem("token", data.token);
        if (localStorage.getItem("token")) {
          router.push("/admin/dashboard/projects");
        } else {
          setError("Something went wrong!");
        }
      } else {
        // Handle login failure
        setError("Invalid username or password");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      setError("Something went wrong");
    } finally {
      setLoggingIn("Login");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 h-full overflow-auto">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Admin Panel Login
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <input type="hidden" name="remember" defaultValue="true" />
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="username" className="sr-only">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          {error && <p className="mt-2 text-red-600">{error}</p>}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <svg
                  className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 3.73a1.105 1.105 0 01.78.324l3.073 3.073a1.105 1.105 0 01-1.562 1.562L10 6.315 7.71 8.654a1.105 1.105 0 11-1.562-1.562l3.073-3.073a1.105 1.105 0 01.78-.324z"
                    clipRule="evenodd"
                  />
                  <path
                    fillRule="evenodd"
                    d="M5.242 7.89a1.105 1.105 0 01.324-.779l3.073-3.073a1.105 1.105 0 111.562 1.562L6.315 10l2.339 2.29a1.105 1.105 0 11-1.562 1.562l-3.073-3.073a1.105 1.105 0 01-.324-.78z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
              {loggingIn}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
