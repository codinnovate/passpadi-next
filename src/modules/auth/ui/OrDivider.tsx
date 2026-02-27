export default function OrDivider() {
  return (
    <div className="flex items-center gap-3 my-4">
      <div className="h-px flex-1 bg-gray-200" />
      <span className="text-xs font-medium text-gray-400 uppercase">or</span>
      <div className="h-px flex-1 bg-gray-200" />
    </div>
  );
}
