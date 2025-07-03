import { Pill } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-2 text-lg font-bold text-primary', className)} suppressHydrationWarning>
      <div className="rounded-lg bg-primary/20 p-2 text-primary" suppressHydrationWarning>
        <Pill className="h-5 w-5" />
      </div>
      <span className="text-foreground">TecnoFarma</span>
    </div>
  );
}
