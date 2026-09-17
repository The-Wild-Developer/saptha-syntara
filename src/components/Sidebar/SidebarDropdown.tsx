import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const SidebarDropdown = ({ item }: any) => {
  const pathname = usePathname();

  return (
    <>
      <ul className="mb-5.5 mt-4 flex flex-col gap-1.5 pl-0">
        {item.map((item: any, index: number) => {
          const isItemActive = pathname === item.route;

          return (
            <li key={index}>
              <Link
                href={item.route}
                className={`${
                  isItemActive
                    ? "border-primary bg-gradient-to-b from-primary to-hover text-white shadow-inner hover:text-white dark:text-white"
                    : "border-white bg-gradient-to-b from-gray-200 to-gray-100 hover:text-gray-700 dark:border-gray-700 dark:from-gray-900 dark:to-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                } group relative flex items-center gap-2 rounded-full border-2 px-5 py-2 text-sm font-bold text-gray-500 shadow-md transition-all duration-300 ease-in-out hover:shadow-lg`}
              >
                <span
                  className={`text-xl transition-colors duration-300 ${
                    isItemActive
                      ? "text-white"
                      : "text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-200"
                  }`}
                >
                  {item.icon}
                </span>
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
};

export default SidebarDropdown;
