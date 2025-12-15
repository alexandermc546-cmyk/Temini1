import React, { useState } from 'react';
import { Search, MapPin, Train as TrainIcon, Calendar, Clock, Loader2, Navigation } from 'lucide-react';
import { searchTrainWithGemini } from './services/geminiService';
import { TrainDetails } from './types';
import LiveMap from './components/LiveMap';
import BookingFlow from './components/BookingFlow';

function App() {
  const [trainNumber, setTrainNumber] = useState('');
  const [trainDetails, setTrainDetails] = useState<TrainDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trainNumber.trim()) return;

    setLoading(true);
    setError('');
    setTrainDetails(null);

    try {
      const details = await searchTrainWithGemini(trainNumber);
      setTrainDetails(details);
    } catch (err) {
      setError('Failed to fetch train details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      {/* Navbar */}
      <nav className="bg-blue-700 text-white shadow-lg sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-white p-1.5 rounded-lg">
                <TrainIcon className="w-6 h-6 text-blue-700" />
            </div>
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Temini1</h1>
                <p className="text-xs text-blue-200">Live Train & Booking</p>
            </div>
          </div>
          <div className="hidden md:block text-sm bg-blue-800 px-3 py-1 rounded-full">
            Made with Google Gemini API
          </div>
        </div>
      </nav>

      <main className="flex-grow container mx-auto px-4 py-6 flex flex-col gap-6">
        
        {/* Search Bar */}
        <div className="w-full max-w-3xl mx-auto">
          <form onSubmit={handleSearch} className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
            </div>
            <input
              type="text"
              className="block w-full pl-11 pr-4 py-4 bg-white border-2 border-gray-100 rounded-2xl shadow-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
              placeholder="Enter Train Number (e.g., 12951, 12002)"
              value={trainNumber}
              onChange={(e) => setTrainNumber(e.target.value)}
            />
            <button 
              type="submit"
              disabled={loading}
              className="absolute right-2 top-2 bottom-2 bg-blue-600 text-white px-6 rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed transition-all shadow-md flex items-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Search'}
            </button>
          </form>
          {error && <p className="mt-2 text-red-500 text-sm text-center">{error}</p>}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full min-h-[500px]">
          
          {/* Left Panel: Train Info */}
          <div className="lg:col-span-1 space-y-6">
            {trainDetails ? (
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 animate-in slide-in-from-left duration-500">
                <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-6 text-white">
                  <h2 className="text-2xl font-bold">{trainDetails.trainName}</h2>
                  <p className="opacity-90 font-mono mt-1">#{trainDetails.trainNumber}</p>
                </div>
                
                <div className="p-6 space-y-6">
                  {/* Status Indicator */}
                  <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <div className={`w-3 h-3 rounded-full ${trainDetails.status === 'On Time' ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]'}`}></div>
                    <div>
                      <p className="text-sm text-gray-500 uppercase font-semibold tracking-wide">Current Status</p>
                      <p className={`font-bold text-lg ${trainDetails.status === 'On Time' ? 'text-green-700' : 'text-red-700'}`}>
                        {trainDetails.status}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <div className="mt-1 bg-blue-100 p-2 rounded-lg h-fit">
                        <MapPin className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Current Station</p>
                        <p className="font-semibold text-gray-900">{trainDetails.currentStation}</p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="mt-1 bg-indigo-100 p-2 rounded-lg h-fit">
                        <Navigation className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Next Station</p>
                        <p className="font-semibold text-gray-900">{trainDetails.nextStation}</p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="mt-1 bg-orange-100 p-2 rounded-lg h-fit">
                        <Clock className="w-5 h-5 text-orange-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Estimated Arrival</p>
                        <p className="font-semibold text-gray-900">{trainDetails.eta}</p>
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={() => setIsBookingOpen(true)}
                    className="w-full bg-gray-900 hover:bg-black text-white font-bold py-4 rounded-xl shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] flex justify-center items-center gap-2"
                  >
                    <Calendar className="w-5 h-5" />
                    Buy Ticket
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-lg p-8 text-center border border-gray-100 h-full flex flex-col justify-center items-center text-gray-400">
                 <div className="bg-gray-50 p-6 rounded-full mb-4">
                    <TrainIcon className="w-12 h-12 text-gray-300" />
                 </div>
                 <h3 className="text-lg font-medium text-gray-900">No Train Selected</h3>
                 <p className="mt-1">Enter a train number to track location and book tickets.</p>
              </div>
            )}
          </div>

          {/* Right Panel: Map */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden relative min-h-[400px]">
             <LiveMap train={trainDetails} />
             {!trainDetails && (
               <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-[400]">
                 <p className="text-gray-500 font-medium bg-white px-4 py-2 rounded-lg shadow-sm">
                    Map will update when you search for a train
                 </p>
               </div>
             )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-6 mt-auto">
        <div className="container mx-auto px-4 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Temini1. Real-time Train Tracking System.</p>
        </div>
      </footer>

      {/* Booking Modal */}
      {isBookingOpen && trainDetails && (
        <BookingFlow train={trainDetails} onClose={() => setIsBookingOpen(false)} />
      )}
    </div>
  );
}

export default App;