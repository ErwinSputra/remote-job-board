import Link from "next/link";

export default function NotFound() {
  return (
    <main className="bg-[#F7F6F3] flex-1 flex items-center justify-center">
      <div className="text-center px-6">
        <p className="text-8xl font-black text-[#1A1A2E] mb-4">404</p>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Halaman tidak ditemukan
        </h1>
        <p className="text-gray-500 text-sm mb-8">
          Lowongan atau halaman yang kamu cari tidak ada atau sudah dihapus.
        </p>
        <Link
          href="/"
          className="bg-[#FFE97D] hover:bg-[#FDD835] text-[#1A1A2E] font-bold px-6 py-2.5 rounded-xl transition-colors"
        >
          Kembali ke Beranda
        </Link>
      </div>
    </main>
  );
}
