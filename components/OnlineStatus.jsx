'use client';

import { useEffect, useState } from "react";
import Alert from "./Alert"; 

export default function OnlineStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [alert, setAlert] = useState({
    message: "",
    type: "",
    show: false,
  });

  useEffect(() => {
    const updateOnlineStatus = () => {
      const onlineStatus = navigator.onLine;
      setIsOnline(onlineStatus);


      setAlert({
        message: onlineStatus ? "You are online" : "You are offline. No Internet. Try:",
        type: onlineStatus ? "success" : "error", 
        show: true,
      });

     
      setTimeout(() => {
        setAlert((prevAlert) => ({ ...prevAlert, show: false }));
      }, 5000);
    };

    window.addEventListener("online", updateOnlineStatus);
    window.addEventListener("offline", updateOnlineStatus);

    
    const initialTimeout = setTimeout(() => {
      setAlert((prevAlert) => ({ ...prevAlert, show: false }));
    }, 5000);

    return () => {
      window.removeEventListener("online", updateOnlineStatus);
      window.removeEventListener("offline", updateOnlineStatus);
      clearTimeout(initialTimeout); 
    };
  }, []);

  return (
    <div>
      {alert.show && (
        <Alert
          message={alert.message}
          type={alert.type}
          isVisible={alert.show}
          onClose={() => setAlert({ ...alert, show: false })}
        />
      )}

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
