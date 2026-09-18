"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import SidebarItem from "@/components/Sidebar/SidebarItem";
import ClickOutside from "@/components/ClickOutside";
import useLocalStorage from "@/hooks/useLocalStorage";
import {
  LayoutDashboard,
  User,
  X,
  Cog,
  Building2,
  Layers,
  Users,
  Factory,
  Plus,
  Eye,
  UserPlus,
  Boxes,
  Network,
  CalendarDays,
  ClipboardList,
  SquareKanban,
} from "lucide-react";
import { getSessionData } from "@/utils/session";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
  sidebarCollapsed: boolean;
}

const Sidebar = ({
  sidebarOpen,
  setSidebarOpen,
  sidebarCollapsed,
}: SidebarProps) => {
  const [pageName, setPageName] = useLocalStorage("selectedMenu", "dashboard");
  const [menuGroups, setMenuGroups] = useState<any[]>([]);

  useEffect(() => {
    const sessionPages = getSessionData("pages");

    if (sessionPages) {
      setMenuGroups([
        {
          name: "MENU",
          menuItems: [
            {
              icon: <LayoutDashboard className="h-5 w-5" />,
              label: "Dashboard",
              route: "/dashboard",
            },
            {
              icon: <Layers className="h-5 w-5" />,
              label: "Group Management",
              route: "#",
              children: [
                {
                  icon: <Plus className="h-5 w-5" />,
                  label: "Add Group",
                  route: "/manage/add-group",
                },
                {
                  icon: <Eye className="h-5 w-5" />,
                  label: "View Group",
                  route: "/manage/view-group",
                },
              ],
            },
            {
              icon: <Building2 className="h-5 w-5" />,
              label: "Company Management",
              route: "#",
              children: [
                {
                  icon: <Plus className="h-5 w-5" />,
                  label: "Add Company",
                  route: "/manage/add-company",
                },
                {
                  icon: <Eye className="h-5 w-5" />,
                  label: "View Company",
                  route: "/manage/view-company",
                },
              ],
            },
            {
              icon: <Boxes className="h-5 w-5" />,
              label: "Section Management",
              route: "#",
              children: [
                {
                  icon: <Plus className="h-5 w-5" />,
                  label: "Add Section",
                  route: "/manage/add-section",
                },
                {
                  icon: <Eye className="h-5 w-5" />,
                  label: "View Section",
                  route: "/manage/view-section",
                },
              ],
            },
            {
              icon: <Users className="h-5 w-5" />,
              label: "Employee Management",
              route: "#",
              children: [
                {
                  icon: <UserPlus className="h-5 w-5" />,
                  label: "Add Employees",
                  route: "/employees/add",
                },
                {
                  icon: <Eye className="h-5 w-5" />,
                  label: "View Employees",
                  route: "/employees/view",
                },
              ],
            },
            {
              icon: <ClipboardList className="h-5 w-5" />,
              label: "Order Book Management",
              route: "#",
              children: [
                {
                  icon: <Plus className="h-5 w-5" />,
                  label: "Add Order",
                  route: "/order-book/add",
                },
                {
                  icon: <Eye className="h-5 w-5" />,
                  label: "View Order Details",
                  route: "/order-book/view",
                },
              ],
            },
            {
              icon: <Factory className="h-5 w-5" />,
              label: "Production Line Management",
              route: "#",
              children: [
                {
                  icon: <Plus className="h-5 w-5" />,
                  label: "Create Production Line",
                  route: "/production-line/create",
                },
                {
                  icon: <Eye className="h-5 w-5" />,
                  label: "View Production Line",
                  route: "/production-line/view",
                },
              ],
            },
            {
              icon: <Network className="h-5 w-5" />,
              label: "Hierarchy Management",
              route: "/hierarchy",
            },
            {
              icon: <CalendarDays className="h-5 w-5" />,
              label: "Calendar Management",
              route: "/calendar",
            },
            {
              icon: <SquareKanban className="h-5 w-5" />,
              label: "Production Planning Board",
              route: "/production-planning",
            },
          ],
        },
        {
          name: "OTHERS",
          menuItems: [
            {
              icon: <User className="h-5 w-5" />,
              label: "Profile",
              route: "/profile",
            },
            {
              icon: <Cog className="h-5 w-5" />,
              label: "Settings",
              route: "/settings",
            },
          ],
        },
      ]);
    }
  }, []);

  return (
    <ClickOutside onClick={() => setSidebarOpen(false)}>
      <aside
        className={`fixed left-0 top-0 z-9999 flex h-screen flex-col overflow-hidden border-r border-white bg-gray-50 transition-all duration-300 ease-in-out dark:border-boxdark-2 dark:bg-boxdark md:z-999 lg:translate-x-0 ${sidebarCollapsed ? "w-75 lg:w-20" : "w-75"
          } ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* <!-- SIDEBAR HEADER --> */}
        <div
          className={`m-0 mt-0 flex items-center justify-between gap-2 px-2 py-1 transition-all duration-300 ease-in-out md:px-6 lg:py-1 ${sidebarCollapsed
            ? "lg:flex-col lg:justify-center lg:px-0"
            : "lg:justify-center lg:px-6"
            }`}
        >
          <Link href="/dashboard">
            <div
              className={`relative mx-0 my-4 flex h-10 items-center justify-center transition-all duration-300 ease-in-out ${sidebarCollapsed ? "lg:my-3 lg:h-9 lg:w-9" : "lg:h-12 lg:w-45"
                }`}
            >
              <img
                className={`w-40 object-contain transition-all duration-300 ease-in-out md:w-45 ${sidebarCollapsed
                  ? "lg:pointer-events-none lg:absolute lg:scale-75 lg:opacity-0"
                  : "opacity-100"
                  }`}
                src="/images/logo/logo.png"
                alt="Logo"
              />
              <img
                className={`absolute object-contain transition-all duration-300 ease-in-out ${sidebarCollapsed
                  ? "hidden w-9 opacity-100 lg:block"
                  : "pointer-events-none hidden w-9 scale-75 opacity-0 lg:block"
                  }`}
                src="/images/logo/favicon.png"
                alt="Logo"
              />
            </div>
          </Link>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="block lg:hidden"
          >
            <X className="h-6 w-6 hover:text-red-500" />
          </button>
        </div>
        {/* <!-- SIDEBAR HEADER --> */}

        <div className="no-scrollbar flex min-h-0 flex-1 flex-col overflow-y-auto overflow-x-hidden overscroll-contain">
          {/* <!-- Sidebar Menu --> */}
          <nav
            className={`-mt-4 py-4 transition-all duration-300 ease-in-out md:-mt-4 ${sidebarCollapsed
              ? "px-2 md:px-2 lg:flex lg:flex-col lg:items-center lg:px-0"
              : "px-2 md:px-2"
              }`}
          >
            {menuGroups.map((group, groupIndex) => (
              <div key={groupIndex}>
                {sidebarCollapsed && groupIndex > 0 && (
                  <div className="mx-auto mb-4 hidden h-px w-8 bg-stroke transition-all duration-300 dark:bg-strokedark lg:block" />
                )}
                <h3
                  className={`mb-4 ml-4 overflow-hidden whitespace-nowrap text-sm font-semibold text-bodydark2 transition-all duration-300 ease-in-out ${sidebarCollapsed
                    ? "lg:mb-0 lg:ml-0 lg:h-0 lg:opacity-0"
                    : "opacity-100"
                    }`}
                >
                  {group.name}
                </h3>

                <ul
                  className={`mb-6 flex flex-col gap-1.5 transition-all duration-300 ease-in-out ${sidebarCollapsed ? "lg:items-center" : ""
                    }`}
                >
                  {group.menuItems.map((menuItem: any, menuIndex: number) => (
                    <SidebarItem
                      key={menuIndex}
                      item={menuItem}
                      pageName={pageName}
                      setPageName={setPageName}
                      collapsed={sidebarCollapsed}
                    />
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div
          className={`mx-2 mt-auto flex items-center justify-center overflow-hidden py-1.5 transition-all duration-300 ease-in-out ${sidebarCollapsed
            ? "lg:h-0 lg:opacity-0 lg:pointer-events-none"
            : "opacity-100"
            }`}
        >
          <div className="flex items-center">
            <span className="text-xs font-semibold text-black dark:text-white">
              Powered By
            </span>
            <img
              className="ml-1 w-30"
              src="/images/logo/logo.png"
              alt="Company Logo"
            />
          </div>
        </div>
      </aside>
    </ClickOutside>
  );
};

export default Sidebar;
