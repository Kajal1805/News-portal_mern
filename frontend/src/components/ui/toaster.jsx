import React, { useEffect, useState } from "react";
import { Toast } from "./toast";
import { subscribeToast } from "@/hooks/use-toast";

export function Toaster() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    subscribeToast((t) => setToasts((prev) => [...prev, t]));
  }, []);

  return (
    <div className="fixed top-4 right-4 flex flex-col gap-2 z-50">
      {toasts.map((t, i) => (
        <Toast key={i} {...t} />
      ))}
    </div>
  );
}