"use client";
import Link from "next/link";
import DarkModeSwitcher from "./DarkModeSwitcher";
import DropdownUser from "./DropdownUser";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ChevronLeft } from "lucide-react";

const Header = (props: {
  sidebarOpen: string | boolean | undefined;
  setSidebarOpen: (arg0: boolean) => void;
  sidebarCollapsed?: boolean;
  setSidebarCollapsed?: (arg0: boolean) => void;
}) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  return (
    <header className="sticky top-0 z-99 flex w-full bg-white drop-shadow-1 dark:bg-boxdark dark:drop-shadow-none">
      <div className="flex flex-grow items-center justify-between px-4 py-4 shadow-2 md:px-6 2xl:px-11">
        <div className="flex items-center gap-2 sm:gap-4">
          {/* <!-- Hamburger Toggle BTN --> */}
          <button
            aria-controls="sidebar"
            onClick={(e) => {
              e.stopPropagation();
              props.setSidebarOpen(!props.sidebarOpen);
            }}
            className="z-99999 block rounded-md border border-stroke bg-white p-1.5 shadow-sm dark:border-gray-600 dark:bg-boxdark lg:hidden"
          >
            <span className="relative block h-5.5 w-5.5 cursor-pointer">
              <span className="du-block absolute right-0 h-full w-full">
                <span
                  className={`relative left-0 top-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-[0] duration-200 ease-in-out dark:bg-white ${
                    !props.sidebarOpen && "!w-full delay-300"
                  }`}
                ></span>
                <span
                  className={`relative left-0 top-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-150 duration-200 ease-in-out dark:bg-white ${
                    !props.sidebarOpen && "delay-400 !w-full"
                  }`}
                ></span>
                <span
                  className={`relative left-0 top-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-200 duration-200 ease-in-out dark:bg-white ${
                    !props.sidebarOpen && "!w-full delay-500"
                  }`}
                ></span>
              </span>
              <span className="absolute right-0 h-full w-full rotate-45">
                <span
                  className={`absolute left-2.5 top-0 block h-full w-0.5 rounded-sm bg-black delay-300 duration-200 ease-in-out dark:bg-white ${
                    !props.sidebarOpen && "!h-0 !delay-[0]"
                  }`}
                ></span>
                <span
                  className={`delay-400 absolute left-0 top-2.5 block h-0.5 w-full rounded-sm bg-black duration-200 ease-in-out dark:bg-white ${
                    !props.sidebarOpen && "!h-0 !delay-200"
                  }`}
                ></span>
              </span>
            </span>
          </button>
          {/* <!-- Hamburger Toggle BTN --> */}

          <Link className="block flex-shrink-0 lg:hidden" href="/dashboard">
            <img
              className="w-9"
              src="/saptha-syntara/images/logo/favicon.png"
              alt="Logo"
            />
          </Link>

          <button
            type="button"
            aria-label={
              props.sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"
            }
            onClick={() =>
              props.setSidebarCollapsed?.(!props.sidebarCollapsed)
            }
            className="hidden h-10 w-10 items-center justify-center rounded-full border border-stroke bg-gray-100 text-gray-600 shadow-sm transition-all duration-300 ease-in-out hover:border-primary hover:bg-primary hover:text-white dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-primary dark:hover:bg-primary dark:hover:text-white lg:flex"
          >
            <ChevronLeft
              className={`h-5 w-5 transition-transform duration-300 ease-in-out ${
                props.sidebarCollapsed ? "rotate-180" : "rotate-0"
              }`}
            />
          </button>

          <div className="hidden sm:block">
            <div className="relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="text-xl font-bold"
              >
                {time.toLocaleTimeString()}
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
                className="mt-0 text-sm text-gray-400"
              >
                {time.toDateString()}
              </motion.div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 2xsm:gap-7">
          <ul className="flex items-center gap-2 2xsm:gap-4">
            {/* <!-- Dark Mode Toggler --> */}
            <DarkModeSwitcher />
          </ul>

          {/* <!-- User Area --> */}
          <DropdownUser />
          {/* <!-- User Area --> */}
        </div>
      </div>
    </header>
  );
};

export default Header;
