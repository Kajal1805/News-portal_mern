import { useState } from "react";

let listeners = [];

export function useToast() {
  const [toasts, setToasts] = useState([]);

  function toast(toastData) {
    setToasts((prev) => [...prev, toastData]);
    listeners.forEach((l) => l(toastData));
    setTimeout(() => {
      setToasts((prev) => prev.slice(1));
    }, 3000);
  }

  return { toast, toasts };
}

export function subscribeToast(listener) {
  listeners.push(listener);
}