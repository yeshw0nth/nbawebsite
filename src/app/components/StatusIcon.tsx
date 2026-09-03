import React from "react";
import { Status } from "@/context/ProgressContext";

export default function StatusIcon({ status, size = 12 }: { status: Status, size?: number }) {
  if (status === "completed") {
    return (
      <svg width={size} height={size} viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="6" cy="6" r="6" fill="#059669" />
        <path d="M3.5 6L5 7.5L8.5 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (status === "ongoing") {
    return (
      <svg width={size} height={size} viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="6" cy="6" r="5.5" stroke="currentColor" strokeWidth="1" className="text-accent" />
        <path d="M6 1C8.76142 1 11 3.23858 11 6C11 8.76142 8.76142 11 6 11V1Z" fill="currentColor" className="text-accent" />
      </svg>
    );
  }

  // Pending
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="6" cy="6" r="5.5" stroke="currentColor" strokeWidth="1" className="text-muted" />
    </svg>
  );
}
