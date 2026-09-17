"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { Loader2, Save } from "lucide-react";
import { FormEvent, ReactNode } from "react";

interface AddFormLayoutProps {
  pageName: string;
  title: string;
  submitLabel: string;
  loading?: boolean;
  onSubmit: (e: FormEvent) => void;
  children: ReactNode;
  submitIcon?: ReactNode;
}

export default function AddFormLayout({
  pageName,
  title,
  submitLabel,
  loading = false,
  onSubmit,
  children,
  submitIcon,
}: AddFormLayoutProps) {
  return (
    <DefaultLayout>
      <Breadcrumb pageName={pageName} />

      <div className="grid grid-cols-1">
        <div className="flex flex-col gap-9">
          <div className="rounded-2xl border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">{title}</h3>
            </div>
            <form onSubmit={onSubmit}>
              <div className="p-6.5">
                {children}
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center justify-center gap-2 rounded-lg bg-primary p-3 px-8 py-2 font-medium text-gray hover:bg-hover disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    submitIcon || <Save className="h-5 w-5" />
                  )}
                  {loading ? "Saving..." : submitLabel}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
}
