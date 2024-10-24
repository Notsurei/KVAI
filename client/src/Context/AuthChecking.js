import React from "react";

const AuthCheckingComponent = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900">
      <span className="loading loading-spinner text-primary"></span>
      <p className="mt-4 text-lg text-gray-200">
        Checking authentication status, please wait...
      </p>
    </div>
  );
};

export default AuthCheckingComponent;