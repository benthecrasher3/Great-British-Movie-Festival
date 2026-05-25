import React, { useState } from 'react';
import { X, Lock, Plus, Trash2, Edit3, Save, LogOut, Image as ImageIcon, Video, UserX, UserCheck, MessageSquare, ShieldAlert, Eye, EyeOff, Check, AlertTriangle, Menu, Search, Calendar, ChevronRight, Sparkles, Gift, QrCode, Ticket } from 'lucide-react';
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
  bookings?: any[];
  setBookings?: React.Dispatch<React.SetStateAction<any[]>>;
}

export const Login = ({ onAdminLogin, onUserLogin }: { onAdminLogin: () => void, onUserLogin: (email: string, newlyRegistered?: boolean) => void }) => {
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
      const savedAdmins = localStorage.getItem('festival_admins');
      const customAdmins = savedAdmins ? JSON.parse(savedAdmins) : {};
      if (email === 'admin@festival.com' || customAdmins[email]) {
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
      onUserLogin(email, true);
      return;
    }

    const savedAdmins = localStorage.getItem('festival_admins');
    const customAdmins = savedAdmins ? JSON.parse(savedAdmins) : {};

    if ((email === 'admin@festival.com' && pass === 'admin123') || (customAdmins[email] && customAdmins[email] === pass)) {
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
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 py-16 px-6 overflow-hidden relative">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
         <div className="absolute top-0 -left-1/4 w-[1000px] h-[1000px] bg-british-blue rounded-full blur-[200px]" />
      </div>
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-5xl bg-white shadow-4xl border border-black/5 relative z-10 overflow-hidden flex flex-col lg:flex-row"
      >
        {/* Left Side: Form */}
        <div className="w-full lg:w-1/2 p-12 md:p-16 flex flex-col justify-center bg-white border-b lg:border-b-0 lg:border-r border-black/5">
          <div className="flex justify-center lg:justify-start mb-12">
            <div className="w-20 h-20 border-2 border-british-blue rounded-full flex items-center justify-center text-british-blue italic font-display text-4xl font-black">
              B
            </div>
          </div>
          <h2 className="text-5xl font-display font-black text-center lg:text-left uppercase tracking-tighter mb-4 text-zinc-900">
            {isSignUp ? 'Apply.' : 'Loyalty.'}
          </h2>
          <p className="text-center lg:text-left text-zinc-300 text-[10px] font-black uppercase tracking-[0.5em] mb-16">
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
        </div>

        {/* Right Side: Exclusive Perks & Benefits info panel */}
        <div className="w-full lg:w-1/2 p-12 md:p-16 bg-zinc-950 text-white flex flex-col justify-center relative overflow-hidden border-t lg:border-t-0 border-white/5">
          {/* Decorative artistic background flare */}
          <div className="absolute inset-0 opacity-15 pointer-events-none">
            <div className="absolute -bottom-1/4 -right-1/4 w-[500px] h-[500px] bg-british-blue rounded-full blur-[120px]" />
            <div className="absolute top-10 right-10 w-[200px] h-[200px] bg-rose-500 rounded-full blur-[100px] opacity-45" />
          </div>

          <div className="relative z-10 space-y-12">
            <div className="text-left">
              <span className="inline-flex items-center gap-2 border border-british-blue/50 text-british-blue bg-british-blue/5 px-4 py-1.5 uppercase font-mono text-[9px] font-black tracking-widest mb-6 rounded-full">
                <Sparkles size={10} className="animate-spin duration-3000" /> Member Fellowship Lounge
              </span>
              <h3 className="text-4xl md:text-5xl font-display font-black uppercase tracking-tighter leading-none mb-4">
                Elite <br />
                <span className="font-serif italic font-light text-white/45 lowercase">Privileges.</span>
              </h3>
              <p className="text-zinc-400 font-serif italic text-base leading-relaxed">
                Applying for a fellowship registry unlocks immediate premium tiers, hidden screen masterworks, and elite cultural collaborations.
              </p>
            </div>

            <div className="space-y-8 text-left">
              {[
                {
                  icon: <Ticket className="text-british-blue" size={20} />,
                  title: "Premium 20% Account Discount",
                  desc: "Enjoy automatic 20% savings on all British Festival ticket classes and cinema concessions upon sign-in."
                },
                {
                  icon: <Lock className="text-amber-500" size={20} />,
                  title: "Secret Premiere Access",
                  desc: "Gain exclusive, members-only unlockable pathways to search, book, and play hidden screening specials."
                },
                {
                  icon: <QrCode className="text-rose-500" size={20} />,
                  title: "VIP Priority Lounge Checks",
                  desc: "Present your personal membership QR code at BFI Southbank suites for express priority cabin boarding."
                },
                {
                  icon: <Sparkles className="text-emerald-500" size={20} />,
                  title: "Director Panels & Early Passes",
                  desc: "Receive invitations to prestigious cocktails, panels, and priority seat selections 48 hours early."
                }
              ].map((benefit, i) => (
                <div key={i} className="flex gap-6 items-start group/benefit">
                  <div className="w-11 h-11 rounded-full border border-white/10 bg-white/5 flex items-center justify-center flex-shrink-0 group-hover/benefit:border-british-blue/40 group-hover/benefit:bg-white/10 transition-all duration-300">
                    {benefit.icon}
                  </div>
                  <div>
                    <h4 className="text-[11px] font-black uppercase tracking-widest text-zinc-100 mb-1.5 flex items-center gap-2">
                      {benefit.title}
                      {benefit.title.includes("Secret") && (
                        <span className="text-[8px] bg-amber-500/10 text-amber-500 border border-amber-500/20 px-2 py-0.5 rounded uppercase font-mono tracking-widest">
                          Exclusive
                        </span>
                      )}
                    </h4>
                    <p className="text-xs text-zinc-400 leading-relaxed font-sans">{benefit.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-white/5 flex items-center justify-between text-zinc-500 font-mono text-[9px] tracking-widest uppercase">
              <span>British Council Co-Op</span>
              <span>Est. 2012</span>
            </div>
          </div>
        </div>
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
  bookings = [],
  setBookings,
}: AdminUIProps) => {
  const [activeTab, setActiveTab] = useState<'movies' | 'food' | 'prices' | 'users'>('movies');
  const [userSearch, setUserSearch] = useState('');
  const [selectedUserForAppeal, setSelectedUserForAppeal] = useState<FestivalUser | null>(null);
  const [appealResponseText, setAppealResponseText] = useState('');
  const [updateTrigger, setUpdateTrigger] = useState(0);

  // States for security key visibility, in-app safe deletion modals, and custom promoted administrators
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});
  const [showAdminPasswords, setShowAdminPasswords] = useState<Record<string, boolean>>({});
  const [deletingUserEmail, setDeletingUserEmail] = useState<string | null>(null);
  const [deletingAdminEmail, setDeletingAdminEmail] = useState<string | null>(null);
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminPass, setNewAdminPass] = useState('');
  const [adminError, setAdminError] = useState('');

  const getUsers = (): Record<string, FestivalUser> => {
    const saved = localStorage.getItem('festival_users');
    return saved ? JSON.parse(saved) : {};
  };

  const getAdmins = (): Record<string, string> => {
    const saved = localStorage.getItem('festival_admins');
    return saved ? JSON.parse(saved) : {};
  };

  const promoteAdmin = (email: string, password: string) => {
    if (!email || !password) return;
    const admins = getAdmins();
    admins[email] = password;
    localStorage.setItem('festival_admins', JSON.stringify(admins));
    setNewAdminEmail('');
    setNewAdminPass('');
    setAdminError('');
    setUpdateTrigger(prev => prev + 1);
  };

  const deleteAdmin = (email: string) => {
    if (email === 'admin@festival.com') return;
    const admins = getAdmins();
    delete admins[email];
    localStorage.setItem('festival_admins', JSON.stringify(admins));
    setDeletingAdminEmail(null);
    setUpdateTrigger(prev => prev + 1);
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
    const users = getUsers();
    delete users[email];
    localStorage.setItem('festival_users', JSON.stringify(users));
    setDeletingUserEmail(null);
    setUpdateTrigger(prev => prev + 1);
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

            <section className="mb-16">
              <h3 className="text-[11px] font-black uppercase tracking-[0.5em] text-zinc-400 mb-12 uppercase font-black tracking-widest leading-none text-left">Active Archive</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {movies.filter(m => !m.isRemoved).map(movie => (
                  <div key={movie.id} className="group relative aspect-[2/3] overflow-hidden bg-zinc-100 grayscale hover:grayscale-0 transition-all duration-700 rounded-sm">
                    <img src={movie.imageUrl} className="w-full h-full object-cover opacity-40 group-hover:opacity-100 transition-opacity" referrerPolicy="no-referrer" />
                    <div className="absolute inset-0 bg-zinc-900/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-md translate-y-full group-hover:translate-y-0 transition-transform z-10 flex flex-col gap-2">
                       <p className="text-[10px] font-black uppercase text-zinc-900 tracking-widest truncate leading-none mb-1 text-left">{movie.title}</p>
                       <p className="text-[8px] font-black uppercase text-british-blue tracking-widest leading-none mb-2 text-left">Archive ID: {movie.id.includes('-') ? movie.id.split('-')[1] : movie.id}</p>
                       <button 
                         onClick={() => {
                           setMovies(prev => prev.map(m => m.id === movie.id ? { ...m, isRemoved: true } : m));
                         }}
                         className="w-full py-2 bg-british-red text-white text-[8px] font-black uppercase tracking-widest hover:bg-black transition-all"
                       >
                         Delete Movie
                       </button>
                    </div>
                  </div>
                ))}
                {movies.filter(m => !m.isRemoved).length === 0 && (
                  <p className="text-zinc-400 text-xs font-serif italic py-8 text-left col-span-full">No active films in the registry.</p>
                )}
              </div>
            </section>

            <section>
              <h3 className="text-[11px] font-black uppercase tracking-[0.5em] text-british-red mb-12 uppercase font-black tracking-widest leading-none text-left">Decommissioned Archive</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {movies.filter(m => m.isRemoved).map(movie => (
                  <div key={movie.id} className="group relative aspect-[2/3] overflow-hidden bg-zinc-100 grayscale opacity-60 rounded-sm border border-british-red/20">
                    <img src={movie.imageUrl} className="w-full h-full object-cover opacity-30" referrerPolicy="no-referrer" />
                    <div className="absolute inset-0 bg-red-950/10" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-md z-10 flex flex-col gap-2">
                       <p className="text-[10px] font-black uppercase text-zinc-900 tracking-widest truncate leading-none mb-1 text-left">{movie.title}</p>
                       <p className="text-[8px] font-black uppercase text-british-red tracking-widest leading-none mb-2 text-left">Decommissioned</p>
                       <button 
                         onClick={() => {
                           setMovies(prev => prev.map(m => m.id === movie.id ? { ...m, isRemoved: false } : m));
                         }}
                         className="w-full py-2 bg-british-blue text-white text-[8px] font-black uppercase tracking-widest hover:bg-black transition-all"
                       >
                         Restore Movie
                       </button>
                    </div>
                  </div>
                ))}
                {movies.filter(m => m.isRemoved).length === 0 && (
                  <p className="text-zinc-300 text-[9px] font-black uppercase tracking-widest py-8 text-left col-span-full">Decommissioned registry is clear.</p>
                )}
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

             <section className="mb-16">
               <h3 className="text-[11px] font-black uppercase tracking-[0.5em] text-zinc-400 mb-12 uppercase font-black tracking-widest leading-none text-left">Active Curated Menu</h3>
               <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-left">
                  {concessions.filter(f => !f.isRemoved).map(item => (
                    <div key={item.id} className="bg-white p-8 border border-black/5 group hover:shadow-2xl transition-all duration-700 relative text-left flex flex-col justify-between">
                      <div>
                        <div className="aspect-square overflow-hidden mb-8 bg-zinc-50 relative">
                          <img src={item.imageUrl} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all opacity-80 group-hover:opacity-100" referrerPolicy="no-referrer" />
                        </div>
                        <h4 className="font-display font-black uppercase text-xl text-zinc-900 text-left truncate">{item.name}</h4>
                        <p className="text-3xl font-display font-black italic tracking-tighter text-british-blue mt-2 text-left mb-6">Rp {item.price.toLocaleString('id-ID')}</p>
                      </div>
                      <button 
                        onClick={() => {
                          setConcessions(prev => prev.map(f => f.id === item.id ? { ...f, isRemoved: true } : f));
                        }}
                        className="w-full py-4 bg-british-red/10 border border-british-red/20 text-british-red text-[9px] font-black uppercase tracking-[0.2em] hover:bg-british-red hover:text-white transition-all text-center"
                      >
                        Delete Item
                      </button>
                    </div>
                  ))}
                  {concessions.filter(f => !f.isRemoved).length === 0 && (
                    <p className="text-zinc-400 text-xs font-serif italic py-8 text-left col-span-full">No active cuisine in the menu.</p>
                  )}
               </div>
             </section>

             <section>
               <h3 className="text-[11px] font-black uppercase tracking-[0.5em] text-british-red mb-12 uppercase font-black tracking-widest leading-none text-left">Decommissioned Selection</h3>
               <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-left">
                  {concessions.filter(f => f.isRemoved).map(item => (
                    <div key={item.id} className="bg-white p-8 border border-british-red/10 group hover:shadow-2xl transition-all duration-700 relative opacity-60 text-left flex flex-col justify-between">
                      <div>
                        <div className="aspect-square overflow-hidden mb-8 bg-zinc-50 relative">
                          <img src={item.imageUrl} className="w-full h-full object-cover grayscale opacity-30" referrerPolicy="no-referrer" />
                        </div>
                        <h4 className="font-display font-black uppercase text-xl text-zinc-500 text-left truncate">{item.name}</h4>
                        <p className="text-3xl font-display font-black italic tracking-tighter text-zinc-400 mt-2 text-left mb-6">Rp {item.price.toLocaleString('id-ID')}</p>
                      </div>
                      <button 
                        onClick={() => {
                          setConcessions(prev => prev.map(f => f.id === item.id ? { ...f, isRemoved: false } : f));
                        }}
                        className="w-full py-4 bg-british-blue text-white text-[9px] font-black uppercase tracking-[0.2em] hover:bg-black transition-all text-center"
                      >
                        Restore Choice
                      </button>
                    </div>
                  ))}
                  {concessions.filter(f => f.isRemoved).length === 0 && (
                    <p className="text-zinc-300 text-[9px] font-black uppercase tracking-widest py-8 text-left col-span-full">No de-registered menu items.</p>
                  )}
               </div>
             </section>
            </div>
         )}

         {activeTab === 'prices' && (
          <div className="space-y-16">
            <div className="max-w-4xl bg-white p-16 border border-black/5 shadow-sm text-left">
              <h3 className="text-[11px] font-black uppercase tracking-[0.5em] text-british-blue mb-16">Global Valuation</h3>
              <div className="space-y-12">
                <div>
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

            <div className="max-w-6xl bg-white p-16 border border-black/5 shadow-sm text-left">
              <h3 className="text-3xl font-display font-black uppercase italic tracking-tighter mb-4 text-zinc-900">Treasury <br /> <span className="text-british-blue">Refunding.</span></h3>
              <p className="text-zinc-300 text-[10px] font-black uppercase tracking-[0.4em] mb-12">Authorized member refund claims and liquidation cases</p>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="border-b border-black/5">
                    <tr>
                      <th className="pb-8 text-[10px] font-black uppercase tracking-[0.4em] text-zinc-300 uppercase leading-none">Claimant / Member</th>
                      <th className="pb-8 text-[10px] font-black uppercase tracking-[0.4em] text-zinc-300 uppercase leading-none">Canceled Artifact</th>
                      <th className="pb-8 text-[10px] font-black uppercase tracking-[0.4em] text-zinc-300 uppercase leading-none text-center">Value (Rp/Qty)</th>
                      <th className="pb-8 text-[10px] font-black uppercase tracking-[0.4em] text-zinc-300 uppercase leading-none text-center">Protocol Status</th>
                      <th className="pb-8 text-[10px] font-black uppercase tracking-[0.4em] text-zinc-300 uppercase leading-none text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/5">
                    {bookings
                      .filter(b => b.refundStatus === 'requested' || b.refundStatus === 'refunded')
                      .map(booking => {
                        return (
                          <tr key={booking.id} className="group hover:bg-zinc-50 transition-colors">
                            <td className="py-8">
                              <span className="font-mono text-sm tracking-wider text-zinc-900 block">{booking.email || 'Anonymous Guest'}</span>
                              <span className="font-mono text-[9px] text-zinc-300">Ticket Ref: #{booking.id.split('-')[1] || booking.id.split('-')[0]}</span>
                            </td>
                            <td className="py-8">
                              <span className="font-sans font-bold text-sm text-zinc-900 block">{booking.title}</span>
                              <span className="text-[10px] text-zinc-400 font-serif italic">{booking.location}</span>
                            </td>
                            <td className="py-8 text-center">
                              <span className="font-display font-black text-sm block">Rp {booking.price.toLocaleString('id-ID')}</span>
                              <span className="font-mono text-[10px] text-zinc-400">Qty: {booking.quantity}</span>
                            </td>
                            <td className="py-8 text-center text-[10px] uppercase font-black tracking-widest whitespace-nowrap">
                              {booking.refundStatus === 'requested' ? (
                                <span className="text-amber-600 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-sm font-black">PENDING UNION AUDIT</span>
                              ) : (
                                <span className="text-green-600 bg-green-500/10 border border-green-500/20 px-2.5 py-1 rounded-sm font-black">LIQUIDATED / DISBURSED</span>
                              )}
                            </td>
                            <td className="py-8 text-right pr-4">
                              {booking.refundStatus === 'requested' && setBookings && (
                                <button
                                  onClick={() => {
                                    setBookings(prev => prev.map(b => b.id === booking.id ? { ...b, refundStatus: 'refunded' } : b));
                                  }}
                                  className="bg-british-blue text-white text-[9px] font-black uppercase px-4 py-2 hover:bg-black transition-all shadow-md tracking-wider whitespace-nowrap"
                                >
                                  Disburse Refund
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    {bookings.filter(b => b.refundStatus === 'requested' || b.refundStatus === 'refunded').length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-12 text-center text-zinc-400 font-serif italic text-xs leading-relaxed">
                          No refund protocol requests are currently on file with the Treasury.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (() => {
          const adminsObj = getAdmins();
          const adminList = [
            { email: 'admin@festival.com', isDefault: true, password: 'admin123' },
            ...Object.entries(adminsObj).map(([email, password]) => ({
              email,
              isDefault: false,
              password
            }))
          ];

          // Filter out other administrators from normal membership listing
          const filteredSortedUsers = sortedUsers.filter(u => !adminsObj[u.email]);

          return (
            <div className="space-y-16">
              {/* SECTION 1: Command Registry (Administrators and Promotion Form) */}
              <section className="bg-white p-12 border border-black/5 shadow-sm text-left">
                <div className="mb-12">
                   <h3 className="text-3xl font-display font-black uppercase italic tracking-tighter mb-4 text-zinc-900">Command <br /> <span className="text-british-blue">Registry.</span></h3>
                   <p className="text-zinc-300 text-[10px] font-black uppercase tracking-[0.4em]">Administrative supervisors and protocol officials</p>
                </div>

                {/* Form to promote a new administrator */}
                <div className="border border-black/5 bg-zinc-50 p-10 mb-12 text-left">
                  <div className="max-w-xl">
                    <h4 className="text-[11px] font-black uppercase tracking-[0.5em] text-british-blue mb-4">Promote Command Official</h4>
                    <p className="text-zinc-400 text-xs font-serif italic mb-8">Grant complete protocol commands, registry logistics oversight, and directory overrides to another trusted email credentials set.</p>
                    
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      if (!newAdminEmail || !newAdminPass) return;
                      
                      if (newAdminEmail === 'admin@festival.com') {
                        setAdminError('Default admin account always exists.');
                        return;
                      }
                      const usersObj = getUsers();
                      if (usersObj[newAdminEmail]) {
                        setAdminError('This email is already registered as a Fellowship member with user credentials.');
                        return;
                      }
                      if (adminsObj[newAdminEmail]) {
                        setAdminError('This email has already been promoted to administrator.');
                        return;
                      }
                      
                      promoteAdmin(newAdminEmail, newAdminPass);
                    }} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="block text-[8px] font-black uppercase tracking-[0.3em] text-zinc-300">Admin Identifier</label>
                          <input 
                            type="email" 
                            required
                            placeholder="e.g. general@festival.com" 
                            value={newAdminEmail}
                            onChange={e => setNewAdminEmail(e.target.value)}
                            className="w-full bg-white border border-black/5 p-4 font-mono text-xs outline-none focus:border-british-blue text-zinc-900"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-[8px] font-black uppercase tracking-[0.3em] text-zinc-300">Security Key (Password)</label>
                          <input 
                            type="text" 
                            required
                            placeholder="e.g. CommandKey2026!" 
                            value={newAdminPass}
                            onChange={e => setNewAdminPass(e.target.value)}
                            className="w-full bg-white border border-black/5 p-4 font-mono text-xs outline-none focus:border-british-blue text-zinc-900"
                          />
                        </div>
                      </div>
                      {adminError && (
                        <p className="text-british-red text-[10px] font-black uppercase tracking-wider">{adminError}</p>
                      )}
                      <button 
                        type="submit"
                        className="px-6 py-4 bg-british-blue text-white text-[9px] font-black uppercase tracking-[0.3em] hover:bg-black transition-all shadow-md"
                      >
                        Approve Admin Promotion
                      </button>
                    </form>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="border-b border-black/5">
                      <tr>
                        <th className="pb-8 text-[10px] font-black uppercase tracking-[0.4em] text-zinc-300 uppercase font-black tracking-widest leading-none">Administrator</th>
                        <th className="pb-8 text-[10px] font-black uppercase tracking-[0.4em] text-zinc-300 uppercase font-black tracking-widest leading-none">Security Key (Password)</th>
                        <th className="pb-8 text-[10px] font-black uppercase tracking-[0.4em] text-zinc-300 uppercase font-black tracking-widest leading-none text-center">Rank</th>
                        <th className="pb-8 text-[10px] font-black uppercase tracking-[0.4em] text-zinc-300 uppercase font-black tracking-widest leading-none text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black/5">
                      {adminList.map(admin => (
                        <tr key={admin.email} className="group hover:bg-zinc-50 transition-colors">
                          <td className="py-8">
                            <span className="font-mono text-sm tracking-wider text-zinc-900">{admin.email}</span>
                          </td>
                          <td className="py-8 text-left">
                            <div className="flex items-center gap-3 font-mono text-sm text-zinc-900 bg-zinc-50 border border-black/5 px-4 py-2 rounded-sm w-fit">
                              <span className="tracking-wider">{showAdminPasswords[admin.email] ? admin.password : '••••••••'}</span>
                              <button 
                                onClick={() => setShowAdminPasswords(prev => ({ ...prev, [admin.email]: !prev[admin.email] }))}
                                className="text-zinc-400 hover:text-british-blue focus:outline-none"
                              >
                                {showAdminPasswords[admin.email] ? <EyeOff size={14} /> : <Eye size={14} />}
                              </button>
                            </div>
                          </td>
                          <td className="py-8 text-center text-[10px] uppercase font-black tracking-widest">
                            {admin.isDefault ? (
                              <span className="text-amber-600 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-sm">Primary Command</span>
                            ) : (
                              <span className="text-zinc-500 bg-zinc-100 border border-black/5 px-2.5 py-1 rounded-sm">Promoted Command</span>
                            )}
                          </td>
                          <td className="py-8 text-right pr-4">
                             {!admin.isDefault && (
                               <button 
                                 onClick={() => setDeletingAdminEmail(admin.email)} 
                                 className="text-zinc-300 hover:text-british-red transition-colors opacity-40 group-hover:opacity-100"
                               >
                                 <Trash2 size={20} />
                               </button>
                             )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* SECTION 2: Fellowship Registry (Standard Members and Search) */}
              <section className="bg-white p-12 border border-black/5 shadow-sm text-left">
                 <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-12 mb-16">
                    <div className="text-left">
                      <h3 className="text-3xl font-display font-black uppercase italic tracking-tighter mb-4 text-zinc-900">Fellowship <br /> <span className="text-british-blue">Registry.</span></h3>
                      <p className="text-zinc-300 text-[10px] font-black uppercase tracking-[0.4em]">Protocol verification and membership access logs</p>
                    </div>
                    <div className="relative w-full md:w-96 text-left">
                      <input 
                        type="text" 
                        placeholder="Search member credentials..." 
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
                         <th className="pb-8 text-[10px] font-black uppercase tracking-[0.4em] text-zinc-300 uppercase font-black tracking-widest leading-none">Security Key (Password)</th>
                         <th className="pb-8 text-[10px] font-black uppercase tracking-[0.4em] text-zinc-300 uppercase font-black tracking-widest leading-none text-center">Status</th>
                         <th className="pb-8 text-[10px] font-black uppercase tracking-[0.4em] text-zinc-300 uppercase font-black tracking-widest leading-none text-center">Protocol</th>
                         <th className="pb-8 text-[10px] font-black uppercase tracking-[0.4em] text-zinc-300 uppercase font-black tracking-widest leading-none text-right">Actions</th>
                       </tr>
                     </thead>
                     <tbody className="divide-y divide-black/5">
                       <AnimatePresence mode="popLayout">
                         {filteredSortedUsers.map(user => (
                           <motion.tr layout key={user.email} className="group hover:bg-zinc-50 transition-colors">
                             <td className="py-8">
                               <span className="font-mono text-sm tracking-wider text-zinc-900">{user.email}</span>
                             </td>
                             <td className="py-8 text-left">
                               <div className="flex items-center gap-3 font-mono text-sm text-zinc-900 bg-zinc-50 border border-black/5 px-4 py-2 rounded-sm w-fit">
                                 <span className="tracking-wider">{showPasswords[user.email] ? user.password : '••••••••'}</span>
                                 <button 
                                   onClick={() => setShowPasswords(prev => ({ ...prev, [user.email]: !prev[user.email] }))}
                                   className="text-zinc-400 hover:text-british-blue focus:outline-none"
                                 >
                                   {showPasswords[user.email] ? <EyeOff size={14} /> : <Eye size={14} />}
                                 </button>
                               </div>
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
                                    <button onClick={() => setDeletingUserEmail(user.email)} className="text-zinc-300 hover:text-british-red transition-colors"><Trash2 size={20} /></button>
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
          );
        })()}
      </div>

      {/* Dynamic Overlay Deletion Confirmation for Users */}
      <AnimatePresence>
        {deletingUserEmail && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-8">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDeletingUserEmail(null)} className="absolute inset-0 bg-black/65 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-md bg-white border border-black/5 p-16 shadow-4xl overflow-hidden z-[125] text-left">
              <div className="flex items-center gap-4 text-british-red mb-6">
                <AlertTriangle className="text-british-red" size={32} />
                <h3 className="font-display font-black uppercase text-xl text-zinc-950 tracking-tight leading-none">Confirm Excision</h3>
              </div>
              <p className="text-zinc-500 font-serif italic text-sm mb-8 leading-relaxed">
                Are you absolutely sure you want to completely de-register and delete the account <strong className="text-zinc-900 font-sans font-bold">{deletingUserEmail}</strong>? This action will permanently wipe their credentials and access logs.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => setDeletingUserEmail(null)}
                  className="bg-zinc-100 text-zinc-400 py-4 font-black uppercase tracking-[0.2em] text-[10px] hover:text-zinc-900 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => deleteUser(deletingUserEmail)}
                  className="bg-british-red text-white py-4 font-black uppercase tracking-[0.2em] text-[10px] hover:bg-black transition-all shadow-md"
                >
                  Confirm Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Dynamic Overlay Deletion Confirmation for Admins */}
      <AnimatePresence>
        {deletingAdminEmail && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-8">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDeletingAdminEmail(null)} className="absolute inset-0 bg-black/65 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-md bg-white border border-black/5 p-16 shadow-4xl overflow-hidden z-[125] text-left">
              <div className="flex items-center gap-4 text-british-red mb-6">
                <AlertTriangle className="text-british-red" size={32} />
                <h3 className="font-display font-black uppercase text-xl text-zinc-950 tracking-tight leading-none">Revoke Command</h3>
              </div>
              <p className="text-zinc-500 font-serif italic text-sm mb-8 leading-relaxed">
                Do you want to revoke administrative permissions for <strong className="text-zinc-900 font-sans font-bold">{deletingAdminEmail}</strong>? They will immediately lose command control access.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => setDeletingAdminEmail(null)}
                  className="bg-zinc-100 text-zinc-400 py-4 font-black uppercase tracking-[0.2em] text-[10px] hover:text-zinc-900 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => deleteAdmin(deletingAdminEmail)}
                  className="bg-british-red text-white py-4 font-black uppercase tracking-[0.2em] text-[10px] hover:bg-black transition-all shadow-md"
                >
                  Revoke Admin
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
