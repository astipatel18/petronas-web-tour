"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CalendarProps {
  selectedDate: string;
  onSelect: (date: string) => void;
}

export default function Calendar({ selectedDate, onSelect }: CalendarProps) {
  const [viewDate, setViewDate] = useState(new Date());

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1).getDay();

  const days = Array.from({ length: daysInMonth(viewDate.getFullYear(), viewDate.getMonth()) }, (_, i) => i + 1);
  const padding = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const prevMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  const nextMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));

  const isPast = (day: number) => {
    const d = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return d < today;
  };

  const formatDateString = (day: number) => {
    const month = String(viewDate.getMonth() + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    return `${viewDate.getFullYear()}-${month}-${d}`;
  };

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 w-full">
      <div className="flex justify-between items-center mb-4 px-2">
        <h3 className="text-sm font-black uppercase tracking-widest text-slate-900">
          {monthNames[viewDate.getMonth()]} {viewDate.getFullYear()}
        </h3>
        <div className="flex gap-1">
          <button type="button" onClick={prevMonth} className="p-2 hover:bg-slate-200 rounded-full transition-colors"><ChevronLeft size={16}/></button>
          <button type="button" onClick={nextMonth} className="p-2 hover:bg-slate-200 rounded-full transition-colors"><ChevronRight size={16}/></button>
        </div>
      </div>

      <div className="grid grid-cols-7 text-center mb-2">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(d => (
          <div key={d} className="text-[10px] font-bold text-slate-400 uppercase">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {padding.map(p => <div key={`p-${p}`} />)}
        {days.map(day => {
          const dateStr = formatDateString(day);
          const active = selectedDate === dateStr;
          const disabled = isPast(day);

          return (
            <button
              key={day}
              type="button"
              disabled={disabled}
              onClick={() => onSelect(dateStr)}
              className={cn(
                "h-10 w-full rounded-lg text-xs font-bold transition-all",
                active ? "bg-cyan-600 text-white shadow-lg shadow-cyan-200" : "text-slate-700 hover:bg-slate-200",
                disabled && "opacity-20 cursor-not-allowed hover:bg-transparent"
              )}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}