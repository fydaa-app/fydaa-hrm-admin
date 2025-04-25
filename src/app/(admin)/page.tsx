"use client";
import React , { useEffect } from "react";
import {TodaySale} from "@/components/ecommerce/TodaySale";
import RecentOrders from "@/components/ecommerce/RecentOrders";
import { useRouter } from "next/navigation";
import  { storageService }  from "@/helpers/storage";

interface Session {
  token: string;
  accessToken: string;
  refreshToken: string;
}

export default function Ecommerce() {
  const router = useRouter();

  useEffect(() => {

    const session = storageService.get<Session>('session');
    const token = session?.token ?? 'invalid';

    if (!token) {
      console.error("Authorization token is missing");
      router.push("/signin");
    }
  }, [router]);

  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12 space-y-6 ">
        <TodaySale />
        <RecentOrders/>
      </div>
    </div>
  );
}

