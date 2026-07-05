import React, { useState, useEffect } from 'react';
import { ShieldCheck, User, Calendar, Bell, Menu, Compass } from 'lucide-react';

interface HeaderProps {
  currentRole: string;
  onRoleChange: (role: string) => void;
  onOpenBookingModal: () => void;
}

export default function Header({ currentRole, onRoleChange, onOpenBookingModal }: HeaderProps) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = time.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });

  const formattedDate = time.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-slate-100 px-6 py-3.5 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Branding */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-900 flex items-center justify-center font-serif text-xl font-black shadow-md shadow-amber-500/10">
            A
          </div>
          <div>
            <h1 className="font-serif text-lg tracking-tight text-white font-bold flex items-center gap-2">
              Aurelia Grand <span className="text-[10px] font-sans tracking-widest uppercase px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">PMS PRO</span>
            </h1>
            <p className="text-[11px] font-sans text-slate-400 font-medium">Boutique Resort & Luxury Spa Management</p>
          </div>
        </div>

        {/* Live Metrics / Metadata */}
        <div className="flex flex-wrap items-center gap-4 md:gap-6 text-xs">
          {/* DateTime */}
          <div className="hidden lg:flex flex-col text-right font-mono text-slate-400">
            <span className="text-white font-semibold">{formattedTime}</span>
            <span className="text-[10px]">{formattedDate}</span>
          </div>

          {/* Quick Stats Separator */}
          <div className="hidden lg:block h-6 w-px bg-slate-800" />

          {/* Staff Mode Switcher */}
          <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
            <ShieldCheck size={14} className="text-amber-400" />
            <span className="text-[11px] font-mono text-slate-400 uppercase hidden sm:inline">Portal:</span>
            <select
              value={currentRole}
              onChange={(e) => onRoleChange(e.target.value)}
              className="bg-transparent text-white font-semibold text-xs border-0 outline-none cursor-pointer focus:ring-0"
            >
              <option value="Front Desk" className="bg-slate-900">Front Desk Staff</option>
              <option value="General Manager" className="bg-slate-900">General Manager</option>
              <option value="Housekeeping" className="bg-slate-900">Housekeeping Supervisor</option>
            </select>
          </div>

          {/* Action Trigger */}
          <button
            onClick={onOpenBookingModal}
            className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 active:scale-95 transition-all text-slate-950 text-xs font-bold rounded-lg shadow-lg shadow-amber-500/10 flex items-center gap-1.5"
          >
            <span>+ New Booking</span>
          </button>
        </div>
      </div>
    </header>
  );
}
