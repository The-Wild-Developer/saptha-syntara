import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import SidebarDropdown from "@/components/Sidebar/SidebarDropdown";
import { usePathname } from "next/navigation";

const SidebarItem = ({ item, pageName, setPageName, collapsed }: any) => {
  const handleClick = () => {
    const updatedPageName =
      pageName !== item.label.toLowerCase() ? item.label.toLowerCase() : "";
    return setPageName(updatedPageName);
  };

  const pathname = usePathname();
  const itemRef = useRef<HTMLLIElement>(null);
  const flyoutRef = useRef<HTMLDivElement>(null);
  const closeTimeout = useRef<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const [flyoutOpen, setFlyoutOpen] = useState(false);
  const [flyoutPos, setFlyoutPos] = useState({ top: 0, left: 0 });

  const isActive = (item: any) => {
    if (item.route === pathname) return true;
    if (item.children) {
      return item.children.some((child: any) => isActive(child));
    }
    return false;
  };

  const isItemActive = isActive(item);

  const updateFlyoutPosition = () => {
    if (!itemRef.current) return;
    const rect = itemRef.current.getBoundingClientRect();
    setFlyoutPos({ top: rect.top, left: rect.right });
  };

  const openFlyout = () => {
    if (!collapsed) return;
    if (closeTimeout.current) {
      window.clearTimeout(closeTimeout.current);
      closeTimeout.current = null;
    }
    updateFlyoutPosition();
    setFlyoutOpen(true);
  };

  const closeFlyout = () => {
    if (closeTimeout.current) {
      window.clearTimeout(closeTimeout.current);
    }
    closeTimeout.current = window.setTimeout(() => {
      setFlyoutOpen(false);
    }, 120);
  };

  useEffect(() => {
    setMounted(true);
    return () => {
      if (closeTimeout.current) {
        window.clearTimeout(closeTimeout.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!collapsed) {
      setFlyoutOpen(false);
    }
  }, [collapsed]);

  useEffect(() => {
    if (!flyoutOpen) return;

    const onReposition = () => updateFlyoutPosition();
    window.addEventListener("scroll", onReposition, true);
    window.addEventListener("resize", onReposition);

    return () => {
      window.removeEventListener("scroll", onReposition, true);
      window.removeEventListener("resize", onReposition);
    };
  }, [flyoutOpen]);

  useLayoutEffect(() => {
    if (!flyoutOpen || !flyoutRef.current) return;

    const height = flyoutRef.current.offsetHeight;
    const maxTop = Math.max(8, window.innerHeight - height - 8);
    if (flyoutPos.top > maxTop) {
      setFlyoutPos((pos) =>
        pos.top === maxTop ? pos : { ...pos, top: maxTop },
      );
    }
  }, [flyoutOpen, flyoutPos.top]);

  const flyout =
    mounted && collapsed && flyoutOpen
      ? createPortal(
          <div
            ref={flyoutRef}
            className="fixed z-99999 hidden pl-3 lg:block"
            style={{ top: flyoutPos.top, left: flyoutPos.left }}
            onMouseEnter={openFlyout}
            onMouseLeave={closeFlyout}
          >
            {item.children ? (
              <div className="min-w-52 rounded-xl border border-stroke bg-white p-2 shadow-lg dark:border-strokedark dark:bg-boxdark">
                <p className="mb-1.5 px-2 py-1 text-xs font-semibold uppercase text-bodydark2">
                  {item.label}
                </p>
                <ul className="flex flex-col gap-1.5">
                  {item.children.map((child: any, index: number) => {
                    const isChildActive = pathname === child.route;

                    return (
                      <li key={index}>
                        <Link
                          href={child.route}
                          className={`${
                            isChildActive
                              ? "border-primary bg-gradient-to-b from-primary to-hover text-white shadow-inner hover:text-white dark:text-white"
                              : "border-white bg-gradient-to-b from-gray-200 to-gray-100 hover:text-gray-700 dark:border-gray-700 dark:from-gray-900 dark:to-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                          } group/child flex items-center gap-2 rounded-full border-2 px-4 py-2 text-sm font-bold text-gray-500 shadow-md transition-all duration-300 ease-in-out hover:shadow-lg`}
                        >
                          <span
                            className={`text-xl transition-colors duration-300 ${
                              isChildActive
                                ? "text-white"
                                : "text-gray-500 group-hover/child:text-gray-700 dark:group-hover/child:text-gray-200"
                            }`}
                          >
                            {child.icon}
                          </span>
                          {child.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ) : (
              <span className="pointer-events-none whitespace-nowrap rounded-md bg-black px-2.5 py-1 text-xs font-semibold text-white shadow-lg dark:bg-white dark:text-black">
                {item.label}
              </span>
            )}
          </div>,
          document.body,
        )
      : null;

  return (
    <>
      <li
        ref={itemRef}
        className="group relative"
        onMouseEnter={openFlyout}
        onMouseLeave={closeFlyout}
      >
        <Link
          href={item.route}
          onClick={(e) => {
            if (collapsed && item.children) {
              e.preventDefault();
            }
            handleClick();
          }}
          title={collapsed ? item.label : undefined}
          className={`${
            isItemActive
              ? "border-primary bg-gradient-to-b from-primary to-hover text-white shadow-inner hover:text-white dark:text-white"
              : "border-white bg-gradient-to-b from-gray-200 to-gray-100 hover:text-gray-700 dark:border-gray-700 dark:from-gray-900 dark:to-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
          } relative flex items-center border-2 text-sm font-bold text-gray-500 shadow-md transition-all duration-300 ease-in-out hover:shadow-lg ${
            collapsed
              ? "gap-2 rounded-full px-5 py-2 lg:h-11 lg:w-11 lg:justify-center lg:gap-0 lg:p-0"
              : "gap-2 rounded-full px-5 py-2"
          }`}
        >
          <span
            className={`shrink-0 text-xl transition-colors duration-300 ${
              isItemActive
                ? "text-white"
                : "text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-200"
            }`}
          >
            {item.icon}
          </span>

          <span
            className={`overflow-hidden whitespace-nowrap transition-all duration-300 ease-in-out ${
              collapsed
                ? "lg:max-w-0 lg:opacity-0"
                : "max-w-60 opacity-100"
            }`}
          >
            {item.label}
          </span>
          {item.children && (
            <svg
              className={`absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-gray-300 bg-opacity-40 fill-current p-1 transition-all duration-300 ease-in-out dark:bg-white dark:bg-opacity-10 ${
                collapsed
                  ? "lg:pointer-events-none lg:opacity-0"
                  : "opacity-100"
              } ${pageName === item.label.toLowerCase() && "rotate-180"}`}
              width="22"
              height="22"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
                fill=""
              />
            </svg>
          )}
        </Link>

        {item.children && (
          <div
            className={`translate transform overflow-hidden ${
              collapsed ? "lg:hidden" : ""
            } ${pageName !== item.label.toLowerCase() && "hidden"}`}
          >
            <SidebarDropdown item={item.children} />
          </div>
        )}
      </li>
      {flyout}
    </>
  );
};

export default SidebarItem;
