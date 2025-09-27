import React from "react";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary";
  loading?: boolean;
  loadingText?: string;
  icon?: React.ReactNode;
};

export function Button({
  children,
  variant = "primary",
  loading = false,
  loadingText = "Planning Route...",
  icon,
  className = "",
  ...props
}: Props) {
  const base =
    "px-8 outline-none py-3 rounded-lg font-semibold transition-colors shadow-lg flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary:
      "bg-gradient-to-r from-primary to-primary-dark text-white hover:from-primary-dark hover:to-primary focus:ring-2 focus:ring-primary-light",
    secondary:
      "bg-white outline-none  border border-gray-300 text-secondary hover:bg-gray-100 focus:ring-2 focus:ring-secondary-light",
  };
  return (
    <button
      className={`${base} ${variants[variant]} ${className}`}
      disabled={props.disabled || loading}
      {...props}
    >
      {loading ? (
        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
      ) : (
        icon
      )}
      <span>{loading ? loadingText : children}</span>
    </button>
  );
}