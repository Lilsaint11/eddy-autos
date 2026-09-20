import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../context/AuthContext';
import { useCars } from '../context/CarsContext';
import { 
  Plus, Edit2, Trash2, Search, Filter, ShieldAlert, LogOut, 
  DollarSign, Car, BarChart3, Gauge, Settings, ShieldCheck, 
  X, Check, AlertCircle, Info, RefreshCw,Fuel,TruckElectric
} from 'lucide-react';

const PRESET_IMAGES = [
  { label: 'BMW 5 Series (Sophisto Grey)', value: '/images/bmw1.jpg' },
  { label: 'Tesla Model 3 (Pearl White)', value: '/images/tesla1.jpg' },
  { label: 'Toyota Camry (Celestial Silver)', value: '/images/camry1.jpg' },
  { label: 'Honda Civic (Rallye Red)', value: '/images/Honda1.jpg' },
  { label: 'Mercedes-Benz C-Class (Obsidian Black)', value: '/images/benz1.jpg' },
  { label: 'Hyundai Ioniq 5 (Cyber Grey)', value: '/images/hyundai1.jpg' }
];

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

const getImageUrl = (imagePath) => {
  if (!imagePath) return 'https://placehold.co/400x250/111/fff?text=No+Image';
  if (imagePath.startsWith('blob:')) return imagePath;
  if (imagePath.startsWith('/uploads/')) return `${API_URL}${imagePath}`;
  return imagePath;
};

const AdminDashboard = () => {
  const { isSignedIn, user, signOut, isClerkEnabled, isLoaded } = useAdminAuth();
  const { cars, addCar, updateCar, deleteCar } = useCars();
  const navigate = useNavigate();

  // Redirect to login if not signed in
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      navigate('/admin/login');
    }
  }, [isSignedIn, isLoaded, navigate]);

  // States
  const [searchTerm, setSearchTerm] = useState('');
  const [fuelFilter, setFuelFilter] = useState('');
  const [badgeFilter, setBadgeFilter] = useState('');
  
  // Modals state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);
  
  // Notification Toast state
  const [toast, setToast] = useState(null);

  // Form states
  const initialFormState = {
    name: '',
    year: new Date().getFullYear(),
    price: '',
    miles: '',
    fuelType: 'Petrol',
    transmission: 'Automatic',
    badge: '',
    image: '',
    imageFiles: [],
    imagePreviews: [],
    description: '',
    engine: '',
    power: '',
    color: '',
    drive: ''
  };
  const [form, setForm] = useState(initialFormState);

  // Trigger Toast
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-red-500 border-r-2"></div>
      </div>
    );
  }

  if (!isSignedIn) {
    return null; // Redirecting via useEffect
  }

  // Dashboard Stats Calculations
  const totalCars = cars.length;
  const totalValue = cars.reduce((acc, car) => {
  const numericPrice = Number(car.price) || 0;
  return acc + numericPrice;
}, 0);

