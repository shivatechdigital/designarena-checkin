var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
const { useState, useEffect, useMemo } = React;
const PAGE_PATHS = {
  home: "index.html",
  rooms: "rooms.html",
  about: "aboutus.html",
  feedback: "feedback.html",
  contact: "contact.html",
  admin: "admin.html"
};
const navigateToPage = (page) => {
  window.location.href = PAGE_PATHS[page] || PAGE_PATHS.home;
};
const INITIAL_ROOMS = [
  {
    id: "room-1",
    name: "Premium Room",
    type: "Private Mountain View",
    price: 2499,
    originalPrice: 3200,
    capacity: "2 Adults + 1 Child",
    bed: "King Size Bed",
    size: "320 sq.ft",
    rating: 4.9,
    reviewsCount: 42,
    image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=900&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=900&q=80"
    ],
    amenities: ["Mountain View Balcony", "Fast 100Mbps Wi-Fi", "Air Conditioning & Heater", "Smart LED TV with Netflix", "Attached Luxury Bathroom", "Electric Kettle & Tea Kit", "24/7 Hot Geyser Water"],
    description: "Our top-tier peaceful sanctuary with a private balcony offering breathtaking morning vistas of Tapovan hills and the whispering Ganges breeze. Perfect for couples, spiritual seekers, and remote executives."
  },
  {
    id: "room-2",
    name: "Super Deluxe Room",
    type: "Private Balcony Haven",
    price: 1999,
    originalPrice: 2600,
    capacity: "2 Guests",
    bed: "Queen Bed",
    size: "280 sq.ft",
    rating: 4.8,
    reviewsCount: 38,
    image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=900&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=900&q=80"
    ],
    amenities: ["Private Balcony", "High-Speed Wi-Fi", "Air Conditioning", "Ensuite Bathroom", "Work Desk & Chair", "Daily Housekeeping", "24/7 Hot Water"],
    description: "Spacious and tastefully furnished with minimalist Himalayan decor. Comes with a dedicated study desk for digital nomads and a serene balcony to unwind after yoga."
  },
  {
    id: "room-3",
    name: "Deluxe Room",
    type: "Cozy Rest Stay",
    price: 1499,
    originalPrice: 2e3,
    capacity: "2 Guests",
    bed: "Double Bed",
    size: "220 sq.ft",
    rating: 4.7,
    reviewsCount: 29,
    image: "https://images.unsplash.com/photo-1595576508898-0ad5c879a061?auto=format&fit=crop&w=900&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1595576508898-0ad5c879a061?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80"
    ],
    amenities: ["Quiet Mountain Air", "High-Speed Wi-Fi", "Ceiling Fan & Air Cooler", "Attached Clean Bathroom", "Wardrobe", "24/7 Hot Water"],
    description: "Cozy and super quiet, tailored for light travelers, solo travelers, and spiritual pilgrims wanting pure comfort at an incredible value."
  },
  {
    id: "room-4",
    name: "Shared Dormitory",
    type: "Backpacker & Yogi Bunk",
    price: 599,
    originalPrice: 899,
    capacity: "1 Bunk Bed",
    bed: "Single Orthopedic Bunk",
    size: "Spacious 6-Bed Dorm",
    rating: 4.85,
    reviewsCount: 56,
    image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=900&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1520277739336-7bf67edfa768?auto=format&fit=crop&w=900&q=80"
    ],
    amenities: ["Personal Locker", "Individual Bed Reading Light", "Universal Power Socket", "High-Speed Wi-Fi", "Common Lounge & Cafe Access", "Filtered RO Water"],
    description: "Vibrant, ultra-clean social community bunk space. Meet fellow travelers from across the world, exchange yoga routines, and plan your waterfall treks."
  }
];
const INITIAL_REVIEWS = [
  {
    id: "rev-1",
    name: "Aarav Sharma",
    city: "Bengaluru, India",
    rating: 5,
    room: "Premium Room",
    date: "2 days ago",
    comment: "Checkinn Homes is truly a peaceful gem in Tapovan! Located right near Secret Waterfall road, away from the loud horns. The Wi-Fi was rock solid for my work calls and the mountain view morning tea is unforgettable.",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
    approved: true
  },
  {
    id: "rev-2",
    name: "Elena Rostova",
    city: "St. Petersburg, Russia",
    rating: 5,
    room: "Shared Dormitory",
    date: "1 week ago",
    comment: "Stayed 2 weeks for my 200hr Yoga Teacher Training. The bunk beds are very comfortable, lockers are safe, and the host helped arrange river rafting and bike rentals at local prices!",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
    approved: true
  },
  {
    id: "rev-3",
    name: "Rohan & Kritika Mehta",
    city: "Delhi NCR",
    rating: 5,
    room: "Super Deluxe Room",
    date: "2 weeks ago",
    comment: "Cleanest rooms in Upper Tapovan at this budget. Kundan restaurant and amazing cafes are just a 3-minute stroll away. The host hospitality made us feel like family.",
    avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80",
    approved: true
  }
];
const INITIAL_BOOKINGS = [
  {
    id: "CIH-7821",
    guestName: "Vikram Malhotra",
    email: "vikram.m@gmail.com",
    phone: "+91 98765 43210",
    roomName: "Premium Room",
    checkIn: "2025-04-10",
    checkOut: "2025-04-14",
    guests: 2,
    totalAmount: 9996,
    status: "Confirmed",
    paymentMode: "Pay at Stay",
    notes: "Early check-in around 11:00 AM requested"
  },
  {
    id: "CIH-7822",
    guestName: "Sophie Turner",
    email: "sophie.travels@yahoo.com",
    phone: "+44 7911 123456",
    roomName: "Shared Dormitory",
    checkIn: "2025-04-12",
    checkOut: "2025-04-19",
    guests: 1,
    totalAmount: 4193,
    status: "Confirmed",
    paymentMode: "Hostinger Gateway (UPI/Card)",
    notes: "Needs bike rental on arrival"
  }
];
const INITIAL_QUERIES = [
  {
    id: "qry-1",
    name: "Pooja Verma",
    email: "pooja.v@outlook.com",
    phone: "+91 91234 56789",
    subject: "Group Booking for 10 Yogis",
    message: "Hi team, we are planning a 5-day retreat in May. Can we book the full floor with breakfast arrangements?",
    date: "Yesterday at 4:30 PM",
    status: "New"
  },
  {
    id: "qry-2",
    name: "David Miller",
    email: "david.m@gmail.com",
    phone: "+1 415 555 0199",
    subject: "Taxi Pickup from Dehradun Airport (DED)",
    message: "Can you arrange a verified cab to pick us up from Jolly Grant airport on April 15th?",
    date: "3 days ago",
    status: "Resolved"
  }
];
function App() {
  var _a;
  const currentPage = document.body.dataset.page || "home";
  const setCurrentPage = navigateToPage;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [rooms, setRooms] = useState(() => {
    const saved = localStorage.getItem("cih_rooms");
    return saved ? JSON.parse(saved) : INITIAL_ROOMS;
  });
  const [bookings, setBookings] = useState(() => {
    const saved = localStorage.getItem("cih_bookings");
    return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
  });
  const [queries, setQueries] = useState(() => {
    const saved = localStorage.getItem("cih_queries");
    return saved ? JSON.parse(saved) : INITIAL_QUERIES;
  });
  const [reviews, setReviews] = useState(() => {
    const saved = localStorage.getItem("cih_reviews");
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });
  const [hotelConfig, setHotelConfig] = useState(() => {
    const saved = localStorage.getItem("cih_config");
    return saved ? JSON.parse(saved) : {
      name: "Checkinn Homes",
      tagline: "Your trusted stay partner in Rishikesh",
      location: "Check inn homes, Secret Waterfall Rd, near Kundan Restaurant, Upper Tapovan, Rishikesh, Uttarakhand 249192",
      phone: "+91 82793 09665",
      email: "checkinnhomes@gmail.com",
      whatsapp: "+918279309665",
      checkInTime: "12:00 PM",
      checkOutTime: "11:00 AM",
      wifiSpeed: "100 Mbps Fibre",
      dbHost: "sqlXXX.hostinger.com",
      dbName: "u123456789_checkinndb",
      dbUser: "u123456789_admin"
    };
  });
  useEffect(() => {
    localStorage.setItem("cih_rooms", JSON.stringify(rooms));
  }, [rooms]);
  useEffect(() => {
    localStorage.setItem("cih_bookings", JSON.stringify(bookings));
  }, [bookings]);
  useEffect(() => {
    localStorage.setItem("cih_queries", JSON.stringify(queries));
  }, [queries]);
  useEffect(() => {
    localStorage.setItem("cih_reviews", JSON.stringify(reviews));
  }, [reviews]);
  useEffect(() => {
    localStorage.setItem("cih_config", JSON.stringify(hotelConfig));
  }, [hotelConfig]);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedRoomForBooking, setSelectedRoomForBooking] = useState(null);
  const [quickBookForm, setQuickBookForm] = useState({
    checkIn: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
    checkOut: new Date(Date.now() + 864e5 * 2).toISOString().split("T")[0],
    guests: 2,
    roomId: ((_a = rooms[0]) == null ? void 0 : _a.id) || "room-1"
  });
  const [viewingRoom, setViewingRoom] = useState(null);
  const [toast, setToast] = useState(null);
  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4e3);
  };
  const openBookingEngine = (room = null) => {
    if (room) {
      setSelectedRoomForBooking(room);
      setQuickBookForm((prev) => __spreadProps(__spreadValues({}, prev), { roomId: room.id }));
    } else {
      setSelectedRoomForBooking(rooms[0]);
      setQuickBookForm((prev) => __spreadProps(__spreadValues({}, prev), { roomId: rooms[0].id }));
    }
    setBookingModalOpen(true);
  };
  return /* @__PURE__ */ React.createElement("div", { className: "min-h-screen flex flex-col font-sans bg-[#FAF7F2] text-slate-800 antialiased selection:bg-forest-800 selection:text-amber-300" }, toast && /* @__PURE__ */ React.createElement("div", { className: `fixed bottom-6 right-6 z-50 px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 transition-all transform translate-y-0 text-white font-medium ${toast.type === "error" ? "bg-red-600" : "bg-forest-900 border border-emerald-500/40"}` }, /* @__PURE__ */ React.createElement("span", null, toast.type === "error" ? "\u26A0\uFE0F" : "\u2728"), /* @__PURE__ */ React.createElement("span", null, toast.message)), /* @__PURE__ */ React.createElement(
    Navbar,
    {
      currentPage,
      setCurrentPage,
      mobileMenuOpen,
      setMobileMenuOpen,
      hotelConfig,
      openBookingEngine
    }
  ), /* @__PURE__ */ React.createElement("main", { className: "flex-grow" }, currentPage === "home" && /* @__PURE__ */ React.createElement(
    HomePage,
    {
      rooms,
      hotelConfig,
      reviews,
      setCurrentPage,
      openBookingEngine,
      setViewingRoom
    }
  ), currentPage === "rooms" && /* @__PURE__ */ React.createElement(
    RoomsPage,
    {
      rooms,
      openBookingEngine,
      setViewingRoom
    }
  ), currentPage === "about" && /* @__PURE__ */ React.createElement(
    AboutPage,
    {
      hotelConfig,
      setCurrentPage
    }
  ), currentPage === "contact" && /* @__PURE__ */ React.createElement(
    ContactPage,
    {
      hotelConfig,
      onAddQuery: (newQuery) => {
        setQueries([newQuery, ...queries]);
        showToast("Thank you! Your query is recorded. Our team will contact you shortly.");
      }
    }
  ), currentPage === "feedback" && /* @__PURE__ */ React.createElement(
    FeedbackPage,
    {
      reviews,
      rooms,
      onAddReview: (newReview) => {
        setReviews([newReview, ...reviews]);
        showToast("Thank you for your review! It has been posted successfully.");
      }
    }
  ), currentPage === "admin" && /* @__PURE__ */ React.createElement(
    AdminPanel,
    {
      rooms,
      setRooms,
      bookings,
      setBookings,
      queries,
      setQueries,
      reviews,
      setReviews,
      hotelConfig,
      setHotelConfig,
      showToast
    }
  )), viewingRoom && /* @__PURE__ */ React.createElement(
    RoomDetailModal,
    {
      room: viewingRoom,
      onClose: () => setViewingRoom(null),
      onBookNow: () => {
        const r = viewingRoom;
        setViewingRoom(null);
        openBookingEngine(r);
      }
    }
  ), bookingModalOpen && /* @__PURE__ */ React.createElement(
    BookingEngineModal,
    {
      rooms,
      selectedRoom: selectedRoomForBooking || rooms[0],
      initialDates: quickBookForm,
      onClose: () => setBookingModalOpen(false),
      onConfirmBooking: (newBooking) => {
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
      }
    }
  ), /* @__PURE__ */ React.createElement(
    Footer,
    {
      hotelConfig,
      setCurrentPage,
      openBookingEngine
    }
  ));
}
function Navbar({ currentPage, setCurrentPage, mobileMenuOpen, setMobileMenuOpen, hotelConfig, openBookingEngine }) {
  var _a;
  return /* @__PURE__ */ React.createElement("header", { className: "sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-sm transition-all" }, /* @__PURE__ */ React.createElement("div", { className: "bg-forest-900 text-stone-200 text-xs py-1.5 px-4 sm:px-8 flex justify-between items-center border-b border-forest-800" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-4" }, /* @__PURE__ */ React.createElement("span", { className: "flex items-center gap-1 font-medium" }, "\u{1F4CD} Secret Waterfall Rd, Upper Tapovan, Rishikesh"), /* @__PURE__ */ React.createElement("span", { className: "hidden md:inline text-forest-500" }, "|"), /* @__PURE__ */ React.createElement("span", { className: "hidden md:inline text-emerald-300" }, "\u{1F343} Peaceful Ganga Valley Stay")), /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-5" }, /* @__PURE__ */ React.createElement("a", { href: `tel:${hotelConfig.phone}`, className: "hover:text-amber-400 font-semibold flex items-center gap-1 transition" }, "\u{1F4DE} ", hotelConfig.phone), /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => setCurrentPage("admin"),
      className: "text-[11px] bg-forest-800 hover:bg-forest-500 text-amber-300 px-2.5 py-0.5 rounded transition font-mono",
      title: "Manage bookings, MySQL database & contents"
    },
    "\u{1F510} Staff Admin"
  ))), /* @__PURE__ */ React.createElement("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" }, /* @__PURE__ */ React.createElement("div", { className: "flex justify-between items-center h-20" }, /* @__PURE__ */ React.createElement(
    "div",
    {
      onClick: () => {
        setCurrentPage("home");
        window.scrollTo(0, 0);
      },
      className: "cursor-pointer flex items-center gap-3 group"
    },
    /* @__PURE__ */ React.createElement("div", { className: "w-11 h-11 rounded-2xl bg-forest-900 text-amber-400 flex items-center justify-center font-serif text-2xl font-bold shadow-md shadow-forest-900/20 group-hover:scale-105 transition transform" }, "C"),
    /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h1", { className: "font-serif text-2xl font-bold tracking-tight text-forest-950 leading-tight" }, "Checkinn ", /* @__PURE__ */ React.createElement("span", { className: "text-amber-600" }, "Homes")), /* @__PURE__ */ React.createElement("p", { className: "text-[11px] font-semibold text-stone-500 uppercase tracking-widest -mt-0.5" }, "Upper Tapovan \u2022 Rishikesh"))
  ), /* @__PURE__ */ React.createElement("nav", { className: "hidden md:flex items-center space-x-1 lg:space-x-2" }, [
    { id: "home", label: "Home" },
    { id: "rooms", label: "Our Rooms" },
    { id: "about", label: "About Us" },
    { id: "feedback", label: "Guest Stories" },
    { id: "contact", label: "Contact & Map" }
  ].map((item) => {
    const isActive = currentPage === item.id;
    return /* @__PURE__ */ React.createElement(
      "button",
      {
        key: item.id,
        onClick: () => {
          setCurrentPage(item.id);
          window.scrollTo(0, 0);
        },
        className: `px-4 py-2 rounded-full text-sm font-semibold transition ${isActive ? "bg-forest-900 text-white shadow-sm" : "text-stone-700 hover:text-forest-900 hover:bg-stone-100"}`
      },
      item.label
    );
  })), /* @__PURE__ */ React.createElement("div", { className: "hidden lg:flex items-center gap-3" }, /* @__PURE__ */ React.createElement(
    "a",
    {
      href: `https://wa.me/${(_a = hotelConfig.whatsapp) == null ? void 0 : _a.replace(/[^0-9]/g, "")}?text=Hello%20Checkinn%20Homes,%20I%20want%20to%20inquire%20about%20staying%20in%20Tapovan`,
      target: "_blank",
      rel: "noreferrer",
      className: "px-3.5 py-2.5 rounded-full border border-stone-300 text-stone-700 hover:bg-stone-100 text-sm font-semibold flex items-center gap-1.5 transition"
    },
    /* @__PURE__ */ React.createElement("span", { className: "text-emerald-600 text-base" }, "\u{1F4AC}"),
    " WhatsApp"
  ), /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => openBookingEngine(),
      className: "bg-amber-500 hover:bg-amber-600 text-forest-950 font-bold px-6 py-2.5 rounded-full shadow-md shadow-amber-500/20 hover:shadow-lg transition transform active:scale-95 text-sm"
    },
    "Book Your Stay \u2192"
  )), /* @__PURE__ */ React.createElement("div", { className: "flex md:hidden items-center gap-2" }, /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => openBookingEngine(),
      className: "bg-amber-500 text-forest-950 font-bold px-3 py-1.5 rounded-lg text-xs"
    },
    "Book"
  ), /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => setMobileMenuOpen(!mobileMenuOpen),
      className: "p-2 text-stone-700 hover:text-stone-900 focus:outline-none",
      "aria-label": "Toggle menu"
    },
    /* @__PURE__ */ React.createElement("svg", { className: "w-6 h-6", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }, mobileMenuOpen ? /* @__PURE__ */ React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M6 18L18 6M6 6l12 12" }) : /* @__PURE__ */ React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M4 6h16M4 12h16M4 18h16" }))
  )))), mobileMenuOpen && /* @__PURE__ */ React.createElement("div", { className: "md:hidden bg-stone-50 border-t border-stone-200 px-4 pt-3 pb-6 space-y-2" }, [
    { id: "home", label: "Home" },
    { id: "rooms", label: "Our Rooms" },
    { id: "about", label: "About Us" },
    { id: "feedback", label: "Guest Feedback" },
    { id: "contact", label: "Contact Us" },
    { id: "admin", label: "\u{1F510} Hostinger Admin Panel" }
  ].map((item) => /* @__PURE__ */ React.createElement(
    "button",
    {
      key: item.id,
      onClick: () => {
        setCurrentPage(item.id);
        setMobileMenuOpen(false);
        window.scrollTo(0, 0);
      },
      className: `w-full text-left px-4 py-3 rounded-xl font-semibold text-sm transition ${currentPage === item.id ? "bg-forest-900 text-white" : "text-stone-800 hover:bg-stone-200"}`
    },
    item.label
  )), /* @__PURE__ */ React.createElement("div", { className: "pt-2" }, /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => {
        setMobileMenuOpen(false);
        openBookingEngine();
      },
      className: "w-full bg-amber-500 text-forest-950 font-bold py-3 rounded-xl shadow text-center text-sm"
    },
    "Book Instant Stay Now"
  ))));
}
function HomePage({ rooms, hotelConfig, reviews, setCurrentPage, openBookingEngine, setViewingRoom }) {
  const [searchForm, setSearchForm] = useState({
    checkIn: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
    checkOut: new Date(Date.now() + 864e5 * 2).toISOString().split("T")[0],
    guests: 2
  });
  return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "relative min-h-[90vh] flex items-center justify-center bg-stone-900 overflow-hidden" }, /* @__PURE__ */ React.createElement(
    "img",
    {
      src: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1920&q=85",
      alt: "Rishikesh Mountains and Ganga Valley",
      className: "absolute inset-0 w-full h-full object-cover object-center scale-105 transform filter brightness-90 animate-pulse duration-1000",
      style: { animationDuration: "8s" }
    }
  ), /* @__PURE__ */ React.createElement("div", { className: "absolute inset-0 hero-gradient" }), /* @__PURE__ */ React.createElement("div", { className: "relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white py-16" }, /* @__PURE__ */ React.createElement("div", { className: "inline-flex items-center gap-2 bg-white/15 backdrop-blur-md border border-white/25 px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold tracking-wide text-amber-300 mb-6 shadow-lg" }, /* @__PURE__ */ React.createElement("span", null, "\u2728"), " Serenity in Upper Tapovan, Rishikesh"), /* @__PURE__ */ React.createElement("h1", { className: "font-serif text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white mb-6 leading-[1.15] drop-shadow-md" }, "Your Trusted Stay Partner in ", /* @__PURE__ */ React.createElement("span", { className: "italic text-amber-400 font-serif" }, "Rishikesh")), /* @__PURE__ */ React.createElement("p", { className: "max-w-2xl mx-auto text-base sm:text-lg md:text-xl text-stone-200 font-normal mb-10 leading-relaxed drop-shadow" }, hotelConfig.tagline, " \u2014 offering comfortable rooms, modern amenities, and a peaceful experience just steps away from Secret Waterfall & the sacred Ganges."), /* @__PURE__ */ React.createElement("div", { className: "glass-card max-w-4xl mx-auto rounded-3xl p-4 sm:p-5 shadow-2xl text-stone-900 border border-white/60" }, /* @__PURE__ */ React.createElement(
    "form",
    {
      onSubmit: (e) => {
        e.preventDefault();
        openBookingEngine();
      },
      className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-center"
    },
    /* @__PURE__ */ React.createElement("div", { className: "text-left bg-stone-50/80 hover:bg-stone-100/90 p-3 rounded-2xl border border-stone-200/80 transition" }, /* @__PURE__ */ React.createElement("label", { className: "block text-[11px] font-bold uppercase tracking-wider text-stone-500" }, "Check-In"), /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "date",
        value: searchForm.checkIn,
        onChange: (e) => setSearchForm(__spreadProps(__spreadValues({}, searchForm), { checkIn: e.target.value })),
        className: "w-full bg-transparent font-semibold text-sm text-stone-800 focus:outline-none cursor-pointer",
        required: true
      }
    )),
    /* @__PURE__ */ React.createElement("div", { className: "text-left bg-stone-50/80 hover:bg-stone-100/90 p-3 rounded-2xl border border-stone-200/80 transition" }, /* @__PURE__ */ React.createElement("label", { className: "block text-[11px] font-bold uppercase tracking-wider text-stone-500" }, "Check-Out"), /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "date",
        value: searchForm.checkOut,
        onChange: (e) => setSearchForm(__spreadProps(__spreadValues({}, searchForm), { checkOut: e.target.value })),
        className: "w-full bg-transparent font-semibold text-sm text-stone-800 focus:outline-none cursor-pointer",
        required: true
      }
    )),
    /* @__PURE__ */ React.createElement("div", { className: "text-left bg-stone-50/80 hover:bg-stone-100/90 p-3 rounded-2xl border border-stone-200/80 transition" }, /* @__PURE__ */ React.createElement("label", { className: "block text-[11px] font-bold uppercase tracking-wider text-stone-500" }, "Guests & Stay"), /* @__PURE__ */ React.createElement(
      "select",
      {
        value: searchForm.guests,
        onChange: (e) => setSearchForm(__spreadProps(__spreadValues({}, searchForm), { guests: Number(e.target.value) })),
        className: "w-full bg-transparent font-semibold text-sm text-stone-800 focus:outline-none cursor-pointer"
      },
      /* @__PURE__ */ React.createElement("option", { value: "1" }, "1 Solo Traveler"),
      /* @__PURE__ */ React.createElement("option", { value: "2" }, "2 Adults (1 Room)"),
      /* @__PURE__ */ React.createElement("option", { value: "3" }, "3 Adults (Spacious)"),
      /* @__PURE__ */ React.createElement("option", { value: "4" }, "4+ Group / Family")
    )),
    /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(
      "button",
      {
        type: "submit",
        className: "w-full h-full min-h-[52px] bg-forest-900 hover:bg-forest-800 text-amber-300 font-bold rounded-2xl flex items-center justify-center gap-2 shadow-lg transition transform hover:-translate-y-0.5"
      },
      /* @__PURE__ */ React.createElement("span", null, "\u{1F50D}"),
      " Check Availability"
    ))
  )), /* @__PURE__ */ React.createElement("div", { className: "mt-8 flex flex-wrap justify-center items-center gap-6 text-xs text-stone-300" }, /* @__PURE__ */ React.createElement("span", { className: "flex items-center gap-1.5 font-medium" }, /* @__PURE__ */ React.createElement("span", { className: "text-emerald-400" }, "\u2713"), " 100% Verified Clean Rooms"), /* @__PURE__ */ React.createElement("span", { className: "flex items-center gap-1.5 font-medium" }, /* @__PURE__ */ React.createElement("span", { className: "text-emerald-400" }, "\u2713"), " High Speed 100Mbps Wi-Fi"), /* @__PURE__ */ React.createElement("span", { className: "flex items-center gap-1.5 font-medium" }, /* @__PURE__ */ React.createElement("span", { className: "text-emerald-400" }, "\u2713"), " 2-min Walk to Secret Waterfall Trek"), /* @__PURE__ */ React.createElement("span", { className: "flex items-center gap-1.5 font-medium" }, /* @__PURE__ */ React.createElement("span", { className: "text-emerald-400" }, "\u2713"), " Near Kundan Restaurant Tapovan")))), /* @__PURE__ */ React.createElement("section", { className: "py-20 bg-white" }, /* @__PURE__ */ React.createElement("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" }, /* @__PURE__ */ React.createElement("div", { className: "text-center max-w-3xl mx-auto mb-16" }, /* @__PURE__ */ React.createElement("p", { className: "text-amber-600 font-bold text-xs uppercase tracking-widest mb-2" }, "A Haven in Upper Tapovan"), /* @__PURE__ */ React.createElement("h2", { className: "font-serif text-3xl sm:text-4xl font-bold text-forest-950" }, "Crafted for Calm, Culture & Himalayan Adventures"), /* @__PURE__ */ React.createElement("p", { className: "mt-4 text-stone-600 text-sm sm:text-base leading-relaxed" }, "Whether you are visiting Rishikesh for intense yoga immersion, river rafting thrill, or remote work amid the green Himalayas, Checkinn Homes delivers uncompromised hospitality.")), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8" }, [
    {
      icon: "\u{1F3D4}\uFE0F",
      title: "Peaceful Tapovan Location",
      desc: "Tucked away on Secret Waterfall Road, far from vehicular noise yet minutes away from popular organic cafes and Laxman Jhula vibrancy."
    },
    {
      icon: "\u{1F4F6}",
      title: "Digital Nomad Ready",
      desc: "Dedicated 100 Mbps optical high-speed Wi-Fi, comfortable workstations, and power backup ensuring your meetings never stutter."
    },
    {
      icon: "\u{1F9D8}\u200D\u2642\uFE0F",
      title: "Yoga & Trekking Desk",
      desc: "Complimentary assistance for local Rishikesh sightseeing, river rafting, bungee jumping, sunrise treks, and yoga ashram recommendations."
    },
    {
      icon: "\u{1F6BF}",
      title: "Pure Comfort Amenities",
      desc: "24/7 hot geyser water, daily sanitization, plush fresh linen, electric kettles, and attentive host care round the clock."
    }
  ].map((feature, idx) => /* @__PURE__ */ React.createElement("div", { key: idx, className: "bg-warmCream/60 p-8 rounded-3xl border border-stone-200/80 hover:shadow-xl transition-all group hover:-translate-y-1" }, /* @__PURE__ */ React.createElement("div", { className: "text-4xl mb-4 bg-white w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition" }, feature.icon), /* @__PURE__ */ React.createElement("h3", { className: "text-lg font-bold text-forest-950 mb-2 font-serif" }, feature.title), /* @__PURE__ */ React.createElement("p", { className: "text-stone-600 text-sm leading-relaxed" }, feature.desc)))))), /* @__PURE__ */ React.createElement("section", { className: "py-20 bg-warmCream/80 border-t border-stone-200" }, /* @__PURE__ */ React.createElement("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" }, /* @__PURE__ */ React.createElement("div", { className: "flex flex-col md:flex-row md:items-end justify-between mb-14" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("span", { className: "text-amber-600 font-bold text-xs uppercase tracking-widest" }, "Handpicked Accommodations"), /* @__PURE__ */ React.createElement("h2", { className: "font-serif text-3xl sm:text-4xl font-bold text-forest-950 mt-1" }, "Our Featured Rooms"), /* @__PURE__ */ React.createElement("p", { className: "text-stone-600 text-sm mt-2" }, "Find the right space for solo journeys, romantic gateways, or group explorations.")), /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => {
        setCurrentPage("rooms");
        window.scrollTo(0, 0);
      },
      className: "mt-4 md:mt-0 font-bold text-forest-900 hover:text-amber-600 flex items-center gap-1.5 text-sm transition"
    },
    "View All Rooms & Dorms \u2192"
  )), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" }, rooms.map((room) => /* @__PURE__ */ React.createElement(
    RoomCard,
    {
      key: room.id,
      room,
      onBook: () => openBookingEngine(room),
      onViewDetails: () => setViewingRoom(room)
    }
  ))))), /* @__PURE__ */ React.createElement("section", { className: "py-20 bg-forest-950 text-white relative overflow-hidden" }, /* @__PURE__ */ React.createElement("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" }, /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-12 items-center" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("span", { className: "text-amber-400 font-bold text-xs uppercase tracking-widest" }, "Discover Tapovan Vibes"), /* @__PURE__ */ React.createElement("h2", { className: "font-serif text-3xl sm:text-5xl font-bold leading-tight mt-3 mb-6" }, "Wake Up to the Melodies of Waterfall & Sacred Chants"), /* @__PURE__ */ React.createElement("p", { className: "text-stone-300 text-sm sm:text-base leading-relaxed mb-8" }, "Upper Tapovan is the crown of Rishikesh for those who appreciate tranquility. From Checkinn Homes, walk 10 minutes along our serene road to discover the hidden Secret Waterfall, indulge in wood-fired pizza at nearby Bohemian cafes, or stroll down to the riverbanks for sacred evening Ganga Aarti."), /* @__PURE__ */ React.createElement("div", { className: "space-y-4" }, [
    { icon: "\u{1F30A}", title: "Secret Waterfall Trail", desc: "Direct walking path starting right outside our lane." },
    { icon: "\u{1F372}", title: "Culinary Delights", desc: "Famous Kundan Restaurant & health cafes within 200 meters." },
    { icon: "\u{1F6F6}", title: "Adventure Concierge", desc: "Shivpuri Rafting, Beatles Ashram tour & Scooty rentals at host rates." }
  ].map((item, i) => /* @__PURE__ */ React.createElement("div", { key: i, className: "flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/10" }, /* @__PURE__ */ React.createElement("span", { className: "text-2xl" }, item.icon), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h4", { className: "font-bold text-amber-300 text-sm" }, item.title), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-stone-300 mt-0.5" }, item.desc)))))), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-2 gap-4" }, /* @__PURE__ */ React.createElement(
    "img",
    {
      src: "https://images.unsplash.com/photo-1518002171953-a080ee817e1f?auto=format&fit=crop&w=600&q=80",
      alt: "Rishikesh Ganga River",
      className: "rounded-3xl object-cover h-64 w-full shadow-lg hover:scale-[1.02] transition"
    }
  ), /* @__PURE__ */ React.createElement(
    "img",
    {
      src: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80",
      alt: "Yoga in Rishikesh",
      className: "rounded-3xl object-cover h-64 w-full shadow-lg hover:scale-[1.02] transition mt-8"
    }
  ), /* @__PURE__ */ React.createElement(
    "img",
    {
      src: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=600&q=80",
      alt: "Cosy Room in Tapovan",
      className: "rounded-3xl object-cover h-64 w-full shadow-lg hover:scale-[1.02] transition -mt-8"
    }
  ), /* @__PURE__ */ React.createElement(
    "img",
    {
      src: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80",
      alt: "Himalayan Sunset",
      className: "rounded-3xl object-cover h-64 w-full shadow-lg hover:scale-[1.02] transition"
    }
  ))))), /* @__PURE__ */ React.createElement("section", { className: "py-20 bg-white" }, /* @__PURE__ */ React.createElement("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" }, /* @__PURE__ */ React.createElement("div", { className: "text-center max-w-2xl mx-auto mb-16" }, /* @__PURE__ */ React.createElement("span", { className: "text-amber-600 font-bold text-xs uppercase tracking-widest" }, "Real Guest Stories"), /* @__PURE__ */ React.createElement("h2", { className: "font-serif text-3xl sm:text-4xl font-bold text-forest-950 mt-1" }, "Loved by Travelers & Yogis"), /* @__PURE__ */ React.createElement("p", { className: "text-stone-600 text-sm mt-3" }, "Read what global backpackers, families, and solo adventurers say about their stay at Checkinn Homes.")), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-8" }, reviews.filter((r) => r.approved).slice(0, 3).map((review) => /* @__PURE__ */ React.createElement("div", { key: review.id, className: "bg-stone-50 rounded-3xl p-7 border border-stone-200 flex flex-col justify-between hover:shadow-lg transition" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "flex text-amber-400 text-sm mb-4" }, Array.from({ length: review.rating }).map((_, i) => /* @__PURE__ */ React.createElement("span", { key: i }, "\u2605"))), /* @__PURE__ */ React.createElement("p", { className: "text-stone-700 italic text-sm leading-relaxed mb-6 font-serif" }, '"', review.comment, '"')), /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-3 pt-4 border-t border-stone-200" }, /* @__PURE__ */ React.createElement(
    "img",
    {
      src: review.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
      alt: review.name,
      className: "w-11 h-11 rounded-full object-cover border border-stone-300"
    }
  ), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h4", { className: "font-bold text-sm text-forest-950" }, review.name), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-stone-500" }, review.city, " \u2022 ", /* @__PURE__ */ React.createElement("span", { className: "text-forest-800 font-medium" }, review.room))))))), /* @__PURE__ */ React.createElement("div", { className: "text-center mt-12" }, /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => {
        setCurrentPage("feedback");
        window.scrollTo(0, 0);
      },
      className: "px-6 py-3 rounded-full bg-forest-900 text-amber-300 font-bold text-sm hover:bg-forest-800 transition"
    },
    "Write a Review or View More Stories \u270D\uFE0F"
  )))), /* @__PURE__ */ React.createElement("section", { className: "bg-amber-500 py-12 text-forest-950" }, /* @__PURE__ */ React.createElement("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h3", { className: "font-serif text-2xl sm:text-3xl font-bold" }, "Planning a journey to Rishikesh?"), /* @__PURE__ */ React.createElement("p", { className: "font-medium text-sm mt-1 opacity-90" }, "Best price guaranteed when you book directly with Checkinn Homes.")), /* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap gap-4" }, /* @__PURE__ */ React.createElement(
    "a",
    {
      href: `tel:${hotelConfig.phone}`,
      className: "bg-forest-950 text-white font-bold px-6 py-3 rounded-full text-sm shadow hover:bg-forest-900 transition"
    },
    "Call +91 82793 09665"
  ), /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => openBookingEngine(),
      className: "bg-white text-forest-950 font-bold px-6 py-3 rounded-full text-sm shadow hover:bg-stone-100 transition"
    },
    "Book Instant Online"
  )))));
}
function RoomCard({ room, onBook, onViewDetails }) {
  return /* @__PURE__ */ React.createElement("div", { className: "bg-white rounded-3xl overflow-hidden border border-stone-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "relative h-56 overflow-hidden" }, /* @__PURE__ */ React.createElement(
    "img",
    {
      src: room.image,
      alt: room.name,
      className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
    }
  ), /* @__PURE__ */ React.createElement("div", { className: "absolute top-3 left-3 bg-forest-950/85 backdrop-blur-md text-white text-xs font-semibold px-3 py-1 rounded-full" }, room.type), /* @__PURE__ */ React.createElement("div", { className: "absolute top-3 right-3 bg-amber-400 text-forest-950 text-xs font-black px-2.5 py-1 rounded-full shadow" }, "\u2605 ", room.rating)), /* @__PURE__ */ React.createElement("div", { className: "p-5" }, /* @__PURE__ */ React.createElement("div", { className: "flex justify-between items-start mb-2" }, /* @__PURE__ */ React.createElement("h3", { className: "font-serif text-xl font-bold text-forest-950 group-hover:text-amber-600 transition" }, room.name)), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-stone-500 mb-3 flex items-center gap-3" }, /* @__PURE__ */ React.createElement("span", null, "\u{1F465} ", room.capacity), /* @__PURE__ */ React.createElement("span", null, "\u{1F6CF}\uFE0F ", room.bed)), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-stone-600 line-clamp-2 mb-4 leading-relaxed" }, room.description), /* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap gap-1.5 mb-4" }, room.amenities.slice(0, 3).map((amenity, idx) => /* @__PURE__ */ React.createElement("span", { key: idx, className: "text-[11px] bg-stone-100 text-stone-700 font-medium px-2.5 py-1 rounded-md" }, amenity)), room.amenities.length > 3 && /* @__PURE__ */ React.createElement("span", { className: "text-[11px] bg-stone-100 text-stone-500 font-medium px-2 py-1 rounded-md" }, "+", room.amenities.length - 3, " more")))), /* @__PURE__ */ React.createElement("div", { className: "p-5 pt-0 border-t border-stone-100 flex items-center justify-between gap-2 mt-auto" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "flex items-baseline gap-1" }, /* @__PURE__ */ React.createElement("span", { className: "font-bold text-xl text-forest-950" }, "\u20B9", room.price), /* @__PURE__ */ React.createElement("span", { className: "text-xs text-stone-500" }, "/night")), room.originalPrice && /* @__PURE__ */ React.createElement("span", { className: "text-[11px] text-stone-400 line-through" }, "\u20B9", room.originalPrice)), /* @__PURE__ */ React.createElement("div", { className: "flex gap-2" }, /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: onViewDetails,
      className: "px-3 py-2 text-xs font-bold text-stone-600 hover:text-stone-900 border border-stone-200 rounded-xl hover:bg-stone-50 transition"
    },
    "Details"
  ), /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: onBook,
      className: "px-4 py-2 text-xs font-bold bg-forest-900 hover:bg-forest-800 text-amber-300 rounded-xl shadow-sm transition"
    },
    "Book"
  ))));
}
function RoomsPage({ rooms, openBookingEngine, setViewingRoom }) {
  const [filter, setFilter] = useState("all");
  const filteredRooms = useMemo(() => {
    if (filter === "private") return rooms.filter((r) => !r.name.toLowerCase().includes("dormitory"));
    if (filter === "dorm") return rooms.filter((r) => r.name.toLowerCase().includes("dormitory"));
    return rooms;
  }, [rooms, filter]);
  return /* @__PURE__ */ React.createElement("div", { className: "py-12 md:py-16" }, /* @__PURE__ */ React.createElement("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" }, /* @__PURE__ */ React.createElement("div", { className: "text-center max-w-3xl mx-auto mb-12" }, /* @__PURE__ */ React.createElement("span", { className: "text-amber-600 font-bold text-xs uppercase tracking-widest" }, "Accommodations in Tapovan"), /* @__PURE__ */ React.createElement("h1", { className: "font-serif text-4xl sm:text-5xl font-bold text-forest-950 mt-2 mb-4" }, "Our Rooms & Living Spaces"), /* @__PURE__ */ React.createElement("p", { className: "text-stone-600 text-sm sm:text-base leading-relaxed" }, "Every space at Checkinn Homes is thoughtfully equipped with pristine bedding, high-speed Wi-Fi for work or leisure, and peaceful mountain vibes."), /* @__PURE__ */ React.createElement("div", { className: "flex justify-center gap-2 mt-8" }, [
    { id: "all", label: "All Options" },
    { id: "private", label: "Private Deluxe & Premium" },
    { id: "dorm", label: "Backpacker Bunk Dorms" }
  ].map((tab) => /* @__PURE__ */ React.createElement(
    "button",
    {
      key: tab.id,
      onClick: () => setFilter(tab.id),
      className: `px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition ${filter === tab.id ? "bg-forest-900 text-amber-300 shadow-md" : "bg-white text-stone-700 border border-stone-200 hover:bg-stone-50"}`
    },
    tab.label
  )))), /* @__PURE__ */ React.createElement("div", { className: "space-y-10" }, filteredRooms.map((room, index) => /* @__PURE__ */ React.createElement(
    "div",
    {
      key: room.id,
      className: "bg-white rounded-3xl overflow-hidden border border-stone-200/90 shadow-md hover:shadow-xl transition-all duration-300 grid grid-cols-1 lg:grid-cols-12 gap-0"
    },
    /* @__PURE__ */ React.createElement("div", { className: "lg:col-span-5 relative min-h-[300px] lg:min-h-full" }, /* @__PURE__ */ React.createElement(
      "img",
      {
        src: room.image,
        alt: room.name,
        className: "w-full h-full object-cover"
      }
    ), /* @__PURE__ */ React.createElement("div", { className: "absolute top-4 left-4 bg-forest-950/85 backdrop-blur-md text-amber-300 font-serif text-xs px-3 py-1.5 rounded-full font-bold" }, room.type)),
    /* @__PURE__ */ React.createElement("div", { className: "lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap justify-between items-baseline gap-2 mb-2" }, /* @__PURE__ */ React.createElement("h2", { className: "font-serif text-2xl sm:text-3xl font-bold text-forest-950" }, room.name), /* @__PURE__ */ React.createElement("div", { className: "text-right" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-baseline gap-1" }, /* @__PURE__ */ React.createElement("span", { className: "text-2xl font-black text-forest-950" }, "\u20B9", room.price), /* @__PURE__ */ React.createElement("span", { className: "text-xs text-stone-500 font-medium" }, "/night + taxes")), room.originalPrice && /* @__PURE__ */ React.createElement("span", { className: "text-xs text-stone-400 line-through" }, "\u20B9", room.originalPrice))), /* @__PURE__ */ React.createElement("p", { className: "text-stone-600 text-sm leading-relaxed mb-6" }, room.description), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6 bg-warmCream p-4 rounded-2xl border border-stone-200/60 text-xs" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("span", { className: "text-stone-500 block font-medium" }, "Capacity"), /* @__PURE__ */ React.createElement("span", { className: "font-bold text-forest-950" }, room.capacity)), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("span", { className: "text-stone-500 block font-medium" }, "Bed Setup"), /* @__PURE__ */ React.createElement("span", { className: "font-bold text-forest-950" }, room.bed)), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("span", { className: "text-stone-500 block font-medium" }, "Room Size"), /* @__PURE__ */ React.createElement("span", { className: "font-bold text-forest-950" }, room.size || "280 sq.ft"))), /* @__PURE__ */ React.createElement("div", { className: "mb-6" }, /* @__PURE__ */ React.createElement("h4", { className: "text-xs font-bold uppercase tracking-wider text-stone-500 mb-2" }, "Included Amenities:"), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs" }, room.amenities.map((item, idx) => /* @__PURE__ */ React.createElement("div", { key: idx, className: "flex items-center gap-2 text-stone-700" }, /* @__PURE__ */ React.createElement("span", { className: "text-emerald-600 font-bold" }, "\u2713"), /* @__PURE__ */ React.createElement("span", null, item)))))), /* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-stone-200" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2 text-xs text-stone-500" }, /* @__PURE__ */ React.createElement("span", null, "\u26A1 Instant Confirmation"), /* @__PURE__ */ React.createElement("span", null, "\u2022"), /* @__PURE__ */ React.createElement("span", null, "\u{1F6E1}\uFE0F Free Cancellation up to 48 hrs")), /* @__PURE__ */ React.createElement("div", { className: "flex gap-3 w-full sm:w-auto" }, /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: () => setViewingRoom(room),
        className: "flex-1 sm:flex-none px-5 py-2.5 text-xs font-bold border border-stone-300 hover:bg-stone-100 rounded-xl transition"
      },
      "View Photos"
    ), /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: () => openBookingEngine(room),
        className: "flex-1 sm:flex-none px-6 py-2.5 text-xs font-bold bg-amber-500 hover:bg-amber-600 text-forest-950 rounded-xl shadow transition"
      },
      "Book This Room Now \u2192"
    ))))
  )))));
}
function AboutPage({ hotelConfig, setCurrentPage }) {
  return /* @__PURE__ */ React.createElement("div", { className: "py-12 md:py-20" }, /* @__PURE__ */ React.createElement("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" }, /* @__PURE__ */ React.createElement("div", { className: "text-center max-w-3xl mx-auto mb-16" }, /* @__PURE__ */ React.createElement("span", { className: "text-amber-600 font-bold text-xs uppercase tracking-widest" }, "Our Story & Heritage"), /* @__PURE__ */ React.createElement("h1", { className: "font-serif text-4xl sm:text-5xl font-bold text-forest-950 mt-2 mb-4" }, "Welcome to Checkinn Homes"), /* @__PURE__ */ React.createElement("p", { className: "text-stone-600 text-base leading-relaxed" }, "A serene haven perched in Upper Tapovan, built to make every traveler feel at home in the Yoga Capital of the World.")), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h2", { className: "font-serif text-2xl sm:text-3xl font-bold text-forest-950 mb-4" }, "Born from a Passion for Rishikesh & Authentic Hospitality"), /* @__PURE__ */ React.createElement("div", { className: "space-y-4 text-stone-600 text-sm sm:text-base leading-relaxed" }, /* @__PURE__ */ React.createElement("p", null, "Checkinn Homes was founded with one clear vision: to offer a clean, peaceful, and warm stay for seekers, adventurers, yogis, and families who want to experience the authentic magic of Rishikesh without noise and clutter."), /* @__PURE__ */ React.createElement("p", null, "Located right along Secret Waterfall Road near Kundan Restaurant, our home provides the rare sweet spot of Rishikesh stays: secluded enough to hear birds chirping and mountain winds in the morning, yet only a short walking distance from the bustling cafes, yoga studios, and iconic footbridges of Tapovan."), /* @__PURE__ */ React.createElement("p", null, "From high-speed fiber internet for your workstation to piping hot geysers after an evening Ganga Aarti, every corner of Checkinn Homes is maintained with love and care."), /* @__PURE__ */ React.createElement("p", null, "We welcome guests for quick weekend breaks as well as longer yoga courses and workations. Our team stays available throughout your visit, whether you need help planning an early-morning temple trip, finding a trusted cab, or simply choosing a quiet cafe for the afternoon.")), /* @__PURE__ */ React.createElement("div", { className: "mt-8 flex gap-4" }, /* @__PURE__ */ React.createElement("div", { className: "p-4 bg-white rounded-2xl border border-stone-200" }, /* @__PURE__ */ React.createElement("span", { className: "font-serif text-3xl font-bold text-forest-950 block" }, "4.9/5"), /* @__PURE__ */ React.createElement("span", { className: "text-xs text-stone-500 font-medium" }, "Guest Satisfaction Score")), /* @__PURE__ */ React.createElement("div", { className: "p-4 bg-white rounded-2xl border border-stone-200" }, /* @__PURE__ */ React.createElement("span", { className: "font-serif text-3xl font-bold text-forest-950 block" }, "100%"), /* @__PURE__ */ React.createElement("span", { className: "text-xs text-stone-500 font-medium" }, "Cleanliness Guarantee")))), /* @__PURE__ */ React.createElement("div", { className: "relative" }, /* @__PURE__ */ React.createElement(
    "img",
    {
      src: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80",
      alt: "Rishikesh View",
      className: "rounded-3xl shadow-2xl object-cover w-full h-[460px]"
    }
  ), /* @__PURE__ */ React.createElement("div", { className: "absolute -bottom-6 -left-6 bg-forest-900 text-amber-300 p-6 rounded-3xl shadow-xl max-w-xs hidden sm:block border border-forest-800" }, /* @__PURE__ */ React.createElement("p", { className: "font-serif text-lg font-bold" }, '"Atithi Devo Bhava"'), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-stone-300 mt-1" }, "In Rishikesh, every guest is family. We look forward to hosting your journey.")))), /* @__PURE__ */ React.createElement("section", { className: "mb-20" }, /* @__PURE__ */ React.createElement("div", { className: "max-w-3xl mb-10" }, /* @__PURE__ */ React.createElement("span", { className: "text-amber-600 font-bold text-xs uppercase tracking-widest" }, "More Than a Room"), /* @__PURE__ */ React.createElement("h2", { className: "font-serif text-3xl sm:text-4xl font-bold text-forest-950 mt-2 mb-4" }, "A Stay Designed Around Your Rishikesh Journey"), /* @__PURE__ */ React.createElement("p", { className: "text-stone-600 text-sm sm:text-base leading-relaxed" }, "Every guest arrives with a different plan. Some come to slow down, some to complete a yoga course, and others to explore the river and mountains. We keep the experience flexible, comfortable, and genuinely local from check-in to departure.")), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-8 border-y border-stone-200 py-10" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("span", { className: "text-3xl", "aria-hidden": "true" }, "\u{1F6CF}\uFE0F"), /* @__PURE__ */ React.createElement("h3", { className: "font-serif text-xl font-bold text-forest-950 mt-4 mb-2" }, "Rest Well"), /* @__PURE__ */ React.createElement("p", { className: "text-sm text-stone-600 leading-relaxed" }, "Comfortable beds, fresh linen, private and shared room choices, hot water, and quiet nights help you recover after a full day outdoors.")), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("span", { className: "text-3xl", "aria-hidden": "true" }, "\u{1F4BB}"), /* @__PURE__ */ React.createElement("h3", { className: "font-serif text-xl font-bold text-forest-950 mt-4 mb-2" }, "Stay Connected"), /* @__PURE__ */ React.createElement("p", { className: "text-sm text-stone-600 leading-relaxed" }, "Reliable 100 Mbps fibre Wi-Fi and practical workspaces make longer stays easy for remote professionals, creators, and students.")), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("span", { className: "text-3xl", "aria-hidden": "true" }, "\u{1F9ED}"), /* @__PURE__ */ React.createElement("h3", { className: "font-serif text-xl font-bold text-forest-950 mt-4 mb-2" }, "Explore Like a Local"), /* @__PURE__ */ React.createElement("p", { className: "text-sm text-stone-600 leading-relaxed" }, "Ask us about waterfall trails, rafting, yoga classes, scooter rentals, airport transfers, and honest neighborhood recommendations.")))), /* @__PURE__ */ React.createElement("section", { className: "grid grid-cols-1 lg:grid-cols-2 gap-10 items-center mb-20 bg-forest-950 text-white overflow-hidden" }, /* @__PURE__ */ React.createElement(
    "img",
    {
      src: "https://images.unsplash.com/photo-1518002171953-a080ee817e1f?auto=format&fit=crop&w=1000&q=85",
      alt: "Ganga valley and Himalayan landscape near Tapovan",
      className: "w-full h-80 lg:h-full min-h-[380px] object-cover"
    }
  ), /* @__PURE__ */ React.createElement("div", { className: "px-7 pb-10 lg:py-12 lg:pr-12 lg:pl-2" }, /* @__PURE__ */ React.createElement("span", { className: "text-amber-400 font-bold text-xs uppercase tracking-widest" }, "Our Neighborhood"), /* @__PURE__ */ React.createElement("h2", { className: "font-serif text-3xl sm:text-4xl font-bold mt-2 mb-5" }, "Upper Tapovan at Your Doorstep"), /* @__PURE__ */ React.createElement("p", { className: "text-stone-300 text-sm leading-relaxed mb-6" }, "Checkinn Homes sits near Secret Waterfall Road, close to the experiences that make Rishikesh special while remaining removed from the busiest traffic. Start your morning with a forest walk, join a yoga class, work from a nearby cafe, or head toward the Ganga for sunset."), /* @__PURE__ */ React.createElement("ul", { className: "grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm text-stone-200" }, /* @__PURE__ */ React.createElement("li", { className: "flex gap-2" }, /* @__PURE__ */ React.createElement("span", { className: "text-amber-400" }, "\u2713"), " Secret Waterfall trail nearby"), /* @__PURE__ */ React.createElement("li", { className: "flex gap-2" }, /* @__PURE__ */ React.createElement("span", { className: "text-amber-400" }, "\u2713"), " Cafes and restaurants on foot"), /* @__PURE__ */ React.createElement("li", { className: "flex gap-2" }, /* @__PURE__ */ React.createElement("span", { className: "text-amber-400" }, "\u2713"), " Easy access to yoga studios"), /* @__PURE__ */ React.createElement("li", { className: "flex gap-2" }, /* @__PURE__ */ React.createElement("span", { className: "text-amber-400" }, "\u2713"), " Local transport assistance")))), /* @__PURE__ */ React.createElement("div", { className: "bg-white rounded-3xl p-8 sm:p-12 border border-stone-200 mb-16" }, /* @__PURE__ */ React.createElement("h3", { className: "font-serif text-2xl font-bold text-forest-950 text-center mb-8" }, "What Defines Stay at Checkinn Homes"), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-8" }, /* @__PURE__ */ React.createElement("div", { className: "text-center p-4" }, /* @__PURE__ */ React.createElement("div", { className: "w-14 h-14 mx-auto rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center text-2xl mb-4" }, "\u{1F54A}\uFE0F"), /* @__PURE__ */ React.createElement("h4", { className: "font-bold text-forest-950 mb-2" }, "Peaceful Solitude"), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-stone-600 leading-relaxed" }, "Away from high-traffic horns, providing optimal silence for meditation, study, and deep sleep.")), /* @__PURE__ */ React.createElement("div", { className: "text-center p-4" }, /* @__PURE__ */ React.createElement("div", { className: "w-14 h-14 mx-auto rounded-2xl bg-emerald-100 text-forest-800 flex items-center justify-center text-2xl mb-4" }, "\u{1F91D}"), /* @__PURE__ */ React.createElement("h4", { className: "font-bold text-forest-950 mb-2" }, "Personalized Host Support"), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-stone-600 leading-relaxed" }, "Get genuine local recommendations, secret swimming spots, and adventure bookings without middlemen markups.")), /* @__PURE__ */ React.createElement("div", { className: "text-center p-4" }, /* @__PURE__ */ React.createElement("div", { className: "w-14 h-14 mx-auto rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center text-2xl mb-4" }, "\u2728"), /* @__PURE__ */ React.createElement("h4", { className: "font-bold text-forest-950 mb-2" }, "Spotless Hygiene"), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-stone-600 leading-relaxed" }, "Crisp white linens, deeply sanitized bathrooms, and fresh mountain air in all rooms.")))), /* @__PURE__ */ React.createElement("div", { className: "text-center" }, /* @__PURE__ */ React.createElement("h3", { className: "font-serif text-2xl font-bold text-forest-950 mb-3" }, "Have questions before booking?"), /* @__PURE__ */ React.createElement("p", { className: "text-stone-600 text-sm mb-6" }, "Talk directly with our property manager right now."), /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => {
        setCurrentPage("contact");
        window.scrollTo(0, 0);
      },
      className: "bg-forest-900 hover:bg-forest-800 text-amber-300 font-bold px-8 py-3 rounded-full text-sm shadow transition"
    },
    "Contact & Directions \u2192"
  ))));
}
function ContactPage({ hotelConfig, onAddQuery }) {
  var _a;
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "Stay Inquiry",
    message: ""
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.phone || !contactForm.message) {
      alert("Please fill out all required fields.");
      return;
    }
    const newQuery = {
      id: "qry-" + Date.now(),
      name: contactForm.name,
      email: contactForm.email || "N/A",
      phone: contactForm.phone,
      subject: contactForm.subject,
      message: contactForm.message,
      date: "Just now",
      status: "New"
    };
    onAddQuery(newQuery);
    setContactForm({
      name: "",
      email: "",
      phone: "",
      subject: "Stay Inquiry",
      message: ""
    });
  };
  return /* @__PURE__ */ React.createElement("div", { className: "py-12 md:py-20" }, /* @__PURE__ */ React.createElement("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" }, /* @__PURE__ */ React.createElement("div", { className: "text-center max-w-3xl mx-auto mb-14" }, /* @__PURE__ */ React.createElement("span", { className: "text-amber-600 font-bold text-xs uppercase tracking-widest" }, "Connect With Us"), /* @__PURE__ */ React.createElement("h1", { className: "font-serif text-4xl sm:text-5xl font-bold text-forest-950 mt-2 mb-4" }, "Contact & Location"), /* @__PURE__ */ React.createElement("p", { className: "text-stone-600 text-sm sm:text-base leading-relaxed" }, "Need help reaching Upper Tapovan or have queries about group retreats, bike rentals, or river rafting? We are always here.")), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 lg:grid-cols-12 gap-10" }, /* @__PURE__ */ React.createElement("div", { className: "lg:col-span-5 space-y-6" }, /* @__PURE__ */ React.createElement("div", { className: "bg-white rounded-3xl p-7 border border-stone-200 shadow-sm" }, /* @__PURE__ */ React.createElement("h3", { className: "font-serif text-xl font-bold text-forest-950 mb-6" }, "Stay Address & Desk"), /* @__PURE__ */ React.createElement("div", { className: "space-y-6" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-start gap-4" }, /* @__PURE__ */ React.createElement("div", { className: "w-10 h-10 rounded-xl bg-forest-50 text-forest-800 flex items-center justify-center shrink-0 text-lg" }, "\u{1F4CD}"), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h4", { className: "text-xs font-bold uppercase tracking-wider text-stone-400" }, "Address"), /* @__PURE__ */ React.createElement("p", { className: "text-sm font-semibold text-forest-950 mt-1 leading-snug" }, hotelConfig.location), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-amber-600 font-medium mt-1" }, "Landmark: Behind Kundan Restaurant, Upper Tapovan"))), /* @__PURE__ */ React.createElement("div", { className: "flex items-start gap-4" }, /* @__PURE__ */ React.createElement("div", { className: "w-10 h-10 rounded-xl bg-forest-50 text-forest-800 flex items-center justify-center shrink-0 text-lg" }, "\u{1F4DE}"), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h4", { className: "text-xs font-bold uppercase tracking-wider text-stone-400" }, "Phone / WhatsApp"), /* @__PURE__ */ React.createElement("a", { href: `tel:${hotelConfig.phone}`, className: "text-sm font-bold text-forest-950 hover:text-amber-600 block mt-1" }, hotelConfig.phone), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-stone-500" }, "Available 24/7 for guest assistance & check-ins"))), /* @__PURE__ */ React.createElement("div", { className: "flex items-start gap-4" }, /* @__PURE__ */ React.createElement("div", { className: "w-10 h-10 rounded-xl bg-forest-50 text-forest-800 flex items-center justify-center shrink-0 text-lg" }, "\u2709\uFE0F"), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h4", { className: "text-xs font-bold uppercase tracking-wider text-stone-400" }, "Official Email"), /* @__PURE__ */ React.createElement("a", { href: `mailto:${hotelConfig.email}`, className: "text-sm font-bold text-forest-950 hover:text-amber-600 block mt-1" }, hotelConfig.email)))), /* @__PURE__ */ React.createElement("div", { className: "mt-8 pt-6 border-t border-stone-100" }, /* @__PURE__ */ React.createElement(
    "a",
    {
      href: `https://wa.me/${(_a = hotelConfig.whatsapp) == null ? void 0 : _a.replace(/[^0-9]/g, "")}?text=Hello%20Checkinn%20Homes,%20I%20have%20an%20inquiry`,
      target: "_blank",
      rel: "noreferrer",
      className: "w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl flex items-center justify-center gap-2 text-sm shadow transition"
    },
    /* @__PURE__ */ React.createElement("span", null, "\u{1F4AC}"),
    " Chat Instantly on WhatsApp"
  ))), /* @__PURE__ */ React.createElement("div", { className: "bg-forest-900 text-white rounded-3xl p-6 border border-forest-800" }, /* @__PURE__ */ React.createElement("h4", { className: "font-serif text-lg font-bold text-amber-300 mb-2" }, "Check-in / Out Timings"), /* @__PURE__ */ React.createElement("div", { className: "flex justify-between text-xs sm:text-sm py-2 border-b border-forest-800" }, /* @__PURE__ */ React.createElement("span", { className: "text-stone-300" }, "Standard Check-In:"), /* @__PURE__ */ React.createElement("span", { className: "font-bold" }, hotelConfig.checkInTime)), /* @__PURE__ */ React.createElement("div", { className: "flex justify-between text-xs sm:text-sm py-2" }, /* @__PURE__ */ React.createElement("span", { className: "text-stone-300" }, "Standard Check-Out:"), /* @__PURE__ */ React.createElement("span", { className: "font-bold" }, hotelConfig.checkOutTime)), /* @__PURE__ */ React.createElement("p", { className: "text-[11px] text-stone-400 mt-2" }, "*Early check-in & late check-out subject to availability upon request."))), /* @__PURE__ */ React.createElement("div", { className: "lg:col-span-7" }, /* @__PURE__ */ React.createElement("div", { className: "bg-white rounded-3xl p-8 border border-stone-200 shadow-sm" }, /* @__PURE__ */ React.createElement("h3", { className: "font-serif text-2xl font-bold text-forest-950 mb-2" }, "Send Us a Direct Message"), /* @__PURE__ */ React.createElement("p", { className: "text-stone-600 text-xs sm:text-sm mb-6" }, "Leave your query below and it will instantly reach our staff admin panel and support team."), /* @__PURE__ */ React.createElement("form", { onSubmit: handleSubmit, className: "space-y-4" }, /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-xs font-bold uppercase text-stone-500 mb-1" }, "Your Full Name *"), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "text",
      placeholder: "e.g. Rahul Sharma",
      value: contactForm.name,
      onChange: (e) => setContactForm(__spreadProps(__spreadValues({}, contactForm), { name: e.target.value })),
      className: "w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-forest-800 font-medium bg-stone-50/50",
      required: true
    }
  )), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-xs font-bold uppercase text-stone-500 mb-1" }, "Phone / WhatsApp Number *"), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "tel",
      placeholder: "e.g. +91 98765 43210",
      value: contactForm.phone,
      onChange: (e) => setContactForm(__spreadProps(__spreadValues({}, contactForm), { phone: e.target.value })),
      className: "w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-forest-800 font-medium bg-stone-50/50",
      required: true
    }
  ))), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-xs font-bold uppercase text-stone-500 mb-1" }, "Email Address"), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "email",
      placeholder: "name@domain.com",
      value: contactForm.email,
      onChange: (e) => setContactForm(__spreadProps(__spreadValues({}, contactForm), { email: e.target.value })),
      className: "w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-forest-800 font-medium bg-stone-50/50"
    }
  )), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-xs font-bold uppercase text-stone-500 mb-1" }, "Inquiry Topic"), /* @__PURE__ */ React.createElement(
    "select",
    {
      value: contactForm.subject,
      onChange: (e) => setContactForm(__spreadProps(__spreadValues({}, contactForm), { subject: e.target.value })),
      className: "w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-forest-800 font-medium bg-stone-50/50 cursor-pointer"
    },
    /* @__PURE__ */ React.createElement("option", { value: "Room Booking Inquiry" }, "Room Booking Inquiry"),
    /* @__PURE__ */ React.createElement("option", { value: "Long Term / Workation Discount" }, "Long Term / Workation Discount"),
    /* @__PURE__ */ React.createElement("option", { value: "Yoga Group / Retreat Stay" }, "Yoga Group / Retreat Stay"),
    /* @__PURE__ */ React.createElement("option", { value: "Scooty / Cab / Rafting Support" }, "Scooty / Cab / Rafting Support"),
    /* @__PURE__ */ React.createElement("option", { value: "Other Question" }, "Other Question")
  ))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-xs font-bold uppercase text-stone-500 mb-1" }, "Message Details *"), /* @__PURE__ */ React.createElement(
    "textarea",
    {
      rows: "4",
      placeholder: "Tell us about your dates, number of guests, or special requirements...",
      value: contactForm.message,
      onChange: (e) => setContactForm(__spreadProps(__spreadValues({}, contactForm), { message: e.target.value })),
      className: "w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-forest-800 font-medium bg-stone-50/50",
      required: true
    }
  )), /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "submit",
      className: "w-full py-3.5 bg-forest-900 hover:bg-forest-800 text-amber-300 font-bold rounded-2xl shadow transition"
    },
    "Submit Message to Team \u2192"
  ))))), /* @__PURE__ */ React.createElement("div", { className: "mt-14 bg-white p-4 rounded-3xl border border-stone-200 shadow-sm overflow-hidden" }, /* @__PURE__ */ React.createElement("div", { className: "flex justify-between items-center px-4 py-2 mb-2" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h4", { className: "font-serif font-bold text-forest-950" }, "Map & Neighborhood"), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-stone-500" }, "Upper Tapovan, Rishikesh 249192")), /* @__PURE__ */ React.createElement(
    "a",
    {
      href: "https://maps.google.com/?q=Tapovan+Rishikesh",
      target: "_blank",
      rel: "noreferrer",
      className: "text-xs font-bold text-forest-800 hover:text-amber-600 flex items-center gap-1"
    },
    "Open in Google Maps \u2197"
  )), /* @__PURE__ */ React.createElement("div", { className: "w-full h-80 rounded-2xl overflow-hidden bg-stone-200 relative" }, /* @__PURE__ */ React.createElement(
    "iframe",
    {
      title: "Checkinn Homes Rishikesh Location",
      src: "https://maps.google.com/maps?q=Tapovan,Rishikesh,Uttarakhand&t=&z=14&ie=UTF8&iwloc=&output=embed",
      className: "w-full h-full border-0 filter contrast-105",
      loading: "lazy"
    }
  )))));
}
function FeedbackPage({ reviews, rooms, onAddReview }) {
  var _a;
  const [reviewForm, setReviewForm] = useState({
    name: "",
    city: "",
    rating: 5,
    room: ((_a = rooms[0]) == null ? void 0 : _a.name) || "Premium Room",
    comment: ""
  });
  const handleSubmitReview = (e) => {
    var _a2;
    e.preventDefault();
    if (!reviewForm.name || !reviewForm.comment) {
      alert("Please enter your name and comments.");
      return;
    }
    const newReview = {
      id: "rev-" + Date.now(),
      name: reviewForm.name,
      city: reviewForm.city || "Traveler",
      rating: Number(reviewForm.rating),
      room: reviewForm.room,
      date: "Just now",
      comment: reviewForm.comment,
      avatar: `https://images.unsplash.com/photo-${1535713875002 + Math.floor(Math.random() * 1e3)}?auto=format&fit=crop&w=150&q=80`,
      approved: true
    };
    onAddReview(newReview);
    setReviewForm({
      name: "",
      city: "",
      rating: 5,
      room: ((_a2 = rooms[0]) == null ? void 0 : _a2.name) || "Premium Room",
      comment: ""
    });
  };
  return /* @__PURE__ */ React.createElement("div", { className: "py-12 md:py-20" }, /* @__PURE__ */ React.createElement("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" }, /* @__PURE__ */ React.createElement("div", { className: "text-center max-w-3xl mx-auto mb-16" }, /* @__PURE__ */ React.createElement("span", { className: "text-amber-600 font-bold text-xs uppercase tracking-widest" }, "Community Stories"), /* @__PURE__ */ React.createElement("h1", { className: "font-serif text-4xl sm:text-5xl font-bold text-forest-950 mt-2 mb-4" }, "Guest Reviews & Feedback"), /* @__PURE__ */ React.createElement("p", { className: "text-stone-600 text-sm sm:text-base leading-relaxed" }, "We believe in genuine hospitality. Read recent experiences from our guests or share your own memory of staying with us in Rishikesh.")), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 lg:grid-cols-12 gap-10" }, /* @__PURE__ */ React.createElement("div", { className: "lg:col-span-5" }, /* @__PURE__ */ React.createElement("div", { className: "bg-white rounded-3xl p-8 border border-stone-200 shadow-md sticky top-28" }, /* @__PURE__ */ React.createElement("h3", { className: "font-serif text-2xl font-bold text-forest-950 mb-1" }, "Share Your Stay Story"), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-stone-500 mb-6" }, "Your feedback helps fellow travelers find peaceful stays in Tapovan."), /* @__PURE__ */ React.createElement("form", { onSubmit: handleSubmitReview, className: "space-y-4" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-xs font-bold uppercase text-stone-500 mb-1" }, "Your Name *"), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "text",
      placeholder: "e.g. Priya & Ankit",
      value: reviewForm.name,
      onChange: (e) => setReviewForm(__spreadProps(__spreadValues({}, reviewForm), { name: e.target.value })),
      className: "w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm font-medium bg-stone-50/60 focus:outline-none focus:ring-2 focus:ring-forest-800",
      required: true
    }
  )), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-2 gap-3" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-xs font-bold uppercase text-stone-500 mb-1" }, "City / Country"), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "text",
      placeholder: "e.g. Mumbai, India",
      value: reviewForm.city,
      onChange: (e) => setReviewForm(__spreadProps(__spreadValues({}, reviewForm), { city: e.target.value })),
      className: "w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm font-medium bg-stone-50/60 focus:outline-none focus:ring-2 focus:ring-forest-800"
    }
  )), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-xs font-bold uppercase text-stone-500 mb-1" }, "Star Rating"), /* @__PURE__ */ React.createElement(
    "select",
    {
      value: reviewForm.rating,
      onChange: (e) => setReviewForm(__spreadProps(__spreadValues({}, reviewForm), { rating: e.target.value })),
      className: "w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm font-bold bg-stone-50/60 focus:outline-none focus:ring-2 focus:ring-forest-800 text-amber-600"
    },
    /* @__PURE__ */ React.createElement("option", { value: "5" }, "\u2B50\u2B50\u2B50\u2B50\u2B50 (5/5)"),
    /* @__PURE__ */ React.createElement("option", { value: "4" }, "\u2B50\u2B50\u2B50\u2B50 (4/5)"),
    /* @__PURE__ */ React.createElement("option", { value: "3" }, "\u2B50\u2B50\u2B50 (3/5)"),
    /* @__PURE__ */ React.createElement("option", { value: "2" }, "\u2B50\u2B50 (2/5)"),
    /* @__PURE__ */ React.createElement("option", { value: "1" }, "\u2B50 (1/5)")
  ))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-xs font-bold uppercase text-stone-500 mb-1" }, "Room Stayed In"), /* @__PURE__ */ React.createElement(
    "select",
    {
      value: reviewForm.room,
      onChange: (e) => setReviewForm(__spreadProps(__spreadValues({}, reviewForm), { room: e.target.value })),
      className: "w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm font-medium bg-stone-50/60 focus:outline-none focus:ring-2 focus:ring-forest-800"
    },
    rooms.map((r) => /* @__PURE__ */ React.createElement("option", { key: r.id, value: r.name }, r.name))
  )), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-xs font-bold uppercase text-stone-500 mb-1" }, "Your Honest Review *"), /* @__PURE__ */ React.createElement(
    "textarea",
    {
      rows: "4",
      placeholder: "How was the room cleanliness, waterfall walk, staff assistance, and Wi-Fi speed?",
      value: reviewForm.comment,
      onChange: (e) => setReviewForm(__spreadProps(__spreadValues({}, reviewForm), { comment: e.target.value })),
      className: "w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm font-medium bg-stone-50/60 focus:outline-none focus:ring-2 focus:ring-forest-800",
      required: true
    }
  )), /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "submit",
      className: "w-full py-3 bg-amber-500 hover:bg-amber-600 text-forest-950 font-bold rounded-xl shadow transition"
    },
    "Post Review to Website \u2B50"
  )))), /* @__PURE__ */ React.createElement("div", { className: "lg:col-span-7 space-y-6" }, /* @__PURE__ */ React.createElement("div", { className: "flex justify-between items-center mb-2" }, /* @__PURE__ */ React.createElement("h3", { className: "font-serif text-2xl font-bold text-forest-950" }, "Verified Stories (", reviews.length, ")"), /* @__PURE__ */ React.createElement("span", { className: "text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200" }, "4.9 Average Rating")), reviews.map((rev) => /* @__PURE__ */ React.createElement("div", { key: rev.id, className: "bg-white rounded-3xl p-6 border border-stone-200 shadow-sm hover:shadow-md transition" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-start justify-between gap-4 mb-3" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-3" }, /* @__PURE__ */ React.createElement(
    "img",
    {
      src: rev.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
      alt: rev.name,
      className: "w-12 h-12 rounded-full object-cover border border-stone-300"
    }
  ), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h4", { className: "font-bold text-forest-950 text-sm" }, rev.name), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-stone-500" }, rev.city, " \u2022 ", /* @__PURE__ */ React.createElement("span", { className: "text-amber-700 font-semibold" }, rev.room)))), /* @__PURE__ */ React.createElement("div", { className: "text-right" }, /* @__PURE__ */ React.createElement("div", { className: "flex text-amber-400 text-sm" }, Array.from({ length: rev.rating }).map((_, i) => /* @__PURE__ */ React.createElement("span", { key: i }, "\u2605"))), /* @__PURE__ */ React.createElement("span", { className: "text-[11px] text-stone-400" }, rev.date))), /* @__PURE__ */ React.createElement("p", { className: "text-stone-700 text-sm leading-relaxed italic font-serif" }, '"', rev.comment, '"')))))));
}
function AdminPanel({
  rooms,
  setRooms,
  bookings,
  setBookings,
  queries,
  setQueries,
  reviews,
  setReviews,
  hotelConfig,
  setHotelConfig,
  showToast
}) {
  const [adminTab, setAdminTab] = useState("dashboard");
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [passcode, setPasscode] = useState("");
  const [editingRoom, setEditingRoom] = useState(null);
  const totalRevenue = useMemo(() => {
    return bookings.reduce((sum, b) => sum + (Number(b.totalAmount) || 0), 0);
  }, [bookings]);
  const handleSaveRoom = (e) => {
    e.preventDefault();
    setRooms(rooms.map((r) => r.id === editingRoom.id ? editingRoom : r));
    setEditingRoom(null);
    showToast(`Room "${editingRoom.name}" updated successfully!`);
  };
  const updateBookingStatus = (bookingId, newStatus) => {
    setBookings(bookings.map((b) => b.id === bookingId ? __spreadProps(__spreadValues({}, b), { status: newStatus }) : b));
    showToast(`Booking ${bookingId} status updated to ${newStatus}`);
  };
  const deleteQuery = (queryId) => {
    setQueries(queries.filter((q) => q.id !== queryId));
    showToast("Query deleted.");
  };
  const toggleQueryStatus = (queryId) => {
    setQueries(queries.map((q) => q.id === queryId ? __spreadProps(__spreadValues({}, q), { status: q.status === "Resolved" ? "New" : "Resolved" }) : q));
    showToast("Query status updated.");
  };
  return /* @__PURE__ */ React.createElement("div", { className: "py-8 bg-stone-100 min-h-[85vh]" }, /* @__PURE__ */ React.createElement("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" }, /* @__PURE__ */ React.createElement("div", { className: "bg-forest-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2" }, /* @__PURE__ */ React.createElement("span", { className: "text-amber-400 text-xs font-mono font-bold bg-forest-900 px-3 py-1 rounded-full border border-emerald-500/30" }, "\u25CF HOSTINGER MySQL BACKEND READY")), /* @__PURE__ */ React.createElement("h1", { className: "font-serif text-2xl sm:text-3xl font-bold mt-2" }, "Checkinn Homes Admin Portal"), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-stone-300 mt-1" }, "Control live rates, room details, bookings, inquiries & Hostinger database synchronization.")), /* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap gap-1.5 bg-forest-900 p-1.5 rounded-2xl border border-white/10" }, [
    { id: "dashboard", label: "\u{1F4CA} Dashboard" },
    { id: "bookings", label: `\u{1F4D1} Bookings (${bookings.length})` },
    { id: "rooms", label: `\u{1F6CF}\uFE0F Rooms (${rooms.length})` },
    { id: "queries", label: `\u{1F4AC} Queries (${queries.filter((q) => q.status === "New").length} new)` },
    { id: "feedback", label: `\u2B50 Reviews (${reviews.length})` },
    { id: "mysql", label: "\u{1F5C4}\uFE0F Hostinger DB" }
  ].map((tab) => /* @__PURE__ */ React.createElement(
    "button",
    {
      key: tab.id,
      onClick: () => setAdminTab(tab.id),
      className: `px-3 py-1.5 rounded-xl text-xs font-bold transition ${adminTab === tab.id ? "bg-amber-500 text-forest-950 shadow" : "text-stone-300 hover:text-white hover:bg-forest-800"}`
    },
    tab.label
  )))), adminTab === "dashboard" && /* @__PURE__ */ React.createElement("div", { className: "space-y-8" }, /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" }, /* @__PURE__ */ React.createElement("div", { className: "bg-white p-6 rounded-3xl border border-stone-200 shadow-sm" }, /* @__PURE__ */ React.createElement("span", { className: "text-xs font-bold uppercase text-stone-400" }, "Total Bookings"), /* @__PURE__ */ React.createElement("h3", { className: "font-serif text-3xl font-bold text-forest-950 mt-1" }, bookings.length), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-emerald-600 font-medium mt-1" }, "\u2191 100% Active in Tapovan")), /* @__PURE__ */ React.createElement("div", { className: "bg-white p-6 rounded-3xl border border-stone-200 shadow-sm" }, /* @__PURE__ */ React.createElement("span", { className: "text-xs font-bold uppercase text-stone-400" }, "Gross Booking Value"), /* @__PURE__ */ React.createElement("h3", { className: "font-serif text-3xl font-bold text-forest-950 mt-1" }, "\u20B9", totalRevenue.toLocaleString("en-IN")), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-stone-500 font-medium mt-1" }, "Direct website conversions")), /* @__PURE__ */ React.createElement("div", { className: "bg-white p-6 rounded-3xl border border-stone-200 shadow-sm" }, /* @__PURE__ */ React.createElement("span", { className: "text-xs font-bold uppercase text-stone-400" }, "Unanswered Queries"), /* @__PURE__ */ React.createElement("h3", { className: "font-serif text-3xl font-bold text-amber-600 mt-1" }, queries.filter((q) => q.status === "New").length), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-stone-500 font-medium mt-1" }, "From contact & WhatsApp page")), /* @__PURE__ */ React.createElement("div", { className: "bg-white p-6 rounded-3xl border border-stone-200 shadow-sm" }, /* @__PURE__ */ React.createElement("span", { className: "text-xs font-bold uppercase text-stone-400" }, "Average Rating"), /* @__PURE__ */ React.createElement("h3", { className: "font-serif text-3xl font-bold text-forest-950 mt-1" }, "4.9 \u2605"), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-emerald-600 font-medium mt-1" }, reviews.length, " Verified guest reviews"))), /* @__PURE__ */ React.createElement("div", { className: "bg-white rounded-3xl p-6 border border-stone-200 shadow-sm" }, /* @__PURE__ */ React.createElement("div", { className: "flex justify-between items-center mb-6" }, /* @__PURE__ */ React.createElement("h3", { className: "font-serif text-xl font-bold text-forest-950" }, "Recent Direct Reservations"), /* @__PURE__ */ React.createElement("button", { onClick: () => setAdminTab("bookings"), className: "text-xs font-bold text-amber-600 hover:underline" }, "View All \u2192")), /* @__PURE__ */ React.createElement("div", { className: "overflow-x-auto" }, /* @__PURE__ */ React.createElement("table", { className: "w-full text-left text-xs sm:text-sm" }, /* @__PURE__ */ React.createElement("thead", null, /* @__PURE__ */ React.createElement("tr", { className: "border-b border-stone-200 text-stone-400 uppercase text-[11px] font-bold" }, /* @__PURE__ */ React.createElement("th", { className: "pb-3" }, "Booking ID"), /* @__PURE__ */ React.createElement("th", { className: "pb-3" }, "Guest Name"), /* @__PURE__ */ React.createElement("th", { className: "pb-3" }, "Room"), /* @__PURE__ */ React.createElement("th", { className: "pb-3" }, "Dates"), /* @__PURE__ */ React.createElement("th", { className: "pb-3" }, "Amount"), /* @__PURE__ */ React.createElement("th", { className: "pb-3" }, "Status"))), /* @__PURE__ */ React.createElement("tbody", { className: "divide-y divide-stone-100 font-medium" }, bookings.slice(0, 5).map((b) => /* @__PURE__ */ React.createElement("tr", { key: b.id, className: "hover:bg-stone-50" }, /* @__PURE__ */ React.createElement("td", { className: "py-3 font-mono font-bold text-forest-900" }, b.id), /* @__PURE__ */ React.createElement("td", { className: "py-3 text-stone-800" }, b.guestName), /* @__PURE__ */ React.createElement("td", { className: "py-3 text-stone-600" }, b.roomName), /* @__PURE__ */ React.createElement("td", { className: "py-3 text-stone-600" }, b.checkIn, " to ", b.checkOut), /* @__PURE__ */ React.createElement("td", { className: "py-3 font-bold text-forest-950" }, "\u20B9", b.totalAmount), /* @__PURE__ */ React.createElement("td", { className: "py-3" }, /* @__PURE__ */ React.createElement("span", { className: `px-2.5 py-1 rounded-full text-xs font-bold ${b.status === "Confirmed" ? "bg-emerald-100 text-emerald-800" : b.status === "Checked-In" ? "bg-blue-100 text-blue-800" : "bg-stone-200 text-stone-700"}` }, b.status))))))))), adminTab === "bookings" && /* @__PURE__ */ React.createElement("div", { className: "bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm" }, /* @__PURE__ */ React.createElement("div", { className: "flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h3", { className: "font-serif text-2xl font-bold text-forest-950" }, "Guest Reservations Manager"), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-stone-500" }, "Live feed of all website & WhatsApp confirmations")), /* @__PURE__ */ React.createElement("div", { className: "text-xs font-semibold text-stone-500" }, "Total Bookings: ", /* @__PURE__ */ React.createElement("span", { className: "font-bold text-forest-950" }, bookings.length))), /* @__PURE__ */ React.createElement("div", { className: "space-y-4" }, bookings.map((book) => {
    var _a;
    return /* @__PURE__ */ React.createElement("div", { key: book.id, className: "p-5 rounded-2xl bg-stone-50 border border-stone-200 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 hover:border-forest-800 transition" }, /* @__PURE__ */ React.createElement("div", { className: "space-y-1" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-3" }, /* @__PURE__ */ React.createElement("span", { className: "font-mono font-bold text-sm bg-forest-900 text-amber-300 px-2.5 py-0.5 rounded" }, book.id), /* @__PURE__ */ React.createElement("h4", { className: "font-bold text-base text-forest-950" }, book.guestName), /* @__PURE__ */ React.createElement("span", { className: "text-xs text-stone-500" }, "(", book.guests, " Guests)")), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-stone-600" }, "\u{1F4DE} ", book.phone, " | \u2709\uFE0F ", book.email), /* @__PURE__ */ React.createElement("p", { className: "text-xs font-semibold text-forest-800" }, "\u{1F3E0} ", book.roomName, " \u2022 \u{1F4C5} ", book.checkIn, " to ", book.checkOut), book.notes && /* @__PURE__ */ React.createElement("p", { className: "text-xs text-amber-700 italic" }, 'Special Note: "', book.notes, '"')), /* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap items-center gap-3" }, /* @__PURE__ */ React.createElement("div", { className: "text-right pr-2" }, /* @__PURE__ */ React.createElement("div", { className: "text-lg font-black text-forest-950" }, "\u20B9", book.totalAmount), /* @__PURE__ */ React.createElement("span", { className: "text-[11px] text-stone-400" }, book.paymentMode || "Direct")), /* @__PURE__ */ React.createElement(
      "select",
      {
        value: book.status,
        onChange: (e) => updateBookingStatus(book.id, e.target.value),
        className: "text-xs font-bold bg-white border border-stone-300 rounded-xl px-3 py-2 text-stone-800 focus:ring-2 focus:ring-forest-800 cursor-pointer"
      },
      /* @__PURE__ */ React.createElement("option", { value: "Confirmed" }, "Confirmed"),
      /* @__PURE__ */ React.createElement("option", { value: "Checked-In" }, "Checked-In"),
      /* @__PURE__ */ React.createElement("option", { value: "Completed" }, "Completed"),
      /* @__PURE__ */ React.createElement("option", { value: "Cancelled" }, "Cancelled")
    ), /* @__PURE__ */ React.createElement(
      "a",
      {
        href: `https://wa.me/${(_a = book.phone) == null ? void 0 : _a.replace(/[^0-9]/g, "")}?text=Hello%20${encodeURIComponent(book.guestName)},%20confirming%20your%20stay%20at%20Checkinn%20Homes%20Tapovan%20Rishikesh%20(ID:%20${book.id})`,
        target: "_blank",
        rel: "noreferrer",
        className: "px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-1"
      },
      /* @__PURE__ */ React.createElement("span", null, "\u{1F4AC}"),
      " WhatsApp Guest"
    )));
  }))), adminTab === "rooms" && /* @__PURE__ */ React.createElement("div", { className: "bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm" }, /* @__PURE__ */ React.createElement("div", { className: "flex justify-between items-center mb-6" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h3", { className: "font-serif text-2xl font-bold text-forest-950" }, "Room Configuration & Pricing"), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-stone-500" }, "Edit nightly rates, descriptions, amenities, and photos live"))), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6" }, rooms.map((room) => /* @__PURE__ */ React.createElement("div", { key: room.id, className: "border border-stone-200 rounded-2xl p-5 bg-stone-50/50 flex flex-col justify-between" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "flex gap-4 items-start mb-3" }, /* @__PURE__ */ React.createElement("img", { src: room.image, alt: room.name, className: "w-20 h-20 rounded-xl object-cover" }), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h4", { className: "font-serif font-bold text-lg text-forest-950" }, room.name), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-amber-700 font-semibold" }, room.type), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-stone-500 mt-1" }, "Current Price: ", /* @__PURE__ */ React.createElement("span", { className: "font-bold text-forest-950 text-sm" }, "\u20B9", room.price, "/night")))), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-stone-600 line-clamp-2 mb-3" }, room.description), /* @__PURE__ */ React.createElement("div", { className: "text-[11px] text-stone-500 font-medium" }, "Capacity: ", room.capacity, " | Bed: ", room.bed)), /* @__PURE__ */ React.createElement("div", { className: "pt-4 mt-3 border-t border-stone-200 flex justify-end gap-2" }, /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => setEditingRoom(JSON.parse(JSON.stringify(room))),
      className: "px-4 py-2 bg-forest-900 hover:bg-forest-800 text-amber-300 text-xs font-bold rounded-xl shadow transition"
    },
    "\u270F\uFE0F Edit Room Details & Price"
  )))))), adminTab === "queries" && /* @__PURE__ */ React.createElement("div", { className: "bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm" }, /* @__PURE__ */ React.createElement("div", { className: "flex justify-between items-center mb-6" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h3", { className: "font-serif text-2xl font-bold text-forest-950" }, "Inbound Guest Queries"), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-stone-500" }, "Queries submitted via website contact & inquiry forms"))), /* @__PURE__ */ React.createElement("div", { className: "space-y-4" }, queries.length === 0 ? /* @__PURE__ */ React.createElement("p", { className: "text-stone-500 text-sm text-center py-8" }, "No customer queries currently.") : queries.map((q) => {
    var _a;
    return /* @__PURE__ */ React.createElement("div", { key: q.id, className: "p-5 rounded-2xl bg-stone-50 border border-stone-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4" }, /* @__PURE__ */ React.createElement("div", { className: "space-y-1 max-w-2xl" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-3" }, /* @__PURE__ */ React.createElement("h4", { className: "font-bold text-sm text-forest-950" }, q.name), /* @__PURE__ */ React.createElement("span", { className: "text-xs text-stone-400" }, "(", q.date, ")"), /* @__PURE__ */ React.createElement("span", { className: `text-[10px] font-bold px-2 py-0.5 rounded-full ${q.status === "New" ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"}` }, q.status)), /* @__PURE__ */ React.createElement("p", { className: "text-xs font-semibold text-amber-700" }, q.subject), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-stone-700 leading-relaxed font-sans" }, q.message), /* @__PURE__ */ React.createElement("div", { className: "text-[11px] text-stone-500 pt-1" }, "Phone: ", q.phone, " | Email: ", q.email)), /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2" }, /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: () => toggleQueryStatus(q.id),
        className: "px-3 py-1.5 bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-bold rounded-lg transition"
      },
      "Mark ",
      q.status === "Resolved" ? "New" : "Resolved"
    ), /* @__PURE__ */ React.createElement(
      "a",
      {
        href: `https://wa.me/${(_a = q.phone) == null ? void 0 : _a.replace(/[^0-9]/g, "")}?text=Hi%20${encodeURIComponent(q.name)},%20replying%20to%20your%20query%20at%20Checkinn%20Homes%20Rishikesh`,
        target: "_blank",
        rel: "noreferrer",
        className: "px-3 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded-lg transition"
      },
      "Reply WhatsApp"
    ), /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: () => deleteQuery(q.id),
        className: "p-1.5 text-red-500 hover:bg-red-50 rounded-lg text-xs",
        title: "Delete query"
      },
      "\u{1F5D1}\uFE0F"
    )));
  }))), adminTab === "feedback" && /* @__PURE__ */ React.createElement("div", { className: "bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm" }, /* @__PURE__ */ React.createElement("div", { className: "flex justify-between items-center mb-6" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h3", { className: "font-serif text-2xl font-bold text-forest-950" }, "Guest Testimonials Moderation"), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-stone-500" }, "Live reviews appearing on the homepage and review board"))), /* @__PURE__ */ React.createElement("div", { className: "space-y-4" }, reviews.map((rev) => /* @__PURE__ */ React.createElement("div", { key: rev.id, className: "p-4 rounded-2xl bg-stone-50 border border-stone-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2" }, /* @__PURE__ */ React.createElement("h4", { className: "font-bold text-sm text-forest-950" }, rev.name), /* @__PURE__ */ React.createElement("span", { className: "text-xs text-amber-500" }, "\u2605".repeat(rev.rating)), /* @__PURE__ */ React.createElement("span", { className: "text-xs text-stone-400" }, "(", rev.room, ")")), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-stone-600 italic mt-1 font-serif" }, '"', rev.comment, '"'), /* @__PURE__ */ React.createElement("span", { className: "text-[10px] text-stone-400" }, rev.city, " \u2022 ", rev.date)), /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2" }, /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => {
        setReviews(reviews.filter((r) => r.id !== rev.id));
        showToast("Review removed.");
      },
      className: "text-xs text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg font-bold transition"
    },
    "Delete"
  )))))), adminTab === "mysql" && /* @__PURE__ */ React.createElement("div", { className: "bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm" }, /* @__PURE__ */ React.createElement("div", { className: "max-w-3xl" }, /* @__PURE__ */ React.createElement("span", { className: "text-emerald-600 font-bold text-xs uppercase tracking-wider font-mono" }, "Hostinger cPanel / hPanel MySQL Integration"), /* @__PURE__ */ React.createElement("h3", { className: "font-serif text-2xl font-bold text-forest-950 mt-1 mb-2" }, "Production Database Schema & API Setup"), /* @__PURE__ */ React.createElement("p", { className: "text-stone-600 text-xs sm:text-sm mb-6 leading-relaxed" }, "This website has built-in local reactive storage, plus direct MySQL ready compatibility. Simply create a database in your ", /* @__PURE__ */ React.createElement("b", null, "Hostinger MySQL Databases"), " menu and use the schema and PHP API below."), /* @__PURE__ */ React.createElement("div", { className: "bg-stone-50 p-6 rounded-2xl border border-stone-200 space-y-4 mb-6" }, /* @__PURE__ */ React.createElement("h4", { className: "font-bold text-sm text-forest-950 font-serif" }, "Hostinger DB Connection Credentials"), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-stone-500 font-bold mb-1" }, "Hostinger DB Host"), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "text",
      value: hotelConfig.dbHost || "localhost",
      onChange: (e) => setHotelConfig(__spreadProps(__spreadValues({}, hotelConfig), { dbHost: e.target.value })),
      className: "w-full px-3 py-2 rounded-lg border border-stone-300 font-mono text-xs bg-white"
    }
  )), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-stone-500 font-bold mb-1" }, "Database Name"), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "text",
      value: hotelConfig.dbName || "u123456_checkinn",
      onChange: (e) => setHotelConfig(__spreadProps(__spreadValues({}, hotelConfig), { dbName: e.target.value })),
      className: "w-full px-3 py-2 rounded-lg border border-stone-300 font-mono text-xs bg-white"
    }
  )), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-stone-500 font-bold mb-1" }, "DB Username"), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "text",
      value: hotelConfig.dbUser || "u123456_root",
      onChange: (e) => setHotelConfig(__spreadProps(__spreadValues({}, hotelConfig), { dbUser: e.target.value })),
      className: "w-full px-3 py-2 rounded-lg border border-stone-300 font-mono text-xs bg-white"
    }
  )))), /* @__PURE__ */ React.createElement("div", { className: "mb-6" }, /* @__PURE__ */ React.createElement("div", { className: "flex justify-between items-center mb-2" }, /* @__PURE__ */ React.createElement("h4", { className: "text-xs font-bold uppercase tracking-wider text-stone-700" }, "1. SQL Schema (Run in Hostinger phpMyAdmin):"), /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => {
        navigator.clipboard.writeText(`CREATE TABLE rooms (id VARCHAR(50) PRIMARY KEY, name VARCHAR(100), price INT, capacity VARCHAR(50), description TEXT, image TEXT);
CREATE TABLE bookings (id VARCHAR(50) PRIMARY KEY, guest_name VARCHAR(100), email VARCHAR(100), phone VARCHAR(50), room_name VARCHAR(100), check_in DATE, check_out DATE, guests INT, total_amount INT, status VARCHAR(50), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE queries (id VARCHAR(50) PRIMARY KEY, name VARCHAR(100), email VARCHAR(100), phone VARCHAR(50), subject VARCHAR(150), message TEXT, status VARCHAR(50) DEFAULT 'New', created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE reviews (id VARCHAR(50) PRIMARY KEY, name VARCHAR(100), city VARCHAR(100), rating INT, room VARCHAR(100), comment TEXT, approved BOOLEAN DEFAULT TRUE);`);
        showToast("SQL Schema copied to clipboard!");
      },
      className: "text-xs text-forest-800 font-bold hover:underline"
    },
    "\u{1F4CB} Copy SQL"
  )), /* @__PURE__ */ React.createElement("pre", { className: "bg-forest-950 text-emerald-300 text-[11px] p-4 rounded-2xl overflow-x-auto font-mono" }, `CREATE TABLE rooms (
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
);`))))), editingRoom && /* @__PURE__ */ React.createElement("div", { className: "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" }, /* @__PURE__ */ React.createElement("div", { className: "bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-200" }, /* @__PURE__ */ React.createElement("div", { className: "flex justify-between items-center mb-6" }, /* @__PURE__ */ React.createElement("h3", { className: "font-serif text-xl font-bold text-forest-950" }, "Edit Room: ", editingRoom.name), /* @__PURE__ */ React.createElement("button", { onClick: () => setEditingRoom(null), className: "text-stone-400 hover:text-stone-700 font-bold text-lg" }, "\u2715")), /* @__PURE__ */ React.createElement("form", { onSubmit: handleSaveRoom, className: "space-y-4 text-xs" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block font-bold text-stone-500 mb-1" }, "Room Display Name"), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "text",
      value: editingRoom.name,
      onChange: (e) => setEditingRoom(__spreadProps(__spreadValues({}, editingRoom), { name: e.target.value })),
      className: "w-full px-3 py-2 border rounded-xl text-sm font-medium",
      required: true
    }
  )), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-2 gap-3" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block font-bold text-stone-500 mb-1" }, "Nightly Price (\u20B9)"), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "number",
      value: editingRoom.price,
      onChange: (e) => setEditingRoom(__spreadProps(__spreadValues({}, editingRoom), { price: Number(e.target.value) })),
      className: "w-full px-3 py-2 border rounded-xl text-sm font-bold text-forest-950",
      required: true
    }
  )), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block font-bold text-stone-500 mb-1" }, "Capacity"), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "text",
      value: editingRoom.capacity,
      onChange: (e) => setEditingRoom(__spreadProps(__spreadValues({}, editingRoom), { capacity: e.target.value })),
      className: "w-full px-3 py-2 border rounded-xl text-sm font-medium"
    }
  ))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block font-bold text-stone-500 mb-1" }, "Image URL"), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "url",
      value: editingRoom.image,
      onChange: (e) => setEditingRoom(__spreadProps(__spreadValues({}, editingRoom), { image: e.target.value })),
      className: "w-full px-3 py-2 border rounded-xl text-xs font-mono",
      required: true
    }
  )), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block font-bold text-stone-500 mb-1" }, "Room Description"), /* @__PURE__ */ React.createElement(
    "textarea",
    {
      rows: "3",
      value: editingRoom.description,
      onChange: (e) => setEditingRoom(__spreadProps(__spreadValues({}, editingRoom), { description: e.target.value })),
      className: "w-full px-3 py-2 border rounded-xl text-xs font-medium",
      required: true
    }
  )), /* @__PURE__ */ React.createElement("div", { className: "flex gap-3 pt-4" }, /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      onClick: () => setEditingRoom(null),
      className: "flex-1 py-2.5 rounded-xl border border-stone-300 font-bold text-stone-600 hover:bg-stone-50"
    },
    "Cancel"
  ), /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "submit",
      className: "flex-1 py-2.5 rounded-xl bg-forest-900 text-amber-300 font-bold hover:bg-forest-800 shadow"
    },
    "Save Room Changes"
  ))))));
}
function BookingEngineModal({ rooms, selectedRoom, initialDates, onClose, onConfirmBooking }) {
  const [currentRoom, setCurrentRoom] = useState(selectedRoom || rooms[0]);
  const [formData, setFormData] = useState({
    guestName: "",
    email: "",
    phone: "",
    checkIn: initialDates.checkIn || (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
    checkOut: initialDates.checkOut || new Date(Date.now() + 864e5 * 2).toISOString().split("T")[0],
    guests: initialDates.guests || 2,
    specialRequests: "",
    addRafting: false,
    addScooty: false
  });
  const nights = useMemo(() => {
    const start = new Date(formData.checkIn);
    const end = new Date(formData.checkOut);
    const diff = Math.ceil((end - start) / (1e3 * 60 * 60 * 24));
    return diff > 0 ? diff : 1;
  }, [formData.checkIn, formData.checkOut]);
  const totalAmount = useMemo(() => {
    let base = currentRoom.price * nights;
    if (formData.addRafting) base += 850 * formData.guests;
    if (formData.addScooty) base += 500 * nights;
    return base;
  }, [currentRoom, nights, formData.addRafting, formData.addScooty, formData.guests]);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.guestName || !formData.phone) {
      alert("Please provide your name and phone number for booking confirmation.");
      return;
    }
    const newBooking = {
      id: "CIH-" + Math.floor(1e3 + Math.random() * 9e3),
      guestName: formData.guestName,
      email: formData.email || "guest@tapovan.com",
      phone: formData.phone,
      roomName: currentRoom.name,
      checkIn: formData.checkIn,
      checkOut: formData.checkOut,
      guests: formData.guests,
      totalAmount,
      status: "Confirmed",
      paymentMode: "Direct Host Reservation",
      notes: `${formData.specialRequests || ""} ${formData.addRafting ? "[+Rafting]" : ""} ${formData.addScooty ? "[+Scooty]" : ""}`.trim()
    };
    onConfirmBooking(newBooking);
  };
  return /* @__PURE__ */ React.createElement("div", { className: "fixed inset-0 z-50 bg-forest-950/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto" }, /* @__PURE__ */ React.createElement("div", { className: "bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 relative my-8" }, /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: onClose,
      className: "absolute top-5 right-5 w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 font-bold flex items-center justify-center text-sm transition"
    },
    "\u2715"
  ), /* @__PURE__ */ React.createElement("div", { className: "mb-6" }, /* @__PURE__ */ React.createElement("span", { className: "text-amber-600 font-bold text-xs uppercase tracking-widest" }, "Instant Reservation"), /* @__PURE__ */ React.createElement("h2", { className: "font-serif text-2xl sm:text-3xl font-bold text-forest-950 mt-0.5" }, "Book Your Rishikesh Sanctuary"), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-stone-500" }, "No advance payment required for direct website reservations.")), /* @__PURE__ */ React.createElement("form", { onSubmit: handleSubmit, className: "space-y-6" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-xs font-bold uppercase text-stone-500 mb-2" }, "Select Preferred Room"), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-2" }, rooms.map((r) => /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      key: r.id,
      onClick: () => setCurrentRoom(r),
      className: `p-3 rounded-2xl text-left border transition ${currentRoom.id === r.id ? "border-forest-900 bg-forest-50/70 ring-2 ring-forest-900" : "border-stone-200 hover:border-stone-300 bg-stone-50/40"}`
    },
    /* @__PURE__ */ React.createElement("h4", { className: "font-serif font-bold text-xs text-forest-950 leading-tight" }, r.name),
    /* @__PURE__ */ React.createElement("p", { className: "text-[11px] font-bold text-amber-700 mt-1" }, "\u20B9", r.price, "/n")
  )))), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-3 bg-warmCream p-4 rounded-2xl border border-stone-200" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-[11px] font-bold uppercase text-stone-500 mb-1" }, "Check-In Date"), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "date",
      value: formData.checkIn,
      onChange: (e) => setFormData(__spreadProps(__spreadValues({}, formData), { checkIn: e.target.value })),
      className: "w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-bold bg-white text-forest-950",
      required: true
    }
  )), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-[11px] font-bold uppercase text-stone-500 mb-1" }, "Check-Out Date"), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "date",
      value: formData.checkOut,
      onChange: (e) => setFormData(__spreadProps(__spreadValues({}, formData), { checkOut: e.target.value })),
      className: "w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-bold bg-white text-forest-950",
      required: true
    }
  )), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-[11px] font-bold uppercase text-stone-500 mb-1" }, "Number of Guests"), /* @__PURE__ */ React.createElement(
    "select",
    {
      value: formData.guests,
      onChange: (e) => setFormData(__spreadProps(__spreadValues({}, formData), { guests: Number(e.target.value) })),
      className: "w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-bold bg-white text-forest-950 cursor-pointer"
    },
    /* @__PURE__ */ React.createElement("option", { value: "1" }, "1 Person"),
    /* @__PURE__ */ React.createElement("option", { value: "2" }, "2 Persons"),
    /* @__PURE__ */ React.createElement("option", { value: "3" }, "3 Persons"),
    /* @__PURE__ */ React.createElement("option", { value: "4" }, "4 Persons")
  ))), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-xs font-bold uppercase text-stone-500 mb-1" }, "Guest Full Name *"), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "text",
      placeholder: "e.g. Maya Patel",
      value: formData.guestName,
      onChange: (e) => setFormData(__spreadProps(__spreadValues({}, formData), { guestName: e.target.value })),
      className: "w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm font-medium bg-stone-50/50 focus:outline-none focus:ring-2 focus:ring-forest-800",
      required: true
    }
  )), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-xs font-bold uppercase text-stone-500 mb-1" }, "Phone / WhatsApp *"), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "tel",
      placeholder: "e.g. +91 98765 00000",
      value: formData.phone,
      onChange: (e) => setFormData(__spreadProps(__spreadValues({}, formData), { phone: e.target.value })),
      className: "w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm font-medium bg-stone-50/50 focus:outline-none focus:ring-2 focus:ring-forest-800",
      required: true
    }
  ))), /* @__PURE__ */ React.createElement("div", { className: "space-y-2" }, /* @__PURE__ */ React.createElement("span", { className: "block text-xs font-bold uppercase text-stone-500" }, "Rishikesh Add-On Experiences (Optional)"), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs" }, /* @__PURE__ */ React.createElement("label", { className: "flex items-center gap-2.5 p-3 rounded-xl border border-stone-200 cursor-pointer hover:bg-stone-50" }, /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "checkbox",
      checked: formData.addRafting,
      onChange: (e) => setFormData(__spreadProps(__spreadValues({}, formData), { addRafting: e.target.checked })),
      className: "rounded text-forest-900 focus:ring-forest-800 w-4 h-4"
    }
  ), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("span", { className: "font-bold text-forest-950" }, "16km River Rafting"), /* @__PURE__ */ React.createElement("p", { className: "text-[11px] text-stone-500" }, "+\u20B9850/person with pickup"))), /* @__PURE__ */ React.createElement("label", { className: "flex items-center gap-2.5 p-3 rounded-xl border border-stone-200 cursor-pointer hover:bg-stone-50" }, /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "checkbox",
      checked: formData.addScooty,
      onChange: (e) => setFormData(__spreadProps(__spreadValues({}, formData), { addScooty: e.target.checked })),
      className: "rounded text-forest-900 focus:ring-forest-800 w-4 h-4"
    }
  ), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("span", { className: "font-bold text-forest-950" }, "Daily Scooty Rental"), /* @__PURE__ */ React.createElement("p", { className: "text-[11px] text-stone-500" }, "+\u20B9500/day doorstep delivery"))))), /* @__PURE__ */ React.createElement("div", { className: "bg-forest-950 text-white p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "text-xs text-stone-300" }, nights, " Night(s) Stay \u2022 ", currentRoom.name), /* @__PURE__ */ React.createElement("div", { className: "font-serif text-2xl font-bold text-amber-300 mt-0.5" }, "Total: \u20B9", totalAmount.toLocaleString("en-IN")), /* @__PURE__ */ React.createElement("p", { className: "text-[10px] text-emerald-400" }, "\u2713 Pay on arrival in Upper Tapovan")), /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "submit",
      className: "w-full sm:w-auto px-8 py-3.5 bg-amber-500 hover:bg-amber-600 text-forest-950 font-bold rounded-xl shadow-lg transition transform active:scale-95 text-sm"
    },
    "Confirm Instant Booking \u2794"
  )))));
}
function RoomDetailModal({ room, onClose, onBookNow }) {
  const [activeImg, setActiveImg] = useState(room.image);
  return /* @__PURE__ */ React.createElement("div", { className: "fixed inset-0 z-50 bg-forest-950/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto" }, /* @__PURE__ */ React.createElement("div", { className: "bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 relative my-8" }, /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: onClose,
      className: "absolute top-5 right-5 w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 font-bold flex items-center justify-center text-sm transition z-10"
    },
    "\u2715"
  ), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6 mb-6" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(
    "img",
    {
      src: activeImg,
      alt: room.name,
      className: "w-full h-64 object-cover rounded-2xl shadow mb-2"
    }
  ), /* @__PURE__ */ React.createElement("div", { className: "flex gap-2" }, (room.gallery || [room.image]).map((img, i) => /* @__PURE__ */ React.createElement(
    "img",
    {
      key: i,
      src: img,
      alt: "",
      onClick: () => setActiveImg(img),
      className: `w-16 h-12 object-cover rounded-lg cursor-pointer border-2 transition ${activeImg === img ? "border-amber-500 scale-105" : "border-transparent opacity-70"}`
    }
  )))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("span", { className: "text-amber-600 font-bold text-xs uppercase tracking-widest" }, room.type), /* @__PURE__ */ React.createElement("h3", { className: "font-serif text-3xl font-bold text-forest-950 mt-1 mb-2" }, room.name), /* @__PURE__ */ React.createElement("div", { className: "flex items-baseline gap-2 mb-4" }, /* @__PURE__ */ React.createElement("span", { className: "text-2xl font-black text-forest-950" }, "\u20B9", room.price), /* @__PURE__ */ React.createElement("span", { className: "text-xs text-stone-500" }, "/ night"), room.originalPrice && /* @__PURE__ */ React.createElement("span", { className: "text-xs text-stone-400 line-through" }, "\u20B9", room.originalPrice)), /* @__PURE__ */ React.createElement("p", { className: "text-stone-600 text-xs sm:text-sm leading-relaxed mb-4" }, room.description), /* @__PURE__ */ React.createElement("div", { className: "space-y-1.5 text-xs text-stone-700 mb-6" }, /* @__PURE__ */ React.createElement("div", null, "\u{1F465} ", /* @__PURE__ */ React.createElement("b", null, "Capacity:"), " ", room.capacity), /* @__PURE__ */ React.createElement("div", null, "\u{1F6CF}\uFE0F ", /* @__PURE__ */ React.createElement("b", null, "Bed:"), " ", room.bed), /* @__PURE__ */ React.createElement("div", null, "\u{1F4D0} ", /* @__PURE__ */ React.createElement("b", null, "Room Area:"), " ", room.size || "300 sq.ft"), /* @__PURE__ */ React.createElement("div", null, "\u{1F4F6} ", /* @__PURE__ */ React.createElement("b", null, "Internet:"), " 100 Mbps Optical Fibre")), /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: onBookNow,
      className: "w-full py-3 bg-forest-900 hover:bg-forest-800 text-amber-300 font-bold rounded-xl shadow transition"
    },
    "Book This Room (\u20B9",
    room.price,
    "/night) \u2192"
  ))), /* @__PURE__ */ React.createElement("div", { className: "pt-4 border-t border-stone-200" }, /* @__PURE__ */ React.createElement("h4", { className: "text-xs font-bold uppercase tracking-wider text-stone-500 mb-3" }, "Room Amenities"), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs" }, room.amenities.map((a, idx) => /* @__PURE__ */ React.createElement("div", { key: idx, className: "flex items-center gap-1.5 text-stone-700" }, /* @__PURE__ */ React.createElement("span", { className: "text-emerald-600" }, "\u2713"), " ", a))))));
}
function Footer({ hotelConfig, setCurrentPage, openBookingEngine }) {
  return /* @__PURE__ */ React.createElement("footer", { className: "bg-forest-950 text-white pt-16 pb-12 border-t border-forest-900" }, /* @__PURE__ */ React.createElement("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" }, /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-forest-900" }, /* @__PURE__ */ React.createElement("div", { className: "space-y-4" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-3" }, /* @__PURE__ */ React.createElement("div", { className: "w-10 h-10 rounded-2xl bg-forest-900 text-amber-400 flex items-center justify-center font-serif text-2xl font-bold border border-forest-800" }, "C"), /* @__PURE__ */ React.createElement("h2", { className: "font-serif text-2xl font-bold tracking-tight text-white" }, "Checkinn ", /* @__PURE__ */ React.createElement("span", { className: "text-amber-400" }, "Homes"))), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-stone-300 leading-relaxed" }, "Your trusted stay partner in Rishikesh, offering comfortable rooms, modern amenities, and a peaceful experience in the heart of Tapovan."), /* @__PURE__ */ React.createElement("div", { className: "flex gap-3 text-stone-400 text-sm" }, /* @__PURE__ */ React.createElement("span", { className: "cursor-pointer hover:text-amber-400" }, "\u{1F4F7} Instagram"), /* @__PURE__ */ React.createElement("span", { className: "cursor-pointer hover:text-amber-400" }, "\u{1F4D8} Facebook"), /* @__PURE__ */ React.createElement("span", { className: "cursor-pointer hover:text-amber-400" }, "\u{1F4CD} Google"))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h3", { className: "font-serif text-base font-bold text-amber-300 mb-4" }, "Quick Links"), /* @__PURE__ */ React.createElement("ul", { className: "space-y-2 text-xs text-stone-300" }, ["Home", "Our Rooms", "About Us", "Guest Stories", "Contact & Map"].map((name, i) => {
    const pages = ["home", "rooms", "about", "feedback", "contact"];
    return /* @__PURE__ */ React.createElement("li", { key: i }, /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: () => {
          setCurrentPage(pages[i]);
          window.scrollTo(0, 0);
        },
        className: "hover:text-amber-300 transition"
      },
      name
    ));
  }))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h3", { className: "font-serif text-base font-bold text-amber-300 mb-4" }, "Our Rooms"), /* @__PURE__ */ React.createElement("ul", { className: "space-y-2 text-xs text-stone-300" }, /* @__PURE__ */ React.createElement("li", null, "\u2022 Premium Room (Mountain View)"), /* @__PURE__ */ React.createElement("li", null, "\u2022 Super Deluxe Room (Balcony)"), /* @__PURE__ */ React.createElement("li", null, "\u2022 Deluxe Room (Serene Comfort)"), /* @__PURE__ */ React.createElement("li", null, "\u2022 Shared Dormitory (Backpacker Bunk)")), /* @__PURE__ */ React.createElement("div", { className: "mt-4" }, /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => openBookingEngine(),
      className: "text-xs text-amber-400 font-bold hover:underline"
    },
    "Check Availability \u2192"
  ))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h3", { className: "font-serif text-base font-bold text-amber-300 mb-4" }, "Contact Info"), /* @__PURE__ */ React.createElement("div", { className: "space-y-3 text-xs text-stone-300" }, /* @__PURE__ */ React.createElement("p", { className: "leading-snug" }, "\u{1F4CD} ", hotelConfig.location), /* @__PURE__ */ React.createElement("p", null, "\u{1F4DE} Phone: ", /* @__PURE__ */ React.createElement("a", { href: `tel:${hotelConfig.phone}`, className: "text-amber-300 hover:underline" }, hotelConfig.phone)), /* @__PURE__ */ React.createElement("p", null, "\u2709\uFE0F Email: ", /* @__PURE__ */ React.createElement("a", { href: `mailto:${hotelConfig.email}`, className: "text-amber-300 hover:underline" }, hotelConfig.email))))), /* @__PURE__ */ React.createElement("div", { className: "pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-400" }, /* @__PURE__ */ React.createElement("div", null, "\xA9 ", (/* @__PURE__ */ new Date()).getFullYear(), " Checkinn Homes Rishikesh. All rights reserved."), /* @__PURE__ */ React.createElement("div", { className: "flex gap-4" }, /* @__PURE__ */ React.createElement("button", { onClick: () => setCurrentPage("admin"), className: "text-amber-400 hover:underline" }, "\u{1F510} Staff Admin Panel"), /* @__PURE__ */ React.createElement("span", null, "\u2022"), /* @__PURE__ */ React.createElement("span", null, "Upper Tapovan, Uttarakhand 249192")))));
}
ReactDOM.createRoot(document.getElementById("root")).render(/* @__PURE__ */ React.createElement(App, null));
