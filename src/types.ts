export type RoomType = 'Standard' | 'Deluxe' | 'Suite' | 'Penthouse';
export type RoomStatus = 'Available' | 'Occupied' | 'Cleaning' | 'Maintenance';
export type BookingStatus = 'Confirmed' | 'CheckedIn' | 'CheckedOut' | 'Cancelled';
export type LoyaltyTier = 'Silver' | 'Gold' | 'Platinum';

export interface Room {
  id: string;
  number: string;
  type: RoomType;
  status: RoomStatus;
  price: number;
  floor: number;
  features: string[];
  maxOccupancy: number;
}

export interface Booking {
  id: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  roomNumber: string;
  roomType: RoomType;
  checkIn: string;
  checkOut: string;
  status: BookingStatus;
  totalAmount: number;
  guestsCount: number;
  notes?: string;
  paymentStatus: 'Paid' | 'Pending';
}

export interface Guest {
  id: string;
  name: string;
  email: string;
  phone: string;
  loyaltyTier: LoyaltyTier;
  avatarColor: string;
  totalSpent: number;
  totalVisits: number;
}

export interface HousekeepingTask {
  id: string;
  roomNumber: string;
  taskType: 'Full Clean' | 'Express Clean' | 'Maintenance Repair' | 'Turndown Service';
  assignedTo: string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'Pending' | 'In Progress' | 'Completed';
  notes?: string;
}
