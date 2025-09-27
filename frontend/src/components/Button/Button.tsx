type ButtonProps = {
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  children?: React.ReactNode;
  icon?: React.ReactNode;
  loadingText?: string;
  className?: string;
};

export const Button = ({ onClick, disabled, loading, children, icon, loadingText = "Planning Route...", className }: ButtonProps) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={
      `bg-gradient-to-r from-primary to-primary-dark text-white px-8 py-3 rounded-lg hover:from-primary-dark hover:to-primary transition-colors font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 ${className || ''}`
    }
  >
    {loading ? (
      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
    ) : (
      icon
    )}
    <span>{loading ? loadingText : children}</span>
  </button>
);