import React, { createContext, useState, useEffect, useRef } from "react";

export const CRMContext = createContext();

// Helper to format date
const getTodayString = (offsetDays = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split("T")[0];
};

const getTodayTimeString = (offsetMinutes = 0) => {
  const d = new Date();
  d.setMinutes(d.getMinutes() + offsetMinutes);
  return d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
};

// Initial Mock Data
const initialCustomers = [
  {
    id: 1,
    name: "Ahmad Reza",
    email: "ahmad.reza@gmail.com",
    phone: "081298765432",
    city: "Jakarta",
    address: "Jl. Sudirman No. 45, Kebayoran Baru",
    joinDate: "2025-01-10",
    loyalty: "Platinum",
    totalSpent: 128500000,
    loyaltyPoints: 1285,
    status: "Active",
    avatar: "",
    lastLogin: "2026-06-14 08:30",
    viewedProducts: ["Oslo Walnut Sofa", "Mika Dining Table", "Nara Lounge Chair"],
    favoriteProducts: ["Oslo Walnut Sofa", "Teak Wood Buffet"],
    lastCart: ["Nara Lounge Chair", "Lumi Table Lamp"]
  },
  {
    id: 2,
    name: "Siti Rahmawati",
    email: "siti.rahma@yahoo.com",
    phone: "085612345678",
    city: "Bandung",
    address: "Jl. Dago No. 102, Coblong",
    joinDate: "2025-02-15",
    loyalty: "Gold",
    totalSpent: 94200000,
    loyaltyPoints: 942,
    status: "Active",
    avatar: "",
    lastLogin: "2026-06-13 19:15",
    viewedProducts: ["Japandi Bed Frame", "Mika Dining Table"],
    favoriteProducts: ["Japandi Bed Frame"],
    lastCart: []
  },
  {
    id: 3,
    name: "Budi Santoso",
    email: "budi_s@hotmail.com",
    phone: "081976543210",
    city: "Surabaya",
    address: "Jl. Dharmahusada No. 18, Gubeng",
    joinDate: "2025-03-05",
    loyalty: "Gold",
    totalSpent: 87800000,
    loyaltyPoints: 878,
    status: "Active",
    avatar: "",
    lastLogin: "2026-06-14 09:10",
    viewedProducts: ["Teak Wood Wardrobe", "Mika Dining Table", "Oslo Walnut Sofa"],
    favoriteProducts: ["Teak Wood Wardrobe", "Mika Dining Table"],
    lastCart: ["Mika Dining Table"]
  },
  {
    id: 4,
    name: "Dewi Lestari",
    email: "dewi.les@gmail.com",
    phone: "082134567890",
    city: "Yogyakarta",
    address: "Jl. Malioboro No. 64, Danurejan",
    joinDate: "2025-04-12",
    loyalty: "Silver",
    totalSpent: 64300000,
    loyaltyPoints: 643,
    status: "Active",
    avatar: "",
    lastLogin: "2026-06-12 14:22",
    viewedProducts: ["Scandinavian Lounge Chair", "Lumi Table Lamp"],
    favoriteProducts: ["Scandinavian Lounge Chair"],
    lastCart: []
  },
  {
    id: 5,
    name: "Andi Wijaya",
    email: "andiw@outlook.com",
    phone: "087812348765",
    city: "Semarang",
    address: "Jl. Pemuda No. 88, Semarang Tengah",
    joinDate: "2025-05-18",
    loyalty: "Silver",
    totalSpent: 58900000,
    loyaltyPoints: 589,
    status: "Active",
    avatar: "",
    lastLogin: "2026-06-14 07:45",
    viewedProducts: ["Sofa Bed Jati", "Oslo Walnut Sofa"],
    favoriteProducts: ["Sofa Bed Jati"],
    lastCart: []
  },
  {
    id: 6,
    name: "Clarissa Wulandari",
    email: "clarissa.w@gmail.com",
    phone: "081123456789",
    city: "Jakarta",
    address: "Pondok Indah Townhouse B-12, Kebayoran Lama",
    joinDate: "2025-06-01",
    loyalty: "VIP",
    totalSpent: 320000000,
    loyaltyPoints: 3200,
    status: "Active",
    avatar: "",
    lastLogin: "2026-06-14 10:05",
    viewedProducts: ["Marble Kitchen Set", "Oslo Walnut Sofa", "Teak Wood Buffet"],
    favoriteProducts: ["Marble Kitchen Set", "Teak Wood Buffet"],
    lastCart: []
  }
];

