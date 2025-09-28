import { create } from "zustand";

export type ToastType = "success" | "error";

interface ToastState {
  message: string;
  type: ToastType;
  visible: boolean;
  duration: number;
  showToast: (message: string, type?: ToastType, duration?: number) => void;
  hideToast: () => void;
}

export const useToastStore = create<ToastState>((set) => ({
  message: "",
  type: "success",
  visible: false,
  duration: 3000,
  showToast: (message, type = "success", duration = 3000) =>
    set({ message, type, visible: true, duration }),
  hideToast: () => set({ visible: false }),
}));
