"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Pagination from "@/components/tables/Pagination";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";
import { advisorServiceApi } from "@/services/advisorServiceApi";
import CreateAdvisor from "@/components/advisor/CreateAdvisor";
import AdvisorTable from "@/components/advisor/AdvisorTable";

interface AdvisorList {
  id: number;
  name: string;
  mobile: string;
  email: string;
  description: string;
  age: number;
  experienceInYears: number;
  photo: string;
  attachment1?: string;
  attachment2?: string;
  isActive: boolean;
}

interface AdvisorApiResponse {
  advisors: AdvisorList[];
  error: string | null;
  totalCount: number;
  totalPages: number;
}

// TODO: This function calls the API to fetch advisors
// Make sure advisorServiceApi.getAdvisors is properly connected to backend
async function fetchAdvisors(
  page: number,
  searchQuery: string = ""
): Promise<AdvisorApiResponse> {
  try {
    // TODO: Ensure this API call returns the correct response structure
    const response = await advisorServiceApi.getAdvisors({
      page,
      search: searchQuery,
    });
    
    // TODO: Adjust this type assertion based on your actual API response structure
    
    const responseData = response.data as {
      data:AdvisorList[];
      pagination: {
        limit:number;
        page:number;
        total:number;
        totalPages:number;
      };
    };
    console.log("API Response:", responseData.data);

    return {
      advisors: responseData.data,
      totalCount: responseData.pagination.total,
      totalPages: responseData.pagination.totalPages,
      error: null,
    };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error
      ? error.message
      : "Failed to fetch Advisors";

    toast.error(errorMessage);

    return {
      advisors: [],
      totalCount: 0,
      totalPages: 0,
      error: errorMessage,
    };
  }
}

// Search component with debounced URL-based search
function SearchWrapper() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const query = searchParams.get("search") || "";
    setSearchQuery(query);
  }, [searchParams]);

  const updateSearchQuery = (value: string) => {
    setSearchQuery(value);
    
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    
    debounceTimeoutRef.current = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      
      if (value) {
        params.set("search", value);
      } else {
        params.delete("search");
      }
      
      router.push(`?${params.toString()}`, { scroll: false });
    }, 300);
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if ((event.metaKey || event.ctrlKey) && event.key === "k") {
      event.preventDefault();
      inputRef.current?.focus();
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="relative search-box">
      <span className="absolute -translate-y-1/2 left-4 top-1/2 pointer-events-none">
        <svg
          className="fill-gray-500 dark:fill-gray-400"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M3.04175 9.37363C3.04175 5.87693 5.87711 3.04199 9.37508 3.04199C12.8731 3.04199 15.7084 5.87693 15.7084 9.37363C15.7084 12.8703 12.8731 15.7053 9.37508 15.7053C5.87711 15.7053 3.04175 12.8703 3.04175 9.37363ZM9.37508 1.54199C5.04902 1.54199 1.54175 5.04817 1.54175 9.37363C1.54175 13.6991 5.04902 17.2053 9.37508 17.2053C11.2674 17.2053 13.003 16.5344 14.357 15.4176L17.177 18.238C17.4699 18.5309 17.9448 18.5309 18.2377 18.238C18.5306 17.9451 18.5306 17.4703 18.2377 17.1774L15.418 14.3573C16.5365 13.0033 17.2084 11.2669 17.2084 9.37363C17.2084 5.04817 13.7011 1.54199 9.37508 1.54199Z"
            fill=""
          />
        </svg>
      </span>
      <input
        ref={inputRef}
        type="text"
        value={searchQuery}
        onChange={(e) => updateSearchQuery(e.target.value)}
        placeholder="Search advisors..."
        className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-200 bg-transparent py-2.5 pl-12 pr-14 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900 dark:bg-white/[0.03] dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 xl:w-full"
      />
    </div>
  );
}

// Main client component
function AdvisorListClient() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [advisors, setAdvisors] = useState<AdvisorList[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [isSearching, setIsSearching] = useState(false);

  const searchParams = useSearchParams();
  
  // TODO: This function fetches advisor data - ensure backend API is connected
  const fetchData = useCallback(async () => {
    try {
      setIsSearching(true);
      const query = searchParams ? searchParams.get("search") || "" : "";
      
      const { advisors, error, totalCount, totalPages } =
        await fetchAdvisors(page, query);

      setAdvisors(advisors);
      setError(error);
      setTotalCount(totalCount);
      setTotalPages(totalPages);
    } catch (err) {
      console.error("Error in fetchData:", err);
      setError("Failed to load data");
    } finally {
      setIsSearching(false);
    }
  }, [page, searchParams]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <div>
      <PageBreadcrumb pageTitle="Advisor" />
      <div className="space-y-6">
        <ComponentCard title="Advisor List">
          <div className="flex justify-self-end">
            <SearchWrapper />
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-auto inline-flex bg-brand-500 text-white hover:bg-brand-600 
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 px-4 py-2 
              rounded-lg text-sm font-medium disabled:opacity-70 disabled:cursor-not-allowed ml-1"
            >
              Create New Advisor
            </button>
          </div>

          <CreateAdvisor
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              fetchData(); // Refresh data after creating
            }}
          />
          
          {isSearching ? (
            <div className="flex justify-center py-8">
              <svg
                className="animate-spin h-8 w-8 text-gray-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </div>
          ) : (
            <>
              <AdvisorTable advisors={advisors} error={error} onUpdate={fetchData} />
              {totalCount > 0 && (
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              )}
            </>
          )}
        </ComponentCard>
      </div>
    </div>
  );
}

// Main page with Suspense wrapper
export default function AdvisorListPage() {
  return (
    <React.Suspense fallback={<div>Loading advisor data...</div>}>
      <AdvisorListClient />
    </React.Suspense>
  );
}

