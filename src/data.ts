import { Room, Booking, Guest, HousekeepingTask } from './types';

export const INITIAL_ROOMS: Room[] = [
  // Floor 1
  { id: '101', number: '101', type: 'Standard', status: 'Available', price: 150, floor: 1, maxOccupancy: 2, features: ['King Bed', 'City View', 'WiFi'] },
  { id: '102', number: '102', type: 'Standard', status: 'Occupied', price: 150, floor: 1, maxOccupancy: 2, features: ['Double Bed', 'WiFi', 'Desk Space'] },
  { id: '103', number: '103', type: 'Standard', status: 'Cleaning', price: 150, floor: 1, maxOccupancy: 2, features: ['King Bed', 'WiFi', 'Shower'] },
  { id: '104', number: '104', type: 'Deluxe', status: 'Available', price: 240, floor: 1, maxOccupancy: 3, features: ['King Bed', 'Garden View', 'Mini Bar', 'Espresso Machine'] },
  { id: '105', number: '105', type: 'Deluxe', status: 'Maintenance', price: 240, floor: 1, maxOccupancy: 3, features: ['Queen Beds', 'Garden View', 'Mini Bar', 'Bathtub'] },

  // Floor 2
  { id: '201', number: '201', type: 'Deluxe', status: 'Available', price: 260, floor: 2, maxOccupancy: 3, features: ['King Bed', 'Ocean View', 'Mini Bar', 'Balcony'] },
  { id: '202', number: '202', type: 'Deluxe', status: 'Occupied', price: 260, floor: 2, maxOccupancy: 3, features: ['King Bed', 'Ocean View', 'Mini Bar', 'Balcony'] },
  { id: '203', number: '203', type: 'Suite', status: 'Occupied', price: 450, floor: 2, maxOccupancy: 4, features: ['King Bed', 'Living Area', 'Ocean View', 'Balcony', 'Jacuzzi'] },
  { id: '204', number: '204', type: 'Suite', status: 'Available', price: 450, floor: 2, maxOccupancy: 4, features: ['King Bed', 'Living Area', 'Ocean View', 'Kitchenette', 'Espresso Machine'] },
  
  // Floor 3
  { id: '301', number: '301', type: 'Suite', status: 'Cleaning', price: 480, floor: 3, maxOccupancy: 4, features: ['King Bed', 'Living Area', 'Ocean View', 'Balcony', 'Bathtub'] },
  { id: '302', number: '302', type: 'Penthouse', status: 'Available', price: 950, floor: 3, maxOccupancy: 6, features: ['2 Master Bedrooms', 'Private Terrace', 'Plunge Pool', 'Chef Kitchen', 'Panoramic Ocean View'] },
];

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'BK-1082',
    guestName: 'Eleanor Vance',
    guestEmail: 'eleanor.v@vanceinc.com',
    guestPhone: '+1 (555) 321-9876',
    roomNumber: '202',
    roomType: 'Deluxe',
    checkIn: '2026-07-03',
    checkOut: '2026-07-08',
    status: 'CheckedIn',
    totalAmount: 1300,
    guestsCount: 2,
    notes: 'Requires extra towels and high floor preferance.',
    paymentStatus: 'Paid'
  },
  {
    id: 'BK-1083',
    guestName: 'Marcus Aurelius',
    guestEmail: 'marcus@philosophy.org',
    guestPhone: '+39 06 123456',
    roomNumber: '203',
    roomType: 'Suite',
    checkIn: '2026-07-01',
    checkOut: '2026-07-06',
    status: 'CheckedIn',
    totalAmount: 2250,
    guestsCount: 1,
    notes: 'Late evening quiet hours are highly valued.',
    paymentStatus: 'Paid'
  },
  {
    id: 'BK-1084',
    guestName: 'Sienna Brooks',
    guestEmail: 'sienna.brooks@gmail.com',
    guestPhone: '+44 20 7946 0958',
    roomNumber: '101',
    roomType: 'Standard',
    checkIn: '2026-07-05',
    checkOut: '2026-07-10',
    status: 'Confirmed',
    totalAmount: 750,
    guestsCount: 2,
    notes: 'Honeymoon couple. Bottle of champagne requested on arrival.',
    paymentStatus: 'Pending'
  },
  {
    id: 'BK-1085',
    guestName: 'Julian Sterling',
    guestEmail: 'julian@sterlingmgt.com',
    guestPhone: '+1 (555) 482-1029',
    roomNumber: '102',
    roomType: 'Standard',
    checkIn: '2026-07-04',
    checkOut: '2026-07-07',
    status: 'CheckedIn',
    totalAmount: 450,
    guestsCount: 1,
    notes: 'Business trip. Late check-out requested.',
    paymentStatus: 'Paid'
  },
  {
    id: 'BK-1086',
    guestName: 'Clara Oswald',
    guestEmail: 'clara.os@tardis.co.uk',
    guestPhone: '+44 7700 900077',
    roomNumber: '204',
    roomType: 'Suite',
    checkIn: '2026-07-06',
    checkOut: '2026-07-12',
    status: 'Confirmed',
    totalAmount: 2700,
    guestsCount: 2,
    notes: 'Celebrating wedding anniversary.',
    paymentStatus: 'Pending'
  }
];

export const INITIAL_GUESTS: Guest[] = [
  { id: 'G-01', name: 'Eleanor Vance', email: 'eleanor.v@vanceinc.com', phone: '+1 (555) 321-9876', loyaltyTier: 'Platinum', avatarColor: 'bg-indigo-600', totalSpent: 12450, totalVisits: 14 },
  { id: 'G-02', name: 'Marcus Aurelius', email: 'marcus@philosophy.org', phone: '+39 06 123456', loyaltyTier: 'Gold', avatarColor: 'bg-amber-500', totalSpent: 8900, totalVisits: 8 },
  { id: 'G-03', name: 'Sienna Brooks', email: 'sienna.brooks@gmail.com', phone: '+44 20 7946 0958', loyaltyTier: 'Silver', avatarColor: 'bg-emerald-600', totalSpent: 2200, totalVisits: 3 },
  { id: 'G-04', name: 'Julian Sterling', email: 'julian@sterlingmgt.com', phone: '+1 (555) 482-1029', loyaltyTier: 'Silver', avatarColor: 'bg-teal-600', totalSpent: 1850, totalVisits: 2 },
  { id: 'G-05', name: 'Clara Oswald', email: 'clara.os@tardis.co.uk', phone: '+44 7700 900077', loyaltyTier: 'Platinum', avatarColor: 'bg-rose-500', totalSpent: 15600, totalVisits: 18 }
];

export const INITIAL_TASKS: HousekeepingTask[] = [
  { id: 'T-01', roomNumber: '103', taskType: 'Full Clean', assignedTo: 'Clara Smith', priority: 'High', status: 'In Progress', notes: 'Checked out today. Guest for next reservation arriving 3 PM.' },
  { id: 'T-02', roomNumber: '301', taskType: 'Express Clean', assignedTo: 'John Doe', priority: 'Medium', status: 'Pending', notes: 'Change linens and replenish coffee capsules.' },
  { id: 'T-03', roomNumber: '105', taskType: 'Maintenance Repair', assignedTo: 'David Miller', priority: 'High', status: 'In Progress', notes: 'AC thermostat malfunctioning. Needs replacement.' },
  { id: 'T-04', roomNumber: '204', taskType: 'Turndown Service', assignedTo: 'Sarah Jenkins', priority: 'Low', status: 'Pending', notes: 'Prepare room for evening arrival of VIP anniversary couple.' }
];
