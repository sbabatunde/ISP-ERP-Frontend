import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        "bg-accent animate-pulse rounded-md dark:bg-accent/50",
        className,
      )}
      {...props}
    />
  );
}

export { Skeleton };
