import React, { useState } from 'react';
import { Guest, LoyaltyTier } from '../types';
import { Search, User, Mail, Phone, Medal, Trash2, Plus, Sparkles, Filter, Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface GuestDirectoryProps {
  guests: Guest[];
  onAddGuest: (guest: Omit<Guest, 'id'>) => void;
  onRemoveGuest?: (id: string) => void;
}

export default function GuestDirectory({ guests, onAddGuest, onRemoveGuest }: GuestDirectoryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTier, setSelectedTier] = useState<LoyaltyTier | 'All'>('All');
  const [isAddingNew, setIsAddingNew] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loyaltyTier, setLoyaltyTier] = useState<LoyaltyTier>('Silver');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    const colors = ['bg-indigo-600', 'bg-emerald-600', 'bg-rose-500', 'bg-amber-500', 'bg-teal-600'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    onAddGuest({
      name,
      email,
      phone,
      loyaltyTier,
      avatarColor: randomColor,
      totalSpent: 0,
      totalVisits: 1
    });

    setName('');
    setEmail('');
    setPhone('');
    setIsAddingNew(false);
  };

  const getTierIcon = (tier: LoyaltyTier) => {
    switch (tier) {
      case 'Platinum': return <Medal size={13} className="text-indigo-400" />;
      case 'Gold': return <Medal size={13} className="text-amber-500" />;
      case 'Silver': return <Medal size={13} className="text-slate-400" />;
    }
  };

  const getTierClass = (tier: LoyaltyTier) => {
    switch (tier) {
      case 'Platinum': return 'bg-indigo-950 text-indigo-300 border-indigo-800';
      case 'Gold': return 'bg-amber-950 text-amber-300 border-amber-800';
      case 'Silver': return 'bg-slate-900 text-slate-300 border-slate-700';
    }
  };

  // Filter list
  const filteredGuests = guests.filter(guest => {
    const matchesSearch = guest.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          guest.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTier = selectedTier === 'All' || guest.loyaltyTier === selectedTier;
    return matchesSearch && matchesTier;
  });

  return (
    <div className="space-y-6">
      {/* Control Filters */}
      <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="relative w-full md:w-80">
          <Search size={16} className="absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search VIPs by name, email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:ring-1 focus:ring-amber-500 focus:bg-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Tier filter */}
          <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
            {(['All', 'Platinum', 'Gold', 'Silver'] as const).map((tier) => (
              <button
                key={tier}
                onClick={() => setSelectedTier(tier)}
                className={`px-3 py-1 text-[10px] font-semibold rounded capitalize transition-all ${
                  selectedTier === tier ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {tier}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsAddingNew(true)}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all shadow-sm ml-auto"
          >
            <Plus size={14} /> Add VIP Profile
          </button>
        </div>
      </div>

      {/* Slide-in Guest Dialog */}
      <AnimatePresence>
        {isAddingNew && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden"
            >
              <div className="bg-slate-900 text-white px-6 py-4 flex justify-between items-center">
                <div>
                  <h3 className="font-serif text-lg font-bold">Register Guest Profile</h3>
                  <p className="text-[10px] text-slate-400">Initialize a client log with custom loyalty benefits</p>
                </div>
                <button onClick={() => setIsAddingNew(false)} className="text-slate-400 hover:text-white">
                  <X size={15} />
                </button>
              </div>

              <form onSubmit={handleCreate} className="p-6 space-y-4 text-xs">
                <div>
                  <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1">Full Guest Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Eleanor Vance"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-amber-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. eleanor@vanceinc.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-amber-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1">Mobile Contact</label>
                  <input
                    type="text"
                    placeholder="e.g. +1 (555) 321-9876"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1">Loyalty Tier Status</label>
                  <select
                    value={loyaltyTier}
                    onChange={(e) => setLoyaltyTier(e.target.value as LoyaltyTier)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none"
                  >
                    <option value="Silver">Silver (Muted privileges)</option>
                    <option value="Gold">Gold (Lounge access + complimentary drinks)</option>
                    <option value="Platinum">Platinum (Suite upgrades + concierge + late check-out)</option>
                  </select>
                </div>

                <div className="pt-4 flex gap-3">
                  <button type="submit" className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg">
                    Enroll Member
                  </button>
                  <button type="button" onClick={() => setIsAddingNew(false)} className="px-4 py-2.5 border border-slate-200 text-slate-600 rounded-lg">
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Guest Directory Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <AnimatePresence mode="popLayout">
          {filteredGuests.map((guest) => (
            <motion.div
              key={guest.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white p-5 rounded-xl border border-slate-200/80 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Header: Avatar, Name & Loyalty Badge */}
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className={`h-11 w-11 rounded-full ${guest.avatarColor} text-white flex items-center justify-center font-serif text-lg font-bold shadow-inner`}>
                      {guest.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-serif text-base font-bold text-slate-900">{guest.name}</h4>
                      <span className="text-[10px] font-mono text-slate-400">ID: {guest.id}</span>
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 text-[9px] rounded font-mono uppercase tracking-widest border flex items-center gap-1 ${getTierClass(guest.loyaltyTier)}`}>
                    {getTierIcon(guest.loyaltyTier)}
                    <span>{guest.loyaltyTier}</span>
                  </span>
                </div>

                {/* Contacts details */}
                <div className="space-y-1.5 text-xs text-slate-600 border-t border-b border-slate-100/60 py-3 font-mono">
                  <div className="flex items-center gap-2">
                    <Mail size={12} className="text-slate-400" />
                    <span className="truncate">{guest.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone size={12} className="text-slate-400" />
                    <span>{guest.phone || 'No phone recorded'}</span>
                  </div>
                </div>
              </div>

              {/* Statistical ledger */}
              <div className="flex justify-between items-center pt-4 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 font-mono block">VISITS REGISTERED</span>
                  <span className="font-bold text-slate-800">{guest.totalVisits} stays</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 font-mono block">ACCUMULATED SPEND</span>
                  <span className="font-mono font-bold text-emerald-700">${guest.totalSpent.toLocaleString()}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
