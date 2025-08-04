export default function SkeletonBox({ className = "" }) {
  return (
    <div
      className={`bg-gray-200 animate-pulse rounded ${className}`}
    />
  );
}
