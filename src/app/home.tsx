"use client";

import Hero from "@/components/general/hero";
import Footer from "@/components/general/footer";
import { postRequest } from "@/services/api.service";
import { useEffect } from "react";
import { SPLASH } from "@/utils/apiMessage";

export default function Home() {
  useEffect(() => {
    const fetchSplashData = async () => {
      try {
        const response = await postRequest(
          "api/v1/login/splash",
          {
            channel: "OP",
            message: "SPLASH",
            ip: "0.0.0.1",
          },
          SPLASH,
          "",
        );

        console.log("Splash API Response:", response);

        if (response.success) {
        }
      } catch (error) {
        console.error("Error calling Splash API:", error);
      }
    };

    fetchSplashData();
  }, []);

  return (
    <div className="mx-auto flex h-screen w-full flex-col">
      <Hero />
      <Footer />
    </div>
  );
}
