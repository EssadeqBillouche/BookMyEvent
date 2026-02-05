import Link from 'next/link';

export default function Logo() {
  return (
    <Link href="/" className="flex items-center group">
      <span className="text-2xl font-bold tracking-tight">
        <span className="text-white">Book</span>
        <span className="text-[#4ecdc4]">My</span>
        <span className="text-white">Event</span>
      </span>
    </Link>
  );
}
