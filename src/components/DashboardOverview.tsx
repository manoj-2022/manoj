import React from 'react';
import { Room, Booking, Guest, HousekeepingTask } from '../types';
import { Bed, Users, AlertTriangle, TrendingUp, DollarSign, ArrowRight, CheckCircle, Flame, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface DashboardOverviewProps {
  rooms: Room[];
  bookings: Booking[];
  guests: Guest[];
  tasks: HousekeepingTask[];
  onNavigate: (tab: string) => void;
  onCheckIn: (bookingId: string) => void;
}

export default function DashboardOverview({ rooms, bookings, guests, tasks, onNavigate, onCheckIn }: DashboardOverviewProps) {
  // Compute analytics
  const totalRooms = rooms.length;
  const occupiedRooms = rooms.filter(r => r.status === 'Occupied').length;
  const availableRooms = rooms.filter(r => r.status === 'Available').length;
  const maintenanceRooms = rooms.filter(r => r.status === 'Maintenance').length;
  const cleaningRooms = rooms.filter(r => r.status === 'Cleaning').length;

  const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;
  
  // Total expected revenue for current month/bookings
  const activeRevenue = bookings
    .filter(b => b.status === 'CheckedIn' || b.status === 'Confirmed')
    .reduce((sum, b) => sum + b.totalAmount, 0);

  // Today's arrivals and departures
  const todayStr = '2026-07-05'; // Static anchor from our workspace context time
  const todayArrivals = bookings.filter(b => b.checkIn === todayStr && b.status === 'Confirmed');
  const todayDepartures = bookings.filter(b => b.checkOut === todayStr && b.status === 'CheckedIn');

  // Pending cleanings
  const activeCleanings = tasks.filter(t => t.status !== 'Completed').length;

  // Let's create beautiful mini SVG data lists
  const last6MonthsRevenue = [
    { month: 'Jan', revenue: 12000, occupancy: 42 },
    { month: 'Feb', revenue: 14500, occupancy: 50 },
    { month: 'Mar', revenue: 19000, occupancy: 65 },
    { month: 'Apr', revenue: 24000, occupancy: 78 },
    { month: 'May', revenue: 31000, occupancy: 85 },
    { month: 'Jun', revenue: 38500, occupancy: 90 },
  ];

  const maxRevenue = Math.max(...last6MonthsRevenue.map(d => d.revenue));

  return (
    <div className="space-y-8">
      {/* Dynamic Summary Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Occupancy card */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm flex items-center justify-between group hover:border-slate-300 transition-all">
          <div className="space-y-1">
            <span className="text-xs font-mono uppercase text-slate-400">Live Occupancy</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-serif font-bold text-slate-900">{occupancyRate}%</span>
              <span className="text-xs text-emerald-600 font-bold">▲ 4.2%</span>
            </div>
            <p className="text-[11px] text-slate-500">{occupiedRooms} of {totalRooms} rooms active</p>
          </div>
          <div className="h-12 w-12 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Bed size={22} />
          </div>
        </div>

        {/* Financial forecast */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm flex items-center justify-between group hover:border-slate-300 transition-all">
          <div className="space-y-1">
            <span className="text-xs font-mono uppercase text-slate-400">Ledger Revenue</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-serif font-bold text-slate-900">${activeRevenue.toLocaleString()}</span>
              <span className="text-xs text-emerald-600 font-bold">▲ 12%</span>
            </div>
            <p className="text-[11px] text-slate-500">Active & confirmed bookings</p>
          </div>
          <div className="h-12 w-12 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
            <DollarSign size={22} />
          </div>
        </div>

        {/* In-House Guests count */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm flex items-center justify-between group hover:border-slate-300 transition-all">
          <div className="space-y-1">
            <span className="text-xs font-mono uppercase text-slate-400">Guests Registered</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-serif font-bold text-slate-900">{guests.length}</span>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 bg-indigo-100 text-indigo-700 font-bold rounded">Loyal</span>
            </div>
            <p className="text-[11px] text-slate-500">Platinum, Gold & Silver members</p>
          </div>
          <div className="h-12 w-12 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Users size={22} />
          </div>
        </div>

        {/* Alerts / Maintenance */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm flex items-center justify-between group hover:border-slate-300 transition-all">
          <div className="space-y-1">
            <span className="text-xs font-mono uppercase text-slate-400">Housekeeping Tasks</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-serif font-bold text-slate-900">{activeCleanings}</span>
              {maintenanceRooms > 0 && (
                <span className="text-xs text-red-600 font-bold flex items-center gap-0.5">
                  <AlertTriangle size={11} /> {maintenanceRooms} Repair
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500">{cleaningRooms} currently under cleaning</p>
          </div>
          <div className="h-12 w-12 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
            <AlertTriangle size={22} />
          </div>
        </div>
      </div>

      {/* Main Analytical & Timeline Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Section: Custom Inline SVG Revenue Graph & Room Status Board */}
        <div className="lg:col-span-8 space-y-6">
          {/* Custom SVG Analytics Chart */}
          <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="font-serif text-lg font-bold text-slate-900">Revenue & Occupancy Trend</h3>
                <p className="text-xs text-slate-500">Comparison of seasonal earnings vs hotel occupancy capacity</p>
              </div>
              <div className="flex gap-4 text-xs font-mono">
                <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded bg-amber-500" /> Revenue ($)</span>
                <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded bg-indigo-500" /> Occupancy %</span>
              </div>
            </div>

            {/* SVG Plot */}
            <div className="relative h-60 w-full">
              <svg className="w-full h-full" viewBox="0 0 600 220" preserveAspectRatio="none">
                {/* Horizontal grid lines */}
                <line x1="40" y1="20" x2="580" y2="20" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="40" y1="70" x2="580" y2="70" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="40" y1="120" x2="580" y2="120" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="40" y1="170" x2="580" y2="170" stroke="#f1f5f9" strokeWidth="1" />

                {/* Bars representing revenue */}
                {last6MonthsRevenue.map((d, i) => {
                  const x = 70 + i * 85;
                  const height = (d.revenue / maxRevenue) * 130;
                  const barY = 170 - height;
                  
                  // Line coordinates for Occupancy line path
                  const lineY = 170 - (d.occupancy / 100) * 130;

                  return (
                    <g key={i} className="group/bar">
                      {/* Revenue Bar */}
                      <rect
                        x={x - 15}
                        y={barY}
                        width="30"
                        height={height}
                        fill="url(#revGrad)"
                        rx="4"
                        className="transition-all duration-300 hover:opacity-95"
                      />
                      
                      {/* Occupancy Dot */}
                      <circle
                        cx={x}
                        cy={lineY}
                        r="5"
                        className="fill-indigo-600 stroke-white stroke-2 shadow"
                      />

                      {/* X Axis Label */}
                      <text x={x} y="195" textAnchor="middle" className="text-[10px] font-mono fill-slate-500">{d.month}</text>
                      
                      {/* Values above bars (on hover or static) */}
                      <text x={x} y={barY - 6} textAnchor="middle" className="text-[9px] font-mono fill-slate-800 font-bold">${(d.revenue/1000).toFixed(1)}k</text>
                      <text x={x} y={lineY - 8} textAnchor="middle" className="text-[9px] font-mono fill-indigo-700 font-semibold">{d.occupancy}%</text>
                    </g>
                  );
                })}

                {/* SVG Definitions */}
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#fef3c7" stopOpacity="0.4" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>

          {/* Quick Room Occupancy Status Ribbon */}
          <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="font-serif text-lg font-bold text-slate-900">Immediate Room Layout</h3>
                <p className="text-xs text-slate-500">Live operational status across all rooms</p>
              </div>
              <button
                onClick={() => onNavigate('rooms')}
                className="text-xs font-semibold text-amber-600 hover:text-amber-700 flex items-center gap-1"
              >
                Configure Rooms <ArrowRight size={13} />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
              {rooms.slice(0, 6).map((room) => {
                const getStatusColor = (status: string) => {
                  switch (status) {
                    case 'Available': return 'bg-emerald-500 border-emerald-600/30 text-emerald-950';
                    case 'Occupied': return 'bg-indigo-500 border-indigo-600/30 text-indigo-950';
                    case 'Cleaning': return 'bg-amber-400 border-amber-500/30 text-amber-950';
                    default: return 'bg-rose-500 border-rose-600/30 text-rose-950';
                  }
                };

                return (
                  <div
                    key={room.id}
                    className="p-3.5 rounded-lg border flex flex-col justify-between text-left h-24 bg-slate-50 hover:bg-slate-100/80 transition-all cursor-pointer"
                    onClick={() => onNavigate('rooms')}
                  >
                    <div className="flex justify-between items-start">
                      <span className="font-mono text-sm font-bold text-slate-800">#{room.number}</span>
                      <span className={`h-2.5 w-2.5 rounded-full ${room.status === 'Available' ? 'bg-emerald-500' : room.status === 'Occupied' ? 'bg-indigo-500' : 'bg-amber-400'}`} />
                    </div>
                    <div>
                      <p className="text-[10px] font-mono text-slate-400 uppercase tracking-tight">{room.type}</p>
                      <p className="text-[10px] font-semibold text-slate-700 mt-1">{room.status}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Section: Arrivals, Action Panel & Quick Registry */}
        <div className="lg:col-span-4 space-y-6">
          {/* Today's Arrivals Widget */}
          <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm flex flex-col h-full min-h-[340px]">
            <div className="border-b border-slate-100 pb-3 mb-4 flex justify-between items-center">
              <div>
                <h3 className="font-serif text-md font-bold text-slate-900">Today's Arrivals</h3>
                <p className="text-[11px] text-slate-400">Scheduled for July 5, 2026</p>
              </div>
              <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded font-mono text-[10px] font-bold">
                {todayArrivals.length} Booking{todayArrivals.length !== 1 ? 's' : ''}
              </span>
            </div>

            <div className="space-y-3 flex-1 overflow-y-auto max-h-[220px] pr-1">
              {todayArrivals.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 bg-slate-50 rounded-lg">
                  <CheckCircle size={30} className="text-emerald-500 mb-2" />
                  <p className="text-xs font-semibold text-slate-700">All Set!</p>
                  <p className="text-[11px] text-slate-400">No pending arrivals remaining for today.</p>
                </div>
              ) : (
                todayArrivals.map((booking) => (
                  <div key={booking.id} className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex justify-between items-center gap-3">
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 truncate">{booking.guestName}</p>
                      <p className="text-[10px] font-mono text-slate-500 mt-0.5">
                        Room {booking.roomNumber} ({booking.roomType})
                      </p>
                    </div>
                    <button
                      onClick={() => onCheckIn(booking.id)}
                      className="px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-[10px] rounded transition-all shrink-0"
                    >
                      Check-In
                    </button>
                  </div>
                ))
              )}
            </div>

            <button
              onClick={() => onNavigate('bookings')}
              className="mt-4 w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>View All Bookings</span>
              <ArrowRight size={12} />
            </button>
          </div>

          {/* Today's Departures Widget */}
          <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm flex flex-col min-h-[220px]">
            <div className="border-b border-slate-100 pb-3 mb-3 flex justify-between items-center">
              <div>
                <h3 className="font-serif text-md font-bold text-slate-900">Today's Departures</h3>
                <p className="text-[11px] text-slate-400">Guests checking out today</p>
              </div>
              <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded font-mono text-[10px] font-bold">
                {todayDepartures.length} Total
              </span>
            </div>

            <div className="space-y-3 flex-1 overflow-y-auto max-h-[160px] pr-1">
              {todayDepartures.length === 0 ? (
                <div className="text-center py-6 text-slate-400 text-xs">
                  No guest departures registered for today.
                </div>
              ) : (
                todayDepartures.map((booking) => (
                  <div key={booking.id} className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 flex justify-between items-center">
                    <div>
                      <p className="text-xs font-bold text-slate-900">{booking.guestName}</p>
                      <p className="text-[10px] text-slate-500 font-mono">Room {booking.roomNumber}</p>
                    </div>
                    <span className="px-2 py-0.5 bg-slate-200 text-slate-700 rounded text-[9px] font-bold font-mono">Checked In</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
