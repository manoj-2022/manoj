import React, { useState } from 'react';
import { Booking, BookingStatus, Room, RoomType } from '../types';
import { Search, Calendar, Check, X, ShieldAlert, Sparkles, DollarSign, User, Mail, Phone, Clock, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface BookingsManagerProps {
  bookings: Booking[];
  rooms: Room[];
  onCheckIn: (bookingId: string) => void;
  onCheckOut: (bookingId: string) => void;
  onCancelBooking: (bookingId: string) => void;
  onAddBooking: (booking: Omit<Booking, 'id'>) => void;
}

export default function BookingsManager({
  bookings,
  rooms,
  onCheckIn,
  onCheckOut,
  onCancelBooking,
  onAddBooking
}: BookingsManagerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<BookingStatus | 'All'>('All');
  const [isAddingNew, setIsAddingNew] = useState(false);

  // New Booking State Form
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [roomType, setRoomType] = useState<RoomType>('Standard');
  const [roomNumber, setRoomNumber] = useState('');
  const [checkIn, setCheckIn] = useState('2026-07-05');
  const [checkOut, setCheckOut] = useState('2026-07-08');
  const [guestsCount, setGuestsCount] = useState(1);
  const [notes, setNotes] = useState('');
  const [totalAmount, setTotalAmount] = useState(450);

  // Filter available rooms for form selection based on type
  const availableRoomsForType = rooms.filter(
    r => r.type === roomType && (r.status === 'Available' || r.status === 'Cleaning')
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim() || !guestEmail.trim()) {
      alert('Please fill out essential guest details.');
      return;
    }

    onAddBooking({
      guestName,
      guestEmail,
      guestPhone,
      roomNumber: roomNumber || (availableRoomsForType[0]?.number ?? '101'),
      roomType,
      checkIn,
      checkOut,
      status: 'Confirmed',
      totalAmount: totalAmount || 450,
      guestsCount,
      notes,
      paymentStatus: 'Pending'
    });

    // Reset Form
    setGuestName('');
    setGuestEmail('');
    setGuestPhone('');
    setNotes('');
    setIsAddingNew(false);
  };

  // Auto calculate estimated price when checkIn, checkOut, or RoomType updates
  React.useEffect(() => {
    const rate = roomType === 'Standard' ? 150 : roomType === 'Deluxe' ? 250 : roomType === 'Suite' ? 450 : 950;
    const date1 = new Date(checkIn);
    const date2 = new Date(checkOut);
    const diffTime = Math.abs(date2.getTime() - date1.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
    setTotalAmount(rate * diffDays);
  }, [roomType, checkIn, checkOut]);

  // Filter bookings
  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch = booking.guestName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          booking.roomNumber.includes(searchTerm);
    const matchesStatus = selectedStatus === 'All' || booking.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadgeClass = (status: BookingStatus) => {
    switch (status) {
      case 'Confirmed': return 'bg-sky-50 text-sky-700 border-sky-100 font-bold';
      case 'CheckedIn': return 'bg-indigo-50 text-indigo-700 border-indigo-100 font-bold';
      case 'CheckedOut': return 'bg-slate-100 text-slate-600 border-slate-200';
      case 'Cancelled': return 'bg-rose-50 text-rose-700 border-rose-100';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Search & Actions Bar */}
      <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="relative w-full md:w-80">
          <Search size={16} className="absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search by guest name, email, room..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:ring-1 focus:ring-amber-500 focus:bg-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Status filtering */}
          <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
            {(['All', 'Confirmed', 'CheckedIn', 'CheckedOut', 'Cancelled'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setSelectedStatus(st)}
                className={`px-3 py-1 text-[10px] font-semibold rounded capitalize transition-all ${
                  selectedStatus === st ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {st === 'CheckedIn' ? 'In-House' : st}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsAddingNew(true)}
            className="px-4 py-2 bg-slate-900 text-white hover:bg-slate-800 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all shadow-sm ml-auto"
          >
            <Plus size={14} /> Add Booking
          </button>
        </div>
      </div>

      {/* Interactive Reservation Creation Form Drawer/Dialog */}
      <AnimatePresence>
        {isAddingNew && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/45 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden"
            >
              {/* Form Header */}
              <div className="bg-slate-900 text-white px-6 py-4 flex justify-between items-center">
                <div>
                  <h3 className="font-serif text-lg font-bold">New Guest Reservation</h3>
                  <p className="text-[10px] text-slate-400">Generate verified booking ledger & room lock-in</p>
                </div>
                <button
                  onClick={() => setIsAddingNew(false)}
                  className="h-7 w-7 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors"
                >
                  <X size={14} />
                </button>
              </div>

              {/* Form Fields */}
              <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-4">
                  {/* Guest Name */}
                  <div className="col-span-2">
                    <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1">Full Guest Name</label>
                    <div className="relative">
                      <User size={14} className="absolute left-3 top-3 text-slate-400" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Eleanor Vance"
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-amber-500 focus:bg-white"
                      />
                    </div>
                  </div>

                  {/* Email & Phone */}
                  <div>
                    <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1">Email Address</label>
                    <div className="relative">
                      <Mail size={14} className="absolute left-3 top-3 text-slate-400" />
                      <input
                        type="email"
                        required
                        placeholder="e.g. eleanor@vance.com"
                        value={guestEmail}
                        onChange={(e) => setGuestEmail(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-amber-500 focus:bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1">Contact Phone</label>
                    <div className="relative">
                      <Phone size={14} className="absolute left-3 top-3 text-slate-400" />
                      <input
                        type="text"
                        placeholder="+1 (555) 000-0000"
                        value={guestPhone}
                        onChange={(e) => setGuestPhone(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-amber-500 focus:bg-white"
                      />
                    </div>
                  </div>

                  {/* Room Config */}
                  <div>
                    <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1">Room Class</label>
                    <select
                      value={roomType}
                      onChange={(e) => setRoomType(e.target.value as RoomType)}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-amber-500 focus:bg-white"
                    >
                      <option value="Standard">Standard ($150/n)</option>
                      <option value="Deluxe">Deluxe ($250/n)</option>
                      <option value="Suite">Suite ($450/n)</option>
                      <option value="Penthouse">Penthouse ($950/n)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1">Room Number Assignment</label>
                    <select
                      value={roomNumber}
                      onChange={(e) => setRoomNumber(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-amber-500 focus:bg-white"
                    >
                      {availableRoomsForType.length === 0 ? (
                        <option value="">No Rooms Available (Waitlist)</option>
                      ) : (
                        availableRoomsForType.map(r => (
                          <option key={r.id} value={r.number}>Room {r.number}</option>
                        ))
                      )}
                    </select>
                  </div>

                  {/* Check-In / Check-Out */}
                  <div>
                    <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1">Check-In Date</label>
                    <input
                      type="date"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-amber-500 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1">Check-Out Date</label>
                    <input
                      type="date"
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-amber-500 focus:bg-white"
                    />
                  </div>

                  {/* Occupants */}
                  <div>
                    <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1">Guests Count</label>
                    <input
                      type="number"
                      min="1"
                      max="6"
                      value={guestsCount}
                      onChange={(e) => setGuestsCount(parseInt(e.target.value))}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none"
                    />
                  </div>

                  {/* Auto Total Pricing display */}
                  <div>
                    <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1">Estimated Ledger Invoice</label>
                    <div className="w-full px-3 py-2.5 bg-amber-50 border border-amber-200 rounded-lg font-bold text-amber-900 flex items-center">
                      <DollarSign size={14} /> {totalAmount} USD
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1">Additional Notes & Amenities</label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Champagne set up on desk, late arrivals, allergies..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-amber-500 focus:bg-white resize-none"
                  />
                </div>

                <div className="pt-4 flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg"
                  >
                    Generate Active Reservation
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddingNew(false)}
                    className="px-5 py-3 border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold rounded-lg"
                  >
                    Discard
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bookings Ledger Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase font-mono tracking-wider text-[10px]">
                <th className="px-6 py-4">Booking ID</th>
                <th className="px-6 py-4">Guest</th>
                <th className="px-6 py-4">Room Specs</th>
                <th className="px-6 py-4">Duration</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4">Invoice</th>
                <th className="px-6 py-4 text-right">Lifecycle Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400 italic">
                    No reservations matching current filters found.
                  </td>
                </tr>
              ) : (
                filteredBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-slate-50/50 transition-colors">
                    {/* ID */}
                    <td className="px-6 py-4 font-mono text-[11px] text-indigo-600 font-bold">
                      {booking.id}
                    </td>

                    {/* Guest Contact */}
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-slate-900 text-sm">{booking.guestName}</p>
                        <p className="text-[10px] text-slate-400 font-mono mt-0.5">{booking.guestEmail}</p>
                        <p className="text-[10px] text-slate-400 font-mono">{booking.guestPhone}</p>
                      </div>
                    </td>

                    {/* Room details */}
                    <td className="px-6 py-4">
                      <div>
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-800 rounded font-bold font-mono text-[10px]">
                          Room {booking.roomNumber}
                        </span>
                        <p className="text-[10px] text-slate-400 font-mono mt-1">{booking.roomType} Suite</p>
                      </div>
                    </td>

                    {/* CheckIn -> CheckOut */}
                    <td className="px-6 py-4 text-slate-600 font-mono text-[11px]">
                      <div className="flex items-center gap-1">
                        <span>{booking.checkIn}</span>
                        <span className="text-slate-400">→</span>
                        <span>{booking.checkOut}</span>
                      </div>
                    </td>

                    {/* Status badge */}
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2.5 py-1 text-[10px] rounded-full border ${getStatusBadgeClass(booking.status)}`}>
                        {booking.status === 'CheckedIn' ? 'Checked In' : booking.status === 'CheckedOut' ? 'Checked Out' : booking.status}
                      </span>
                    </td>

                    {/* Payment Invoice details */}
                    <td className="px-6 py-4">
                      <div className="space-y-0.5">
                        <span className="font-semibold text-slate-900 font-mono">${booking.totalAmount}</span>
                        <span className={`block text-[9px] font-bold uppercase tracking-widest ${booking.paymentStatus === 'Paid' ? 'text-emerald-600' : 'text-amber-600'}`}>
                          {booking.paymentStatus}
                        </span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1.5">
                        {booking.status === 'Confirmed' && (
                          <>
                            <button
                              onClick={() => onCheckIn(booking.id)}
                              className="px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded text-[10px] transition-colors"
                              title="Check-In Guest"
                            >
                              Check-In
                            </button>
                            <button
                              onClick={() => onCancelBooking(booking.id)}
                              className="px-2 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 font-semibold rounded text-[10px] border border-rose-100 transition-colors"
                              title="Cancel Booking"
                            >
                              Cancel
                            </button>
                          </>
                        )}
                        {booking.status === 'CheckedIn' && (
                          <button
                            onClick={() => onCheckOut(booking.id)}
                            className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded text-[10px] transition-colors"
                            title="Check-Out Guest & Release Room"
                          >
                            Check-Out
                          </button>
                        )}
                        {(booking.status === 'CheckedOut' || booking.status === 'Cancelled') && (
                          <span className="text-[11px] text-slate-400 font-mono italic">Archived</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
