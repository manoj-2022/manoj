import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import DashboardOverview from './components/DashboardOverview';
import RoomGrid from './components/RoomGrid';
import BookingsManager from './components/BookingsManager';
import GuestDirectory from './components/GuestDirectory';
import HousekeepingPlanner from './components/HousekeepingPlanner';

import { Room, Booking, Guest, HousekeepingTask, RoomStatus } from './types';
import { INITIAL_ROOMS, INITIAL_BOOKINGS, INITIAL_GUESTS, INITIAL_TASKS } from './data';

import { LayoutDashboard, BedDouble, CalendarCheck, Users, ClipboardCheck, Bell, Sparkles, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [currentRole, setCurrentRole] = useState<string>('Front Desk');

  // Unified persistent or reactive state
  const [rooms, setRooms] = useState<Room[]>(() => {
    const saved = localStorage.getItem('aurelia_rooms');
    return saved ? JSON.parse(saved) : INITIAL_ROOMS;
  });

  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem('aurelia_bookings');
    return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
  });

  const [guests, setGuests] = useState<Guest[]>(() => {
    const saved = localStorage.getItem('aurelia_guests');
    return saved ? JSON.parse(saved) : INITIAL_GUESTS;
  });

  const [tasks, setTasks] = useState<HousekeepingTask[]>(() => {
    const saved = localStorage.getItem('aurelia_tasks');
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });

  const [notifications, setNotifications] = useState<{ id: string; text: string; type: 'success' | 'info' | 'warning' }[]>([]);
  const [isShortcutBookingModalOpen, setIsShortcutBookingModalOpen] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('aurelia_rooms', JSON.stringify(rooms));
  }, [rooms]);

  useEffect(() => {
    localStorage.setItem('aurelia_bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('aurelia_guests', JSON.stringify(guests));
  }, [guests]);

  useEffect(() => {
    localStorage.setItem('aurelia_tasks', JSON.stringify(tasks));
  }, [tasks]);

  const showNotification = (text: string, type: 'success' | 'info' | 'warning' = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setNotifications(prev => [...prev, { id, text, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 4500);
  };

  // State Updates: Room status changes
  const handleUpdateRoomStatus = (roomId: string, status: RoomStatus) => {
    setRooms(prev => prev.map(r => r.id === roomId ? { ...r, status } : r));
    const roomNum = rooms.find(r => r.id === roomId)?.number;
    showNotification(`Room ${roomNum || roomId} updated to ${status}.`, 'info');
  };

  // Check In Guest logic
  const handleCheckIn = (bookingId: string) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return;

    // Update booking status
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'CheckedIn' as const, paymentStatus: 'Paid' as const } : b));
    
    // Lock Room status to Occupied
    setRooms(prev => prev.map(r => r.number === booking.roomNumber ? { ...r, status: 'Occupied' as const } : r));

    showNotification(`Successfully checked in ${booking.guestName} into Room ${booking.roomNumber}.`, 'success');
  };

  // Check Out Guest logic
  const handleCheckOut = (bookingId: string) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return;

    // Update booking status
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'CheckedOut' as const } : b));
    
    // Set Room status to Cleaning
    setRooms(prev => prev.map(r => r.number === booking.roomNumber ? { ...r, status: 'Cleaning' as const } : r));

    // Automatically trigger a Housekeeping clean task!
    const newTask: HousekeepingTask = {
      id: `T-${Math.floor(10 + Math.random() * 90)}`,
      roomNumber: booking.roomNumber,
      taskType: 'Full Clean',
      assignedTo: 'On-Call Staff',
      priority: 'High',
      status: 'Pending',
      notes: `Immediate post-checkout full sanitation. Guest check-out: ${booking.guestName}.`
    };
    setTasks(prev => [newTask, ...prev]);

    showNotification(`Guest checked out of Room ${booking.roomNumber}. Sanitation order has been dispatched.`, 'info');
  };

  // Cancel Booking
  const handleCancelBooking = (bookingId: string) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return;

    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'Cancelled' as const } : b));
    showNotification(`Cancelled reservation ${bookingId} for ${booking.guestName}.`, 'warning');
  };

  // Add Reservation Booking
  const handleAddBooking = (newBookingData: Omit<Booking, 'id'>) => {
    const newId = `BK-${Math.floor(1000 + Math.random() * 9000)}`;
    const newBooking: Booking = {
      ...newBookingData,
      id: newId
    };

    setBookings(prev => [newBooking, ...prev]);

    // If checkIn is immediate today, change the room's status (optional, usually front desk clicks 'Check In' explicitly)
    showNotification(`Created reservation ledger ${newId} for ${newBooking.guestName}.`, 'success');
  };

  // Add VIP Member profile
  const handleAddGuest = (newGuestData: Omit<Guest, 'id'>) => {
    const newId = `G-${Math.floor(10 + Math.random() * 90)}`;
    const newGuest: Guest = {
      ...newGuestData,
      id: newId
    };
    setGuests(prev => [newGuest, ...prev]);
    showNotification(`Loyalty program profile ${newId} created for ${newGuest.name}.`, 'success');
  };

  // Update Housekeeping task status
  const handleUpdateTaskStatus = (taskId: string, status: 'Pending' | 'In Progress' | 'Completed') => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status } : t));
    
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    showNotification(`Housekeeping task ${taskId} marked as ${status}.`, 'info');

    // Super intelligence logic: if cleaning task is marked COMPLETED, set the room back to Available!
    if (status === 'Completed' && (task.taskType === 'Full Clean' || task.taskType === 'Express Clean')) {
      setRooms(prev => prev.map(r => r.number === task.roomNumber ? { ...r, status: 'Available' as const } : r));
      showNotification(`Room ${task.roomNumber} is now sanitized & marked AVAILABLE.`, 'success');
    }
  };

  // Dispatch new manual task
  const handleAddTask = (newTaskData: Omit<HousekeepingTask, 'id'>) => {
    const newId = `T-${Math.floor(10 + Math.random() * 90)}`;
    const newTask: HousekeepingTask = {
      ...newTaskData,
      id: newId
    };
    setTasks(prev => [newTask, ...prev]);
    showNotification(`Dispatched task ${newId} for Room ${newTask.roomNumber}.`, 'info');
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-slate-900 font-sans selection:bg-amber-500 selection:text-slate-950 pb-20">
      
      {/* Premium Header */}
      <Header
        currentRole={currentRole}
        onRoleChange={setCurrentRole}
        onOpenBookingModal={() => setIsShortcutBookingModalOpen(true)}
      />

      {/* Floating Notifications Toasts */}
      <div className="fixed top-24 right-6 z-50 space-y-2.5 max-w-sm pointer-events-none">
        <AnimatePresence>
          {notifications.map(n => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, x: 40, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 40, scale: 0.9 }}
              className={`p-3.5 rounded-xl border shadow-xl flex items-center gap-3 text-xs font-semibold pointer-events-auto bg-white ${
                n.type === 'success' ? 'border-emerald-200 text-emerald-950' :
                n.type === 'warning' ? 'border-rose-200 text-rose-950' : 'border-slate-200 text-slate-800'
              }`}
            >
              <span className={`h-2.5 w-2.5 rounded-full ${
                n.type === 'success' ? 'bg-emerald-500' :
                n.type === 'warning' ? 'bg-rose-500' : 'bg-indigo-500'
              }`} />
              <p className="flex-1 leading-normal">{n.text}</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Sidebar Nav (Fully responsive bento bar) */}
        <aside className="lg:col-span-3 space-y-6">
          {/* Quick Branding overview widget */}
          <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 shadow-md relative overflow-hidden">
            {/* Elegant background lines */}
            <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:10px_10px]" />
            <div className="relative space-y-4">
              <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest font-bold block">★ ★ ★ ★ ★ FIVE-STAR LUXURY</span>
              <div>
                <h3 className="font-serif text-xl font-bold leading-tight">The Aurelia Grand</h3>
                <p className="text-[11px] text-slate-400 font-mono mt-0.5">EST. 2026 // MONACO</p>
              </div>
              <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex justify-between items-center">
                <span>Active Portal:</span>
                <span className="text-white font-bold font-mono">{currentRole}</span>
              </div>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-1">
            <span className="px-3 text-[10px] font-mono text-slate-400 uppercase font-semibold mb-2 block">Property Console</span>
            
            <button
              onClick={() => setCurrentTab('dashboard')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
                currentTab === 'dashboard'
                  ? 'bg-amber-500/10 text-amber-950 font-bold border border-amber-500/20'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-transparent'
              }`}
            >
              <LayoutDashboard size={16} />
              <span>Dashboard Overview</span>
            </button>

            <button
              onClick={() => setCurrentTab('rooms')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
                currentTab === 'rooms'
                  ? 'bg-amber-500/10 text-amber-950 font-bold border border-amber-500/20'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-transparent'
              }`}
            >
              <BedDouble size={16} />
              <span>Rooms & Operations</span>
            </button>

            <button
              onClick={() => setCurrentTab('bookings')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
                currentTab === 'bookings'
                  ? 'bg-amber-500/10 text-amber-950 font-bold border border-amber-500/20'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-transparent'
              }`}
            >
              <CalendarCheck size={16} />
              <span>Reservations Ledger</span>
            </button>

            <button
              onClick={() => setCurrentTab('guests')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
                currentTab === 'guests'
                  ? 'bg-amber-500/10 text-amber-950 font-bold border border-amber-500/20'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-transparent'
              }`}
            >
              <Users size={16} />
              <span>VIP Guest Directory</span>
            </button>

            <button
              onClick={() => setCurrentTab('housekeeping')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
                currentTab === 'housekeeping'
                  ? 'bg-amber-500/10 text-amber-950 font-bold border border-amber-500/20'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-transparent'
              }`}
            >
              <ClipboardCheck size={16} />
              <span>Housekeeping Planner</span>
            </button>
          </nav>
        </aside>

        {/* Dynamic Main Workspace Column */}
        <main className="lg:col-span-9">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.18 }}
            >
              {currentTab === 'dashboard' && (
                <DashboardOverview
                  rooms={rooms}
                  bookings={bookings}
                  guests={guests}
                  tasks={tasks}
                  onNavigate={setCurrentTab}
                  onCheckIn={handleCheckIn}
                />
              )}

              {currentTab === 'rooms' && (
                <RoomGrid
                  rooms={rooms}
                  onUpdateRoomStatus={handleUpdateRoomStatus}
                  staffRole={currentRole}
                />
              )}

              {currentTab === 'bookings' && (
                <BookingsManager
                  bookings={bookings}
                  rooms={rooms}
                  onCheckIn={handleCheckIn}
                  onCheckOut={handleCheckOut}
                  onCancelBooking={handleCancelBooking}
                  onAddBooking={handleAddBooking}
                />
              )}

              {currentTab === 'guests' && (
                <GuestDirectory
                  guests={guests}
                  onAddGuest={handleAddGuest}
                />
              )}

              {currentTab === 'housekeeping' && (
                <HousekeepingPlanner
                  tasks={tasks}
                  rooms={rooms}
                  onUpdateTaskStatus={handleUpdateTaskStatus}
                  onAddTask={handleAddTask}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Shortcut Booking Dialog */}
      <AnimatePresence>
        {isShortcutBookingModalOpen && (
          <BookingsManager
            bookings={bookings}
            rooms={rooms}
            onCheckIn={handleCheckIn}
            onCheckOut={handleCheckOut}
            onCancelBooking={handleCancelBooking}
            onAddBooking={(newBooking) => {
              handleAddBooking(newBooking);
              setIsShortcutBookingModalOpen(false);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
