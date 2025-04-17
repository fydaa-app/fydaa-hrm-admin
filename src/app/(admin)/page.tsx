"use client";
import React , { useEffect } from "react";
import {TodaySale} from "@/components/ecommerce/TodaySale";
import Cookies from 'js-cookie';
import { useRouter } from "next/navigation";


export default function Ecommerce() {
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get("accessToken");
    if (!token) {
      console.error("Authorization token is missing");
      router.push("/signin");
    }
  }, [router]);

  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12 space-y-6 xl:col-span-7">
        <TodaySale />
      </div>
    </div>
  );
}
