import { useEffect } from "react";
import { ErrorIcon } from "./icons";

interface LoginToastProps {
  isVisible: boolean;
  onClose: () => void;
  message: string | undefined;
}

export default function LoginToast({ isVisible, onClose, message }: LoginToastProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000); // 3초 후 자동 소멸
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!message) return null;

  return (
    <div
      className={`fixed top-5 left-1/2 -translate-x-1/2 z-100 transition-all duration-500 ease-out transform 
        ${isVisible
          ? "translate-y-0 opacity-100 scale-100"
          : "-translate-y-10 opacity-0 scale-95 pointer-events-none"
        }`}
    >
      <div className="toast toast-top toast-center z-100 ">
        <div className="alert alert-error shadow-lg border-none bg-base-100 text-error px-6 py-3 rounded-xl flex items-center gap-3">
          <div className="bg-error/10 p-1.5 rounded-lg">
            <ErrorIcon />
          </div>
          <span className="font-medium">{message}</span>
        </div>
      </div>
    </div>
  );
}