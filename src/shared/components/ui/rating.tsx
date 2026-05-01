import { Star } from "lucide-react";
import { cn } from "@/shared/lib/cn";

export interface RatingProps {
  value: number;
  count?: number;
  className?: string;
}

export function Rating({ value, count, className }: RatingProps) {
  return (
    <div className={cn("inline-flex items-center gap-1", className)}>
      <Star className="h-4 w-4 fill-warning text-warning" aria-hidden />
      <span className="text-sm font-semibold text-foreground">
        {value.toFixed(1)}
      </span>
      {count !== undefined && (
        <span className="text-xs text-muted">({count})</span>
      )}
    </div>
  );
}
