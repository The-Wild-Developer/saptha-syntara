import React from "react";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="rounded-xl border border-stroke bg-white  dark:border-strokedark dark:bg-boxdark">
      <div className="flex w-full  flex-col items-center p-4 text-center md:flex-row md:justify-between">
        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
          © {currentYear} <span className="font-semibold">Saptha Syntara</span>. All
          Rights Reserved.
        </span>
        <ul className="mt-3 flex flex-col items-center text-sm font-medium text-gray-500 dark:text-gray-400 md:mt-0 md:flex-row">
          <li>Version 1.2.6</li>
        </ul>
      </div>
    </footer>
  );
}
