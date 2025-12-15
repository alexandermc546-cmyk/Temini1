export interface TrainDetails {
  trainNumber: string;
  trainName: string;
  currentStation: string;
  status: string; // 'On Time' | 'Delayed' | 'Departed'
  coordinates?: { lat: number; lng: number };
  nextStation: string;
  eta: string;
}

export interface Ticket {
  id: string;
  passengerName: string;
  age: number;
  gender: string;
  seatClass: 'SL' | '3A' | '2A' | '1A';
  fare: number;
  commission: number;
  total: number;
  status: 'booked' | 'pending';
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isMapData?: boolean;
}
