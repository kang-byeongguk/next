import React from "react";
import { clsx } from "clsx";
import { FormError } from "./form-error";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
  error?: string[] | string;
  containerClassName?: string;
}

export function FormInput({
  label,
  name,
  error,
  className,
  containerClassName,
  ...props
}: FormInputProps) {
  return (
    <div className={clsx("w-full", containerClassName)}>
      <label htmlFor={name} className="label pt-0 mb-1 h-5">
        <span className="label-text font-bold text-base-content/70 text-xs uppercase">
          {label}
        </span>
      </label>
      <input
        id={name}
        name={name}
        className={clsx(
          "input w-full h-10 text-sm focus:input-primary border-base-content/20",
          className
        )}
        {...props}
      />
      <FormError message={error} />
    </div>
  );
}