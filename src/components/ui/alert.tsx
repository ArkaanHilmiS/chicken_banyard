import React from "react";

export default function Alert({ message, type = "info" }: { message: string; type?: "success" | "error" | "info" }) {
  const color = type === "success" ? "green" : type === "error" ? "red" : "blue";
  return (
    <div className={`p-3 rounded bg-${color}-100 text-${color}-800`}>
      {message}
    </div>
  );
}
