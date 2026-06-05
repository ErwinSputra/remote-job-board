export default function Loading() {
  return (
    <main className="bg-[#F7F6F3] flex-1 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-4 border-[#1A1A2E] border-t-[#FFE97D] rounded-full animate-spin" />
        <p className="text-sm text-gray-400">Memuat...</p>
      </div>
    </main>
  );
}