const initialTransactions = [
  {
    id: "TRX-001",
    customerId: 1,
    customerName: "Ahmad Reza",
    products: [
      { name: "Oslo Walnut Sofa", qty: 1, price: 18500000 },
      { name: "Nara Lounge Chair", qty: 2, price: 5000000 }
    ],
    totalAmount: 28500000,
    shippingCost: 350000,
    paymentMethod: "Bank Transfer",
    status: "Completed",
    date: "2026-06-10"
  },
  {
    id: "TRX-002",
    customerId: 2,
    customerName: "Siti Rahmawati",
    products: [
      { name: "Japandi Bed Frame", qty: 1, price: 12000000 },
      { name: "Teak Wood Buffet", qty: 1, price: 8500000 }
    ],
    totalAmount: 20500000,
    shippingCost: 250000,
    paymentMethod: "Credit Card",
    status: "Shipping",
    date: "2026-06-12"
  },
  {
    id: "TRX-003",
    customerId: 3,
    customerName: "Budi Santoso",
    products: [
      { name: "Mika Dining Table", qty: 1, price: 15500000 },
      { name: "Dining Chair Oak", qty: 6, price: 1500000 }
    ],
    totalAmount: 24500000,
    shippingCost: 400000,
    paymentMethod: "Gopay",
    status: "Processing",
    date: "2026-06-13"
  },
  {
    id: "TRX-004",
    customerId: 6,
    customerName: "Clarissa Wulandari",
    products: [
      { name: "Marble Kitchen Set Custom", qty: 1, price: 185000000 },
      { name: "Bar Stool Metal", qty: 4, price: 2500000 }
    ],
    totalAmount: 195000000,
    shippingCost: 2500000,
    paymentMethod: "Bank Transfer",
    status: "Pending",
    date: "2026-06-14"
  }
];

const initialTickets = [
  {
    id: "TCK-101",
    customerId: 1,
    customerName: "Ahmad Reza",
    category: "Keluhan Produk",
    subject: "Kulit sofa Oslo tergores tipis di bagian belakang",
    status: "Resolved",
    date: "2026-06-11"
  },
  {
    id: "TCK-102",
    customerId: 3,
    customerName: "Budi Santoso",
    category: "Pengiriman",
    subject: "Keterlambatan pengiriman kursi makan oak",
    status: "In Progress",
    date: "2026-06-13"
  },
  {
    id: "TCK-103",
    customerId: 4,
    customerName: "Dewi Lestari",
    category: "Garansi",
    subject: "Klaim garansi engsel pintu lemari macet",
    status: "Open",
    date: "2026-06-14"
  }
];

const initialConsultations = [
  {
    id: "CNS-201",
    customerId: 6,
    customerName: "Clarissa Wulandari",
    roomType: "Living Room",
    roomArea: 48,
    budget: 120000000,
    designPreference: "Japandi",
    date: "2026-06-14"
  },
  {
    id: "CNS-202",
    customerId: 2,
    customerName: "Siti Rahmawati",
    roomType: "Bed Room",
    roomArea: 24,
    budget: 45000000,
    designPreference: "Scandinavian",
    date: "2026-06-12"
  },
  {
    id: "CNS-203",
    customerId: 5,
    customerName: "Andi Wijaya",
    roomType: "Dining Room",
    roomArea: 32,
    budget: 65000000,
    designPreference: "Industrial",
    date: "2026-06-10"
  }
];

