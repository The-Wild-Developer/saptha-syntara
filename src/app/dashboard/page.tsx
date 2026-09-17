"use client";

import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Footer from "@/components/Footer/Footer";
import withAuth from "@/utils/withAuth";
import { useEffect, useState } from "react";
import { getSessionData } from "@/utils/session";
import { IUserProfile } from "@/types";
import DataLoader from "@/components/common/DataLoader";
import Dashboard from "@/components/Dashboard/Dashboard";

function Home() {
  const [userProfile, setUserProfile] = useState<IUserProfile | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const details = await getSessionData("userProfile");
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
      <div className="flex min-h-[calc(100vh-8rem)] flex-1 flex-col">
        <Dashboard userProfile={userProfile} />
        <div className="mt-auto pt-6">
          <Footer />
        </div>
      </div>
    </DefaultLayout>
  );
}

export default withAuth(Home);
