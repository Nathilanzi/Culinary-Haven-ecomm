"use client";

/**
 * @fileoverview SignIn component that handles user authentication through email/password and Google OAuth
 * @requires react
 * @requires next-auth/react
 * @requires next/navigation
 * @requires lucide-react
 * @requires next/link
 * @requires next/image
 * @requires @/components/Alert
 */

import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Alert from "@/components/Alert";

/**
 * SignIn component for user authentication
 * @returns {JSX.Element} The SignIn form component
 */
export default function SignIn() {
  // Initialize hooks for routing and session management
  const router = useRouter();
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();

  // Get callback URL from search params or default to home
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  // Initialize state variables
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [alert, setAlert] = useState({
    show: false,
    message: "",
    type: "success",
  });

  /**
   * Check for redirect message from signup page
   */
  useEffect(() => {
    const signupSuccess = searchParams.get("signupSuccess");
    if (signupSuccess === "true") {
      setAlert({
        show: true,
        message: "Account created successfully! Please sign in to continue.",
        type: "success",
      });
    }
  }, [searchParams]);

  /**
   * Redirect authenticated users
   */
  useEffect(() => {
    if (status === "authenticated" && session) {
      router.push(callbackUrl);
    }
  }, [session, status, router, callbackUrl]);

  /**
   * Handle form input changes
   * @param {React.ChangeEvent<HTMLInputElement>} e - The input change event
   */
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /**
   * Handle form submission for credentials login
   * @param {React.FormEvent<HTMLFormElement>} e - The form submission event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setAlert({ show: false, message: "", type: "success" });

    try {
      // Attempt to sign in with credentials
      const result = await signIn("credentials", {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });

      if (result?.error) {
        // Handle authentication error
        setError(result.error);
        setAlert({
          show: true,
          message: "Invalid email or password. Please try again.",
          type: "error",
        });
      } else {
        // Handle successful login
        setAlert({
          show: true,
          message: "Successfully logged in! Redirecting...",
          type: "success",
        });

        // Delay redirect to show success message
        setTimeout(() => {
          router.push(callbackUrl);
          router.refresh();
        }, 3000);
      }
    } catch (error) {
      // Handle unexpected errors
      setError("An unexpected error occurred");
      setAlert({
        show: true,
        message: "Failed to login. Please try again later.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle Google OAuth sign-in
   */
  const handleGoogleSignIn = () => {
    setLoading(true);
    signIn("google", { callbackUrl, redirect: true });
  };

  // Show loading spinner while checking authentication status
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Return null if user is authenticated
  if (status === "authenticated") {
    return null;
  }

  // Render sign-in form
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-10">
      {/* Alert component for displaying messages */}
      <Alert
        message={alert.message}
        type={alert.type}
        isVisible={alert.show}
        onClose={() => setAlert({ ...alert, show: false })}
      />

      <div className="w-full max-w-md p-8 bg-white rounded-3xl shadow-lg">
        {/* Header section with logo and welcome message */}
        <div className="text-center mb-8">
          {/* Logo */}
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-4">
            <Image
              src="/logo.png"
              width={100}
              height={100}
              alt="Logo"
              className="h-10 w-12"
            />
          </div>
          {/* Welcome text */}
          <h2 className="text-2xl font-semibold text-gray-900">
            Welcome back to Calinary Haven
          </h2>
          <p className="mt-2 text-gray-600">
            Please enter your details to sign in
          </p>
        </div>

        {/* Google Sign-in button */}
        <div className="flex items-center justify-center">
          {/* Google OAuth button */}
          <button
            onClick={handleGoogleSignIn}
            className="flex items-center px-16 justify-center p-3 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            {/* Google icon SVG */}
            <svg viewBox="0 0 24 24" className="w-6 h-6">
              <path
                d="M12,5c1.6167603,0,3.1012573,0.5535278,4.2863159,1.4740601l3.637146-3.4699707 C17.8087769,1.1399536,15.0406494,0,12,0C7.392395,0,3.3966675,2.5999146,1.3858032,6.4098511l4.0444336,3.1929321 C6.4099731,6.9193726,8.977478,5,12,5z"
                fill="#EA4335"
              />
              <path
                d="M23.8960571,13.5018311C23.9585571,13.0101929,24,12.508667,24,12 c0-0.8578491-0.093689-1.6931763-0.2647705-2.5H12v5h6.4862061c-0.5247192,1.3637695-1.4589844,2.5177612-2.6481934,3.319458 l4.0594482,3.204834C22.0493774,19.135437,23.5219727,16.4903564,23.8960571,13.5018311z"
                fill="#4285F4"
              />
              <path
                d="M5,12c0-0.8434448,0.1568604-1.6483765,0.4302368-2.3972168L1.3858032,6.4098511 C0.5043335,8.0800171,0,9.9801636,0,12c0,1.9972534,0.4950562,3.8763428,1.3582153,5.532959l4.0495605-3.1970215 C5.1484375,13.6044312,5,12.8204346,5,12z"
                fill="#FBBC05"
              />
              <path
                d="M12,19c-3.0455322,0-5.6295776-1.9484863-6.5922241-4.6640625L1.3582153,17.532959 C3.3592529,21.3734741,7.369812,24,12,24c3.027771,0,5.7887573-1.1248169,7.8974609-2.975708l-4.0594482-3.204834 C14.7412109,18.5588989,13.4284058,19,12,19z"
                fill="#34A853"
              />
            </svg>
            <p className="ml-2">Sign in with Google</p>
          </button>
        </div>

        {/* Divider */}
        <div className="relative my-3">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">or</span>
          </div>
        </div>

        {/* Credentials sign-in form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Error message display */}
          {error && (
            <div className="p-3 text-sm text-red-500 bg-red-50 rounded-lg">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <input
              name="email"
              type="email"
              required
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-teal-950 focus:border-teal-950"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                required
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-teal-950 focus:border-teal-950"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-teal-950 hover:bg-teal-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-950"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        {/* Sign-up link */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Don&apos;t have an account?
          <Link
            href="/auth/signup"
            className="font-medium ml-1 text-green-900 hover:text-green-800"
          >
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
}
