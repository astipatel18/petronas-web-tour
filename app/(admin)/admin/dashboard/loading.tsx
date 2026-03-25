export default function Loading() {
  return (
    <div className="p-10 space-y-8 animate-pulse">
      <div className="h-10 w-64 bg-slate-200 rounded" />
      <div className="grid grid-cols-3 gap-8">
        <div className="h-32 bg-slate-200 rounded-xl" />
        <div className="h-32 bg-slate-200 rounded-xl" />
        <div className="h-32 bg-slate-200 rounded-xl" />
      </div>
    </div>
  );
}