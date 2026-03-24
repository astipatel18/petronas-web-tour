import { ReactNode } from "react";

interface TransportCardProps {
  icon: ReactNode;
  title: string;
  steps: string[];
}

export default function TransportCard({ icon, title, steps }: TransportCardProps) {
  return (
    <div className="group p-8 border border-white/5 bg-white/2 hover:bg-white/5 transition-all duration-500">
      <div className="text-cyan-500 mb-6 group-hover:scale-110 transition-transform duration-500">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-white uppercase tracking-tighter mb-6">{title}</h3>
      <ul className="space-y-4">
        {steps.map((step, i) => (
          <li key={i} className="flex gap-4 text-sm text-slate-400 leading-relaxed">
            <span className="text-cyan-500 font-mono">0{i + 1}</span>
            {step}
          </li>
        ))}
      </ul>
    </div>
  );
}