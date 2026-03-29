import { AlertTriangle } from "lucide-react";

export default function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="flex items-start gap-2 text-red text-sm bg-red/10 border border-red/25 rounded-lg px-4 py-3 animate-fade-in">
      <AlertTriangle size={16} className="shrink-0 mt-0.5" />
      <span>{message}</span>
    </div>
  );
}
