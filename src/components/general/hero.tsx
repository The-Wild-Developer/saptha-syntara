"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "@/app/auth/login/login.css";

const SPLASH_HOLD_MS = 2200;
const SPLASH_FADE_MS = 500;

export default function Hero() {
  const router = useRouter();
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    router.prefetch("/auth/login");

    const fadeTimer = window.setTimeout(() => {
      setIsLeaving(true);
    }, SPLASH_HOLD_MS);

    const redirectTimer = window.setTimeout(() => {
      router.push("/auth/login");
    }, SPLASH_HOLD_MS + SPLASH_FADE_MS);

    return () => {
      window.clearTimeout(fadeTimer);
      window.clearTimeout(redirectTimer);
    };
  }, [router]);

  return (
    <div
      className={`login-page relative flex items-center justify-center overflow-hidden transition-opacity duration-500 ease-out ${isLeaving ? "opacity-0" : "opacity-100"
        }`}
      style={{
        background:
          "linear-gradient(135deg, #eff6ff 0%, #dbeafe 25%, #e0f2fe 50%, #f0f9ff 75%, #e0e7ff 100%)",
      }}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="login-animate-blob login-animate-float absolute -left-20 -top-20 hidden h-72 w-72 bg-gradient-to-br from-blue-200 to-sky-200 opacity-50 sm:block"
          style={{ animationDelay: "0s" }}
        />
        <div
          className="login-animate-blob login-animate-float-reverse absolute -right-16 top-1/3 hidden h-64 w-64 bg-gradient-to-br from-sky-200 to-cyan-200 opacity-40 sm:block"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="login-animate-blob absolute -bottom-20 left-1/4 hidden h-80 w-80 bg-gradient-to-br from-indigo-200 to-blue-200 opacity-40 md:block"
          style={{ animationDelay: "4s" }}
        />
        <div
          className="login-animate-morph login-animate-float absolute right-1/3 top-10 hidden h-48 w-48 bg-gradient-to-br from-sky-200 to-cyan-200 opacity-40 md:block"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="login-animate-blob login-animate-float-reverse absolute bottom-1/4 right-10 hidden h-56 w-56 bg-gradient-to-br from-blue-100 to-sky-100 opacity-30 lg:block"
          style={{ animationDelay: "3s" }}
        />

        <div
          className="login-particle login-animate-float"
          style={{ top: "15%", left: "10%", animationDelay: "0.5s" }}
        >
          <svg
            width="40"
            height="40"
            viewBox="0 0 40 40"
            className="login-animate-rotate-slow"
          >
            <circle
              cx="20"
              cy="20"
              r="15"
              fill="none"
              stroke="var(--color-primary)"
              strokeWidth="2"
              opacity="0.3"
            />
          </svg>
        </div>
        <div
          className="login-particle login-animate-float-reverse"
          style={{ top: "25%", right: "15%", animationDelay: "1.2s" }}
        >
          <svg
            width="30"
            height="30"
            viewBox="0 0 30 30"
            className="login-animate-wiggle"
          >
            <rect
              x="5"
              y="5"
              width="20"
              height="20"
              rx="4"
              fill="none"
              stroke="var(--color-primary)"
              strokeWidth="2"
              opacity="0.3"
              transform="rotate(45 15 15)"
            />
          </svg>
        </div>
        <div
          className="login-particle login-animate-float"
          style={{ top: "70%", left: "8%", animationDelay: "2s" }}
        >
          <svg width="35" height="35" viewBox="0 0 35 35">
            <polygon
              points="17.5,2 33,30 2,30"
              fill="none"
              stroke="var(--color-hover)"
              strokeWidth="2"
              opacity="0.3"
            />
          </svg>
        </div>
        <div
          className="login-particle login-animate-float-reverse"
          style={{ bottom: "20%", right: "8%", animationDelay: "0.8s" }}
        >
          <svg
            width="25"
            height="25"
            viewBox="0 0 25 25"
            className="login-animate-rotate-slow"
            style={{ animationDuration: "15s" }}
          >
            <path
              d="M12.5 2 L15.5 9.5 L23 12.5 L15.5 15.5 L12.5 23 L9.5 15.5 L2 12.5 L9.5 9.5 Z"
              fill="none"
              stroke="var(--color-primary)"
              strokeWidth="1.5"
              opacity="0.4"
            />
          </svg>
        </div>

        <div
          className="login-particle login-animate-sparkle h-2 w-2 rounded-full bg-primary opacity-60"
          style={{ top: "20%", left: "30%" }}
        />
        <div
          className="login-particle login-animate-sparkle login-delay-700 h-1.5 w-1.5 rounded-full bg-hover opacity-60"
          style={{ top: "40%", right: "25%" }}
        />
        <div
          className="login-particle login-animate-sparkle login-delay-1500 h-2 w-2 rounded-full bg-indigo-300 opacity-60"
          style={{ bottom: "30%", left: "20%" }}
        />
        <div
          className="login-particle login-animate-sparkle login-delay-2000 h-1 w-1 rounded-full bg-blue-400 opacity-60"
          style={{ top: "60%", right: "35%" }}
        />
        <div
          className="login-particle login-animate-sparkle login-delay-1000 h-2 w-2 rounded-full bg-sky-300 opacity-50"
          style={{ top: "12%", right: "40%" }}
        />
      </div>

      <div className="relative z-10 m-2 flex flex-col items-center justify-center text-center">
        <img
          src="/images/logo/logo.png"
          alt="Saptha Syntara"
          className="login-animate-bounce-in h-12 w-auto object-contain md:h-20"
        />
        <h1 className="hero-title-gradient login-animate-fade-in mb-2 px-1 text-5xl font-bold md:mb-5 md:text-[120px]">
          Saptha Syntara
        </h1>
        <p className="login-animate-slide-up login-delay-300 mb-6 text-sm text-black lg:text-lg">
          Streamline production planning, optimize resources, and improve operational efficiency.
        </p>
        <div
          className="h-1.5 w-32 overflow-hidden rounded-full bg-blue-100"
          aria-hidden
        >
          <div className="login-splash-progress h-full w-full bg-gradient-to-r from-primary via-hover to-primary" />
        </div>
      </div>
    </div>
  );
}
