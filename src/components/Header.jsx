import { useState, useContext, useRef, useEffect, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { CRMContext } from "../context/CRMContext";
import { FiSearch, FiBell, FiPlus, FiUser, FiSettings, FiLogOut, FiCheck, FiX, FiInfo } from "react-icons/fi";
import Modal from "./ui/Modal";

const C = {
  primary: "#79553D",
  primaryLight: "#A67C52",
  border: "#E8E2DD",
  textDark: "#2B2420",
  textMuted: "#8A817A",
  bg: "#FAFAF8",
};

export default function Header() {
  const {
    customers,
    transactions,
    promotions,
    notifications,
    addCustomer,
    addTransaction,
    addConsultation,
    addPromotion,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    clearNotifications
  } = useContext(CRMContext);

  const navigate = useNavigate();

  const user = useMemo(() => {
    try {
      const localUser = localStorage.getItem("user");
      return localUser ? JSON.parse(localUser) : null;
    } catch (e) {
      return null;
    }
  }, []);

  const fullName = user?.user_metadata?.full_name || user?.email || "Admin User";
  const userRole = user?.user_metadata?.role || "Store Manager";
  const userInitials = useMemo(() => {
    return fullName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  }, [fullName]);

  // Dropdown states
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);

  // Modals
  const [activeModal, setActiveModal] = useState(null); // 'customer' | 'order' | 'consultation' | 'promotion'

  // Refs for clicking outside
  const quickActionsRef = useRef(null);
  const notificationsRef = useRef(null);
  const profileRef = useRef(null);
  const searchRef = useRef(null);

  // Form states
  const [customerForm, setCustomerForm] = useState({
    name: "", email: "", phone: "", city: "", address: "", loyalty: "Bronze"
  });

  const [orderForm, setOrderForm] = useState({
    customerId: "",
    productName: "Oslo Walnut Sofa",
    qty: 1,
    price: 18500000,
    shippingCost: 250000,
    paymentMethod: "Bank Transfer"
  });

  const [consultForm, setConsultForm] = useState({
    customerId: "",
    roomType: "Living Room",
    roomArea: 30,
    budget: 50000000,
    designPreference: "Minimalis"
  });

  const [promoForm, setPromoForm] = useState({
    name: "",
    type: "Diskon Produk",
    code: "",
    value: 1000000,
    status: "Aktif"
  });

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (quickActionsRef.current && !quickActionsRef.current.contains(event.target)) {
        setShowQuickActions(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfile(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  // Search Results filter
  const searchResults = searchQuery.trim() ? (() => {
    const query = searchQuery.toLowerCase();
    const matchedCustomers = customers.filter(c => 
      c.name.toLowerCase().includes(query) || c.email.toLowerCase().includes(query)
    ).slice(0, 3);
    
    const matchedOrders = transactions.filter(t => 
      t.id.toLowerCase().includes(query) || t.customerName.toLowerCase().includes(query)
    ).slice(0, 3);

    return {
      customers: matchedCustomers,
      orders: matchedOrders
    };
  })() : null;

  // Form submit handlers
  const handleAddCustomerSubmit = (e) => {
    e.preventDefault();
    const newCust = addCustomer(customerForm);
    setCustomerForm({ name: "", email: "", phone: "", city: "", address: "", loyalty: "Bronze" });
    setActiveModal(null);
    navigate(`/customers/${newCust.id}`);
  };

  const handleAddOrderSubmit = (e) => {
    e.preventDefault();
    const selectedCust = customers.find(c => c.id === Number(orderForm.customerId));
    if (!selectedCust) return alert("Pilih customer terlebih dahulu");

    const totalAmount = (orderForm.price * orderForm.qty);
    const trxData = {
      customerId: selectedCust.id,
      customerName: selectedCust.name,
      products: [{ name: orderForm.productName, qty: Number(orderForm.qty), price: Number(orderForm.price) }],
      totalAmount: totalAmount,
      shippingCost: Number(orderForm.shippingCost),
      paymentMethod: orderForm.paymentMethod,
      status: "Pending",
      date: new Date().toISOString().split("T")[0]
    };

    const newTrx = addTransaction(trxData);
    setOrderForm({ customerId: "", productName: "Oslo Walnut Sofa", qty: 1, price: 18500000, shippingCost: 250000, paymentMethod: "Bank Transfer" });
    setActiveModal(null);
    navigate(`/purchase-history/${newTrx.id}`);
  };

  const handleAddConsultationSubmit = (e) => {
    e.preventDefault();
    const selectedCust = customers.find(c => c.id === Number(consultForm.customerId));
    if (!selectedCust) return alert("Pilih customer terlebih dahulu");

    const consData = {
      customerId: selectedCust.id,
      customerName: selectedCust.name,
      roomType: consultForm.roomType,
      roomArea: Number(consultForm.roomArea),
      budget: Number(consultForm.budget),
      designPreference: consultForm.designPreference,
      date: new Date().toISOString().split("T")[0]
    };

    addConsultation(consData);
    setConsultForm({ customerId: "", roomType: "Living Room", roomArea: 30, budget: 50000000, designPreference: "Minimalis" });
    setActiveModal(null);
    navigate(`/product-consultation`);
  };

  const handleAddPromotionSubmit = (e) => {
    e.preventDefault();
    addPromotion(promoForm);
    setPromoForm({ name: "", type: "Diskon Produk", code: "", value: 1000000, status: "Aktif" });
    setActiveModal(null);
    navigate(`/promotions`);
  };

  const unreadNotifsCount = notifications.filter(n => !n.isRead).length;

  return (
    <header className="flex items-center justify-between px-6 bg-white border-b border-[#E8E2DD] h-20 relative z-30 font-sans">
      
      {/* 1. LEFT - GREETING */}
      <div className="flex flex-col text-left">
        <h1 className="text-base font-bold text-[#2B2420] flex items-center gap-1.5 leading-tight">
          Good Morning 👋
        </h1>
        <p className="text-xs font-semibold text-[#79553D] mt-0.5">FurniCraft CRM System</p>
        <p className="text-[10px] text-[#8A817A] hidden md:block">Manage your furniture business efficiently</p>
      </div>

      {/* 2. MIDDLE - GLOBAL SEARCH */}
      <div ref={searchRef} className="relative flex-1 max-w-md mx-6">
        <div className="relative">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A817A] w-4 h-4 pointer-events-none" />
          <input
            type="text"
            placeholder="Search customers, orders, products..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSearchResults(true);
            }}
            onFocus={() => setShowSearchResults(true)}
            className="w-full h-10 pl-10 pr-4 rounded-xl bg-[#FAFAF8] border border-[#E8E2DD] text-xs font-medium text-[#2B2420] outline-none transition-all duration-200 focus:bg-white focus:border-[#79553D] focus:ring-1 focus:ring-[#79553D]"
          />
        </div>

        {/* Search results dropdown */}
        {showSearchResults && searchResults && (
          <div className="absolute top-11 left-0 w-full bg-white border border-[#E8E2DD] rounded-xl shadow-lg overflow-hidden py-2 text-left">
            {searchResults.customers.length === 0 && searchResults.orders.length === 0 ? (
              <p className="text-xs text-[#8A817A] p-3 text-center">No results found for "{searchQuery}"</p>
            ) : (
              <>
                {searchResults.customers.length > 0 && (
                  <div>
                    <p className="text-[10px] font-bold text-[#8A817A] uppercase tracking-wider px-3.5 py-1.5 bg-[#FAFAF8]">
                      Customers
                    </p>
                    {searchResults.customers.map(c => (
                      <button
                        key={c.id}
                        onClick={() => {
                          navigate(`/customers/${c.id}`);
                          setShowSearchResults(false);
                          setSearchQuery("");
                        }}
                        className="w-full px-3.5 py-2 hover:bg-[#FAF6F3] text-left flex flex-col cursor-pointer border-none bg-transparent"
                      >
                        <span className="text-xs font-semibold text-[#2B2420]">{c.name}</span>
                        <span className="text-[10px] text-[#8A817A]">{c.email} • {c.loyalty}</span>
                      </button>
                    ))}
                  </div>
                )}
                {searchResults.orders.length > 0 && (
                  <div className="border-t border-[#E8E2DD]/50 mt-1">
                    <p className="text-[10px] font-bold text-[#8A817A] uppercase tracking-wider px-3.5 py-1.5 bg-[#FAFAF8]">
                      Orders
                    </p>
                    {searchResults.orders.map(o => (
                      <button
                        key={o.id}
                        onClick={() => {
                          navigate(`/purchase-history/${o.id}`);
                          setShowSearchResults(false);
                          setSearchQuery("");
                        }}
                        className="w-full px-3.5 py-2 hover:bg-[#FAF6F3] text-left flex flex-col cursor-pointer border-none bg-transparent"
                      >
                        <span className="text-xs font-semibold text-[#2B2420]">{o.id} - {o.customerName}</span>
                        <span className="text-[10px] text-[#8A817A]">{o.products[0]?.name} • Rp {o.totalAmount.toLocaleString("id-ID")}</span>
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* 3. RIGHT - ACTIONS */}
      <div className="flex items-center gap-3.5">
        
        {/* Quick Actions Button */}
        <div ref={quickActionsRef} className="relative">
          <button
            onClick={() => setShowQuickActions(!showQuickActions)}
            className="flex items-center gap-1.5 bg-[#79553D] hover:bg-[#634430] text-white px-3.5 py-2 rounded-lg text-xs font-bold transition-all duration-150 cursor-pointer border-none"
          >
            <FiPlus /> <span className="hidden sm:inline">Quick Action</span>
          </button>

          {showQuickActions && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-[#E8E2DD] rounded-xl shadow-lg py-1.5 text-left">
              <button
                onClick={() => { setActiveModal("customer"); setShowQuickActions(false); }}
                className="w-full px-4 py-2 text-xs font-semibold text-[#2B2420] hover:bg-[#FAF6F3] text-left border-none bg-transparent cursor-pointer"
              >
                + New Customer
              </button>
              <button
                onClick={() => { setActiveModal("order"); setShowQuickActions(false); }}
                className="w-full px-4 py-2 text-xs font-semibold text-[#2B2420] hover:bg-[#FAF6F3] text-left border-none bg-transparent cursor-pointer"
              >
                + New Order
              </button>
              <button
                onClick={() => { setActiveModal("consultation"); setShowQuickActions(false); }}
                className="w-full px-4 py-2 text-xs font-semibold text-[#2B2420] hover:bg-[#FAF6F3] text-left border-none bg-transparent cursor-pointer"
              >
                + New Consultation
              </button>
              <button
                onClick={() => { setActiveModal("promotion"); setShowQuickActions(false); }}
                className="w-full px-4 py-2 text-xs font-semibold text-[#2B2420] hover:bg-[#FAF6F3] text-left border-none bg-transparent cursor-pointer"
              >
                + New Promotion
              </button>
            </div>
          )}
        </div>

        {/* Notifications Popover */}
        <div ref={notificationsRef} className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-9 h-9 flex items-center justify-center rounded-lg border border-[#E8E2DD] text-[#8A817A] hover:text-[#2B2420] hover:bg-[#FAFAF8] relative transition-colors cursor-pointer bg-white"
          >
            <FiBell className="w-4 h-4" />
            {unreadNotifsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4.5 h-4.5 bg-[#B85C5C] text-white text-[9px] font-bold rounded-full flex items-center justify-center animate-pulse">
                {unreadNotifsCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-[#E8E2DD] rounded-xl shadow-lg overflow-hidden text-left">
              <div className="p-3 bg-[#FAF6F3] border-b border-[#E8E2DD] flex justify-between items-center">
                <span className="text-xs font-bold text-[#2B2420]">Notifications</span>
                <div className="flex gap-2">
                  <button
                    onClick={markAllNotificationsAsRead}
                    className="text-[10px] font-bold text-[#79553D] hover:underline bg-transparent border-none cursor-pointer"
                  >
                    Mark read
                  </button>
                  <button
                    onClick={clearNotifications}
                    className="text-[10px] font-bold text-[#8A817A] hover:underline bg-transparent border-none cursor-pointer"
                  >
                    Clear
                  </button>
                </div>
              </div>
              <div className="max-h-64 overflow-y-auto divide-y divide-[#E8E2DD]/40">
                {notifications.length === 0 ? (
                  <p className="text-xs text-[#8A817A] py-8 text-center">No notifications yet</p>
                ) : (
                  notifications.map(n => (
                    <div
                      key={n.id}
                      onClick={() => {
                        markNotificationAsRead(n.id);
                        setShowNotifications(false);
                        navigate("/notifications");
                      }}
                      className={`p-3 transition-colors cursor-pointer ${n.isRead ? "bg-white" : "bg-[#FAF6F3]/40"}`}
                    >
                      <div className="flex justify-between items-start gap-1">
                        <p className={`text-xs font-semibold ${n.isRead ? "text-[#2B2420]" : "text-[#79553D]"}`}>{n.title}</p>
                        <span className="text-[9px] text-[#8A817A] whitespace-nowrap">{n.time}</span>
                      </div>
                      <p className="text-[11px] text-[#8A817A] mt-0.5 leading-normal">{n.description}</p>
                    </div>
                  ))
                )}
              </div>
              <div className="p-2 border-t border-[#E8E2DD] text-center bg-[#FAFAF8]">
                <Link
                  to="/notifications"
                  onClick={() => setShowNotifications(false)}
                  className="text-xs font-bold text-[#79553D] hover:underline no-underline"
                >
                  View All Notifications
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div ref={profileRef} className="relative flex items-center">
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-2.5 p-1 rounded-lg hover:bg-[#FAFAF8] transition-colors cursor-pointer border-none bg-transparent text-left"
          >
            <div className="w-8 h-8 rounded-full bg-[#79553D] text-white flex items-center justify-center font-bold text-xs">
              {userInitials}
            </div>
            <div className="hidden lg:flex flex-col text-left">
              <span className="text-xs font-bold text-[#2B2420] leading-none">{fullName}</span>
              <span className="text-[9px] text-[#8A817A] mt-0.5">{userRole}</span>
            </div>
          </button>

          {showProfile && (
            <div className="absolute right-0 top-10 mt-1 w-44 bg-white border border-[#E8E2DD] rounded-xl shadow-lg py-1.5 text-left">
              <div className="px-4 py-2 border-b border-[#E8E2DD]/50 lg:hidden">
                <p className="text-xs font-bold text-[#2B2420]">{fullName}</p>
                <p className="text-[9px] text-[#8A817A]">{userRole}</p>
              </div>
              <button
                onClick={() => { setShowProfile(false); navigate("/customers/1"); }}
                className="w-full px-4 py-2 text-xs font-semibold text-[#2B2420] hover:bg-[#FAF6F3] text-left border-none bg-transparent cursor-pointer flex items-center gap-2"
              >
                <FiUser /> My Profile
              </button>
              <button
                onClick={() => { setShowProfile(false); navigate("/memberships"); }}
                className="w-full px-4 py-2 text-xs font-semibold text-[#2B2420] hover:bg-[#FAF6F3] text-left border-none bg-transparent cursor-pointer flex items-center gap-2"
              >
                <FiSettings /> Settings
              </button>
              <button
                onClick={handleLogout}
                className="w-full px-4 py-2 text-xs font-bold text-[#B85C5C] hover:bg-[#F2E6E6] text-left border-none bg-transparent cursor-pointer flex items-center gap-2 border-t border-[#E8E2DD]/50 mt-1 pt-2"
              >
                <FiLogOut /> Logout
              </button>
            </div>
          )}
        </div>

      </div>

      {/* ====================================
          QUICK ACTION MODALS
          ==================================== */}
      
      {/* 1. Modal Add Customer */}
      <Modal
        isOpen={activeModal === "customer"}
        onClose={() => setActiveModal(null)}
        title="Add New Customer"
      >
        <form onSubmit={handleAddCustomerSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8A817A] mb-1">Nama Lengkap</label>
            <input
              type="text" required
              placeholder="e.g. John Doe"
              value={customerForm.name}
              onChange={(e) => setCustomerForm(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3.5 py-2 border border-[#E8E2DD] rounded-lg text-xs text-[#2B2420] outline-none focus:border-[#79553D]"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8A817A] mb-1">Email</label>
              <input
                type="email" required
                placeholder="john@example.com"
                value={customerForm.email}
                onChange={(e) => setCustomerForm(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-3.5 py-2 border border-[#E8E2DD] rounded-lg text-xs text-[#2B2420] outline-none focus:border-[#79553D]"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8A817A] mb-1">No. Telepon</label>
              <input
                type="text" required
                placeholder="0812xxxxxxxx"
                value={customerForm.phone}
                onChange={(e) => setCustomerForm(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full px-3.5 py-2 border border-[#E8E2DD] rounded-lg text-xs text-[#2B2420] outline-none focus:border-[#79553D]"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8A817A] mb-1">Kota</label>
              <input
                type="text" required
                placeholder="Jakarta"
                value={customerForm.city}
                onChange={(e) => setCustomerForm(prev => ({ ...prev, city: e.target.value }))}
                className="w-full px-3.5 py-2 border border-[#E8E2DD] rounded-lg text-xs text-[#2B2420] outline-none focus:border-[#79553D]"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8A817A] mb-1">Membership</label>
              <select
                value={customerForm.loyalty}
                onChange={(e) => setCustomerForm(prev => ({ ...prev, loyalty: e.target.value }))}
                className="w-full px-3.5 py-2 border border-[#E8E2DD] rounded-lg text-xs bg-white text-[#2B2420] outline-none focus:border-[#79553D]"
              >
                <option value="Bronze">Bronze</option>
                <option value="Silver">Silver</option>
                <option value="Gold">Gold</option>
                <option value="Platinum">Platinum</option>
                <option value="VIP">VIP</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8A817A] mb-1">Alamat Lengkap</label>
            <textarea
              placeholder="Jl. Raya No..."
              value={customerForm.address}
              onChange={(e) => setCustomerForm(prev => ({ ...prev, address: e.target.value }))}
              className="w-full px-3.5 py-2 border border-[#E8E2DD] rounded-lg text-xs text-[#2B2420] outline-none focus:border-[#79553D] h-20 resize-none"
            />
          </div>
          <div className="flex justify-end gap-3.5 pt-4 border-t border-[#E8E2DD]">
            <button
              type="button"
              onClick={() => setActiveModal(null)}
              className="px-4 py-2 border border-[#E8E2DD] rounded-lg text-xs font-semibold text-[#8A817A] hover:bg-[#FAFAF8] bg-transparent cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#79553D] hover:bg-[#634430] text-white rounded-lg text-xs font-bold transition-colors cursor-pointer border-none"
            >
              Save Customer
            </button>
          </div>
        </form>
      </Modal>

      {/* 2. Modal Add Order */}
      <Modal
        isOpen={activeModal === "order"}
        onClose={() => setActiveModal(null)}
        title="Add New Order"
      >
        <form onSubmit={handleAddOrderSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8A817A] mb-1">Customer</label>
            <select
              required
              value={orderForm.customerId}
              onChange={(e) => setOrderForm(prev => ({ ...prev, customerId: e.target.value }))}
              className="w-full px-3.5 py-2 border border-[#E8E2DD] rounded-lg text-xs bg-white text-[#2B2420] outline-none focus:border-[#79553D]"
            >
              <option value="">-- Select Customer --</option>
              {customers.map(c => (
                <option key={c.id} value={c.id}>{c.name} ({c.email})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8A817A] mb-1">Product</label>
            <select
              value={orderForm.productName}
              onChange={(e) => {
                const prices = {
                  "Oslo Walnut Sofa": 18500000,
                  "Nara Lounge Chair": 5000000,
                  "Mika Dining Table": 15500000,
                  "Japandi Bed Frame": 12000000,
                  "Teak Wood Buffet": 8500000,
                  "Marble Kitchen Set Custom": 185000000
                };
                setOrderForm(prev => ({ 
                  ...prev, 
                  productName: e.target.value,
                  price: prices[e.target.value] || 1000000 
                }));
              }}
              className="w-full px-3.5 py-2 border border-[#E8E2DD] rounded-lg text-xs bg-white text-[#2B2420] outline-none focus:border-[#79553D]"
            >
              <option value="Oslo Walnut Sofa">Oslo Walnut Sofa - Rp 18.500.000</option>
              <option value="Nara Lounge Chair">Nara Lounge Chair - Rp 5.000.000</option>
              <option value="Mika Dining Table">Mika Dining Table - Rp 15.500.000</option>
              <option value="Japandi Bed Frame">Japandi Bed Frame - Rp 12.000.000</option>
              <option value="Teak Wood Buffet">Teak Wood Buffet - Rp 8.500.000</option>
              <option value="Marble Kitchen Set Custom">Marble Kitchen Set Custom - Rp 185.000.000</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8A817A] mb-1">Quantity</label>
              <input
                type="number" min="1" required
                value={orderForm.qty}
                onChange={(e) => setOrderForm(prev => ({ ...prev, qty: Number(e.target.value) }))}
                className="w-full px-3.5 py-2 border border-[#E8E2DD] rounded-lg text-xs text-[#2B2420] outline-none focus:border-[#79553D]"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8A817A] mb-1">Unit Price (Rp)</label>
              <input
                type="number" required
                value={orderForm.price}
                onChange={(e) => setOrderForm(prev => ({ ...prev, price: Number(e.target.value) }))}
                className="w-full px-3.5 py-2 border border-[#E8E2DD] rounded-lg text-xs text-[#2B2420] outline-none focus:border-[#79553D]"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8A817A] mb-1">Shipping Cost (Rp)</label>
              <input
                type="number" required
                value={orderForm.shippingCost}
                onChange={(e) => setOrderForm(prev => ({ ...prev, shippingCost: Number(e.target.value) }))}
                className="w-full px-3.5 py-2 border border-[#E8E2DD] rounded-lg text-xs text-[#2B2420] outline-none focus:border-[#79553D]"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8A817A] mb-1">Payment Method</label>
              <select
                value={orderForm.paymentMethod}
                onChange={(e) => setOrderForm(prev => ({ ...prev, paymentMethod: e.target.value }))}
                className="w-full px-3.5 py-2 border border-[#E8E2DD] rounded-lg text-xs bg-white text-[#2B2420] outline-none focus:border-[#79553D]"
              >
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Gopay">Gopay</option>
                <option value="Cash">Cash</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3.5 pt-4 border-t border-[#E8E2DD]">
            <button
              type="button"
              onClick={() => setActiveModal(null)}
              className="px-4 py-2 border border-[#E8E2DD] rounded-lg text-xs font-semibold text-[#8A817A] hover:bg-[#FAFAF8] bg-transparent cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#79553D] hover:bg-[#634430] text-white rounded-lg text-xs font-bold transition-colors cursor-pointer border-none"
            >
              Create Order
            </button>
          </div>
        </form>
      </Modal>

      {/* 3. Modal Add Consultation */}
      <Modal
        isOpen={activeModal === "consultation"}
        onClose={() => setActiveModal(null)}
        title="Add New Consultation"
      >
        <form onSubmit={handleAddConsultationSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8A817A] mb-1">Customer</label>
            <select
              required
              value={consultForm.customerId}
              onChange={(e) => setConsultForm(prev => ({ ...prev, customerId: e.target.value }))}
              className="w-full px-3.5 py-2 border border-[#E8E2DD] rounded-lg text-xs bg-white text-[#2B2420] outline-none focus:border-[#79553D]"
            >
              <option value="">-- Select Customer --</option>
              {customers.map(c => (
                <option key={c.id} value={c.id}>{c.name} ({c.email})</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8A817A] mb-1">Room Type</label>
              <select
                value={consultForm.roomType}
                onChange={(e) => setConsultForm(prev => ({ ...prev, roomType: e.target.value }))}
                className="w-full px-3.5 py-2 border border-[#E8E2DD] rounded-lg text-xs bg-white text-[#2B2420] outline-none focus:border-[#79553D]"
              >
                <option value="Living Room">Living Room</option>
                <option value="Bed Room">Bed Room</option>
                <option value="Kitchen">Kitchen</option>
                <option value="Dining Room">Dining Room</option>
                <option value="Office">Office</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8A817A] mb-1">Design Preference</label>
              <select
                value={consultForm.designPreference}
                onChange={(e) => setConsultForm(prev => ({ ...prev, designPreference: e.target.value }))}
                className="w-full px-3.5 py-2 border border-[#E8E2DD] rounded-lg text-xs bg-white text-[#2B2420] outline-none focus:border-[#79553D]"
              >
                <option value="Minimalis">Minimalis</option>
                <option value="Scandinavian">Scandinavian</option>
                <option value="Industrial">Industrial</option>
                <option value="Modern">Modern</option>
                <option value="Japandi">Japandi</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8A817A] mb-1">Area Size (sqm)</label>
              <input
                type="number" required
                value={consultForm.roomArea}
                onChange={(e) => setConsultForm(prev => ({ ...prev, roomArea: Number(e.target.value) }))}
                className="w-full px-3.5 py-2 border border-[#E8E2DD] rounded-lg text-xs text-[#2B2420] outline-none focus:border-[#79553D]"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8A817A] mb-1">Budget (Rp)</label>
              <input
                type="number" required
                value={consultForm.budget}
                onChange={(e) => setConsultForm(prev => ({ ...prev, budget: Number(e.target.value) }))}
                className="w-full px-3.5 py-2 border border-[#E8E2DD] rounded-lg text-xs text-[#2B2420] outline-none focus:border-[#79553D]"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3.5 pt-4 border-t border-[#E8E2DD]">
            <button
              type="button"
              onClick={() => setActiveModal(null)}
              className="px-4 py-2 border border-[#E8E2DD] rounded-lg text-xs font-semibold text-[#8A817A] hover:bg-[#FAFAF8] bg-transparent cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#79553D] hover:bg-[#634430] text-white rounded-lg text-xs font-bold transition-colors cursor-pointer border-none"
            >
              Book Consultation
            </button>
          </div>
        </form>
      </Modal>

      {/* 4. Modal Add Promotion */}
      <Modal
        isOpen={activeModal === "promotion"}
        onClose={() => setActiveModal(null)}
        title="Add New Promotion Campaign"
      >
        <form onSubmit={handleAddPromotionSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8A817A] mb-1">Promotion Name</label>
            <input
              type="text" required
              placeholder="e.g. Diskon Sofa Akhir Tahun"
              value={promoForm.name}
              onChange={(e) => setPromoForm(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3.5 py-2 border border-[#E8E2DD] rounded-lg text-xs text-[#2B2420] outline-none focus:border-[#79553D]"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8A817A] mb-1">Promo Type</label>
              <select
                value={promoForm.type}
                onChange={(e) => setPromoForm(prev => ({ ...prev, type: e.target.value }))}
                className="w-full px-3.5 py-2 border border-[#E8E2DD] rounded-lg text-xs bg-white text-[#2B2420] outline-none focus:border-[#79553D]"
              >
                <option value="Diskon Produk">Diskon Produk</option>
                <option value="Flash Sale">Flash Sale</option>
                <option value="Voucher">Voucher</option>
                <option value="Promo Membership">Promo Membership</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8A817A] mb-1">Voucher Code</label>
              <input
                type="text" required
                placeholder="SOFAYEAR15"
                value={promoForm.code}
                onChange={(e) => setPromoForm(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                className="w-full px-3.5 py-2 border border-[#E8E2DD] rounded-lg text-xs text-[#2B2420] outline-none focus:border-[#79553D]"
              />
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8A817A] mb-1">
              Discount Value {promoForm.type === "Promo Membership" ? "(%)" : "(Rp)"}
            </label>
            <input
              type="number" required
              value={promoForm.value}
              onChange={(e) => setPromoForm(prev => ({ ...prev, value: Number(e.target.value) }))}
              className="w-full px-3.5 py-2 border border-[#E8E2DD] rounded-lg text-xs text-[#2B2420] outline-none focus:border-[#79553D]"
            />
          </div>
          <div className="flex justify-end gap-3.5 pt-4 border-t border-[#E8E2DD]">
            <button
              type="button"
              onClick={() => setActiveModal(null)}
              className="px-4 py-2 border border-[#E8E2DD] rounded-lg text-xs font-semibold text-[#8A817A] hover:bg-[#FAFAF8] bg-transparent cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#79553D] hover:bg-[#634430] text-white rounded-lg text-xs font-bold transition-colors cursor-pointer border-none"
            >
              Launch Campaign
            </button>
          </div>
        </form>
      </Modal>

    </header>
  );
}