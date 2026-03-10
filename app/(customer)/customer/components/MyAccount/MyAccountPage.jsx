"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function LoginPage({ isLoggedIn }) {
  const router = useRouter();

  useEffect(() => {
    if (isLoggedIn) {
      router.replace("/");
    }
  }, [isLoggedIn, router]);

  if (isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-6">
          {/* Spinner */}
          <div className="relative">
            <div className="w-16 h-16 rounded-full border-2 border-gray-200"></div>

            <div
              className="
              absolute inset-0
              rounded-full
              border-2 border-t-[#38bdf8] border-r-[#0ea5e9]
              animate-spin
            "
            ></div>
          </div>

          {/* Text */}
          <div className="text-center">
            <p className="text-black text-lg font-medium tracking-wide">
              Redirecting...
            </p>

            <p className="text-gray-500 text-sm mt-1">
              Taking you to your Home 🚀
            </p>
          </div>

          {/* Dots */}
          <div className="flex gap-1">
            <span className="w-2 h-2 bg-[#38bdf8] rounded-full animate-bounce [animation-delay:-0.3s]" />
            <span className="w-2 h-2 bg-[#38bdf8] rounded-full animate-bounce [animation-delay:-0.15s]" />
            <span className="w-2 h-2 bg-[#38bdf8] rounded-full animate-bounce" />
          </div>
        </div>
      </div>
    );
  }

  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Please enter email and password");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed");
        return;
      }

      localStorage.setItem("userName", data.user.name);

      router.replace(redirectTo);
      router.refresh();
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white">

      {/* LEFT BRAND PANEL */}
      <div className="hidden lg:flex w-1/2 pt-10 justify-center text-black p-0">
        <div className="max-w-md">
          <Image
            src="/images/logo/samadLogoremove.png"
            alt="Samad Agency"
            width={480}
            height={80}
            priority
          />

          <h2 className="mt-6 text-3xl font-semibold">
            Welcome Back to{" "}
            <span className="text-[#0ea5e9]">Samad Agency</span>
          </h2>

          <p className="mt-4 text-gray-600 text-sm leading-relaxed">
            Wholesale mobile accessories supplier delivering high-quality
            products across India.
          </p>

          <div className="mt-4 text-sm text-gray-700">
            Airpods • Chargers • Data Cables • Handsfree • Neckbands • Power Banks
          </div>

          <p className="mt-4 text-[#0ea5e9] text-sm font-medium">
            Pan India Delivery Available 🇮🇳
          </p>
        </div>
      </div>

      {/* RIGHT LOGIN FORM */}
      <div className="flex w-full lg:w-1/2 justify-center items-center p-6">

        <div className="w-full max-w-md rounded-2xl bg-white shadow-lg border border-gray-200 p-8">

          {/* Logo */}
          <Image
            src="/images/logo/samadLogoremove.png"
            alt="Samad Agency"
            width={140}
            height={60}
            priority
            className="w-[120px] pb-6"
          />

          {/* Heading */}
          <h1 className="text-2xl font-semibold text-black mb-1">
            Login to Your Account
          </h1>

          <p className="text-sm text-gray-500 mb-6">
            Access your orders, wishlist & product dashboard
          </p>

          {/* Error */}
          {error && (
            <div
              className="
              mb-4 rounded-lg
              bg-red-50
              border border-red-200
              p-3 text-sm text-red-600
            "
            >
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">

            {/* Email */}
            <div>
              <label className="text-sm text-black">
                Email Address
              </label>

              <input
                type="email"
                placeholder="you@example.com"
                className="
                  w-full mt-1 rounded-lg
                  border border-gray-300
                  bg-white
                  px-3 py-2 text-black
                  outline-none
                  focus:border-[#0ea5e9]
                  focus:ring-1 focus:ring-[#0ea5e9]
                "
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-sm text-black">
                Password
              </label>

              <input
                type="password"
                placeholder="Enter password"
                className="
                  w-full mt-1 rounded-lg
                  border border-gray-300
                  bg-white
                  px-3 py-2 text-black
                  outline-none
                  focus:border-[#0ea5e9]
                  focus:ring-1 focus:ring-[#0ea5e9]
                "
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="
                w-full rounded-lg
                bg-[#0ea5e9]
                py-2.5 font-semibold text-white
                hover:bg-[#0284c7]
                transition disabled:opacity-60
              "
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* Register */}
          <p className="text-center text-sm text-gray-500 pt-4">
            Don’t have an account?{" "}
            <Link
              href="/auth/register"
              className="
                font-semibold
                text-[#0ea5e9]
                hover:text-[#0284c7]
                hover:underline
                underline-offset-4
              "
            >
              Create Account
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}