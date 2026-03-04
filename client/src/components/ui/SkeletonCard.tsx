export function SkeletonCard({ className = "" }: { className?: string }) {
  return (
    <div className={`rounded-xl border bg-card p-6 space-y-4 ${className}`}>
      <div className="skeleton-loader h-4 w-2/3" />
      <div className="skeleton-loader h-8 w-1/2" />
      <div className="skeleton-loader h-3 w-full" />
      <div className="skeleton-loader h-3 w-4/5" />
    </div>
  );
}
