const { useState, useEffect, useMemo } = React;

    const PAGE_PATHS = {
      home: 'index.html',
      rooms: 'rooms.html',
      about: 'aboutus.html',
      feedback: 'feedback.html',
      contact: 'contact.html',
      admin: 'admin.html'
    };

    const navigateToPage = (page) => {
      window.location.href = PAGE_PATHS[page] || PAGE_PATHS.home;
    };

    // --- DEFAULT INITIAL DATA (Synced via localStorage) ---
    const INITIAL_ROOMS = [
      {
        id: 'room-1',
        name: 'Premium Room',
        type: 'Private Mountain View',
        price: 2499,
        originalPrice: 3200,
        capacity: '2 Adults + 1 Child',
        bed: 'King Size Bed',
        size: '320 sq.ft',
        rating: 4.9,
        reviewsCount: 42,
        image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=900&q=80',
        gallery: [
          'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=900&q=80',
          'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=900&q=80',
          'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=900&q=80'
        ],
        amenities: ['Mountain View Balcony', 'Fast 100Mbps Wi-Fi', 'Air Conditioning & Heater', 'Smart LED TV with Netflix', 'Attached Luxury Bathroom', 'Electric Kettle & Tea Kit', '24/7 Hot Geyser Water'],
        description: 'Our top-tier peaceful sanctuary with a private balcony offering breathtaking morning vistas of Tapovan hills and the whispering Ganges breeze. Perfect for couples, spiritual seekers, and remote executives.'
      },
      {
        id: 'room-2',
        name: 'Super Deluxe Room',
        type: 'Private Balcony Haven',
        price: 1999,
        originalPrice: 2600,
        capacity: '2 Guests',
        bed: 'Queen Bed',
        size: '280 sq.ft',
        rating: 4.8,
        reviewsCount: 38,
        image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=900&q=80',
        gallery: [
          'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=900&q=80',
          'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=900&q=80'
        ],
        amenities: ['Private Balcony', 'High-Speed Wi-Fi', 'Air Conditioning', 'Ensuite Bathroom', 'Work Desk & Chair', 'Daily Housekeeping', '24/7 Hot Water'],
        description: 'Spacious and tastefully furnished with minimalist Himalayan decor. Comes with a dedicated study desk for digital nomads and a serene balcony to unwind after yoga.'
      },
      {
        id: 'room-3',
        name: 'Deluxe Room',
        type: 'Cozy Rest Stay',
        price: 1499,
        originalPrice: 2000,
        capacity: '2 Guests',
        bed: 'Double Bed',
        size: '220 sq.ft',
        rating: 4.7,
        reviewsCount: 29,
        image: 'https://images.unsplash.com/photo-1595576508898-0ad5c879a061?auto=format&fit=crop&w=900&q=80',
        gallery: [
          'https://images.unsplash.com/photo-1595576508898-0ad5c879a061?auto=format&fit=crop&w=900&q=80',
          'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80'
        ],
        amenities: ['Quiet Mountain Air', 'High-Speed Wi-Fi', 'Ceiling Fan & Air Cooler', 'Attached Clean Bathroom', 'Wardrobe', '24/7 Hot Water'],
        description: 'Cozy and super quiet, tailored for light travelers, solo travelers, and spiritual pilgrims wanting pure comfort at an incredible value.'
      },
      {
        id: 'room-4',
        name: 'Shared Dormitory',
        type: 'Backpacker & Yogi Bunk',
        price: 599,
        originalPrice: 899,
        capacity: '1 Bunk Bed',
        bed: 'Single Orthopedic Bunk',
        size: 'Spacious 6-Bed Dorm',
        rating: 4.85,
        reviewsCount: 56,
        image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=900&q=80',
        gallery: [
          'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=900&q=80',
          'https://images.unsplash.com/photo-1520277739336-7bf67edfa768?auto=format&fit=crop&w=900&q=80'
        ],
        amenities: ['Personal Locker', 'Individual Bed Reading Light', 'Universal Power Socket', 'High-Speed Wi-Fi', 'Common Lounge & Cafe Access', 'Filtered RO Water'],
        description: 'Vibrant, ultra-clean social community bunk space. Meet fellow travelers from across the world, exchange yoga routines, and plan your waterfall treks.'
      }
    ];

    const INITIAL_REVIEWS = [
      {
        id: 'rev-1',
        name: 'Aarav Sharma',
        city: 'Bengaluru, India',
        rating: 5,
        room: 'Premium Room',
        date: '2 days ago',
        comment: 'Checkinn Homes is truly a peaceful gem in Tapovan! Located right near Secret Waterfall road, away from the loud horns. The Wi-Fi was rock solid for my work calls and the mountain view morning tea is unforgettable.',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
        approved: true
      },
      {
        id: 'rev-2',
        name: 'Elena Rostova',
        city: 'St. Petersburg, Russia',
        rating: 5,
        room: 'Shared Dormitory',
        date: '1 week ago',
        comment: 'Stayed 2 weeks for my 200hr Yoga Teacher Training. The bunk beds are very comfortable, lockers are safe, and the host helped arrange river rafting and bike rentals at local prices!',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
        approved: true
      },
      {
        id: 'rev-3',
        name: 'Rohan & Kritika Mehta',
        city: 'Delhi NCR',
        rating: 5,
        room: 'Super Deluxe Room',
        date: '2 weeks ago',
        comment: 'Cleanest rooms in Upper Tapovan at this budget. Kundan restaurant and amazing cafes are just a 3-minute stroll away. The host hospitality made us feel like family.',
        avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80',
        approved: true
      }
    ];

    const INITIAL_BOOKINGS = [
      {
        id: 'CIH-7821',
        guestName: 'Vikram Malhotra',
        email: 'vikram.m@gmail.com',
        phone: '+91 98765 43210',
        roomName: 'Premium Room',
        checkIn: '2025-04-10',
        checkOut: '2025-04-14',
        guests: 2,
        totalAmount: 9996,
        status: 'Confirmed',
        paymentMode: 'Pay at Stay',
        notes: 'Early check-in around 11:00 AM requested'
      },
      {
        id: 'CIH-7822',
        guestName: 'Sophie Turner',
        email: 'sophie.travels@yahoo.com',
        phone: '+44 7911 123456',
        roomName: 'Shared Dormitory',
        checkIn: '2025-04-12',
        checkOut: '2025-04-19',
        guests: 1,
        totalAmount: 4193,
        status: 'Confirmed',
        paymentMode: 'Hostinger Gateway (UPI/Card)',
        notes: 'Needs bike rental on arrival'
      }
    ];

    const INITIAL_QUERIES = [
      {
        id: 'qry-1',
        name: 'Pooja Verma',
        email: 'pooja.v@outlook.com',
        phone: '+91 91234 56789',
        subject: 'Group Booking for 10 Yogis',
        message: 'Hi team, we are planning a 5-day retreat in May. Can we book the full floor with breakfast arrangements?',
        date: 'Yesterday at 4:30 PM',
        status: 'New'
      },
      {
        id: 'qry-2',
        name: 'David Miller',
        email: 'david.m@gmail.com',
        phone: '+1 415 555 0199',
        subject: 'Taxi Pickup from Dehradun Airport (DED)',
        message: 'Can you arrange a verified cab to pick us up from Jolly Grant airport on April 15th?',
        date: '3 days ago',
        status: 'Resolved'
      }
    ];

    // --- MAIN REACT APPLICATION COMPONENT ---
    function App() {
      // Navigation state
      const currentPage = document.body.dataset.page || 'home';
      const setCurrentPage = navigateToPage;
      const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

      // Core Dynamic Data with LocalStorage Persistence
      const [rooms, setRooms] = useState(() => {
        const saved = localStorage.getItem('cih_rooms');
        return saved ? JSON.parse(saved) : INITIAL_ROOMS;
      });

      const [bookings, setBookings] = useState(() => {
        const saved = localStorage.getItem('cih_bookings');
        return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
      });

      const [queries, setQueries] = useState(() => {
        const saved = localStorage.getItem('cih_queries');
        return saved ? JSON.parse(saved) : INITIAL_QUERIES;
      });

      const [reviews, setReviews] = useState(() => {
        const saved = localStorage.getItem('cih_reviews');
        return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
      });

      // Hotel Profile Settings
      const [hotelConfig, setHotelConfig] = useState(() => {
        const saved = localStorage.getItem('cih_config');
        return saved ? JSON.parse(saved) : {
          name: 'Checkinn Homes',
          tagline: 'Your trusted stay partner in Rishikesh',
          location: 'Check inn homes, Secret Waterfall Rd, near Kundan Restaurant, Upper Tapovan, Rishikesh, Uttarakhand 249192',
          phone: '+91 82793 09665',
          email: 'checkinnhomes@gmail.com',
          whatsapp: '+918279309665',
          checkInTime: '12:00 PM',
          checkOutTime: '11:00 AM',
          wifiSpeed: '100 Mbps Fibre',
          dbHost: 'sqlXXX.hostinger.com',
          dbName: 'u123456789_checkinndb',
          dbUser: 'u123456789_admin',
        };
      });

      // Sync state to localstorage
      useEffect(() => { localStorage.setItem('cih_rooms', JSON.stringify(rooms)); }, [rooms]);
      useEffect(() => { localStorage.setItem('cih_bookings', JSON.stringify(bookings)); }, [bookings]);
      useEffect(() => { localStorage.setItem('cih_queries', JSON.stringify(queries)); }, [queries]);
      useEffect(() => { localStorage.setItem('cih_reviews', JSON.stringify(reviews)); }, [reviews]);
      useEffect(() => { localStorage.setItem('cih_config', JSON.stringify(hotelConfig)); }, [hotelConfig]);

      // Booking Engine Modal State
      const [bookingModalOpen, setBookingModalOpen] = useState(false);
      const [selectedRoomForBooking, setSelectedRoomForBooking] = useState(null);
      const [quickBookForm, setQuickBookForm] = useState({
        checkIn: new Date().toISOString().split('T')[0],
        checkOut: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
        guests: 2,
        roomId: rooms[0]?.id || 'room-1'
      });

      // Room Details Quick View Modal
      const [viewingRoom, setViewingRoom] = useState(null);

      // Notification Toast
      const [toast, setToast] = useState(null);
      const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 4000);
      };

      // Helper function to trigger booking modal
      const openBookingEngine = (room = null) => {
        if (room) {
          setSelectedRoomForBooking(room);
          setQuickBookForm(prev => ({ ...prev, roomId: room.id }));
        } else {
          setSelectedRoomForBooking(rooms[0]);
          setQuickBookForm(prev => ({ ...prev, roomId: rooms[0].id }));
        }
        setBookingModalOpen(true);
      };

      return (
        <div className="min-h-screen flex flex-col font-sans bg-[#FAF7F2] text-slate-800 antialiased selection:bg-forest-800 selection:text-amber-300">
          
          {/* Toast Notification */}
          {toast && (
            <div className={`fixed bottom-6 right-6 z-50 px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 transition-all transform translate-y-0 text-white font-medium ${
              toast.type === 'error' ? 'bg-red-600' : 'bg-forest-900 border border-emerald-500/40'
            }`}>
              <span>{toast.type === 'error' ? '⚠️' : '✨'}</span>
              <span>{toast.message}</span>
            </div>
          )}

          {/* Navigation Bar */}
          <Navbar 
            currentPage={currentPage} 
            setCurrentPage={setCurrentPage} 
            mobileMenuOpen={mobileMenuOpen}
            setMobileMenuOpen={setMobileMenuOpen}
            hotelConfig={hotelConfig}
            openBookingEngine={openBookingEngine}
          />

          {/* Page Routing */}
          <main className="flex-grow">
            {currentPage === 'home' && (
              <HomePage 
                rooms={rooms} 
                hotelConfig={hotelConfig} 
                reviews={reviews}
                setCurrentPage={setCurrentPage}
                openBookingEngine={openBookingEngine}
                setViewingRoom={setViewingRoom}
              />
            )}
            {currentPage === 'rooms' && (
              <RoomsPage 
                rooms={rooms} 
                openBookingEngine={openBookingEngine}
                setViewingRoom={setViewingRoom}
              />
            )}
            {currentPage === 'about' && (
              <AboutPage 
                hotelConfig={hotelConfig}
                setCurrentPage={setCurrentPage}
              />
            )}
            {currentPage === 'contact' && (
              <ContactPage 
                hotelConfig={hotelConfig}
                onAddQuery={(newQuery) => {
                  setQueries([newQuery, ...queries]);
                  showToast('Thank you! Your query is recorded. Our team will contact you shortly.');
                }}
              />
            )}
            {currentPage === 'feedback' && (
              <FeedbackPage 
                reviews={reviews}
                rooms={rooms}
                onAddReview={(newReview) => {
                  setReviews([newReview, ...reviews]);
                  showToast('Thank you for your review! It has been posted successfully.');
                }}
              />
            )}
            {currentPage === 'admin' && (
              <AdminPanel 
                rooms={rooms}
                setRooms={setRooms}
                bookings={bookings}
                setBookings={setBookings}
                queries={queries}
                setQueries={setQueries}
                reviews={reviews}
                setReviews={setReviews}
                hotelConfig={hotelConfig}
                setHotelConfig={setHotelConfig}
                showToast={showToast}
              />
            )}
          </main>

          {/* Room Details View Modal */}
          {viewingRoom && (
            <RoomDetailModal 
              room={viewingRoom} 
              onClose={() => setViewingRoom(null)} 
              onBookNow={() => {
                const r = viewingRoom;
                setViewingRoom(null);
                openBookingEngine(r);
              }}
            />
          )}

          {/* Interactive Booking Engine Modal */}
          {bookingModalOpen && (
            <BookingEngineModal 
              rooms={rooms}
              selectedRoom={selectedRoomForBooking || rooms[0]}
              initialDates={quickBookForm}
              onClose={() => setBookingModalOpen(false)}
              onConfirmBooking={(newBooking) => {
                setBookings([newBooking, ...bookings]);
                setBookingModalOpen(false);
                if (window.confetti) {
                  window.confetti({
                    particleCount: 120,
                    spread: 80,
                    origin: { y: 0.6 }
                  });
                }
                showToast(`Booking ${newBooking.id} confirmed! Welcome to Rishikesh.`);
              }}
            />
          )}

          {/* Footer */}
          <Footer 
            hotelConfig={hotelConfig} 
            setCurrentPage={setCurrentPage}
            openBookingEngine={openBookingEngine}
          />
        </div>
      );
    }

    // --- NAVIGATION COMPONENT ---
    function Navbar({ currentPage, setCurrentPage, mobileMenuOpen, setMobileMenuOpen, hotelConfig, openBookingEngine }) {
      return (
        <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-sm transition-all">
          {/* Top banner */}
          <div className="bg-forest-900 text-stone-200 text-xs py-1.5 px-4 sm:px-8 flex justify-between items-center border-b border-forest-800">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1 font-medium">
                📍 Secret Waterfall Rd, Upper Tapovan, Rishikesh
              </span>
              <span className="hidden md:inline text-forest-500">|</span>
              <span className="hidden md:inline text-emerald-300">🍃 Peaceful Ganga Valley Stay</span>
            </div>
            <div className="flex items-center gap-5">
              <a href={`tel:${hotelConfig.phone}`} className="hover:text-amber-400 font-semibold flex items-center gap-1 transition">
                📞 {hotelConfig.phone}
              </a>
              <button 
                onClick={() => setCurrentPage('admin')} 
                className="text-[11px] bg-forest-800 hover:bg-forest-500 text-amber-300 px-2.5 py-0.5 rounded transition font-mono"
                title="Manage bookings, MySQL database & contents"
              >
                🔐 Staff Admin
              </button>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
              
              {/* Brand Logo */}
              <div 
                onClick={() => { setCurrentPage('home'); window.scrollTo(0,0); }}
                className="cursor-pointer flex items-center gap-3 group"
              >
                <div className="w-11 h-11 rounded-2xl bg-forest-900 text-amber-400 flex items-center justify-center font-serif text-2xl font-bold shadow-md shadow-forest-900/20 group-hover:scale-105 transition transform">
                  C
                </div>
                <div>
                  <h1 className="font-serif text-2xl font-bold tracking-tight text-forest-950 leading-tight">
                    Checkinn <span className="text-amber-600">Homes</span>
                  </h1>
                  <p className="text-[11px] font-semibold text-stone-500 uppercase tracking-widest -mt-0.5">
                    Upper Tapovan • Rishikesh
                  </p>
                </div>
              </div>

              {/* Desktop Nav Items */}
              <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
                {[
                  { id: 'home', label: 'Home' },
                  { id: 'rooms', label: 'Our Rooms' },
                  { id: 'about', label: 'About Us' },
                  { id: 'feedback', label: 'Guest Stories' },
                  { id: 'contact', label: 'Contact & Map' },
                ].map((item) => {
                  const isActive = currentPage === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => { setCurrentPage(item.id); window.scrollTo(0,0); }}
                      className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                        isActive 
                          ? 'bg-forest-900 text-white shadow-sm' 
                          : 'text-stone-700 hover:text-forest-900 hover:bg-stone-100'
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </nav>

              {/* Action CTA */}
              <div className="hidden lg:flex items-center gap-3">
                <a 
                  href={`https://wa.me/${hotelConfig.whatsapp?.replace(/[^0-9]/g, '')}?text=Hello%20Checkinn%20Homes,%20I%20want%20to%20inquire%20about%20staying%20in%20Tapovan`} 
                  target="_blank" 
                  rel="noreferrer"
                  className="px-3.5 py-2.5 rounded-full border border-stone-300 text-stone-700 hover:bg-stone-100 text-sm font-semibold flex items-center gap-1.5 transition"
                >
                  <span className="text-emerald-600 text-base">💬</span> WhatsApp
                </a>
                <button
                  onClick={() => openBookingEngine()}
                  className="bg-amber-500 hover:bg-amber-600 text-forest-950 font-bold px-6 py-2.5 rounded-full shadow-md shadow-amber-500/20 hover:shadow-lg transition transform active:scale-95 text-sm"
                >
                  Book Your Stay →
                </button>
              </div>

              {/* Mobile Menu Hamburger */}
              <div className="flex md:hidden items-center gap-2">
                <button
                  onClick={() => openBookingEngine()}
                  className="bg-amber-500 text-forest-950 font-bold px-3 py-1.5 rounded-lg text-xs"
                >
                  Book
                </button>
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="p-2 text-stone-700 hover:text-stone-900 focus:outline-none"
                  aria-label="Toggle menu"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {mobileMenuOpen ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                    )}
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Nav Dropdown */}
          {mobileMenuOpen && (
            <div className="md:hidden bg-stone-50 border-t border-stone-200 px-4 pt-3 pb-6 space-y-2">
              {[
                { id: 'home', label: 'Home' },
                { id: 'rooms', label: 'Our Rooms' },
                { id: 'about', label: 'About Us' },
                { id: 'feedback', label: 'Guest Feedback' },
                { id: 'contact', label: 'Contact Us' },
                { id: 'admin', label: '🔐 Hostinger Admin Panel' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentPage(item.id);
                    setMobileMenuOpen(false);
                    window.scrollTo(0,0);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-xl font-semibold text-sm transition ${
                    currentPage === item.id
                      ? 'bg-forest-900 text-white'
                      : 'text-stone-800 hover:bg-stone-200'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              <div className="pt-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openBookingEngine();
                  }}
                  className="w-full bg-amber-500 text-forest-950 font-bold py-3 rounded-xl shadow text-center text-sm"
                >
                  Book Instant Stay Now
                </button>
              </div>
            </div>
          )}
        </header>
      );
    }

    // --- HOME PAGE VIEW ---
    function HomePage({ rooms, hotelConfig, reviews, setCurrentPage, openBookingEngine, setViewingRoom }) {
      const [searchForm, setSearchForm] = useState({
        checkIn: new Date().toISOString().split('T')[0],
        checkOut: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
        guests: 2
      });

      return (
        <div>
          {/* HERO SECTION */}
          <div className="relative min-h-[90vh] flex items-center justify-center bg-stone-900 overflow-hidden">
            {/* Background Image with Parallax Vibe */}
            <img 
              src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1920&q=85" 
              alt="Rishikesh Mountains and Ganga Valley"
              className="absolute inset-0 w-full h-full object-cover object-center scale-105 transform filter brightness-90 animate-pulse duration-1000"
              style={{ animationDuration: '8s' }}
            />
            {/* Dark & Emerald Overlay */}
            <div className="absolute inset-0 hero-gradient"></div>

            <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white py-16">
              
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md border border-white/25 px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold tracking-wide text-amber-300 mb-6 shadow-lg">
                <span>✨</span> Serenity in Upper Tapovan, Rishikesh
              </div>

              {/* Main Headline */}
              <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white mb-6 leading-[1.15] drop-shadow-md">
                Your Trusted Stay Partner in <span className="italic text-amber-400 font-serif">Rishikesh</span>
              </h1>

              <p className="max-w-2xl mx-auto text-base sm:text-lg md:text-xl text-stone-200 font-normal mb-10 leading-relaxed drop-shadow">
                {hotelConfig.tagline} — offering comfortable rooms, modern amenities, and a peaceful experience just steps away from Secret Waterfall & the sacred Ganges.
              </p>

              {/* Interactive Booking Search Bar (Float Bar) */}
              <div className="glass-card max-w-4xl mx-auto rounded-3xl p-4 sm:p-5 shadow-2xl text-stone-900 border border-white/60">
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    openBookingEngine();
                  }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-center"
                >
                  <div className="text-left bg-stone-50/80 hover:bg-stone-100/90 p-3 rounded-2xl border border-stone-200/80 transition">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500">Check-In</label>
                    <input 
                      type="date" 
                      value={searchForm.checkIn}
                      onChange={(e) => setSearchForm({...searchForm, checkIn: e.target.value})}
                      className="w-full bg-transparent font-semibold text-sm text-stone-800 focus:outline-none cursor-pointer"
                      required
                    />
                  </div>

                  <div className="text-left bg-stone-50/80 hover:bg-stone-100/90 p-3 rounded-2xl border border-stone-200/80 transition">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500">Check-Out</label>
                    <input 
                      type="date" 
                      value={searchForm.checkOut}
                      onChange={(e) => setSearchForm({...searchForm, checkOut: e.target.value})}
                      className="w-full bg-transparent font-semibold text-sm text-stone-800 focus:outline-none cursor-pointer"
                      required
                    />
                  </div>

                  <div className="text-left bg-stone-50/80 hover:bg-stone-100/90 p-3 rounded-2xl border border-stone-200/80 transition">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500">Guests & Stay</label>
                    <select 
                      value={searchForm.guests}
                      onChange={(e) => setSearchForm({...searchForm, guests: Number(e.target.value)})}
                      className="w-full bg-transparent font-semibold text-sm text-stone-800 focus:outline-none cursor-pointer"
                    >
                      <option value="1">1 Solo Traveler</option>
                      <option value="2">2 Adults (1 Room)</option>
                      <option value="3">3 Adults (Spacious)</option>
                      <option value="4">4+ Group / Family</option>
                    </select>
                  </div>

                  <div>
                    <button 
                      type="submit"
                      className="w-full h-full min-h-[52px] bg-forest-900 hover:bg-forest-800 text-amber-300 font-bold rounded-2xl flex items-center justify-center gap-2 shadow-lg transition transform hover:-translate-y-0.5"
                    >
                      <span>🔍</span> Check Availability
                    </button>
                  </div>
                </form>
              </div>

              {/* Highlights pills */}
              <div className="mt-8 flex flex-wrap justify-center items-center gap-6 text-xs text-stone-300">
                <span className="flex items-center gap-1.5 font-medium"><span className="text-emerald-400">✓</span> 100% Verified Clean Rooms</span>
                <span className="flex items-center gap-1.5 font-medium"><span className="text-emerald-400">✓</span> High Speed 100Mbps Wi-Fi</span>
                <span className="flex items-center gap-1.5 font-medium"><span className="text-emerald-400">✓</span> 2-min Walk to Secret Waterfall Trek</span>
                <span className="flex items-center gap-1.5 font-medium"><span className="text-emerald-400">✓</span> Near Kundan Restaurant Tapovan</span>
              </div>
            </div>
          </div>

          {/* FEATURED HIGHLIGHTS / WHY CHOOSE US */}
          <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-3xl mx-auto mb-16">
                <p className="text-amber-600 font-bold text-xs uppercase tracking-widest mb-2">A Haven in Upper Tapovan</p>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-forest-950">
                  Crafted for Calm, Culture & Himalayan Adventures
                </h2>
                <p className="mt-4 text-stone-600 text-sm sm:text-base leading-relaxed">
                  Whether you are visiting Rishikesh for intense yoga immersion, river rafting thrill, or remote work amid the green Himalayas, Checkinn Homes delivers uncompromised hospitality.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                  {
                    icon: '🏔️',
                    title: 'Peaceful Tapovan Location',
                    desc: 'Tucked away on Secret Waterfall Road, far from vehicular noise yet minutes away from popular organic cafes and Laxman Jhula vibrancy.'
                  },
                  {
                    icon: '📶',
                    title: 'Digital Nomad Ready',
                    desc: 'Dedicated 100 Mbps optical high-speed Wi-Fi, comfortable workstations, and power backup ensuring your meetings never stutter.'
                  },
                  {
                    icon: '🧘‍♂️',
                    title: 'Yoga & Trekking Desk',
                    desc: 'Complimentary assistance for local Rishikesh sightseeing, river rafting, bungee jumping, sunrise treks, and yoga ashram recommendations.'
                  },
                  {
                    icon: '🚿',
                    title: 'Pure Comfort Amenities',
                    desc: '24/7 hot geyser water, daily sanitization, plush fresh linen, electric kettles, and attentive host care round the clock.'
                  }
                ].map((feature, idx) => (
                  <div key={idx} className="bg-warmCream/60 p-8 rounded-3xl border border-stone-200/80 hover:shadow-xl transition-all group hover:-translate-y-1">
                    <div className="text-4xl mb-4 bg-white w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition">
                      {feature.icon}
                    </div>
                    <h3 className="text-lg font-bold text-forest-950 mb-2 font-serif">{feature.title}</h3>
                    <p className="text-stone-600 text-sm leading-relaxed">{feature.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ROOMS SHOWCASE SECTION */}
          <section className="py-20 bg-warmCream/80 border-t border-stone-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-14">
                <div>
                  <span className="text-amber-600 font-bold text-xs uppercase tracking-widest">Handpicked Accommodations</span>
                  <h2 className="font-serif text-3xl sm:text-4xl font-bold text-forest-950 mt-1">Our Featured Rooms</h2>
                  <p className="text-stone-600 text-sm mt-2">Find the right space for solo journeys, romantic gateways, or group explorations.</p>
                </div>
                <button
                  onClick={() => { setCurrentPage('rooms'); window.scrollTo(0,0); }}
                  className="mt-4 md:mt-0 font-bold text-forest-900 hover:text-amber-600 flex items-center gap-1.5 text-sm transition"
                >
                  View All Rooms & Dorms →
                </button>
              </div>

              {/* Rooms Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {rooms.map((room) => (
                  <RoomCard 
                    key={room.id}
                    room={room}
                    onBook={() => openBookingEngine(room)}
                    onViewDetails={() => setViewingRoom(room)}
                  />
                ))}
              </div>
            </div>
          </section>

          {/* RISHIKESH EXPERIENCE PHOTO BANNER */}
          <section className="py-20 bg-forest-950 text-white relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <span className="text-amber-400 font-bold text-xs uppercase tracking-widest">Discover Tapovan Vibes</span>
                  <h2 className="font-serif text-3xl sm:text-5xl font-bold leading-tight mt-3 mb-6">
                    Wake Up to the Melodies of Waterfall & Sacred Chants
                  </h2>
                  <p className="text-stone-300 text-sm sm:text-base leading-relaxed mb-8">
                    Upper Tapovan is the crown of Rishikesh for those who appreciate tranquility. From Checkinn Homes, walk 10 minutes along our serene road to discover the hidden Secret Waterfall, indulge in wood-fired pizza at nearby Bohemian cafes, or stroll down to the riverbanks for sacred evening Ganga Aarti.
                  </p>

                  <div className="space-y-4">
                    {[
                      { icon: '🌊', title: 'Secret Waterfall Trail', desc: 'Direct walking path starting right outside our lane.' },
                      { icon: '🍲', title: 'Culinary Delights', desc: 'Famous Kundan Restaurant & health cafes within 200 meters.' },
                      { icon: '🛶', title: 'Adventure Concierge', desc: 'Shivpuri Rafting, Beatles Ashram tour & Scooty rentals at host rates.' }
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
                        <span className="text-2xl">{item.icon}</span>
                        <div>
                          <h4 className="font-bold text-amber-300 text-sm">{item.title}</h4>
                          <p className="text-xs text-stone-300 mt-0.5">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <img 
                    src="https://images.unsplash.com/photo-1518002171953-a080ee817e1f?auto=format&fit=crop&w=600&q=80" 
                    alt="Rishikesh Ganga River"
                    className="rounded-3xl object-cover h-64 w-full shadow-lg hover:scale-[1.02] transition"
                  />
                  <img 
                    src="https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" 
                    alt="Yoga in Rishikesh"
                    className="rounded-3xl object-cover h-64 w-full shadow-lg hover:scale-[1.02] transition mt-8"
                  />
                  <img 
                    src="https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=600&q=80" 
                    alt="Cosy Room in Tapovan"
                    className="rounded-3xl object-cover h-64 w-full shadow-lg hover:scale-[1.02] transition -mt-8"
                  />
                  <img 
                    src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80" 
                    alt="Himalayan Sunset"
                    className="rounded-3xl object-cover h-64 w-full shadow-lg hover:scale-[1.02] transition"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* GUEST REVIEWS SECTION */}
          <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-2xl mx-auto mb-16">
                <span className="text-amber-600 font-bold text-xs uppercase tracking-widest">Real Guest Stories</span>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-forest-950 mt-1">Loved by Travelers & Yogis</h2>
                <p className="text-stone-600 text-sm mt-3">Read what global backpackers, families, and solo adventurers say about their stay at Checkinn Homes.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {reviews.filter(r => r.approved).slice(0, 3).map((review) => (
                  <div key={review.id} className="bg-stone-50 rounded-3xl p-7 border border-stone-200 flex flex-col justify-between hover:shadow-lg transition">
                    <div>
                      {/* Rating Stars */}
                      <div className="flex text-amber-400 text-sm mb-4">
                        {Array.from({ length: review.rating }).map((_, i) => (
                          <span key={i}>★</span>
                        ))}
                      </div>
                      <p className="text-stone-700 italic text-sm leading-relaxed mb-6 font-serif">
                        "{review.comment}"
                      </p>
                    </div>

                    <div className="flex items-center gap-3 pt-4 border-t border-stone-200">
                      <img 
                        src={review.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'} 
                        alt={review.name}
                        className="w-11 h-11 rounded-full object-cover border border-stone-300"
                      />
                      <div>
                        <h4 className="font-bold text-sm text-forest-950">{review.name}</h4>
                        <p className="text-xs text-stone-500">{review.city} • <span className="text-forest-800 font-medium">{review.room}</span></p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center mt-12">
                <button 
                  onClick={() => { setCurrentPage('feedback'); window.scrollTo(0,0); }}
                  className="px-6 py-3 rounded-full bg-forest-900 text-amber-300 font-bold text-sm hover:bg-forest-800 transition"
                >
                  Write a Review or View More Stories ✍️
                </button>
              </div>
            </div>
          </section>

          {/* CTA STRIP */}
          <section className="bg-amber-500 py-12 text-forest-950">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
              <div>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold">Planning a journey to Rishikesh?</h3>
                <p className="font-medium text-sm mt-1 opacity-90">Best price guaranteed when you book directly with Checkinn Homes.</p>
              </div>
              <div className="flex flex-wrap gap-4">
                <a 
                  href={`tel:${hotelConfig.phone}`}
                  className="bg-forest-950 text-white font-bold px-6 py-3 rounded-full text-sm shadow hover:bg-forest-900 transition"
                >
                  Call +91 82793 09665
                </a>
                <button 
                  onClick={() => openBookingEngine()}
                  className="bg-white text-forest-950 font-bold px-6 py-3 rounded-full text-sm shadow hover:bg-stone-100 transition"
                >
                  Book Instant Online
                </button>
              </div>
            </div>
          </section>
        </div>
      );
    }

    // --- ROOM CARD COMPONENT ---
    function RoomCard({ room, onBook, onViewDetails }) {
      return (
        <div className="bg-white rounded-3xl overflow-hidden border border-stone-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
          <div>
            {/* Image Header with Badge */}
            <div className="relative h-56 overflow-hidden">
              <img 
                src={room.image} 
                alt={room.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 bg-forest-950/85 backdrop-blur-md text-white text-xs font-semibold px-3 py-1 rounded-full">
                {room.type}
              </div>
              <div className="absolute top-3 right-3 bg-amber-400 text-forest-950 text-xs font-black px-2.5 py-1 rounded-full shadow">
                ★ {room.rating}
              </div>
            </div>

            {/* Room Info */}
            <div className="p-5">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-serif text-xl font-bold text-forest-950 group-hover:text-amber-600 transition">
                  {room.name}
                </h3>
              </div>
              <p className="text-xs text-stone-500 mb-3 flex items-center gap-3">
                <span>👥 {room.capacity}</span>
                <span>🛏️ {room.bed}</span>
              </p>

              <p className="text-xs text-stone-600 line-clamp-2 mb-4 leading-relaxed">
                {room.description}
              </p>

              {/* Key Amenities Pills */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {room.amenities.slice(0, 3).map((amenity, idx) => (
                  <span key={idx} className="text-[11px] bg-stone-100 text-stone-700 font-medium px-2.5 py-1 rounded-md">
                    {amenity}
                  </span>
                ))}
                {room.amenities.length > 3 && (
                  <span className="text-[11px] bg-stone-100 text-stone-500 font-medium px-2 py-1 rounded-md">
                    +{room.amenities.length - 3} more
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Pricing & Footer Button */}
          <div className="p-5 pt-0 border-t border-stone-100 flex items-center justify-between gap-2 mt-auto">
            <div>
              <div className="flex items-baseline gap-1">
                <span className="font-bold text-xl text-forest-950">₹{room.price}</span>
                <span className="text-xs text-stone-500">/night</span>
              </div>
              {room.originalPrice && (
                <span className="text-[11px] text-stone-400 line-through">₹{room.originalPrice}</span>
              )}
            </div>

            <div className="flex gap-2">
              <button
                onClick={onViewDetails}
                className="px-3 py-2 text-xs font-bold text-stone-600 hover:text-stone-900 border border-stone-200 rounded-xl hover:bg-stone-50 transition"
              >
                Details
              </button>
              <button
                onClick={onBook}
                className="px-4 py-2 text-xs font-bold bg-forest-900 hover:bg-forest-800 text-amber-300 rounded-xl shadow-sm transition"
              >
                Book
              </button>
            </div>
          </div>
        </div>
      );
    }

    // --- ROOMS PAGE VIEW ---
    function RoomsPage({ rooms, openBookingEngine, setViewingRoom }) {
      const [filter, setFilter] = useState('all'); // 'all', 'private', 'dorm'

      const filteredRooms = useMemo(() => {
        if (filter === 'private') return rooms.filter(r => !r.name.toLowerCase().includes('dormitory'));
        if (filter === 'dorm') return rooms.filter(r => r.name.toLowerCase().includes('dormitory'));
        return rooms;
      }, [rooms, filter]);

      return (
        <div className="py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Page Header */}
            <div className="text-center max-w-3xl mx-auto mb-12">
              <span className="text-amber-600 font-bold text-xs uppercase tracking-widest">Accommodations in Tapovan</span>
              <h1 className="font-serif text-4xl sm:text-5xl font-bold text-forest-950 mt-2 mb-4">
                Our Rooms & Living Spaces
              </h1>
              <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
                Every space at Checkinn Homes is thoughtfully equipped with pristine bedding, high-speed Wi-Fi for work or leisure, and peaceful mountain vibes.
              </p>

              {/* Filter Tabs */}
              <div className="flex justify-center gap-2 mt-8">
                {[
                  { id: 'all', label: 'All Options' },
                  { id: 'private', label: 'Private Deluxe & Premium' },
                  { id: 'dorm', label: 'Backpacker Bunk Dorms' },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setFilter(tab.id)}
                    className={`px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition ${
                      filter === tab.id
                        ? 'bg-forest-900 text-amber-300 shadow-md'
                        : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Room List Detailed */}
            <div className="space-y-10">
              {filteredRooms.map((room, index) => (
                <div 
                  key={room.id}
                  className="bg-white rounded-3xl overflow-hidden border border-stone-200/90 shadow-md hover:shadow-xl transition-all duration-300 grid grid-cols-1 lg:grid-cols-12 gap-0"
                >
                  {/* Left: Image Gallery Preview */}
                  <div className="lg:col-span-5 relative min-h-[300px] lg:min-h-full">
                    <img 
                      src={room.image} 
                      alt={room.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 left-4 bg-forest-950/85 backdrop-blur-md text-amber-300 font-serif text-xs px-3 py-1.5 rounded-full font-bold">
                      {room.type}
                    </div>
                  </div>

                  {/* Right: Info & Features */}
                  <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
                    <div>
                      <div className="flex flex-wrap justify-between items-baseline gap-2 mb-2">
                        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-forest-950">
                          {room.name}
                        </h2>
                        <div className="text-right">
                          <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-black text-forest-950">₹{room.price}</span>
                            <span className="text-xs text-stone-500 font-medium">/night + taxes</span>
                          </div>
                          {room.originalPrice && (
                            <span className="text-xs text-stone-400 line-through">₹{room.originalPrice}</span>
                          )}
                        </div>
                      </div>

                      <p className="text-stone-600 text-sm leading-relaxed mb-6">
                        {room.description}
                      </p>

                      {/* Room Spec Specs */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6 bg-warmCream p-4 rounded-2xl border border-stone-200/60 text-xs">
                        <div>
                          <span className="text-stone-500 block font-medium">Capacity</span>
                          <span className="font-bold text-forest-950">{room.capacity}</span>
                        </div>
                        <div>
                          <span className="text-stone-500 block font-medium">Bed Setup</span>
                          <span className="font-bold text-forest-950">{room.bed}</span>
                        </div>
                        <div>
                          <span className="text-stone-500 block font-medium">Room Size</span>
                          <span className="font-bold text-forest-950">{room.size || '280 sq.ft'}</span>
                        </div>
                      </div>

                      {/* Amenities checklist */}
                      <div className="mb-6">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">Included Amenities:</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          {room.amenities.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-stone-700">
                              <span className="text-emerald-600 font-bold">✓</span>
                              <span>{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Bottom Actions */}
                    <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-stone-200">
                      <div className="flex items-center gap-2 text-xs text-stone-500">
                        <span>⚡ Instant Confirmation</span>
                        <span>•</span>
                        <span>🛡️ Free Cancellation up to 48 hrs</span>
                      </div>

                      <div className="flex gap-3 w-full sm:w-auto">
                        <button
                          onClick={() => setViewingRoom(room)}
                          className="flex-1 sm:flex-none px-5 py-2.5 text-xs font-bold border border-stone-300 hover:bg-stone-100 rounded-xl transition"
                        >
                          View Photos
                        </button>
                        <button
                          onClick={() => openBookingEngine(room)}
                          className="flex-1 sm:flex-none px-6 py-2.5 text-xs font-bold bg-amber-500 hover:bg-amber-600 text-forest-950 rounded-xl shadow transition"
                        >
                          Book This Room Now →
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    // --- ABOUT PAGE VIEW ---
    function AboutPage({ hotelConfig, setCurrentPage }) {
      return (
        <div className="py-12 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Header */}
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-amber-600 font-bold text-xs uppercase tracking-widest">Our Story & Heritage</span>
              <h1 className="font-serif text-4xl sm:text-5xl font-bold text-forest-950 mt-2 mb-4">
                Welcome to Checkinn Homes
              </h1>
              <p className="text-stone-600 text-base leading-relaxed">
                A serene haven perched in Upper Tapovan, built to make every traveler feel at home in the Yoga Capital of the World.
              </p>
            </div>

            {/* Split Story Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
              <div>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-forest-950 mb-4">
                  Born from a Passion for Rishikesh & Authentic Hospitality
                </h2>
                <div className="space-y-4 text-stone-600 text-sm sm:text-base leading-relaxed">
                  <p>
                    Checkinn Homes was founded with one clear vision: to offer a clean, peaceful, and warm stay for seekers, adventurers, yogis, and families who want to experience the authentic magic of Rishikesh without noise and clutter.
                  </p>
                  <p>
                    Located right along Secret Waterfall Road near Kundan Restaurant, our home provides the rare sweet spot of Rishikesh stays: secluded enough to hear birds chirping and mountain winds in the morning, yet only a short walking distance from the bustling cafes, yoga studios, and iconic footbridges of Tapovan.
                  </p>
                  <p>
                    From high-speed fiber internet for your workstation to piping hot geysers after an evening Ganga Aarti, every corner of Checkinn Homes is maintained with love and care.
                  </p>
                  <p>
                    We welcome guests for quick weekend breaks as well as longer yoga courses and workations. Our team stays available throughout your visit, whether you need help planning an early-morning temple trip, finding a trusted cab, or simply choosing a quiet cafe for the afternoon.
                  </p>
                </div>

                <div className="mt-8 flex gap-4">
                  <div className="p-4 bg-white rounded-2xl border border-stone-200">
                    <span className="font-serif text-3xl font-bold text-forest-950 block">4.9/5</span>
                    <span className="text-xs text-stone-500 font-medium">Guest Satisfaction Score</span>
                  </div>
                  <div className="p-4 bg-white rounded-2xl border border-stone-200">
                    <span className="font-serif text-3xl font-bold text-forest-950 block">100%</span>
                    <span className="text-xs text-stone-500 font-medium">Cleanliness Guarantee</span>
                  </div>
                </div>
              </div>

              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80" 
                  alt="Rishikesh View"
                  className="rounded-3xl shadow-2xl object-cover w-full h-[460px]"
                />
                <div className="absolute -bottom-6 -left-6 bg-forest-900 text-amber-300 p-6 rounded-3xl shadow-xl max-w-xs hidden sm:block border border-forest-800">
                  <p className="font-serif text-lg font-bold">"Atithi Devo Bhava"</p>
                  <p className="text-xs text-stone-300 mt-1">In Rishikesh, every guest is family. We look forward to hosting your journey.</p>
                </div>
              </div>
            </div>

            {/* Stay Experience */}
            <section className="mb-20">
              <div className="max-w-3xl mb-10">
                <span className="text-amber-600 font-bold text-xs uppercase tracking-widest">More Than a Room</span>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-forest-950 mt-2 mb-4">
                  A Stay Designed Around Your Rishikesh Journey
                </h2>
                <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
                  Every guest arrives with a different plan. Some come to slow down, some to complete a yoga course, and others to explore the river and mountains. We keep the experience flexible, comfortable, and genuinely local from check-in to departure.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-y border-stone-200 py-10">
                <div>
                  <span className="text-3xl" aria-hidden="true">🛏️</span>
                  <h3 className="font-serif text-xl font-bold text-forest-950 mt-4 mb-2">Rest Well</h3>
                  <p className="text-sm text-stone-600 leading-relaxed">
                    Comfortable beds, fresh linen, private and shared room choices, hot water, and quiet nights help you recover after a full day outdoors.
                  </p>
                </div>
                <div>
                  <span className="text-3xl" aria-hidden="true">💻</span>
                  <h3 className="font-serif text-xl font-bold text-forest-950 mt-4 mb-2">Stay Connected</h3>
                  <p className="text-sm text-stone-600 leading-relaxed">
                    Reliable 100 Mbps fibre Wi-Fi and practical workspaces make longer stays easy for remote professionals, creators, and students.
                  </p>
                </div>
                <div>
                  <span className="text-3xl" aria-hidden="true">🧭</span>
                  <h3 className="font-serif text-xl font-bold text-forest-950 mt-4 mb-2">Explore Like a Local</h3>
                  <p className="text-sm text-stone-600 leading-relaxed">
                    Ask us about waterfall trails, rafting, yoga classes, scooter rentals, airport transfers, and honest neighborhood recommendations.
                  </p>
                </div>
              </div>
            </section>

            {/* Neighborhood */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center mb-20 bg-forest-950 text-white overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1518002171953-a080ee817e1f?auto=format&fit=crop&w=1000&q=85"
                alt="Ganga valley and Himalayan landscape near Tapovan"
                className="w-full h-80 lg:h-full min-h-[380px] object-cover"
              />
              <div className="px-7 pb-10 lg:py-12 lg:pr-12 lg:pl-2">
                <span className="text-amber-400 font-bold text-xs uppercase tracking-widest">Our Neighborhood</span>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold mt-2 mb-5">Upper Tapovan at Your Doorstep</h2>
                <p className="text-stone-300 text-sm leading-relaxed mb-6">
                  Checkinn Homes sits near Secret Waterfall Road, close to the experiences that make Rishikesh special while remaining removed from the busiest traffic. Start your morning with a forest walk, join a yoga class, work from a nearby cafe, or head toward the Ganga for sunset.
                </p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm text-stone-200">
                  <li className="flex gap-2"><span className="text-amber-400">✓</span> Secret Waterfall trail nearby</li>
                  <li className="flex gap-2"><span className="text-amber-400">✓</span> Cafes and restaurants on foot</li>
                  <li className="flex gap-2"><span className="text-amber-400">✓</span> Easy access to yoga studios</li>
                  <li className="flex gap-2"><span className="text-amber-400">✓</span> Local transport assistance</li>
                </ul>
              </div>
            </section>

            {/* Our Values */}
            <div className="bg-white rounded-3xl p-8 sm:p-12 border border-stone-200 mb-16">
              <h3 className="font-serif text-2xl font-bold text-forest-950 text-center mb-8">What Defines Stay at Checkinn Homes</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center p-4">
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center text-2xl mb-4">
                    🕊️
                  </div>
                  <h4 className="font-bold text-forest-950 mb-2">Peaceful Solitude</h4>
                  <p className="text-xs text-stone-600 leading-relaxed">Away from high-traffic horns, providing optimal silence for meditation, study, and deep sleep.</p>
                </div>
                <div className="text-center p-4">
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-100 text-forest-800 flex items-center justify-center text-2xl mb-4">
                    🤝
                  </div>
                  <h4 className="font-bold text-forest-950 mb-2">Personalized Host Support</h4>
                  <p className="text-xs text-stone-600 leading-relaxed">Get genuine local recommendations, secret swimming spots, and adventure bookings without middlemen markups.</p>
                </div>
                <div className="text-center p-4">
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center text-2xl mb-4">
                    ✨
                  </div>
                  <h4 className="font-bold text-forest-950 mb-2">Spotless Hygiene</h4>
                  <p className="text-xs text-stone-600 leading-relaxed">Crisp white linens, deeply sanitized bathrooms, and fresh mountain air in all rooms.</p>
                </div>
              </div>
            </div>

            {/* Quick Contact CTA */}
            <div className="text-center">
              <h3 className="font-serif text-2xl font-bold text-forest-950 mb-3">Have questions before booking?</h3>
              <p className="text-stone-600 text-sm mb-6">Talk directly with our property manager right now.</p>
              <button
                onClick={() => { setCurrentPage('contact'); window.scrollTo(0,0); }}
                className="bg-forest-900 hover:bg-forest-800 text-amber-300 font-bold px-8 py-3 rounded-full text-sm shadow transition"
              >
                Contact & Directions →
              </button>
            </div>
          </div>
        </div>
      );
    }

    // --- CONTACT & LOCATION PAGE VIEW ---
    function ContactPage({ hotelConfig, onAddQuery }) {
      const [contactForm, setContactForm] = useState({
        name: '',
        email: '',
        phone: '',
        subject: 'Stay Inquiry',
        message: ''
      });

      const handleSubmit = (e) => {
        e.preventDefault();
        if (!contactForm.name || !contactForm.phone || !contactForm.message) {
          alert('Please fill out all required fields.');
          return;
        }

        const newQuery = {
          id: 'qry-' + Date.now(),
          name: contactForm.name,
          email: contactForm.email || 'N/A',
          phone: contactForm.phone,
          subject: contactForm.subject,
          message: contactForm.message,
          date: 'Just now',
          status: 'New'
        };

        onAddQuery(newQuery);
        setContactForm({
          name: '',
          email: '',
          phone: '',
          subject: 'Stay Inquiry',
          message: ''
        });
      };

      return (
        <div className="py-12 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Header */}
            <div className="text-center max-w-3xl mx-auto mb-14">
              <span className="text-amber-600 font-bold text-xs uppercase tracking-widest">Connect With Us</span>
              <h1 className="font-serif text-4xl sm:text-5xl font-bold text-forest-950 mt-2 mb-4">
                Contact & Location
              </h1>
              <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
                Need help reaching Upper Tapovan or have queries about group retreats, bike rentals, or river rafting? We are always here.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              
              {/* Contact Info Cards */}
              <div className="lg:col-span-5 space-y-6">
                <div className="bg-white rounded-3xl p-7 border border-stone-200 shadow-sm">
                  <h3 className="font-serif text-xl font-bold text-forest-950 mb-6">Stay Address & Desk</h3>

                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-forest-50 text-forest-800 flex items-center justify-center shrink-0 text-lg">
                        📍
                      </div>
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400">Address</h4>
                        <p className="text-sm font-semibold text-forest-950 mt-1 leading-snug">
                          {hotelConfig.location}
                        </p>
                        <p className="text-xs text-amber-600 font-medium mt-1">Landmark: Behind Kundan Restaurant, Upper Tapovan</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-forest-50 text-forest-800 flex items-center justify-center shrink-0 text-lg">
                        📞
                      </div>
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400">Phone / WhatsApp</h4>
                        <a href={`tel:${hotelConfig.phone}`} className="text-sm font-bold text-forest-950 hover:text-amber-600 block mt-1">
                          {hotelConfig.phone}
                        </a>
                        <p className="text-xs text-stone-500">Available 24/7 for guest assistance & check-ins</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-forest-50 text-forest-800 flex items-center justify-center shrink-0 text-lg">
                        ✉️
                      </div>
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400">Official Email</h4>
                        <a href={`mailto:${hotelConfig.email}`} className="text-sm font-bold text-forest-950 hover:text-amber-600 block mt-1">
                          {hotelConfig.email}
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Direct WhatsApp Action */}
                  <div className="mt-8 pt-6 border-t border-stone-100">
                    <a 
                      href={`https://wa.me/${hotelConfig.whatsapp?.replace(/[^0-9]/g, '')}?text=Hello%20Checkinn%20Homes,%20I%20have%20an%20inquiry`}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl flex items-center justify-center gap-2 text-sm shadow transition"
                    >
                      <span>💬</span> Chat Instantly on WhatsApp
                    </a>
                  </div>
                </div>

                {/* Check-in info card */}
                <div className="bg-forest-900 text-white rounded-3xl p-6 border border-forest-800">
                  <h4 className="font-serif text-lg font-bold text-amber-300 mb-2">Check-in / Out Timings</h4>
                  <div className="flex justify-between text-xs sm:text-sm py-2 border-b border-forest-800">
                    <span className="text-stone-300">Standard Check-In:</span>
                    <span className="font-bold">{hotelConfig.checkInTime}</span>
                  </div>
                  <div className="flex justify-between text-xs sm:text-sm py-2">
                    <span className="text-stone-300">Standard Check-Out:</span>
                    <span className="font-bold">{hotelConfig.checkOutTime}</span>
                  </div>
                  <p className="text-[11px] text-stone-400 mt-2">*Early check-in & late check-out subject to availability upon request.</p>
                </div>
              </div>

              {/* Inquiry Form */}
              <div className="lg:col-span-7">
                <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-sm">
                  <h3 className="font-serif text-2xl font-bold text-forest-950 mb-2">Send Us a Direct Message</h3>
                  <p className="text-stone-600 text-xs sm:text-sm mb-6">
                    Leave your query below and it will instantly reach our staff admin panel and support team.
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Your Full Name *</label>
                        <input 
                          type="text" 
                          placeholder="e.g. Rahul Sharma"
                          value={contactForm.name}
                          onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                          className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-forest-800 font-medium bg-stone-50/50"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Phone / WhatsApp Number *</label>
                        <input 
                          type="tel" 
                          placeholder="e.g. +91 98765 43210"
                          value={contactForm.phone}
                          onChange={(e) => setContactForm({...contactForm, phone: e.target.value})}
                          className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-forest-800 font-medium bg-stone-50/50"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Email Address</label>
                        <input 
                          type="email" 
                          placeholder="name@domain.com"
                          value={contactForm.email}
                          onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                          className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-forest-800 font-medium bg-stone-50/50"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Inquiry Topic</label>
                        <select 
                          value={contactForm.subject}
                          onChange={(e) => setContactForm({...contactForm, subject: e.target.value})}
                          className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-forest-800 font-medium bg-stone-50/50 cursor-pointer"
                        >
                          <option value="Room Booking Inquiry">Room Booking Inquiry</option>
                          <option value="Long Term / Workation Discount">Long Term / Workation Discount</option>
                          <option value="Yoga Group / Retreat Stay">Yoga Group / Retreat Stay</option>
                          <option value="Scooty / Cab / Rafting Support">Scooty / Cab / Rafting Support</option>
                          <option value="Other Question">Other Question</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Message Details *</label>
                      <textarea 
                        rows="4"
                        placeholder="Tell us about your dates, number of guests, or special requirements..."
                        value={contactForm.message}
                        onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-forest-800 font-medium bg-stone-50/50"
                        required
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3.5 bg-forest-900 hover:bg-forest-800 text-amber-300 font-bold rounded-2xl shadow transition"
                    >
                      Submit Message to Team →
                    </button>
                  </form>
                </div>
              </div>
            </div>

            {/* Interactive Map Visual Mock */}
            <div className="mt-14 bg-white p-4 rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
              <div className="flex justify-between items-center px-4 py-2 mb-2">
                <div>
                  <h4 className="font-serif font-bold text-forest-950">Map & Neighborhood</h4>
                  <p className="text-xs text-stone-500">Upper Tapovan, Rishikesh 249192</p>
                </div>
                <a 
                  href="https://maps.google.com/?q=Tapovan+Rishikesh" 
                  target="_blank" 
                  rel="noreferrer"
                  className="text-xs font-bold text-forest-800 hover:text-amber-600 flex items-center gap-1"
                >
                  Open in Google Maps ↗
                </a>
              </div>

              <div className="w-full h-80 rounded-2xl overflow-hidden bg-stone-200 relative">
                {/* Embedded Styled Map iframe */}
                <iframe 
                  title="Checkinn Homes Rishikesh Location"
                  src="https://maps.google.com/maps?q=Tapovan,Rishikesh,Uttarakhand&t=&z=14&ie=UTF8&iwloc=&output=embed"
                  className="w-full h-full border-0 filter contrast-105"
                  loading="lazy"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // --- GUEST FEEDBACK & REVIEWS PAGE ---
    function FeedbackPage({ reviews, rooms, onAddReview }) {
      const [reviewForm, setReviewForm] = useState({
        name: '',
        city: '',
        rating: 5,
        room: rooms[0]?.name || 'Premium Room',
        comment: ''
      });

      const handleSubmitReview = (e) => {
        e.preventDefault();
        if (!reviewForm.name || !reviewForm.comment) {
          alert('Please enter your name and comments.');
          return;
        }

        const newReview = {
          id: 'rev-' + Date.now(),
          name: reviewForm.name,
          city: reviewForm.city || 'Traveler',
          rating: Number(reviewForm.rating),
          room: reviewForm.room,
          date: 'Just now',
          comment: reviewForm.comment,
          avatar: `https://images.unsplash.com/photo-${1535713875002 + Math.floor(Math.random()*1000)}?auto=format&fit=crop&w=150&q=80`,
          approved: true
        };

        onAddReview(newReview);
        setReviewForm({
          name: '',
          city: '',
          rating: 5,
          room: rooms[0]?.name || 'Premium Room',
          comment: ''
        });
      };

      return (
        <div className="py-12 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-amber-600 font-bold text-xs uppercase tracking-widest">Community Stories</span>
              <h1 className="font-serif text-4xl sm:text-5xl font-bold text-forest-950 mt-2 mb-4">
                Guest Reviews & Feedback
              </h1>
              <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
                We believe in genuine hospitality. Read recent experiences from our guests or share your own memory of staying with us in Rishikesh.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              
              {/* Form to submit review */}
              <div className="lg:col-span-5">
                <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-md sticky top-28">
                  <h3 className="font-serif text-2xl font-bold text-forest-950 mb-1">Share Your Stay Story</h3>
                  <p className="text-xs text-stone-500 mb-6">Your feedback helps fellow travelers find peaceful stays in Tapovan.</p>

                  <form onSubmit={handleSubmitReview} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Your Name *</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Priya & Ankit"
                        value={reviewForm.name}
                        onChange={(e) => setReviewForm({...reviewForm, name: e.target.value})}
                        className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm font-medium bg-stone-50/60 focus:outline-none focus:ring-2 focus:ring-forest-800"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold uppercase text-stone-500 mb-1">City / Country</label>
                        <input 
                          type="text" 
                          placeholder="e.g. Mumbai, India"
                          value={reviewForm.city}
                          onChange={(e) => setReviewForm({...reviewForm, city: e.target.value})}
                          className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm font-medium bg-stone-50/60 focus:outline-none focus:ring-2 focus:ring-forest-800"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Star Rating</label>
                        <select
                          value={reviewForm.rating}
                          onChange={(e) => setReviewForm({...reviewForm, rating: e.target.value})}
                          className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm font-bold bg-stone-50/60 focus:outline-none focus:ring-2 focus:ring-forest-800 text-amber-600"
                        >
                          <option value="5">⭐⭐⭐⭐⭐ (5/5)</option>
                          <option value="4">⭐⭐⭐⭐ (4/5)</option>
                          <option value="3">⭐⭐⭐ (3/5)</option>
                          <option value="2">⭐⭐ (2/5)</option>
                          <option value="1">⭐ (1/5)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Room Stayed In</label>
                      <select 
                        value={reviewForm.room}
                        onChange={(e) => setReviewForm({...reviewForm, room: e.target.value})}
                        className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm font-medium bg-stone-50/60 focus:outline-none focus:ring-2 focus:ring-forest-800"
                      >
                        {rooms.map(r => (
                          <option key={r.id} value={r.name}>{r.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Your Honest Review *</label>
                      <textarea 
                        rows="4"
                        placeholder="How was the room cleanliness, waterfall walk, staff assistance, and Wi-Fi speed?"
                        value={reviewForm.comment}
                        onChange={(e) => setReviewForm({...reviewForm, comment: e.target.value})}
                        className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm font-medium bg-stone-50/60 focus:outline-none focus:ring-2 focus:ring-forest-800"
                        required
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-forest-950 font-bold rounded-xl shadow transition"
                    >
                      Post Review to Website ⭐
                    </button>
                  </form>
                </div>
              </div>

              {/* Reviews List */}
              <div className="lg:col-span-7 space-y-6">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-serif text-2xl font-bold text-forest-950">Verified Stories ({reviews.length})</h3>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                    4.9 Average Rating
                  </span>
                </div>

                {reviews.map((rev) => (
                  <div key={rev.id} className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm hover:shadow-md transition">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex items-center gap-3">
                        <img 
                          src={rev.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'} 
                          alt={rev.name}
                          className="w-12 h-12 rounded-full object-cover border border-stone-300"
                        />
                        <div>
                          <h4 className="font-bold text-forest-950 text-sm">{rev.name}</h4>
                          <p className="text-xs text-stone-500">{rev.city} • <span className="text-amber-700 font-semibold">{rev.room}</span></p>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="flex text-amber-400 text-sm">
                          {Array.from({ length: rev.rating }).map((_, i) => (
                            <span key={i}>★</span>
                          ))}
                        </div>
                        <span className="text-[11px] text-stone-400">{rev.date}</span>
                      </div>
                    </div>

                    <p className="text-stone-700 text-sm leading-relaxed italic font-serif">
                      "{rev.comment}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    }

    // --- FULL ADMIN PANEL COMPONENT ---
    function AdminPanel({ 
      rooms, setRooms, 
      bookings, setBookings, 
      queries, setQueries, 
      reviews, setReviews,
      hotelConfig, setHotelConfig,
      showToast 
    }) {
      const [adminTab, setAdminTab] = useState('dashboard'); // 'dashboard', 'bookings', 'rooms', 'queries', 'feedback', 'mysql'
      const [isAuthenticated, setIsAuthenticated] = useState(true); // default open for demonstration, with passcode option
      const [passcode, setPasscode] = useState('');

      // Room Editor Modal state
      const [editingRoom, setEditingRoom] = useState(null);

      // Revenue Calculation
      const totalRevenue = useMemo(() => {
        return bookings.reduce((sum, b) => sum + (Number(b.totalAmount) || 0), 0);
      }, [bookings]);

      // Handle Room Edit Save
      const handleSaveRoom = (e) => {
        e.preventDefault();
        setRooms(rooms.map(r => r.id === editingRoom.id ? editingRoom : r));
        setEditingRoom(null);
        showToast(`Room "${editingRoom.name}" updated successfully!`);
      };

      // Handle Booking Status Change
      const updateBookingStatus = (bookingId, newStatus) => {
        setBookings(bookings.map(b => b.id === bookingId ? { ...b, status: newStatus } : b));
        showToast(`Booking ${bookingId} status updated to ${newStatus}`);
      };

      // Handle Delete Query
      const deleteQuery = (queryId) => {
        setQueries(queries.filter(q => q.id !== queryId));
        showToast('Query deleted.');
      };

      // Handle Query Status
      const toggleQueryStatus = (queryId) => {
        setQueries(queries.map(q => q.id === queryId ? { ...q, status: q.status === 'Resolved' ? 'New' : 'Resolved' } : q));
        showToast('Query status updated.');
      };

      return (
        <div className="py-8 bg-stone-100 min-h-[85vh]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Admin Header */}
            <div className="bg-forest-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-amber-400 text-xs font-mono font-bold bg-forest-900 px-3 py-1 rounded-full border border-emerald-500/30">
                    ● HOSTINGER MySQL BACKEND READY
                  </span>
                </div>
                <h1 className="font-serif text-2xl sm:text-3xl font-bold mt-2">
                  Checkinn Homes Admin Portal
                </h1>
                <p className="text-xs text-stone-300 mt-1">
                  Control live rates, room details, bookings, inquiries & Hostinger database synchronization.
                </p>
              </div>

              {/* Admin Tabs Switcher */}
              <div className="flex flex-wrap gap-1.5 bg-forest-900 p-1.5 rounded-2xl border border-white/10">
                {[
                  { id: 'dashboard', label: '📊 Dashboard' },
                  { id: 'bookings', label: `📑 Bookings (${bookings.length})` },
                  { id: 'rooms', label: `🛏️ Rooms (${rooms.length})` },
                  { id: 'queries', label: `💬 Queries (${queries.filter(q => q.status === 'New').length} new)` },
                  { id: 'feedback', label: `⭐ Reviews (${reviews.length})` },
                  { id: 'mysql', label: '🗄️ Hostinger DB' },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setAdminTab(tab.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                      adminTab === tab.id 
                        ? 'bg-amber-500 text-forest-950 shadow' 
                        : 'text-stone-300 hover:text-white hover:bg-forest-800'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* TAB: DASHBOARD */}
            {adminTab === 'dashboard' && (
              <div className="space-y-8">
                {/* Metrics Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm">
                    <span className="text-xs font-bold uppercase text-stone-400">Total Bookings</span>
                    <h3 className="font-serif text-3xl font-bold text-forest-950 mt-1">{bookings.length}</h3>
                    <p className="text-xs text-emerald-600 font-medium mt-1">↑ 100% Active in Tapovan</p>
                  </div>

                  <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm">
                    <span className="text-xs font-bold uppercase text-stone-400">Gross Booking Value</span>
                    <h3 className="font-serif text-3xl font-bold text-forest-950 mt-1">₹{totalRevenue.toLocaleString('en-IN')}</h3>
                    <p className="text-xs text-stone-500 font-medium mt-1">Direct website conversions</p>
                  </div>

                  <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm">
                    <span className="text-xs font-bold uppercase text-stone-400">Unanswered Queries</span>
                    <h3 className="font-serif text-3xl font-bold text-amber-600 mt-1">
                      {queries.filter(q => q.status === 'New').length}
                    </h3>
                    <p className="text-xs text-stone-500 font-medium mt-1">From contact & WhatsApp page</p>
                  </div>

                  <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm">
                    <span className="text-xs font-bold uppercase text-stone-400">Average Rating</span>
                    <h3 className="font-serif text-3xl font-bold text-forest-950 mt-1">4.9 ★</h3>
                    <p className="text-xs text-emerald-600 font-medium mt-1">{reviews.length} Verified guest reviews</p>
                  </div>
                </div>

                {/* Recent Bookings Quick Table */}
                <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-serif text-xl font-bold text-forest-950">Recent Direct Reservations</h3>
                    <button onClick={() => setAdminTab('bookings')} className="text-xs font-bold text-amber-600 hover:underline">
                      View All →
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs sm:text-sm">
                      <thead>
                        <tr className="border-b border-stone-200 text-stone-400 uppercase text-[11px] font-bold">
                          <th className="pb-3">Booking ID</th>
                          <th className="pb-3">Guest Name</th>
                          <th className="pb-3">Room</th>
                          <th className="pb-3">Dates</th>
                          <th className="pb-3">Amount</th>
                          <th className="pb-3">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100 font-medium">
                        {bookings.slice(0, 5).map(b => (
                          <tr key={b.id} className="hover:bg-stone-50">
                            <td className="py-3 font-mono font-bold text-forest-900">{b.id}</td>
                            <td className="py-3 text-stone-800">{b.guestName}</td>
                            <td className="py-3 text-stone-600">{b.roomName}</td>
                            <td className="py-3 text-stone-600">{b.checkIn} to {b.checkOut}</td>
                            <td className="py-3 font-bold text-forest-950">₹{b.totalAmount}</td>
                            <td className="py-3">
                              <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                                b.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-800' :
                                b.status === 'Checked-In' ? 'bg-blue-100 text-blue-800' :
                                'bg-stone-200 text-stone-700'
                              }`}>
                                {b.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: BOOKINGS MANAGEMENT */}
            {adminTab === 'bookings' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-forest-950">Guest Reservations Manager</h3>
                    <p className="text-xs text-stone-500">Live feed of all website & WhatsApp confirmations</p>
                  </div>
                  <div className="text-xs font-semibold text-stone-500">
                    Total Bookings: <span className="font-bold text-forest-950">{bookings.length}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  {bookings.map(book => (
                    <div key={book.id} className="p-5 rounded-2xl bg-stone-50 border border-stone-200 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 hover:border-forest-800 transition">
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <span className="font-mono font-bold text-sm bg-forest-900 text-amber-300 px-2.5 py-0.5 rounded">
                            {book.id}
                          </span>
                          <h4 className="font-bold text-base text-forest-950">{book.guestName}</h4>
                          <span className="text-xs text-stone-500">({book.guests} Guests)</span>
                        </div>
                        <p className="text-xs text-stone-600">
                          📞 {book.phone} | ✉️ {book.email}
                        </p>
                        <p className="text-xs font-semibold text-forest-800">
                          🏠 {book.roomName} • 📅 {book.checkIn} to {book.checkOut}
                        </p>
                        {book.notes && (
                          <p className="text-xs text-amber-700 italic">Special Note: "{book.notes}"</p>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-3">
                        <div className="text-right pr-2">
                          <div className="text-lg font-black text-forest-950">₹{book.totalAmount}</div>
                          <span className="text-[11px] text-stone-400">{book.paymentMode || 'Direct'}</span>
                        </div>

                        {/* Status dropdown */}
                        <select
                          value={book.status}
                          onChange={(e) => updateBookingStatus(book.id, e.target.value)}
                          className="text-xs font-bold bg-white border border-stone-300 rounded-xl px-3 py-2 text-stone-800 focus:ring-2 focus:ring-forest-800 cursor-pointer"
                        >
                          <option value="Confirmed">Confirmed</option>
                          <option value="Checked-In">Checked-In</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>

                        <a 
                          href={`https://wa.me/${book.phone?.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(book.guestName)},%20confirming%20your%20stay%20at%20Checkinn%20Homes%20Tapovan%20Rishikesh%20(ID:%20${book.id})`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-1"
                        >
                          <span>💬</span> WhatsApp Guest
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: ROOMS EDITOR */}
            {adminTab === 'rooms' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-forest-950">Room Configuration & Pricing</h3>
                    <p className="text-xs text-stone-500">Edit nightly rates, descriptions, amenities, and photos live</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {rooms.map(room => (
                    <div key={room.id} className="border border-stone-200 rounded-2xl p-5 bg-stone-50/50 flex flex-col justify-between">
                      <div>
                        <div className="flex gap-4 items-start mb-3">
                          <img src={room.image} alt={room.name} className="w-20 h-20 rounded-xl object-cover" />
                          <div>
                            <h4 className="font-serif font-bold text-lg text-forest-950">{room.name}</h4>
                            <p className="text-xs text-amber-700 font-semibold">{room.type}</p>
                            <p className="text-xs text-stone-500 mt-1">Current Price: <span className="font-bold text-forest-950 text-sm">₹{room.price}/night</span></p>
                          </div>
                        </div>
                        <p className="text-xs text-stone-600 line-clamp-2 mb-3">{room.description}</p>
                        <div className="text-[11px] text-stone-500 font-medium">
                          Capacity: {room.capacity} | Bed: {room.bed}
                        </div>
                      </div>

                      <div className="pt-4 mt-3 border-t border-stone-200 flex justify-end gap-2">
                        <button
                          onClick={() => setEditingRoom(JSON.parse(JSON.stringify(room)))}
                          className="px-4 py-2 bg-forest-900 hover:bg-forest-800 text-amber-300 text-xs font-bold rounded-xl shadow transition"
                        >
                          ✏️ Edit Room Details & Price
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: INQUIRIES & QUERIES */}
            {adminTab === 'queries' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-forest-950">Inbound Guest Queries</h3>
                    <p className="text-xs text-stone-500">Queries submitted via website contact & inquiry forms</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {queries.length === 0 ? (
                    <p className="text-stone-500 text-sm text-center py-8">No customer queries currently.</p>
                  ) : (
                    queries.map(q => (
                      <div key={q.id} className="p-5 rounded-2xl bg-stone-50 border border-stone-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="space-y-1 max-w-2xl">
                          <div className="flex items-center gap-3">
                            <h4 className="font-bold text-sm text-forest-950">{q.name}</h4>
                            <span className="text-xs text-stone-400">({q.date})</span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              q.status === 'New' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                            }`}>
                              {q.status}
                            </span>
                          </div>
                          <p className="text-xs font-semibold text-amber-700">{q.subject}</p>
                          <p className="text-xs text-stone-700 leading-relaxed font-sans">{q.message}</p>
                          <div className="text-[11px] text-stone-500 pt-1">
                            Phone: {q.phone} | Email: {q.email}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toggleQueryStatus(q.id)}
                            className="px-3 py-1.5 bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-bold rounded-lg transition"
                          >
                            Mark {q.status === 'Resolved' ? 'New' : 'Resolved'}
                          </button>
                          <a
                            href={`https://wa.me/${q.phone?.replace(/[^0-9]/g, '')}?text=Hi%20${encodeURIComponent(q.name)},%20replying%20to%20your%20query%20at%20Checkinn%20Homes%20Rishikesh`}
                            target="_blank"
                            rel="noreferrer"
                            className="px-3 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded-lg transition"
                          >
                            Reply WhatsApp
                          </a>
                          <button
                            onClick={() => deleteQuery(q.id)}
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg text-xs"
                            title="Delete query"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* TAB: FEEDBACK MODERATION */}
            {adminTab === 'feedback' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-forest-950">Guest Testimonials Moderation</h3>
                    <p className="text-xs text-stone-500">Live reviews appearing on the homepage and review board</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {reviews.map(rev => (
                    <div key={rev.id} className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-forest-950">{rev.name}</h4>
                          <span className="text-xs text-amber-500">{'★'.repeat(rev.rating)}</span>
                          <span className="text-xs text-stone-400">({rev.room})</span>
                        </div>
                        <p className="text-xs text-stone-600 italic mt-1 font-serif">"{rev.comment}"</p>
                        <span className="text-[10px] text-stone-400">{rev.city} • {rev.date}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setReviews(reviews.filter(r => r.id !== rev.id));
                            showToast('Review removed.');
                          }}
                          className="text-xs text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg font-bold transition"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: HOSTINGER MYSQL DATABASE SYNC & PHP ENDPOINTS */}
            {adminTab === 'mysql' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm">
                <div className="max-w-3xl">
                  <span className="text-emerald-600 font-bold text-xs uppercase tracking-wider font-mono">
                    Hostinger cPanel / hPanel MySQL Integration
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-forest-950 mt-1 mb-2">
                    Production Database Schema & API Setup
                  </h3>
                  <p className="text-stone-600 text-xs sm:text-sm mb-6 leading-relaxed">
                    This website has built-in local reactive storage, plus direct MySQL ready compatibility. Simply create a database in your <b>Hostinger MySQL Databases</b> menu and use the schema and PHP API below.
                  </p>

                  {/* DB Settings Form */}
                  <div className="bg-stone-50 p-6 rounded-2xl border border-stone-200 space-y-4 mb-6">
                    <h4 className="font-bold text-sm text-forest-950 font-serif">Hostinger DB Connection Credentials</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div>
                        <label className="block text-stone-500 font-bold mb-1">Hostinger DB Host</label>
                        <input 
                          type="text" 
                          value={hotelConfig.dbHost || 'localhost'} 
                          onChange={(e) => setHotelConfig({...hotelConfig, dbHost: e.target.value})}
                          className="w-full px-3 py-2 rounded-lg border border-stone-300 font-mono text-xs bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-stone-500 font-bold mb-1">Database Name</label>
                        <input 
                          type="text" 
                          value={hotelConfig.dbName || 'u123456_checkinn'} 
                          onChange={(e) => setHotelConfig({...hotelConfig, dbName: e.target.value})}
                          className="w-full px-3 py-2 rounded-lg border border-stone-300 font-mono text-xs bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-stone-500 font-bold mb-1">DB Username</label>
                        <input 
                          type="text" 
                          value={hotelConfig.dbUser || 'u123456_root'} 
                          onChange={(e) => setHotelConfig({...hotelConfig, dbUser: e.target.value})}
                          className="w-full px-3 py-2 rounded-lg border border-stone-300 font-mono text-xs bg-white"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Ready SQL Schema */}
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700">1. SQL Schema (Run in Hostinger phpMyAdmin):</h4>
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(`CREATE TABLE rooms (id VARCHAR(50) PRIMARY KEY, name VARCHAR(100), price INT, capacity VARCHAR(50), description TEXT, image TEXT);
CREATE TABLE bookings (id VARCHAR(50) PRIMARY KEY, guest_name VARCHAR(100), email VARCHAR(100), phone VARCHAR(50), room_name VARCHAR(100), check_in DATE, check_out DATE, guests INT, total_amount INT, status VARCHAR(50), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE queries (id VARCHAR(50) PRIMARY KEY, name VARCHAR(100), email VARCHAR(100), phone VARCHAR(50), subject VARCHAR(150), message TEXT, status VARCHAR(50) DEFAULT 'New', created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE reviews (id VARCHAR(50) PRIMARY KEY, name VARCHAR(100), city VARCHAR(100), rating INT, room VARCHAR(100), comment TEXT, approved BOOLEAN DEFAULT TRUE);`);
                          showToast('SQL Schema copied to clipboard!');
                        }}
                        className="text-xs text-forest-800 font-bold hover:underline"
                      >
                        📋 Copy SQL
                      </button>
                    </div>
                    <pre className="bg-forest-950 text-emerald-300 text-[11px] p-4 rounded-2xl overflow-x-auto font-mono">
{`CREATE TABLE rooms (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100),
  price INT,
  capacity VARCHAR(50),
  description TEXT,
  image TEXT
);

CREATE TABLE bookings (
  id VARCHAR(50) PRIMARY KEY,
  guest_name VARCHAR(100),
  email VARCHAR(100),
  phone VARCHAR(50),
  room_name VARCHAR(100),
  check_in DATE,
  check_out DATE,
  guests INT,
  total_amount INT,
  status VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE queries (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100),
  phone VARCHAR(50),
  subject VARCHAR(150),
  message TEXT,
  status VARCHAR(50) DEFAULT 'New'
);`}
                    </pre>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* EDIT ROOM MODAL */}
          {editingRoom && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-200">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-serif text-xl font-bold text-forest-950">Edit Room: {editingRoom.name}</h3>
                  <button onClick={() => setEditingRoom(null)} className="text-stone-400 hover:text-stone-700 font-bold text-lg">✕</button>
                </div>

                <form onSubmit={handleSaveRoom} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-bold text-stone-500 mb-1">Room Display Name</label>
                    <input 
                      type="text" 
                      value={editingRoom.name}
                      onChange={(e) => setEditingRoom({...editingRoom, name: e.target.value})}
                      className="w-full px-3 py-2 border rounded-xl text-sm font-medium"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-stone-500 mb-1">Nightly Price (₹)</label>
                      <input 
                        type="number" 
                        value={editingRoom.price}
                        onChange={(e) => setEditingRoom({...editingRoom, price: Number(e.target.value)})}
                        className="w-full px-3 py-2 border rounded-xl text-sm font-bold text-forest-950"
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-stone-500 mb-1">Capacity</label>
                      <input 
                        type="text" 
                        value={editingRoom.capacity}
                        onChange={(e) => setEditingRoom({...editingRoom, capacity: e.target.value})}
                        className="w-full px-3 py-2 border rounded-xl text-sm font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-stone-500 mb-1">Image URL</label>
                    <input 
                      type="url" 
                      value={editingRoom.image}
                      onChange={(e) => setEditingRoom({...editingRoom, image: e.target.value})}
                      className="w-full px-3 py-2 border rounded-xl text-xs font-mono"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-stone-500 mb-1">Room Description</label>
                    <textarea 
                      rows="3"
                      value={editingRoom.description}
                      onChange={(e) => setEditingRoom({...editingRoom, description: e.target.value})}
                      className="w-full px-3 py-2 border rounded-xl text-xs font-medium"
                      required
                    ></textarea>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setEditingRoom(null)}
                      className="flex-1 py-2.5 rounded-xl border border-stone-300 font-bold text-stone-600 hover:bg-stone-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2.5 rounded-xl bg-forest-900 text-amber-300 font-bold hover:bg-forest-800 shadow"
                    >
                      Save Room Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      );
    }

    // --- INTERACTIVE BOOKING ENGINE MODAL ---
    function BookingEngineModal({ rooms, selectedRoom, initialDates, onClose, onConfirmBooking }) {
      const [currentRoom, setCurrentRoom] = useState(selectedRoom || rooms[0]);
      const [formData, setFormData] = useState({
        guestName: '',
        email: '',
        phone: '',
        checkIn: initialDates.checkIn || new Date().toISOString().split('T')[0],
        checkOut: initialDates.checkOut || new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
        guests: initialDates.guests || 2,
        specialRequests: '',
        addRafting: false,
        addScooty: false
      });

      // Calculate nights
      const nights = useMemo(() => {
        const start = new Date(formData.checkIn);
        const end = new Date(formData.checkOut);
        const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
        return diff > 0 ? diff : 1;
      }, [formData.checkIn, formData.checkOut]);

      // Calculate Total with Addons
      const totalAmount = useMemo(() => {
        let base = currentRoom.price * nights;
        if (formData.addRafting) base += 850 * formData.guests;
        if (formData.addScooty) base += 500 * nights;
        return base;
      }, [currentRoom, nights, formData.addRafting, formData.addScooty, formData.guests]);

      const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.guestName || !formData.phone) {
          alert('Please provide your name and phone number for booking confirmation.');
          return;
        }

        const newBooking = {
          id: 'CIH-' + Math.floor(1000 + Math.random() * 9000),
          guestName: formData.guestName,
          email: formData.email || 'guest@tapovan.com',
          phone: formData.phone,
          roomName: currentRoom.name,
          checkIn: formData.checkIn,
          checkOut: formData.checkOut,
          guests: formData.guests,
          totalAmount: totalAmount,
          status: 'Confirmed',
          paymentMode: 'Direct Host Reservation',
          notes: `${formData.specialRequests || ''} ${formData.addRafting ? '[+Rafting]' : ''} ${formData.addScooty ? '[+Scooty]' : ''}`.trim()
        };

        onConfirmBooking(newBooking);
      };

      return (
        <div className="fixed inset-0 z-50 bg-forest-950/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 relative my-8">
            
            {/* Close Button */}
            <button 
              onClick={onClose}
              className="absolute top-5 right-5 w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 font-bold flex items-center justify-center text-sm transition"
            >
              ✕
            </button>

            {/* Modal Title */}
            <div className="mb-6">
              <span className="text-amber-600 font-bold text-xs uppercase tracking-widest">Instant Reservation</span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-forest-950 mt-0.5">
                Book Your Rishikesh Sanctuary
              </h2>
              <p className="text-xs text-stone-500">No advance payment required for direct website reservations.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Step 1: Room Selector */}
              <div>
                <label className="block text-xs font-bold uppercase text-stone-500 mb-2">Select Preferred Room</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {rooms.map((r) => (
                    <button
                      type="button"
                      key={r.id}
                      onClick={() => setCurrentRoom(r)}
                      className={`p-3 rounded-2xl text-left border transition ${
                        currentRoom.id === r.id
                          ? 'border-forest-900 bg-forest-50/70 ring-2 ring-forest-900'
                          : 'border-stone-200 hover:border-stone-300 bg-stone-50/40'
                      }`}
                    >
                      <h4 className="font-serif font-bold text-xs text-forest-950 leading-tight">{r.name}</h4>
                      <p className="text-[11px] font-bold text-amber-700 mt-1">₹{r.price}/n</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2: Dates & Guests */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-warmCream p-4 rounded-2xl border border-stone-200">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-stone-500 mb-1">Check-In Date</label>
                  <input 
                    type="date"
                    value={formData.checkIn}
                    onChange={(e) => setFormData({...formData, checkIn: e.target.value})}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-bold bg-white text-forest-950"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase text-stone-500 mb-1">Check-Out Date</label>
                  <input 
                    type="date"
                    value={formData.checkOut}
                    onChange={(e) => setFormData({...formData, checkOut: e.target.value})}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-bold bg-white text-forest-950"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase text-stone-500 mb-1">Number of Guests</label>
                  <select
                    value={formData.guests}
                    onChange={(e) => setFormData({...formData, guests: Number(e.target.value)})}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-bold bg-white text-forest-950 cursor-pointer"
                  >
                    <option value="1">1 Person</option>
                    <option value="2">2 Persons</option>
                    <option value="3">3 Persons</option>
                    <option value="4">4 Persons</option>
                  </select>
                </div>
              </div>

              {/* Step 3: Guest Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Guest Full Name *</label>
                  <input 
                    type="text"
                    placeholder="e.g. Maya Patel"
                    value={formData.guestName}
                    onChange={(e) => setFormData({...formData, guestName: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm font-medium bg-stone-50/50 focus:outline-none focus:ring-2 focus:ring-forest-800"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Phone / WhatsApp *</label>
                  <input 
                    type="tel"
                    placeholder="e.g. +91 98765 00000"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm font-medium bg-stone-50/50 focus:outline-none focus:ring-2 focus:ring-forest-800"
                    required
                  />
                </div>
              </div>

              {/* Optional Experiences */}
              <div className="space-y-2">
                <span className="block text-xs font-bold uppercase text-stone-500">Rishikesh Add-On Experiences (Optional)</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <label className="flex items-center gap-2.5 p-3 rounded-xl border border-stone-200 cursor-pointer hover:bg-stone-50">
                    <input 
                      type="checkbox"
                      checked={formData.addRafting}
                      onChange={(e) => setFormData({...formData, addRafting: e.target.checked})}
                      className="rounded text-forest-900 focus:ring-forest-800 w-4 h-4"
                    />
                    <div>
                      <span className="font-bold text-forest-950">16km River Rafting</span>
                      <p className="text-[11px] text-stone-500">+₹850/person with pickup</p>
                    </div>
                  </label>

                  <label className="flex items-center gap-2.5 p-3 rounded-xl border border-stone-200 cursor-pointer hover:bg-stone-50">
                    <input 
                      type="checkbox"
                      checked={formData.addScooty}
                      onChange={(e) => setFormData({...formData, addScooty: e.target.checked})}
                      className="rounded text-forest-900 focus:ring-forest-800 w-4 h-4"
                    />
                    <div>
                      <span className="font-bold text-forest-950">Daily Scooty Rental</span>
                      <p className="text-[11px] text-stone-500">+₹500/day doorstep delivery</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Price Breakdown and Confirmation */}
              <div className="bg-forest-950 text-white p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <div className="text-xs text-stone-300">
                    {nights} Night(s) Stay • {currentRoom.name}
                  </div>
                  <div className="font-serif text-2xl font-bold text-amber-300 mt-0.5">
                    Total: ₹{totalAmount.toLocaleString('en-IN')}
                  </div>
                  <p className="text-[10px] text-emerald-400">✓ Pay on arrival in Upper Tapovan</p>
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-3.5 bg-amber-500 hover:bg-amber-600 text-forest-950 font-bold rounded-xl shadow-lg transition transform active:scale-95 text-sm"
                >
                  Confirm Instant Booking ➔
                </button>
              </div>
            </form>
          </div>
        </div>
      );
    }

    // --- ROOM DETAILS FULL MODAL ---
    function RoomDetailModal({ room, onClose, onBookNow }) {
      const [activeImg, setActiveImg] = useState(room.image);

      return (
        <div className="fixed inset-0 z-50 bg-forest-950/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 relative my-8">
            <button 
              onClick={onClose}
              className="absolute top-5 right-5 w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 font-bold flex items-center justify-center text-sm transition z-10"
            >
              ✕
            </button>

            {/* Main Room View */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <img 
                  src={activeImg} 
                  alt={room.name} 
                  className="w-full h-64 object-cover rounded-2xl shadow mb-2"
                />
                {/* Thumbnails */}
                <div className="flex gap-2">
                  {(room.gallery || [room.image]).map((img, i) => (
                    <img 
                      key={i} 
                      src={img} 
                      alt="" 
                      onClick={() => setActiveImg(img)}
                      className={`w-16 h-12 object-cover rounded-lg cursor-pointer border-2 transition ${
                        activeImg === img ? 'border-amber-500 scale-105' : 'border-transparent opacity-70'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div>
                <span className="text-amber-600 font-bold text-xs uppercase tracking-widest">{room.type}</span>
                <h3 className="font-serif text-3xl font-bold text-forest-950 mt-1 mb-2">{room.name}</h3>
                
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-2xl font-black text-forest-950">₹{room.price}</span>
                  <span className="text-xs text-stone-500">/ night</span>
                  {room.originalPrice && <span className="text-xs text-stone-400 line-through">₹{room.originalPrice}</span>}
                </div>

                <p className="text-stone-600 text-xs sm:text-sm leading-relaxed mb-4">
                  {room.description}
                </p>

                <div className="space-y-1.5 text-xs text-stone-700 mb-6">
                  <div>👥 <b>Capacity:</b> {room.capacity}</div>
                  <div>🛏️ <b>Bed:</b> {room.bed}</div>
                  <div>📐 <b>Room Area:</b> {room.size || '300 sq.ft'}</div>
                  <div>📶 <b>Internet:</b> 100 Mbps Optical Fibre</div>
                </div>

                <button
                  onClick={onBookNow}
                  className="w-full py-3 bg-forest-900 hover:bg-forest-800 text-amber-300 font-bold rounded-xl shadow transition"
                >
                  Book This Room (₹{room.price}/night) →
                </button>
              </div>
            </div>

            {/* Amenities Grid */}
            <div className="pt-4 border-t border-stone-200">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3">Room Amenities</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                {room.amenities.map((a, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 text-stone-700">
                    <span className="text-emerald-600">✓</span> {a}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    }

    // --- FOOTER COMPONENT ---
    function Footer({ hotelConfig, setCurrentPage, openBookingEngine }) {
      return (
        <footer className="bg-forest-950 text-white pt-16 pb-12 border-t border-forest-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-forest-900">
              
              {/* Brand Col */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-forest-900 text-amber-400 flex items-center justify-center font-serif text-2xl font-bold border border-forest-800">
                    C
                  </div>
                  <h2 className="font-serif text-2xl font-bold tracking-tight text-white">
                    Checkinn <span className="text-amber-400">Homes</span>
                  </h2>
                </div>
                <p className="text-xs text-stone-300 leading-relaxed">
                  Your trusted stay partner in Rishikesh, offering comfortable rooms, modern amenities, and a peaceful experience in the heart of Tapovan.
                </p>
                <div className="flex gap-3 text-stone-400 text-sm">
                  <span className="cursor-pointer hover:text-amber-400">📷 Instagram</span>
                  <span className="cursor-pointer hover:text-amber-400">📘 Facebook</span>
                  <span className="cursor-pointer hover:text-amber-400">📍 Google</span>
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h3 className="font-serif text-base font-bold text-amber-300 mb-4">Quick Links</h3>
                <ul className="space-y-2 text-xs text-stone-300">
                  {['Home', 'Our Rooms', 'About Us', 'Guest Stories', 'Contact & Map'].map((name, i) => {
                    const pages = ['home', 'rooms', 'about', 'feedback', 'contact'];
                    return (
                      <li key={i}>
                        <button 
                          onClick={() => { setCurrentPage(pages[i]); window.scrollTo(0,0); }}
                          className="hover:text-amber-300 transition"
                        >
                          {name}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Our Rooms */}
              <div>
                <h3 className="font-serif text-base font-bold text-amber-300 mb-4">Our Rooms</h3>
                <ul className="space-y-2 text-xs text-stone-300">
                  <li>• Premium Room (Mountain View)</li>
                  <li>• Super Deluxe Room (Balcony)</li>
                  <li>• Deluxe Room (Serene Comfort)</li>
                  <li>• Shared Dormitory (Backpacker Bunk)</li>
                </ul>
                <div className="mt-4">
                  <button 
                    onClick={() => openBookingEngine()} 
                    className="text-xs text-amber-400 font-bold hover:underline"
                  >
                    Check Availability →
                  </button>
                </div>
              </div>

              {/* Contact Info */}
              <div>
                <h3 className="font-serif text-base font-bold text-amber-300 mb-4">Contact Info</h3>
                <div className="space-y-3 text-xs text-stone-300">
                  <p className="leading-snug">
                    📍 {hotelConfig.location}
                  </p>
                  <p>
                    📞 Phone: <a href={`tel:${hotelConfig.phone}`} className="text-amber-300 hover:underline">{hotelConfig.phone}</a>
                  </p>
                  <p>
                    ✉️ Email: <a href={`mailto:${hotelConfig.email}`} className="text-amber-300 hover:underline">{hotelConfig.email}</a>
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom bar */}
            <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-400">
              <div>
                © {new Date().getFullYear()} Checkinn Homes Rishikesh. All rights reserved.
              </div>
              <div className="flex gap-4">
                <button onClick={() => setCurrentPage('admin')} className="text-amber-400 hover:underline">
                  🔐 Staff Admin Panel
                </button>
                <span>•</span>
                <span>Upper Tapovan, Uttarakhand 249192</span>
              </div>
            </div>
          </div>
        </footer>
      );
    }

    // Render the React application into Root
    ReactDOM.createRoot(document.getElementById('root')).render(<App />);
