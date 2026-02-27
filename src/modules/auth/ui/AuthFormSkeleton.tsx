export default function AuthFormSkeleton() {
  return (
    <div className="w-full space-y-4 animate-pulse">
      <div className="h-12 rounded-xl bg-gray-200" />
      <div className="h-px bg-gray-200" />
      <div className="space-y-3">
        <div className="h-4 w-20 rounded bg-gray-200" />
        <div className="h-12 rounded-xl bg-gray-200" />
      </div>
      <div className="space-y-3">
        <div className="h-4 w-20 rounded bg-gray-200" />
        <div className="h-12 rounded-xl bg-gray-200" />
      </div>
      <div className="h-12 rounded-xl bg-gray-300" />
    </div>
  );
}
