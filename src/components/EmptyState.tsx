import { Sparkles } from "lucide-react";
import type { ReactNode } from "react";

type EmptyStateProps = {
  title: string;
  children: ReactNode;
  action?: ReactNode;
  icon?: ReactNode;
};

export function EmptyState({
  title,
  children,
  action,
  icon
}: EmptyStateProps) {
  return (
    <div className="mx-auto max-w-lg px-4 py-20 text-center">
      <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-full border border-[#D6B49A]/30 bg-[#1A110E] text-accent shadow-soft">
        {icon || <Sparkles className="h-7 w-7" />}
      </div>
      <h1 className="font-heading text-3xl sm:text-4xl font-bold text-ink tracking-tight">
        {title}
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-muted max-w-md mx-auto">
        {children}
      </p>
      {action && <div className="mt-8 flex justify-center">{action}</div>}
    </div>
  );
}
