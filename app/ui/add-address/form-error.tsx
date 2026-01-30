import { clsx } from "clsx";

interface FormErrorProps {
  message?: string[] | string;
  className?: string;
}

export function FormError({ message, className }: FormErrorProps) {
  if (!message || (Array.isArray(message) && message.length === 0)) {
    return <div className="h-4"></div>; // 레이아웃 밀림 방지용 빈 공간
  }

  return (
    <p className={clsx("text-error text-xs mt-1 font-medium duration-200", className)}>
      {Array.isArray(message) ? message[0] : message}
    </p>
  );
}