import { ReactNode } from 'react';

interface PageLayoutProps {
  children: ReactNode;
}

export default function PageLayout({ children }: PageLayoutProps) {
  return <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-amber-50">{children}</div>;
}
