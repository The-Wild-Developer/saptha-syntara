import "jsvectormap/dist/jsvectormap.css";
import "flatpickr/dist/flatpickr.min.css";
import { Roboto_Flex } from "next/font/google";
import "@/css/style.css";
import "@fortawesome/fontawesome-free/css/all.css";
import React from "react";
import { themeInitScript } from "@/utils/theme";
import "../globals.css";
import AppProviders from "./providers";

const robotoFlex = Roboto_Flex({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto-flex",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={robotoFlex.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body
        className={`${robotoFlex.className} antialiased`}
        suppressHydrationWarning={true}
      >
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