const initialPromotions = [
  {
    id: "PRM-301",
    name: "Diskon Lebaran Luxury Sofa",
    type: "Diskon Produk",
    code: "LEBARANSOFA",
    value: 1500000,
    status: "Aktif",
    uses: 42
  },
  {
    id: "PRM-302",
    name: "VIP Exclusive Furniture 15%",
    type: "Promo Membership",
    code: "VIP15OFF",
    value: 15, // in percent
    status: "Aktif",
    uses: 18
  },
  {
    id: "PRM-303",
    name: "Flash Sale Jati Meja Makan",
    type: "Flash Sale",
    code: "FLASHJATI",
    value: 3000000,
    status: "Selesai",
    uses: 10
  },
  {
    id: "PRM-304",
    name: "Interior Consultation Voucher",
    type: "Voucher",
    code: "FREEINTERIOR",
    value: 100, // free
    status: "Aktif",
    uses: 29
  }
];

const initialNotifications = [
  {
    id: 1,
    title: "Order Baru Masuk",
    description: "Clarissa Wulandari memesan Custom Marble Kitchen Set senilai Rp 195.000.000",
    type: "Order Baru",
    time: "10m ago",
    isRead: false
  },
  {
    id: 2,
    title: "Permintaan Konsultasi Baru",
    description: "Clarissa Wulandari mengajukan konsultasi interior ruang keluarga (Japandi)",
    type: "Ticket Baru",
    time: "15m ago",
    isRead: false
  },
  {
    id: 3,
    title: "Upgrade Membership Otomatis",
    description: "Siti Rahmawati ter-upgrade ke level Gold karena akumulasi belanja",
    type: "Membership Upgrade",
    time: "2h ago",
    isRead: true
  },
  {
    id: 4,
    title: "Promo Berakhir Hari Ini",
    description: "Promo Flash Sale Jati Meja Makan akan berakhir pada pukul 23:59 WIB",
    type: "Promo Berakhir",
    time: "4h ago",
    isRead: true
  }
];

const initialActivities = [
  { id: 1, title: "Order Baru Dibuat", desc: "Clarissa Wulandari membeli 1x Custom Marble Kitchen Set", time: "09:45 WIB", type: "purchase" },
  { id: 2, title: "Konsultasi Interior Dijadwalkan", desc: "Clarissa Wulandari mengajukan desain ruang keluarga (Japandi)", time: "09:30 WIB", type: "consultation" },
  { id: 3, title: "Membership Upgrade ke VIP", desc: "Clarissa Wulandari di-upgrade ke VIP Tier", time: "09:15 WIB", type: "membership" },
  { id: 4, title: "Customer Baru Mendaftar", desc: "Clarissa Wulandari bergabung dengan sistem CRM", time: "09:00 WIB", type: "purchase" },
  { id: 5, title: "Promo Baru Dibuat", desc: "Voucher 'LEBARANSOFA' dirilis untuk umum", time: "Yesterday", type: "promo" }
];

const initialCustomProjects = [
  {
    id: "PRJ-501",
    customerId: 6,
    customerName: "Clarissa Wulandari",
    projectName: "Custom Walk-in Closet Walnut",
    budget: 85000000,
    woodType: "Walnut Wood",
    finishType: "Matte Polyurethane",
    status: "Production", // Concept, Material Selection, Production, Quality Control, Delivered
    startDate: "2026-06-01",
    targetDate: "2026-07-15"
  },
  {
    id: "PRJ-502",
    customerId: 1,
    customerName: "Ahmad Reza",
    projectName: "Teak Dining Table 10 Seater",
    budget: 45000000,
    woodType: "Teak Wood",
    finishType: "Natural Oil finish",
    status: "Material Selection",
    startDate: "2026-06-10",
    targetDate: "2026-07-20"
  },
  {
    id: "PRJ-503",
    customerId: 3,
    customerName: "Budi Santoso",
    projectName: "Minimalist Floating Credenza Oak",
    budget: 18000000,
    woodType: "Oak Wood",
    finishType: "Satin Lacquer",
    status: "Concept",
    startDate: "2026-06-12",
    targetDate: "2026-06-30"
  }
];

