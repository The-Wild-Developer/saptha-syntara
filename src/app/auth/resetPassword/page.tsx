"use client";

import React, { Suspense, useState } from "react";
import type { IResetPassword } from "@/types";
import { dummyResetPassword } from "@/services/dummyAuth";
import { useRouter, useSearchParams } from "next/navigation";
import { showSuccessAlert, showErrorAlert } from "@/utils/alert";
import { Eye, EyeOff } from "lucide-react";
import AuthPageShell from "@/components/auth/AuthPageShell";

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <AuthPageShell subtitle="Enter a new password to access your account">
          <div className="login-glass login-card rounded-2xl border border-white/60 shadow-xl shadow-blue-100/50 sm:rounded-3xl">
            <p className="text-center text-sm text-blue-600">Loading...</p>
          </div>
        </AuthPageShell>
      }
    >
      <ResetPassword />
    </Suspense>
  );
}

function ResetPassword() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const usernameFromUrl = searchParams.get("username") || "";

  const [resetPassword, setResetPassword] = useState<IResetPassword>({
    username: usernameFromUrl,
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setResetPassword((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await dummyResetPassword(
        resetPassword.username,
        resetPassword.password,
        resetPassword.confirmPassword,
      );
      if (response.success) {
        showSuccessAlert("Reset Successful", "Redirecting to login...");
        router.push("/auth/login");
      } else {
        showErrorAlert(
          "Reset Failed",
          response.message || "Something went wrong!",
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthPageShell subtitle="Enter a new password to access your account">
      <div
        className="login-glass login-card-hover login-animate-slide-up login-card rounded-2xl border border-white/60 shadow-xl shadow-blue-100/50 sm:rounded-3xl"
        style={{ opacity: 0, animationDelay: "0.2s" }}
      >
        <div
          className="login-animate-fade-in login-delay-400 mb-5 text-center sm:mb-6"
          style={{ opacity: 0 }}
        >
          <h1
            className="login-animate-gradient login-card-title bg-gradient-to-r from-hover via-primary to-hover bg-clip-text font-bold text-transparent"
            style={{ backgroundSize: "200% auto" }}
          >
            Reset Password
          </h1>
          <p className="login-card-copy text-blue-600/70">
            Enter your new password carefully to access your account.
          </p>
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
              value={resetPassword.username}
              onChange={handleChange}
              required
              autoComplete="username"
              placeholder="Enter your username"
              className="login-input-focus login-input w-full rounded-2xl border-2 border-blue-100 bg-white/80 font-medium text-blue-800 placeholder-blue-300 transition-all duration-300 hover:border-primary/40 focus:border-primary focus:outline-none"
            />
          </div>

          <div
            className="login-animate-slide-up login-delay-400"
            style={{ opacity: 0 }}
          >
            <label className="login-field-label ml-1 block text-sm font-semibold text-hover">
              New Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={resetPassword.password}
                onChange={handleChange}
                required
                autoComplete="new-password"
                placeholder="••••••••"
                className="login-input-focus login-input login-input-password w-full rounded-2xl border-2 border-blue-100 bg-white/80 font-medium text-blue-800 placeholder-blue-300 transition-all duration-300 hover:border-primary/40 focus:border-primary focus:outline-none"
              />
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
            className="login-animate-slide-up login-delay-500"
            style={{ opacity: 0 }}
          >
            <label className="login-field-label ml-1 block text-sm font-semibold text-hover">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={resetPassword.confirmPassword}
                onChange={handleChange}
                required
                autoComplete="new-password"
                placeholder="••••••••"
                className="login-input-focus login-input login-input-password w-full rounded-2xl border-2 border-blue-100 bg-white/80 font-medium text-blue-800 placeholder-blue-300 transition-all duration-300 hover:border-primary/40 focus:border-primary focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-primary/70 transition-colors duration-300 hover:text-hover"
                aria-label={
                  showConfirmPassword ? "Hide password" : "Show password"
                }
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
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
              <span>{loading ? "Resetting..." : "Reset Password"}</span>
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
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
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
            Remember your password?{" "}
            <a
              href="/auth/login"
              className="bg-gradient-to-r from-hover to-primary bg-clip-text font-bold text-transparent"
            >
              Back to sign in
            </a>
          </p>
        </div>
      </div>
    </AuthPageShell>
  );
}