console.log('Total Value of Inventory:', totalValue);
  const avgPrice = totalCars > 0 ? Math.round(totalValue / totalCars) : 0;
  
  const electricCount = cars.filter(c => c.fuelType === 'Electric').length;
  const petrolCount = cars.filter(c => c.fuelType === 'Petrol').length;
  const autoCount = cars.filter(c => c.transmission === 'Automatic').length;
  const manualCount = cars.filter(c => c.transmission === 'Manual').length;

  // Filter cars list
  const filteredCars = cars.filter(car => {
    const matchesSearch = car.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (car.description && car.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFuel = fuelFilter ? car.fuelType === fuelFilter : true;
    const matchesBadge = badgeFilter ? car.badge === badgeFilter : true;
    return matchesSearch && matchesFuel && matchesBadge;
  });

  // Modal actions
  const openAddModal = () => {
    setForm(initialFormState);
    setIsAddOpen(true);
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.year) {
      showToast('Please fill in required fields (Name, Price, Year)', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('year', form.year);
    formData.append('price', form.price);
    formData.append('miles', form.miles || '0 miles');
    formData.append('fuelType', form.fuelType);
    formData.append('transmission', form.transmission);
    if (form.badge) formData.append('badge', form.badge);
    formData.append('description', form.description || 'No description provided.');
    formData.append('engine', form.engine || 'Standard Engine');
    formData.append('power', form.power || 'N/A');
    formData.append('color', form.color || 'N/A');
    formData.append('drive', form.drive || 'N/A');

    if (form.imageFiles && form.imageFiles.length > 0) {
      form.imageFiles.forEach(file => {
        formData.append('imageFiles', file);
      });
    }

    console.log("NEW CAR BEING SENT");
    addCar(formData);
    setIsAddOpen(false);
    showToast(`Successfully added ${form.name}!`);
  };

  const openEditModal = (car) => {
    setSelectedCar(car);
    setForm({
      name: car.name,
      year: car.year,
      price: car.price,
      miles: car.miles,
      fuelType: car.fuelType,
      transmission: car.transmission,
      badge: car.badge || '',
      image: car.image,
      imageFiles: [],
      imagePreviews: car.gallery && car.gallery.length > 0 ? car.gallery : (car.image ? [car.image] : []),
      description: car.description || '',
      engine: car.engine || '',
      power: car.power || '',
      color: car.color || '',
      drive: car.drive || ''
    });
    setIsEditOpen(true);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.year) {
      showToast('Please fill in required fields (Name, Price, Year)', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('year', form.year);
    formData.append('price', form.price);
    formData.append('miles', form.miles || '0 miles');
    formData.append('fuelType', form.fuelType);
    formData.append('transmission', form.transmission);
    if (form.badge) formData.append('badge', form.badge);
    formData.append('description', form.description || 'No description provided.');
    formData.append('engine', form.engine || 'Standard Engine');
    formData.append('power', form.power || 'N/A');
    formData.append('color', form.color || 'N/A');
    formData.append('drive', form.drive || 'N/A');

    if (form.imageFiles && form.imageFiles.length > 0) {
      form.imageFiles.forEach(file => {
        formData.append('imageFiles', file);
      });
    }

    updateCar(selectedCar.id, formData);
    setIsEditOpen(false);
    showToast(`Successfully updated ${form.name}!`);
  };

  const openDeleteModal = (car) => {
    setSelectedCar(car);
    setIsDeleteOpen(true);
  };

  const handleDeleteConfirm = () => {
    deleteCar(selectedCar.id);
    setIsDeleteOpen(false);
    showToast(`Deleted ${selectedCar.name} successfully.`, 'warning');
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans flex flex-col">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl border backdrop-blur-md shadow-2xl transition-all animate-bounce ${
          toast.type === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-400' :
          toast.type === 'warning' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' :
          'bg-green-500/10 border-green-500/20 text-green-400'
        }`}>
          {toast.type === 'error' ? <AlertCircle size={18} /> : 
           toast.type === 'warning' ? <ShieldAlert size={18} /> : <Check size={18} />}
          <span className="text-xs font-bold uppercase tracking-widest">{toast.message}</span>
        </div>
      )}

      {/* Admin Navbar */}
      <header className="border-b border-white/5 bg-zinc-900/40 backdrop-blur-md sticky top-0 z-40 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-6">
          <img src="/images/eddy1.png" alt="Eddy Autos" className="w-24 cursor-pointer" onClick={() => navigate('/')} />
          <div className="h-4 w-px bg-white/10 hidden sm:block"></div>
          <span className="text-xs font-black tracking-widest uppercase text-zinc-400 hidden sm:block">
            Dashboard Portal
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 bg-white/5 border border-white/5 px-3 py-1.5 rounded-full">
            {user?.imageUrl ? (
              <img src={user.imageUrl} alt={user.name} className="w-6 h-6 rounded-full" />
            ) : (
              <div className="w-6 h-6 rounded-full bg-red-500/25 flex items-center justify-center text-[10px] font-bold text-red-400 uppercase">
                {user?.name?.charAt(0) || 'A'}
              </div>
            )}
            <span className="text-[11px] font-bold text-zinc-300 hidden md:block">
              {user?.name || 'Admin'}
            </span>
          </div>

          <button 
            onClick={() => signOut()}
            className="flex items-center gap-2 text-zinc-400 hover:text-red-500 transition-colors duration-300 text-xs font-bold uppercase tracking-widest cursor-pointer px-3 py-2 rounded-xl bg-white/5 hover:bg-red-500/10 border border-white/5 hover:border-red-500/20"
          >
            <LogOut size={14} />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Panel Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-10 space-y-8">
        
        {/* Mock Auth Mode Warning */}
        {!isClerkEnabled && (
          <div className="bg-amber-500/10 border border-amber-500/10 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex gap-3 items-start md:items-center">
              <ShieldAlert size={20} className="text-amber-500 shrink-0" />
              <p className="text-xs text-zinc-300 leading-relaxed">
                <strong className="text-amber-500">Notice:</strong> Running in <strong>Mock Developer Mode</strong>. Live Clerk authentication is disabled. Set <code className="bg-black/50 px-1.5 py-0.5 rounded text-red-400">VITE_CLERK_PUBLISHABLE_KEY</code> in your environment to run in Clerk production.
              </p>
            </div>
            <button 
              onClick={() => showToast('To enable, add the key in root .env file.', 'info')}
              className="text-[10px] uppercase font-bold tracking-widest text-amber-500 hover:text-amber-400 border border-amber-500/20 hover:border-amber-500/40 px-3.5 py-1.5 rounded-lg shrink-0 self-start md:self-auto"
            >
              How to configure?
            </button>
          </div>
        )}

        {/* Dashboard Title & Quick Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white">
              Inventory <span className="text-red-500">Control</span>
            </h1>
            <p className="text-zinc-500 text-xs mt-1">
              Add new vehicles, edit specifications, or delete current listings.
            </p>
          </div>
          <button 
            onClick={openAddModal}
            className="inline-flex items-center gap-2 bg-red-650 hover:bg-red-750 text-white text-xs font-black uppercase tracking-widest px-6 py-4 rounded-xl shadow-lg hover:shadow-red-900/20 active:scale-95 transition-all self-start sm:self-auto cursor-pointer"
          >
            <Plus size={16} />
            Add New Car
          </button>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-zinc-900/30 border border-white/5 p-6 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Total Cars</span>
              <p className="text-3xl font-black text-white mt-1">{totalCars}</p>
            </div>
            <div className="p-3 bg-red-500/10 rounded-2xl text-red-500">
              <Car size={24} />
            </div>
          </div>

          <div className="bg-zinc-900/30 border border-white/5 p-6 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Value of Inventory</span>
              <p className="text-3xl font-black text-white mt-1">${totalValue.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-red-500/10 rounded-2xl text-red-500">
              <DollarSign size={24} />
            </div>
          </div>

          <div className="bg-zinc-900/30 border border-white/5 p-6 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Average price</span>
              <p className="text-3xl font-black text-white mt-1">${avgPrice.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-red-500/10 rounded-2xl text-red-500">
              <BarChart3 size={24} />
            </div>
          </div>

          <div className="bg-zinc-900/30 border border-white/5 p-6 rounded-2xl flex flex-col justify-between h-full min-h-[100px]">
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">Engine System Split</span>
            <div className="flex justify-between items-center gap-3">
              <div>
                <span className="text-zinc-500 text-[9px] uppercase font-bold block">Petrol</span>
                <span className="text-white font-bold text-sm flex items-center gap-2"><Fuel className="w-4" /> {petrolCount} cars</span>
              </div>
              <div className="h-8 w-px bg-white/10"></div>
              <div>
                <span className="text-zinc-500 text-[9px] uppercase font-bold block">Electric</span>
                <span className="text-white font-bold text-sm flex items-center gap-2"><TruckElectric className="w-4" /> {electricCount} cars</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and List */}
        <div className="bg-zinc-900/10 border border-white/5 rounded-3xl overflow-hidden shadow-xl">
          
          {/* Table Toolbar */}
          <div className="p-6 border-b border-white/5 flex flex-col md:flex-row gap-4 items-center justify-between bg-zinc-900/20">
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-500 pointer-events-none">
                <Search size={16} />
              </span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search inventory by title..."
                className="w-full bg-zinc-950 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/20 transition-all placeholder-zinc-500"
              />
            </div>

            {/* Select Dropdowns */}
            <div className="flex gap-4 w-full md:w-auto">
              <div className="relative flex-1 md:flex-none">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-500 pointer-events-none">
                  <Filter size={12} />
                </span>
                <select
                  value={fuelFilter}
                  onChange={(e) => setFuelFilter(e.target.value)}
                  className="w-full bg-zinc-950 border border-white/10 rounded-xl py-2.5 pl-9 pr-8 text-xs text-zinc-400 outline-none focus:border-red-500/50 appearance-none cursor-pointer"
                >
                  <option value="">All Engine Types</option>
                  <option value="Petrol">Petrol</option>
                  <option value="Electric">Electric</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>

              <div className="relative flex-1 md:flex-none">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-500 pointer-events-none">
                  <Filter size={12} />
                </span>
                <select
                  value={badgeFilter}
                  onChange={(e) => setBadgeFilter(e.target.value)}
                  className="w-full bg-zinc-950 border border-white/10 rounded-xl py-2.5 pl-9 pr-8 text-xs text-zinc-400 outline-none focus:border-red-500/50 appearance-none cursor-pointer"
                >
                  <option value="">All Badges</option>
                  <option value="Featured">Featured</option>
                  <option value="Hot Deal">Hot Deal</option>
                  <option value="Best Value">Best Value</option>
                  <option value="Premium">Premium</option>
                  <option value="New Arrival">New Arrival</option>
                </select>
              </div>
            </div>
          </div>

          {/* Cars List Table */}
          <div className="overflow-x-auto">
            {filteredCars.length === 0 ? (
              <div className="py-20 text-center text-zinc-500 flex flex-col items-center justify-center gap-3">
                <Car size={32} className="stroke-zinc-700" />
                <span className="text-xs uppercase font-bold tracking-widest">No matching cars found</span>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/5 bg-zinc-900/30 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                    <th className="py-4 px-6">Vehicle Info</th>
                    <th className="py-4 px-6">Year</th>
                    <th className="py-4 px-6">Price</th>
                    <th className="py-4 px-6">Mileage</th>
                    <th className="py-4 px-6">Specs</th>
                    <th className="py-4 px-6">Badge</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-xs text-zinc-300">
                  {filteredCars.map((car) => (
                    <tr key={car.id} className="hover:bg-white/[0.02] transition-colors duration-200">
                      <td className="py-4 px-6 flex items-center gap-4">
                        <div className="w-14 h-10 rounded-lg overflow-hidden bg-zinc-800 border border-white/5 flex items-center justify-center shrink-0">
                          <img src={getImageUrl(car.image)} alt={car.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <span className="font-bold text-white block text-sm tracking-tight hover:text-red-400 cursor-pointer transition-colors" onClick={() => navigate(`/cars/${car.id}`)}>
                            {car.name}
                          </span>
                          <span className="text-[10px] text-zinc-500 block truncate max-w-xs">{car.description}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 font-semibold text-zinc-400">{car.year}</td>
                      <td className="py-4 px-6 font-black text-white text-sm">
                        ${car.price.toLocaleString()}
                      </td>
                      <td className="py-4 px-6 text-zinc-400">{car.miles}</td>
                      <td className="py-4 px-6">
                        <div className="flex flex-col gap-1">
                          <span className="text-[9px] uppercase font-bold text-zinc-500">
                            {car.transmission} &middot; {car.fuelType}
                          </span>
                          <span className="text-[9px] font-semibold text-zinc-400 truncate max-w-[120px]">
                            {car.engine || 'N/A'}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        {car.badge ? (
                          <span className={`text-[8px] font-black uppercase tracking-wider px-2 py-1 rounded ${
                            car.badge === 'Featured' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                            car.badge === 'Hot Deal' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                            car.badge === 'Best Value' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                            'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                          }`}>
                            {car.badge}
                          </span>
                        ) : (
                          <span className="text-zinc-650">—</span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2.5">
                          <button 
                            onClick={() => openEditModal(car)}
                            className="p-2 bg-zinc-800/40 hover:bg-zinc-700/60 text-zinc-400 hover:text-white rounded-lg border border-white/5 transition-all cursor-pointer"
                            title="Edit Specification"
                          >
                            <Edit2 size={13} />
                          </button>
                          <button 
                            onClick={() => openDeleteModal(car)}
                            className="p-2 bg-zinc-800/40 hover:bg-red-500/15 text-zinc-400 hover:text-red-400 rounded-lg border border-white/5 hover:border-red-500/20 transition-all cursor-pointer"
                            title="Delete Car"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>

      {/* FOOTER BAR */}
      <footer className="py-6 border-t border-white/5 text-center text-[10px] text-zinc-650 uppercase tracking-widest font-bold">
        &copy; {new Date().getFullYear()} Eddy Autos Control Terminal. All Rights Reserved.
      </footer>

      {/* ================= ADD / EDIT MODAL ================= */}
      {(isAddOpen || isEditOpen) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="bg-zinc-900 border border-white/5 w-full max-w-2xl rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-zinc-950/40">
              <div>
                <h3 className="text-lg font-black uppercase tracking-tight">
                  {isAddOpen ? 'Add New Listing' : 'Edit Specification'}
                </h3>
                <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider mt-0.5">
                  {isAddOpen ? 'Add a luxury car to database' : `Modifying inventory card #${selectedCar?.id}`}
                </p>
              </div>
              <button 
                onClick={() => { setIsAddOpen(false); setIsEditOpen(false); }}
                className="p-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-xl cursor-pointer transition-all"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Scroll Body */}
            <form onSubmit={isAddOpen ? handleAddSubmit : handleEditSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* Row 1: Title & Year */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Car Title *</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full bg-zinc-950 border border-white/10 focus:border-red-500/50 rounded-xl py-3 px-4 text-xs outline-none transition-all"
                    placeholder="e.g. Porsche 911 Carrera"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Year *</label>
                  <input
                    type="number"
                    required
                    value={form.year}
                    onChange={(e) => setForm({ ...form, year: e.target.value })}
                    className="w-full bg-zinc-950 border border-white/10 focus:border-red-500/50 rounded-xl py-3 px-4 text-xs outline-none transition-all"
                    placeholder="e.g. 2024"
                    min="1900"
                    max={new Date().getFullYear() + 2}
                  />
                </div>
              </div>

              {/* Row 2: Price & Miles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Price (USD) *</label>
                  <input
                    type="number"
                    required
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="w-full bg-zinc-950 border border-white/10 focus:border-red-500/50 rounded-xl py-3 px-4 text-xs outline-none transition-all"
                    placeholder="e.g. 89900"
                    min="1"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Mileage (Label)</label>
                  <input
                    type="text"
                    value={form.miles}
                    onChange={(e) => setForm({ ...form, miles: e.target.value })}
                    className="w-full bg-zinc-950 border border-white/10 focus:border-red-500/50 rounded-xl py-3 px-4 text-xs outline-none transition-all"
                    placeholder="e.g. 4,200 miles"
                  />
                </div>
              </div>

              {/* Row 3: Transmission & Fuel & Badge */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Transmission</label>
                  <select
                    value={form.transmission}
                    onChange={(e) => setForm({ ...form, transmission: e.target.value })}
                    className="w-full bg-zinc-950 border border-white/10 focus:border-red-500/50 rounded-xl py-3 px-4 text-xs outline-none cursor-pointer"
                  >
                    <option value="Automatic">Automatic</option>
                    <option value="Manual">Manual</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Engine Type</label>
                  <select
                    value={form.fuelType}
                    onChange={(e) => setForm({ ...form, fuelType: e.target.value })}
                    className="w-full bg-zinc-950 border border-white/10 focus:border-red-500/50 rounded-xl py-3 px-4 text-xs outline-none cursor-pointer"
                  >
                    <option value="Petrol">Petrol</option>
                    <option value="Electric">Electric</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Diesel">Diesel</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Highlight Badge</label>
                  <select
                    value={form.badge}
                    onChange={(e) => setForm({ ...form, badge: e.target.value })}
                    className="w-full bg-zinc-950 border border-white/10 focus:border-red-500/50 rounded-xl py-3 px-4 text-xs outline-none cursor-pointer text-zinc-300"
                  >
                    <option value="">None (Standard)</option>
                    <option value="Featured">Featured</option>
                    <option value="Hot Deal">Hot Deal</option>
                    <option value="Best Value">Best Value</option>
                    <option value="Premium">Premium</option>
                    <option value="New Arrival">New Arrival</option>
                  </select>
                </div>
              </div>

              {/* Row 4: Image Selector */}
              <div className="border-t border-white/5 pt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Vehicle Image Upload</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div className="sm:col-span-3 space-y-1">
                    <label className="text-[9px] uppercase font-semibold text-zinc-500 block">Select Image from Computer</label>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => {
                        const files = Array.from(e.target.files);
                        if (files.length > 0) {
                          const newPreviews = files.map(file => URL.createObjectURL(file));
                          setForm({ 
                            ...form, 
                            imageFiles: files, 
                            imagePreviews: newPreviews 
                          });
                        }
                      }}
                      className="w-full bg-zinc-950 border border-white/10 focus:border-red-500/50 rounded-xl py-2 px-4 text-xs outline-none transition-all text-zinc-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-red-500/10 file:text-red-500 hover:file:bg-red-500/20 cursor-pointer"
                    />
                  </div>
                  <div className="w-full min-h-20 rounded-xl bg-zinc-950 border border-white/10 flex flex-wrap items-center justify-center p-2 gap-2">
                    {form.imagePreviews && form.imagePreviews.length > 0 ? (
                      form.imagePreviews.map((preview, index) => (
                        <div key={index} className="w-20 h-20 rounded-lg overflow-hidden border border-white/5 relative">
                          <img 
                            src={getImageUrl(preview)} 
                            alt={`Preview ${index}`} 
                            className="h-full w-full object-cover" 
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://placehold.co/400x250/111/fff?text=No+Image';
                            }}
                          />
                          {index === 0 && (
                            <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-[8px] text-center font-bold uppercase tracking-widest text-zinc-300 py-0.5">
                              Cover
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <span className="text-[9px] text-zinc-650 uppercase font-black tracking-widest">No Image</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Row 5: Detailed Specifications */}
              <div className="border-t border-white/5 pt-4 space-y-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">Extra Specifications</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-semibold text-zinc-500">Engine Layout</label>
                    <input
                      type="text"
                      value={form.engine}
                      onChange={(e) => setForm({ ...form, engine: e.target.value })}
                      className="w-full bg-zinc-950 border border-white/10 focus:border-red-500/50 rounded-xl py-2.5 px-3.5 text-xs outline-none"
                      placeholder="e.g. 3.0L Twin-Turbo Flat-6"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-semibold text-zinc-500">Drivetrain Power</label>
                    <input
                      type="text"
                      value={form.power}
                      onChange={(e) => setForm({ ...form, power: e.target.value })}
                      className="w-full bg-zinc-950 border border-white/10 focus:border-red-500/50 rounded-xl py-2.5 px-3.5 text-xs outline-none"
                      placeholder="e.g. 379 HP"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-semibold text-zinc-500">Paint Color</label>
                    <input
                      type="text"
                      value={form.color}
                      onChange={(e) => setForm({ ...form, color: e.target.value })}
                      className="w-full bg-zinc-950 border border-white/10 focus:border-red-500/50 rounded-xl py-2.5 px-3.5 text-xs outline-none"
                      placeholder="e.g. Guards Red"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-semibold text-zinc-500">Wheel Drive Type</label>
                    <input
                      type="text"
                      value={form.drive}
                      onChange={(e) => setForm({ ...form, drive: e.target.value })}
                      className="w-full bg-zinc-950 border border-white/10 focus:border-red-500/50 rounded-xl py-2.5 px-3.5 text-xs outline-none"
                      placeholder="e.g. RWD"
                    />
                  </div>
                </div>
              </div>

              {/* Row 6: Description */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Listing Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows="3"
                  className="w-full bg-zinc-950 border border-white/10 focus:border-red-500/50 rounded-xl py-3 px-4 text-xs outline-none transition-all resize-none text-zinc-300"
                  placeholder="Describe details, highlights, or premium features of the car..."
                />
              </div>

              {/* Modal Actions */}
              <div className="border-t border-white/5 pt-6 flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => { setIsAddOpen(false); setIsEditOpen(false); }}
                  className="bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white text-[10px] font-bold uppercase tracking-widest px-6 py-3.5 rounded-xl border border-white/5 active:scale-95 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-red-650 hover:bg-red-750 text-white text-[10px] font-black uppercase tracking-widest px-8 py-3.5 rounded-xl shadow-lg active:scale-95 transition-all cursor-pointer"
                >
                  {isAddOpen ? 'Save Listing' : 'Apply Changes'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ================= DELETE CONFIRMATION MODAL ================= */}
      {isDeleteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-zinc-900 border border-white/5 w-full max-w-md rounded-3xl shadow-2xl p-6 text-center animate-in fade-in zoom-in-95 duration-200">
            <div className="mx-auto w-12 h-12 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mb-4">
              <Trash2 size={24} />
            </div>
            <h3 className="text-base font-black uppercase tracking-tight text-white mb-2">
              Remove Listing
            </h3>
            <p className="text-zinc-400 text-xs leading-relaxed mb-6">
              Are you sure you want to permanently delete <strong className="text-white">{selectedCar?.name}</strong> from your active showroom inventory? This action is irreversible.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setIsDeleteOpen(false)}
                className="flex-1 bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white text-[10px] font-bold uppercase tracking-widest py-3.5 rounded-xl border border-white/5 active:scale-95 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 bg-red-600 hover:bg-red-750 text-white text-[10px] font-black uppercase tracking-widest py-3.5 rounded-xl shadow-lg active:scale-95 transition-all cursor-pointer"
              >
                Delete Car
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
