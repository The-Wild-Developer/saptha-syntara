"use client";

import React, { useState } from "react";
import type { ILoginData } from "@/types";
import { useRouter } from "next/navigation";
import { dummyLeftMenu, dummyLogin } from "@/services/dummyAuth";
import { setSessionData } from "@/utils/session";
import { showSuccessAlert, showErrorAlert } from "@/utils/alert";
import { Eye, EyeOff } from "lucide-react";
import AuthPageShell from "@/components/auth/AuthPageShell";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();
  const [loginData, setLoginData] = useState<ILoginData>({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await dummyLogin(
        loginData.username,
        loginData.password,
      );

      if (response?.success) {
        setSessionData("accessToken", response?.data?.tokenDetails.accessToken);
        setSessionData(
          "refreshToken",
          response?.data?.tokenDetails.refreshToken,
        );
        setSessionData("userProfile", response?.data?.profileDetails);

        const authResponse = await dummyLeftMenu();

        if (authResponse?.success) {
          setSessionData("pages", authResponse.data);
          router.push("/dashboard");
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              showSuccessAlert(
                "Login Successful",
                "Redirecting to dashboard...",
              );
            });
          });
        }
      } else {
        showErrorAlert(
          "Login Failed",
          response?.message || "Something went wrong!",
        );
      }
    } catch (err) {
      showErrorAlert(
        "Login Failed",
        "Username or password invalid, Please try again.",
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthPageShell subtitle="Sign in to continue to Saptha Syntara">
      <div
        className="login-glass login-card-hover login-animate-slide-up login-card rounded-2xl border border-white/60 shadow-xl shadow-blue-100/50 sm:rounded-3xl"
        style={{ opacity: 0, animationDelay: "0.2s" }}
      >
            <div
              className="login-animate-fade-in login-delay-400 login-social-row flex"
              style={{ opacity: 0 }}
            >
              <button
                type="button"
                className="login-floating-icon login-social-btn group flex flex-1 items-center justify-center gap-2 rounded-2xl border border-blue-100 bg-white/80 shadow-sm transition-all duration-300 hover:border-blue-300 hover:bg-blue-50"
              >
                <svg
                  className="h-5 w-5 transition-transform group-hover:scale-110"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="#EA4335"
                    d="M5.266 9.765C6.199 6.939 8.854 4.909 12 4.909c1.691 0 3.218.6 4.418 1.582L19.909 3C17.782 1.145 15.055 0 12 0 7.27 0 3.198 2.698 1.24 6.65l4.026 3.115z" />
                  <path
                    fill="#34A853"
                    d="M16.041 18.013C14.951 18.716 13.566 19.091 12 19.091c-3.134 0-5.781-2.014-6.723-4.823l-4.04 3.067C3.193 21.294 7.265 24 12 24c2.933 0 5.735-1.043 7.834-3l-3.793-2.987z" />
                  <path
                    fill="#4A90D9"
                    d="M19.834 21C22.029 18.952 23.455 15.903 23.455 12c0-.709-.11-1.473-.273-2.182H12v4.637h6.436a5.42 5.42 0 01-2.395 3.558L19.834 21z" />
                  <path
                    fill="#FBBC05"
                    d="M5.277 14.268A7.03 7.03 0 014.909 12c0-.782.125-1.533.357-2.235L1.24 6.65A11.94 11.94 0 000 12c0 1.92.445 3.74 1.237 5.335l4.04-3.067z" />
                </svg>
                <span className="font-medium text-hover">
                  Google
                </span>
              </button>
              <button
                type="button"
                className="login-floating-icon login-social-btn group flex flex-1 items-center justify-center gap-2 rounded-2xl border border-blue-100 bg-white/80 shadow-sm transition-all duration-300 hover:border-blue-300 hover:bg-blue-50"
              >
                <svg
                  className="h-5 w-5 transition-transform group-hover:scale-110"
                  fill="#1877F2"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <span className="font-medium text-hover">
                  Facebook
                </span>
              </button>
              <button
                type="button"
                className="login-floating-icon login-social-btn group flex flex-1 items-center justify-center gap-2 rounded-2xl border border-blue-100 bg-white/80 shadow-sm transition-all duration-300 hover:border-blue-300 hover:bg-blue-50"
              >
                <svg
                  className="h-5 w-5 transition-transform group-hover:scale-110"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="#333"
                    d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                </svg>
                <span className="font-medium text-hover">
                  GitHub
                </span>
              </button>
            </div>

            <div
              className="login-animate-fade-in login-delay-400 login-divider flex items-center gap-3 sm:gap-4"
              style={{ opacity: 0 }}
            >
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-blue-200 to-transparent" />
              <span className="shrink-0 text-[10px] font-medium uppercase tracking-wider text-blue-400 xsm:text-xs">
                or continue with account
              </span>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-blue-200 to-transparent" />
            </div>

            <form onSubmit={handleSubmit} className="login-form">
              <div
                className="login-animate-slide-up login-delay-300"
                style={{ opacity: 0 }}
              >
                <label className="login-field-label ml-1 block text-sm font-semibold text-hover">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={loginData.username}
                  onChange={handleChange}
                  required
                  autoComplete="username"
                  placeholder="Enter your username"
                  className="login-input-focus login-input w-full rounded-2xl border-2 border-blue-100 bg-white/80 font-medium text-blue-800 placeholder-blue-300 transition-all duration-300 hover:border-primary/40 focus:border-primary focus:outline-none" />
              </div>

              <div
                className="login-animate-slide-up login-delay-400"
                style={{ opacity: 0 }}
              >
                <label className="login-field-label ml-1 block text-sm font-semibold text-hover">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={loginData.password}
                    onChange={handleChange}
                    required
                    autoComplete="current-password"
                    placeholder="••••••••"
                    className="login-input-focus login-input login-input-password w-full rounded-2xl border-2 border-blue-100 bg-white/80 font-medium text-blue-800 placeholder-blue-300 transition-all duration-300 hover:border-primary/40 focus:border-primary focus:outline-none" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-primary/70 transition-colors duration-300 hover:text-hover"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <div
                className="login-animate-fade-in login-delay-500 flex flex-wrap items-center justify-between gap-2"
                style={{ opacity: 0 }}
              >
                <label className="group flex cursor-pointer items-center gap-2.5">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded border-primary/30 text-primary focus:ring-primary" />
                  <span className="text-sm text-blue-600 transition-colors group-hover:text-hover">
                    Remember me
                  </span>
                </label>
                <a
                  href="/auth/requestOTP"
                  className="text-sm font-semibold text-primary transition-colors duration-300 hover:text-hover"
                >
                  Forgot password?
                </a>
              </div>

              <div
                className="login-animate-slide-up login-delay-500"
                style={{ opacity: 0 }}
              >
                <button
                  type="submit"
                  disabled={loading}
                  className="login-btn-shimmer login-animate-gradient login-submit group flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-primary to-hover font-bold tracking-wide text-white shadow-lg shadow-primary/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-hover/40 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <span>{loading ? "Signing in..." : "Sign In"}</span>
                  {!loading && (
                    <svg
                      className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  )}
                </button>
              </div>
            </form>

            <div
              className="login-animate-fade-in login-delay-700 mt-4 text-center sm:mt-6"
              style={{ opacity: 0 }}
            >
              <p className="text-sm text-blue-600">
                Don&apos;t have an account?{" "}
                <a
                  href="/"
                  className="bg-gradient-to-r from-hover to-primary bg-clip-text font-bold text-transparent"
                >
                  Create one now
                </a>
              </p>
            </div>
          </div>
    </AuthPageShell>
  );
}
