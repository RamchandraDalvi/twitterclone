import React from "react";
import { useSelector } from "react-redux"; // Import useSelector to access Redux state

const NotificationPage = () => {
  // Access likeNotification array from Redux store
  const {likeNotification} = useSelector((state) => state.realTimeNotification);

  return (
    <div className="h-screen w-full bg-gray-50 shadow-lg z-10 fixed left-0 md:left-[20%] md:w-[80%] lg:w-[70%] xl:w-[50%]">
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-800">Notifications</h1>
        </div>

        <div className="space-y-4">
          {/* Map through the notifications array */}
          {likeNotification.map((notification) => (
            <div
              key={notification._id} // Ensure each notification has a unique key
              className="p-4 bg-white rounded-lg shadow-md flex items-center hover:bg-gray-100 transition"
            >
              <div className="flex-grow">
                <p className="text-sm text-gray-800">
                  <strong>{notification.userDetails.username}</strong> {notification.message}
                </p>
              </div>
              <span className="text-xs text-gray-500">{notification.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotificationPage;
