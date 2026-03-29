import clsx from "clsx";

interface Props {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
}

export default function Card({ children, className, glow }: Props) {
  return (
    <div
      className={clsx(
        "bg-surface border border-border rounded-xl p-6 shadow-card",
        "transition-all duration-200",
        glow && "hover:border-accent/40 hover:shadow-glow",
        className
      )}
    >
      {children}
    </div>
  );
}
