import { AlertCircle } from 'lucide-react';

interface ErrorAlertProps {
  message: string;
}

export default function ErrorAlert({ message }: ErrorAlertProps) {
  return (
    <div className="mb-6 p-4 rounded-lg flex items-start space-x-3 glass-card" style={{ backgroundColor: 'rgba(78, 205, 196, 0.15)', borderColor: 'rgba(78, 205, 196, 0.4)', backdropFilter: 'blur(10px)' }}>
      <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#4ecdc4' }} />
      <p className="text-sm font-medium" style={{ color: '#6ee7de' }}>{message}</p>
    </div>
  );
}
