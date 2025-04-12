"use client";
import React , { useEffect } from "react";
import MonthlyTarget from "@/components/ecommerce/MonthlyTarget";
import MonthlySalesChart from "@/components/ecommerce/MonthlySalesChart";
import RecentOrders from "@/components/ecommerce/RecentOrders";
import DemographicCard from "@/components/ecommerce/DemographicCard";
import TargetVsRealityChart from "@/components/ecommerce/TargetvsRealityChart";
import TopProducts from "@/components/ecommerce/TopProducts";
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

        <MonthlySalesChart />
      </div>

      <div className="col-span-12 xl:col-span-5">
        <MonthlyTarget />
      </div>

      <div className="col-span-12 xl:col-span-6">
        <TopProducts />
      </div>

      <div className="col-span-12 xl:col-span-6">
        <TargetVsRealityChart /> 
      </div>

      <div className="col-span-12 xl:col-span-5">
        <DemographicCard />
      </div>

      <div className="col-span-12 xl:col-span-7">
        <RecentOrders />
      </div>
    </div>
  );
}
