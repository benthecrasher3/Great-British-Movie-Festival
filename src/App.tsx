import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Film, Calendar, Star, ChevronRight, Play, Search, X, CheckCircle2, Check, ShoppingBag, Coffee, CreditCard, Lock, QrCode, Smartphone, Menu, Music, Sparkles, Gift, Ticket, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { MOVIES, EVENTS, FOOD_ITEMS } from './constants';
import { Login, AdminDashboard } from './components/AdminUI';
import { Movie, FoodItem } from './types';

interface TicketModalProps {
  show: boolean;
  onClose: () => void;
  selectedMovie: any;
  selectedEvent: any;
  ticketData: any;
  setTicketData: (data: any) => void;
  bookingStep: 'details' | 'payment' | 'success';
  setBookingStep: (step: 'details' | 'payment' | 'success') => void;
  onConfirm: () => void;
  bookings: any[];
  ticketPrice: number;
  isLoggedIn: boolean;
}

const TicketModal = ({ 
  show, 
  onClose, 
  selectedMovie, 
  selectedEvent, 
  ticketData, 
  setTicketData, 
  bookingStep, 
  setBookingStep, 
  onConfirm,
  bookings,
  ticketPrice,
  isLoggedIn
}: TicketModalProps) => {
  const selectedItem = selectedMovie || selectedEvent;
  if (!show || !selectedItem) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-xl bg-white shadow-2xl border border-black/5 overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-british-blue" />
          
          <button 
            onClick={onClose}
            className="absolute top-8 right-8 text-black/20 hover:text-british-blue transition-colors z-10"
          >
            <X size={24} />
          </button>

          {bookingStep === 'details' && (
            <div className="p-8 md:p-16">
              <div className="mb-12">
                <h3 className="text-british-blue text-[10px] font-black uppercase tracking-[0.5em] mb-4">Registration</h3>
                <h2 className="text-4xl md:text-5xl font-display font-black uppercase leading-tight tracking-tighter text-zinc-900">
                  Reserve <br /> <span className="font-serif italic font-light text-zinc-400 lowercase">{selectedItem.title}</span>
                </h2>
              </div>

              <div className="space-y-10">
                <div className="space-y-4">
                  <label className="text-[11px] font-black uppercase tracking-[0.4em] text-zinc-400">Select Venue</label>
                  <div className="grid grid-cols-1 gap-3">
                     {((selectedItem as any).locations || [selectedItem.location]).map((loc: string) => (
                       <button 
                        key={loc}
                        onClick={() => setTicketData({...ticketData, location: loc})}
                        className={`w-full p-5 text-left font-black tracking-widest text-[11px] border transition-all flex items-center justify-between uppercase ${ticketData.location === loc ? 'border-british-blue bg-british-blue/5 text-british-blue' : 'border-black/5 text-zinc-400 hover:border-black/20'}`}
                       >
                         {loc}
                         {ticketData.location === loc && <CheckCircle2 size={16} className="text-british-blue" />}
                       </button>
                     ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[11px] font-black uppercase tracking-[0.4em] text-zinc-400">Quantity</label>
                  <div className="flex items-center gap-6 max-w-[240px]">
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        setTicketData({...ticketData, quantity: Math.max(1, ticketData.quantity - 1)});
                      }}
                      className="w-14 h-14 flex items-center justify-center border border-black/5 text-zinc-900 text-xl hover:bg-british-blue hover:text-white hover:border-british-blue transition-all"
                    >
                      -
                    </button>
                    <div className="flex-1 text-center">
                       <div className="text-4xl font-display font-black text-zinc-900">{ticketData.quantity}</div>
                       <div className="text-[9px] font-black uppercase tracking-widest text-zinc-300">Passes</div>
                    </div>
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        setTicketData({...ticketData, quantity: Math.min(10, ticketData.quantity + 1)});
                      }}
                      className="w-14 h-14 flex items-center justify-center border border-black/5 text-zinc-900 text-xl hover:bg-british-blue hover:text-white hover:border-british-blue transition-all"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="pt-10 border-t border-black/5 flex flex-col md:flex-row items-center justify-between gap-8">
                  <div>
                    <span className="block text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 mb-2">
                      {isLoggedIn ? 'Member Selection (20% Off)' : 'Projected Cost'}
                    </span>
                    <span className="text-3xl font-display font-black text-zinc-900 italic tracking-tighter">
                      Rp {(ticketData.quantity * ticketPrice * (isLoggedIn ? 0.8 : 1)).toLocaleString('id-ID')}
                    </span>
                  </div>
                  <button 
                    disabled={!ticketData.location}
                    onClick={onConfirm}
                    className={`w-full md:w-auto px-12 py-6 font-black uppercase text-[10px] tracking-[0.4em] transition-all shadow-2xl ${!ticketData.location ? 'bg-zinc-100 text-zinc-300 cursor-not-allowed' : 'bg-british-blue text-white hover:bg-black'}`}
                  >
                    Confirm Registration
                  </button>
                </div>
              </div>
            </div>
          )}

          {bookingStep === 'success' && (
            <div className="p-12 md:p-20 text-center">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-24 h-24 bg-british-blue text-white rounded-full flex items-center justify-center mx-auto mb-10 shadow-xl"
              >
                <CheckCircle2 size={48} />
              </motion.div>
              <h2 className="text-5xl font-display font-black uppercase tracking-tighter mb-6 text-zinc-900 leading-none">Registered.</h2>
              <p className="text-zinc-500 font-serif italic text-lg mb-12 max-w-sm mx-auto">
                Fine choice. <span className="text-zinc-900 font-bold">"{selectedItem.title}"</span> has been added to your itinerary. View your trip details in the <button onClick={() => { onClose(); window.dispatchEvent(new CustomEvent('nav', {detail: 'experience'})); }} className="text-british-blue underline">My Trip</button> section.
              </p>
              
              <button 
                onClick={onClose}
                className="w-full bg-british-blue text-white px-12 py-6 font-black uppercase text-[10px] tracking-[0.4em] hover:bg-black transition-all shadow-xl"
              >
                Continue Exploring
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

const TrailerModal = ({ show, onClose, selectedMovie }: { show: boolean, onClose: () => void, selectedMovie: any }) => {
  if (!show || !selectedMovie) return null;
  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/95 backdrop-blur-3xl"
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-6xl aspect-video bg-black shadow-[0_0_100px_rgba(218,41,28,0.3)] overflow-hidden border border-white/10"
        >
          <div className="absolute top-4 right-4 z-50">
            <button 
              onClick={onClose}
              className="w-12 h-12 bg-black/50 backdrop-blur-md text-white flex items-center justify-center hover:bg-british-red transition-all rounded-full"
            >
              <X size={24} />
            </button>
          </div>
          <iframe 
            src={(() => {
              const url = selectedMovie.trailerUrl || '';
              let embedUrl = url;
              if (!url.includes('youtube.com/embed/')) {
                if (url.includes('youtube.com/watch?v=')) {
                  embedUrl = url.replace('watch?v=', 'embed/').split('&')[0];
                } else if (url.includes('youtu.be/')) {
                  const videoId = url.split('youtu.be/')[1]?.split(/[?#]/)[0];
                  if (videoId) embedUrl = `https://www.youtube.com/embed/${videoId}`;
                } else if (url.includes('youtube.com/shorts/')) {
                  const videoId = url.split('youtube.com/shorts/')[1]?.split(/[?#]/)[0];
                  if (videoId) embedUrl = `https://www.youtube.com/embed/${videoId}`;
                }
              }
              return `${embedUrl}${embedUrl.includes('?') ? '&' : '?'}autoplay=1`;
            })()}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowFullScreen
            title={`${selectedMovie.title} Trailer`}
          />
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

const PaymentModal = ({ show, onClose, onConfirm, amount, paymentMethod, setPaymentMethod }: { 
  show: boolean, 
  onClose: () => void, 
  onConfirm: () => void, 
  amount: number,
  paymentMethod: 'card' | 'qris' | null,
  setPaymentMethod: (m: 'card' | 'qris' | null) => void
}) => {
  if (!show) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-xl bg-white shadow-2xl p-10 md:p-16 border border-black/5"
        >
          <button onClick={onClose} className="absolute top-10 right-10 text-black/20 hover:text-british-blue">
            <X size={24} />
          </button>

          <div className="mb-12">
            <h3 className="text-british-blue text-[10px] font-black uppercase tracking-[0.5em] mb-4">Secure Checkout</h3>
            <h2 className="text-4xl md:text-5xl font-display font-black uppercase tracking-tighter text-zinc-900">Payment <br /><span className="font-serif italic font-light text-zinc-400 lowercase">Gateway.</span></h2>
          </div>

          <div className="space-y-10">
            <div className="p-8 bg-zinc-50 border border-black/5 flex flex-col md:flex-row justify-between items-center gap-4">
              <span className="text-[11px] font-black uppercase tracking-[0.4em] text-zinc-400">Total Outstanding</span>
              <span className="text-4xl font-display font-black text-zinc-900 italic">Rp {amount.toLocaleString('id-ID')}</span>
            </div>

            {!paymentMethod ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button 
                  onClick={() => setPaymentMethod('card')}
                  className="p-10 border border-black/5 hover:border-british-blue hover:bg-british-blue/5 transition-all group flex flex-col items-center text-center gap-6"
                >
                  <div className="w-20 h-20 rounded-full border border-black/5 flex items-center justify-center group-hover:bg-british-blue/10 transition-colors">
                    <CreditCard size={36} className="text-zinc-400 group-hover:text-british-blue" />
                  </div>
                  <span className="text-[11px] font-black uppercase tracking-[0.3em] text-zinc-900">Direct Card</span>
                </button>
                <button 
                  onClick={() => setPaymentMethod('qris')}
                  className="p-10 border border-black/5 hover:border-british-blue hover:bg-british-blue/5 transition-all group flex flex-col items-center text-center gap-6"
                >
                  <div className="w-20 h-20 rounded-full border border-black/5 flex items-center justify-center group-hover:bg-british-blue/10 transition-colors">
                    <QrCode size={36} className="text-zinc-400 group-hover:text-british-blue" />
                  </div>
                  <span className="text-[11px] font-black uppercase tracking-[0.3em] text-zinc-900">QRIS Mobile</span>
                </button>
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-8"
              >
                <button 
                  onClick={() => setPaymentMethod(null)}
                  className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400 hover:text-british-blue flex items-center gap-4 group"
                >
                  <div className="w-10 h-[1px] bg-black/10 group-hover:bg-british-blue transition-all" /> Back to methods
                </button>

                {paymentMethod === 'card' ? (
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400">Card Identification</label>
                      <input type="text" className="w-full bg-zinc-50 p-6 border-b border-black/5 outline-none font-sans text-lg tracking-widest focus:border-british-blue placeholder:text-zinc-200 text-zinc-900" placeholder="•••• •••• •••• ••••" />
                    </div>
                    <div className="grid grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400">Expiry</label>
                        <input type="text" className="w-full bg-zinc-50 p-6 border-b border-black/5 outline-none font-sans text-lg focus:border-british-blue placeholder:text-zinc-200 text-zinc-900" placeholder="MM/YY" />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400">CVV</label>
                        <input type="password" size={3} className="w-full bg-zinc-50 p-6 border-b border-black/5 outline-none font-sans text-lg focus:border-british-blue placeholder:text-zinc-200 text-zinc-900" placeholder="•••" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-10 p-12 bg-zinc-50 border border-black/5">
                    <div className="bg-white p-6 shadow-2xl rounded-sm">
                      <QRCodeSVG value={`qris-payment-${amount}`} size={240} fgColor="#000000" />
                    </div>
                    <div className="text-center">
                      <p className="text-[12px] font-black uppercase tracking-[0.3em] text-zinc-900 mb-3">Scan with Mobile App</p>
                      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em]">Transaction expires in 05:00</p>
                    </div>
                  </div>
                )}

                <button 
                  onClick={onConfirm}
                  className="w-full bg-british-blue text-white py-8 font-black uppercase text-[11px] tracking-[0.5em] hover:bg-black transition-all flex items-center justify-center gap-4 shadow-xl"
                >
                  <Lock size={18} /> Confirm Transaction
                </button>
              </motion.div>
            )}
            
            <p className="text-center text-[10px] font-black uppercase tracking-[0.4em] text-zinc-300 mt-12">
              Verified by British Council Security
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [view, setView] = useState<'home' | 'program' | 'schedule' | 'about' | 'food' | 'experience' | 'login' | 'admin-panel'>('home');
  const [movies, setMovies] = useState(MOVIES);
  const [concessions, setConcessions] = useState(FOOD_ITEMS);
  const [adminPrice, setAdminPrice] = useState(100000);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [logoClicks, setLogoClicks] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showWelcomeCelebration, setShowWelcomeCelebration] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'qris' | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [selectedMovie, setSelectedMovie] = useState<any | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<typeof EVENTS[0] | null>(null);
  const [showTrailer, setShowTrailer] = useState(false);
  const [playPromoVideo, setPlayPromoVideo] = useState(false);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [bookingStep, setBookingStep] = useState<'details' | 'payment' | 'success'>('details');
  const [ticketData, setTicketData] = useState({
    location: '',
    quantity: 1
  });
  const [bookings, setBookings] = useState<any[]>([]);
  const [foodOrders, setFoodOrders] = useState<any[]>([]);

  const loadedUserRef = React.useRef<string | null>(null);

  const handleUserLogin = (email: string) => {
    setIsUserLoggedIn(true);
    setUserEmail(email);
    
    // Load saved itinerary from account
    const saved = localStorage.getItem('festival_users');
    if (saved) {
      const users = JSON.parse(saved);
      if (users[email]) {
        const savedBookings = users[email].bookings || [];
        const savedFoodOrders = users[email].foodOrders || [];
        setBookings(savedBookings);
        setFoodOrders(savedFoodOrders);
        loadedUserRef.current = email;
        return;
      }
    }
    // If user has no saved itinerary but they were guest, let's auto-save their guest items to their new account
    loadedUserRef.current = email;
    if (saved) {
      const users = JSON.parse(saved);
      if (users[email]) {
        users[email].bookings = bookings;
        users[email].foodOrders = foodOrders;
        localStorage.setItem('festival_users', JSON.stringify(users));
      }
    }
  };

  React.useEffect(() => {
    if (isUserLoggedIn && userEmail && loadedUserRef.current === userEmail) {
      const saved = localStorage.getItem('festival_users');
      if (saved) {
        const users = JSON.parse(saved);
        if (users[userEmail]) {
          users[userEmail].bookings = bookings;
          users[userEmail].foodOrders = foodOrders;
          localStorage.setItem('festival_users', JSON.stringify(users));
        }
      }
    }
  }, [bookings, foodOrders, isUserLoggedIn, userEmail]);

  const handleLogout = () => {
    setIsAdminLoggedIn(false);
    setIsUserLoggedIn(false);
    setUserEmail('');
    setBookings([]);
    setFoodOrders([]);
    loadedUserRef.current = null;
    navigateTo('home');
  };

  const getAllBookings = () => {
    const all: any[] = [];
    const saved = localStorage.getItem('festival_users');
    if (saved) {
      const users = JSON.parse(saved);
      Object.keys(users).forEach(email => {
        if (users[email].bookings) {
          users[email].bookings.forEach((b: any) => {
            all.push({ ...b, email });
          });
        }
      });
    }
    bookings.forEach((b: any) => {
      if (!all.some(item => item.id === b.id)) {
        all.push({ ...b, email: userEmail || 'Guest' });
      }
    });
    return all;
  };

  const handleAdminSetBookings = (updater: any) => {
    const currentAll = getAllBookings();
    const updatedAll = typeof updater === 'function' ? updater(currentAll) : updater;
    
    const saved = localStorage.getItem('festival_users');
    if (saved) {
      const users = JSON.parse(saved);
      updatedAll.forEach((b: any) => {
        const email = b.email;
        if (email && users[email]) {
          if (!users[email].bookings) users[email].bookings = [];
          const idx = users[email].bookings.findIndex((item: any) => item.id === b.id);
          if (idx > -1) {
            users[email].bookings[idx] = b;
          } else {
            users[email].bookings.push(b);
          }
        }
      });
      localStorage.setItem('festival_users', JSON.stringify(users));
    }
    
    setBookings(prev => {
      return prev.map(b => {
        const found = updatedAll.find((x: any) => x.id === b.id);
        return found ? found : b;
      });
    });
  };

  const addToFoodOrder = (item: any) => {
    const existingIndex = foodOrders.findIndex(o => o.itemId === item.id && !o.isPaid);
    const itemPrice = isUserLoggedIn ? item.price * 0.8 : item.price;

    if (existingIndex > -1) {
      const newOrders = [...foodOrders];
      newOrders[existingIndex].quantity += 1;
      setFoodOrders(newOrders);
    } else {
      setFoodOrders([...foodOrders, { 
        ...item, 
        price: Number(itemPrice.toFixed(2)),
        itemId: item.id,
        quantity: 1, 
        orderId: `FD-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
        isPaid: false
      }]);
    }
  };

  const removeFromFoodOrder = (index: number) => {
    const newOrders = [...foodOrders];
    newOrders.splice(index, 1);
    setFoodOrders(newOrders);
  };

  const cancelBooking = (id: string) => {
    setBookings(bookings.filter(b => b.id !== id));
  };

  React.useEffect(() => {
    if (showTicketModal) {
      setTicketData({
        location: selectedMovie ? '' : (selectedEvent?.location || ''),
        quantity: 1
      });
    }
  }, [showTicketModal, selectedMovie, selectedEvent]);

  const handleAddToTrip = () => {
    const selectedItem = selectedMovie || selectedEvent;
    const basePrice = ticketData.quantity * adminPrice;
    const finalPrice = isUserLoggedIn ? basePrice * 0.8 : basePrice;

    if (selectedItem) {
      const newBooking = {
        id: `BK-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        type: selectedMovie ? 'movie' : 'event',
        title: selectedItem.title,
        itemId: selectedItem.id,
        location: ticketData.location,
        quantity: ticketData.quantity,
        price: Number(finalPrice.toFixed(2)),
        date: new Date().toLocaleDateString(),
        isPaid: false
      };
      setBookings([...bookings, newBooking]);
      setBookingStep('success'); // Show "Added" state
    }
  };

  const closeTicketModal = () => {
    setShowTicketModal(false);
    setBookingStep('details');
    setSelectedMovie(null);
    setSelectedEvent(null);
  };

  const filteredMovies = movies.filter(movie => 
    !movie.isRemoved && (
      movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      movie.director.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const featuredMovies = movies.filter(m => !m.isRemoved).slice(0, 3);

  const navigateTo = (newView: typeof view) => {
    setView(newView);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleLogoClick = () => {
    const newCount = logoClicks + 1;
    if (newCount >= 5) {
      navigateTo('login');
      setLogoClicks(0);
    } else {
      setLogoClicks(newCount);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setShowInviteModal(false);
      setSubmitted(false);
      setFormData({ name: '', email: '' });
    }, 2000);
  };

  const handleCheckout = () => {
    setBookings(bookings.map(b => ({ ...b, isPaid: true })));
    setFoodOrders(foodOrders.map(f => ({ ...f, isPaid: true })));
    setShowPaymentModal(false);
    setPaymentMethod(null);
    alert('Payment successful! Your trip is now confirmed. Access your QR codes in the My Trip section.');
  };

  return (
    <div className="min-h-screen font-sans bg-[#f4f4f4] text-zinc-900 selection:bg-british-blue selection:text-white transition-colors duration-300">
      <div className="h-1.5 w-full bg-british-blue fixed top-0 z-[60]" />
      <TrailerModal 
        show={showTrailer} 
        onClose={() => setShowTrailer(false)} 
        selectedMovie={selectedMovie} 
      />
      <PaymentModal 
        show={showPaymentModal}
        onClose={() => {
          setShowPaymentModal(false);
          setPaymentMethod(null);
        }}
        onConfirm={handleCheckout}
        amount={
          Number((bookings.filter(b => !b.isPaid).reduce((sum, b) => sum + b.price, 0) +
          foodOrders.filter(f => !f.isPaid).reduce((sum, f) => sum + (f.price * f.quantity), 0)).toFixed(2))
        }
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
      />
      <TicketModal 
        show={showTicketModal}
        onClose={closeTicketModal}
        selectedMovie={selectedMovie}
        selectedEvent={selectedEvent}
        ticketData={ticketData}
        setTicketData={setTicketData}
        bookingStep={bookingStep}
        setBookingStep={setBookingStep}
        onConfirm={handleAddToTrip}
        bookings={bookings}
        ticketPrice={adminPrice}
        isLoggedIn={isUserLoggedIn}
      />
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-black/5 h-20 md:h-24">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          <button 
            onClick={() => navigateTo('home')}
            className="flex items-center gap-4 hover:opacity-80 transition-all cursor-pointer group"
          >
            <div className="w-10 h-10 md:w-12 md:h-12 bg-british-blue flex items-center justify-center rounded-sm rotate-45 group-hover:rotate-90 transition-transform duration-500">
              <img src="https://cdn.worldvectorlogo.com/logos/british-council-1.svg" alt="" className="h-5 md:h-6 -rotate-45 group-hover:-rotate-90 transition-transform duration-500 invert brightness-0" />
            </div>
            <div className="flex flex-col -gap-1 ml-2 text-left">
              <span className="text-[9px] font-black uppercase tracking-[0.3em] text-british-blue">British Council</span>
              <span className="font-display italic text-lg md:text-xl tracking-tighter text-zinc-900 font-black uppercase leading-none">Film Festival</span>
            </div>
          </button>
          
          <div className="hidden lg:flex items-center gap-8 text-[11px] uppercase font-black tracking-[0.3em] text-zinc-400">
            {['about', 'program', 'schedule', 'food', 'experience'].map((v) => (
              <button 
                key={v}
                onClick={() => navigateTo(v as any)} 
                className={`hover:text-british-blue transition-all cursor-pointer outline-none relative group ${view === v ? 'text-british-blue' : ''}`}
              >
                {v === 'food' ? 'Snacks' : v === 'schedule' ? 'Events' : v === 'experience' ? 'My Trip' : v === 'about' ? 'About' : v === 'program' ? 'Program' : v}
                <span className={`absolute -bottom-1 left-0 h-0.5 bg-british-blue transition-all duration-300 ${view === v ? 'w-full' : 'w-0 group-hover:w-full'}`} />
                {v === 'experience' && (bookings.length > 0 || foodOrders.length > 0) && (
                  <span className="absolute -top-1 -right-4 w-2 h-2 bg-british-blue rounded-full" />
                )}
              </button>
            ))}
            <a 
              href="https://great-british-festival.vercel.app/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-british-blue transition-all cursor-pointer outline-none relative group"
            >
              Music
              <span className="absolute -bottom-1 left-0 h-0.5 bg-british-blue transition-all duration-300 w-0 group-hover:w-full" />
            </a>
            
            {isAdminLoggedIn && (
              <button 
                onClick={() => navigateTo('admin-panel')} 
                className="px-6 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-600 text-[9px] font-black uppercase tracking-widest transition-all"
              >
                Admin
              </button>
            )}

            <button 
              onClick={() => isAdminLoggedIn || isUserLoggedIn ? handleLogout() : navigateTo('login')} 
              className={`px-6 py-2 font-black uppercase text-[9px] tracking-widest transition-all ${isAdminLoggedIn || isUserLoggedIn ? 'border-2 border-black/10 hover:border-british-blue text-zinc-900' : 'bg-british-blue text-white hover:bg-black'}`}
            >
              {isAdminLoggedIn || isUserLoggedIn ? 'Logout' : 'Login'}
            </button>
          </div>

          <button 
            className="lg:hidden text-zinc-900 p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-0 top-20 bg-white z-40 lg:hidden flex flex-col p-8 gap-8"
            >
              {['about', 'program', 'schedule', 'food', 'experience'].map((v) => (
                <button 
                  key={v}
                  onClick={() => navigateTo(v as any)} 
                  className="text-4xl font-display font-black uppercase tracking-tighter text-left border-b border-black/5 pb-4 text-zinc-900"
                >
                  {v === 'food' ? 'Snacks' : v === 'schedule' ? 'Events' : v === 'experience' ? 'My Trip' : v === 'about' ? 'About' : v === 'program' ? 'Program' : v}
                </button>
              ))}
              <a 
                href="https://great-british-festival.vercel.app/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-4xl font-display font-black uppercase tracking-tighter text-left border-b border-black/5 pb-4 text-zinc-900"
              >
                Music
              </a>
              <div className="flex flex-col gap-4 mt-auto">
                <button 
                  onClick={() => isAdminLoggedIn || isUserLoggedIn ? handleLogout() : navigateTo('login')}
                  className="w-full py-6 bg-british-blue text-white font-black uppercase tracking-[0.2em]"
                >
                  {isAdminLoggedIn || isUserLoggedIn ? 'Sign Out' : 'Sign In'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <main className="pt-24 min-h-screen bg-zinc-50">
        {view === 'home' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            {/* Split Hero Section */}
            <section className="relative min-h-[90vh] flex flex-col md:flex-row overflow-hidden border-b border-black/5">
              <div className="w-full md:w-1/2 p-8 md:p-24 flex flex-col justify-center relative z-10 bg-white">
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <h2 className="text-british-blue text-[11px] font-black uppercase tracking-[0.4em] mb-6">Established 1934</h2>
                  <h1 className="text-7xl lg:text-[9rem] font-display font-black leading-[0.82] mb-12 tracking-tighter uppercase whitespace-nowrap text-zinc-900">
                    The <br />
                    <span className="text-british-blue">Great</span> <br />
                    British <br />
                    <span className="font-serif italic font-light text-zinc-300 lowercase text-[0.8em]">Cinema</span>
                  </h1>
                  <p className="max-w-md text-zinc-500 font-serif text-xl italic leading-relaxed mb-12">
                    "Expanding horizons through the transformative power of film, connecting cultures through the lens of legendary storytellers."
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <button 
                      onClick={() => navigateTo('program')}
                      className="px-10 py-5 bg-british-blue text-white font-black uppercase text-[10px] tracking-[0.3em] hover:bg-black transition-all shadow-xl"
                    >
                      Book Tickets
                    </button>
                    <button 
                      onClick={() => navigateTo('schedule')}
                      className="px-10 py-5 border-2 border-black/5 text-zinc-900 font-black uppercase text-[10px] tracking-[0.3em] hover:bg-zinc-100 transition-all"
                    >
                      Event Calendar
                    </button>
                    <a 
                      href="https://great-british-festival.vercel.app/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-10 py-5 bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-rose-600 hover:to-red-700 text-white font-black uppercase text-[10px] tracking-[0.35em] transition-all duration-300 shadow-xl shadow-red-600/10 hover:shadow-red-600/30 flex items-center gap-4 group/music relative overflow-hidden"
                    >
                      {/* Subtly animated light sweep on hover */}
                      <span className="absolute inset-0 bg-white/10 opacity-0 group-hover/music:opacity-100 transition-opacity duration-300 pointer-events-none" />
                      
                      <div className="relative flex items-center gap-2.5 z-10">
                        {/* Live Radio pulse indicator */}
                        <span className="relative flex h-2.5 w-2.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
                        </span>
                        
                        <Music size={13} className="group-hover/music:rotate-12 group-hover/music:scale-110 transition-transform duration-500 text-white" />
                        <span>Music Festival</span>
                      </div>

                      {/* Equalizer Wave bar animations appearing on hover */}
                      <div className="relative flex items-end gap-[3px] h-[16px] z-10 w-6">
                        <span className="w-[2px] bg-white rounded-full h-1 group-hover/music:eq-bar-1" />
                        <span className="w-[2px] bg-white rounded-full h-2 group-hover/music:eq-bar-2" />
                        <span className="w-[2px] bg-white rounded-full h-1.5 group-hover/music:eq-bar-3" />
                        <span className="w-[2px] bg-white rounded-full h-3 group-hover/music:eq-bar-4" />
                      </div>
                    </a>
                  </div>
                </motion.div>
              </div>
              <div 
                className="w-full md:w-1/2 relative bg-zinc-950 group overflow-hidden cursor-pointer flex items-center justify-center min-h-[350px] md:min-h-[500px]"
              >
                {playPromoVideo ? (
                  <iframe 
                    src="https://www.youtube.com/embed/0htEPr5QsIM?autoplay=1&mute=0"
                    className="w-full h-full absolute inset-0 border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                    title="Great British Cinema Promotional Video"
                  />
                ) : (
                  <div 
                    onClick={() => setPlayPromoVideo(true)}
                    className="w-full h-full absolute inset-0"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white via-white/20 to-transparent z-10 hidden md:block pointer-events-none" />
                    <motion.img 
                      initial={{ scale: 1.2, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 2 }}
                      src="https://img.youtube.com/vi/0htEPr5QsIM/maxresdefault.jpg" 
                      alt="Cinema Atmosphere" 
                      className="w-full h-full object-cover grayscale opacity-20 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000"
                    />
                    <div className="absolute inset-0 z-20 flex items-center justify-center">
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                        className="flex flex-col items-center gap-4"
                      >
                        <div className="w-20 h-20 rounded-full border border-british-blue/30 flex items-center justify-center bg-white/10 backdrop-blur-md group-hover:scale-110 transition-transform">
                          <Play className="text-british-blue fill-british-blue ml-1" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-british-blue/50 group-hover:text-british-blue transition-colors">Watch Promotional Video</span>
                      </motion.div>
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* Table of Contents / Browse Section */}
            <motion.section 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="bg-white"
            >
              <div className="grid grid-cols-1 md:grid-cols-3">
                <button 
                  onClick={() => navigateTo('program')}
                  className="group relative h-[60vh] overflow-hidden flex flex-col justify-end p-12 text-left transition-all duration-700 cursor-pointer border-r border-black/5"
                >
                  <div className="absolute inset-0 bg-zinc-50 group-hover:bg-british-blue/5 transition-colors duration-700" />
                  <img src="https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&q=80&w=800" className="absolute inset-0 w-full h-full object-cover opacity-10 group-hover:opacity-30 group-hover:scale-110 transition-all duration-1000 grayscale" alt="" />
                  <div className="relative z-10">
                    <div className="text-[12px] font-black tracking-[0.5em] text-british-blue mb-4">01</div>
                    <h3 className="text-5xl font-display font-black text-zinc-900 mb-2 uppercase leading-none tracking-tighter">The <br /> Program</h3>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 group-hover:text-british-blue transition-colors">Curated British Selection</p>
                  </div>
                  <ChevronRight size={32} className="absolute bottom-12 right-12 text-zinc-200 group-hover:text-british-blue group-hover:translate-x-2 transition-all duration-500" />
                </button>

                <button 
                  onClick={() => navigateTo('schedule')}
                  className="group relative h-[60vh] overflow-hidden flex flex-col justify-end p-12 text-left transition-all duration-700 cursor-pointer border-r border-black/5"
                >
                  <div className="absolute inset-0 bg-white group-hover:bg-british-blue/5 transition-colors duration-700" />
                  <img src="https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&q=80&w=800" className="absolute inset-0 w-full h-full object-cover opacity-10 group-hover:opacity-30 group-hover:scale-110 transition-all duration-1000 grayscale" alt="" />
                  <div className="relative z-10">
                    <div className="text-[12px] font-black tracking-[0.5em] text-british-blue mb-4">02</div>
                    <h3 className="text-5xl font-display font-black text-zinc-900 mb-2 uppercase leading-none tracking-tighter">The <br /> Diary</h3>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 group-hover:text-british-blue transition-colors">Gala Events & Talks</p>
                  </div>
                  <ChevronRight size={32} className="absolute bottom-12 right-12 text-zinc-200 group-hover:text-british-blue group-hover:translate-x-2 transition-all duration-500" />
                </button>

                <button 
                  onClick={() => navigateTo('food')}
                  className="group relative h-[60vh] overflow-hidden flex flex-col justify-end p-12 text-left transition-all duration-700 cursor-pointer"
                >
                  <div className="absolute inset-0 bg-zinc-50 group-hover:bg-british-blue/5 transition-colors duration-700" />
                  <img src="https://images.unsplash.com/photo-1594488654274-12643a6d690a?auto=format&fit=crop&q=80&w=800" className="absolute inset-0 w-full h-full object-cover opacity-10 group-hover:opacity-30 group-hover:scale-110 transition-all duration-1000 grayscale" alt="" />
                  <div className="relative z-10">
                    <div className="text-[12px] font-black tracking-[0.5em] text-british-blue mb-4">03</div>
                    <h3 className="text-5xl font-display font-black text-zinc-900 mb-2 uppercase leading-none tracking-tighter">Artisan <br /> Kitchen</h3>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 group-hover:text-british-blue transition-colors">Gourmet Movie Snacks</p>
                  </div>
                  <ChevronRight size={32} className="absolute bottom-12 right-12 text-zinc-200 group-hover:text-british-blue group-hover:translate-x-2 transition-all duration-500" />
                </button>
              </div>
            </motion.section>

            {/* Featured Selection */}
            <motion.section 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 1 }}
              className="py-32 md:py-48 px-6 bg-white"
            >
              <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
                  <div className="text-left">
                    <h2 className="text-british-blue text-[11px] font-black uppercase tracking-[0.5em] mb-4">The Collection</h2>
                    <h3 className="text-6xl md:text-8xl font-display text-zinc-900 font-black uppercase tracking-tighter leading-none">Iconic <br /> <span className="font-serif italic font-light text-zinc-300 lowercase">Moments.</span></h3>
                  </div>
                  <button 
                    onClick={() => navigateTo('program')}
                    className="group flex items-center gap-4 text-[11px] font-black uppercase tracking-[0.3em] text-zinc-400 hover:text-british-blue transition-colors"
                  >
                    Entire Selection <div className="w-12 h-[1px] bg-zinc-200 group-hover:w-16 group-hover:bg-british-blue transition-all" />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-16 lg:gap-24">
                  {featuredMovies.map((movie, idx) => (
                    <motion.div 
                      key={movie.id} 
                      initial={{ opacity: 0, y: 50 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.15, duration: 0.8 }}
                      onClick={() => setSelectedMovie(movie)}
                      className="group cursor-pointer"
                    >
                      <div className="aspect-[2/3] mb-10 overflow-hidden relative shadow-2xl glass-surface rounded-sm">
                        <img 
                          src={movie.imageUrl} 
                          alt={movie.title} 
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-british-blue/20 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center backdrop-blur-sm">
                          <div className="w-16 h-16 rounded-full border border-white flex items-center justify-center">
                            <Play size={24} className="text-white fill-white ml-1" />
                          </div>
                        </div>
                        <div className="absolute top-0 right-0 p-6">
                           <div className="text-[10px] font-black text-white bg-british-blue px-3 py-1 uppercase tracking-widest leading-none">
                             {movie.year}
                           </div>
                        </div>
                      </div>
                      <h4 className="text-3xl font-display font-black uppercase mb-3 leading-none group-hover:text-british-blue transition-colors tracking-tighter text-zinc-900">{movie.title}</h4>
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 flex items-center gap-3">
                        <span className="w-8 h-[1px] bg-zinc-100" /> {movie.director}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.section>

            {/* Upcoming Events Diary */}
            <motion.section 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="py-32 md:py-48 px-6 bg-zinc-50 border-y border-black/5"
            >
              <div className="max-w-7xl mx-auto">
                <div className="mb-24 flex flex-col md:flex-row justify-between items-end gap-8">
                  <div className="text-left">
                    <h2 className="text-british-blue text-[11px] font-black uppercase tracking-[0.5em] mb-4">Festival Diary</h2>
                    <h3 className="text-6xl md:text-8xl font-display text-zinc-900 font-black uppercase tracking-tighter leading-none">Live <br /> <span className="font-serif italic font-light text-zinc-300 lowercase">Experiences.</span></h3>
                  </div>
                  <div className="text-right flex flex-col items-end">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 mb-2">Current Venue</span>
                    <span className="text-xl font-bold italic text-zinc-900">Jakarta • Art Center</span>
                  </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  <div className="space-y-4">
                    {EVENTS.slice(0, 3).map((event, idx) => (
                      <motion.div 
                        key={event.id}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="p-8 md:p-10 bg-white border border-black/5 hover:border-british-blue transition-all group relative overflow-hidden"
                      >
                        <div className="absolute top-0 right-0 w-24 h-24 bg-british-blue/5 rotate-45 translate-x-12 -translate-y-12" />
                        <div className="text-[11px] font-black tracking-[0.3em] text-british-blue uppercase mb-4">{event.date} • {event.time}</div>
                        <h4 className="text-3xl font-display font-black uppercase mb-6 group-hover:text-british-blue transition-colors tracking-tighter leading-none text-zinc-900">{event.title}</h4>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 group-hover:text-zinc-900 transition-colors">
                            <Calendar size={14} className="text-british-blue" /> {event.location}
                          </div>
                          <span className="text-[9px] font-black uppercase tracking-widest bg-zinc-50 text-zinc-400 px-3 py-1">{event.category}</span>
                        </div>
                      </motion.div>
                    ))}
                    <button 
                      onClick={() => navigateTo('schedule')}
                      className="w-full py-10 border border-dashed border-black/10 text-zinc-300 font-black uppercase tracking-[0.4em] hover:border-british-blue hover:text-british-blue transition-all text-[10px]"
                    >
                      Browse Full Calendar
                    </button>
                  </div>
                  <div className="bg-british-blue p-12 md:p-20 text-white flex flex-col justify-between relative overflow-hidden group">
                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
                    <div className="relative z-10 text-left">
                      <h4 className="text-5xl md:text-6xl font-display italic font-black uppercase mb-12 leading-none tracking-tighter">Box Office <br /> & Entry.</h4>
                      <div className="space-y-12">
                        <div className="flex gap-8">
                          <div className="w-12 h-[1px] bg-white/40 mt-3" />
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/50 mb-3">Operating Hours</p>
                            <p className="text-2xl font-bold italic tracking-tight">Mon—Sun: 10:00 — 22:00</p>
                          </div>
                        </div>
                        <div className="flex gap-8">
                          <div className="w-12 h-[1px] bg-white/40 mt-3" />
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/50 mb-3">Festival HQ</p>
                            <p className="text-2xl font-bold italic tracking-tight">Sudirman Central Business District</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="relative z-10 mt-20 md:mt-0 text-left">
                       <button className="w-full md:w-auto px-10 py-5 bg-white text-british-blue font-black uppercase text-[10px] tracking-[0.3em] hover:bg-black hover:text-white transition-all">
                         Get Directions
                       </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>
          </motion.div>
        )}

        {view === 'program' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <section className="py-24 px-6 bg-zinc-50 min-h-screen">
              <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-32 gap-8">
                  <div className="text-left">
                    <button onClick={() => navigateTo('home')} className="text-[11px] font-black uppercase tracking-[0.5em] text-zinc-400 mb-8 hover:text-british-blue flex items-center gap-4 group transition-colors">
                       <div className="w-8 h-[1px] bg-black/5 group-hover:bg-british-blue transition-all" /> Return Home
                    </button>
                    <h2 className="text-british-blue text-[11px] font-black uppercase tracking-[0.5em] mb-4">Official Selection</h2>
                    <h3 className="text-7xl md:text-9xl font-display text-zinc-900 font-black uppercase tracking-tighter leading-none">The <br /> <span className="font-serif italic font-light text-zinc-300 lowercase">Program.</span></h3>
                  </div>
                  <div className="w-full md:w-96">
                    <div className="relative border-b border-black/10 group focus-within:border-british-blue transition-colors">
                      <Search size={22} className="absolute left-0 top-1/2 -translate-y-1/2 text-zinc-300 group-focus-within:text-british-blue transition-colors" />
                      <input 
                        type="text"
                        placeholder="SEARCH SELECTION..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-transparent py-8 pl-10 pr-4 text-[12px] font-black tracking-[0.3em] focus:outline-none placeholder:text-zinc-200 uppercase text-zinc-900"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-24 gap-y-40">
                  <AnimatePresence mode="popLayout">
                    {filteredMovies.map((movie, idx) => (
                      <motion.div
                        key={movie.id}
                        layout
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        viewport={{ once: true }}
                        transition={{ 
                          duration: 0.6,
                          delay: (idx % 2) * 0.1
                        }}
                        className="group relative"
                        onClick={() => {
                          if (movie.isLocked && !isUserLoggedIn) {
                            navigateTo('login');
                          } else {
                            setSelectedMovie(movie);
                          }
                        }}
                      >
                        <div className="relative w-full aspect-[16/10] bg-zinc-200 overflow-hidden mb-10 shadow-2xl glass-surface rounded-sm">
                          <img 
                            src={movie.imageUrl} 
                            alt={movie.title} 
                            className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 group-hover:scale-110 grayscale group-hover:grayscale-0 opacity-60 group-hover:opacity-100 ${movie.isLocked && !isUserLoggedIn ? 'blur-md opacity-25 scale-105' : ''}`}
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent z-10" />
                          
                          {/* Standard Play Hover Button for Available Movies */}
                          {(!movie.isLocked || isUserLoggedIn) && (
                            <div className="absolute inset-0 flex items-center justify-center z-20">
                              <motion.div 
                                whileHover={{ scale: 1.1 }}
                                className="w-16 h-16 rounded-full border border-british-blue/30 flex items-center justify-center backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-500 scale-150 group-hover:scale-100"
                              >
                                <Play size={20} className="text-british-blue fill-british-blue ml-0.5" />
                              </motion.div>
                            </div>
                          )}

                          {/* Exclusive locked overlay when user is not logged in */}
                          {movie.isLocked && !isUserLoggedIn && (
                            <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center p-6 z-20 text-center">
                              <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 mb-2 shadow-xl animate-pulse">
                                <Lock size={16} />
                              </div>
                              <span className="text-amber-400 text-[8px] font-black uppercase tracking-[0.25em] mb-1 font-sans">Fellowship Lock</span>
                              <span className="text-white text-base font-display font-black uppercase tracking-tight truncate max-w-full px-2">{movie.title}</span>
                              <span className="text-white/40 text-[9px] font-serif italic mt-0.5 pb-3">Register below to unlock Premiere</span>
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigateTo('login');
                                }}
                                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-[8px] font-black uppercase tracking-[0.2em] text-zinc-950 transition-colors shadow-lg"
                              >
                                Create Account
                              </button>
                            </div>
                          )}

                          {/* Elegant green badge for logged-in members (Unlocked feature) */}
                          {movie.isLocked && isUserLoggedIn && (
                            <div className="absolute top-8 left-8 z-20 flex items-center gap-2">
                              <div className="bg-emerald-600 text-white text-[8px] font-black px-3 py-1.5 uppercase tracking-widest shadow-xl leading-none flex items-center gap-1.5 rounded-sm">
                                <Sparkles size={10} className="animate-pulse" /> Unlocked Premiere
                              </div>
                            </div>
                          )}

                          <div className="absolute top-8 right-8 z-20 flex items-center gap-2">
                             <div className="bg-british-blue text-white text-[10px] font-black px-4 py-2 uppercase tracking-widest shadow-xl leading-none">
                               {movie.rating} ★
                             </div>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-start gap-8 relative z-20 text-left">
                          <div className="flex-1">
                            <h4 className="text-4xl md:text-5xl font-display font-black uppercase text-zinc-900 mb-4 leading-none tracking-tighter group-hover:text-british-blue transition-colors">
                              {movie.title}
                              {movie.isLocked && (
                                <span className="ml-3 inline-block align-middle text-[8px] font-mono font-black text-amber-600 border border-amber-500/20 bg-amber-500/5 px-2 py-0.5 rounded tracking-widest uppercase">
                                  Secret Premiere
                                </span>
                              )}
                            </h4>
                            <div className="flex flex-wrap items-center gap-6 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 mb-6 font-sans">
                              <span className="flex items-center gap-2">Directed by <span className="text-zinc-600 font-bold">{movie.director}</span></span>
                              <span className="w-1 h-1 bg-black/10 rounded-full" />
                              <span>{movie.year}</span>
                            </div>
                            <p className="text-zinc-500 font-serif italic text-lg leading-relaxed mb-8 line-clamp-3">
                              "{movie.description}"
                            </p>
                          </div>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              if (movie.isLocked && !isUserLoggedIn) {
                                navigateTo('login');
                              } else {
                                setSelectedMovie(movie);
                                setShowTicketModal(true);
                              }
                            }}
                            className="flex-shrink-0 w-16 h-16 rounded-full bg-british-blue text-white flex items-center justify-center hover:bg-black transition-all shadow-xl group/btn"
                          >
                            <Calendar size={24} className="group-hover/btn:scale-110 transition-transform" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  {filteredMovies.length === 0 && (
                    <div className="col-span-full py-48 text-center border border-dashed border-black/10">
                      <p className="text-zinc-200 font-display font-black text-6xl uppercase tracking-tighter">No Results Found.</p>
                    </div>
                  )}
                </div>
              </div>
            </section>
          </motion.div>
        )}

        {view === 'schedule' && (
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <section className="py-24 px-6 bg-white min-h-screen">
              <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="text-left mb-32">
                  <button onClick={() => navigateTo('home')} className="text-[11px] font-black uppercase tracking-[0.5em] text-zinc-400 mb-8 hover:text-british-blue flex items-center gap-4 group transition-colors">
                     <div className="w-8 h-[1px] bg-black/5 group-hover:bg-british-blue transition-all" /> Return Home
                  </button>
                  <h2 className="text-british-blue text-[11px] font-black uppercase tracking-[0.5em] mb-4">Festival Itinerary</h2>
                  <h3 className="text-7xl md:text-9xl font-display text-zinc-900 font-black uppercase tracking-tighter leading-none">The <br /> <span className="font-serif italic font-light text-zinc-300 lowercase">Schedule.</span></h3>
                </div>

                <div className="max-w-5xl mx-auto space-y-4">
                  {EVENTS.map((event, idx) => (
                    <motion.div 
                      key={event.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.05 }}
                      className="group bg-zinc-50 grid grid-cols-1 md:grid-cols-[200px_1fr_auto] gap-12 p-10 md:p-14 hover:bg-british-blue hover:text-white transition-all duration-700 items-center border border-black/5 shadow-sm"
                    >
                      <div className="font-display text-4xl text-zinc-900 group-hover:text-white transition-colors font-black uppercase tracking-tighter leading-none text-left">
                        {event.date}
                        <div className="text-[14px] font-sans font-black tracking-[0.2em] opacity-40 mt-3 group-hover:opacity-100">{event.time}</div>
                      </div>
                      <div className="space-y-4 text-left border-l border-black/10 group-hover:border-white/20 pl-12">
                        <div className="flex items-center flex-wrap gap-4 mb-4">
                          <h4 className="text-4xl font-display font-black uppercase tracking-tighter group-hover:translate-x-4 transition-transform duration-500">{event.title}</h4>
                          <span className="text-[9px] font-black tracking-[0.3em] uppercase bg-black/5 group-hover:bg-white/10 px-4 py-2 text-zinc-400 group-hover:text-white transition-colors leading-none">{event.category}</span>
                        </div>
                        <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] text-british-blue group-hover:text-white">
                          <Calendar size={16} /> {event.location}
                        </div>
                        <p className="text-lg font-serif italic text-zinc-500 group-hover:text-white/80 transition-colors leading-relaxed">
                          "{event.description}"
                        </p>
                      </div>
                      <button 
                        className="w-full md:w-auto px-10 py-6 bg-british-blue text-white text-[10px] font-black uppercase tracking-[0.3em] group-hover:bg-black transition-colors shadow-2xl"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedEvent(event);
                          setShowTicketModal(true);
                        }}
                      >
                        Book Event
                      </button>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>
          </motion.div>
        )}

        {view === 'about' && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }}>
            <section className="py-24 px-6 bg-white min-h-screen">
              <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="text-left mb-32">
                  <button onClick={() => navigateTo('home')} className="text-[11px] font-black uppercase tracking-[0.5em] text-zinc-400 mb-8 hover:text-british-blue flex items-center gap-4 group transition-colors">
                     <div className="w-8 h-[1px] bg-black/5 group-hover:bg-british-blue transition-all" /> Return Home
                  </button>
                  <h2 className="text-british-blue text-[11px] font-black uppercase tracking-[0.5em] mb-4">Our History</h2>
                  <h3 className="text-7xl md:text-9xl font-display text-zinc-900 font-black uppercase tracking-tighter leading-none">The <br /> <span className="font-serif italic font-light text-zinc-300 lowercase">Heritage.</span></h3>
                </div>

                <motion.div 
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className="max-w-4xl mx-auto pb-32 text-left"
                >
                  <div className="space-y-16">
                    <p className="text-4xl text-zinc-900 leading-tight font-display font-black uppercase tracking-tight">
                      We support <span className="text-british-blue underline decoration-4 underline-offset-8">peace and prosperity</span> by building connections, understanding and trust.
                    </p>
                    <div className="space-y-10 text-xl text-zinc-500 leading-relaxed font-serif italic border-l-4 border-british-blue pl-12">
                      <p>
                        The Great British Festival in Indonesia is a bridge between our nations, celebrating the best of British cinema and culture. We invite our Indonesian audiences to experience the unique stories that have shaped life in the United Kingdom.
                      </p>
                      <p>
                        Through our screenings in Jakarta, Bandung, and Surabaya, we aim to build lasting connections, understanding and trust between the people of Indonesia and the UK.
                      </p>
                    </div>
                    <div className="pt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="p-16 bg-zinc-50 border border-black/5 text-center shadow-sm"
                      >
                        <span className="block text-7xl font-display font-black text-zinc-900 mb-2 italic">14+</span>
                        <span className="text-[11px] font-black tracking-[0.4em] uppercase text-zinc-400">Years Active</span>
                      </motion.div>
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="p-16 bg-british-blue text-white text-center shadow-xl"
                      >
                        <span className="block text-7xl font-display font-black mb-2 italic">500+</span>
                        <span className="text-[11px] font-black tracking-[0.4em] uppercase text-white/50">Films Shown</span>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </section>
          </motion.div>
        )}
        {view === 'food' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <section className="py-24 px-6 bg-zinc-50 min-h-screen">
              <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-32 gap-8">
                  <div className="text-left">
                    <button onClick={() => navigateTo('home')} className="text-[11px] font-black uppercase tracking-[0.5em] text-zinc-400 mb-8 hover:text-british-red flex items-center gap-4 group transition-colors">
                       <div className="w-8 h-[1px] bg-black/10 group-hover:bg-british-red transition-all" /> Return Home
                    </button>
                    <h2 className="text-british-red text-[11px] font-black uppercase tracking-[0.5em] mb-4">Cinema Concessions</h2>
                    <h3 className="text-7xl md:text-9xl font-display text-zinc-900 font-black uppercase tracking-tighter leading-none">The <br /> <span className="font-serif italic font-light text-zinc-300 lowercase">Menu.</span></h3>
                    <p className="text-zinc-500 font-serif italic text-xl mt-8 max-w-xl">Artisanal refreshments and curated snack pairings to elevate your cinematic journey.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                   {concessions.filter(f => !f.isRemoved).map((item) => (
                      <motion.div 
                        key={item.id}
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="group bg-white border border-black/5 p-8 flex flex-col hover:shadow-2xl hover:-translate-y-1 hover:border-british-blue transition-all duration-500 text-zinc-900"
                      >
                         <div className="w-full aspect-[4/5] bg-black mb-8 overflow-hidden relative shadow-2xl">
                            <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-1000 grayscale group-hover:grayscale-0 opacity-70 group-hover:opacity-100" referrerPolicy="no-referrer" />
                            <div className="absolute top-6 right-6 bg-british-blue text-white px-4 py-2 text-[10px] font-black uppercase tracking-widest leading-none shadow-xl">
                                {item.category}
                            </div>
                         </div>
                         <h4 className="text-3xl font-display font-black uppercase mb-3 leading-none tracking-tighter">{item.name}</h4>
                         <p className="text-sm font-serif italic text-zinc-500 group-hover:text-zinc-700 mb-8 line-clamp-2 leading-relaxed">"{item.description}"</p>
                         <div className="mt-auto pt-8 border-t border-black/5 group-hover:border-black/10 flex items-center justify-between">
                            <div className="flex flex-col">
                              <span className="text-2xl font-display font-black tracking-tighter italic">
                                Rp {isUserLoggedIn ? (item.price * 0.8).toLocaleString('id-ID') : item.price.toLocaleString('id-ID')}
                              </span>
                              {isUserLoggedIn && (
                                <span className="text-[9px] font-black uppercase text-british-blue tracking-widest line-through opacity-50">
                                  Rp {item.price.toLocaleString('id-ID')}
                                </span>
                              )}
                            </div>
                            <button 
                              onClick={() => {
                                addToFoodOrder(item);
                              }}
                              className="w-12 h-12 rounded-full border border-current flex items-center justify-center hover:bg-british-blue hover:text-white hover:border-british-blue transition-all"
                            >
                              <ShoppingBag size={18} />
                            </button>
                         </div>
                      </motion.div>
                   ))}
                </div>
              </div>
            </section>
          </motion.div>
        )}

        {view === 'experience' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <section className="py-24 px-6 bg-white min-h-screen">
              <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="text-left mb-32">
                  <button onClick={() => navigateTo('home')} className="text-[11px] font-black uppercase tracking-[0.5em] text-zinc-400 mb-8 hover:text-british-blue flex items-center gap-4 group transition-colors">
                     <div className="w-8 h-[1px] bg-black/5 group-hover:bg-british-blue transition-all" /> Return Home
                  </button>
                  <h2 className="text-british-blue text-[11px] font-black uppercase tracking-[0.5em] mb-4">Personal Dashboard</h2>
                  <h3 className="text-7xl md:text-9xl font-display text-zinc-900 font-black uppercase tracking-tighter leading-none">My <br /> <span className="font-serif italic font-light text-zinc-300 lowercase">Trip.</span></h3>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                   <div className="lg:col-span-2 space-y-24">
                      {/* Ticket Bookings */}
                      <div className="space-y-12">
                        <h4 className="text-[11px] font-black uppercase tracking-[0.5em] text-zinc-400 border-b border-black/5 pb-8">Itinerary Selection ({bookings.length})</h4>
                        {bookings.length > 0 ? (
                          <div className="space-y-6">
                             {bookings.map((booking) => {
                               const associatedMovie = booking.type === 'movie' ? movies.find(m => m.id === booking.itemId || m.title === booking.title) : null;
                               const isMovieRemoved = associatedMovie?.isRemoved;
                               return (
                                 <motion.div 
                                   key={booking.id}
                                   initial={{ opacity: 0, x: -20 }}
                                   animate={{ opacity: 1, x: 0 }}
                                   className="bg-zinc-50 p-10 border border-black/5 flex flex-col hover:border-british-blue transition-all shadow-sm rounded-sm"
                                 >
                                   <div className="flex flex-col md:flex-row justify-between gap-12 group">
                                     <div className="text-left">
                                       <span className="text-[10px] font-black uppercase tracking-[0.3em] text-british-blue mb-4 block leading-none">{booking.type} Selection</span>
                                       <h5 className="text-4xl font-display font-black uppercase text-zinc-900 mb-6 tracking-tighter leading-none group-hover:text-british-blue transition-colors">{booking.title}</h5>
                                       <div className="flex flex-wrap gap-8 text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400">
                                         <div className="flex items-center gap-3"><Calendar size={16} className="text-british-blue" /> {booking.date}</div>
                                         <div className="flex items-center gap-3"><Star size={16} className="text-british-blue" /> {booking.location}</div>
                                         <div className="flex items-center gap-3 font-bold text-zinc-600">Qty: {booking.quantity}</div>
                                       </div>
                                     </div>
                                     <div className="flex flex-col justify-between items-end border-t md:border-t-0 md:border-l border-black/5 pt-8 md:pt-0 md:pl-12 text-right">
                                       <div className="mb-6">
                                         <span className="block text-[10px] font-black uppercase text-zinc-300 mb-2 leading-none">Member ID</span>
                                         <span className="font-mono text-sm font-bold tracking-[0.3em] text-zinc-900">#BT-{booking.id.split('-')[0].toUpperCase()}</span>
                                       </div>
                                       {booking.isPaid ? (
                                         <div className="bg-white p-3 shadow-2xl mb-6">
                                           <QRCodeSVG 
                                             value={`booking-${booking.id}`} 
                                             size={100}
                                             level="M"
                                           />
                                         </div>
                                       ) : (
                                         <div className="mb-8 flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 bg-zinc-100 px-6 py-3 border border-black/5">
                                           <Lock size={14} className="text-british-blue" /> Ticket Pending
                                         </div>
                                       )}
                                       <button 
                                         onClick={() => cancelBooking(booking.id)}
                                         className="text-[10px] font-black uppercase tracking-[0.3em] text-british-blue hover:text-black transition-colors"
                                       >
                                         Void Registration
                                       </button>
                                     </div>
                                   </div>

                                   {isMovieRemoved && (
                                     <div className="mt-8 pt-8 border-t border-british-red/10 bg-red-500/[0.02] p-8 border border-british-red/20 text-left rounded-sm">
                                       <p className="text-[10px] font-black uppercase tracking-widest text-british-red flex items-center gap-2 mb-4 leading-none">
                                         <AlertTriangle size={14} /> Cinema Decommissioning Refund Protocol
                                       </p>
                                       <p className="text-xs uppercase tracking-wider text-zinc-500 leading-relaxed mb-6">
                                         This film selection has been decommissioned by the Festival Director. Members with paid reservations are entitled to request and claim full financial liquidation.
                                       </p>
                                       {booking.isPaid ? (
                                         <div className="flex items-center gap-4">
                                           {(!booking.refundStatus || booking.refundStatus === 'none') && (
                                             <button 
                                               onClick={() => {
                                                 setBookings(prev => prev.map(b => b.id === booking.id ? { ...b, refundStatus: 'requested' } : b));
                                                 alert('Your refund claim has been drafted and dispatched to the Union Treasury Console.');
                                               }}
                                               className="px-6 py-4 bg-british-red text-white text-[9px] font-black uppercase tracking-[0.2em] hover:bg-black transition-all"
                                             >
                                               Request Refund Claim
                                             </button>
                                           )}
                                           {booking.refundStatus === 'requested' && (
                                             <span className="text-[9px] font-black uppercase tracking-[0.2em] px-4 py-2 bg-amber-500/10 border border-amber-500/20 text-amber-600 rounded-sm">
                                               Refund Audit Pending Approval
                                             </span>
                                           )}
                                           {booking.refundStatus === 'refunded' && (
                                             <span className="text-[9px] font-black uppercase tracking-[0.2em] px-4 py-2 bg-green-500/10 border border-green-500/20 text-green-600 rounded-sm">
                                               Disbursement Confirmed & Issued
                                             </span>
                                           )}
                                         </div>
                                       ) : (
                                         <span className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400">
                                           Unpaid draft. No liquidation case needed.
                                         </span>
                                       )}
                                     </div>
                                   )}
                                 </motion.div>
                               );
                             })}
                          </div>
                        ) : (
                          <div className="py-32 text-center bg-zinc-50 border border-dashed border-black/10">
                             <p className="text-zinc-200 font-display font-black text-4xl uppercase tracking-tighter mb-8 tracking-widest leading-none">Itinerary Empty.</p>
                             <button onClick={() => navigateTo('program')} className="px-10 py-5 bg-british-blue text-white font-black uppercase tracking-[0.3em] text-[10px] hover:bg-black transition-all shadow-xl">Explore Selection</button>
                          </div>
                        )}
                      </div>

                      {/* Food Orders */}
                      <div className="space-y-12">
                        <h4 className="text-[11px] font-black uppercase tracking-[0.5em] text-zinc-400 border-b border-black/5 pb-8 font-black uppercase tracking-widest leading-none">Gourmet Orders ({foodOrders.length})</h4>
                        {foodOrders.length > 0 ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {foodOrders.map((order, idx) => (
                              <motion.div 
                                key={`${order.itemId}-${idx}`}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-zinc-50 p-8 border border-black/5 flex gap-8 items-center group hover:bg-white transition-all duration-700 shadow-sm rounded-sm"
                              >
                                <div className="w-24 h-24 bg-zinc-100 overflow-hidden flex-shrink-0 shadow-2xl rounded-sm">
                                  <img src={order.imageUrl} alt={order.name} className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" referrerPolicy="no-referrer" />
                                </div>
                                <div className="flex-1 text-left">
                                  <h5 className="font-display font-black uppercase text-xl text-zinc-900 group-hover:text-british-blue transition-colors mb-2 leading-none tracking-tighter">{order.name}</h5>
                                  <div className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-4">
                                    Qty: {order.quantity} • {order.isPaid ? 'CONFIRMED' : 'PENDING'}
                                  </div>
                                  <button 
                                    onClick={() => removeFromFoodOrder(idx)}
                                    className="text-[9px] font-black uppercase text-british-blue tracking-[0.2em] hover:text-black transition-colors"
                                  >
                                    Remove Item
                                  </button>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        ) : (
                          <div className="py-32 text-center bg-zinc-50 border border-dashed border-black/10">
                             <p className="text-zinc-200 font-display font-black text-4xl uppercase tracking-tighter mb-8 tracking-widest leading-none">No Gourmet Items.</p>
                             <button onClick={() => navigateTo('food')} className="px-10 py-5 bg-british-blue text-white font-black uppercase tracking-[0.3em] text-[10px] hover:bg-black transition-all shadow-xl">View Menu</button>
                          </div>
                        )}
                      </div>
                   </div>

                    <div className="space-y-12">
                       <div className="bg-british-blue p-12 text-white shadow-3xl relative overflow-hidden group">
                          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
                          <div className="relative z-10 text-left">
                            <h4 className="text-5xl font-display italic font-black uppercase mb-12 leading-none tracking-tighter">Event <br /> Totals.</h4>
                            <div className="space-y-8 mb-16 font-sans">
                               <div className="flex justify-between items-center border-b border-white/20 pb-4">
                                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/50">Passes Selection</span>
                                  <span className="text-2xl font-display font-black italic tracking-tighter">Rp {bookings.reduce((acc, b) => acc + b.price, 0).toLocaleString('id-ID')}</span>
                               </div>
                               <div className="flex justify-between items-center border-b border-white/20 pb-4">
                                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/50">Gourmet Pairing</span>
                                  <span className="text-2xl font-display font-black italic tracking-tighter">Rp {foodOrders.reduce((acc, f) => acc + (f.price * f.quantity), 0).toLocaleString('id-ID')}</span>
                               </div>
                               <div className="flex justify-between items-center">
                                  <span className="text-[11px] font-black uppercase tracking-[0.4em] text-white/80">Owed Amount</span>
                                  <span className="text-5xl font-display font-black italic tracking-tighter">Rp {(
                                    bookings.reduce((acc, b) => acc + b.price, 0) + 
                                    foodOrders.reduce((acc, f) => acc + (f.price * f.quantity), 0) + 
                                    (bookings.length > 0 || foodOrders.length > 0 ? 5000 : 0)
                                  ).toLocaleString('id-ID')}</span>
                               </div>
                            </div>
                            <button 
                              onClick={() => {
                               const unpaidItems = [...bookings.filter(b => !b.isPaid), ...foodOrders.filter(f => !f.isPaid)];
                               if (unpaidItems.length > 0) {
                                 setShowPaymentModal(true);
                               } else {
                                 alert('All selections are confirmed.');
                               }
                             }}
                             className="w-full bg-black text-white py-6 font-black uppercase text-[10px] tracking-[0.4em] hover:bg-white hover:text-black transition-all shadow-3xl"
                           >
                              {bookings.some(b => !b.isPaid) || foodOrders.some(f => !f.isPaid) ? 'Finalize Itinerary' : 'Itinerary Locked'}
                           </button>
                         </div>
                      </div>

                      <div className="bg-zinc-50 p-12 border border-black/5 shadow-sm">
                         <h4 className="text-[11px] font-black uppercase tracking-[0.5em] text-zinc-300 mb-12 border-b border-black/5 pb-8 text-center uppercase font-black tracking-widest leading-none">Gate Information</h4>
                         <div className="space-y-10">
                            <div className="flex gap-6">
                               <div className="w-10 h-10 rounded-full border border-british-blue flex items-center justify-center text-british-blue flex-shrink-0">
                                  <QrCode size={18} />
                                </div>
                               <div className="text-left">
                                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-900 mb-2">Express Entry</p>
                                  <p className="text-sm font-serif italic text-zinc-400 leading-relaxed">Present your generated QR code at the British Festival lounge for direct cabin access.</p>
                               </div>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
              </div>
            </section>
          </motion.div>
        )}

        {view === 'login' && (
          <Login 
            onAdminLogin={() => {
              setIsAdminLoggedIn(true);
              setIsUserLoggedIn(true);
              navigateTo('admin-panel');
            }} 
            onUserLogin={(email, newlyRegistered) => {
              handleUserLogin(email);
              if (newlyRegistered) {
                setShowWelcomeCelebration(true);
              }
              navigateTo('experience');
            }}
          />
        )}

        {view === 'admin-panel' && isAdminLoggedIn && (
          <AdminDashboard 
            onLogout={handleLogout}
            movies={movies}
            setMovies={setMovies}
            concessions={concessions}
            setConcessions={setConcessions}
            ticketPrice={adminPrice}
            setTicketPrice={setAdminPrice}
            bookings={getAllBookings()}
            setBookings={handleAdminSetBookings}
          />
        )}

      </main>

        {/* Footer */}
      <footer className="py-32 bg-white text-zinc-900 text-center overflow-hidden border-t border-black/5 relative">
        {/* Subtle British accent in the background */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.02] flex items-center justify-center overflow-hidden">
          <div className="text-[40vw] font-display font-black uppercase tracking-tighter italic select-none">BRITISH</div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col items-center gap-12">
            <div className="flex items-center gap-10">
              <img src="https://cdn.worldvectorlogo.com/logos/british-council-1.svg" alt="British Council" className="h-12 md:h-20 grayscale opacity-40 hover:opacity-100 transition-opacity" />
              <div className="flex flex-col text-left border-l-2 pl-10 border-black/5">
                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-300 mb-2">Protocol & Relations</span>
                <span className="font-display italic text-4xl tracking-tighter text-zinc-900 font-black uppercase leading-none">British <br /> <span className="text-british-blue">Festival.</span></span>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-x-16 gap-y-8 text-[11px] font-black text-zinc-400 uppercase tracking-[0.5em]">
              <button onClick={() => navigateTo('program')} className="hover:text-british-blue transition-colors">Program</button>
              <button onClick={() => navigateTo('schedule')} className="hover:text-british-blue transition-colors">Events</button>
              <button onClick={() => navigateTo('food')} className="hover:text-british-blue transition-colors">Menu</button>
              <button onClick={() => navigateTo('experience')} className="hover:text-british-blue transition-colors">Voyage</button>
              <button onClick={() => setShowInviteModal(true)} className="hover:text-british-blue transition-colors">Invite</button>
              <a href="https://great-british-festival.vercel.app/" target="_blank" rel="noopener noreferrer" className="hover:text-british-blue transition-colors">Music</a>
            </div>

            <div 
              onClick={handleLogoClick}
              className="w-24 h-[1px] bg-black/5 my-8 cursor-default"
            ></div>

            <div className="space-y-6">
              <p className="text-[11px] text-zinc-400 font-black uppercase tracking-[0.4em] max-w-lg leading-loose text-center mx-auto italic">
                Cultivating world-class cinematic dialogue across nations. <br />
                A British Council legacy project since 2012.
              </p>
              <div className="flex justify-center gap-8 text-zinc-300">
                <span className="text-[10px] uppercase font-black tracking-widest">&copy; 2026 BRITISH FESTIVAL</span>
                <span className="text-[10px] uppercase font-black tracking-widest">LOYALTY PROGRAM</span>
                <span className="text-[10px] uppercase font-black tracking-widest">BFI SOUTHBANK</span>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Invite Modal */}
      <AnimatePresence>
        {showInviteModal && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowInviteModal(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white p-12 md:p-20 shadow-4xl border border-black/5 overflow-hidden"
            >
              {/* Luxury Accent */}
              <div className="absolute top-0 right-0 w-80 h-80 bg-british-blue/5 rounded-full blur-[120px] -mr-40 -mt-40" />
              
              <button 
                onClick={() => setShowInviteModal(false)}
                className="absolute top-10 right-10 text-zinc-300 hover:text-british-blue transition-colors p-2 z-20"
                aria-label="Close modal"
              >
                <X size={32} />
              </button>

              {submitted ? (
                <div className="py-24 text-center">
                  <motion.div 
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    className="w-24 h-24 border-2 border-british-blue rounded-full flex items-center justify-center mx-auto mb-12"
                  >
                    <Check size={48} className="text-british-blue" />
                  </motion.div>
                  <h3 className="text-6xl font-display font-black text-zinc-900 uppercase italic tracking-tighter mb-8 leading-none">Summoned.</h3>
                  <p className="text-zinc-500 font-serif italic text-xl leading-relaxed max-w-sm mx-auto">
                    A fellowship invitation has been formally dispatched to your requested recipient.
                  </p>
                  <button 
                    onClick={() => {
                        setSubmitted(false);
                        setShowInviteModal(false);
                    }}
                    className="mt-16 px-16 py-7 bg-british-blue text-white font-black uppercase tracking-[0.5em] text-[11px] hover:bg-black transition-all shadow-2xl"
                  >
                    Return to Selection
                  </button>
                </div>
              ) : (
                <div className="relative z-10 text-left">
                  <div className="mb-20">
                    <h3 className="text-british-blue text-[11px] font-black uppercase tracking-[0.6em] mb-4">Fellowship Dispatch</h3>
                    <h2 className="text-7xl font-display text-zinc-900 font-black uppercase tracking-tighter leading-none italic">Invite <br /> <span className="font-serif italic font-light text-zinc-300 lowercase tracking-tighter">Companion.</span></h2>
                  </div>
                  
                  <form onSubmit={handleSubmit} className="space-y-12">
                    <div className="space-y-6">
                      <label className="block text-[10px] font-black uppercase tracking-[0.4em] text-zinc-300 uppercase font-black">Recipient Credential</label>
                      <input 
                        required
                        type="email"
                        className="w-full bg-transparent border-b border-black/5 py-6 outline-none text-3xl font-display font-black uppercase text-zinc-900 focus:border-british-blue transition-colors placeholder:text-zinc-100"
                        placeholder="guest@registry.uk"
                      />
                    </div>
                    <div className="space-y-6">
                        <label className="block text-[10px] font-black uppercase tracking-[0.4em] text-zinc-300 uppercase font-black">Bespoke Message</label>
                        <textarea 
                          className="w-full bg-zinc-50 border border-black/5 p-10 outline-none text-zinc-900 focus:border-british-blue min-h-[160px] font-mono text-sm leading-relaxed"
                          placeholder="A personal note for the recipient..."
                        />
                    </div>
                    <button className="w-full bg-british-blue text-white py-8 font-black uppercase tracking-[0.6em] text-[12px] hover:bg-black transition-all shadow-xl">
                      Dispatch Invitation
                    </button>
                    <p className="text-[9px] text-zinc-300 font-black uppercase tracking-[0.5em] text-center italic">
                      Strictly limited fellowship vacancies for the 2026 season.
                    </p>
                  </form>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Movie Details Modal */}
      <AnimatePresence>
        {selectedMovie && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedMovie(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-5xl bg-white overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)] flex flex-col md:flex-row max-h-[90vh]"
              style={{ borderTop: `8px solid ${selectedMovie.color}` }}
            >
              <button 
                onClick={() => {
                  setSelectedMovie(null);
                  setShowTrailer(false);
                }}
                className="absolute top-6 right-6 z-10 w-12 h-12 bg-white flex items-center justify-center text-black hover:text-white transition-all rounded-full shadow-lg"
                style={{ '--hover-bg': selectedMovie.color } as any}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = selectedMovie.color}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
              >
                <X size={24} />
              </button>

              <div className="w-full md:w-[400px] h-[400px] md:h-auto bg-zinc-100 relative shrink-0">
                <img 
                  src={selectedMovie.imageUrl} 
                  alt={selectedMovie.title} 
                  className="absolute inset-0 w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div 
                  className="absolute inset-0 bg-black/20 hover:bg-black/40 transition-colors flex items-center justify-center cursor-pointer group/trailer shadow-inner"
                  onClick={() => setShowTrailer(true)}
                >
                  <div 
                    className="w-24 h-24 rounded-full bg-white/30 backdrop-blur-xl flex items-center justify-center group-hover/trailer:scale-110 transition-transform shadow-2xl border border-white/50"
                  >
                    <Play size={40} className="text-white fill-white ml-2" />
                  </div>
                </div>
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-8">
                  <div className="bg-white/95 px-4 py-2 text-[12px] font-black flex items-center gap-2 backdrop-blur-md border border-zinc-200 shadow-xl">
                    <Star size={16} className="text-[#f1c40f] fill-[#f1c40f]" />
                    {selectedMovie.rating} / 10
                  </div>
                </div>
              </div>

              <div className="flex-1 p-8 md:p-16 overflow-y-auto bg-white">
                <div className="flex flex-wrap items-center gap-4 mb-8">
                  <span className="text-[12px] uppercase font-black tracking-[0.4em]" style={{ color: selectedMovie.color }}>{selectedMovie.year}</span>
                  <span className="h-px w-10 bg-zinc-200"></span>
                  <div className="flex flex-wrap gap-2">
                    {selectedMovie.genre.map(g => (
                      <span key={g} className="text-[10px] uppercase font-black tracking-widest bg-zinc-50 px-4 py-1.5 text-zinc-800 border border-zinc-200 shadow-sm">
                        {g}
                      </span>
                    ))}
                  </div>
                </div>

                <h2 className="text-6xl md:text-7xl font-display italic font-black text-black mb-6 leading-[1.1] tracking-tighter lowercase first-letter:uppercase">
                  {selectedMovie.title}
                </h2>
                
                <p className="text-2xl text-zinc-700 italic font-bold mb-10 leading-relaxed border-l-4 pl-6 py-2" style={{ borderColor: selectedMovie.color }}>
                  A vision by <span className="text-black underline decoration-zinc-100 underline-offset-4">{selectedMovie.director}</span>
                </p>

                <div className="space-y-12 mb-16">
                  <p className="text-xl text-zinc-900 leading-relaxed font-bold">
                    {selectedMovie.description}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="space-y-4">
                      <h4 className="text-[11px] uppercase font-black tracking-[0.4em] text-zinc-400">Starring</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedMovie.starring.map(actor => (
                          <span key={actor} className="text-[13px] font-bold text-zinc-800 bg-zinc-50 px-3 py-1 border border-zinc-100 italic">
                            {actor}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h4 className="text-[11px] uppercase font-black tracking-[0.4em] text-zinc-400">Playing At</h4>
                      <div className="space-y-2">
                        {selectedMovie.locations.map(location => (
                          <div key={location} className="text-[14px] font-black italic text-black flex items-center gap-3">
                            <span className="w-2 h-2 rotate-45" style={{ backgroundColor: selectedMovie.color }}></span>
                            {location}
                          </div>
                        ))}
                      </div>
                    </div>
                    {selectedMovie.watchUrl && (
                      <div className="space-y-4">
                        <h4 className="text-[11px] uppercase font-black tracking-[0.4em] text-zinc-400">Streaming On</h4>
                        <a 
                          href={selectedMovie.watchUrl} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="inline-flex items-center gap-3 text-[14px] font-black italic text-[#003061] hover:underline"
                        >
                          <ShoppingBag size={16} />
                          {selectedMovie.watchLocationName || 'Watch Online'}
                        </a>
                      </div>
                    )}
                    {selectedMovie.awards && selectedMovie.awards.length > 0 && (
                      <div className="space-y-4 md:col-span-2">
                        <h4 className="text-[11px] uppercase font-black tracking-[0.4em] text-zinc-400">Accolades</h4>
                        <div className="flex flex-wrap gap-x-8 gap-y-2">
                          {selectedMovie.awards.map(award => (
                            <div key={award} className="flex items-center gap-3 text-[13px] font-bold text-zinc-700">
                              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: selectedMovie.color }}></span>
                              {award}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {selectedMovie.quotes && selectedMovie.quotes.length > 0 && (
                    <div className="pt-12 border-t border-zinc-100">
                      <div className="relative">
                        <div className="absolute -top-10 -left-6 text-9xl font-display italic text-zinc-100 select-none">"</div>
                        <p className="relative text-3xl font-display italic font-black text-black leading-tight mb-4">
                          {selectedMovie.quotes[0].text}
                        </p>
                        <p className="text-[12px] uppercase font-black tracking-[0.3em] text-zinc-500">— {selectedMovie.quotes[0].actor}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-6 pt-10 border-t border-zinc-100">
                  <button 
                    onClick={() => setShowTrailer(true)}
                    className="flex-[1.5] text-white py-8 px-10 font-black uppercase text-[12px] tracking-[0.3em] flex items-center justify-center gap-4 transition-all group/btn shadow-2xl shadow-zinc-300"
                    style={{ backgroundColor: selectedMovie.color }}
                  >
                    <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }}>
                      <Play size={20} className="fill-white" />
                    </motion.div>
                    Watch Trailer Online
                  </button>
                  <button 
                    onClick={() => {
                      setShowTicketModal(true);
                    }}
                    className="flex-1 bg-zinc-50 text-black py-8 px-10 font-black uppercase text-[12px] tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-white border-2 border-zinc-100 transition-all shadow-xl"
                  >
                    Ticket Reservation
                  </button>
                </div>
                
                <div className="mt-16 grid grid-cols-2 gap-12 py-10 border-t border-zinc-100">
                  <div>
                    <span className="block text-[11px] font-black uppercase tracking-[0.4em] text-zinc-400 mb-3">Official Selection</span>
                    <span className="text-lg font-black text-zinc-900 italic font-display">Winner • Golden Lion</span>
                  </div>
                  <div>
                    <span className="block text-[11px] font-black uppercase tracking-[0.4em] text-zinc-400 mb-3">Festival Premiere</span>
                    <span className="text-lg font-black text-zinc-900">{selectedMovie.year} National Film Centre</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Newly Registered Member Congratulations / Benefits Unveiling Modal */}
      <AnimatePresence>
        {showWelcomeCelebration && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowWelcomeCelebration(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ type: "spring", damping: 25, stiffness: 180 }}
              className="relative w-full max-w-4xl bg-zinc-950 text-white border border-white/10 shadow-5xl overflow-hidden rounded-md flex flex-col md:flex-row z-[125]"
            >
              {/* Gold/Prism Background Flare */}
              <div className="absolute inset-0 opacity-20 pointer-events-none">
                <div className="absolute top-0 right-10 w-[400px] h-[400px] bg-amber-500 rounded-full blur-[120px]" />
                <div className="absolute -bottom-20 -left-10 w-[300px] h-[300px] bg-british-blue rounded-full blur-[100px]" />
              </div>

              {/* Decorative Left Column: Personalized Membership Pass card */}
              <div className="w-full md:w-[45%] bg-zinc-900 p-12 flex flex-col justify-between border-b md:border-b-0 md:border-r border-white/5 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent pointer-events-none" />
                
                <div>
                  <div className="flex items-center justify-between mb-16">
                     <div className="w-10 h-10 border border-white/20 rounded-full flex items-center justify-center text-white italic font-display font-black text-xl">B</div>
                     <span className="text-[8px] font-mono tracking-[0.4em] text-amber-500 uppercase font-black bg-amber-500/10 px-3 py-1 border border-amber-500/20 rounded-full">Active Fellow</span>
                  </div>
                  
                  <span className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-500 mb-2 block">Fellowship Privilege Pass</span>
                  <h4 className="text-3xl font-display font-black uppercase tracking-tighter text-zinc-100 leading-none mb-12">
                     BRITISH <br /><span className="italic font-light text-amber-500 font-serif lowercase">alliance.</span>
                  </h4>
                </div>

                <div className="space-y-8 relative z-10 text-left">
                  <div className="p-6 bg-white/5 border border-white/5 rounded-sm backdrop-blur-sm">
                    <span className="block text-[8px] font-mono tracking-widest text-zinc-500 uppercase mb-2">Member Credentials</span>
                    <p className="font-mono text-xs text-white truncate font-bold">{userEmail || 'member@dossier.uk'}</p>
                    <div className="mt-4 flex items-center justify-between text-[9px] font-mono text-zinc-400">
                      <span>ID: #BF-{Math.floor(1000 + Math.random() * 9000)}</span>
                      <span>ISSUE: 2026/05</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[9px] font-mono text-zinc-500 uppercase tracking-widest pt-2 border-t border-white/5">
                    <span>BFI Southbank Premium</span>
                    <span>Class 01</span>
                  </div>
                </div>
              </div>

              {/* Exclusive unlocked features detail checklist */}
              <div className="w-full md:w-[55%] p-12 md:p-16 flex flex-col justify-center relative z-10 text-left">
                <button 
                  onClick={() => setShowWelcomeCelebration(false)}
                  className="absolute top-8 right-8 text-zinc-400 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>

                <div className="mb-10">
                  <span className="inline-flex items-center gap-2 text-amber-500 mb-3">
                    <Sparkles size={14} className="animate-pulse" />
                    <span className="font-mono text-[9px] font-black uppercase tracking-widest">FESTIVAL ALLIANCE UNLOCKED</span>
                  </span>
                  <h3 className="text-4xl font-display font-black uppercase tracking-tighter leading-tight mb-4">
                     Welcome to <br />
                     The <span className="font-serif italic font-light text-amber-500 lowercase">Registry.</span>
                  </h3>
                  <p className="text-zinc-400 font-serif italic text-sm">
                     Congratulations! Your credential registration is successfully verified. We have automatically unlocked your member-only pathways and system privileges:
                  </p>
                </div>

                <div className="space-y-6 mb-12">
                   <div className="flex gap-4 items-start">
                     <div className="w-6 h-6 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center flex-shrink-0 text-amber-500 text-[10px] font-bold">✓</div>
                     <div>
                       <h5 className="text-[11px] font-black uppercase tracking-widest text-zinc-100 mb-1">Instant 20% Account Discount</h5>
                       <p className="text-xs text-zinc-400">Applied automatically across all ticket class categories and gourmet cinema concession menus during check out.</p>
                     </div>
                   </div>

                   <div className="flex gap-4 items-start">
                     <div className="w-6 h-6 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center flex-shrink-0 text-amber-500 text-[10px] font-bold">✓</div>
                     <div>
                       <h5 className="text-[11px] font-black uppercase tracking-widest text-zinc-100 mb-1 flex items-center gap-2">
                         Secret Premiere Screenings Unveiled
                         <span className="text-[8px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded font-mono font-black tracking-widest">UNLOCKED</span>
                       </h5>
                       <p className="text-xs text-zinc-400">Restored films such as "Sherlock Holmes: Restored Lost Reels" and "The Crown" are now completely queryable and playable in the film folder catalog.</p>
                     </div>
                   </div>

                   <div className="flex gap-4 items-start">
                     <div className="w-6 h-6 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center flex-shrink-0 text-amber-500 text-[10px] font-bold">✓</div>
                     <div>
                       <h5 className="text-[11px] font-black uppercase tracking-widest text-zinc-100 mb-1">Priority Boarding & Entry QR</h5>
                       <p className="text-xs text-zinc-400">A security check-in priority pass is generated automatically in your "My Trip" dashboard folder, enabling express cabin check-ins.</p>
                     </div>
                   </div>
                </div>

                <button 
                  onClick={() => setShowWelcomeCelebration(false)}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-black py-5 font-black uppercase tracking-[0.4em] text-[10px] transition-all duration-300 shadow-xl shadow-amber-500/10 hover:shadow-amber-500/30 text-center"
                >
                  Enter Member Lounge
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

