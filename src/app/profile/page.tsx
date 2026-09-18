"use client";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { useState, useEffect } from "react";
import { getSessionData } from "@/utils/session";
import { IUserProfile } from "@/types";
import { CalendarClock, Clock, IdCard, Mail, Phone, User } from "lucide-react";
import withAuth from "@/utils/withAuth";
import DataLoader from "@/components/common/DataLoader";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

function Profile() {
  const [userProfile, setUserProfile] = useState<IUserProfile | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const details = await getSessionData("userProfile");
        console.log("User Profile Details", details);
        if (details) {
          setUserProfile(details);
        }
      } catch (error) {
        console.error("Error fetching session data:", error);
      }
    };
    fetchUserData();
  }, []);

  if (!userProfile) {
    return (
      <div className="flex h-screen items-center justify-center">
        <DataLoader />
      </div>
    );
  }

  return (
    <DefaultLayout>
      <div className="mx-auto w-full min-w-0 max-w-242.5">
        <Breadcrumb pageName="Profile" />
        <div className="overflow-hidden rounded-2xl border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark sm:rounded-3xl">
          <div className="relative z-20 h-28 overflow-hidden bg-[#1E40AF] sm:h-35 md:h-65">
            <svg
              preserveAspectRatio="xMidYMid slice"
              viewBox="10 10 80 80"
              className="absolute inset-0 h-full w-full"
            >
              <path
                fill="#1D4ED8"
                className="out-top"
                d="M37-5C25.1-14.7,5.7-19.1-9.2-10-28.5,1.8-32.7,31.1-19.8,49c15.5,21.5,52.6,22,67.2,2.3C59.4,35,53.7,8.5,37-5Z"
              />
              <path
                fill="#2563EB"
                className="in-top"
                d="M20.6,4.1C11.6,1.5-1.9,2.5-8,11.2-16.3,23.1-8.2,45.6,7.4,50S42.1,38.9,41,24.5C40.2,14.1,29.4,6.6,20.6,4.1Z"
              />
              <path
                fill="#0EA5E9"
                className="out-bottom"
                d="M105.9,48.6c-12.4-8.2-29.3-4.8-39.4.8-23.4,12.8-37.7,51.9-19.1,74.1s63.9,15.3,76-5.6c7.6-13.3,1.8-31.1-2.3-43.8C117.6,63.3,114.7,54.3,105.9,48.6Z"
              />
              <path
                fill="#38BDF8"
                className="in-bottom"
                d="M102,67.1c-9.6-6.1-22-3.1-29.5,2-15.4,10.7-19.6,37.5-7.6,47.8s35.9,3.9,44.5-12.5C115.5,92.6,113.9,74.6,102,67.1Z"
              />
            </svg>
          </div>

          <div className="px-3 pb-6 text-center sm:px-4 lg:pb-8 xl:pb-11.5">
            <div className="relative z-30 mx-auto -mt-12 flex items-center justify-center sm:-mt-20 md:-mt-22">
              <div className="rounded-full bg-white/20 p-1.5 backdrop-blur sm:p-2">
                <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-gradient-to-tr from-primary to-hover sm:h-32 sm:w-32 md:h-40 md:w-40">
                  <User className="h-12 w-12 text-white sm:h-16 sm:w-16 md:h-22 md:w-22" />
                </div>
              </div>
            </div>
            <div className="mt-3 sm:mt-4">
              <h3 className="mb-1.5 break-words px-1 text-xl font-semibold text-black dark:text-white sm:text-2xl">
                {userProfile.firstName} {userProfile.lastName}
              </h3>
              <p className="mb-4 px-2 text-sm font-medium sm:text-base">
                {userProfile.userRole.description}
              </p>

              {userProfile.status === "ACT" ||
              userProfile.status === "ACTIVE" ? (
                <span className="inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-300 sm:px-4 sm:py-1.5 sm:text-sm">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75"></span>
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-600 dark:bg-green-400"></span>
                  </span>
                  {userProfile.statusDescription || "Active"}
                </span>
              ) : (
                <span className="inline-flex items-center gap-2 rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-800 dark:bg-red-900 dark:text-red-300 sm:px-4 sm:py-1.5 sm:text-sm">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-500"></span>
                  {userProfile.status}
                </span>
              )}

              <div className="mx-auto mt-5 grid w-full max-w-3xl grid-cols-1 gap-3 sm:mt-6 sm:grid-cols-2">
                {[
                  {
                    label: "Last Logged Date",
                    value: userProfile.lastLoggedDate,
                    icon: Clock,
                  },
                  {
                    label: "Password Expired Date",
                    value: userProfile.passwordExpiredDate,
                    icon: CalendarClock,
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex min-w-0 items-center gap-3 rounded-2xl border border-stroke bg-gray-50/80 p-3 text-left shadow-sm dark:border-strokedark dark:bg-gray-800/60 sm:gap-4 sm:p-4"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary sm:h-12 sm:w-12">
                      <item.icon className="h-5 w-5 sm:h-6 sm:w-6" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400 sm:text-[11px]">
                        {item.label}
                      </p>
                      <p className="mt-1 break-all text-sm font-semibold text-black dark:text-white sm:text-[15px]">
                        {item.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mx-auto mt-6 w-full max-w-3xl sm:mt-8">
                <div className="mb-4 flex items-center gap-2 sm:mb-5 sm:gap-3">
                  <div className="h-px min-w-0 flex-1 bg-stroke dark:bg-strokedark" />
                  <p className="shrink-0 text-[10px] font-semibold uppercase tracking-[0.12em] text-gray-400 sm:text-[11px] sm:tracking-[0.2em]">
                    Personal Details
                  </p>
                  <div className="h-px min-w-0 flex-1 bg-stroke dark:bg-strokedark" />
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {[
                    {
                      label: "User Name",
                      value: userProfile.username,
                      icon: User,
                    },
                    {
                      label: "Mobile No",
                      value: userProfile.mobile,
                      icon: Phone,
                    },
                    {
                      label: "NIC",
                      value: userProfile.nic,
                      icon: IdCard,
                    },
                    {
                      label: "E-Mail",
                      value: userProfile.email || "Unavailable",
                      icon: Mail,
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="flex min-w-0 items-center gap-3 rounded-2xl border border-stroke bg-gray-50/80 p-3 text-left shadow-sm dark:border-strokedark dark:bg-gray-800/60 sm:gap-4 sm:p-4"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary sm:h-12 sm:w-12">
                        <item.icon className="h-5 w-5 sm:h-6 sm:w-6" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400 sm:text-[11px]">
                          {item.label}
                        </p>
                        <p className="mt-1 break-all text-sm font-semibold text-black dark:text-white sm:text-[15px]">
                          {item.value}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
}

export default withAuth(Profile);
