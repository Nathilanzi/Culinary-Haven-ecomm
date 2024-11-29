"use client";
import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import BackButton from "@/components/BackButton";
import LoadingPage from "../loading";
import { Edit, LogOut } from "lucide-react";

/**
 * Profile Component
 *
 * @description Renders the user profile page, allowing users to view and update their profile information,
 * including their name and profile image. Handles authentication checks and redirects unauthenticated users
 * to the sign-in page.
 *
 * @returns {JSX.Element} The rendered profile page.
 */
export default function Profile() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    image: "",
  });

  /**
   * Effect to fetch user profile data or redirect unauthenticated users.
   */
  useEffect(() => {
    if (!session) {
      router.push("/auth/signin");
      return;
    }
    fetchUserProfile();
  }, [session, router]);

  /**
   * Fetch user profile data from the server.
   */
  const fetchUserProfile = async () => {
    try {
      const res = await fetch("/api/auth/profile");
      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      setUserData(data);
      setFormData({
        name: data.name || "",
        image: data.image || "",
      });
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle form input changes.
   * @param {React.ChangeEvent<HTMLInputElement>} e - The input change event.
   */
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /**
   * Submit profile updates to the server.
   * @param {React.FormEvent<HTMLFormElement>} e - The form submission event.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      setUserData({ ...userData, ...formData });
      setIsEditing(false);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Log out the user.
   */
  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  if (loading)
    return (
      <>
        <LoadingPage />
      </>
    );

  if (error) return <div className="text-red-500 text-center p-4">{error}</div>;

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      {/* Fixed position back button */}
      <div className="fixed top-4 -left-20 z-50">
        <BackButton className="bg-white/80 backdrop-blur-sm shadow-lg rounded-lg p-2 hover:bg-white transition-colors dark:bg-gray-800 dark:hover:bg-gray-700" />
      </div>
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 rounded-3xl p-8">
        {/* Left Container */}
        <div className="col-span-1 bg-white rounded-2xl shadow-md p-6 flex flex-col items-center">
          <Image
            src={userData?.image || "/default-avatar.png"}
            alt="Profile"
            className="h-48 w-48 rounded-full shadow-lg"
            width={128}
            height={128}
          />
          <h3 className="mt-6 text-xl font-bold text-gray-800">
            {userData?.name || "Your Name"}
          </h3>
          <p className="mt-2 text-gray-500">
            {userData?.email || "your.email@example.com"}
          </p>
          <div className="mt-6">
            <button
              onClick={() => setIsEditing(true)}
              className="w-32 px-4 py-2 text-sm text-teal-600 hover:text-teal-900 flex items-center transition-colors"
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit Profile
            </button>
            <button
              onClick={handleLogout}
              className="w-32 px-4 py-2 text-sm text-red-600 hover:text-red-800 flex items-center transition-colors"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </button>
          </div>
        </div>

        {/* Right Section */}
        <div className="col-span-2 grid grid-rows-2 gap-6">
          {/* Right Top Container */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-2xl text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-2xl text-gray-700">
                    Profile Image URL
                  </label>
                  <input
                    type="text"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 focus:ring-2 focus:ring-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 text-sm font-medium text-white bg-indigo-500 hover:bg-indigo-600 rounded-lg shadow-md focus:ring-2 focus:ring-indigo-400"
                  >
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            ) : (
              <div>
                <h3 className="text-lg font-bold text-gray-800">
                  Profile Details
                </h3>
                <p className="mt-4 text-sm text-gray-600">
                  Name: {userData?.name}
                </p>
                <p className="mt-2 text-sm text-gray-600">
                  Email: {userData?.email}
                </p>
              </div>
            )}
          </div>

          {/* Right Bottom Container */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-800">My Pages</h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link
                  href="/favorites"
                  className="text-teal-600 hover:underline hover:text-teal-800"
                >
                  Favourites Page
                </Link>
              </li>
              <li>
                <Link
                  href="/shopping-list"
                  className="text-teal-600 hover:underline hover:text-teal-800"
                >
                  Shopping list
                </Link>
              </li>
              <li>
                <Link
                  href="/downloaded-recipes"
                  className="text-teal-600 hover:underline hover:text-teal-800"
                >
                  Downloads Page
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
