"use client";
import Checkbox from "@/components/form/input/Checkbox";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import { EyeCloseIcon, EyeIcon } from "@/icons";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { authServiceApi } from "@/services/authServiceApi";
import { useRouter } from "next/navigation";
import Cookies from 'js-cookie';

// Define a proper error type
interface ApiError {
  response?: {
    status: number;
    data?: {
      message?: string;
    };
  };
  request?: unknown;
  message?: string;
}

// Define the expected response type
interface LoginResponse {
  data: {
    token: string;
    refreshToken?: string;
  };
}

export default function SignInForm() {
  const router = useRouter();
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    if (user.email.length > 0 && user.password.length > 0) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [user]);

  const onSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      setErrorMessage(""); // Clear any previous errors

      const response = await authServiceApi.loginWithCredentials(user) as LoginResponse;
      
      // Store tokens directly in cookies
      if (response.data && response.data.token) {
        Cookies.set("accessToken", response.data.token);

        if (response.data.refreshToken) {
          Cookies.set("refreshToken", response.data.refreshToken);
        }

        router.push("/");
      } else {
        // Handle case where login succeeded but no token was returned
        setErrorMessage("Login successful but no authentication token received");
      }
    } catch (err) {
      const error = err as ApiError; // Cast to our defined error type instead of any
      // console.error("Login error:", error);

      // Specifically handle authentication errors
      if (error.response) {
        console.log("Error response status:", error.response.status);
        console.log("Error response data:", error.response.data);

        // Check for 401 unauthorized status
        if (error.response.status === 401) {
          setErrorMessage("Invalid username or password. Please try again.");
        } else if (error.response.data?.message) {
          setErrorMessage(error.response.data.message);
        } else {
          setErrorMessage("An unexpected error occurred. Please try again.");
        }
      } else if (error.request) {
        // Network error
        setErrorMessage("No response from server. Please check your internet connection.");
      } else {
        // Default to unexpected error
        setErrorMessage("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Sign In
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your email and password to sign in!
            </p>
          </div>
          <div>
            <form>
              {errorMessage && (
                <div className="mb-4 text-sm text-error-500 bg-error-50 p-3 rounded">
                  {errorMessage}
                </div>
              )}
              <div className="space-y-6">
                <div>
                  <Label>
                    Email <span className="text-error-500">*</span>{" "}
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    placeholder="name@company.com"
                    type="email"
                    value={user.email}
                    onChange={(e) => setUser({ ...user, email: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label>
                    Password <span className="text-error-500">*</span>{" "}
                  </Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      id="password"
                      name="password"
                      value={user.password}
                      onChange={(e) => setUser({ ...user, password: e.target.value })}
                      required
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                      )}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Checkbox checked={isChecked} onChange={setIsChecked} />
                    <span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400">
                      Keep me logged in
                    </span>
                  </div>
                  <Link
                    href="/reset-password"
                    className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div>
                  <button
                    className="w-full inline-flex items-center justify-center bg-brand-500 text-white hover:bg-brand-600 
                              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 px-4 py-2 
                              rounded-lg text-sm font-medium disabled:opacity-70 disabled:cursor-not-allowed"
                    type="button"
                    color="primary"
                    onClick={onSignIn}
                    disabled={loading || buttonDisabled}
                  >
                    Sign in
                  </button>
                </div>
              </div>
            </form>

            <div className="mt-5">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                Don&apos;t have an account? {""}
                <Link
                  href="/signup"
                  className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  Sign Up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}