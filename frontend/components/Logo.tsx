import Link from 'next/link';
import { Calendar } from 'lucide-react';

export default function Logo() {
  return (
    <Link href="/" className="flex items-center space-x-2">
      <Calendar className="w-8 h-8" style={{ color: '#003580' }} />
      <span
        className="text-2xl font-bold"
        style={{
          background: 'linear-gradient(to right, #003580, #009fe3)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}
      >
        BookMyEvent
      </span>
    </Link>
  );
}
