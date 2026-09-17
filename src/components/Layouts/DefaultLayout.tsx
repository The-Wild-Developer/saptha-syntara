"use client";
import React, { useState, ReactNode } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import useLocalStorage from "@/hooks/useLocalStorage";

export default function DefaultLayout({
  children,
}: {
  children: ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useLocalStorage(
    "sidebarCollapsed",
    false,
  );

  return (
    <>
      {/* <!-- ===== Page Wrapper Start ===== --> */}
      <div className="flex min-h-screen flex-col">
        {/* <!-- ===== Sidebar Start ===== --> */}
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          sidebarCollapsed={!!sidebarCollapsed}
        />
        {/* <!-- ===== Sidebar End ===== --> */}

        {/* <!-- ===== Content Area Start ===== --> */}
        <div
          className={`relative flex min-h-screen min-w-0 flex-1 flex-col overflow-x-hidden transition-all duration-300 ease-in-out ${
            sidebarCollapsed ? "lg:ml-20" : "lg:ml-75"
          }`}
        >
          {/* <!-- ===== Header Start ===== --> */}
          <Header
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            sidebarCollapsed={!!sidebarCollapsed}
            setSidebarCollapsed={setSidebarCollapsed}
          />
          {/* <!-- ===== Header End ===== --> */}

          {/* <!-- ===== Main Content Start ===== --> */}
          <main className="flex min-w-0 flex-1 flex-col">
            <div className="mx-auto flex w-full min-w-0 flex-1 flex-col p-4 md:p-6 2xl:p-10">
              {children}
            </div>
          </main>
          {/* <!-- ===== Main Content End ===== --> */}
        </div>
        {/* <!-- ===== Content Area End ===== --> */}
      </div>
      {/* <!-- ===== Page Wrapper End ===== --> */}
    </>
  );
}
