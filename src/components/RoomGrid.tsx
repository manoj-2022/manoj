import React, { useState } from 'react';
import { Room, RoomStatus, RoomType } from '../types';
import { Sparkles, Grid, Eye, Check, RefreshCw, PenTool, Flame, Layers, Coffee } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface RoomGridProps {
  rooms: Room[];
  onUpdateRoomStatus: (roomId: string, status: RoomStatus) => void;
  staffRole: string;
}

export default function RoomGrid({ rooms, onUpdateRoomStatus, staffRole }: RoomGridProps) {
  const [selectedFloor, setSelectedFloor] = useState<number | 'All'>('All');
  const [selectedStatus, setSelectedStatus] = useState<RoomStatus | 'All'>('All');
  const [selectedType, setSelectedType] = useState<RoomType | 'All'>('All');
  const [activeEditorRoomId, setActiveEditorRoomId] = useState<string | null>(null);

  // Filters
  const filteredRooms = rooms.filter(room => {
    const floorMatch = selectedFloor === 'All' || room.floor === selectedFloor;
    const statusMatch = selectedStatus === 'All' || room.status === selectedStatus;
    const typeMatch = selectedType === 'All' || room.type === selectedType;
    return floorMatch && statusMatch && typeMatch;
  });

  const getStatusBadge = (status: RoomStatus) => {
    switch (status) {
      case 'Available':
        return 'bg-emerald-50 border-emerald-200 text-emerald-700 font-bold';
      case 'Occupied':
        return 'bg-indigo-50 border-indigo-200 text-indigo-700 font-bold';
      case 'Cleaning':
        return 'bg-amber-50 border-amber-200 text-amber-700 font-bold';
      case 'Maintenance':
        return 'bg-rose-50 border-rose-200 text-rose-700 font-bold';
    }
  };

  return (
    <div className="space-y-6">
      {/* Control Filters Area */}
      <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h3 className="font-serif text-lg font-bold text-slate-900">Room Directory & Controls</h3>
            <p className="text-xs text-slate-500">Manage status, floor grids, and features for boutique guest rooms</p>
          </div>
          <div className="text-xs text-slate-400 font-mono">
            Filtered: <span className="text-slate-900 font-bold">{filteredRooms.length}</span> of {rooms.length} Rooms
          </div>
        </div>

        {/* Dynamic Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-slate-100">
          {/* Status Filter */}
          <div>
            <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1.5">Filter by Status</label>
            <div className="flex flex-wrap gap-1 bg-slate-100 p-1 rounded-lg">
              {(['All', 'Available', 'Occupied', 'Cleaning', 'Maintenance'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setSelectedStatus(st)}
                  className={`flex-1 py-1 text-[10px] font-semibold rounded capitalize transition-all ${
                    selectedStatus === st ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Type Filter */}
          <div>
            <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1.5">Filter by Type</label>
            <div className="flex flex-wrap gap-1 bg-slate-100 p-1 rounded-lg">
              {(['All', 'Standard', 'Deluxe', 'Suite', 'Penthouse'] as const).map((tp) => (
                <button
                  key={tp}
                  onClick={() => setSelectedType(tp)}
                  className={`flex-1 py-1 text-[10px] font-semibold rounded capitalize transition-all ${
                    selectedType === tp ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {tp}
                </button>
              ))}
            </div>
          </div>

          {/* Floor Filter */}
          <div>
            <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1.5">Filter by Floor</label>
            <div className="flex flex-wrap gap-1 bg-slate-100 p-1 rounded-lg">
              {(['All', 1, 2, 3] as const).map((fl) => (
                <button
                  key={fl}
                  onClick={() => setSelectedFloor(fl as any)}
                  className={`flex-1 py-1 text-[10px] font-semibold rounded capitalize transition-all ${
                    selectedFloor === fl ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {fl === 'All' ? 'All Floors' : `Floor ${fl}`}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Room Inventory Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <AnimatePresence mode="popLayout">
          {filteredRooms.map((room) => {
            const isEditing = activeEditorRoomId === room.id;
            
            return (
              <motion.div
                key={room.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-xl border border-slate-200 hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
              >
                {/* Visual Accent */}
                <div className={`h-1.5 w-full ${
                  room.status === 'Available' ? 'bg-emerald-500' : 
                  room.status === 'Occupied' ? 'bg-indigo-600' : 
                  room.status === 'Cleaning' ? 'bg-amber-400' : 'bg-rose-500'
                }`} />

                <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                  {/* Title Bar */}
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-xl font-serif font-bold text-slate-900">Room {room.number}</h4>
                      <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">{room.type} // FL {room.floor}</p>
                    </div>
                    <span className={`px-2.5 py-1 text-[10px] rounded-full border ${getStatusBadge(room.status)}`}>
                      {room.status}
                    </span>
                  </div>

                  {/* Features */}
                  <div className="flex flex-wrap gap-1.5 py-1">
                    {room.features.map((feature, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-slate-50 border border-slate-100 rounded text-[9px] font-mono text-slate-500">
                        {feature}
                      </span>
                    ))}
                  </div>

                  {/* Pricing / Occupancy Details */}
                  <div className="flex justify-between items-center pt-3 border-t border-slate-100/60 text-xs text-slate-500">
                    <div>
                      <span className="text-[10px] text-slate-400 font-mono block">NIGHTLY RATE</span>
                      <span className="text-sm font-semibold text-slate-900">${room.price}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 font-mono block">CAPACITY</span>
                      <span className="text-xs font-semibold text-slate-800">{room.maxOccupancy} Guests</span>
                    </div>
                  </div>

                  {/* Room management controls depending on staffRole */}
                  <div className="pt-3 border-t border-slate-100">
                    {isEditing ? (
                      <div className="space-y-2">
                        <span className="text-[9px] font-mono text-slate-400 block">SET OPERATIONAL STATUS:</span>
                        <div className="grid grid-cols-2 gap-1.5">
                          {(['Available', 'Occupied', 'Cleaning', 'Maintenance'] as RoomStatus[]).map((st) => (
                            <button
                              key={st}
                              onClick={() => {
                                onUpdateRoomStatus(room.id, st);
                                setActiveEditorRoomId(null);
                              }}
                              className="py-1 text-[9px] font-mono border rounded hover:bg-slate-50 text-slate-700"
                            >
                              {st}
                            </button>
                          ))}
                        </div>
                        <button
                          onClick={() => setActiveEditorRoomId(null)}
                          className="w-full text-center text-[10px] font-mono text-slate-400 hover:text-slate-800 pt-1"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setActiveEditorRoomId(room.id)}
                        className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-md border border-slate-200 flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <PenTool size={11} />
                        <span>Manage Room Status</span>
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
