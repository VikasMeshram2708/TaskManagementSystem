import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-blue-500 p-3 flex items-center justify-between">
      <h2 className="text-3xl font-bold text-white">
        <Link href="/">Task Management</Link>
      </h2>
      <div className="flex items-center gap-3">
        <button className="bg-white text-black px-4 py-2 rounded font-semibold">
          <Link href="/login">Login</Link>
        </button>
        <button className="hover:bg-white hover:text-black text-white px-4 py-2 rounded font-semibold">
          <Link href="/login">Sign Up</Link>
        </button>
      </div>
    </nav>
  );
}
