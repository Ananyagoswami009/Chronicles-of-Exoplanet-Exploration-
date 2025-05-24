// Create Card.tsx in your components folder
import React from "react";

export function Card({ children, className }: { children: React.ReactNode, className?: string }) {
  return <div className={`rounded-lg shadow-md p-4 ${className}`}>{children}</div>;
}

export function CardHeader({ children }: { children: React.ReactNode }) {
  return <div className="mb-4">{children}</div>;
}

export function CardContent({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}

export function CardTitle({ children, className }: { children: React.ReactNode, className?: string }) {
  return <h2 className={`text-xl font-bold ${className}`}>{children}</h2>;
}

export function CardDescription({ children }: { children: React.ReactNode }) {
  return <p>{children}</p>;
}
