const { useState, useEffect, useMemo } = React;
const PAGE_PATHS = {
  home: "/",
  rooms: "/rooms",
  about: "/aboutus",
  feedback: "/feedback",
  gallery: "/gallery",
  contact: "/contact",
  admin: "/admin"
};
const navigateToPage = (page) => {
  window.location.href = PAGE_PATHS[page] || PAGE_PATHS.home;
};
const ADMIN_LOGIN_BACKGROUND = "https://checkinnhomes.com/wp-content/uploads/2026/03/JKS01199-scaled.jpg";
const ADMIN_CREDENTIALS = {
  email: "admin@checkinnhomes.com",
  password: "LocalDemo@2026"
};
const API_ENABLED = window.location.protocol === "http:" || window.location.protocol === "https:";
const API_ENDPOINT = "api/index.php";
let apiCsrfToken = "";
async function apiRequest(resource, options = {}) {
  if (!API_ENABLED) return null;
  const method = options.method || "GET";
  const headers = { ...options.headers || {} };
  if (apiCsrfToken && !["GET", "HEAD"].includes(method)) headers["X-CSRF-Token"] = apiCsrfToken;
  if (options.body !== void 0 && !(options.body instanceof FormData)) headers["Content-Type"] = "application/json";
  const response = await fetch(`${API_ENDPOINT}?resource=${encodeURIComponent(resource)}`, {
    method,
    credentials: "same-origin",
    headers,
    body: options.body === void 0 ? void 0 : options.body instanceof FormData ? options.body : JSON.stringify(options.body)
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || `Request failed (${response.status})`);
  if (data.csrfToken) apiCsrfToken = data.csrfToken;
  return data;
}
async function apiUploadImages(files) {
  const formData = new FormData();
  files.forEach((file) => formData.append("images[]", file));
  const response = await fetch("api/upload.php", {
    method: "POST",
    credentials: "same-origin",
    headers: apiCsrfToken ? { "X-CSRF-Token": apiCsrfToken } : {},
    body: formData
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || "Image upload failed.");
  return data.urls || [];
}
function loadRazorpayCheckout() {
  if (window.Razorpay) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = resolve;
    script.onerror = () => reject(new Error("Razorpay checkout could not be loaded."));
    document.head.appendChild(script);
  });
}
const INITIAL_ROOMS = [
  {
    id: "room-1",
    name: "Premium Room",
    type: "Premium Stay",
    price: 5286,
    originalPrice: 7049,
    capacity: "2 Guests",
    bed: "Double Bed",
    size: "Premium Room",
    rating: 5,
    reviewsCount: 5,
    image: "https://checkinnhomes.com/wp-content/uploads/2026/03/premium.jpeg",
    gallery: [
      "https://checkinnhomes.com/wp-content/uploads/2026/03/premium.jpeg",
      "https://checkinnhomes.com/wp-content/uploads/2026/03/JKS01206-scaled.jpg",
      "https://checkinnhomes.com/wp-content/uploads/2026/03/JKS01304-scaled.jpg"
    ],
    amenities: ["TV", "Private Bathroom", "Towels", "Water", "AC", "Fan"],
    mealPlans: ["Room Only (EP): \u20B95,286", "With Breakfast (CP): \u20B95,699", "With Meals (MAP): \u20B96,374"],
    description: "Comfortable premium accommodation for two guests with modern essentials and a private bathroom."
  },
  {
    id: "room-2",
    name: "Super Deluxe Room",
    type: "Enhanced Comfort",
    price: 3486,
    originalPrice: 4649,
    capacity: "2 Guests",
    bed: "Double Bed",
    size: "Super Deluxe Room",
    rating: 5,
    reviewsCount: 5,
    image: "https://checkinnhomes.com/wp-content/uploads/2026/03/Super-Deluxe-room.jpeg",
    gallery: [
      "https://checkinnhomes.com/wp-content/uploads/2026/03/Super-Deluxe-room.jpeg",
      "https://checkinnhomes.com/wp-content/uploads/2026/03/JKS01298-scaled.jpg",
      "https://checkinnhomes.com/wp-content/uploads/2026/03/JKS01286-scaled.jpg"
    ],
    amenities: ["TV", "Private Bathroom", "Towels & Toiletries", "Water", "Toilet Paper", "Fan"],
    mealPlans: ["Room Only (EP): \u20B93,486", "With Breakfast (CP): \u20B93,899", "With Meals (MAP): \u20B94,574"],
    description: "Spacious elegance with enhanced comfort for a relaxing and premium stay."
  },
  {
    id: "room-3",
    name: "Deluxe Room",
    type: "Modern Comfort",
    price: 3899,
    originalPrice: 5199,
    capacity: "2 Guests",
    bed: "Double Bed",
    size: "Deluxe Room",
    rating: 5,
    reviewsCount: 5,
    image: "https://checkinnhomes.com/wp-content/uploads/2026/04/super-rooms12.png",
    gallery: [
      "https://checkinnhomes.com/wp-content/uploads/2026/04/super-rooms12.png",
      "https://checkinnhomes.com/wp-content/uploads/2026/03/JKS01284-scaled.jpg",
      "https://checkinnhomes.com/wp-content/uploads/2026/03/JKS01275-scaled.jpg"
    ],
    amenities: ["TV", "Private Bathroom", "Towels", "Water", "Trash Can", "Fan", "AC"],
    mealPlans: ["Room Only (EP): \u20B93,899", "With Breakfast (CP): \u20B94,161", "With Meals (MAP): \u20B94,649"],
    description: "Luxury living with modern amenities for a refined and indulgent experience."
  },
  {
    id: "room-4",
    name: "Shared Dormitory Room",
    type: "Social Group Stay",
    price: 3486,
    originalPrice: null,
    capacity: "Up to 6 Guests",
    bed: "Shared Sleeping Space",
    size: "Shared Dormitory",
    rating: 5,
    reviewsCount: 5,
    image: "https://checkinnhomes.com/wp-content/uploads/2026/04/Shared-Dormitory-Room-12.jpeg",
    gallery: [
      "https://checkinnhomes.com/wp-content/uploads/2026/04/Shared-Dormitory-Room-12.jpeg",
      "https://checkinnhomes.com/wp-content/uploads/2026/03/JKS01244-scaled.jpg",
      "https://checkinnhomes.com/wp-content/uploads/2026/03/JKS01240-scaled.jpg"
    ],
    amenities: ["Shared Sleeping Space", "Basic Essentials", "Fan"],
    mealPlans: ["Room Only (EP): \u20B93,486"],
    description: "An affordable and social stay option, perfect for groups and solo travelers."
  }
];
const INITIAL_ROOM_TYPES = Array.from(new Set(INITIAL_ROOMS.map((room) => room.type)));
const INITIAL_REVIEWS = [
  { id: "rev-1", name: "Gautam Ahuja", city: "Google Review", rating: 5, room: "Check In Homes", date: "Verified guest", comment: "We had an awesome stay. Rooms were very clean, staff were very helpful, and the food was awesome.", avatar: "", approved: true },
  { id: "rev-2", name: "Pratik Singh", city: "Google Review", rating: 5, room: "Check In Homes", date: "Verified guest", comment: "Had a great stay experience.", avatar: "", approved: true },
  { id: "rev-3", name: "New Indian Surgical", city: "Google Review", rating: 5, room: "Check In Homes", date: "Verified guest", comment: "A great place to stay in. A little inside the lane but totally worth it. The staff was nice, the manager was super professional, rooms were clean, food was homely, and they catered to everything you could ask for.", avatar: "", approved: true },
  { id: "rev-4", name: "Kishan Dwivedi", city: "Google Review", rating: 5, room: "Check In Homes", date: "Verified guest", comment: "Service was good, food was great, rooms were clean, and the staff was humble. Overall, a good stay.", avatar: "", approved: true },
  { id: "rev-5", name: "Srikar Namburi", city: "Google Review", rating: 5, room: "Check In Homes", date: "Verified guest", comment: "Mr Sharma ji, the manager, and the staff were really welcoming and sweet. A great place to stay.", avatar: "", approved: true }
];
const INITIAL_BOOKINGS = [
  {
    id: "CIH-7821",
    guestName: "Shreya Gore",
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
  const currentPage = document.body.dataset.page || "home";
  const setCurrentPage = navigateToPage;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [adminAuthenticated, setAdminAuthenticated] = useState(() => !API_ENABLED && (localStorage.getItem("cih_admin_authenticated") === "true" || sessionStorage.getItem("cih_admin_authenticated") === "true"));
  const [razorpayKeyId, setRazorpayKeyId] = useState("");
  useEffect(() => {
    if (!API_ENABLED) return;
    apiRequest("auth").then((data) => setAdminAuthenticated(Boolean(data.authenticated))).catch(() => setAdminAuthenticated(false));
  }, []);
  const [rooms, setRooms] = useState(() => {
    const saved = localStorage.getItem("cih_rooms_official_v1");
    return saved ? JSON.parse(saved) : INITIAL_ROOMS;
  });
  const [roomTypes, setRoomTypes] = useState(() => {
    const saved = localStorage.getItem("cih_room_types");
    const savedTypes = saved ? JSON.parse(saved) : INITIAL_ROOM_TYPES;
    return Array.from(/* @__PURE__ */ new Set([...savedTypes, ...rooms.map((room) => room.type).filter(Boolean)]));
  });
  const [bookings, setBookings] = useState(() => {
    const saved = localStorage.getItem("cih_bookings");
    const bookingData = saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
    return bookingData.map((booking) => booking.id === "CIH-7821" && booking.guestName === "Vikram Malhotra" ? { ...booking, guestName: "Shreya Gore" } : booking);
  });
  const [queries, setQueries] = useState(() => {
    const saved = localStorage.getItem("cih_queries");
    return saved ? JSON.parse(saved) : INITIAL_QUERIES;
  });
  const [reviews, setReviews] = useState(() => {
    const saved = localStorage.getItem("cih_reviews_official_v1");
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });
  const [coupons, setCoupons] = useState(() => {
    const saved = localStorage.getItem("cih_coupons");
    return saved ? JSON.parse(saved) : [];
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
    localStorage.setItem("cih_rooms_official_v1", JSON.stringify(rooms));
  }, [rooms]);
  useEffect(() => {
    localStorage.setItem("cih_room_types", JSON.stringify(roomTypes));
  }, [roomTypes]);
  useEffect(() => {
    localStorage.setItem("cih_bookings", JSON.stringify(bookings));
  }, [bookings]);
  useEffect(() => {
    localStorage.setItem("cih_queries", JSON.stringify(queries));
  }, [queries]);
  useEffect(() => {
    localStorage.setItem("cih_reviews_official_v1", JSON.stringify(reviews));
  }, [reviews]);
  useEffect(() => {
    localStorage.setItem("cih_coupons", JSON.stringify(coupons));
  }, [coupons]);
  useEffect(() => {
    localStorage.setItem("cih_config", JSON.stringify(hotelConfig));
  }, [hotelConfig]);
  useEffect(() => {
    if (!API_ENABLED) return void 0;
    let active = true;
    const loadApiData = async () => {
      try {
        const data = await apiRequest("bootstrap");
        if (!active || !data) return;
        if (data.rooms) setRooms(data.rooms);
        if (data.roomTypes) setRoomTypes(data.roomTypes);
        if (data.reviews) setReviews(data.reviews);
        if (data.coupons) setCoupons(data.coupons);
        if (data.razorpayKeyId) setRazorpayKeyId(data.razorpayKeyId);
        if (data.hotelConfig) setHotelConfig((current) => ({ ...current, ...data.hotelConfig }));
        if (data.bookings) setBookings(data.bookings);
        if (data.queries) setQueries(data.queries);
      } catch (error) {
        console.error("API bootstrap failed; cached data remains available.", error);
      }
    };
    loadApiData();
    const timer = currentPage === "admin" ? window.setInterval(loadApiData, 5e3) : null;
    return () => {
      active = false;
      if (timer) window.clearInterval(timer);
    };
  }, [currentPage]);
  useEffect(() => {
    if (API_ENABLED) return void 0;
    const syncAdminData = (event) => {
      if (!event.newValue) return;
      try {
        if (event.key === "cih_bookings") setBookings(JSON.parse(event.newValue));
        if (event.key === "cih_queries") setQueries(JSON.parse(event.newValue));
        if (event.key === "cih_reviews_official_v1") setReviews(JSON.parse(event.newValue));
        if (event.key === "cih_rooms_official_v1") setRooms(JSON.parse(event.newValue));
        if (event.key === "cih_room_types") setRoomTypes(JSON.parse(event.newValue));
        if (event.key === "cih_config") setHotelConfig(JSON.parse(event.newValue));
      } catch (error) {
        console.error("Could not synchronize admin data.", error);
      }
    };
    const syncPersistedValue = (key, setter) => {
      const saved = localStorage.getItem(key);
      if (!saved) return;
      setter((currentValue) => JSON.stringify(currentValue) === saved ? currentValue : JSON.parse(saved));
    };
    window.addEventListener("storage", syncAdminData);
    const pollingTimer = currentPage === "admin" ? window.setInterval(() => {
      try {
        syncPersistedValue("cih_bookings", setBookings);
        syncPersistedValue("cih_queries", setQueries);
        syncPersistedValue("cih_reviews_official_v1", setReviews);
        syncPersistedValue("cih_rooms_official_v1", setRooms);
        syncPersistedValue("cih_room_types", setRoomTypes);
        syncPersistedValue("cih_config", setHotelConfig);
      } catch (error) {
        console.error("Could not refresh admin data.", error);
      }
    }, 1e3) : null;
    return () => {
      window.removeEventListener("storage", syncAdminData);
      if (pollingTimer) window.clearInterval(pollingTimer);
    };
  }, [currentPage]);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedRoomForBooking, setSelectedRoomForBooking] = useState(null);
  const [quickBookForm, setQuickBookForm] = useState({
    checkIn: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
    checkOut: new Date(Date.now() + 864e5 * 2).toISOString().split("T")[0],
    guests: 2,
    roomId: rooms[0]?.id || "room-1"
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
      setQuickBookForm((prev) => ({ ...prev, roomId: room.id }));
    } else {
      setSelectedRoomForBooking(rooms[0]);
      setQuickBookForm((prev) => ({ ...prev, roomId: rooms[0].id }));
    }
    setBookingModalOpen(true);
  };
  return /* @__PURE__ */ React.createElement("div", { className: "min-h-screen flex flex-col font-sans bg-[#FAF7F2] text-slate-800 antialiased selection:bg-forest-800 selection:text-amber-300" }, toast && /* @__PURE__ */ React.createElement("div", { className: `fixed bottom-6 right-6 z-50 px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 transition-all transform translate-y-0 text-white font-medium ${toast.type === "error" ? "bg-red-600" : "bg-forest-900 border border-emerald-500/40"}` }, /* @__PURE__ */ React.createElement("span", null, toast.type === "error" ? "\u26A0\uFE0F" : "\u2728"), /* @__PURE__ */ React.createElement("span", null, toast.message)), currentPage !== "admin" && /* @__PURE__ */ React.createElement(
    Navbar,
    {
      currentPage,
      setCurrentPage,
      mobileMenuOpen,
      setMobileMenuOpen,
      hotelConfig,
      openBookingEngine,
      adminAuthenticated
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
      onAddQuery: async (newQuery) => {
        try {
          const savedQuery = API_ENABLED ? await apiRequest("queries", { method: "POST", body: newQuery }) : newQuery;
          setQueries([savedQuery || newQuery, ...queries]);
          showToast("Thank you! Your query is recorded. Our team will contact you shortly.");
        } catch (error) {
          showToast(error.message, "error");
        }
      }
    }
  ), currentPage === "feedback" && /* @__PURE__ */ React.createElement(
    FeedbackPage,
    {
      reviews,
      rooms,
      onAddReview: async (newReview) => {
        try {
          const savedReview = API_ENABLED ? await apiRequest("reviews", { method: "POST", body: newReview }) : newReview;
          setReviews([savedReview || newReview, ...reviews]);
          showToast("Thank you for your review! It has been posted successfully.");
        } catch (error) {
          showToast(error.message, "error");
        }
      }
    }
  ), currentPage === "gallery" && /* @__PURE__ */ React.createElement(GalleryPage, null), currentPage === "admin" && /* @__PURE__ */ React.createElement(
    AdminPanel,
    {
      rooms,
      setRooms,
      roomTypes,
      setRoomTypes,
      bookings,
      setBookings,
      queries,
      setQueries,
      reviews,
      setReviews,
      coupons,
      setCoupons,
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
      coupons,
      razorpayKeyId,
      onClose: () => setBookingModalOpen(false),
      onConfirmBooking: async (newBooking) => {
        try {
          const savedBooking = API_ENABLED ? await apiRequest("bookings", { method: "POST", body: newBooking }) : newBooking;
          setBookings([savedBooking || newBooking, ...bookings]);
          setBookingModalOpen(false);
          if (window.confetti) {
            window.confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
          }
          showToast(`Booking ${newBooking.id} confirmed! Welcome to Rishikesh.`);
        } catch (error) {
          showToast(error.message, "error");
        }
      }
    }
  ), currentPage !== "admin" && /* @__PURE__ */ React.createElement(
    Footer,
    {
      hotelConfig,
      setCurrentPage,
      openBookingEngine,
      adminAuthenticated
    }
  ));
}
function Navbar({ currentPage, setCurrentPage, mobileMenuOpen, setMobileMenuOpen, hotelConfig, openBookingEngine, adminAuthenticated }) {
  return /* @__PURE__ */ React.createElement("header", { className: "sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-sm transition-all" }, /* @__PURE__ */ React.createElement("div", { className: "bg-forest-900 text-stone-200 text-xs py-1.5 px-4 sm:px-8 flex justify-between items-center border-b border-forest-800" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-4" }, /* @__PURE__ */ React.createElement("span", { className: "flex items-center gap-1 font-medium" }, "\u{1F4CD} Secret Waterfall Rd, Upper Tapovan, Rishikesh"), /* @__PURE__ */ React.createElement("span", { className: "hidden md:inline text-forest-500" }, "|"), /* @__PURE__ */ React.createElement("span", { className: "hidden md:inline text-emerald-300" }, "\u{1F343} Peaceful Ganga Valley Stay")), /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-5" }, /* @__PURE__ */ React.createElement("a", { href: `tel:${hotelConfig.phone}`, className: "hover:text-amber-400 font-semibold flex items-center gap-1 transition" }, "\u{1F4DE} ", hotelConfig.phone), /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => setCurrentPage("admin"),
      className: "text-[11px] bg-forest-800 hover:bg-forest-500 text-amber-300 px-2.5 py-0.5 rounded transition font-mono",
      title: "Staff login"
    },
    adminAuthenticated ? "Dashboard" : "Login"
  ))), /* @__PURE__ */ React.createElement("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" }, /* @__PURE__ */ React.createElement("div", { className: "flex justify-between items-center h-20" }, /* @__PURE__ */ React.createElement(
    "div",
    {
      onClick: () => {
        setCurrentPage("home");
        window.scrollTo(0, 0);
      },
      className: "cursor-pointer flex items-center gap-3 group"
    },
    /* @__PURE__ */ React.createElement("div", { className: "w-11 h-11 rounded-2xl bg-forest-900 text-amber-400 flex items-center justify-center font-serif text-2xl font-bold shadow-md shadow-forest-900/20 group-hover:scale-105 transition transform overflow-hidden" }, hotelConfig.logoUrl ? /* @__PURE__ */ React.createElement("img", { src: hotelConfig.logoUrl, alt: `${hotelConfig.name || "Checkinn Homes"} logo`, className: "w-full h-full object-contain bg-white p-1" }) : "C"),
    !hotelConfig.logoUrl && /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h1", { className: "font-serif text-2xl font-bold tracking-tight text-forest-950 leading-tight" }, "Checkinn ", /* @__PURE__ */ React.createElement("span", { className: "text-amber-600" }, "Homes")), /* @__PURE__ */ React.createElement("p", { className: "text-[11px] font-semibold text-stone-500 uppercase tracking-widest -mt-0.5" }, "Upper Tapovan \u2022 Rishikesh"))
  ), /* @__PURE__ */ React.createElement("nav", { className: "hidden md:flex items-center space-x-1 lg:space-x-2" }, [
    { id: "home", label: "Home" },
    { id: "rooms", label: "Our Rooms" },
    { id: "about", label: "About Us" },
    { id: "gallery", label: "Gallery" },
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
      href: `https://wa.me/${hotelConfig.whatsapp?.replace(/[^0-9]/g, "")}?text=Hello%20Checkinn%20Homes,%20I%20want%20to%20inquire%20about%20staying%20in%20Tapovan`,
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
    { id: "gallery", label: "Gallery" },
    { id: "feedback", label: "Guest Feedback" },
    { id: "contact", label: "Contact Us" },
    { id: "admin", label: "Login" }
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
      src: "https://checkinnhomes.com/wp-content/uploads/2026/03/checkinhome2-1-1024x768.webp",
      alt: "Check In Homes property in Rishikesh",
      className: "absolute inset-0 w-full h-full object-cover object-center scale-105 transform filter brightness-90 animate-pulse duration-1000",
      style: { animationDuration: "8s" }
    }
  ), /* @__PURE__ */ React.createElement("div", { className: "absolute inset-0 hero-gradient" }), /* @__PURE__ */ React.createElement("div", { className: "relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white py-16" }, /* @__PURE__ */ React.createElement("div", { className: "inline-flex items-center gap-2 bg-white/15 backdrop-blur-md border border-white/25 px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold tracking-wide text-amber-300 mb-6 shadow-lg" }, /* @__PURE__ */ React.createElement("span", null, "\u2728"), " Comfort, Luxury & Affordability - All in One Place"), /* @__PURE__ */ React.createElement("h1", { className: "font-serif text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white mb-6 leading-[1.15] drop-shadow-md" }, "Find Your Perfect Stay with ", /* @__PURE__ */ React.createElement("span", { className: "italic text-amber-400 font-serif" }, "Check In Homes")), /* @__PURE__ */ React.createElement("p", { className: "max-w-2xl mx-auto text-base sm:text-lg md:text-xl text-stone-200 font-normal mb-10 leading-relaxed drop-shadow" }, "Discover handpicked hotels and homestays across top destinations. Whether you're traveling for business or leisure, enjoy clean rooms, seamless booking, and the best prices guaranteed."), /* @__PURE__ */ React.createElement("div", { className: "glass-card max-w-4xl mx-auto rounded-3xl p-4 sm:p-5 shadow-2xl text-stone-900 border border-white/60" }, /* @__PURE__ */ React.createElement(
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
        onChange: (e) => setSearchForm({ ...searchForm, checkIn: e.target.value }),
        className: "w-full bg-transparent font-semibold text-sm text-stone-800 focus:outline-none cursor-pointer",
        required: true
      }
    )),
    /* @__PURE__ */ React.createElement("div", { className: "text-left bg-stone-50/80 hover:bg-stone-100/90 p-3 rounded-2xl border border-stone-200/80 transition" }, /* @__PURE__ */ React.createElement("label", { className: "block text-[11px] font-bold uppercase tracking-wider text-stone-500" }, "Check-Out"), /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "date",
        value: searchForm.checkOut,
        onChange: (e) => setSearchForm({ ...searchForm, checkOut: e.target.value }),
        className: "w-full bg-transparent font-semibold text-sm text-stone-800 focus:outline-none cursor-pointer",
        required: true
      }
    )),
    /* @__PURE__ */ React.createElement("div", { className: "text-left bg-stone-50/80 hover:bg-stone-100/90 p-3 rounded-2xl border border-stone-200/80 transition" }, /* @__PURE__ */ React.createElement("label", { className: "block text-[11px] font-bold uppercase tracking-wider text-stone-500" }, "Guests & Stay"), /* @__PURE__ */ React.createElement(
      "select",
      {
        value: searchForm.guests,
        onChange: (e) => setSearchForm({ ...searchForm, guests: Number(e.target.value) }),
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
  )), /* @__PURE__ */ React.createElement("div", { className: "mt-8 flex flex-wrap justify-center items-center gap-6 text-xs text-stone-300" }, /* @__PURE__ */ React.createElement("span", { className: "flex items-center gap-1.5 font-medium" }, /* @__PURE__ */ React.createElement("span", { className: "text-emerald-400" }, "\u2713"), " 100% Verified Clean Rooms"), /* @__PURE__ */ React.createElement("span", { className: "flex items-center gap-1.5 font-medium" }, /* @__PURE__ */ React.createElement("span", { className: "text-emerald-400" }, "\u2713"), " High Speed 100Mbps Wi-Fi"), /* @__PURE__ */ React.createElement("span", { className: "flex items-center gap-1.5 font-medium" }, /* @__PURE__ */ React.createElement("span", { className: "text-emerald-400" }, "\u2713"), " 2-min Walk to Secret Waterfall Trek"), /* @__PURE__ */ React.createElement("span", { className: "flex items-center gap-1.5 font-medium" }, /* @__PURE__ */ React.createElement("span", { className: "text-emerald-400" }, "\u2713"), " Near Kundan Restaurant Tapovan")))), /* @__PURE__ */ React.createElement("section", { className: "py-20 bg-white" }, /* @__PURE__ */ React.createElement("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("span", { className: "text-amber-600 font-bold text-sm uppercase tracking-widest" }, "About Check In Homes"), /* @__PURE__ */ React.createElement("h2", { className: "font-sans text-3xl sm:text-4xl font-extrabold text-forest-950 mt-4 mb-6 leading-tight" }, "Experience hospitality that feels like home, wherever you go."), /* @__PURE__ */ React.createElement("p", { className: "text-stone-600 text-sm sm:text-base leading-relaxed mb-8" }, "At Check In Homes, we bring you a carefully curated selection of hotels and homestays designed for comfort, convenience, and affordability. Whether you're traveling for business or leisure, our mission is to make every stay seamless and stress-free. With verified properties, easy booking, and dedicated customer support, we ensure you always find the perfect place to check in and relax."), /* @__PURE__ */ React.createElement("ul", { className: "space-y-3 text-stone-700 font-semibold mb-8" }, ["Customer-First Approach", "Easy & Secure Booking Experience", "Affordable Pricing with No Hidden Charges", "Handpicked & Verified Properties"].map((item) => /* @__PURE__ */ React.createElement("li", { key: item, className: "flex items-center gap-3" }, /* @__PURE__ */ React.createElement("span", { className: "text-amber-600 text-xl" }, "\u2713"), item))), /* @__PURE__ */ React.createElement("button", { onClick: () => setCurrentPage("about"), className: "bg-amber-500 hover:bg-amber-600 text-forest-950 font-bold px-7 py-3 transition" }, "Know More")), /* @__PURE__ */ React.createElement(
    "img",
    {
      src: "https://checkinnhomes.com/wp-content/uploads/2026/03/checkinhome2-1-2048x1536.webp",
      alt: "Check In Homes rooms and common areas",
      className: "w-full aspect-[4/3] object-cover border-[10px] border-forest-950"
    }
  ))), /* @__PURE__ */ React.createElement("section", { className: "py-20 bg-warmCream/80 border-t border-stone-200" }, /* @__PURE__ */ React.createElement("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" }, /* @__PURE__ */ React.createElement("div", { className: "flex flex-col md:flex-row md:items-end justify-between mb-14" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("span", { className: "text-amber-600 font-bold text-xs uppercase tracking-widest" }, "Handpicked Accommodations"), /* @__PURE__ */ React.createElement("h2", { className: "font-serif text-3xl sm:text-4xl font-bold text-forest-950 mt-1" }, "Our Featured Rooms"), /* @__PURE__ */ React.createElement("p", { className: "text-stone-600 text-sm mt-2" }, "Find the right space for solo journeys, romantic gateways, or group explorations.")), /* @__PURE__ */ React.createElement(
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
  ))))), /* @__PURE__ */ React.createElement("section", { className: "bg-white border-y border-stone-200 py-12 lg:py-16" }, /* @__PURE__ */ React.createElement("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 items-stretch" }, /* @__PURE__ */ React.createElement(
    "div",
    {
      className: "relative h-[460px] sm:h-[560px] lg:h-[680px] overflow-hidden bg-cover bg-center",
      style: { backgroundImage: "url(https://checkinnhomes.com/wp-content/uploads/2026/03/JKS01286-scaled.jpg)" }
    },
    /* @__PURE__ */ React.createElement(
      "img",
      {
        src: "https://checkinnhomes.com/wp-content/uploads/2026/03/pic-4.webp",
        alt: "Travel suitcase",
        className: "absolute bottom-0 right-2 sm:right-6 w-[38%] max-h-[25%] object-contain object-bottom"
      }
    )
  ), /* @__PURE__ */ React.createElement("div", { className: "px-2 sm:px-8 lg:px-10 py-10 lg:py-8 flex flex-col justify-center" }, /* @__PURE__ */ React.createElement("span", { className: "text-amber-600 font-bold text-sm uppercase tracking-wider" }, "Experience Comfort, Convenience & Care"), /* @__PURE__ */ React.createElement("h2", { className: "font-sans text-3xl sm:text-4xl font-extrabold text-forest-950 mt-4 mb-6 leading-tight" }, /* @__PURE__ */ React.createElement("span", { className: "bg-amber-500 text-forest-950 px-1" }, "Everything you need"), " for a relaxing and memorable stay in Rishikesh"), /* @__PURE__ */ React.createElement("p", { className: "text-stone-600 text-sm sm:text-base leading-relaxed mb-7" }, "At Check In Homes, we go beyond just providing rooms - we create a complete stay experience. From modern amenities to personalized service, every detail is designed to make your visit comfortable, stress-free, and truly enjoyable. Whether you're here for adventure, relaxation, or work, we ensure you feel right at home."), /* @__PURE__ */ React.createElement("ul", { className: "space-y-3 text-sm sm:text-base text-stone-600 mb-7" }, [
    "Stay close to popular attractions, cafes, and the peaceful surroundings of Rishikesh.",
    "Enjoy hygienic rooms with high standards of cleanliness and comfort.",
    "High-speed Wi-Fi, power backup, parking, and everything you need for a seamless stay.",
    "Our team is always ready to assist you for a smooth and hassle-free experience."
  ].map((item) => /* @__PURE__ */ React.createElement("li", { key: item, className: "flex items-start gap-3" }, /* @__PURE__ */ React.createElement("span", { className: "text-amber-600 font-bold" }, "\u2713"), /* @__PURE__ */ React.createElement("span", null, item)))), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-2 max-w-lg" }, /* @__PURE__ */ React.createElement("button", { onClick: () => setCurrentPage("rooms"), className: "bg-amber-500 hover:bg-amber-600 text-forest-950 font-bold py-3 px-4 sm:border-r border-amber-300" }, "Find Your Stay Now"), /* @__PURE__ */ React.createElement("button", { onClick: () => setCurrentPage("contact"), className: "bg-amber-500 hover:bg-amber-600 text-forest-950 font-bold py-3 px-4 border-t sm:border-t-0 border-amber-300" }, "Contact Us"))))), /* @__PURE__ */ React.createElement("section", { className: "py-20 bg-warmCream" }, /* @__PURE__ */ React.createElement("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("span", { className: "inline-block bg-amber-500 text-forest-950 font-bold px-3 py-1" }, "Why Choose Us"), /* @__PURE__ */ React.createElement("h2", { className: "font-serif text-3xl sm:text-5xl font-bold text-forest-950 mt-7 mb-6 leading-tight" }, "Why Guests Love Staying at Check In Homes"), /* @__PURE__ */ React.createElement("p", { className: "text-stone-600 text-sm sm:text-base leading-relaxed mb-10" }, "From spotless rooms and warm service to a peaceful Tapovan location, every part of your stay is thoughtfully managed for comfort and convenience."), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-2 gap-x-8 gap-y-8" }, [
    { value: "50k+", label: "Happy Guests" },
    { value: "4.8\u2605", label: "Guest Rating" },
    { value: "50+", label: "Bookings Daily" },
    { value: "24/7", label: "Support" }
  ].map((stat) => /* @__PURE__ */ React.createElement("div", { key: stat.label }, /* @__PURE__ */ React.createElement("strong", { className: "font-serif text-3xl sm:text-4xl text-forest-950 block" }, stat.value), /* @__PURE__ */ React.createElement("span", { className: "text-stone-500 text-sm" }, stat.label))))), /* @__PURE__ */ React.createElement("img", { src: "https://checkinnhomes.com/wp-content/uploads/2026/03/JKS01209-2-1024x683.jpg", alt: "Guests relaxing in a Check In Homes room", className: "w-full aspect-[4/3] object-cover" }))), /* @__PURE__ */ React.createElement("section", { className: "py-20 bg-white" }, /* @__PURE__ */ React.createElement("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" }, /* @__PURE__ */ React.createElement("div", { className: "text-center max-w-2xl mx-auto mb-16" }, /* @__PURE__ */ React.createElement("span", { className: "text-amber-600 font-bold text-xs uppercase tracking-widest" }, "Real Guest Stories"), /* @__PURE__ */ React.createElement("h2", { className: "font-serif text-3xl sm:text-4xl font-bold text-forest-950 mt-1" }, "What Our Guests Say"), /* @__PURE__ */ React.createElement("p", { className: "text-stone-600 text-sm mt-3" }, "Real experiences from travelers who stayed with us.")), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-8" }, reviews.filter((r) => r.approved).slice(0, 3).map((review) => /* @__PURE__ */ React.createElement("div", { key: review.id, className: "bg-stone-50 rounded-3xl p-7 border border-stone-200 flex flex-col justify-between hover:shadow-lg transition" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "flex text-amber-400 text-sm mb-4" }, Array.from({ length: review.rating }).map((_, i) => /* @__PURE__ */ React.createElement("span", { key: i }, "\u2605"))), /* @__PURE__ */ React.createElement("p", { className: "text-stone-700 italic text-sm leading-relaxed mb-6 font-serif" }, '"', review.comment, '"')), /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-3 pt-4 border-t border-stone-200" }, review.avatar ? /* @__PURE__ */ React.createElement("img", { src: review.avatar, alt: review.name, className: "w-11 h-11 rounded-full object-cover border border-stone-300" }) : /* @__PURE__ */ React.createElement("div", { className: "w-11 h-11 rounded-full bg-forest-900 text-amber-300 flex items-center justify-center font-bold border border-forest-800" }, review.name.charAt(0)), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h4", { className: "font-bold text-sm text-forest-950" }, review.name), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-stone-500" }, review.city, " \u2022 ", /* @__PURE__ */ React.createElement("span", { className: "text-forest-800 font-medium" }, review.room))))))), /* @__PURE__ */ React.createElement("div", { className: "text-center mt-12" }, /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => {
        setCurrentPage("feedback");
        window.scrollTo(0, 0);
      },
      className: "px-6 py-3 rounded-full bg-forest-900 text-amber-300 font-bold text-sm hover:bg-forest-800 transition"
    },
    "Write a Review or View More Stories \u270D\uFE0F"
  )))), /* @__PURE__ */ React.createElement("section", { className: "relative min-h-[430px] flex items-center justify-center text-white overflow-hidden" }, /* @__PURE__ */ React.createElement("img", { src: "https://checkinnhomes.com/wp-content/uploads/2026/03/JKS01199-scaled.jpg", alt: "Check In Homes reception", className: "absolute inset-0 w-full h-full object-cover" }), /* @__PURE__ */ React.createElement("div", { className: "absolute inset-0 bg-forest-950/70" }), /* @__PURE__ */ React.createElement("div", { className: "relative max-w-5xl mx-auto px-4 py-16 text-center" }, /* @__PURE__ */ React.createElement("span", { className: "text-amber-400 font-bold text-lg" }, "Ready to Book Your Stay in Rishikesh?"), /* @__PURE__ */ React.createElement("h2", { className: "font-serif text-3xl sm:text-5xl font-bold mt-5 mb-4 leading-tight" }, "Experience comfort, great service, and the perfect location at Check In Homes."), /* @__PURE__ */ React.createElement("p", { className: "text-stone-200 text-sm sm:text-base mb-8" }, "Don't wait - secure your room now and enjoy a hassle-free stay with the best amenities and unbeatable prices."), /* @__PURE__ */ React.createElement("a", { href: `https://wa.me/${hotelConfig.whatsapp?.replace(/[^0-9]/g, "")}?text=Hello%20Check%20In%20Homes,%20I%20want%20to%20book%20a%20room.`, target: "_blank", rel: "noreferrer", className: "inline-block bg-amber-500 hover:bg-amber-600 text-forest-950 font-bold px-8 py-3 transition" }, "Chat on WhatsApp"))));
}
function RoomCard({ room, onBook, onViewDetails }) {
  const [amenitiesExpanded, setAmenitiesExpanded] = useState(false);
  return /* @__PURE__ */ React.createElement("div", { className: "bg-white rounded-3xl overflow-hidden border border-stone-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "relative h-56 overflow-hidden" }, /* @__PURE__ */ React.createElement(
    "img",
    {
      src: room.image,
      alt: room.name,
      className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
    }
  ), /* @__PURE__ */ React.createElement("div", { className: "absolute top-3 left-3 bg-forest-950/85 backdrop-blur-md text-white text-xs font-semibold px-3 py-1 rounded-full" }, room.type), /* @__PURE__ */ React.createElement("div", { className: "absolute top-3 right-3 bg-amber-400 text-forest-950 text-xs font-black px-2.5 py-1 rounded-full shadow" }, "\u2605 ", room.rating)), /* @__PURE__ */ React.createElement("div", { className: "p-5" }, /* @__PURE__ */ React.createElement("div", { className: "flex justify-between items-start mb-2" }, /* @__PURE__ */ React.createElement("h3", { className: "font-serif text-xl font-bold text-forest-950 group-hover:text-amber-600 transition" }, room.name)), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-stone-500 mb-3 flex items-center gap-3" }, /* @__PURE__ */ React.createElement("span", null, "\u{1F465} ", room.capacity), /* @__PURE__ */ React.createElement("span", null, "\u{1F6CF}\uFE0F ", room.bed)), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-stone-600 line-clamp-2 mb-4 leading-relaxed" }, room.description), /* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap gap-1.5 mb-4" }, room.amenities.slice(0, amenitiesExpanded ? room.amenities.length : 3).map((amenity, idx) => /* @__PURE__ */ React.createElement("span", { key: idx, className: "text-[11px] bg-stone-100 text-stone-700 font-medium px-2.5 py-1 rounded-md" }, amenity)), room.amenities.length > 3 && /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      onClick: () => setAmenitiesExpanded((expanded) => !expanded),
      "aria-expanded": amenitiesExpanded,
      "aria-label": `${amenitiesExpanded ? "Hide extra" : "Show all"} amenities for ${room.name}`,
      className: "text-[11px] bg-amber-50 hover:bg-amber-100 text-amber-700 font-bold px-2.5 py-1 rounded-md border border-amber-200 transition"
    },
    amenitiesExpanded ? "Show less" : `+${room.amenities.length - 3} more`
  )))), /* @__PURE__ */ React.createElement("div", { className: "p-5 pt-0 border-t border-stone-100 flex items-center justify-between gap-2 mt-auto" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "flex items-baseline gap-1" }, /* @__PURE__ */ React.createElement("span", { className: "font-bold text-xl text-forest-950" }, "\u20B9", room.price), /* @__PURE__ */ React.createElement("span", { className: "text-xs text-stone-500" }, "/night")), room.originalPrice && /* @__PURE__ */ React.createElement("span", { className: "text-[11px] text-stone-400 line-through" }, "\u20B9", room.originalPrice)), /* @__PURE__ */ React.createElement("div", { className: "flex gap-2" }, /* @__PURE__ */ React.createElement(
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
    /* @__PURE__ */ React.createElement("div", { className: "lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap justify-between items-baseline gap-2 mb-2" }, /* @__PURE__ */ React.createElement("h2", { className: "font-serif text-2xl sm:text-3xl font-bold text-forest-950" }, room.name), /* @__PURE__ */ React.createElement("div", { className: "text-right" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-baseline gap-1" }, /* @__PURE__ */ React.createElement("span", { className: "text-2xl font-black text-forest-950" }, "\u20B9", room.price), /* @__PURE__ */ React.createElement("span", { className: "text-xs text-stone-500 font-medium" }, "/night + taxes")), room.originalPrice && /* @__PURE__ */ React.createElement("span", { className: "text-xs text-stone-400 line-through" }, "\u20B9", room.originalPrice))), /* @__PURE__ */ React.createElement("p", { className: "text-stone-600 text-sm leading-relaxed mb-6" }, room.description), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6 bg-warmCream p-4 rounded-2xl border border-stone-200/60 text-xs" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("span", { className: "text-stone-500 block font-medium" }, "Capacity"), /* @__PURE__ */ React.createElement("span", { className: "font-bold text-forest-950" }, room.capacity)), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("span", { className: "text-stone-500 block font-medium" }, "Bed Setup"), /* @__PURE__ */ React.createElement("span", { className: "font-bold text-forest-950" }, room.bed)), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("span", { className: "text-stone-500 block font-medium" }, "Room Size"), /* @__PURE__ */ React.createElement("span", { className: "font-bold text-forest-950" }, room.size || "280 sq.ft"))), /* @__PURE__ */ React.createElement("div", { className: "mb-6" }, /* @__PURE__ */ React.createElement("h4", { className: "text-xs font-bold uppercase tracking-wider text-stone-500 mb-2" }, "Included Amenities:"), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs" }, room.amenities.map((item, idx) => /* @__PURE__ */ React.createElement("div", { key: idx, className: "flex items-center gap-2 text-stone-700" }, /* @__PURE__ */ React.createElement("span", { className: "text-emerald-600 font-bold" }, "\u2713"), /* @__PURE__ */ React.createElement("span", null, item))))), room.mealPlans && /* @__PURE__ */ React.createElement("div", { className: "mb-6" }, /* @__PURE__ */ React.createElement("h4", { className: "text-xs font-bold uppercase tracking-wider text-stone-500 mb-2" }, "Pricing Plans:"), /* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap gap-2" }, room.mealPlans.map((plan) => /* @__PURE__ */ React.createElement("span", { key: plan, className: "text-xs bg-amber-50 text-amber-800 border border-amber-200 px-3 py-1.5 rounded-lg font-semibold" }, plan))), /* @__PURE__ */ React.createElement("p", { className: "text-[11px] text-stone-500 mt-2" }, "EP = Room Only | CP = Room + Breakfast | MAP = Room + Meals"))), /* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-stone-200" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2 text-xs text-stone-500" }, /* @__PURE__ */ React.createElement("span", null, "\u26A1 Instant Confirmation"), /* @__PURE__ */ React.createElement("span", null, "\u2022"), /* @__PURE__ */ React.createElement("span", null, "\u{1F6E1}\uFE0F Free Cancellation up to 48 hrs")), /* @__PURE__ */ React.createElement("div", { className: "flex gap-3 w-full sm:w-auto" }, /* @__PURE__ */ React.createElement(
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
function GalleryPage() {
  const [activeTab, setActiveTab] = useState("all");
  const images = [
    "https://checkinnhomes.com/wp-content/uploads/2026/03/JKS01209-2-1024x683.jpg",
    "https://checkinnhomes.com/wp-content/uploads/2026/03/JKS01206-scaled.jpg",
    "https://checkinnhomes.com/wp-content/uploads/2026/03/JKS01304-scaled.jpg",
    "https://checkinnhomes.com/wp-content/uploads/2026/03/JKS01298-scaled.jpg",
    "https://checkinnhomes.com/wp-content/uploads/2026/03/JKS01284-scaled.jpg",
    "https://checkinnhomes.com/wp-content/uploads/2026/03/JKS01244-scaled.jpg"
  ];
  const videos = ["https://www.youtube.com/embed/Scxs7L0vhZ4", "https://www.youtube.com/embed/1La4QzGeaaQ"];
  return /* @__PURE__ */ React.createElement("div", { className: "bg-[#faf7f2] min-h-screen py-14 sm:py-20" }, /* @__PURE__ */ React.createElement("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" }, /* @__PURE__ */ React.createElement("div", { className: "max-w-2xl mb-10" }, /* @__PURE__ */ React.createElement("span", { className: "text-amber-600 font-bold text-xs uppercase tracking-widest" }, "Checkinn Homes"), /* @__PURE__ */ React.createElement("h1", { className: "font-serif text-4xl sm:text-5xl font-bold text-forest-950 mt-3" }, "Gallery"), /* @__PURE__ */ React.createElement("p", { className: "text-stone-600 mt-4" }, "A closer look at our rooms, spaces, and the Tapovan surroundings.")), /* @__PURE__ */ React.createElement("div", { className: "flex gap-2 border-b border-stone-200 mb-8" }, [["all", "All"], ["images", "Images"], ["videos", "Videos"]].map(([id, label]) => /* @__PURE__ */ React.createElement("button", { key: id, onClick: () => setActiveTab(id), className: `px-5 py-3 text-sm font-bold border-b-2 ${activeTab === id ? "border-forest-900 text-forest-900" : "border-transparent text-stone-500"}` }, label))), activeTab !== "videos" && /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" }, images.map((image, index) => /* @__PURE__ */ React.createElement("img", { key: image, src: image, alt: `Checkinn Homes gallery ${index + 1}`, className: "w-full aspect-[4/3] object-cover rounded-lg shadow-sm", loading: "lazy" }))), activeTab === "all" && /* @__PURE__ */ React.createElement("h2", { className: "font-serif text-3xl font-bold text-forest-950 mt-14 mb-6" }, "Videos"), activeTab !== "images" && /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-5" }, videos.map((video, index) => /* @__PURE__ */ React.createElement("div", { key: video, className: "aspect-video bg-forest-950 rounded-lg overflow-hidden" }, /* @__PURE__ */ React.createElement("iframe", { className: "w-full h-full", src: video, title: `Rishikesh video ${index + 1}`, loading: "lazy", allowFullScreen: true }))))));
}
function AboutPage({ hotelConfig, setCurrentPage }) {
  return /* @__PURE__ */ React.createElement("div", { className: "py-12 md:py-20" }, /* @__PURE__ */ React.createElement("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" }, /* @__PURE__ */ React.createElement("div", { className: "text-center max-w-3xl mx-auto mb-16" }, /* @__PURE__ */ React.createElement("span", { className: "text-amber-600 font-bold text-xs uppercase tracking-widest" }, "Our Story & Heritage"), /* @__PURE__ */ React.createElement("h1", { className: "font-serif text-4xl sm:text-5xl font-bold text-forest-950 mt-2 mb-4" }, "Welcome to Checkinn Homes"), /* @__PURE__ */ React.createElement("p", { className: "text-stone-600 text-base leading-relaxed" }, "A serene haven perched in Upper Tapovan, built to make every traveler feel at home in the Yoga Capital of the World.")), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h2", { className: "font-serif text-2xl sm:text-3xl font-bold text-forest-950 mb-4" }, "Born from a Passion for Rishikesh & Authentic Hospitality"), /* @__PURE__ */ React.createElement("div", { className: "space-y-4 text-stone-600 text-sm sm:text-base leading-relaxed" }, /* @__PURE__ */ React.createElement("p", null, "Checkinn Homes was founded with one clear vision: to offer a clean, peaceful, and warm stay for seekers, adventurers, yogis, and families who want to experience the authentic magic of Rishikesh without noise and clutter."), /* @__PURE__ */ React.createElement("p", null, "Located right along Secret Waterfall Road near Kundan Restaurant, our home provides the rare sweet spot of Rishikesh stays: secluded enough to hear birds chirping and mountain winds in the morning, yet only a short walking distance from the bustling cafes, yoga studios, and iconic footbridges of Tapovan."), /* @__PURE__ */ React.createElement("p", null, "From high-speed fiber internet for your workstation to piping hot geysers after an evening Ganga Aarti, every corner of Checkinn Homes is maintained with love and care."), /* @__PURE__ */ React.createElement("p", null, "We welcome guests for quick weekend breaks as well as longer yoga courses and workations. Our team stays available throughout your visit, whether you need help planning an early-morning temple trip, finding a trusted cab, or simply choosing a quiet cafe for the afternoon.")), /* @__PURE__ */ React.createElement("div", { className: "mt-8 flex gap-4" }, /* @__PURE__ */ React.createElement("div", { className: "p-4 bg-white rounded-2xl border border-stone-200" }, /* @__PURE__ */ React.createElement("span", { className: "font-serif text-3xl font-bold text-forest-950 block" }, "4.9/5"), /* @__PURE__ */ React.createElement("span", { className: "text-xs text-stone-500 font-medium" }, "Guest Satisfaction Score")), /* @__PURE__ */ React.createElement("div", { className: "p-4 bg-white rounded-2xl border border-stone-200" }, /* @__PURE__ */ React.createElement("span", { className: "font-serif text-3xl font-bold text-forest-950 block" }, "100%"), /* @__PURE__ */ React.createElement("span", { className: "text-xs text-stone-500 font-medium" }, "Cleanliness Guarantee")))), /* @__PURE__ */ React.createElement("div", { className: "relative" }, /* @__PURE__ */ React.createElement(
    "img",
    {
      src: "https://checkinnhomes.com/wp-content/uploads/2026/03/JKS01209-2-1024x683.jpg",
      alt: "Check In Homes property",
      className: "rounded-3xl shadow-2xl object-cover w-full h-[460px]"
    }
  ), /* @__PURE__ */ React.createElement("div", { className: "absolute -bottom-6 -left-6 bg-forest-900 text-amber-300 p-6 rounded-3xl shadow-xl max-w-xs hidden sm:block border border-forest-800" }, /* @__PURE__ */ React.createElement("p", { className: "font-serif text-lg font-bold" }, '"Atithi Devo Bhava"'), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-stone-300 mt-1" }, "In Rishikesh, every guest is family. We look forward to hosting your journey.")))), /* @__PURE__ */ React.createElement("section", { className: "mb-20" }, /* @__PURE__ */ React.createElement("div", { className: "max-w-3xl mb-10" }, /* @__PURE__ */ React.createElement("span", { className: "text-amber-600 font-bold text-xs uppercase tracking-widest" }, "More Than a Room"), /* @__PURE__ */ React.createElement("h2", { className: "font-serif text-3xl sm:text-4xl font-bold text-forest-950 mt-2 mb-4" }, "A Stay Designed Around Your Rishikesh Journey"), /* @__PURE__ */ React.createElement("p", { className: "text-stone-600 text-sm sm:text-base leading-relaxed" }, "Every guest arrives with a different plan. Some come to slow down, some to complete a yoga course, and others to explore the river and mountains. We keep the experience flexible, comfortable, and genuinely local from check-in to departure.")), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-8 border-y border-stone-200 py-10" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("span", { className: "text-3xl", "aria-hidden": "true" }, "\u{1F6CF}\uFE0F"), /* @__PURE__ */ React.createElement("h3", { className: "font-serif text-xl font-bold text-forest-950 mt-4 mb-2" }, "Rest Well"), /* @__PURE__ */ React.createElement("p", { className: "text-sm text-stone-600 leading-relaxed" }, "Comfortable beds, fresh linen, private and shared room choices, hot water, and quiet nights help you recover after a full day outdoors.")), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("span", { className: "text-3xl", "aria-hidden": "true" }, "\u{1F4BB}"), /* @__PURE__ */ React.createElement("h3", { className: "font-serif text-xl font-bold text-forest-950 mt-4 mb-2" }, "Stay Connected"), /* @__PURE__ */ React.createElement("p", { className: "text-sm text-stone-600 leading-relaxed" }, "Reliable 100 Mbps fibre Wi-Fi and practical workspaces make longer stays easy for remote professionals, creators, and students.")), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("span", { className: "text-3xl", "aria-hidden": "true" }, "\u{1F9ED}"), /* @__PURE__ */ React.createElement("h3", { className: "font-serif text-xl font-bold text-forest-950 mt-4 mb-2" }, "Explore Like a Local"), /* @__PURE__ */ React.createElement("p", { className: "text-sm text-stone-600 leading-relaxed" }, "Ask us about waterfall trails, rafting, yoga classes, scooter rentals, airport transfers, and honest neighborhood recommendations.")))), /* @__PURE__ */ React.createElement("section", { className: "grid grid-cols-1 lg:grid-cols-2 gap-10 items-center mb-20 bg-forest-950 text-white overflow-hidden" }, /* @__PURE__ */ React.createElement(
    "img",
    {
      src: "https://checkinnhomes.com/wp-content/uploads/2026/03/New-Picture.png",
      alt: "Check In Homes in Upper Tapovan",
      className: "w-full h-80 lg:h-full min-h-[380px] object-cover"
    }
  ), /* @__PURE__ */ React.createElement("div", { className: "px-7 pb-10 lg:py-12 lg:pr-12 lg:pl-2" }, /* @__PURE__ */ React.createElement("span", { className: "text-amber-400 font-bold text-xs uppercase tracking-widest" }, "Our Neighborhood"), /* @__PURE__ */ React.createElement("h2", { className: "font-serif text-3xl sm:text-4xl font-bold mt-2 mb-5" }, "Upper Tapovan at Your Doorstep"), /* @__PURE__ */ React.createElement("p", { className: "text-stone-300 text-sm leading-relaxed mb-6" }, "Checkinn Homes sits near Secret Waterfall Road, close to the experiences that make Rishikesh special while remaining removed from the busiest traffic. Start your morning with a forest walk, join a yoga class, work from a nearby cafe, or head toward the Ganga for sunset."), /* @__PURE__ */ React.createElement("ul", { className: "grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm text-stone-200" }, /* @__PURE__ */ React.createElement("li", { className: "flex gap-2" }, /* @__PURE__ */ React.createElement("span", { className: "text-amber-400" }, "\u2713"), " Secret Waterfall trail nearby"), /* @__PURE__ */ React.createElement("li", { className: "flex gap-2" }, /* @__PURE__ */ React.createElement("span", { className: "text-amber-400" }, "\u2713"), " Cafes and restaurants on foot"), /* @__PURE__ */ React.createElement("li", { className: "flex gap-2" }, /* @__PURE__ */ React.createElement("span", { className: "text-amber-400" }, "\u2713"), " Easy access to yoga studios"), /* @__PURE__ */ React.createElement("li", { className: "flex gap-2" }, /* @__PURE__ */ React.createElement("span", { className: "text-amber-400" }, "\u2713"), " Local transport assistance")))), /* @__PURE__ */ React.createElement("section", { className: "mb-20" }, /* @__PURE__ */ React.createElement("div", { className: "text-center max-w-3xl mx-auto mb-10" }, /* @__PURE__ */ React.createElement("span", { className: "text-amber-600 font-bold text-xs uppercase tracking-widest" }, "Explore Check In Homes"), /* @__PURE__ */ React.createElement("h2", { className: "font-serif text-3xl sm:text-4xl font-bold text-forest-950 mt-2 mb-4" }, "Take a Closer Look at Our Rooms and Amenities"), /* @__PURE__ */ React.createElement("p", { className: "text-stone-600 text-sm sm:text-base" }, "From cozy interiors to peaceful surroundings, here's a glimpse of what awaits you at Check In Homes in Rishikesh.")), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-5" }, [
    "https://checkinnhomes.com/wp-content/uploads/2026/03/JKS01206-scaled.jpg",
    "https://checkinnhomes.com/wp-content/uploads/2026/03/JKS01304-scaled.jpg",
    "https://checkinnhomes.com/wp-content/uploads/2026/03/JKS01298-scaled.jpg",
    "https://checkinnhomes.com/wp-content/uploads/2026/03/JKS01286-scaled.jpg",
    "https://checkinnhomes.com/wp-content/uploads/2026/03/JKS01284-scaled.jpg",
    "https://checkinnhomes.com/wp-content/uploads/2026/03/JKS01275-scaled.jpg",
    "https://checkinnhomes.com/wp-content/uploads/2026/03/JKS01244-scaled.jpg",
    "https://checkinnhomes.com/wp-content/uploads/2026/03/JKS01240-scaled.jpg",
    "https://checkinnhomes.com/wp-content/uploads/2026/03/JKS01232-scaled.jpg",
    "https://checkinnhomes.com/wp-content/uploads/2026/03/JKS01213-scaled.jpg",
    "https://checkinnhomes.com/wp-content/uploads/2026/03/JKS01205-scaled.jpg",
    "https://checkinnhomes.com/wp-content/uploads/2026/03/JKS01199-scaled.jpg"
  ].map((image, index) => /* @__PURE__ */ React.createElement("img", { key: image, src: image, alt: `Check In Homes gallery ${index + 1}`, loading: "lazy", className: "w-full aspect-[4/3] object-cover" })))), /* @__PURE__ */ React.createElement("section", { className: "grid grid-cols-1 md:grid-cols-2 gap-8 mb-16" }, /* @__PURE__ */ React.createElement("div", { className: "bg-white p-8 border border-stone-200" }, /* @__PURE__ */ React.createElement("span", { className: "text-amber-600 font-bold text-xs uppercase tracking-widest" }, "Our Story"), /* @__PURE__ */ React.createElement("h3", { className: "font-serif text-2xl font-bold text-forest-950 mt-2 mb-4" }, "Our Mission"), /* @__PURE__ */ React.createElement("p", { className: "text-sm text-stone-600 leading-relaxed" }, "Our mission at Check In Homes is to provide comfortable, clean, and affordable stays that make every guest feel at home. We are committed to delivering seamless service, maintaining high standards of hygiene, and ensuring a stress-free experience for every traveler who stays with us.")), /* @__PURE__ */ React.createElement("div", { className: "bg-forest-900 text-white p-8 border border-forest-800" }, /* @__PURE__ */ React.createElement("span", { className: "text-amber-400 font-bold text-xs uppercase tracking-widest" }, "Our Future"), /* @__PURE__ */ React.createElement("h3", { className: "font-serif text-2xl font-bold mt-2 mb-4" }, "Our Vision"), /* @__PURE__ */ React.createElement("p", { className: "text-sm text-stone-300 leading-relaxed" }, "Our vision is to become a trusted and preferred choice for travelers visiting Rishikesh by consistently offering quality stays, warm hospitality, and memorable experiences. We aim to grow as a brand known for reliability, comfort, and guest satisfaction."))), /* @__PURE__ */ React.createElement("div", { className: "bg-white rounded-3xl p-8 sm:p-12 border border-stone-200 mb-16" }, /* @__PURE__ */ React.createElement("h3", { className: "font-serif text-2xl font-bold text-forest-950 text-center mb-8" }, "What Defines Stay at Checkinn Homes"), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-8" }, /* @__PURE__ */ React.createElement("div", { className: "text-center p-4" }, /* @__PURE__ */ React.createElement("div", { className: "w-14 h-14 mx-auto rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center text-2xl mb-4" }, "\u{1F54A}\uFE0F"), /* @__PURE__ */ React.createElement("h4", { className: "font-bold text-forest-950 mb-2" }, "Peaceful Solitude"), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-stone-600 leading-relaxed" }, "Away from high-traffic horns, providing optimal silence for meditation, study, and deep sleep.")), /* @__PURE__ */ React.createElement("div", { className: "text-center p-4" }, /* @__PURE__ */ React.createElement("div", { className: "w-14 h-14 mx-auto rounded-2xl bg-emerald-100 text-forest-800 flex items-center justify-center text-2xl mb-4" }, "\u{1F91D}"), /* @__PURE__ */ React.createElement("h4", { className: "font-bold text-forest-950 mb-2" }, "Personalized Host Support"), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-stone-600 leading-relaxed" }, "Get genuine local recommendations, secret swimming spots, and adventure bookings without middlemen markups.")), /* @__PURE__ */ React.createElement("div", { className: "text-center p-4" }, /* @__PURE__ */ React.createElement("div", { className: "w-14 h-14 mx-auto rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center text-2xl mb-4" }, "\u2728"), /* @__PURE__ */ React.createElement("h4", { className: "font-bold text-forest-950 mb-2" }, "Spotless Hygiene"), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-stone-600 leading-relaxed" }, "Crisp white linens, deeply sanitized bathrooms, and fresh mountain air in all rooms.")))), /* @__PURE__ */ React.createElement("div", { className: "text-center" }, /* @__PURE__ */ React.createElement("h3", { className: "font-serif text-2xl font-bold text-forest-950 mb-3" }, "Have questions before booking?"), /* @__PURE__ */ React.createElement("p", { className: "text-stone-600 text-sm mb-6" }, "Talk directly with our property manager right now."), /* @__PURE__ */ React.createElement(
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
  return /* @__PURE__ */ React.createElement("div", { className: "py-12 md:py-20" }, /* @__PURE__ */ React.createElement("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" }, /* @__PURE__ */ React.createElement("div", { className: "text-center max-w-3xl mx-auto mb-14" }, /* @__PURE__ */ React.createElement("span", { className: "text-amber-600 font-bold text-xs uppercase tracking-widest" }, "Contact Us"), /* @__PURE__ */ React.createElement("h1", { className: "font-serif text-4xl sm:text-5xl font-bold text-forest-950 mt-2 mb-4" }, "Get in Touch"), /* @__PURE__ */ React.createElement("p", { className: "text-stone-600 text-sm sm:text-base leading-relaxed" }, "Need help reaching Upper Tapovan or have queries about group retreats, bike rentals, or river rafting? We are always here.")), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 lg:grid-cols-12 gap-10" }, /* @__PURE__ */ React.createElement("div", { className: "lg:col-span-5 space-y-6" }, /* @__PURE__ */ React.createElement("div", { className: "bg-white rounded-3xl p-7 border border-stone-200 shadow-sm" }, /* @__PURE__ */ React.createElement("h3", { className: "font-serif text-xl font-bold text-forest-950 mb-6" }, "Stay Address & Desk"), /* @__PURE__ */ React.createElement("div", { className: "space-y-6" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-start gap-4" }, /* @__PURE__ */ React.createElement("div", { className: "w-10 h-10 rounded-xl bg-forest-50 text-forest-800 flex items-center justify-center shrink-0 text-lg" }, "\u{1F4CD}"), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h4", { className: "text-xs font-bold uppercase tracking-wider text-stone-400" }, "Address"), /* @__PURE__ */ React.createElement("p", { className: "text-sm font-semibold text-forest-950 mt-1 leading-snug" }, hotelConfig.location), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-amber-600 font-medium mt-1" }, "Landmark: Behind Kundan Restaurant, Upper Tapovan"))), /* @__PURE__ */ React.createElement("div", { className: "flex items-start gap-4" }, /* @__PURE__ */ React.createElement("div", { className: "w-10 h-10 rounded-xl bg-forest-50 text-forest-800 flex items-center justify-center shrink-0 text-lg" }, "\u{1F4DE}"), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h4", { className: "text-xs font-bold uppercase tracking-wider text-stone-400" }, "Phone / WhatsApp"), /* @__PURE__ */ React.createElement("a", { href: `tel:${hotelConfig.phone}`, className: "text-sm font-bold text-forest-950 hover:text-amber-600 block mt-1" }, hotelConfig.phone), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-stone-500" }, "Available 24/7 for guest assistance & check-ins"))), /* @__PURE__ */ React.createElement("div", { className: "flex items-start gap-4" }, /* @__PURE__ */ React.createElement("div", { className: "w-10 h-10 rounded-xl bg-forest-50 text-forest-800 flex items-center justify-center shrink-0 text-lg" }, "\u2709\uFE0F"), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h4", { className: "text-xs font-bold uppercase tracking-wider text-stone-400" }, "Official Email"), /* @__PURE__ */ React.createElement("a", { href: `mailto:${hotelConfig.email}`, className: "text-sm font-bold text-forest-950 hover:text-amber-600 block mt-1" }, hotelConfig.email)))), /* @__PURE__ */ React.createElement("div", { className: "mt-8 pt-6 border-t border-stone-100" }, /* @__PURE__ */ React.createElement(
    "a",
    {
      href: `https://wa.me/${hotelConfig.whatsapp?.replace(/[^0-9]/g, "")}?text=Hello%20Checkinn%20Homes,%20I%20have%20an%20inquiry`,
      target: "_blank",
      rel: "noreferrer",
      className: "w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl flex items-center justify-center gap-2 text-sm shadow transition"
    },
    /* @__PURE__ */ React.createElement("span", null, "\u{1F4AC}"),
    " Chat Instantly on WhatsApp"
  ))), /* @__PURE__ */ React.createElement("div", { className: "bg-forest-900 text-white rounded-3xl p-6 border border-forest-800" }, /* @__PURE__ */ React.createElement("h4", { className: "font-serif text-lg font-bold text-amber-300 mb-2" }, "Check-in / Out Timings"), /* @__PURE__ */ React.createElement("div", { className: "flex justify-between text-xs sm:text-sm py-2 border-b border-forest-800" }, /* @__PURE__ */ React.createElement("span", { className: "text-stone-300" }, "Standard Check-In:"), /* @__PURE__ */ React.createElement("span", { className: "font-bold" }, hotelConfig.checkInTime)), /* @__PURE__ */ React.createElement("div", { className: "flex justify-between text-xs sm:text-sm py-2" }, /* @__PURE__ */ React.createElement("span", { className: "text-stone-300" }, "Standard Check-Out:"), /* @__PURE__ */ React.createElement("span", { className: "font-bold" }, hotelConfig.checkOutTime)), /* @__PURE__ */ React.createElement("p", { className: "text-[11px] text-stone-400 mt-2" }, "*Early check-in & late check-out subject to availability upon request."), /* @__PURE__ */ React.createElement("div", { className: "mt-4 pt-4 border-t border-forest-800 flex items-center justify-between text-xs sm:text-sm" }, /* @__PURE__ */ React.createElement("span", { className: "text-stone-300" }, "Business Hours:"), /* @__PURE__ */ React.createElement("span", { className: "font-bold" }, "24/7 Front Desk Support")))), /* @__PURE__ */ React.createElement("div", { className: "lg:col-span-7" }, /* @__PURE__ */ React.createElement("div", { className: "bg-white rounded-3xl p-8 border border-stone-200 shadow-sm" }, /* @__PURE__ */ React.createElement("h3", { className: "font-serif text-2xl font-bold text-forest-950 mb-2" }, "Send Us a Direct Message"), /* @__PURE__ */ React.createElement("p", { className: "text-stone-600 text-xs sm:text-sm mb-6" }, "Leave your query below and it will instantly reach our staff admin panel and support team."), /* @__PURE__ */ React.createElement("form", { onSubmit: handleSubmit, className: "space-y-4" }, /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-xs font-bold uppercase text-stone-500 mb-1" }, "Your Full Name *"), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "text",
      placeholder: "e.g. Rahul Sharma",
      value: contactForm.name,
      onChange: (e) => setContactForm({ ...contactForm, name: e.target.value }),
      className: "w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-forest-800 font-medium bg-stone-50/50",
      required: true
    }
  )), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-xs font-bold uppercase text-stone-500 mb-1" }, "Phone / WhatsApp Number *"), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "tel",
      placeholder: "e.g. +91 98765 43210",
      value: contactForm.phone,
      onChange: (e) => setContactForm({ ...contactForm, phone: e.target.value }),
      className: "w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-forest-800 font-medium bg-stone-50/50",
      required: true
    }
  ))), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-xs font-bold uppercase text-stone-500 mb-1" }, "Email Address"), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "email",
      placeholder: "name@domain.com",
      value: contactForm.email,
      onChange: (e) => setContactForm({ ...contactForm, email: e.target.value }),
      className: "w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-forest-800 font-medium bg-stone-50/50"
    }
  )), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-xs font-bold uppercase text-stone-500 mb-1" }, "Inquiry Topic"), /* @__PURE__ */ React.createElement(
    "select",
    {
      value: contactForm.subject,
      onChange: (e) => setContactForm({ ...contactForm, subject: e.target.value }),
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
      onChange: (e) => setContactForm({ ...contactForm, message: e.target.value }),
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
      href: "https://maps.app.goo.gl/6ojptuSNUgTyHrHD7",
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
  const [reviewForm, setReviewForm] = useState({
    name: "",
    city: "",
    rating: 5,
    room: rooms[0]?.name || "Premium Room",
    comment: ""
  });
  const handleSubmitReview = (e) => {
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
      room: rooms[0]?.name || "Premium Room",
      comment: ""
    });
  };
  return /* @__PURE__ */ React.createElement("div", { className: "py-12 md:py-20" }, /* @__PURE__ */ React.createElement("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" }, /* @__PURE__ */ React.createElement("div", { className: "text-center max-w-3xl mx-auto mb-16" }, /* @__PURE__ */ React.createElement("span", { className: "text-amber-600 font-bold text-xs uppercase tracking-widest" }, "Community Stories"), /* @__PURE__ */ React.createElement("h1", { className: "font-serif text-4xl sm:text-5xl font-bold text-forest-950 mt-2 mb-4" }, "Guest Reviews & Feedback"), /* @__PURE__ */ React.createElement("p", { className: "text-stone-600 text-sm sm:text-base leading-relaxed" }, "We believe in genuine hospitality. Read recent experiences from our guests or share your own memory of staying with us in Rishikesh.")), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 lg:grid-cols-12 gap-10" }, /* @__PURE__ */ React.createElement("div", { className: "lg:col-span-5" }, /* @__PURE__ */ React.createElement("div", { className: "bg-white rounded-3xl p-8 border border-stone-200 shadow-md sticky top-28" }, /* @__PURE__ */ React.createElement("h3", { className: "font-serif text-2xl font-bold text-forest-950 mb-1" }, "Share Your Stay Story"), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-stone-500 mb-6" }, "Your feedback helps fellow travelers find peaceful stays in Tapovan."), /* @__PURE__ */ React.createElement("form", { onSubmit: handleSubmitReview, className: "space-y-4" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-xs font-bold uppercase text-stone-500 mb-1" }, "Your Name *"), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "text",
      placeholder: "e.g. Priya & Ankit",
      value: reviewForm.name,
      onChange: (e) => setReviewForm({ ...reviewForm, name: e.target.value }),
      className: "w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm font-medium bg-stone-50/60 focus:outline-none focus:ring-2 focus:ring-forest-800",
      required: true
    }
  )), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-2 gap-3" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-xs font-bold uppercase text-stone-500 mb-1" }, "City / Country"), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "text",
      placeholder: "e.g. Mumbai, India",
      value: reviewForm.city,
      onChange: (e) => setReviewForm({ ...reviewForm, city: e.target.value }),
      className: "w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm font-medium bg-stone-50/60 focus:outline-none focus:ring-2 focus:ring-forest-800"
    }
  )), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-xs font-bold uppercase text-stone-500 mb-1" }, "Star Rating"), /* @__PURE__ */ React.createElement(
    "select",
    {
      value: reviewForm.rating,
      onChange: (e) => setReviewForm({ ...reviewForm, rating: e.target.value }),
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
      onChange: (e) => setReviewForm({ ...reviewForm, room: e.target.value }),
      className: "w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm font-medium bg-stone-50/60 focus:outline-none focus:ring-2 focus:ring-forest-800"
    },
    rooms.map((r) => /* @__PURE__ */ React.createElement("option", { key: r.id, value: r.name }, r.name))
  )), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-xs font-bold uppercase text-stone-500 mb-1" }, "Your Honest Review *"), /* @__PURE__ */ React.createElement(
    "textarea",
    {
      rows: "4",
      placeholder: "How was the room cleanliness, waterfall walk, staff assistance, and Wi-Fi speed?",
      value: reviewForm.comment,
      onChange: (e) => setReviewForm({ ...reviewForm, comment: e.target.value }),
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
  )))), /* @__PURE__ */ React.createElement("div", { className: "lg:col-span-7 space-y-6" }, /* @__PURE__ */ React.createElement("div", { className: "flex justify-between items-center mb-2" }, /* @__PURE__ */ React.createElement("h3", { className: "font-serif text-2xl font-bold text-forest-950" }, "Verified Stories (", reviews.length, ")"), /* @__PURE__ */ React.createElement("span", { className: "text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200" }, "4.9 Average Rating")), reviews.map((rev) => /* @__PURE__ */ React.createElement("div", { key: rev.id, className: "bg-white rounded-3xl p-6 border border-stone-200 shadow-sm hover:shadow-md transition" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-start justify-between gap-4 mb-3" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-3" }, rev.avatar ? /* @__PURE__ */ React.createElement("img", { src: rev.avatar, alt: rev.name, className: "w-12 h-12 rounded-full object-cover border border-stone-300" }) : /* @__PURE__ */ React.createElement("div", { className: "w-12 h-12 rounded-full bg-forest-900 text-amber-300 flex items-center justify-center font-bold border border-forest-800" }, rev.name.charAt(0)), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h4", { className: "font-bold text-forest-950 text-sm" }, rev.name), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-stone-500" }, rev.city, " \u2022 ", /* @__PURE__ */ React.createElement("span", { className: "text-amber-700 font-semibold" }, rev.room)))), /* @__PURE__ */ React.createElement("div", { className: "text-right" }, /* @__PURE__ */ React.createElement("div", { className: "flex text-amber-400 text-sm" }, Array.from({ length: rev.rating }).map((_, i) => /* @__PURE__ */ React.createElement("span", { key: i }, "\u2605"))), /* @__PURE__ */ React.createElement("span", { className: "text-[11px] text-stone-400" }, rev.date))), /* @__PURE__ */ React.createElement("p", { className: "text-stone-700 text-sm leading-relaxed italic font-serif" }, '"', rev.comment, '"')))))));
}
function AdminPanel({
  rooms,
  setRooms,
  roomTypes,
  setRoomTypes,
  bookings,
  setBookings,
  queries,
  setQueries,
  reviews,
  setReviews,
  coupons,
  setCoupons,
  hotelConfig,
  setHotelConfig,
  showToast
}) {
  const [adminTab, setAdminTab] = useState("dashboard");
  const [bookingSearch, setBookingSearch] = useState("");
  const [bookingFilter, setBookingFilter] = useState("All");
  const [roomTypeDraft, setRoomTypeDraft] = useState("");
  const [editingRoomType, setEditingRoomType] = useState(null);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => !API_ENABLED && (localStorage.getItem("cih_admin_authenticated") === "true" || sessionStorage.getItem("cih_admin_authenticated") === "true"));
  const [isAdminAuthChecking, setIsAdminAuthChecking] = useState(API_ENABLED);
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [adminLoginError, setAdminLoginError] = useState("");
  const [adminLoginForm, setAdminLoginForm] = useState({ email: "", password: "", remember: true });
  const [apiConnectionStatus, setApiConnectionStatus] = useState("idle");
  const [couponDraft, setCouponDraft] = useState({ code: "", discountType: "percentage", discountValue: 10, minimumAmount: 0, active: true });
  const [editingCouponId, setEditingCouponId] = useState(null);
  const [editingBooking, setEditingBooking] = useState(null);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [profileEditorOpen, setProfileEditorOpen] = useState(false);
  const [adminProfile, setAdminProfile] = useState({ display_name: "Property Admin", profile_photo: "", email: ADMIN_CREDENTIALS.email });
  const [profileDraft, setProfileDraft] = useState({ displayName: "Property Admin", profilePhoto: "", currentPassword: "", newPassword: "", deactivate: false });
  const seoPages = [{ key: "home", label: "Home" }, { key: "rooms", label: "Rooms" }, { key: "aboutus", label: "About Us" }, { key: "gallery", label: "Gallery" }, { key: "feedback", label: "Guest Stories" }, { key: "contact", label: "Contact" }];
  const [selectedSeoPage, setSelectedSeoPage] = useState("home");
  const [seoDraft, setSeoDraft] = useState({ pageKey: "home", title: "Checkinn Homes | Stay in Upper Tapovan, Rishikesh", metaDescription: "", focusKeyword: "", canonicalPath: "/", robots: "index,follow", ogImage: "", h1: "", introText: "", schemaJson: "" });
  const [editingRoom, setEditingRoom] = useState(null);
  useEffect(() => {
    if (!API_ENABLED) return void 0;
    let active = true;
    apiRequest("auth").then((data) => {
      if (active) {
        setIsAdminAuthenticated(Boolean(data.authenticated));
        if (data.profile) setAdminProfile(data.profile);
      }
    }).catch(() => {
      if (active) setIsAdminAuthenticated(false);
    }).finally(() => {
      if (active) setIsAdminAuthChecking(false);
    });
    return () => {
      active = false;
    };
  }, []);
  const totalRevenue = useMemo(() => {
    return bookings.reduce((sum, b) => sum + (Number(b.totalAmount) || 0), 0);
  }, [bookings]);
  const confirmedBookings = bookings.filter((booking) => booking.status === "Confirmed").length;
  const checkedInBookings = bookings.filter((booking) => booking.status === "Checked-In").length;
  const newQueries = queries.filter((query) => query.status === "New").length;
  const occupancyRate = Math.min(100, Math.round((confirmedBookings + checkedInBookings) / Math.max(rooms.length, 1) * 100));
  const roomPerformance = rooms.map((room) => ({
    name: room.name,
    bookings: bookings.filter((booking) => booking.roomName === room.name).length
  }));
  const maxRoomBookings = Math.max(1, ...roomPerformance.map((room) => room.bookings));
  const filteredBookings = bookings.filter((booking) => {
    const searchValue = bookingSearch.toLowerCase();
    const matchesSearch = [booking.id, booking.guestName, booking.phone, booking.roomName].some((value) => String(value || "").toLowerCase().includes(searchValue));
    return matchesSearch && (bookingFilter === "All" || booking.status === bookingFilter);
  });
  const adminNavItems = [
    { id: "dashboard", icon: "\u25EB", label: "Dashboard" },
    { id: "bookings", icon: "\u25A4", label: "Bookings", count: bookings.length },
    { id: "rooms", icon: "\u25A3", label: "Rooms", count: rooms.length },
    { id: "roomTypes", icon: "\u25C7", label: "Room Types", count: roomTypes.length },
    { id: "queries", icon: "\u25CC", label: "Guest Queries", count: newQueries },
    { id: "feedback", icon: "\u2605", label: "Reviews", count: reviews.length },
    { id: "coupons", icon: "%", label: "Coupons", count: coupons.length },
    { id: "seo", icon: "\u2315", label: "SEO" },
    { id: "settings", icon: "\u2699", label: "Property Settings" },
    { id: "mysql", icon: "\u2318", label: "Database Setup" }
  ];
  const openAddRoom = () => {
    setEditingRoom({
      id: `room-${Date.now()}`,
      name: "",
      type: roomTypes[0] || "",
      price: 0,
      originalPrice: null,
      capacity: "2 Guests",
      bed: "Double Bed",
      size: "",
      rating: 5,
      reviewsCount: 0,
      image: "",
      gallery: [],
      newGalleryUrl: "",
      amenities: [],
      breakfastPrice: "",
      mealsPrice: "",
      description: "",
      isNew: true
    });
  };
  const saveRoomType = async (event) => {
    event.preventDefault();
    const typeName = roomTypeDraft.trim();
    if (!typeName) return;
    const duplicate = roomTypes.some((type) => type.toLowerCase() === typeName.toLowerCase() && type !== editingRoomType);
    if (duplicate) {
      showToast("This room type already exists.", "error");
      return;
    }
    try {
      if (editingRoomType) {
        if (API_ENABLED) await apiRequest("room-types", { method: "PUT", body: { oldName: editingRoomType, name: typeName } });
        setRoomTypes(roomTypes.map((type) => type === editingRoomType ? typeName : type));
        setRooms(rooms.map((room) => room.type === editingRoomType ? { ...room, type: typeName } : room));
        showToast(`Room type renamed to "${typeName}".`);
      } else {
        if (API_ENABLED) await apiRequest("room-types", { method: "POST", body: { name: typeName } });
        setRoomTypes([...roomTypes, typeName]);
        showToast(`Room type "${typeName}" added.`);
      }
    } catch (error) {
      showToast(error.message, "error");
      return;
    }
    setRoomTypeDraft("");
    setEditingRoomType(null);
  };
  const startEditingRoomType = (type) => {
    setEditingRoomType(type);
    setRoomTypeDraft(type);
  };
  const deleteRoomType = async (type) => {
    const assignedRooms = rooms.filter((room) => room.type === type).length;
    if (assignedRooms > 0) {
      showToast(`Reassign ${assignedRooms} room${assignedRooms === 1 ? "" : "s"} before deleting this type.`, "error");
      return;
    }
    if (!window.confirm(`Delete room type "${type}"?`)) return;
    try {
      if (API_ENABLED) await apiRequest("room-types", { method: "DELETE", body: { name: type } });
      setRoomTypes(roomTypes.filter((item) => item !== type));
      showToast(`Room type "${type}" deleted.`);
    } catch (error) {
      showToast(error.message, "error");
    }
  };
  const addRoomImages = (images) => {
    setEditingRoom((room) => {
      const gallery = Array.from(new Set([...room.gallery || [], ...images].filter(Boolean)));
      return { ...room, image: room.image || gallery[0] || "", gallery, newGalleryUrl: "" };
    });
  };
  const addRoomImageUrl = () => {
    const imageUrl = editingRoom.newGalleryUrl?.trim();
    if (!imageUrl) return;
    try {
      new URL(imageUrl);
      addRoomImages([imageUrl]);
    } catch {
      showToast("Please enter a valid image URL.", "error");
    }
  };
  const compressRoomImage = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      const image = new Image();
      image.onerror = reject;
      image.onload = () => {
        const maxWidth = 1200;
        const maxHeight = 900;
        const scale = Math.min(1, maxWidth / image.width, maxHeight / image.height);
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(image.width * scale);
        canvas.height = Math.round(image.height * scale);
        canvas.getContext("2d").drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.78));
      };
      image.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
  const uploadRoomImages = async (event) => {
    const files = Array.from(event.target.files || []).filter((file) => file.type.startsWith("image/"));
    if (!files.length) return;
    try {
      const images = API_ENABLED ? await apiUploadImages(files) : await Promise.all(files.map(compressRoomImage));
      addRoomImages(images);
      showToast(`${images.length} photo${images.length === 1 ? "" : "s"} added.`);
    } catch {
      showToast("One or more photos could not be added.", "error");
    }
    event.target.value = "";
  };
  const setMainRoomImage = (imageUrl) => {
    setEditingRoom((room) => ({
      ...room,
      image: imageUrl,
      gallery: [imageUrl, ...(room.gallery || []).filter((image) => image !== imageUrl)]
    }));
  };
  const removeRoomImage = (imageUrl) => {
    setEditingRoom((room) => {
      const gallery = (room.gallery || []).filter((image) => image !== imageUrl);
      return { ...room, gallery, image: room.image === imageUrl ? gallery[0] || "" : room.image };
    });
  };
  const exportBookings = () => {
    const rows = [["Booking ID", "Guest", "Phone", "Email", "Room", "Check In", "Check Out", "Guests", "Amount", "Status"]];
    bookings.forEach((booking) => rows.push([
      booking.id,
      booking.guestName,
      booking.phone,
      booking.email,
      booking.roomName,
      booking.checkIn,
      booking.checkOut,
      booking.guests,
      booking.totalAmount,
      booking.status
    ]));
    const csv = rows.map((row) => row.map((value) => `"${String(value ?? "").replace(/"/g, '""')}"`).join(",")).join("\n");
    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    link.download = `checkinn-bookings-${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
    showToast("Booking report exported successfully.");
  };
  const deleteBooking = async (bookingId) => {
    if (!window.confirm(`Delete booking ${bookingId}?`)) return;
    try {
      if (API_ENABLED) await apiRequest("bookings", { method: "DELETE", body: { id: bookingId } });
      setBookings(bookings.filter((booking) => booking.id !== bookingId));
      showToast(`Booking ${bookingId} deleted.`);
    } catch (error) {
      showToast(error.message, "error");
    }
  };
  const handleSaveRoom = async (e) => {
    e.preventDefault();
    const { isNew, amenitiesText, breakfastPrice, mealsPrice, newGalleryUrl, ...roomData } = editingRoom;
    if (!roomData.image || !roomData.gallery?.length) {
      showToast("Please add at least one room photo.", "error");
      return;
    }
    const roomOnlyPrice = Number(roomData.price) || 0;
    const gallery = Array.from(new Set([roomData.image, ...roomData.gallery].filter(Boolean)));
    const normalizedRoom = {
      ...roomData,
      price: roomOnlyPrice,
      originalPrice: roomData.originalPrice ? Number(roomData.originalPrice) : null,
      amenities: String(amenitiesText ?? roomData.amenities.join(",")).split(",").map((amenity) => amenity.trim()).filter(Boolean),
      image: roomData.image,
      gallery,
      mealPlans: [
        `Room Only (EP): \u20B9${roomOnlyPrice.toLocaleString("en-IN")}`,
        breakfastPrice ? `With Breakfast (CP): \u20B9${Number(breakfastPrice).toLocaleString("en-IN")}` : null,
        mealsPrice ? `With Meals (MAP): \u20B9${Number(mealsPrice).toLocaleString("en-IN")}` : null
      ].filter(Boolean)
    };
    try {
      const savedRoom = API_ENABLED ? await apiRequest("rooms", { method: isNew ? "POST" : "PUT", body: normalizedRoom }) : normalizedRoom;
      setRooms(isNew ? [...rooms, savedRoom] : rooms.map((room) => room.id === savedRoom.id ? savedRoom : room));
      setEditingRoom(null);
      showToast(`Room "${savedRoom.name}" ${isNew ? "added" : "updated"} successfully!`);
    } catch (error) {
      showToast(error.message, "error");
    }
  };
  const deleteRoom = async (room) => {
    const linkedBookings = bookings.filter((booking) => booking.roomName === room.name).length;
    const warning = linkedBookings > 0 ? ` This room has ${linkedBookings} existing booking(s); booking records will be kept.` : "";
    if (!window.confirm(`Delete "${room.name}"?${warning}`)) return;
    try {
      if (API_ENABLED) await apiRequest("rooms", { method: "DELETE", body: { id: room.id } });
      setRooms(rooms.filter((item) => item.id !== room.id));
      showToast(`Room "${room.name}" deleted.`);
    } catch (error) {
      showToast(error.message, "error");
    }
  };
  const updateBookingStatus = async (bookingId, newStatus) => {
    try {
      if (API_ENABLED) await apiRequest("bookings", { method: "PUT", body: { id: bookingId, status: newStatus } });
      setBookings(bookings.map((b) => b.id === bookingId ? { ...b, status: newStatus } : b));
      showToast(`Booking ${bookingId} status updated to ${newStatus}`);
    } catch (error) {
      showToast(error.message, "error");
    }
  };
  const deleteQuery = async (queryId) => {
    try {
      if (API_ENABLED) await apiRequest("queries", { method: "DELETE", body: { id: queryId } });
      setQueries(queries.filter((q) => q.id !== queryId));
      showToast("Query deleted.");
    } catch (error) {
      showToast(error.message, "error");
    }
  };
  const toggleQueryStatus = async (queryId) => {
    const query = queries.find((item) => item.id === queryId);
    const status = query?.status === "Resolved" ? "New" : "Resolved";
    try {
      if (API_ENABLED) await apiRequest("queries", { method: "PUT", body: { id: queryId, status } });
      setQueries(queries.map((q) => q.id === queryId ? { ...q, status } : q));
      showToast("Query status updated.");
    } catch (error) {
      showToast(error.message, "error");
    }
  };
  const deleteReview = async (reviewId) => {
    try {
      if (API_ENABLED) await apiRequest("reviews", { method: "DELETE", body: { id: reviewId } });
      setReviews(reviews.filter((review) => review.id !== reviewId));
      showToast("Review removed.");
    } catch (error) {
      showToast(error.message, "error");
    }
  };
  const saveHotelSettings = async () => {
    try {
      if (API_ENABLED) {
        const savedSettings = await apiRequest("settings", { method: "PUT", body: hotelConfig });
        setHotelConfig((current) => ({ ...current, ...savedSettings }));
      }
      showToast("Property settings saved and published.");
    } catch (error) {
      showToast(error.message, "error");
    }
  };
  const uploadPropertyLogo = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const [logoUrl] = API_ENABLED ? await apiUploadImages([file]) : [await compressRoomImage(file)];
      setHotelConfig({ ...hotelConfig, logoUrl });
      showToast("Logo uploaded. Save changes to publish it.");
    } catch (error) {
      showToast(error.message || "Logo upload failed.", "error");
    }
    event.target.value = "";
  };
  const addCoupon = async (event) => {
    event.preventDefault();
    try {
      const isEditing = editingCouponId !== null;
      const payload = isEditing ? { ...couponDraft, id: editingCouponId } : couponDraft;
      const coupon = API_ENABLED ? await apiRequest("coupons", { method: isEditing ? "PUT" : "POST", body: payload }) : { ...payload, id: isEditing ? editingCouponId : Date.now(), code: couponDraft.code.toUpperCase() };
      setCoupons(isEditing ? coupons.map((item) => item.id === coupon.id ? coupon : item) : [coupon, ...coupons]);
      setCouponDraft({ code: "", discountType: "percentage", discountValue: 10, minimumAmount: 0, active: true });
      setEditingCouponId(null);
      showToast(isEditing ? "Coupon updated." : "Coupon added and published.");
    } catch (error) {
      showToast(error.message, "error");
    }
  };
  const startEditingCoupon = (coupon) => {
    setEditingCouponId(coupon.id);
    setCouponDraft({ code: coupon.code, discountType: coupon.discountType || "percentage", discountValue: coupon.discountValue ?? coupon.discountPercent, minimumAmount: coupon.minimumAmount, active: coupon.active });
  };
  const deleteCoupon = async (couponId) => {
    try {
      if (API_ENABLED) await apiRequest("coupons", { method: "DELETE", body: { id: couponId } });
      setCoupons(coupons.filter((coupon) => coupon.id !== couponId));
      showToast("Coupon deleted.");
    } catch (error) {
      showToast(error.message, "error");
    }
  };
  const toggleCouponActive = async (coupon) => {
    try {
      const updatedCoupon = { ...coupon, active: !coupon.active };
      const savedCoupon = API_ENABLED ? await apiRequest("coupons", { method: "PUT", body: updatedCoupon }) : updatedCoupon;
      setCoupons(coupons.map((item) => item.id === savedCoupon.id ? savedCoupon : item));
      showToast(`${savedCoupon.code} is now ${savedCoupon.active ? "active" : "inactive"}.`);
    } catch (error) {
      showToast(error.message, "error");
    }
  };
  const saveBookingEdit = async (event) => {
    event.preventDefault();
    try {
      const savedBooking = API_ENABLED ? await apiRequest("bookings", { method: "PUT", body: editingBooking }) : editingBooking;
      setBookings(bookings.map((booking) => booking.id === savedBooking.id ? savedBooking : booking));
      setEditingBooking(null);
      showToast("Booking updated.");
    } catch (error) {
      showToast(error.message, "error");
    }
  };
  const testApiConnection = async () => {
    if (!API_ENABLED) {
      setApiConnectionStatus("Upload the project to demo.checkinnhomes.com to test MySQL.");
      return;
    }
    setApiConnectionStatus("Testing connection...");
    try {
      const data = await apiRequest("bootstrap");
      setApiConnectionStatus(`Connected successfully. ${data.rooms?.length || 0} rooms loaded from MySQL.`);
    } catch (error) {
      setApiConnectionStatus(`Connection failed: ${error.message}`);
    }
  };
  const handleAdminLogin = async (event) => {
    event.preventDefault();
    try {
      if (API_ENABLED) {
        const result = await apiRequest("auth", { method: "POST", body: { email: adminLoginForm.email, password: adminLoginForm.password } });
        apiCsrfToken = result.csrfToken || "";
        const data = await apiRequest("bootstrap");
        if (data.rooms) setRooms(data.rooms);
        if (data.roomTypes) setRoomTypes(data.roomTypes);
        if (data.reviews) setReviews(data.reviews);
        if (data.coupons) setCoupons(data.coupons);
        if (data.bookings) setBookings(data.bookings);
        if (data.queries) setQueries(data.queries);
        if (result.profile) setAdminProfile(result.profile);
        if (data.hotelConfig) setHotelConfig((current) => ({ ...current, ...data.hotelConfig }));
      } else {
        if (adminLoginForm.email.trim().toLowerCase() !== ADMIN_CREDENTIALS.email || adminLoginForm.password !== ADMIN_CREDENTIALS.password) {
          throw new Error("Incorrect email or password. Please try again.");
        }
        const storage = adminLoginForm.remember ? localStorage : sessionStorage;
        storage.setItem("cih_admin_authenticated", "true");
        sessionStorage.setItem("cih_admin_authenticated", "true");
      }
      setAdminLoginError("");
      setIsAdminAuthenticated(true);
    } catch (error) {
      setAdminLoginError(error.message);
    }
  };
  const handleAdminLogout = async () => {
    if (API_ENABLED) {
      try {
        await apiRequest("auth", { method: "DELETE", body: {} });
      } catch (error) {
        console.error(error);
      }
      apiCsrfToken = "";
    }
    localStorage.removeItem("cih_admin_authenticated");
    sessionStorage.removeItem("cih_admin_authenticated");
    setAdminLoginForm({ email: "", password: "", remember: true });
    setIsAdminAuthenticated(false);
  };
  const openProfileEditor = () => {
    setProfileDraft({ displayName: adminProfile.display_name || "Property Admin", profilePhoto: adminProfile.profile_photo || "", currentPassword: "", newPassword: "", deactivate: false });
    setAccountMenuOpen(false);
    setProfileEditorOpen(true);
  };
  const saveProfile = async (event) => {
    event.preventDefault();
    if (profileDraft.deactivate && !window.confirm("Deactivate this account? You will be logged out and cannot sign in until it is reactivated in the database.")) return;
    try {
      const result = API_ENABLED ? await apiRequest("auth", { method: "PUT", body: profileDraft }) : { profile: { display_name: profileDraft.displayName, profile_photo: profileDraft.profilePhoto, email: adminProfile.email }, deactivated: profileDraft.deactivate };
      if (result.deactivated) {
        setProfileEditorOpen(false);
        setIsAdminAuthenticated(false);
        return;
      }
      setAdminProfile(result.profile);
      setProfileEditorOpen(false);
      showToast("Profile updated.");
    } catch (error) {
      showToast(error.message, "error");
    }
  };
  const openSeoPage = async (pageKey) => {
    setSelectedSeoPage(pageKey);
    const fallback = seoPages.find((page) => page.key === pageKey);
    try {
      const seoRecords = API_ENABLED ? await apiRequest("seo") : [];
      const saved = seoRecords.find((record) => record.page_key === pageKey) || {};
      setSeoDraft({ pageKey, title: saved.title || `Checkinn Homes | ${fallback.label}`, metaDescription: saved.meta_description || "", focusKeyword: saved.focus_keyword || "", canonicalPath: saved.canonical_path || (pageKey === "home" ? "/" : `/${pageKey}`), robots: saved.robots || "index,follow", ogImage: saved.og_image || "", h1: saved.h1 || "", introText: saved.intro_text || "", schemaJson: saved.schema_json || "" });
    } catch (error) {
      showToast(error.message, "error");
    }
  };
  const saveSeoPage = async (event) => {
    event.preventDefault();
    try {
      if (seoDraft.schemaJson.trim()) JSON.parse(seoDraft.schemaJson);
      if (API_ENABLED) await apiRequest("seo", { method: "PUT", body: seoDraft });
      showToast("SEO settings saved. They are now included in the page source.");
    } catch (error) {
      showToast(error.message === "Unexpected token" ? "Schema must be valid JSON." : error.message, "error");
    }
  };
  if (isAdminAuthChecking) {
    return /* @__PURE__ */ React.createElement("div", { className: "min-h-screen bg-forest-950 text-white flex items-center justify-center" }, /* @__PURE__ */ React.createElement("div", { className: "text-center" }, /* @__PURE__ */ React.createElement("div", { className: "w-12 h-12 border-4 border-amber-300 border-t-transparent rounded-full animate-spin mx-auto mb-4" }), /* @__PURE__ */ React.createElement("p", { className: "text-sm text-slate-300" }, "Checking secure session...")));
  }
  if (!isAdminAuthenticated) {
    return /* @__PURE__ */ React.createElement("div", { className: "relative min-h-screen overflow-hidden bg-forest-950 text-white" }, /* @__PURE__ */ React.createElement("img", { src: ADMIN_LOGIN_BACKGROUND, alt: "Luxury hotel reception", className: "absolute inset-0 w-full h-full object-cover" }), /* @__PURE__ */ React.createElement("div", { className: "absolute inset-0 bg-gradient-to-r from-forest-950/95 via-forest-950/55 to-forest-950/25" }), /* @__PURE__ */ React.createElement("div", { className: "relative min-h-screen max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-10 flex items-center" }, /* @__PURE__ */ React.createElement("div", { className: "w-full grid grid-cols-1 lg:grid-cols-[1fr_460px] gap-12 lg:gap-20 items-end lg:items-center" }, /* @__PURE__ */ React.createElement("section", { className: "hidden lg:flex flex-col justify-end min-h-[620px] pb-8 max-w-xl" }, /* @__PURE__ */ React.createElement("span", { className: "text-amber-300 text-sm font-bold uppercase tracking-[0.2em]" }, "Hotel Management System"), /* @__PURE__ */ React.createElement("h1", { className: "font-serif text-5xl xl:text-6xl leading-[1.05] mt-4 mb-5" }, "Manage Your Hotel ", /* @__PURE__ */ React.createElement("span", { className: "block text-amber-300" }, "Smarter")), /* @__PURE__ */ React.createElement("p", { className: "text-slate-200 text-base leading-relaxed max-w-lg" }, "Streamline bookings, manage guests, rooms, pricing and revenue from one secure dashboard."), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-3 gap-5 mt-8 pt-7 border-t border-white/20 text-xs text-slate-200" }, /* @__PURE__ */ React.createElement("span", null, "\u25A3 Easy Booking Management"), /* @__PURE__ */ React.createElement("span", null, "\u2659 Guest Management"), /* @__PURE__ */ React.createElement("span", null, "\u25A5 Room & Revenue Tracking"))), /* @__PURE__ */ React.createElement("section", { className: "w-full max-w-md mx-auto lg:mx-0 bg-[#0b223b]/95 border border-slate-400/30 shadow-2xl rounded-lg px-6 sm:px-10 py-9 sm:py-11 backdrop-blur-md" }, /* @__PURE__ */ React.createElement("div", { className: "text-center mb-8" }, /* @__PURE__ */ React.createElement("div", { className: "w-16 h-16 mx-auto rounded-lg bg-amber-300 text-forest-950 flex items-center justify-center font-serif text-4xl font-bold mb-4" }, "C"), /* @__PURE__ */ React.createElement("p", { className: "font-serif text-2xl tracking-[0.15em]" }, "CHECK IN HOMES"), /* @__PURE__ */ React.createElement("p", { className: "text-[10px] uppercase tracking-[0.35em] text-amber-300 mt-1" }, "Hotel Management System"), /* @__PURE__ */ React.createElement("h2", { className: "text-2xl font-bold mt-8" }, "Welcome Back!"), /* @__PURE__ */ React.createElement("p", { className: "text-sm text-slate-300 mt-2" }, "Sign in to your account to continue")), /* @__PURE__ */ React.createElement("form", { onSubmit: handleAdminLogin, className: "space-y-4" }, /* @__PURE__ */ React.createElement("label", { className: "block" }, /* @__PURE__ */ React.createElement("span", { className: "sr-only" }, "Admin email"), /* @__PURE__ */ React.createElement("input", { type: "email", value: adminLoginForm.email, onChange: (event) => setAdminLoginForm({ ...adminLoginForm, email: event.target.value }), placeholder: "Username or Email", autoComplete: "username", className: "w-full px-4 py-3.5 rounded-lg bg-white/5 border border-slate-400/60 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-300", required: true })), /* @__PURE__ */ React.createElement("label", { className: "block relative" }, /* @__PURE__ */ React.createElement("span", { className: "sr-only" }, "Admin password"), /* @__PURE__ */ React.createElement("input", { type: showAdminPassword ? "text" : "password", value: adminLoginForm.password, onChange: (event) => setAdminLoginForm({ ...adminLoginForm, password: event.target.value }), placeholder: "Password", autoComplete: "current-password", className: "w-full px-4 py-3.5 pr-14 rounded-lg bg-white/5 border border-slate-400/60 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-300", required: true }), /* @__PURE__ */ React.createElement("button", { type: "button", onClick: () => setShowAdminPassword((visible) => !visible), className: "absolute right-4 top-3.5 text-sm text-slate-300 hover:text-white", "aria-label": showAdminPassword ? "Hide password" : "Show password" }, showAdminPassword ? "Hide" : "Show")), /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between text-xs text-slate-300" }, /* @__PURE__ */ React.createElement("label", { className: "flex items-center gap-2 cursor-pointer" }, /* @__PURE__ */ React.createElement("input", { type: "checkbox", checked: adminLoginForm.remember, onChange: (event) => setAdminLoginForm({ ...adminLoginForm, remember: event.target.checked }), className: "w-4 h-4 accent-amber-400" }), " Remember me"), /* @__PURE__ */ React.createElement("button", { type: "button", onClick: () => setAdminLoginError("Contact the website administrator to reset your password."), className: "text-amber-300 hover:underline" }, "Forgot password?")), adminLoginError && /* @__PURE__ */ React.createElement("div", { role: "alert", className: "bg-red-500/15 border border-red-400/40 text-red-200 rounded-lg px-4 py-3 text-xs" }, adminLoginError), /* @__PURE__ */ React.createElement("button", { type: "submit", className: "w-full bg-amber-300 hover:bg-amber-400 text-forest-950 font-extrabold py-3.5 rounded-lg shadow-lg transition" }, "Login")), /* @__PURE__ */ React.createElement("div", { className: "mt-8 pt-6 border-t border-slate-400/30 text-center text-xs text-slate-400" }, "Need help? Contact your administrator"), !API_ENABLED && /* @__PURE__ */ React.createElement("p", { className: "mt-3 text-center text-[10px] text-slate-500" }, "Local demo: admin@checkinnhomes.com / LocalDemo@2026")))));
  }
  return /* @__PURE__ */ React.createElement("div", { className: "min-h-screen bg-[#f5f7fb] text-slate-800" }, /* @__PURE__ */ React.createElement("div", { className: "flex min-h-screen" }, /* @__PURE__ */ React.createElement("aside", { className: "hidden lg:flex w-64 shrink-0 bg-white border-r border-slate-200 px-5 py-7 flex-col sticky top-0 h-screen overflow-y-auto" }, /* @__PURE__ */ React.createElement("button", { onClick: () => navigateToPage("home"), className: "flex items-center gap-3 px-2 mb-10 text-left" }, /* @__PURE__ */ React.createElement("span", { className: "w-11 h-11 bg-forest-900 text-amber-300 flex items-center justify-center font-serif text-2xl font-bold rounded-lg overflow-hidden" }, hotelConfig.logoUrl ? /* @__PURE__ */ React.createElement("img", { src: hotelConfig.logoUrl, alt: `${hotelConfig.name || "Checkinn Homes"} logo`, className: "w-full h-full object-contain bg-white p-1" }) : "C"), /* @__PURE__ */ React.createElement("span", null, /* @__PURE__ */ React.createElement("strong", { className: "block text-lg text-forest-950" }, "Check In Homes"), /* @__PURE__ */ React.createElement("small", { className: "text-slate-400" }, "Admin Portal"))), /* @__PURE__ */ React.createElement("nav", { className: "space-y-2", "aria-label": "Admin navigation" }, adminNavItems.map((item) => /* @__PURE__ */ React.createElement(
    "button",
    {
      key: item.id,
      onClick: () => {
        setAdminTab(item.id);
        if (item.id === "seo") openSeoPage(selectedSeoPage);
      },
      className: `w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition ${adminTab === item.id ? "bg-forest-900 text-white shadow-md" : "text-slate-500 hover:bg-emerald-50 hover:text-forest-900"}`
    },
    /* @__PURE__ */ React.createElement("span", { className: `w-6 text-center text-lg ${adminTab === item.id ? "text-amber-300" : "text-emerald-600"}` }, item.icon),
    /* @__PURE__ */ React.createElement("span", null, item.label),
    item.count !== void 0 && /* @__PURE__ */ React.createElement("span", { className: `ml-auto text-[10px] px-2 py-0.5 rounded-full ${adminTab === item.id ? "bg-white/15" : "bg-slate-100 text-slate-500"}` }, item.count)
  ))), /* @__PURE__ */ React.createElement("div", { className: "mt-auto border-t border-slate-100 pt-5" }, /* @__PURE__ */ React.createElement("button", { onClick: () => navigateToPage("home"), className: "w-full px-4 py-3 text-left text-sm font-semibold text-slate-500 hover:text-forest-900" }, "\u2190 View Website"), /* @__PURE__ */ React.createElement("button", { onClick: handleAdminLogout, className: "w-full px-4 py-3 text-left text-sm font-semibold text-red-500 hover:bg-red-50 rounded-lg" }, "\u21E5 Logout"), /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-3 px-4 pt-4" }, /* @__PURE__ */ React.createElement("span", { className: "w-9 h-9 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold" }, "A"), /* @__PURE__ */ React.createElement("span", null, /* @__PURE__ */ React.createElement("strong", { className: "block text-sm" }, "Property Admin"), /* @__PURE__ */ React.createElement("small", { className: "text-slate-400" }, "Administrator"))))), /* @__PURE__ */ React.createElement("div", { className: "min-w-0 flex-1" }, /* @__PURE__ */ React.createElement("header", { className: "sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-4" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between gap-4" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { className: "text-xs font-bold uppercase tracking-widest text-emerald-700" }, "Check In Homes"), /* @__PURE__ */ React.createElement("h1", { className: "text-xl sm:text-2xl font-extrabold text-forest-950" }, adminNavItems.find((item) => item.id === adminTab)?.label)), /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-3 sm:gap-5" }, /* @__PURE__ */ React.createElement("div", { className: "relative hidden sm:block" }, /* @__PURE__ */ React.createElement("span", { className: "absolute left-3 top-2.5 text-slate-400" }, "\u2315"), /* @__PURE__ */ React.createElement("input", { value: bookingSearch, onChange: (event) => setBookingSearch(event.target.value), onFocus: () => setAdminTab("bookings"), placeholder: "Search bookings...", className: "w-64 bg-slate-50 border border-slate-200 rounded-lg py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600" })), /* @__PURE__ */ React.createElement("span", { className: "hidden sm:inline text-xs text-slate-500" }, (/* @__PURE__ */ new Date()).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })), /* @__PURE__ */ React.createElement("div", { className: "relative" }, /* @__PURE__ */ React.createElement("button", { onClick: () => setAccountMenuOpen(!accountMenuOpen), className: "w-10 h-10 rounded-full bg-forest-900 text-amber-300 flex items-center justify-center font-bold overflow-hidden", "aria-label": "Open account menu" }, adminProfile.profile_photo ? /* @__PURE__ */ React.createElement("img", { src: adminProfile.profile_photo, alt: "Admin profile", className: "w-full h-full object-cover" }) : (adminProfile.display_name || "A").charAt(0).toUpperCase()), accountMenuOpen && /* @__PURE__ */ React.createElement("div", { className: "absolute right-0 top-12 z-50 w-44 bg-white border border-slate-200 rounded-lg shadow-lg p-1.5" }, /* @__PURE__ */ React.createElement("button", { onClick: openProfileEditor, className: "w-full text-left px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 rounded" }, "Edit Profile"), /* @__PURE__ */ React.createElement("button", { onClick: handleAdminLogout, className: "w-full text-left px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded" }, "Logout"))))), /* @__PURE__ */ React.createElement("nav", { className: "lg:hidden flex gap-2 overflow-x-auto hide-scrollbar mt-4 pb-1", "aria-label": "Mobile admin navigation" }, adminNavItems.map((item) => /* @__PURE__ */ React.createElement("button", { key: item.id, onClick: () => setAdminTab(item.id), className: `shrink-0 px-3 py-2 rounded-lg text-xs font-bold ${adminTab === item.id ? "bg-forest-900 text-white" : "bg-slate-100 text-slate-600"}` }, item.icon, " ", item.label, item.count !== void 0 ? ` (${item.count})` : "")))), /* @__PURE__ */ React.createElement("main", { className: "max-w-[1600px] mx-auto p-4 sm:p-6 lg:p-8" }, adminTab === "dashboard" && /* @__PURE__ */ React.createElement("div", { className: "space-y-6" }, /* @__PURE__ */ React.createElement("div", { className: "flex flex-col sm:flex-row sm:items-end justify-between gap-4" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h2", { className: "text-2xl font-extrabold text-forest-950" }, "Welcome back, Admin"), /* @__PURE__ */ React.createElement("p", { className: "text-sm text-slate-500 mt-1" }, "Here is what is happening at Check In Homes today.")), /* @__PURE__ */ React.createElement("button", { onClick: exportBookings, className: "self-start bg-white border border-slate-200 px-4 py-2 rounded-lg text-sm font-bold text-slate-600 hover:border-emerald-600 hover:text-emerald-700" }, "\u21E9 Export Report")), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4" }, /* @__PURE__ */ React.createElement("div", { className: "bg-rose-50 p-5 rounded-lg border border-rose-100" }, /* @__PURE__ */ React.createElement("span", { className: "w-10 h-10 rounded-full bg-rose-500 text-white flex items-center justify-center text-lg mb-4" }, "\u25A4"), /* @__PURE__ */ React.createElement("h3", { className: "text-2xl font-extrabold text-forest-950" }, bookings.length), /* @__PURE__ */ React.createElement("span", { className: "text-sm font-bold text-slate-700" }, "Total Bookings"), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-rose-500 font-medium mt-2" }, "All website reservations")), /* @__PURE__ */ React.createElement("div", { className: "bg-amber-50 p-5 rounded-lg border border-amber-100" }, /* @__PURE__ */ React.createElement("span", { className: "w-10 h-10 rounded-full bg-amber-500 text-white flex items-center justify-center text-lg mb-4" }, "\u20B9"), /* @__PURE__ */ React.createElement("h3", { className: "text-2xl font-extrabold text-forest-950" }, "\u20B9", totalRevenue.toLocaleString("en-IN")), /* @__PURE__ */ React.createElement("span", { className: "text-sm font-bold text-slate-700" }, "Booking Revenue"), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-amber-600 font-medium mt-2" }, "Direct booking value")), /* @__PURE__ */ React.createElement("div", { className: "bg-emerald-50 p-5 rounded-lg border border-emerald-100" }, /* @__PURE__ */ React.createElement("span", { className: "w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center text-lg mb-4" }, "\u2713"), /* @__PURE__ */ React.createElement("h3", { className: "text-2xl font-extrabold text-forest-950" }, confirmedBookings), /* @__PURE__ */ React.createElement("span", { className: "text-sm font-bold text-slate-700" }, "Confirmed Stays"), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-emerald-600 font-medium mt-2" }, checkedInBookings, " currently checked in")), /* @__PURE__ */ React.createElement("div", { className: "bg-violet-50 p-5 rounded-lg border border-violet-100" }, /* @__PURE__ */ React.createElement("span", { className: "w-10 h-10 rounded-full bg-violet-500 text-white flex items-center justify-center text-lg mb-4" }, "\u25C9"), /* @__PURE__ */ React.createElement("h3", { className: "text-2xl font-extrabold text-forest-950" }, occupancyRate, "%"), /* @__PURE__ */ React.createElement("span", { className: "text-sm font-bold text-slate-700" }, "Occupancy Signal"), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-violet-600 font-medium mt-2" }, newQueries, " unanswered guest queries"))), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 xl:grid-cols-3 gap-6" }, /* @__PURE__ */ React.createElement("section", { className: "xl:col-span-2 bg-white rounded-xl border border-slate-200 p-6 shadow-sm" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between mb-7" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h3", { className: "text-lg font-extrabold text-forest-950" }, "Booking Overview"), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-slate-400" }, "Reservations by room type")), /* @__PURE__ */ React.createElement("span", { className: "text-xs bg-emerald-50 text-emerald-700 font-bold px-3 py-1 rounded-full" }, "Live data")), /* @__PURE__ */ React.createElement("div", { className: "h-56 flex items-end justify-around gap-4 border-b border-slate-200 px-2" }, roomPerformance.map((room, index) => /* @__PURE__ */ React.createElement("div", { key: room.name, className: "h-full flex-1 flex flex-col justify-end items-center gap-2 min-w-0" }, /* @__PURE__ */ React.createElement("span", { className: "text-xs font-bold text-slate-600" }, room.bookings), /* @__PURE__ */ React.createElement("div", { className: `w-full max-w-16 rounded-t-md ${["bg-emerald-500", "bg-amber-400", "bg-sky-500", "bg-violet-500"][index % 4]}`, style: { height: `${Math.max(10, room.bookings / maxRoomBookings * 78)}%` } }), /* @__PURE__ */ React.createElement("span", { className: "text-[10px] text-slate-500 text-center h-8 leading-tight" }, room.name))))), /* @__PURE__ */ React.createElement("section", { className: "bg-white rounded-xl border border-slate-200 p-6 shadow-sm" }, /* @__PURE__ */ React.createElement("h3", { className: "text-lg font-extrabold text-forest-950" }, "Operations"), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-slate-400 mb-6" }, "Items needing attention"), /* @__PURE__ */ React.createElement("div", { className: "space-y-4" }, /* @__PURE__ */ React.createElement("button", { onClick: () => setAdminTab("bookings"), className: "w-full flex items-center justify-between p-4 bg-rose-50 text-left rounded-lg" }, /* @__PURE__ */ React.createElement("span", null, /* @__PURE__ */ React.createElement("strong", { className: "block text-sm text-slate-800" }, "Manage bookings"), /* @__PURE__ */ React.createElement("small", { className: "text-slate-500" }, "Update guest status")), /* @__PURE__ */ React.createElement("b", { className: "text-rose-600" }, bookings.length)), /* @__PURE__ */ React.createElement("button", { onClick: () => setAdminTab("queries"), className: "w-full flex items-center justify-between p-4 bg-amber-50 text-left rounded-lg" }, /* @__PURE__ */ React.createElement("span", null, /* @__PURE__ */ React.createElement("strong", { className: "block text-sm text-slate-800" }, "Guest queries"), /* @__PURE__ */ React.createElement("small", { className: "text-slate-500" }, "Awaiting response")), /* @__PURE__ */ React.createElement("b", { className: "text-amber-600" }, newQueries)), /* @__PURE__ */ React.createElement("button", { onClick: () => setAdminTab("rooms"), className: "w-full flex items-center justify-between p-4 bg-emerald-50 text-left rounded-lg" }, /* @__PURE__ */ React.createElement("span", null, /* @__PURE__ */ React.createElement("strong", { className: "block text-sm text-slate-800" }, "Room inventory"), /* @__PURE__ */ React.createElement("small", { className: "text-slate-500" }, "Rates and availability")), /* @__PURE__ */ React.createElement("b", { className: "text-emerald-600" }, rooms.length))))), /* @__PURE__ */ React.createElement("div", { className: "bg-white rounded-xl p-6 border border-slate-200 shadow-sm" }, /* @__PURE__ */ React.createElement("div", { className: "flex justify-between items-center mb-6" }, /* @__PURE__ */ React.createElement("h3", { className: "font-serif text-xl font-bold text-forest-950" }, "Recent Direct Reservations"), /* @__PURE__ */ React.createElement("button", { onClick: () => setAdminTab("bookings"), className: "text-xs font-bold text-amber-600 hover:underline" }, "View All \u2192")), /* @__PURE__ */ React.createElement("div", { className: "overflow-x-auto" }, /* @__PURE__ */ React.createElement("table", { className: "w-full text-left text-xs sm:text-sm" }, /* @__PURE__ */ React.createElement("thead", null, /* @__PURE__ */ React.createElement("tr", { className: "border-b border-stone-200 text-stone-400 uppercase text-[11px] font-bold" }, /* @__PURE__ */ React.createElement("th", { className: "pb-3" }, "Booking ID"), /* @__PURE__ */ React.createElement("th", { className: "pb-3" }, "Guest Name"), /* @__PURE__ */ React.createElement("th", { className: "pb-3" }, "Room"), /* @__PURE__ */ React.createElement("th", { className: "pb-3" }, "Dates"), /* @__PURE__ */ React.createElement("th", { className: "pb-3" }, "Amount"), /* @__PURE__ */ React.createElement("th", { className: "pb-3" }, "Status"))), /* @__PURE__ */ React.createElement("tbody", { className: "divide-y divide-stone-100 font-medium" }, bookings.slice(0, 5).map((b) => /* @__PURE__ */ React.createElement("tr", { key: b.id, className: "hover:bg-stone-50" }, /* @__PURE__ */ React.createElement("td", { className: "py-3 font-mono font-bold text-forest-900" }, b.id), /* @__PURE__ */ React.createElement("td", { className: "py-3 text-stone-800" }, b.guestName), /* @__PURE__ */ React.createElement("td", { className: "py-3 text-stone-600" }, b.roomName), /* @__PURE__ */ React.createElement("td", { className: "py-3 text-stone-600" }, b.checkIn, " to ", b.checkOut), /* @__PURE__ */ React.createElement("td", { className: "py-3 font-bold text-forest-950" }, "\u20B9", b.totalAmount), /* @__PURE__ */ React.createElement("td", { className: "py-3" }, /* @__PURE__ */ React.createElement("span", { className: `px-2.5 py-1 rounded-full text-xs font-bold ${b.status === "Confirmed" ? "bg-emerald-100 text-emerald-800" : b.status === "Checked-In" ? "bg-blue-100 text-blue-800" : "bg-stone-200 text-stone-700"}` }, b.status))))))))), adminTab === "bookings" && /* @__PURE__ */ React.createElement("div", { className: "bg-white rounded-xl p-5 sm:p-7 border border-slate-200 shadow-sm" }, /* @__PURE__ */ React.createElement("div", { className: "flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h3", { className: "text-xl font-extrabold text-forest-950" }, "Guest Reservations"), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-slate-500" }, "Every website booking appears here automatically")), /* @__PURE__ */ React.createElement("button", { onClick: exportBookings, className: "px-4 py-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:text-emerald-700 hover:border-emerald-500" }, "\u21E9 Export CSV")), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-[1fr_auto] gap-3 mb-6 p-4 bg-slate-50 border border-slate-100 rounded-lg" }, /* @__PURE__ */ React.createElement("div", { className: "relative" }, /* @__PURE__ */ React.createElement("span", { className: "absolute left-3 top-2.5 text-slate-400" }, "\u2315"), /* @__PURE__ */ React.createElement("input", { value: bookingSearch, onChange: (event) => setBookingSearch(event.target.value), placeholder: "Search guest, booking ID, phone or room", className: "w-full bg-white border border-slate-200 rounded-lg py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600" })), /* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap gap-2" }, ["All", "Confirmed", "Checked-In", "Completed", "Cancelled"].map((status) => /* @__PURE__ */ React.createElement("button", { key: status, onClick: () => setBookingFilter(status), className: `px-3 py-2 rounded-lg text-xs font-bold ${bookingFilter === status ? "bg-forest-900 text-white" : "bg-white border border-slate-200 text-slate-600"}` }, status)))), /* @__PURE__ */ React.createElement("p", { className: "text-xs font-semibold text-slate-500 mb-4" }, "Showing ", filteredBookings.length, " of ", bookings.length, " bookings"), /* @__PURE__ */ React.createElement("div", { className: "space-y-4" }, filteredBookings.length === 0 && /* @__PURE__ */ React.createElement("div", { className: "py-14 text-center text-sm text-slate-400" }, "No bookings match this search or status."), filteredBookings.map((book) => /* @__PURE__ */ React.createElement("div", { key: book.id, className: "p-5 rounded-lg bg-white border border-slate-200 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 hover:border-emerald-500 hover:shadow-sm transition" }, /* @__PURE__ */ React.createElement("div", { className: "space-y-1" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-3" }, /* @__PURE__ */ React.createElement("span", { className: "font-mono font-bold text-sm bg-forest-900 text-amber-300 px-2.5 py-0.5 rounded" }, book.id), /* @__PURE__ */ React.createElement("h4", { className: "font-bold text-base text-forest-950" }, book.guestName), /* @__PURE__ */ React.createElement("span", { className: "text-xs text-stone-500" }, "(", book.guests, " Guests)")), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-stone-600" }, "\u{1F4DE} ", book.phone, " | \u2709\uFE0F ", book.email), /* @__PURE__ */ React.createElement("p", { className: "text-xs font-semibold text-forest-800" }, "\u{1F3E0} ", book.roomName, " \u2022 \u{1F4C5} ", book.checkIn, " to ", book.checkOut), book.notes && /* @__PURE__ */ React.createElement("p", { className: "text-xs text-amber-700 italic" }, 'Special Note: "', book.notes, '"')), /* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap items-center gap-3" }, /* @__PURE__ */ React.createElement("div", { className: "text-right pr-2" }, /* @__PURE__ */ React.createElement("div", { className: "text-lg font-black text-forest-950" }, "\u20B9", book.totalAmount), /* @__PURE__ */ React.createElement("span", { className: "text-[11px] text-stone-400" }, book.paymentMode || "Direct")), /* @__PURE__ */ React.createElement(
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
      href: `https://wa.me/${book.phone?.replace(/[^0-9]/g, "")}?text=Hello%20${encodeURIComponent(book.guestName)},%20confirming%20your%20stay%20at%20Checkinn%20Homes%20Tapovan%20Rishikesh%20(ID:%20${book.id})`,
      target: "_blank",
      rel: "noreferrer",
      className: "px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-1"
    },
    /* @__PURE__ */ React.createElement("span", null, "\u{1F4AC}"),
    " WhatsApp Guest"
  ), /* @__PURE__ */ React.createElement("button", { onClick: () => setEditingBooking({ ...book }), className: "px-3 py-2 border border-emerald-200 text-emerald-700 hover:bg-emerald-50 text-xs font-bold rounded-xl" }, "Edit"), /* @__PURE__ */ React.createElement("button", { onClick: () => deleteBooking(book.id), className: "w-9 h-9 border border-red-200 text-red-500 hover:bg-red-50 rounded-lg", title: "Delete booking", "aria-label": `Delete booking ${book.id}` }, "\xD7")))))), adminTab === "rooms" && /* @__PURE__ */ React.createElement("div", { className: "bg-white rounded-xl p-5 sm:p-8 border border-slate-200 shadow-sm" }, /* @__PURE__ */ React.createElement("div", { className: "flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-7" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h3", { className: "text-xl font-extrabold text-forest-950" }, "Room Configuration & Pricing"), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-slate-500 mt-1" }, "Add, edit or remove rooms shown on the public website")), /* @__PURE__ */ React.createElement("button", { onClick: openAddRoom, className: "self-start bg-forest-900 hover:bg-forest-800 text-white font-bold px-5 py-3 rounded-lg text-sm shadow-sm" }, "+ Add Room")), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6" }, rooms.map((room) => /* @__PURE__ */ React.createElement("div", { key: room.id, className: "border border-slate-200 rounded-lg p-5 bg-white flex flex-col justify-between hover:border-emerald-500 hover:shadow-sm transition" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "flex gap-4 items-start mb-3" }, /* @__PURE__ */ React.createElement("img", { src: room.image, alt: room.name, className: "w-20 h-20 rounded-xl object-cover" }), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h4", { className: "font-serif font-bold text-lg text-forest-950" }, room.name), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-amber-700 font-semibold" }, room.type), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-stone-500 mt-1" }, "Current Price: ", /* @__PURE__ */ React.createElement("span", { className: "font-bold text-forest-950 text-sm" }, "\u20B9", room.price, "/night")))), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-stone-600 line-clamp-2 mb-3" }, room.description), /* @__PURE__ */ React.createElement("div", { className: "text-[11px] text-stone-500 font-medium" }, "Capacity: ", room.capacity, " | Bed: ", room.bed), /* @__PURE__ */ React.createElement("p", { className: "text-[11px] text-sky-700 font-semibold mt-1" }, "\u25A7 ", (room.gallery || [room.image]).length, " room photo", (room.gallery || [room.image]).length === 1 ? "" : "s"), /* @__PURE__ */ React.createElement("div", { className: "mt-4" }, /* @__PURE__ */ React.createElement("span", { className: "text-[10px] font-bold uppercase tracking-wide text-slate-400" }, "Amenities"), /* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap gap-1.5 mt-1.5" }, room.amenities.map((amenity) => /* @__PURE__ */ React.createElement("span", { key: amenity, className: "text-[10px] bg-slate-100 text-slate-600 px-2 py-1 rounded" }, amenity)))), /* @__PURE__ */ React.createElement("div", { className: "mt-4" }, /* @__PURE__ */ React.createElement("span", { className: "text-[10px] font-bold uppercase tracking-wide text-slate-400" }, "Pricing Plans"), /* @__PURE__ */ React.createElement("div", { className: "space-y-1 mt-1.5" }, (room.mealPlans || [`Room Only (EP): \u20B9${room.price.toLocaleString("en-IN")}`]).map((plan) => /* @__PURE__ */ React.createElement("p", { key: plan, className: "text-[11px] font-semibold text-amber-700" }, plan))))), /* @__PURE__ */ React.createElement("div", { className: "pt-4 mt-3 border-t border-slate-100 flex justify-end gap-2" }, /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => deleteRoom(room),
      className: "px-4 py-2 border border-red-200 hover:bg-red-50 text-red-600 text-xs font-bold rounded-lg transition"
    },
    "Delete"
  ), /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => {
        const getPlanPrice = (prefix) => {
          const plan = room.mealPlans?.find((item) => item.startsWith(prefix));
          return plan ? plan.split("\u20B9")[1]?.replace(/,/g, "") || "" : "";
        };
        setEditingRoom({
          ...JSON.parse(JSON.stringify(room)),
          amenitiesText: room.amenities.join(", "),
          newGalleryUrl: "",
          breakfastPrice: getPlanPrice("With Breakfast"),
          mealsPrice: getPlanPrice("With Meals")
        });
      },
      className: "px-4 py-2 bg-forest-900 hover:bg-forest-800 text-white text-xs font-bold rounded-lg shadow-sm transition"
    },
    "Edit Room"
  )))))), adminTab === "roomTypes" && /* @__PURE__ */ React.createElement("div", { className: "bg-white rounded-xl p-5 sm:p-8 border border-slate-200 shadow-sm" }, /* @__PURE__ */ React.createElement("div", { className: "mb-7" }, /* @__PURE__ */ React.createElement("h3", { className: "text-xl font-extrabold text-forest-950" }, "Room Types"), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-slate-500 mt-1" }, "Manage the room categories available in the Add/Edit Room dropdown.")), /* @__PURE__ */ React.createElement("form", { onSubmit: saveRoomType, className: "flex flex-col sm:flex-row gap-3 p-4 bg-slate-50 border border-slate-100 rounded-lg mb-7" }, /* @__PURE__ */ React.createElement("label", { className: "flex-1" }, /* @__PURE__ */ React.createElement("span", { className: "sr-only" }, "Room type name"), /* @__PURE__ */ React.createElement("input", { value: roomTypeDraft, onChange: (event) => setRoomTypeDraft(event.target.value), placeholder: "e.g. Family Suite", className: "w-full px-4 py-3 border border-slate-200 bg-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600", required: true })), /* @__PURE__ */ React.createElement("button", { type: "submit", className: "bg-forest-900 hover:bg-forest-800 text-white px-5 py-3 rounded-lg text-sm font-bold" }, editingRoomType ? "Save Type" : "+ Add Room Type"), editingRoomType && /* @__PURE__ */ React.createElement("button", { type: "button", onClick: () => {
    setEditingRoomType(null);
    setRoomTypeDraft("");
  }, className: "border border-slate-200 bg-white text-slate-600 px-4 py-3 rounded-lg text-sm font-bold" }, "Cancel")), /* @__PURE__ */ React.createElement("div", { className: "space-y-3" }, roomTypes.length === 0 && /* @__PURE__ */ React.createElement("div", { className: "py-12 text-center text-sm text-slate-400" }, "No room types available. Add your first room type above."), roomTypes.map((type) => {
    const assignedRooms = rooms.filter((room) => room.type === type).length;
    return /* @__PURE__ */ React.createElement("div", { key: type, className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border border-slate-200 rounded-lg hover:border-emerald-400" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-3" }, /* @__PURE__ */ React.createElement("span", { className: "w-10 h-10 bg-emerald-50 text-emerald-700 rounded-lg flex items-center justify-center text-xl" }, "\u25C7"), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h4", { className: "font-bold text-slate-800" }, type), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-slate-400" }, assignedRooms, " assigned room", assignedRooms === 1 ? "" : "s"))), /* @__PURE__ */ React.createElement("div", { className: "flex gap-2" }, /* @__PURE__ */ React.createElement("button", { type: "button", onClick: () => startEditingRoomType(type), className: "px-4 py-2 border border-slate-200 text-slate-600 hover:border-emerald-500 hover:text-emerald-700 rounded-lg text-xs font-bold" }, "Edit"), /* @__PURE__ */ React.createElement("button", { type: "button", onClick: () => deleteRoomType(type), className: "px-4 py-2 border border-red-200 text-red-600 hover:bg-red-50 rounded-lg text-xs font-bold" }, "Delete")));
  }))), adminTab === "queries" && /* @__PURE__ */ React.createElement("div", { className: "bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm" }, /* @__PURE__ */ React.createElement("div", { className: "flex justify-between items-center mb-6" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h3", { className: "font-serif text-2xl font-bold text-forest-950" }, "Inbound Guest Queries"), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-stone-500" }, "Queries submitted via website contact & inquiry forms"))), /* @__PURE__ */ React.createElement("div", { className: "space-y-4" }, queries.length === 0 ? /* @__PURE__ */ React.createElement("p", { className: "text-stone-500 text-sm text-center py-8" }, "No customer queries currently.") : queries.map((q) => /* @__PURE__ */ React.createElement("div", { key: q.id, className: "p-5 rounded-2xl bg-stone-50 border border-stone-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4" }, /* @__PURE__ */ React.createElement("div", { className: "space-y-1 max-w-2xl" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-3" }, /* @__PURE__ */ React.createElement("h4", { className: "font-bold text-sm text-forest-950" }, q.name), /* @__PURE__ */ React.createElement("span", { className: "text-xs text-stone-400" }, "(", q.date, ")"), /* @__PURE__ */ React.createElement("span", { className: `text-[10px] font-bold px-2 py-0.5 rounded-full ${q.status === "New" ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"}` }, q.status)), /* @__PURE__ */ React.createElement("p", { className: "text-xs font-semibold text-amber-700" }, q.subject), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-stone-700 leading-relaxed font-sans" }, q.message), /* @__PURE__ */ React.createElement("div", { className: "text-[11px] text-stone-500 pt-1" }, "Phone: ", q.phone, " | Email: ", q.email)), /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2" }, /* @__PURE__ */ React.createElement(
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
      href: `https://wa.me/${q.phone?.replace(/[^0-9]/g, "")}?text=Hi%20${encodeURIComponent(q.name)},%20replying%20to%20your%20query%20at%20Checkinn%20Homes%20Rishikesh`,
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
  )))))), adminTab === "feedback" && /* @__PURE__ */ React.createElement("div", { className: "bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm" }, /* @__PURE__ */ React.createElement("div", { className: "flex justify-between items-center mb-6" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h3", { className: "font-serif text-2xl font-bold text-forest-950" }, "Guest Testimonials Moderation"), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-stone-500" }, "Live reviews appearing on the homepage and review board"))), /* @__PURE__ */ React.createElement("div", { className: "space-y-4" }, reviews.map((rev) => /* @__PURE__ */ React.createElement("div", { key: rev.id, className: "p-4 rounded-2xl bg-stone-50 border border-stone-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2" }, /* @__PURE__ */ React.createElement("h4", { className: "font-bold text-sm text-forest-950" }, rev.name), /* @__PURE__ */ React.createElement("span", { className: "text-xs text-amber-500" }, "\u2605".repeat(rev.rating)), /* @__PURE__ */ React.createElement("span", { className: "text-xs text-stone-400" }, "(", rev.room, ")")), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-stone-600 italic mt-1 font-serif" }, '"', rev.comment, '"'), /* @__PURE__ */ React.createElement("span", { className: "text-[10px] text-stone-400" }, rev.city, " \u2022 ", rev.date)), /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2" }, /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => deleteReview(rev.id),
      className: "text-xs text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg font-bold transition"
    },
    "Delete"
  )))))), adminTab === "seo" && /* @__PURE__ */ React.createElement("div", { className: "bg-white rounded-xl p-5 sm:p-8 border border-slate-200 shadow-sm" }, /* @__PURE__ */ React.createElement("div", { className: "mb-7" }, /* @__PURE__ */ React.createElement("h3", { className: "text-xl font-extrabold text-forest-950" }, "Search Engine Optimization"), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-slate-500 mt-1" }, "These settings are server-rendered in the page source for search engines and social sharing.")), /* @__PURE__ */ React.createElement("div", { className: "flex gap-2 overflow-x-auto pb-2 border-b border-slate-100 mb-6" }, seoPages.map((page) => /* @__PURE__ */ React.createElement("button", { key: page.key, onClick: () => openSeoPage(page.key), className: `shrink-0 px-3 py-2 rounded-lg text-xs font-bold ${selectedSeoPage === page.key ? "bg-forest-900 text-white" : "bg-slate-100 text-slate-600"}` }, page.label))), /* @__PURE__ */ React.createElement("form", { onSubmit: saveSeoPage, className: "grid grid-cols-1 md:grid-cols-2 gap-5 max-w-5xl" }, /* @__PURE__ */ React.createElement("label", { className: "block md:col-span-2" }, /* @__PURE__ */ React.createElement("span", { className: "block text-xs font-bold uppercase tracking-wide text-slate-500 mb-2" }, "SEO Title"), /* @__PURE__ */ React.createElement("input", { maxLength: "160", value: seoDraft.title, onChange: (event) => setSeoDraft({ ...seoDraft, title: event.target.value }), className: "w-full px-4 py-3 rounded-lg border border-slate-200 bg-slate-50 text-sm", required: true }), /* @__PURE__ */ React.createElement("small", { className: "text-[11px] text-slate-400" }, seoDraft.title.length, "/60 recommended characters")), /* @__PURE__ */ React.createElement("label", { className: "block md:col-span-2" }, /* @__PURE__ */ React.createElement("span", { className: "block text-xs font-bold uppercase tracking-wide text-slate-500 mb-2" }, "Meta Description"), /* @__PURE__ */ React.createElement("textarea", { rows: "3", maxLength: "320", value: seoDraft.metaDescription, onChange: (event) => setSeoDraft({ ...seoDraft, metaDescription: event.target.value }), className: "w-full px-4 py-3 rounded-lg border border-slate-200 bg-slate-50 text-sm" }), /* @__PURE__ */ React.createElement("small", { className: "text-[11px] text-slate-400" }, seoDraft.metaDescription.length, "/160 recommended characters")), /* @__PURE__ */ React.createElement("label", { className: "block" }, /* @__PURE__ */ React.createElement("span", { className: "block text-xs font-bold uppercase tracking-wide text-slate-500 mb-2" }, "Focus Keyword"), /* @__PURE__ */ React.createElement("input", { value: seoDraft.focusKeyword, onChange: (event) => setSeoDraft({ ...seoDraft, focusKeyword: event.target.value }), placeholder: "e.g. hotel in Upper Tapovan", className: "w-full px-4 py-3 rounded-lg border border-slate-200 bg-slate-50 text-sm" })), /* @__PURE__ */ React.createElement("label", { className: "block" }, /* @__PURE__ */ React.createElement("span", { className: "block text-xs font-bold uppercase tracking-wide text-slate-500 mb-2" }, "Canonical Path"), /* @__PURE__ */ React.createElement("input", { value: seoDraft.canonicalPath, onChange: (event) => setSeoDraft({ ...seoDraft, canonicalPath: event.target.value }), placeholder: "/rooms", className: "w-full px-4 py-3 rounded-lg border border-slate-200 bg-slate-50 text-sm" })), /* @__PURE__ */ React.createElement("label", { className: "block" }, /* @__PURE__ */ React.createElement("span", { className: "block text-xs font-bold uppercase tracking-wide text-slate-500 mb-2" }, "Robots"), /* @__PURE__ */ React.createElement("select", { value: seoDraft.robots, onChange: (event) => setSeoDraft({ ...seoDraft, robots: event.target.value }), className: "w-full px-4 py-3 rounded-lg border border-slate-200 bg-slate-50 text-sm" }, /* @__PURE__ */ React.createElement("option", { value: "index,follow" }, "Index, Follow"), /* @__PURE__ */ React.createElement("option", { value: "noindex,nofollow" }, "Noindex, Nofollow"))), /* @__PURE__ */ React.createElement("label", { className: "block" }, /* @__PURE__ */ React.createElement("span", { className: "block text-xs font-bold uppercase tracking-wide text-slate-500 mb-2" }, "Open Graph Image URL"), /* @__PURE__ */ React.createElement("input", { type: "url", value: seoDraft.ogImage, onChange: (event) => setSeoDraft({ ...seoDraft, ogImage: event.target.value }), placeholder: "https://...", className: "w-full px-4 py-3 rounded-lg border border-slate-200 bg-slate-50 text-sm" })), /* @__PURE__ */ React.createElement("label", { className: "block md:col-span-2" }, /* @__PURE__ */ React.createElement("span", { className: "block text-xs font-bold uppercase tracking-wide text-slate-500 mb-2" }, "Primary H1"), /* @__PURE__ */ React.createElement("input", { value: seoDraft.h1, onChange: (event) => setSeoDraft({ ...seoDraft, h1: event.target.value }), className: "w-full px-4 py-3 rounded-lg border border-slate-200 bg-slate-50 text-sm" }), /* @__PURE__ */ React.createElement("small", { className: "text-[11px] text-slate-400" }, "Use one clear page topic. Keep it aligned with the visible page heading.")), /* @__PURE__ */ React.createElement("label", { className: "block md:col-span-2" }, /* @__PURE__ */ React.createElement("span", { className: "block text-xs font-bold uppercase tracking-wide text-slate-500 mb-2" }, "Content / Internal Linking Notes"), /* @__PURE__ */ React.createElement("textarea", { rows: "4", value: seoDraft.introText, onChange: (event) => setSeoDraft({ ...seoDraft, introText: event.target.value }), placeholder: "Outline search intent, key sections, FAQs, and meaningful links to other site pages.", className: "w-full px-4 py-3 rounded-lg border border-slate-200 bg-slate-50 text-sm" })), /* @__PURE__ */ React.createElement("label", { className: "block md:col-span-2" }, /* @__PURE__ */ React.createElement("span", { className: "block text-xs font-bold uppercase tracking-wide text-slate-500 mb-2" }, "JSON-LD Schema"), /* @__PURE__ */ React.createElement("textarea", { rows: "7", value: seoDraft.schemaJson, onChange: (event) => setSeoDraft({ ...seoDraft, schemaJson: event.target.value }), placeholder: '{"@context":"https://schema.org","@type":"LodgingBusiness","name":"Checkinn Homes"}', className: "w-full px-4 py-3 rounded-lg border border-slate-200 bg-slate-50 font-mono text-xs" }), /* @__PURE__ */ React.createElement("small", { className: "text-[11px] text-slate-400" }, "Only add valid JSON matching visible page content.")), /* @__PURE__ */ React.createElement("div", { className: "md:col-span-2 pt-2" }, /* @__PURE__ */ React.createElement("button", { type: "submit", className: "bg-forest-900 text-white px-6 py-3 rounded-lg text-sm font-bold" }, "Save SEO Settings")))), adminTab === "coupons" && /* @__PURE__ */ React.createElement("div", { className: "bg-white rounded-xl p-5 sm:p-8 border border-slate-200 shadow-sm" }, /* @__PURE__ */ React.createElement("div", { className: "mb-7" }, /* @__PURE__ */ React.createElement("h3", { className: "text-xl font-extrabold text-forest-950" }, "Booking Coupons"), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-slate-500 mt-1" }, "Shown only for eligible Pay Online bookings.")), /* @__PURE__ */ React.createElement("form", { onSubmit: addCoupon, className: "grid grid-cols-1 sm:grid-cols-4 gap-3 p-4 bg-slate-50 border border-slate-100 rounded-lg mb-6" }, /* @__PURE__ */ React.createElement("input", { value: couponDraft.code, onChange: (event) => setCouponDraft({ ...couponDraft, code: event.target.value.toUpperCase() }), placeholder: "Code e.g. STAY10", className: "px-3 py-2.5 border border-slate-200 rounded-lg text-sm", required: true }), /* @__PURE__ */ React.createElement("select", { value: couponDraft.discountType, onChange: (event) => setCouponDraft({ ...couponDraft, discountType: event.target.value }), className: "px-3 py-2.5 border border-slate-200 rounded-lg text-sm" }, /* @__PURE__ */ React.createElement("option", { value: "percentage" }, "Percentage"), /* @__PURE__ */ React.createElement("option", { value: "fixed" }, "Flat Amount")), /* @__PURE__ */ React.createElement("input", { type: "number", min: "1", max: couponDraft.discountType === "percentage" ? "100" : void 0, value: couponDraft.discountValue, onChange: (event) => setCouponDraft({ ...couponDraft, discountValue: Number(event.target.value) }), placeholder: couponDraft.discountType === "percentage" ? "Discount %" : "Discount Rs", className: "px-3 py-2.5 border border-slate-200 rounded-lg text-sm", required: true }), /* @__PURE__ */ React.createElement("input", { type: "number", min: "0", value: couponDraft.minimumAmount, onChange: (event) => setCouponDraft({ ...couponDraft, minimumAmount: Number(event.target.value) }), placeholder: "Minimum amount", className: "px-3 py-2.5 border border-slate-200 rounded-lg text-sm", required: true }), /* @__PURE__ */ React.createElement("div", { className: "flex gap-2" }, /* @__PURE__ */ React.createElement("button", { type: "submit", className: "bg-forest-900 text-white px-4 py-2.5 rounded-lg text-sm font-bold" }, editingCouponId !== null ? "Save Coupon" : "Add Coupon"), editingCouponId !== null && /* @__PURE__ */ React.createElement("button", { type: "button", onClick: () => {
    setEditingCouponId(null);
    setCouponDraft({ code: "", discountType: "percentage", discountValue: 10, minimumAmount: 0, active: true });
  }, className: "border border-slate-200 bg-white px-3 py-2.5 rounded-lg text-sm" }, "Cancel"))), /* @__PURE__ */ React.createElement("div", { className: "space-y-2" }, coupons.length === 0 ? /* @__PURE__ */ React.createElement("p", { className: "text-sm text-slate-400 py-5" }, "No coupons added yet.") : coupons.map((coupon) => /* @__PURE__ */ React.createElement("div", { key: coupon.id, className: "flex items-center justify-between gap-3 p-4 border border-slate-200 rounded-lg" }, /* @__PURE__ */ React.createElement("span", { className: "font-bold text-forest-950" }, coupon.code), /* @__PURE__ */ React.createElement("span", { className: "text-xs text-slate-500" }, coupon.discountType === "fixed" ? `Rs ${coupon.discountValue} off` : `${coupon.discountValue}% off`, " on Rs ", Number(coupon.minimumAmount).toLocaleString("en-IN"), "+"), /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-3" }, /* @__PURE__ */ React.createElement("button", { onClick: () => toggleCouponActive(coupon), className: `text-xs font-bold ${coupon.active ? "text-amber-700" : "text-emerald-700"}` }, coupon.active ? "Deactivate" : "Activate"), /* @__PURE__ */ React.createElement("button", { onClick: () => startEditingCoupon(coupon), className: "text-xs font-bold text-emerald-700" }, "Edit"), /* @__PURE__ */ React.createElement("button", { onClick: () => deleteCoupon(coupon.id), className: "text-xs font-bold text-red-600" }, "Delete")))))), adminTab === "settings" && /* @__PURE__ */ React.createElement("div", { className: "bg-white rounded-xl p-5 sm:p-8 border border-slate-200 shadow-sm" }, /* @__PURE__ */ React.createElement("div", { className: "mb-8" }, /* @__PURE__ */ React.createElement("h3", { className: "text-xl font-extrabold text-forest-950" }, "Property Settings"), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-slate-500 mt-1" }, "These details are used across the public website and booking experience.")), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-5 max-w-5xl" }, /* @__PURE__ */ React.createElement("label", { className: "block md:col-span-2" }, /* @__PURE__ */ React.createElement("span", { className: "block text-xs font-bold uppercase tracking-wide text-slate-500 mb-2" }, "Property Logo URL"), /* @__PURE__ */ React.createElement("div", { className: "flex flex-col sm:flex-row gap-3" }, /* @__PURE__ */ React.createElement("input", { type: "url", value: hotelConfig.logoUrl || "", onChange: (event) => setHotelConfig({ ...hotelConfig, logoUrl: event.target.value }), placeholder: "https://example.com/logo.png", className: "flex-1 px-4 py-3 rounded-lg border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600" }), /* @__PURE__ */ React.createElement("label", { className: "cursor-pointer bg-forest-900 text-white px-4 py-3 rounded-lg text-sm font-bold text-center" }, /* @__PURE__ */ React.createElement("input", { type: "file", accept: "image/jpeg,image/png,image/webp", onChange: uploadPropertyLogo, className: "sr-only" }), "Upload Logo")), hotelConfig.logoUrl && /* @__PURE__ */ React.createElement("div", { className: "mt-3 flex items-center gap-3" }, /* @__PURE__ */ React.createElement("img", { src: hotelConfig.logoUrl, alt: "Current property logo", className: "h-16 max-w-48 object-contain object-left border border-slate-200 rounded-lg p-2" }), /* @__PURE__ */ React.createElement("button", { type: "button", onClick: () => setHotelConfig({ ...hotelConfig, logoUrl: "" }), className: "text-xs font-bold text-red-600 border border-red-200 rounded-lg px-3 py-2 hover:bg-red-50" }, "Remove Logo"))), [
    { key: "name", label: "Property Name", type: "text" },
    { key: "tagline", label: "Tagline", type: "text" },
    { key: "phone", label: "Phone Number", type: "tel" },
    { key: "whatsapp", label: "WhatsApp Number", type: "tel" },
    { key: "email", label: "Official Email", type: "email" },
    { key: "wifiSpeed", label: "Wi-Fi Speed", type: "text" },
    { key: "checkInTime", label: "Check-In Time", type: "text" },
    { key: "checkOutTime", label: "Check-Out Time", type: "text" }
  ].map((field) => /* @__PURE__ */ React.createElement("label", { key: field.key, className: "block" }, /* @__PURE__ */ React.createElement("span", { className: "block text-xs font-bold uppercase tracking-wide text-slate-500 mb-2" }, field.label), /* @__PURE__ */ React.createElement("input", { type: field.type, value: hotelConfig[field.key] || "", onChange: (event) => setHotelConfig({ ...hotelConfig, [field.key]: event.target.value }), className: "w-full px-4 py-3 rounded-lg border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600" }))), /* @__PURE__ */ React.createElement("label", { className: "block md:col-span-2" }, /* @__PURE__ */ React.createElement("span", { className: "block text-xs font-bold uppercase tracking-wide text-slate-500 mb-2" }, "Property Address"), /* @__PURE__ */ React.createElement("textarea", { rows: "3", value: hotelConfig.location || "", onChange: (event) => setHotelConfig({ ...hotelConfig, location: event.target.value }), className: "w-full px-4 py-3 rounded-lg border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600" })), /* @__PURE__ */ React.createElement("label", { className: "block md:col-span-2" }, /* @__PURE__ */ React.createElement("span", { className: "block text-xs font-bold uppercase tracking-wide text-slate-500 mb-2" }, "Email Confirmation Subject"), /* @__PURE__ */ React.createElement("input", { value: hotelConfig.emailConfirmationSubject || "Booking confirmed: {{bookingId}} | {{propertyName}}", onChange: (event) => setHotelConfig({ ...hotelConfig, emailConfirmationSubject: event.target.value }), className: "w-full px-4 py-3 rounded-lg border border-slate-200 bg-slate-50 text-sm" })), /* @__PURE__ */ React.createElement("label", { className: "block md:col-span-2" }, /* @__PURE__ */ React.createElement("span", { className: "block text-xs font-bold uppercase tracking-wide text-slate-500 mb-2" }, "Email Confirmation Template"), /* @__PURE__ */ React.createElement("textarea", { rows: "5", value: hotelConfig.emailConfirmationTemplate || "Dear {{guestName}}, your {{roomName}} stay is confirmed for {{checkIn}} to {{checkOut}}. Booking ID: {{bookingId}}. Total: Rs {{totalAmount}}.", onChange: (event) => setHotelConfig({ ...hotelConfig, emailConfirmationTemplate: event.target.value }), className: "w-full px-4 py-3 rounded-lg border border-slate-200 bg-slate-50 text-sm" })), /* @__PURE__ */ React.createElement("label", { className: "block md:col-span-2" }, /* @__PURE__ */ React.createElement("span", { className: "block text-xs font-bold uppercase tracking-wide text-slate-500 mb-2" }, "WhatsApp Confirmation Template"), /* @__PURE__ */ React.createElement("textarea", { rows: "4", value: hotelConfig.whatsappConfirmationTemplate || "Hello {{guestName}}, your booking {{bookingId}} at {{propertyName}} is confirmed. {{roomName}}, {{checkIn}} to {{checkOut}}. Total: Rs {{totalAmount}}.", onChange: (event) => setHotelConfig({ ...hotelConfig, whatsappConfirmationTemplate: event.target.value }), className: "w-full px-4 py-3 rounded-lg border border-slate-200 bg-slate-50 text-sm" }))), /* @__PURE__ */ React.createElement("div", { className: "mt-7 pt-6 border-t border-slate-100 flex items-center gap-4" }, /* @__PURE__ */ React.createElement("button", { onClick: saveHotelSettings, className: "bg-forest-900 text-white px-6 py-3 rounded-lg text-sm font-bold hover:bg-forest-800" }, "Save Changes"), /* @__PURE__ */ React.createElement("span", { className: "text-xs text-slate-400" }, "Changes are automatically stored in this browser."))), adminTab === "mysql" && /* @__PURE__ */ React.createElement("div", { className: "bg-white rounded-xl p-6 sm:p-8 border border-slate-200 shadow-sm" }, /* @__PURE__ */ React.createElement("div", { className: "max-w-4xl" }, /* @__PURE__ */ React.createElement("span", { className: "text-emerald-600 font-bold text-xs uppercase tracking-wider font-mono" }, "Hostinger PHP + MySQL Integration"), /* @__PURE__ */ React.createElement("h3", { className: "text-2xl font-extrabold text-forest-950 mt-2 mb-2" }, "Database & API Deployment"), /* @__PURE__ */ React.createElement("p", { className: "text-slate-600 text-sm mb-7 leading-relaxed" }, "On the demo domain, bookings, rooms, room types, queries, reviews, settings, and admin authentication use the server-side PHP API and MySQL database automatically."), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4 mb-7 text-sm" }, /* @__PURE__ */ React.createElement("div", { className: "p-5 bg-emerald-50 border border-emerald-100 rounded-lg" }, /* @__PURE__ */ React.createElement("span", { className: "text-xs uppercase font-bold text-emerald-700" }, "Website"), /* @__PURE__ */ React.createElement("code", { className: "block mt-2 text-slate-700" }, "https://demo.checkinnhomes.com/")), /* @__PURE__ */ React.createElement("div", { className: "p-5 bg-sky-50 border border-sky-100 rounded-lg" }, /* @__PURE__ */ React.createElement("span", { className: "text-xs uppercase font-bold text-sky-700" }, "API Endpoint"), /* @__PURE__ */ React.createElement("code", { className: "block mt-2 text-slate-700" }, "/api/index.php")), /* @__PURE__ */ React.createElement("div", { className: "p-5 bg-amber-50 border border-amber-100 rounded-lg" }, /* @__PURE__ */ React.createElement("span", { className: "text-xs uppercase font-bold text-amber-700" }, "MySQL Database"), /* @__PURE__ */ React.createElement("code", { className: "block mt-2 text-slate-700" }, "u605122432_checkinnhomes")), /* @__PURE__ */ React.createElement("div", { className: "p-5 bg-violet-50 border border-violet-100 rounded-lg" }, /* @__PURE__ */ React.createElement("span", { className: "text-xs uppercase font-bold text-violet-700" }, "Uploads"), /* @__PURE__ */ React.createElement("code", { className: "block mt-2 text-slate-700" }, "/api/uploads/"))), /* @__PURE__ */ React.createElement("div", { className: "p-5 border border-slate-200 rounded-lg mb-6" }, /* @__PURE__ */ React.createElement("h4", { className: "font-bold text-forest-950 mb-3" }, "Deployment Checklist"), /* @__PURE__ */ React.createElement("ol", { className: "space-y-2 text-sm text-slate-600 list-decimal pl-5" }, /* @__PURE__ */ React.createElement("li", null, "Upload the complete project into the demo subdomain document root."), /* @__PURE__ */ React.createElement("li", null, "Open ", /* @__PURE__ */ React.createElement("code", { className: "text-emerald-700" }, "/api/install.php?key=checkinn-install-2026"), " once."), /* @__PURE__ */ React.createElement("li", null, "Confirm the installer reports success, then delete ", /* @__PURE__ */ React.createElement("code", null, "api/install.php"), "."), /* @__PURE__ */ React.createElement("li", null, "Log in to Admin and use this connection test."))), /* @__PURE__ */ React.createElement("div", { className: "flex flex-col sm:flex-row sm:items-center gap-4" }, /* @__PURE__ */ React.createElement("button", { onClick: testApiConnection, className: "bg-forest-900 hover:bg-forest-800 text-white px-5 py-3 rounded-lg text-sm font-bold" }, "Test API Connection"), apiConnectionStatus !== "idle" && /* @__PURE__ */ React.createElement("p", { className: `text-sm font-semibold ${apiConnectionStatus.startsWith("Connected") ? "text-emerald-700" : apiConnectionStatus.startsWith("Testing") ? "text-sky-700" : "text-amber-700"}` }, apiConnectionStatus)), /* @__PURE__ */ React.createElement("div", { className: "mt-7 p-4 bg-red-50 border border-red-100 rounded-lg text-xs text-red-700" }, "Before production: change the database password, admin password, and install key in ", /* @__PURE__ */ React.createElement("code", null, "api/config.php"), "."))))), profileEditorOpen && /* @__PURE__ */ React.createElement("div", { className: "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" }, /* @__PURE__ */ React.createElement("div", { className: "w-full max-w-lg max-h-[92vh] overflow-y-auto bg-white rounded-xl shadow-2xl p-6 sm:p-8" }, /* @__PURE__ */ React.createElement("div", { className: "flex justify-between items-center mb-6" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { className: "text-xs font-bold uppercase tracking-widest text-emerald-700" }, "Account"), /* @__PURE__ */ React.createElement("h3", { className: "text-xl font-extrabold text-forest-950 mt-1" }, "Edit Profile")), /* @__PURE__ */ React.createElement("button", { onClick: () => setProfileEditorOpen(false), className: "text-slate-400 text-lg" }, "x")), /* @__PURE__ */ React.createElement("form", { onSubmit: saveProfile, className: "space-y-4" }, /* @__PURE__ */ React.createElement("label", { className: "block text-xs font-bold text-slate-600" }, "Display Name", /* @__PURE__ */ React.createElement("input", { value: profileDraft.displayName, onChange: (event) => setProfileDraft({ ...profileDraft, displayName: event.target.value }), className: "mt-1.5 w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm", required: true })), /* @__PURE__ */ React.createElement("label", { className: "block text-xs font-bold text-slate-600" }, "Profile Photo URL", /* @__PURE__ */ React.createElement("input", { type: "url", value: profileDraft.profilePhoto, onChange: (event) => setProfileDraft({ ...profileDraft, profilePhoto: event.target.value }), placeholder: "https://example.com/photo.jpg", className: "mt-1.5 w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm" })), /* @__PURE__ */ React.createElement("div", { className: "pt-3 border-t border-slate-100" }, /* @__PURE__ */ React.createElement("p", { className: "text-xs font-bold uppercase text-slate-500 mb-3" }, "Change Password"), /* @__PURE__ */ React.createElement("div", { className: "space-y-3" }, /* @__PURE__ */ React.createElement("input", { type: "password", value: profileDraft.currentPassword, onChange: (event) => setProfileDraft({ ...profileDraft, currentPassword: event.target.value }), placeholder: "Current password", className: "w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm" }), /* @__PURE__ */ React.createElement("input", { type: "password", value: profileDraft.newPassword, onChange: (event) => setProfileDraft({ ...profileDraft, newPassword: event.target.value }), placeholder: "New password", className: "w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm" }))), /* @__PURE__ */ React.createElement("label", { className: "flex items-start gap-3 p-3 bg-red-50 border border-red-100 rounded-lg text-xs text-red-700" }, /* @__PURE__ */ React.createElement("input", { type: "checkbox", checked: profileDraft.deactivate, onChange: (event) => setProfileDraft({ ...profileDraft, deactivate: event.target.checked }), className: "mt-0.5" }), /* @__PURE__ */ React.createElement("span", null, /* @__PURE__ */ React.createElement("strong", { className: "block" }, "Deactivate account"), "Stops this admin account from logging in until it is manually reactivated in the database.")), /* @__PURE__ */ React.createElement("div", { className: "flex justify-end gap-3 pt-3" }, /* @__PURE__ */ React.createElement("button", { type: "button", onClick: () => setProfileEditorOpen(false), className: "px-5 py-2.5 border border-slate-200 rounded-lg text-sm font-bold text-slate-600" }, "Cancel"), /* @__PURE__ */ React.createElement("button", { type: "submit", className: "px-5 py-2.5 bg-forest-900 text-white rounded-lg text-sm font-bold" }, "Save Profile"))))), editingRoom && /* @__PURE__ */ React.createElement("div", { className: "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" }, /* @__PURE__ */ React.createElement("div", { className: "bg-white rounded-xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[92vh] overflow-y-auto" }, /* @__PURE__ */ React.createElement("div", { className: "flex justify-between items-center mb-6" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { className: "text-xs font-bold uppercase tracking-widest text-emerald-700" }, "Room Management"), /* @__PURE__ */ React.createElement("h3", { className: "text-xl font-extrabold text-forest-950 mt-1" }, editingRoom.isNew ? "Add New Room" : `Edit Room: ${editingRoom.name}`)), /* @__PURE__ */ React.createElement("button", { onClick: () => setEditingRoom(null), className: "text-stone-400 hover:text-stone-700 font-bold text-lg" }, "\u2715")), /* @__PURE__ */ React.createElement("form", { onSubmit: handleSaveRoom, className: "space-y-4 text-xs" }, /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4" }, /* @__PURE__ */ React.createElement("label", { className: "block" }, /* @__PURE__ */ React.createElement("span", { className: "block font-bold text-slate-500 mb-1" }, "Room Display Name *"), /* @__PURE__ */ React.createElement("input", { type: "text", value: editingRoom.name, onChange: (e) => setEditingRoom({ ...editingRoom, name: e.target.value }), className: "w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm font-medium", required: true })), /* @__PURE__ */ React.createElement("label", { className: "block" }, /* @__PURE__ */ React.createElement("span", { className: "block font-bold text-slate-500 mb-1" }, "Room Type *"), /* @__PURE__ */ React.createElement("select", { value: editingRoom.type, onChange: (e) => setEditingRoom({ ...editingRoom, type: e.target.value }), className: "w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm font-medium bg-white cursor-pointer", required: true }, /* @__PURE__ */ React.createElement("option", { value: "", disabled: true }, "Select room type"), roomTypes.map((type) => /* @__PURE__ */ React.createElement("option", { key: type, value: type }, type))))), /* @__PURE__ */ React.createElement("div", { className: "p-4 bg-amber-50 border border-amber-200 rounded-lg" }, /* @__PURE__ */ React.createElement("p", { className: "font-bold text-amber-800 mb-3" }, "Pricing Plans"), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-3" }, /* @__PURE__ */ React.createElement("label", { className: "block" }, /* @__PURE__ */ React.createElement("span", { className: "block font-bold text-slate-500 mb-1" }, "Room Only (EP) \u20B9 *"), /* @__PURE__ */ React.createElement("input", { type: "number", min: "0", value: editingRoom.price, onChange: (e) => setEditingRoom({ ...editingRoom, price: Number(e.target.value) }), className: "w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm font-bold", required: true })), /* @__PURE__ */ React.createElement("label", { className: "block" }, /* @__PURE__ */ React.createElement("span", { className: "block font-bold text-slate-500 mb-1" }, "With Breakfast (CP) \u20B9"), /* @__PURE__ */ React.createElement("input", { type: "number", min: "0", value: editingRoom.breakfastPrice || "", onChange: (e) => setEditingRoom({ ...editingRoom, breakfastPrice: e.target.value }), className: "w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm font-bold" })), /* @__PURE__ */ React.createElement("label", { className: "block" }, /* @__PURE__ */ React.createElement("span", { className: "block font-bold text-slate-500 mb-1" }, "With Meals (MAP) \u20B9"), /* @__PURE__ */ React.createElement("input", { type: "number", min: "0", value: editingRoom.mealsPrice || "", onChange: (e) => setEditingRoom({ ...editingRoom, mealsPrice: e.target.value }), className: "w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm font-bold" }))), /* @__PURE__ */ React.createElement("p", { className: "text-[10px] text-amber-700 mt-2" }, "EP = Room Only | CP = Room + Breakfast | MAP = Room + Meals")), /* @__PURE__ */ React.createElement("div", { className: "max-w-xs" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block font-bold text-slate-500 mb-1" }, "Original Price (\u20B9)"), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "number",
      min: "0",
      value: editingRoom.originalPrice || "",
      onChange: (e) => setEditingRoom({ ...editingRoom, originalPrice: e.target.value }),
      className: "w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm font-medium"
    }
  ))), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-4" }, /* @__PURE__ */ React.createElement("label", { className: "block" }, /* @__PURE__ */ React.createElement("span", { className: "block font-bold text-slate-500 mb-1" }, "Capacity *"), /* @__PURE__ */ React.createElement("input", { type: "text", value: editingRoom.capacity, onChange: (e) => setEditingRoom({ ...editingRoom, capacity: e.target.value }), className: "w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm", required: true })), /* @__PURE__ */ React.createElement("label", { className: "block" }, /* @__PURE__ */ React.createElement("span", { className: "block font-bold text-slate-500 mb-1" }, "Bed Type *"), /* @__PURE__ */ React.createElement("input", { type: "text", value: editingRoom.bed, onChange: (e) => setEditingRoom({ ...editingRoom, bed: e.target.value }), className: "w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm", required: true })), /* @__PURE__ */ React.createElement("label", { className: "block" }, /* @__PURE__ */ React.createElement("span", { className: "block font-bold text-slate-500 mb-1" }, "Room Size"), /* @__PURE__ */ React.createElement("input", { type: "text", value: editingRoom.size || "", onChange: (e) => setEditingRoom({ ...editingRoom, size: e.target.value }), placeholder: "e.g. 320 sq.ft", className: "w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm" }))), /* @__PURE__ */ React.createElement("div", { className: "p-4 sm:p-5 bg-sky-50/60 border border-sky-200 rounded-lg" }, /* @__PURE__ */ React.createElement("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { className: "font-bold text-slate-800" }, "Room Photos *"), /* @__PURE__ */ React.createElement("p", { className: "text-[11px] text-slate-500 mt-0.5" }, "Add multiple photos and select one as the main image.")), /* @__PURE__ */ React.createElement("label", { className: "inline-flex items-center justify-center gap-2 bg-forest-900 hover:bg-forest-800 text-white px-4 py-2.5 rounded-lg text-xs font-bold cursor-pointer" }, /* @__PURE__ */ React.createElement("span", null, "\uFF0B"), " Upload Photos", /* @__PURE__ */ React.createElement("input", { type: "file", accept: "image/*", multiple: true, onChange: uploadRoomImages, className: "sr-only" }))), /* @__PURE__ */ React.createElement("div", { className: "flex flex-col sm:flex-row gap-2 mb-4" }, /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "url",
      value: editingRoom.newGalleryUrl || "",
      onChange: (event) => setEditingRoom({ ...editingRoom, newGalleryUrl: event.target.value }),
      onKeyDown: (event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          addRoomImageUrl();
        }
      },
      placeholder: "Paste image URL",
      className: "flex-1 px-3 py-2.5 border border-slate-200 rounded-lg text-xs font-mono bg-white"
    }
  ), /* @__PURE__ */ React.createElement("button", { type: "button", onClick: addRoomImageUrl, className: "px-4 py-2.5 border border-sky-300 bg-white text-sky-700 hover:bg-sky-100 rounded-lg text-xs font-bold" }, "Add URL")), editingRoom.gallery?.length ? /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-2 sm:grid-cols-3 gap-3" }, Array.from(new Set([editingRoom.image, ...editingRoom.gallery].filter(Boolean))).map((imageUrl, index) => {
    const isMain = editingRoom.image === imageUrl;
    return /* @__PURE__ */ React.createElement("div", { key: `${imageUrl.slice(0, 80)}-${index}`, className: `relative bg-white border-2 rounded-lg overflow-hidden ${isMain ? "border-amber-500" : "border-slate-200"}` }, /* @__PURE__ */ React.createElement("img", { src: imageUrl, alt: `Room photo ${index + 1}`, className: "w-full aspect-[4/3] object-cover" }), isMain && /* @__PURE__ */ React.createElement("span", { className: "absolute top-2 left-2 bg-amber-500 text-forest-950 px-2 py-1 rounded text-[9px] font-black uppercase" }, "Main Image"), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-2 border-t border-slate-100" }, /* @__PURE__ */ React.createElement("button", { type: "button", onClick: () => setMainRoomImage(imageUrl), disabled: isMain, className: "px-2 py-2 text-[10px] font-bold text-emerald-700 hover:bg-emerald-50 disabled:text-slate-300 disabled:bg-slate-50" }, isMain ? "Selected" : "Set Main"), /* @__PURE__ */ React.createElement("button", { type: "button", onClick: () => removeRoomImage(imageUrl), className: "px-2 py-2 text-[10px] font-bold text-red-600 hover:bg-red-50 border-l border-slate-100" }, "Remove")));
  })) : /* @__PURE__ */ React.createElement("div", { className: "border border-dashed border-sky-300 bg-white py-8 text-center text-xs text-slate-400 rounded-lg" }, "No photos added yet. Upload photos or add an image URL.")), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block font-bold text-slate-500 mb-1" }, "Amenities (comma separated)"), /* @__PURE__ */ React.createElement("input", { type: "text", value: editingRoom.amenitiesText ?? editingRoom.amenities.join(", "), onChange: (e) => setEditingRoom({ ...editingRoom, amenitiesText: e.target.value }), placeholder: "Wi-Fi, AC, TV, Private Bathroom", className: "w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm" })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block font-bold text-slate-500 mb-1" }, "Room Description *"), /* @__PURE__ */ React.createElement(
    "textarea",
    {
      rows: "3",
      value: editingRoom.description,
      onChange: (e) => setEditingRoom({ ...editingRoom, description: e.target.value }),
      className: "w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm font-medium",
      required: true
    }
  )), /* @__PURE__ */ React.createElement("div", { className: "flex gap-3 pt-4" }, /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      onClick: () => setEditingRoom(null),
      className: "flex-1 py-2.5 rounded-lg border border-slate-300 font-bold text-slate-600 hover:bg-slate-50"
    },
    "Cancel"
  ), /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "submit",
      className: "flex-1 py-2.5 rounded-lg bg-forest-900 text-white font-bold hover:bg-forest-800 shadow"
    },
    editingRoom.isNew ? "Add Room" : "Save Changes"
  ))))), editingBooking && /* @__PURE__ */ React.createElement("div", { className: "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" }, /* @__PURE__ */ React.createElement("div", { className: "w-full max-w-2xl max-h-[92vh] overflow-y-auto bg-white rounded-xl shadow-2xl p-6 sm:p-8" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-start justify-between gap-4 mb-6" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h3", { className: "text-xl font-extrabold text-forest-950" }, "Edit Booking"), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-slate-500 mt-1" }, editingBooking.id)), /* @__PURE__ */ React.createElement("button", { onClick: () => setEditingBooking(null), className: "w-9 h-9 border border-slate-200 rounded-lg text-slate-500", "aria-label": "Close booking editor" }, "x")), /* @__PURE__ */ React.createElement("form", { onSubmit: saveBookingEdit, className: "grid grid-cols-1 sm:grid-cols-2 gap-4" }, /* @__PURE__ */ React.createElement("label", { className: "block text-xs font-bold text-slate-600" }, "Guest Name", /* @__PURE__ */ React.createElement("input", { value: editingBooking.guestName, onChange: (event) => setEditingBooking({ ...editingBooking, guestName: event.target.value }), className: "mt-1.5 w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm", required: true })), /* @__PURE__ */ React.createElement("label", { className: "block text-xs font-bold text-slate-600" }, "Email", /* @__PURE__ */ React.createElement("input", { type: "email", value: editingBooking.email, onChange: (event) => setEditingBooking({ ...editingBooking, email: event.target.value }), className: "mt-1.5 w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm", required: true })), /* @__PURE__ */ React.createElement("label", { className: "block text-xs font-bold text-slate-600" }, "Contact Number", /* @__PURE__ */ React.createElement("input", { value: editingBooking.phone, onChange: (event) => setEditingBooking({ ...editingBooking, phone: event.target.value }), className: "mt-1.5 w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm", required: true })), /* @__PURE__ */ React.createElement("label", { className: "block text-xs font-bold text-slate-600" }, "Room", /* @__PURE__ */ React.createElement("input", { value: editingBooking.roomName, onChange: (event) => setEditingBooking({ ...editingBooking, roomName: event.target.value }), className: "mt-1.5 w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm", required: true })), /* @__PURE__ */ React.createElement("label", { className: "block text-xs font-bold text-slate-600" }, "Check-in", /* @__PURE__ */ React.createElement("input", { type: "date", value: editingBooking.checkIn, onChange: (event) => setEditingBooking({ ...editingBooking, checkIn: event.target.value }), className: "mt-1.5 w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm", required: true })), /* @__PURE__ */ React.createElement("label", { className: "block text-xs font-bold text-slate-600" }, "Check-out", /* @__PURE__ */ React.createElement("input", { type: "date", value: editingBooking.checkOut, onChange: (event) => setEditingBooking({ ...editingBooking, checkOut: event.target.value }), className: "mt-1.5 w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm", required: true })), /* @__PURE__ */ React.createElement("label", { className: "block text-xs font-bold text-slate-600" }, "Guests", /* @__PURE__ */ React.createElement("input", { type: "number", min: "1", value: editingBooking.guests, onChange: (event) => setEditingBooking({ ...editingBooking, guests: Number(event.target.value) }), className: "mt-1.5 w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm", required: true })), /* @__PURE__ */ React.createElement("label", { className: "block text-xs font-bold text-slate-600" }, "Total Amount (Rs)", /* @__PURE__ */ React.createElement("input", { type: "number", min: "0", value: editingBooking.totalAmount, onChange: (event) => setEditingBooking({ ...editingBooking, totalAmount: Number(event.target.value) }), className: "mt-1.5 w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm", required: true })), /* @__PURE__ */ React.createElement("label", { className: "block text-xs font-bold text-slate-600" }, "Payment Mode", /* @__PURE__ */ React.createElement("select", { value: editingBooking.paymentMode, onChange: (event) => setEditingBooking({ ...editingBooking, paymentMode: event.target.value }), className: "mt-1.5 w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm" }, /* @__PURE__ */ React.createElement("option", null, "Cash on Check-in"), /* @__PURE__ */ React.createElement("option", null, "Pay Online"))), /* @__PURE__ */ React.createElement("label", { className: "block text-xs font-bold text-slate-600" }, "Status", /* @__PURE__ */ React.createElement("select", { value: editingBooking.status, onChange: (event) => setEditingBooking({ ...editingBooking, status: event.target.value }), className: "mt-1.5 w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm" }, /* @__PURE__ */ React.createElement("option", null, "Confirmed"), /* @__PURE__ */ React.createElement("option", null, "Checked-In"), /* @__PURE__ */ React.createElement("option", null, "Completed"), /* @__PURE__ */ React.createElement("option", null, "Cancelled"))), /* @__PURE__ */ React.createElement("label", { className: "block sm:col-span-2 text-xs font-bold text-slate-600" }, "Notes", /* @__PURE__ */ React.createElement("textarea", { rows: "3", value: editingBooking.notes || "", onChange: (event) => setEditingBooking({ ...editingBooking, notes: event.target.value }), className: "mt-1.5 w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm" })), /* @__PURE__ */ React.createElement("div", { className: "sm:col-span-2 flex justify-end gap-3 pt-3" }, /* @__PURE__ */ React.createElement("button", { type: "button", onClick: () => setEditingBooking(null), className: "px-5 py-2.5 border border-slate-200 rounded-lg text-sm font-bold text-slate-600" }, "Cancel"), /* @__PURE__ */ React.createElement("button", { type: "submit", className: "px-5 py-2.5 bg-forest-900 text-white rounded-lg text-sm font-bold" }, "Save Booking")))))));
}
function BookingEngineModal({ rooms, selectedRoom, initialDates, coupons, razorpayKeyId, onClose, onConfirmBooking }) {
  const [currentRoom, setCurrentRoom] = useState(selectedRoom || rooms[0]);
  const [selectedMealPlan, setSelectedMealPlan] = useState((selectedRoom || rooms[0])?.mealPlans?.[0] || "");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [formData, setFormData] = useState({
    guestName: "",
    email: "",
    phone: "",
    whatsapp: "",
    whatsappSameAsPhone: true,
    paymentMode: "Cash on Check-in",
    couponCode: "",
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
  const selectedPlanPrice = Number(String(selectedMealPlan).match(/₹\s*([\d,]+)/)?.[1]?.replace(/,/g, "")) || Number(currentRoom.price);
  const subtotal = useMemo(() => {
    let base = selectedPlanPrice * nights;
    if (formData.addRafting) base += 850 * formData.guests;
    if (formData.addScooty) base += 500 * nights;
    return base;
  }, [selectedPlanPrice, nights, formData.addRafting, formData.addScooty, formData.guests]);
  const eligibleCoupons = coupons.filter((coupon) => coupon.active && subtotal >= Number(coupon.minimumAmount || 0));
  const appliedCoupon = eligibleCoupons.find((coupon) => coupon.code.toUpperCase() === formData.couponCode.trim().toUpperCase());
  const discountAmount = appliedCoupon ? Math.min(subtotal, appliedCoupon.discountType === "fixed" ? Number(appliedCoupon.discountValue) : Math.round(subtotal * Number(appliedCoupon.discountValue) / 100)) : 0;
  const totalAmount = subtotal - discountAmount;
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.guestName || !formData.email || !formData.phone || !formData.whatsapp) {
      alert("Please provide your name, email, contact number, and WhatsApp number.");
      return;
    }
    const newBooking = {
      id: "CIH-" + Math.floor(1e3 + Math.random() * 9e3),
      guestName: formData.guestName,
      email: formData.email,
      phone: formData.phone,
      roomName: currentRoom.name,
      checkIn: formData.checkIn,
      checkOut: formData.checkOut,
      guests: formData.guests,
      totalAmount,
      status: "Confirmed",
      paymentMode: formData.paymentMode,
      notes: `${formData.specialRequests || ""} [Rate Plan: ${selectedMealPlan}] [WhatsApp: ${formData.whatsapp}] ${appliedCoupon ? `[Coupon: ${appliedCoupon.code}, -Rs ${discountAmount}]` : ""} ${formData.addRafting ? "[+Rafting]" : ""} ${formData.addScooty ? "[+Scooty]" : ""}`.trim()
    };
    if (formData.paymentMode !== "Pay Online") {
      onConfirmBooking(newBooking);
      return;
    }
    if (!API_ENABLED || !razorpayKeyId) {
      alert("Online payment is not configured yet. Please choose Cash on Check-in or contact the property.");
      return;
    }
    try {
      setIsProcessingPayment(true);
      const order = await apiRequest("payment", { method: "POST", body: { amount: totalAmount * 100, receipt: newBooking.id } });
      await loadRazorpayCheckout();
      const payment = await new Promise((resolve, reject) => {
        const checkout = new window.Razorpay({ key: order.keyId, amount: order.amount, currency: order.currency, name: "Checkinn Homes", description: `${currentRoom.name} - ${selectedMealPlan}`, order_id: order.orderId, prefill: { name: formData.guestName, email: formData.email, contact: formData.phone }, theme: { color: "#0c3b2e" }, handler: resolve, modal: { ondismiss: () => reject(new Error("Payment was cancelled.")) } });
        checkout.open();
      });
      await apiRequest("payment", { method: "PUT", body: { orderId: payment.razorpay_order_id, paymentId: payment.razorpay_payment_id, signature: payment.razorpay_signature } });
      onConfirmBooking({ ...newBooking, paymentMode: "Pay Online - Paid", notes: `${newBooking.notes} [Razorpay Payment: ${payment.razorpay_payment_id}]` });
    } catch (error) {
      alert(error.message || "Online payment could not be completed.");
    } finally {
      setIsProcessingPayment(false);
    }
  };
  return /* @__PURE__ */ React.createElement("div", { className: "fixed inset-0 z-50 bg-forest-950/70 backdrop-blur-md flex items-start sm:items-center justify-center p-3 sm:p-4 overflow-hidden" }, /* @__PURE__ */ React.createElement("div", { className: "bg-white rounded-3xl max-w-3xl w-full max-h-[calc(100dvh-1.5rem)] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-stone-200 relative" }, /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: onClose,
      className: "sticky top-0 z-10 ml-auto -mt-2 -mr-2 w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 font-bold flex items-center justify-center text-sm transition shadow-sm"
    },
    "\u2715"
  ), /* @__PURE__ */ React.createElement("div", { className: "mb-6" }, /* @__PURE__ */ React.createElement("span", { className: "text-amber-600 font-bold text-xs uppercase tracking-widest" }, "Instant Reservation"), /* @__PURE__ */ React.createElement("h2", { className: "font-serif text-2xl sm:text-3xl font-bold text-forest-950 mt-0.5" }, "Book Your Rishikesh Sanctuary"), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-stone-500" }, "No advance payment required for direct website reservations.")), /* @__PURE__ */ React.createElement("form", { onSubmit: handleSubmit, className: "space-y-6" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-xs font-bold uppercase text-stone-500 mb-2" }, "Select Preferred Room"), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-2" }, rooms.map((r) => /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      key: r.id,
      onClick: () => {
        setCurrentRoom(r);
        setSelectedMealPlan(r.mealPlans?.[0] || "");
      },
      className: `p-3 rounded-2xl text-left border transition ${currentRoom.id === r.id ? "border-forest-900 bg-forest-50/70 ring-2 ring-forest-900" : "border-stone-200 hover:border-stone-300 bg-stone-50/40"}`
    },
    /* @__PURE__ */ React.createElement("h4", { className: "font-serif font-bold text-xs text-forest-950 leading-tight" }, r.name),
    /* @__PURE__ */ React.createElement("p", { className: "text-[11px] font-bold text-amber-700 mt-1" }, "\u20B9", r.price, "/n")
  )))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-xs font-bold uppercase text-stone-500 mb-2" }, "Select Pricing Plan"), /* @__PURE__ */ React.createElement("select", { value: selectedMealPlan, onChange: (event) => setSelectedMealPlan(event.target.value), className: "w-full px-4 py-3 rounded-xl border border-stone-200 text-sm font-bold bg-stone-50/50 text-forest-950 focus:outline-none focus:ring-2 focus:ring-forest-800", required: true }, (currentRoom.mealPlans?.length ? currentRoom.mealPlans : [`Room Only (EP): \u20B9${currentRoom.price.toLocaleString("en-IN")}`]).map((plan) => /* @__PURE__ */ React.createElement("option", { key: plan, value: plan }, plan))), /* @__PURE__ */ React.createElement("p", { className: "mt-2 text-xs text-stone-500" }, "Selected plan: \u20B9", selectedPlanPrice.toLocaleString("en-IN"), " per night")), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-3 bg-warmCream p-4 rounded-2xl border border-stone-200" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-[11px] font-bold uppercase text-stone-500 mb-1" }, "Check-In Date"), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "date",
      value: formData.checkIn,
      onChange: (e) => setFormData({ ...formData, checkIn: e.target.value }),
      className: "w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-bold bg-white text-forest-950",
      required: true
    }
  )), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-[11px] font-bold uppercase text-stone-500 mb-1" }, "Check-Out Date"), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "date",
      value: formData.checkOut,
      onChange: (e) => setFormData({ ...formData, checkOut: e.target.value }),
      className: "w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-bold bg-white text-forest-950",
      required: true
    }
  )), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-[11px] font-bold uppercase text-stone-500 mb-1" }, "Number of Guests"), /* @__PURE__ */ React.createElement(
    "select",
    {
      value: formData.guests,
      onChange: (e) => setFormData({ ...formData, guests: Number(e.target.value) }),
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
      onChange: (e) => setFormData({ ...formData, guestName: e.target.value }),
      className: "w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm font-medium bg-stone-50/50 focus:outline-none focus:ring-2 focus:ring-forest-800",
      required: true
    }
  )), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-xs font-bold uppercase text-stone-500 mb-1" }, "Email Address *"), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "email",
      placeholder: "e.g. maya@example.com",
      value: formData.email,
      onChange: (e) => setFormData({ ...formData, email: e.target.value }),
      className: "w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm font-medium bg-stone-50/50 focus:outline-none focus:ring-2 focus:ring-forest-800",
      required: true
    }
  )), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-xs font-bold uppercase text-stone-500 mb-1" }, "Contact Number *"), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "tel",
      placeholder: "e.g. +91 98765 00000",
      value: formData.phone,
      onChange: (e) => setFormData({ ...formData, phone: e.target.value, whatsapp: formData.whatsappSameAsPhone ? e.target.value : formData.whatsapp }),
      className: "w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm font-medium bg-stone-50/50 focus:outline-none focus:ring-2 focus:ring-forest-800",
      required: true
    }
  )), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-xs font-bold uppercase text-stone-500 mb-1" }, "WhatsApp Number *"), /* @__PURE__ */ React.createElement("input", { type: "tel", placeholder: "e.g. +91 98765 00000", value: formData.whatsapp, onChange: (e) => setFormData({ ...formData, whatsapp: e.target.value }), className: "w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm font-medium bg-stone-50/50 focus:outline-none focus:ring-2 focus:ring-forest-800", required: true }), /* @__PURE__ */ React.createElement("label", { className: "mt-2 flex items-center gap-2 text-xs text-stone-600" }, /* @__PURE__ */ React.createElement("input", { type: "checkbox", checked: formData.whatsappSameAsPhone, onChange: (e) => {
    const same = e.target.checked;
    setFormData({ ...formData, whatsappSameAsPhone: same, whatsapp: same ? formData.phone : formData.whatsapp });
  } }), " Same as contact number"))), /* @__PURE__ */ React.createElement("div", { className: "rounded-2xl border border-stone-200 p-4 space-y-3" }, /* @__PURE__ */ React.createElement("span", { className: "block text-xs font-bold uppercase text-stone-500" }, "Payment Option"), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-2" }, /* @__PURE__ */ React.createElement("label", { className: `p-3 rounded-xl border cursor-pointer text-sm font-bold ${formData.paymentMode === "Cash on Check-in" ? "border-forest-900 bg-forest-50" : "border-stone-200"}` }, /* @__PURE__ */ React.createElement("input", { type: "radio", name: "payment", checked: formData.paymentMode === "Cash on Check-in", onChange: () => setFormData({ ...formData, paymentMode: "Cash on Check-in", couponCode: "" }), className: "mr-2" }), "Cash on Check-in"), /* @__PURE__ */ React.createElement("label", { className: `p-3 rounded-xl border cursor-pointer text-sm font-bold ${formData.paymentMode === "Pay Online" ? "border-forest-900 bg-forest-50" : "border-stone-200"}` }, /* @__PURE__ */ React.createElement("input", { type: "radio", name: "payment", checked: formData.paymentMode === "Pay Online", onChange: () => setFormData({ ...formData, paymentMode: "Pay Online" }), className: "mr-2" }), "Pay Online")), formData.paymentMode === "Pay Online" && /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-xs font-bold uppercase text-stone-500 mb-1" }, "Coupon Code"), /* @__PURE__ */ React.createElement("input", { list: "booking-coupons", value: formData.couponCode, onChange: (e) => setFormData({ ...formData, couponCode: e.target.value.toUpperCase() }), placeholder: eligibleCoupons.length ? "Enter or select a coupon" : "No coupon currently eligible", className: "w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm" }), /* @__PURE__ */ React.createElement("datalist", { id: "booking-coupons" }, eligibleCoupons.map((coupon) => /* @__PURE__ */ React.createElement("option", { key: coupon.id, value: coupon.code }, coupon.discountType === "fixed" ? `Rs ${coupon.discountValue} off` : `${coupon.discountValue}% off`))), eligibleCoupons.length > 0 && /* @__PURE__ */ React.createElement("div", { className: "mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2" }, eligibleCoupons.map((coupon) => /* @__PURE__ */ React.createElement("button", { type: "button", key: coupon.id, onClick: () => setFormData({ ...formData, couponCode: coupon.code }), className: `text-left p-3 rounded-xl border transition ${formData.couponCode === coupon.code ? "border-forest-900 bg-forest-50" : "border-stone-200 hover:border-emerald-500"}` }, /* @__PURE__ */ React.createElement("span", { className: "block text-sm font-bold text-forest-950" }, coupon.code), /* @__PURE__ */ React.createElement("span", { className: "block mt-1 text-xs text-emerald-700" }, coupon.discountType === "fixed" ? `Rs ${coupon.discountValue} off` : `${coupon.discountValue}% off`, " on Rs ", Number(coupon.minimumAmount).toLocaleString("en-IN"), "+")))), appliedCoupon && /* @__PURE__ */ React.createElement("p", { className: "mt-2 text-xs font-bold text-emerald-700" }, appliedCoupon.code, " applied: Rs ", discountAmount.toLocaleString("en-IN"), " saved"))), /* @__PURE__ */ React.createElement("div", { className: "space-y-2" }, /* @__PURE__ */ React.createElement("span", { className: "block text-xs font-bold uppercase text-stone-500" }, "Rishikesh Add-On Experiences (Optional)"), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs" }, /* @__PURE__ */ React.createElement("label", { className: "flex items-center gap-2.5 p-3 rounded-xl border border-stone-200 cursor-pointer hover:bg-stone-50" }, /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "checkbox",
      checked: formData.addRafting,
      onChange: (e) => setFormData({ ...formData, addRafting: e.target.checked }),
      className: "rounded text-forest-900 focus:ring-forest-800 w-4 h-4"
    }
  ), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("span", { className: "font-bold text-forest-950" }, "16km River Rafting"), /* @__PURE__ */ React.createElement("p", { className: "text-[11px] text-stone-500" }, "+\u20B9850/person with pickup"))), /* @__PURE__ */ React.createElement("label", { className: "flex items-center gap-2.5 p-3 rounded-xl border border-stone-200 cursor-pointer hover:bg-stone-50" }, /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "checkbox",
      checked: formData.addScooty,
      onChange: (e) => setFormData({ ...formData, addScooty: e.target.checked }),
      className: "rounded text-forest-900 focus:ring-forest-800 w-4 h-4"
    }
  ), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("span", { className: "font-bold text-forest-950" }, "Daily Scooty Rental"), /* @__PURE__ */ React.createElement("p", { className: "text-[11px] text-stone-500" }, "+\u20B9500/day doorstep delivery"))))), /* @__PURE__ */ React.createElement("div", { className: "bg-forest-950 text-white p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "text-xs text-stone-300" }, nights, " Night(s) Stay \u2022 ", currentRoom.name), /* @__PURE__ */ React.createElement("div", { className: "font-serif text-2xl font-bold text-amber-300 mt-0.5" }, "Total: \u20B9", totalAmount.toLocaleString("en-IN")), /* @__PURE__ */ React.createElement("p", { className: "text-[10px] text-emerald-400" }, formData.paymentMode === "Pay Online" ? "Online payment setup will continue after confirmation." : "Pay on arrival in Upper Tapovan.")), /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "submit",
      disabled: isProcessingPayment,
      className: "w-full sm:w-auto px-8 py-3.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-forest-950 font-bold rounded-xl shadow-lg transition transform active:scale-95 text-sm"
    },
    isProcessingPayment ? "Opening Payment..." : formData.paymentMode === "Pay Online" ? "Pay Securely \u2794" : "Confirm Instant Booking \u2794"
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
function Footer({ hotelConfig, setCurrentPage, openBookingEngine, adminAuthenticated }) {
  return /* @__PURE__ */ React.createElement("footer", { className: "bg-forest-950 text-white pt-16 pb-12 border-t border-forest-900" }, /* @__PURE__ */ React.createElement("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" }, /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-forest-900" }, /* @__PURE__ */ React.createElement("div", { className: "space-y-4" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-3" }, /* @__PURE__ */ React.createElement("div", { className: "w-10 h-10 rounded-2xl bg-forest-900 text-amber-400 flex items-center justify-center font-serif text-2xl font-bold border border-forest-800" }, "C"), /* @__PURE__ */ React.createElement("h2", { className: "font-serif text-2xl font-bold tracking-tight text-white" }, "Checkinn ", /* @__PURE__ */ React.createElement("span", { className: "text-amber-400" }, "Homes"))), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-stone-300 leading-relaxed" }, "Your trusted stay partner in Rishikesh, offering comfortable rooms, modern amenities, and a peaceful experience in the heart of Tapovan."), /* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap gap-3 text-stone-400 text-sm" }, /* @__PURE__ */ React.createElement("a", { href: "https://www.instagram.com/checkinnhomes", target: "_blank", rel: "noreferrer", className: "hover:text-amber-400" }, "Instagram"), /* @__PURE__ */ React.createElement("a", { href: "https://www.facebook.com/people/Check-Inn-Homes/61588184592316/", target: "_blank", rel: "noreferrer", className: "hover:text-amber-400" }, "Facebook"), /* @__PURE__ */ React.createElement("a", { href: "https://www.youtube.com/@checkInnHomes", target: "_blank", rel: "noreferrer", className: "hover:text-amber-400" }, "YouTube"))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h3", { className: "font-serif text-base font-bold text-amber-300 mb-4" }, "Quick Links"), /* @__PURE__ */ React.createElement("ul", { className: "space-y-2 text-xs text-stone-300" }, ["Home", "Our Rooms", "About Us", "Guest Stories", "Contact & Map"].map((name, i) => {
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
  ))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h3", { className: "font-serif text-base font-bold text-amber-300 mb-4" }, "Contact Info"), /* @__PURE__ */ React.createElement("div", { className: "space-y-3 text-xs text-stone-300" }, /* @__PURE__ */ React.createElement("p", { className: "leading-snug" }, "\u{1F4CD} ", hotelConfig.location), /* @__PURE__ */ React.createElement("p", null, "\u{1F4DE} Phone: ", /* @__PURE__ */ React.createElement("a", { href: `tel:${hotelConfig.phone}`, className: "text-amber-300 hover:underline" }, hotelConfig.phone)), /* @__PURE__ */ React.createElement("p", null, "\u2709\uFE0F Email: ", /* @__PURE__ */ React.createElement("a", { href: `mailto:${hotelConfig.email}`, className: "text-amber-300 hover:underline" }, hotelConfig.email))))), /* @__PURE__ */ React.createElement("div", { className: "pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-400" }, /* @__PURE__ */ React.createElement("div", null, "\xA9 ", (/* @__PURE__ */ new Date()).getFullYear(), " Checkinn Homes Rishikesh. All rights reserved."), /* @__PURE__ */ React.createElement("div", { className: "flex gap-4" }, /* @__PURE__ */ React.createElement("button", { onClick: () => setCurrentPage("admin"), className: "text-amber-400 hover:underline" }, adminAuthenticated ? "Dashboard" : "Login"), /* @__PURE__ */ React.createElement("span", null, "\u2022"), /* @__PURE__ */ React.createElement("span", null, "Upper Tapovan, Uttarakhand 249192")))));
}
ReactDOM.createRoot(document.getElementById("root")).render(/* @__PURE__ */ React.createElement(App, null));
