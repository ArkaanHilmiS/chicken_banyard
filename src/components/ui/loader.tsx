import React from "react";

export default function Loader() {
  return (
    <div className="flex items-center justify-center py-8">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500" />
      <span className="ml-2 text-gray-600">Loading...</span>
    </div>
  );
}
