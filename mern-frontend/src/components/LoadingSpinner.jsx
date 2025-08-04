export default function LoadingSpinner({ className = "" }) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="w-6 h-6 border-4 border-t-transparent border-primary rounded-full animate-spin" />
    </div>
  );
}
