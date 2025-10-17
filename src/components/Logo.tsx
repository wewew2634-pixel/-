import { cn } from '@/lib/utils';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizes = {
  sm: 'w-10 h-10',
  md: 'w-14 h-14',
  lg: 'w-20 h-20',
};

export default function Logo({ size = 'md', className }: LogoProps) {
  return (
    <div
      className={cn(
        'relative flex items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent shadow-lg',
        sizes[size],
        className
      )}
    >
      <span className="text-white font-bold text-2xl">Z</span>
    </div>
  );
}
