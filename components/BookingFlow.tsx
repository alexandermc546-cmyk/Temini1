import React, { useState } from 'react';
import { Ticket, TrainDetails } from '../types';
import { COMMISSION_RATE, CURRENCY } from '../constants';
import { Ticket as TicketIcon, CheckCircle, Train, CreditCard, X } from 'lucide-react';

interface BookingFlowProps {
  train: TrainDetails;
  onClose: () => void;
}

const BookingFlow: React.FC<BookingFlowProps> = ({ train, onClose }) => {
  const [step, setStep] = useState<'details' | 'payment' | 'success'>('details');
  const [passenger, setPassenger] = useState({ name: '', age: '', gender: 'Male' });
  const [seatClass, setSeatClass] = useState<'SL' | '3A' | '2A' | '1A'>('SL');
  const [ticket, setTicket] = useState<Ticket | null>(null);

  const baseFare = {
    'SL': 450,
    '3A': 1200,
    '2A': 1800,
    '1A': 3200
  }[seatClass];

  const commission = Math.round(baseFare * COMMISSION_RATE);
  const total = baseFare + commission;

  const handleBook = () => {
    if (!passenger.name || !passenger.age) {
      alert("Please fill in all passenger details.");
      return;
    }
    setTicket({
      id: Math.random().toString(36).substr(2, 9).toUpperCase(),
      passengerName: passenger.name,
      age: parseInt(passenger.age),
      gender: passenger.gender,
      seatClass,
      fare: baseFare,
      commission,
      total,
      status: 'pending'
    });
    setStep('payment');
  };

  const handlePayment = () => {
    // Simulate API call for payment
    setTimeout(() => {
      if (ticket) {
        setTicket({ ...ticket, status: 'booked' });
        setStep('success');
      }
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-300">
        
        {/* Header */}
        <div className="bg-blue-600 p-4 text-white flex justify-between items-center shrink-0">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <TicketIcon className="w-5 h-5" /> 
            {step === 'success' ? 'Ticket Confirmed' : 'Book Ticket'}
          </h2>
          <button onClick={onClose} className="hover:bg-blue-700 p-1 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-grow">
          {step === 'details' && (
            <div className="space-y-5">
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                 <h3 className="font-bold text-blue-900 flex items-center gap-2">
                    <Train className="w-4 h-4" />
                    {train.trainName} ({train.trainNumber})
                 </h3>
                 <div className="mt-2 text-sm text-blue-700 flex justify-between">
                    <span>{train.currentStation}</span>
                    <span>➔</span>
                    <span>{train.nextStation}</span>
                 </div>
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">Passenger Name</label>
                <input 
                  type="text" 
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  value={passenger.name}
                  onChange={e => setPassenger({...passenger, name: e.target.value})}
                  placeholder="Enter full name"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">Age</label>
                  <input 
                    type="number" 
                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                    value={passenger.age}
                    onChange={e => setPassenger({...passenger, age: e.target.value})}
                    placeholder="Age"
                  />
                </div>
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">Gender</label>
                  <select 
                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                    value={passenger.gender}
                    onChange={e => setPassenger({...passenger, gender: e.target.value})}
                  >
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">Class Preference</label>
                <div className="grid grid-cols-4 gap-2">
                  {(['SL', '3A', '2A', '1A'] as const).map(c => (
                    <button
                      key={c}
                      onClick={() => setSeatClass(c)}
                      className={`p-2 rounded-lg text-sm font-bold border transition-all duration-200
                        ${seatClass === c 
                          ? 'bg-blue-600 text-white border-blue-600 shadow-md transform scale-105' 
                          : 'bg-white text-gray-600 border-gray-200 hover:border-blue-400 hover:bg-blue-50'
                        }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-xl space-y-2 border border-gray-200">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Base Fare ({seatClass})</span>
                  <span>{CURRENCY} {baseFare}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Commission (2%)</span>
                  <span>{CURRENCY} {commission}</span>
                </div>
                <div className="h-px bg-gray-300 my-2"></div>
                <div className="flex justify-between font-bold text-lg text-gray-900">
                  <span>Total Pay</span>
                  <span>{CURRENCY} {total}</span>
                </div>
              </div>

              <button 
                onClick={handleBook}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2"
              >
                Proceed to Payment
              </button>
            </div>
          )}

          {step === 'payment' && (
            <div className="space-y-6 py-4">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto text-blue-600">
                    <CreditCard className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold">Payment Gateway</h3>
                <p className="text-gray-500">Secure simulated transaction</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                <p className="text-sm text-gray-500 mb-1">Amount to Pay</p>
                <p className="text-3xl font-bold text-gray-900">{CURRENCY} {ticket?.total}</p>
              </div>
              
              <div className="space-y-3">
                 <button 
                   onClick={handlePayment}
                   className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl shadow-lg transition-colors"
                 >
                   Pay {CURRENCY} {ticket?.total} via UPI
                 </button>
                 <button 
                   onClick={() => setStep('details')}
                   className="w-full text-gray-500 hover:text-gray-700 font-medium py-2"
                 >
                   Cancel
                 </button>
              </div>
            </div>
          )}

          {step === 'success' && ticket && (
            <div className="space-y-6 text-center py-4">
               <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600 animate-bounce">
                  <CheckCircle className="w-10 h-10" />
               </div>
               
               <div>
                 <h3 className="text-2xl font-bold text-green-700">Booking Confirmed!</h3>
                 <p className="text-gray-500">PNR: {ticket.id}</p>
               </div>

               <div className="bg-white border-2 border-dashed border-gray-300 p-4 rounded-xl text-left space-y-2 relative">
                  <div className="absolute -left-3 top-1/2 w-6 h-6 bg-white border-r-2 border-gray-300 rounded-full transform -translate-y-1/2"></div>
                  <div className="absolute -right-3 top-1/2 w-6 h-6 bg-white border-l-2 border-gray-300 rounded-full transform -translate-y-1/2"></div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Train</span>
                    <span className="font-semibold">{train.trainNumber}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Passenger</span>
                    <span className="font-semibold">{ticket.passengerName}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Class</span>
                    <span className="font-semibold">{ticket.seatClass}</span>
                  </div>
                   <div className="flex justify-between items-center pt-2 border-t">
                    <span className="text-sm text-gray-500">Total Paid</span>
                    <span className="font-bold text-blue-600">{CURRENCY} {ticket.total}</span>
                  </div>
               </div>

               <button 
                 onClick={onClose}
                 className="w-full bg-gray-900 hover:bg-black text-white font-bold py-3 rounded-xl shadow-lg transition-colors"
               >
                 Close
               </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingFlow;