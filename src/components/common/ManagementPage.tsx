"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Footer from "@/components/Footer/Footer";
import { ReactNode } from "react";

interface ManagementPageProps {
  pageName: string;
  title?: string;
  children: ReactNode;
}

export default function ManagementPage({
  pageName,
  title,
  children,
}: ManagementPageProps) {
  return (
    <DefaultLayout>
      <div className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-270 flex-col">
        <Breadcrumb pageName={pageName} />
        <div className="rounded-2xl border border-stroke bg-white dark:border-strokedark dark:bg-boxdark">
          {title ? (
            <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">{title}</h3>
            </div>
          ) : null}
          <div className="p-7">{children}</div>
        </div>
        <div className="mt-auto pt-4">
          <Footer />
        </div>
      </div>
    </DefaultLayout>
  );
}
