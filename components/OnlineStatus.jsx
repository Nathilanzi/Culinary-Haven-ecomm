'use client'; // Indicates this is a client-side component for Next.js App Router.

import { useEffect, useState } from "react"; // Import React hooks.
import Alert from "./Alert"; // Import the Alert component for displaying alerts.

/**
 * OnlineStatus Component
 * - Monitors the user's online/offline status using the browser's `navigator.onLine` API.
 * - Displays an alert message indicating the user's current network status.
 * - Provides troubleshooting tips if the user is offline.
 */
export default function OnlineStatus() {
  // State to track the user's online status (true if online, false if offline).
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // State to manage the alert's properties (message, type, visibility).
  const [alert, setAlert] = useState({
    message: "", // Alert message text.
    type: "",    // Alert type (e.g., "success", "error").
    show: false, // Visibility of the alert.
  });

  useEffect(() => {
    /**
     * Updates the online status and displays an alert based on the user's connection.
     */
    const updateOnlineStatus = () => {
      const onlineStatus = navigator.onLine; // Get the current online status.
      setIsOnline(onlineStatus); // Update the state.

      // Update the alert with an appropriate message and type.
      setAlert({
        message: onlineStatus
          ? "You are online" // Message for online status.
          : "You are offline. No Internet. Try:", // Message for offline status.
        type: onlineStatus ? "success" : "error", // Alert type.
        show: true, // Show the alert.
      });

      // Hide the alert after 5 seconds.
      setTimeout(() => {
        setAlert((prevAlert) => ({ ...prevAlert, show: false }));
      }, 5000);
    };

    // Add event listeners to detect online and offline status changes.
    window.addEventListener("online", updateOnlineStatus);
    window.addEventListener("offline", updateOnlineStatus);

    // Hide the initial alert after 5 seconds.
    const initialTimeout = setTimeout(() => {
      setAlert((prevAlert) => ({ ...prevAlert, show: false }));
    }, 5000);

    // Cleanup function to remove event listeners and clear timeout on component unmount.
    return () => {
      window.removeEventListener("online", updateOnlineStatus);
      window.removeEventListener("offline", updateOnlineStatus);
      clearTimeout(initialTimeout); // Clear the timeout.
    };
  }, []); // Empty dependency array ensures this effect runs only once on mount.

  return (
    <div>
      {/* Conditionally render the Alert component if the alert is visible. */}
      {alert.show && (
        <Alert
          message={alert.message} // Pass the alert message.
          type={alert.type}       // Pass the alert type (success/error).
          isVisible={alert.show}  // Pass the visibility state.
          onClose={() => setAlert({ ...alert, show: false })} // Hide the alert on close.
        />
      )}

      {/* Display troubleshooting tips if offline and the alert is visible. */}
      {!isOnline && alert.show && (
        <div className="mt-2 text-sm">
          <ul>
            <li>Checking the network cables, modem, and router</li>
            <li>Reconnecting to Wi-Fi</li>
            <li>Running Windows Network Diagnostics</li>
          </ul>
        </div>
      )}
    </div>
  );
}
