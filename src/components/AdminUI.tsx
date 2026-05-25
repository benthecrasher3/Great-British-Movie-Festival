import React, { useState } from 'react';
import { X, Lock, Plus, Trash2, Edit3, Save, LogOut, Image as ImageIcon, Video, UserX, UserCheck, MessageSquare, ShieldAlert, Eye, EyeOff, Check, AlertTriangle, Menu, Search, Calendar, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Movie, FoodItem, FestivalUser } from '../types';

interface AdminUIProps {
  onLogout: () => void;
  movies: Movie[];
  setMovies: React.Dispatch<React.SetStateAction<Movie[]>>;
  concessions: FoodItem[];
  setConcessions: React.Dispatch<React.SetStateAction<FoodItem[]>>;
  ticketPrice: number;
  setTicketPrice: (p: number) => void;
}

export const Login = ({ onAdminLogin, onUserLogin }: { onAdminLogin: () => void, onUserLogin: (email: string) => void }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isAppealing, setIsAppealing] = useState(false);
  const [appealText, setAppealText] = useState('');
  const [blockedEmail, setBlockedEmail] = useState('');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');

  const passwordRequirements = {
    length: pass.length >= 8,
    uppercase: /[A-Z]/.test(pass),
    number: /[0-9]/.test(pass),
    special: /[^A-Za-z0-9]/.test(pass)
  };

  const isPasswordValid = Object.values(passwordRequirements).every(Boolean);

  const getUsers = (): Record<string, FestivalUser> => {
    const saved = localStorage.getItem('festival_users');
    if (!saved) return {};
    const parsed = JSON.parse(saved);
    
    // Migration logic for old schema
    const migrated: Record<string, FestivalUser> = {};
    Object.keys(parsed).forEach(key => {
      if (typeof parsed[key] === 'string') {
        migrated[key] = {
          email: key,
          password: parsed[key],
          status: 'active',
          appealStatus: 'none'
        };
      } else {
        migrated[key] = parsed[key];
      }
    });
    
    if (JSON.stringify(parsed) !== JSON.stringify(migrated)) {
      localStorage.setItem('festival_users', JSON.stringify(migrated));
    }
    
    return migrated;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const users = getUsers();

    if (isSignUp) {
      if (!isPasswordValid) {
        setError('Security requirements not met.');
        return;
      }
      if (email === 'admin@festival.com') {
        setError('Reserved email.');
        return;
      }
      if (users[email]) {
        setError('Registry exists.');
        return;
      }
      const newUser: FestivalUser = {
        email,
        password: pass,
        status: 'active',
        appealStatus: 'none'
      };
      users[email] = newUser;
      localStorage.setItem('festival_users', JSON.stringify(users));
      setIsSignUp(false);
      return;
    }

    if (email === 'admin@festival.com' && pass === 'admin123') {
      onAdminLogin();
      return;
    }

    const user = users[email];
    if (user && user.password === pass) {
      if (user.status === 'blocked' || user.appealStatus === 'declined') {
        setBlockedEmail(email);
        setIsAppealing(true);
        setError('');
        return;
      }
      onUserLogin(email);
    } else if (email === 'visitor@test.com' && pass === 'visitor123') {
      onUserLogin(email);
    } else {
      setError('Invalid credentials.');
    }
  };

  const handleAppeal = (e: React.FormEvent) => {
    e.preventDefault();
    const users = getUsers();
    const user = users[blockedEmail];
    if (user) {
      user.appealRequest = appealText;
      user.appealStatus = 'pending';
      user.appealResponse = '';
      localStorage.setItem('festival_users', JSON.stringify(users));
      setIsAppealing(false);
      setAppealText('');
      setBlockedEmail('');
    }
  };

  if (isAppealing) {
    const users = getUsers();
    const user = users[blockedEmail];
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-lg bg-white p-16 shadow-3xl border border-black/5"
        >
          <div className="flex justify-center mb-10 text-british-blue">
            <ShieldAlert size={80} />
          </div>
          <h2 className="text-4xl font-display font-black text-center uppercase tracking-tighter mb-8 text-zinc-900 leading-none">Status <br /> <span className="text-british-blue italic">Restricted.</span></h2>
          
          {user?.appealStatus === 'approved' ? (
            <div className="text-center space-y-8">
              <div className="flex justify-center mb-4 text-green-500">
                <Check size={64} />
              </div>
              <p className="text-zinc-500 font-serif italic text-lg leading-relaxed">Your appeal has been successfully reviewed and access granted.</p>
              <button 
                onClick={() => {
                  const users = getUsers();
                  if (users[blockedEmail]) {
                    users[blockedEmail].appealStatus = 'none';
                    users[blockedEmail].appealResponse = '';
                    localStorage.setItem('festival_users', JSON.stringify(users));
                   }
                  onUserLogin(blockedEmail);
                  setIsAppealing(false);
                }}
                className="w-full bg-british-blue text-white py-6 font-black uppercase tracking-[0.4em] text-[10px] hover:bg-black transition-all shadow-xl"
              >
                Access Lounge
              </button>
            </div>
          ) : user?.appealStatus === 'pending' ? (
            <div className="text-center space-y-8">
               <p className="text-zinc-500 font-serif italic text-lg leading-relaxed">Our protocol team is currently reviewing your appeal request.</p>
               <div className="py-6 border-y border-black/5 font-mono text-[10px] tracking-[0.4em] text-zinc-300 uppercase">
                  Protocol Review Pending
               </div>
               <button onClick={() => setIsAppealing(false)} className="w-full bg-zinc-100 text-zinc-400 py-6 font-black uppercase tracking-[0.4em] text-[10px] hover:text-zinc-900 transition-colors">Return</button>
            </div>
          ) : (
            <form onSubmit={handleAppeal} className="space-y-10 text-left">
               <div className="space-y-4">
                  <label className="block text-[10px] font-black uppercase tracking-[0.4em] text-zinc-300 text-center uppercase font-black tracking-widest leading-none">Appeal Dossier</label>
                  <textarea 
                    required
                    value={appealText}
                    onChange={(e) => setAppealText(e.target.value)}
                    className="w-full p-8 bg-zinc-50 border border-black/5 text-zinc-900 outline-none focus:border-british-blue min-h-[160px] font-mono text-sm leading-relaxed"
                    placeholder="Enter your justification statement..."
                  />
               </div>
               <button className="w-full bg-british-blue text-white py-6 font-black uppercase tracking-[0.4em] text-[10px] hover:bg-black transition-all shadow-xl">
                  Submit for Review
               </button>
               <button type="button" onClick={() => setIsAppealing(false)} className="w-full text-[10px] font-black uppercase tracking-[0.4em] text-zinc-300 hover:text-zinc-900 transition-colors">Cancel</button>
            </form>
          )}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 p-6 overflow-hidden relative">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
         <div className="absolute top-0 -left-1/4 w-[1000px] h-[1000px] bg-british-blue rounded-full blur-[200px]" />
      </div>
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg bg-white p-16 shadow-4xl border border-black/5 relative z-10"
      >
        <div className="flex justify-center mb-12">
          <div className="w-20 h-20 border-2 border-british-blue rounded-full flex items-center justify-center text-british-blue italic font-display text-4xl font-black">
            B
          </div>
        </div>
        <h2 className="text-5xl font-display font-black text-center uppercase tracking-tighter mb-4 text-zinc-900">
          {isSignUp ? 'Apply.' : 'Loyalty.'}
        </h2>
        <p className="text-center text-zinc-300 text-[10px] font-black uppercase tracking-[0.5em] mb-16">
          {isSignUp ? 'Fellowship Registry' : 'British Festival Registry'}
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-10 text-left">
          <div className="space-y-4">
            <label className="block text-[10px] font-black uppercase tracking-[0.4em] text-zinc-300 uppercase font-black tracking-widest leading-none">Identifier</label>
            <input 
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent border-b border-black/5 focus:border-british-blue py-4 outline-none font-sans text-xl text-zinc-900 transition-colors"
              placeholder="id@registry.uk"
              required
            />
          </div>
          <div className="space-y-4 relative">
            <label className="block text-[10px] font-black uppercase tracking-[0.4em] text-zinc-300 uppercase font-black tracking-widest leading-none">Security Key</label>
            <input 
              type={showPassword ? "text" : "password"}
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              className="w-full bg-transparent border-b border-black/5 focus:border-british-blue py-4 outline-none font-sans text-xl text-zinc-900 transition-colors pr-12"
              placeholder="••••••••"
              required
            />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-0 bottom-4 text-zinc-300 hover:text-british-blue"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          
          {isSignUp && (
            <div className="space-y-4 p-8 bg-zinc-50 border border-black/5">
              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-300 mb-4 border-b border-black/5 pb-4">Security Protocol</p>
              <div className="grid grid-cols-1 gap-2">
                {[
                  { label: '8+ Characters', met: passwordRequirements.length },
                  { label: 'Case Diversity', met: passwordRequirements.uppercase },
                  { label: 'Numeric Entry', met: passwordRequirements.number },
                  { label: 'Special Protocol', met: passwordRequirements.special }
                ].map((req, idx) => (
                  <div key={idx} className="flex items-center gap-4">
                    <div className={`w-2 h-2 rounded-full ${req.met ? 'bg-green-500' : 'bg-zinc-200'}`} />
                    <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${req.met ? 'text-zinc-900' : 'text-zinc-300'}`}>
                      {req.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {error && (
            <div className="flex items-center gap-4 text-british-red bg-british-red/5 p-6 border border-british-red/20 uppercase font-black text-[10px] tracking-widest">
              <AlertTriangle size={18} />
              {error}
            </div>
          )}
          <button className="w-full bg-british-blue text-white py-6 font-black uppercase tracking-[0.4em] text-[10px] hover:bg-black transition-all shadow-xl">
            {isSignUp ? 'Submit Registration' : 'Authenticate'}
          </button>

          <button 
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError('');
            }}
            className="w-full text-[10px] font-black uppercase tracking-[0.4em] text-zinc-300 hover:text-zinc-900 transition-colors"
          >
            {isSignUp ? 'Already Registered?' : 'New Applicant?'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export const AdminDashboard = ({ 
  onLogout, 
  movies, 
  setMovies, 
  concessions, 
  setConcessions,
  ticketPrice,
  setTicketPrice,
}: AdminUIProps) => {
  const [activeTab, setActiveTab] = useState<'movies' | 'food' | 'prices' | 'users'>('movies');
  const [userSearch, setUserSearch] = useState('');
  const [selectedUserForAppeal, setSelectedUserForAppeal] = useState<FestivalUser | null>(null);
  const [appealResponseText, setAppealResponseText] = useState('');
  const [updateTrigger, setUpdateTrigger] = useState(0);

  const getUsers = (): Record<string, FestivalUser> => {
    const saved = localStorage.getItem('festival_users');
    return saved ? JSON.parse(saved) : {};
  };

  const updateUserStatus = (email: string, status: 'active' | 'blocked') => {
    if (email === 'admin@festival.com') return;
    const users = getUsers();
    if (users[email]) {
      users[email].status = status;
      if (status === 'active') {
        users[email].appealStatus = 'none';
        users[email].appealRequest = '';
      }
      localStorage.setItem('festival_users', JSON.stringify(users));
      setUpdateTrigger(prev => prev + 1);
    }
  };

  const deleteUser = (email: string) => {
    if (email === 'admin@festival.com') return;
    if (window.confirm(`Delete account ${email}?`)) {
      const users = getUsers();
      delete users[email];
      localStorage.setItem('festival_users', JSON.stringify(users));
      setUpdateTrigger(prev => prev + 1);
    }
  };

  const handleAppealAction = (email: string, action: 'approve' | 'decline') => {
    const users = getUsers();
    const user = users[email];
    if (user) {
      if (action === 'approve') {
        user.status = 'active';
        user.appealStatus = 'approved';
        user.appealRequest = '';
        user.appealResponse = 'Approved.';
      } else {
        user.appealStatus = 'declined';
        user.appealResponse = appealResponseText;
      }
      localStorage.setItem('festival_users', JSON.stringify(users));
      setSelectedUserForAppeal(null);
      setAppealResponseText('');
      setUpdateTrigger(prev => prev + 1);
    }
  };

  const users = getUsers();
  const sortedUsers = Object.values(users).filter(u => 
    u.email !== 'admin@festival.com' &&
    u.email.toLowerCase().includes(userSearch.toLowerCase())
  ).sort((a, b) => {
    if (a.appealStatus === 'pending' && b.appealStatus !== 'pending') return -1;
    if (a.appealStatus !== 'pending' && b.appealStatus === 'pending') return 1;
    return 0;
  });

  const [newMovie, setNewMovie] = useState<Partial<Movie>>({
    title: '', director: '', description: '', year: 2026, imageUrl: '', trailerUrl: '', watchUrl: '', watchLocationName: '', genre: ['Drama'], color: '#003061', starring: [], quotes: [], locations: ['BFI Southbank']
  });

  const [newFood, setNewFood] = useState<Partial<FoodItem>>({
    name: '', price: 0, description: '', imageUrl: '', category: 'Snacks'
  });

  const handleAddMovie = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMovie.title && newMovie.imageUrl) {
      const movie: Movie = { ...newMovie as Movie, id: `M-${Date.now()}` };
      setMovies([movie, ...movies]);
      setNewMovie({ title: '', director: '', description: '', year: 2026, imageUrl: '', trailerUrl: '', watchUrl: '', watchLocationName: '', genre: ['Drama'], color: '#003061', starring: [], quotes: [], locations: ['BFI Southbank'] });
    }
  };

  const handleAddFood = (e: React.FormEvent) => {
    e.preventDefault();
    if (newFood.name && newFood.imageUrl) {
      const item: FoodItem = { ...newFood as FoodItem, id: `F-${Date.now()}` };
      setConcessions([...concessions, item]);
      setNewFood({ name: '', price: 0, description: '', imageUrl: '', category: 'Snacks' });
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <nav className="border-b border-black/5 px-8 py-6 sticky top-0 bg-white/90 backdrop-blur-xl z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-8">
            <h1 className="text-3xl font-display font-black uppercase tracking-tighter italic leading-none text-left">Protocol <br /> <span className="text-british-blue">Command.</span></h1>
            <div className="h-10 w-[1px] bg-black/5 hidden md:block" />
            <div className="hidden md:block text-left">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-300 leading-none mb-1">Festival Hub</p>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-british-blue leading-none">Security Override</p>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="px-6 py-3 border border-british-blue text-british-blue text-[10px] font-black uppercase tracking-[0.3em] hover:bg-british-blue hover:text-white transition-all shadow-sm"
          >
            Terminal Exit
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-8 md:p-16">
        <div className="flex gap-8 mb-20 overflow-x-auto pb-4 scrollbar-hide border-b border-black/5">
          {[
            { id: 'movies', label: 'Cinematography' },
            { id: 'food', label: 'Gastronomy' },
            { id: 'prices', label: 'Treasury' },
            { id: 'users', label: 'Registry' }
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-8 text-[10px] font-black uppercase tracking-[0.4em] transition-all whitespace-nowrap border-b-2 ${activeTab === tab.id ? 'border-british-blue text-zinc-900' : 'border-transparent text-zinc-300 hover:text-zinc-500'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        {activeTab === 'movies' && (
          <div className="space-y-32">
            <section className="max-w-4xl">
              <h3 className="text-[11px] font-black uppercase tracking-[0.5em] text-british-blue mb-12">New Acquisition</h3>
              <form onSubmit={handleAddMovie} className="space-y-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                   <div className="space-y-8">
                      <input placeholder="Project Title" value={newMovie.title} onChange={e => setNewMovie({...newMovie, title: e.target.value})} className="w-full bg-transparent border-b border-black/5 py-4 outline-none text-2xl font-display font-black uppercase focus:border-british-blue text-left" />
                      <input placeholder="Director" value={newMovie.director} onChange={e => setNewMovie({...newMovie, director: e.target.value})} className="w-full bg-transparent border-b border-black/5 py-4 outline-none text-lg text-zinc-400 focus:border-british-blue text-left" />
                      <textarea placeholder="Narrative Description" value={newMovie.description} onChange={e => setNewMovie({...newMovie, description: e.target.value})} className="w-full bg-zinc-50 border border-black/5 p-6 outline-none h-40 focus:border-british-blue text-zinc-900" />
                   </div>
                   <div className="space-y-8">
                      <input placeholder="Poster Link" value={newMovie.imageUrl} onChange={e => setNewMovie({...newMovie, imageUrl: e.target.value})} className="w-full bg-transparent border-b border-black/5 py-4 outline-none text-zinc-300 focus:border-british-blue text-left" />
                      <input placeholder="Trailer Protocol URL" value={newMovie.trailerUrl} onChange={e => setNewMovie({...newMovie, trailerUrl: e.target.value})} className="w-full bg-transparent border-b border-black/5 py-4 outline-none text-zinc-300 focus:border-british-blue text-left" />
                      <div className="grid grid-cols-2 gap-8">
                         <input placeholder="Genre" value={newMovie.genre?.[0]} onChange={e => setNewMovie({...newMovie, genre: [e.target.value]})} className="bg-transparent border-b border-black/5 py-4 outline-none text-left" />
                         <input type="number" placeholder="Year" value={newMovie.year} onChange={e => setNewMovie({...newMovie, year: parseInt(e.target.value)})} className="bg-transparent border-b border-black/5 py-4 outline-none text-left" />
                      </div>
                      <button className="w-full bg-british-blue text-white py-6 font-black uppercase tracking-[0.4em] text-[10px] hover:bg-black transition-all shadow-xl">Submit to Archive</button>
                   </div>
                </div>
              </form>
            </section>

            <section>
              <h3 className="text-[11px] font-black uppercase tracking-[0.5em] text-zinc-200 mb-12">Active Archive</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {movies.map(movie => (
                  <div key={movie.id} className="group relative aspect-[2/3] overflow-hidden bg-zinc-100 grayscale hover:grayscale-0 transition-all duration-700 rounded-sm">
                    <img src={movie.imageUrl} className="w-full h-full object-cover opacity-40 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute inset-0 bg-zinc-900/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-md translate-y-full group-hover:translate-y-0 transition-transform">
                       <p className="text-[10px] font-black uppercase text-zinc-900 tracking-widest truncate">{movie.title}</p>
                       <p className="text-[8px] font-black uppercase text-british-blue tracking-widest mt-1">Archive ID: {movie.id.split('-')[1]}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {activeTab === 'food' && (
           <div className="space-y-32">
             <section className="max-w-4xl">
               <h3 className="text-[11px] font-black uppercase tracking-[0.5em] text-british-blue mb-12">Curate Menu</h3>
               <form onSubmit={handleAddFood} className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
                  <div className="space-y-8">
                     <input placeholder="Item Nomenclature" value={newFood.name} onChange={e => setNewFood({...newFood, name: e.target.value})} className="w-full bg-transparent border-b border-black/5 py-4 outline-none text-2xl font-display font-black uppercase focus:border-british-blue" />
                     <select value={newFood.category} onChange={e => setNewFood({...newFood, category: e.target.value as any})} className="w-full bg-transparent border-b border-black/5 py-4 outline-none text-zinc-400">
                        <option className="bg-white">Snacks</option>
                        <option className="bg-white">Drinks</option>
                        <option className="bg-white">Combos</option>
                     </select>
                     <textarea placeholder="Gastronomic Description" value={newFood.description} onChange={e => setNewFood({...newFood, description: e.target.value})} className="w-full bg-zinc-50 border border-black/5 p-6 outline-none h-32 focus:border-british-blue" />
                  </div>
                  <div className="space-y-8">
                     <input placeholder="Asset Image URL" value={newFood.imageUrl} onChange={e => setNewFood({...newFood, imageUrl: e.target.value})} className="w-full bg-transparent border-b border-black/5 py-4 outline-none text-zinc-300 focus:border-british-blue" />
                     <input type="number" placeholder="Valuation (Rp)" value={newFood.price} onChange={e => setNewFood({...newFood, price: parseFloat(e.target.value)})} className="w-full bg-transparent border-b border-black/5 py-4 outline-none text-zinc-300 focus:border-british-blue" />
                     <button className="w-full bg-british-blue text-white py-6 font-black uppercase tracking-[0.4em] text-[10px] hover:bg-black transition-all shadow-xl">Add to Selection</button>
                  </div>
               </form>
             </section>

             <section className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {concessions.map(item => (
                  <div key={item.id} className="bg-white p-8 border border-black/5 group hover:shadow-2xl transition-all duration-700">
                    <div className="aspect-square overflow-hidden mb-8 bg-zinc-50">
                      <img src={item.imageUrl} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                    </div>
                    <h4 className="font-display font-black uppercase text-xl text-zinc-900 text-left">{item.name}</h4>
                    <p className="text-3xl font-display font-black italic tracking-tighter text-british-blue mt-2 text-left">Rp {item.price.toLocaleString('id-ID')}</p>
                  </div>
                ))}
             </section>
           </div>
        )}

        {activeTab === 'prices' && (
          <div className="max-w-2xl bg-white p-16 border border-black/5 shadow-sm">
            <h3 className="text-[11px] font-black uppercase tracking-[0.5em] text-british-blue mb-16 text-left">Global Valuation</h3>
            <div className="space-y-12">
              <div className="text-left">
                <label className="block text-[10px] font-black uppercase tracking-[0.4em] text-zinc-300 mb-8 uppercase font-black tracking-widest leading-none">Standard Admission Rate</label>
                <div className="flex items-center gap-10">
                  <input 
                    type="range" min="25000" max="500000" step="5000" 
                    value={ticketPrice} 
                    onChange={e => setTicketPrice(parseInt(e.target.value))}
                    className="flex-1 accent-british-blue"
                  />
                  <span className="text-5xl font-display font-black italic tracking-tighter whitespace-nowrap text-zinc-900">Rp {ticketPrice.toLocaleString('id-ID')}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="space-y-12">
            <section className="bg-white p-12 border border-black/5 shadow-sm">
               <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-12 mb-16">
                  <div className="text-left">
                    <h3 className="text-3xl font-display font-black uppercase italic tracking-tighter mb-4 text-zinc-900">Registry <br /> <span className="text-british-blue">Logistics.</span></h3>
                    <p className="text-zinc-300 text-[10px] font-black uppercase tracking-[0.4em]">Protocol verification and access control</p>
                  </div>
                  <div className="relative w-full md:w-96 text-left">
                    <input 
                      type="text" 
                      placeholder="Search credentials..." 
                      value={userSearch}
                      onChange={e => setUserSearch(e.target.value)}
                      className="w-full bg-zinc-50 border border-black/5 p-5 font-mono text-xs outline-none focus:border-british-blue text-zinc-900"
                    />
                  </div>
               </div>

               <div className="overflow-x-auto">
                 <table className="w-full text-left">
                   <thead className="border-b border-black/5">
                     <tr className="">
                       <th className="pb-8 text-[10px] font-black uppercase tracking-[0.4em] text-zinc-300 uppercase font-black tracking-widest leading-none">Credential</th>
                       <th className="pb-8 text-[10px] font-black uppercase tracking-[0.4em] text-zinc-300 uppercase font-black tracking-widest leading-none text-center">Status</th>
                       <th className="pb-8 text-[10px] font-black uppercase tracking-[0.4em] text-zinc-300 uppercase font-black tracking-widest leading-none text-center">Protocol</th>
                       <th className="pb-8 text-[10px] font-black uppercase tracking-[0.4em] text-zinc-300 uppercase font-black tracking-widest leading-none text-right">Actions</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-black/5">
                     <AnimatePresence mode="popLayout">
                       {sortedUsers.map(user => (
                         <motion.tr layout key={user.email} className="group hover:bg-zinc-50 transition-colors">
                           <td className="py-8">
                              <span className="font-mono text-sm tracking-wider text-zinc-900">{user.email}</span>
                           </td>
                           <td className="py-8 text-center text-[10px] uppercase font-black tracking-widest">
                               {user.status === 'active' ? (
                                 <span className="text-green-600">AUTHORIZED</span>
                               ) : (
                                 <span className="text-british-red underline decoration-dotted">REVOKED</span>
                               )}
                           </td>
                           <td className="py-8 text-center">
                               {user.appealStatus === 'pending' ? (
                                 <button 
                                   onClick={() => setSelectedUserForAppeal(user)}
                                   className="bg-british-blue text-white text-[9px] font-black uppercase px-4 py-2 hover:bg-black transition-all shadow-md"
                                 >
                                   Protocol Appeal
                                 </button>
                               ) : (
                                 <span className="text-[9px] font-black uppercase text-zinc-300">Clearance Normal</span>
                               )}
                           </td>
                           <td className="py-8 text-right pr-4">
                               <div className="flex justify-end gap-6 opacity-40 group-hover:opacity-100 transition-opacity">
                                  {user.status === 'active' ? (
                                    <button onClick={() => updateUserStatus(user.email, 'blocked')} className="text-zinc-400 hover:text-british-red transition-colors"><UserX size={20} /></button>
                                  ) : (
                                    <button onClick={() => updateUserStatus(user.email, 'active')} className="text-zinc-400 hover:text-green-600 transition-colors"><UserCheck size={20} /></button>
                                  )}
                                  <button onClick={() => deleteUser(user.email)} className="text-zinc-300 hover:text-british-red transition-colors"><Trash2 size={20} /></button>
                               </div>
                           </td>
                         </motion.tr>
                       ))}
                     </AnimatePresence>
                   </tbody>
                 </table>
               </div>
            </section>
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedUserForAppeal && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-8">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedUserForAppeal(null)} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-2xl bg-white border border-black/5 p-20 shadow-4xl overflow-hidden">
              <div className="absolute top-0 right-0 p-10 font-display font-black text-9xl text-black/5 pointer-events-none italic uppercase leading-none">PROTOCOL</div>
              <div className="relative z-10 text-left">
                <div className="mb-16">
                  <h3 className="text-british-blue text-[11px] font-black uppercase tracking-[0.5em] mb-4">Appeal Verification</h3>
                  <h2 className="text-5xl font-display font-black uppercase tracking-tighter italic leading-none text-zinc-900">{selectedUserForAppeal.email.split('@')[0]}</h2>
                </div>

                <div className="space-y-12">
                  <div className="bg-zinc-50 p-10 border-l-4 border-british-blue">
                    <p className="text-[9px] font-black uppercase text-zinc-300 mb-6 tracking-[0.4em]">Submission Statement</p>
                    <p className="text-xl font-serif italic text-zinc-600 leading-relaxed">"{selectedUserForAppeal.appealRequest}"</p>
                  </div>

                  <div className="space-y-6">
                    <label className="block text-[10px] font-black uppercase tracking-[0.4em] text-zinc-300 uppercase font-black tracking-widest leading-none">Protocol Resolution (Optional Response)</label>
                    <textarea 
                      value={appealResponseText}
                      onChange={e => setAppealResponseText(e.target.value)}
                      className="w-full bg-zinc-50 border border-black/5 p-8 text-zinc-900 outline-none focus:border-british-blue min-h-[120px] font-mono text-sm"
                      placeholder="Enter resolution notes..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-8">
                    <button 
                      onClick={() => handleAppealAction(selectedUserForAppeal.email, 'decline')}
                      className="bg-zinc-100 text-zinc-400 py-6 font-black uppercase tracking-[0.4em] text-[10px] hover:text-british-blue hover:bg-zinc-200 transition-all border border-black/5 shadow-sm"
                    >
                      Dossier Declined
                    </button>
                    <button 
                      onClick={() => handleAppealAction(selectedUserForAppeal.email, 'approve')}
                      className="bg-british-blue text-white py-6 font-black uppercase tracking-[0.4em] text-[10px] hover:bg-black transition-all shadow-xl"
                    >
                      Clearance Approved
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