export const CRMProvider = ({ children }) => {
  const [customers, setCustomers] = useState(() => {
    const local = localStorage.getItem("crm_customers");
    return local ? JSON.parse(local) : initialCustomers;
  });

  const [transactions, setTransactions] = useState(() => {
    const local = localStorage.getItem("crm_transactions");
    return local ? JSON.parse(local) : initialTransactions;
  });

  const [tickets, setTickets] = useState(() => {
    const local = localStorage.getItem("crm_tickets");
    return local ? JSON.parse(local) : initialTickets;
  });

  const [consultations, setConsultations] = useState(() => {
    const local = localStorage.getItem("crm_consultations");
    return local ? JSON.parse(local) : initialConsultations;
  });

  const [promotions, setPromotions] = useState(() => {
    const local = localStorage.getItem("crm_promotions");
    return local ? JSON.parse(local) : initialPromotions;
  });

  const [notifications, setNotifications] = useState(() => {
    const local = localStorage.getItem("crm_notifications");
    return local ? JSON.parse(local) : initialNotifications;
  });

  const [activities, setActivities] = useState(() => {
    const local = localStorage.getItem("crm_activities");
    return local ? JSON.parse(local) : initialActivities;
  });

  const [customProjects, setCustomProjects] = useState(() => {
    const local = localStorage.getItem("crm_custom_projects");
    return local ? JSON.parse(local) : initialCustomProjects;
  });

  const isInitialMount = useRef(true);

  // Sync to local storage
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    localStorage.setItem("crm_customers", JSON.stringify(customers));
    localStorage.setItem("crm_transactions", JSON.stringify(transactions));
    localStorage.setItem("crm_tickets", JSON.stringify(tickets));
    localStorage.setItem("crm_consultations", JSON.stringify(consultations));
    localStorage.setItem("crm_promotions", JSON.stringify(promotions));
    localStorage.setItem("crm_notifications", JSON.stringify(notifications));
    localStorage.setItem("crm_activities", JSON.stringify(activities));
    localStorage.setItem("crm_custom_projects", JSON.stringify(customProjects));
  }, [customers, transactions, tickets, consultations, promotions, notifications, activities, customProjects]);

  // Activity logger helper
  const logActivity = (title, desc, type) => {
    const newAct = {
      id: Date.now(),
      title,
      desc,
      time: getTodayTimeString(),
      type
    };
    setActivities(prev => [newAct, ...prev]);
  };

  // Notification logger helper
  const logNotification = (title, description, type) => {
    const newNotif = {
      id: Date.now(),
      title,
      description,
      type,
      time: "Just now",
      isRead: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // Core functions
  const addCustomer = (customer) => {
    const newId = customers.length > 0 ? Math.max(...customers.map(c => c.id)) + 1 : 1;
    const finalCust = {
      ...customer,
      id: newId,
      joinDate: customer.joinDate || getTodayString(),
      totalSpent: customer.totalSpent || 0,
      loyaltyPoints: customer.loyaltyPoints || 0,
      status: customer.status || "Active",
      lastLogin: getTodayString() + " 10:00",
      viewedProducts: ["Oslo Walnut Sofa"],
      favoriteProducts: [],
      lastCart: []
    };
    setCustomers(prev => [...prev, finalCust]);
    logActivity("Customer Baru Mendaftar", `${finalCust.name} bergabung dengan sistem CRM`, "purchase");
    logNotification("Customer Baru Mendaftar", `${finalCust.name} mendaftar sebagai customer baru`, "Customer Baru");
    return finalCust;
  };

  const updateCustomer = (updatedCust) => {
    // Evaluate loyalty level based on new totalSpent
    let calculatedLoyalty = updatedCust.loyalty;
    const spent = updatedCust.totalSpent || 0;
    if (spent >= 300000000) calculatedLoyalty = "VIP";
    else if (spent >= 120000000) calculatedLoyalty = "Platinum";
    else if (spent >= 50000000) calculatedLoyalty = "Gold";
    else if (spent >= 15000000) calculatedLoyalty = "Silver";
    else calculatedLoyalty = "Bronze";

    const oldCust = customers.find(c => c.id === updatedCust.id);
    const finalCust = {
      ...updatedCust,
      loyalty: calculatedLoyalty,
      loyaltyPoints: Math.floor(spent / 100000)
    };

    setCustomers(prev => prev.map(c => c.id === updatedCust.id ? finalCust : c));

    if (oldCust && oldCust.loyalty !== calculatedLoyalty) {
      logActivity("Membership Upgrade", `${finalCust.name} di-upgrade ke level ${calculatedLoyalty}`, "membership");
      logNotification("Upgrade Membership Otomatis", `${finalCust.name} naik ke level ${calculatedLoyalty}`, "Membership Upgrade");
    }
  };

  const deleteCustomer = (id) => {
    const custName = customers.find(c => c.id === id)?.name || "Pelanggan";
    setCustomers(prev => prev.filter(c => c.id !== id));
    logActivity("Customer Dihapus", `${custName} dihapus dari database CRM`, "purchase");
  };

  const addTransaction = (trx) => {
    const prefix = "TRX-";
    const nextNum = transactions.length > 0 
      ? Math.max(...transactions.map(t => {
          const num = parseInt(t.id.split("-")[1]);
          return isNaN(num) ? 0 : num;
        })) + 1 
      : 101;
    
    const finalTrx = {
      ...trx,
      id: `${prefix}${String(nextNum).padStart(3, "0")}`,
      date: trx.date || getTodayString(),
      status: trx.status || "Pending"
    };

    setTransactions(prev => [finalTrx, ...prev]);

    // Update customer stats
    setCustomers(prev => prev.map(c => {
      if (c.id === Number(trx.customerId)) {
        const newSpent = c.totalSpent + trx.totalAmount;
        const newPoints = c.loyaltyPoints + Math.floor(trx.totalAmount / 100000);
        
        let calculatedLoyalty = c.loyalty;
        if (newSpent >= 300000000) calculatedLoyalty = "VIP";
        else if (newSpent >= 120000000) calculatedLoyalty = "Platinum";
        else if (newSpent >= 50000000) calculatedLoyalty = "Gold";
        else if (newSpent >= 15000000) calculatedLoyalty = "Silver";
        else calculatedLoyalty = "Bronze";

        if (c.loyalty !== calculatedLoyalty) {
          setTimeout(() => {
            logActivity("Membership Upgrade", `${c.name} di-upgrade ke level ${calculatedLoyalty}`, "membership");
            logNotification("Upgrade Membership Otomatis", `${c.name} naik ke level ${calculatedLoyalty}`, "Membership Upgrade");
          }, 100);
        }

        return {
          ...c,
          totalSpent: newSpent,
          loyaltyPoints: newPoints,
          loyalty: calculatedLoyalty
        };
      }
      return c;
    }));

    logActivity("Order Baru Dibuat", `${trx.customerName} membeli ${trx.products.map(p => `${p.qty}x ${p.name}`).join(", ")}`, "purchase");
    logNotification("Order Baru Masuk", `${trx.customerName} memesan barang senilai Rp ${trx.totalAmount.toLocaleString("id-ID")}`, "Order Baru");
    return finalTrx;
  };

  const updateTransactionStatus = (id, newStatus) => {
    setTransactions(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
    const trx = transactions.find(t => t.id === id);
    if (trx) {
      logActivity("Status Order Diperbarui", `Order ${id} milik ${trx.customerName} kini: ${newStatus}`, "purchase");
    }
  };

  const addTicket = (ticket) => {
    const nextNum = tickets.length > 0
      ? Math.max(...tickets.map(t => parseInt(t.id.split("-")[1]))) + 1
      : 104;
    
    const finalTicket = {
      ...ticket,
      id: `TCK-${nextNum}`,
      status: ticket.status || "Open",
      date: ticket.date || getTodayString()
    };

    setTickets(prev => [finalTicket, ...prev]);
    logActivity("Ticket CS Baru", `${ticket.customerName} mengajukan tiket ${ticket.category}`, "complaint");
    logNotification("Ticket Baru", `${ticket.customerName} membuka tiket: ${ticket.subject}`, "Ticket Baru");
    return finalTicket;
  };

  const updateTicketStatus = (id, newStatus) => {
    setTickets(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
    const ticket = tickets.find(t => t.id === id);
    if (ticket) {
      logActivity("Status Ticket Diperbarui", `Tiket ${id} milik ${ticket.customerName} kini: ${newStatus}`, "complaint");
    }
  };

  const updateTicket = (updatedTicket) => {
    setTickets(prev => prev.map(t => t.id === updatedTicket.id ? updatedTicket : t));
  };

  const addConsultation = (cons) => {
    const nextNum = consultations.length > 0
      ? Math.max(...consultations.map(c => parseInt(c.id.split("-")[1]))) + 1
      : 204;
    
    const finalCons = {
      ...cons,
      id: `CNS-${nextNum}`,
      date: cons.date || getTodayString()
    };

    setConsultations(prev => [finalCons, ...prev]);
    logActivity("Konsultasi Interior Dijadwalkan", `${cons.customerName} menjadwalkan desain ${cons.roomType} (${cons.designPreference})`, "consultation");
    return finalCons;
  };

  const addPromotion = (promo) => {
    const nextNum = promotions.length > 0
      ? Math.max(...promotions.map(p => parseInt(p.id.split("-")[1]))) + 1
      : 305;
    
    const finalPromo = {
      ...promo,
      id: `PRM-${nextNum}`,
      status: promo.status || "Aktif",
      uses: 0
    };

    setPromotions(prev => [finalPromo, ...prev]);
    logActivity("Promo Baru Dibuat", `Voucher '${promo.code}' dirilis untuk ${promo.name}`, "promo");
    return finalPromo;
  };

  const updatePromotionStatus = (id, newStatus) => {
    setPromotions(prev => prev.map(p => p.id === id ? { ...p, status: newStatus } : p));
  };

  const markNotificationAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const addCustomProject = (proj) => {
    const numId = customProjects.length > 0 
      ? Math.max(...customProjects.map(p => {
          const match = String(p.id).match(/\d+/);
          return match ? Number(match[0]) : 500;
        })) + 1 
      : 501;
    const finalProj = {
      ...proj,
      id: `PRJ-${numId}`,
      startDate: proj.startDate || getTodayString(),
      status: proj.status || "Concept"
    };
    setCustomProjects(prev => [...prev, finalProj]);
    logActivity("Proyek Kustom Baru", `Proyek '${finalProj.projectName}' dibuat untuk ${finalProj.customerName}`, "consultation");
    logNotification("Proyek Kustom Baru", `Proyek '${finalProj.projectName}' telah didaftarkan dalam sistem`, "Ticket Baru");
    return finalProj;
  };

  const updateCustomProject = (updatedProj) => {
    setCustomProjects(prev => prev.map(p => p.id === updatedProj.id ? updatedProj : p));
    logActivity("Proyek Kustom Diperbarui", `Proyek '${updatedProj.projectName}' diperbarui ke status ${updatedProj.status}`, "consultation");
  };

  return (
    <CRMContext.Provider
      value={{
        customers,
        transactions,
        tickets,
        consultations,
        promotions,
        notifications,
        activities,
        customProjects,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        addTransaction,
        updateTransactionStatus,
        addTicket,
        updateTicketStatus,
        updateTicket,
        addConsultation,
        addPromotion,
        updatePromotionStatus,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        clearNotifications,
        logActivity,
        logNotification,
        addCustomProject,
        updateCustomProject
      }}
    >
      {children}
    </CRMContext.Provider>
  );
};
