import React, { useContext, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { CRMContext } from "../context/CRMContext";
import { 
  FiAward, FiMessageSquare, FiLifeBuoy, FiCompass, 
  FiCalendar, FiPhone, FiMail, FiMapPin, FiArrowRight, 
  FiSearch, FiCheckCircle, FiUserPlus, FiShoppingBag, FiInfo 
} from "react-icons/fi";
import Avatar from "../components/ui/Avatar";
import MembershipBadge from "../components/ui/MembershipBadge";

const C = {
  primary: "#79553D",      // Walnut Wood
  primaryBg: "#FAF6F3",    // Sand Beige
  primaryHover: "#634430",
  bg: "#FAFAFA",
  surface: "#FFFFFF",
  border: "#E8E2DD",
  textDark: "#2B2420",     // Charcoal
  textMuted: "#8A817A",    // Muted Earthy
  successBg: "#E6ECE5",
  successText: "#4A6B46",
  warningBg: "#F9F0E5",
  warningText: "#A86E2E"
};

const ETALASE = [
  { name: "Oslo Walnut Sofa", price: 18500000, wood: "Walnut Wood", category: "Sofa", desc: "Premium 3-seater walnut frame sofa upholstered in high-end Belgian linen.", img: "/img/timbercraft_hero.png" },
  { name: "Nara Lounge Chair", price: 5000000, wood: "Oak Wood", category: "Chair", desc: "Sculptural lounge chair featuring handcrafted oak joints and bouclé upholstery.", img: "/img/timbercraft_hero.png" },
  { name: "Mika Dining Table", price: 15500000, wood: "Teak Wood", category: "Table", desc: "Minimalist dining table made of sustainably sourced solid teak wood.", img: "/img/timbercraft_hero.png" },
  { name: "Teak Wood Buffet", price: 8500000, wood: "Teak Wood", category: "Storage", desc: "Earthy retro sideboard buffet with sliding cane doors and solid teak legs.", img: "/img/timbercraft_hero.png" }
];

export default function LandingPage() {
  const navigate = useNavigate();
  const { customers, addCustomer, addConsultation, addTicket } = useContext(CRMContext);

  // Active section scroll state
  const [activeFormTab, setActiveFormTab] = useState("membership");

  // ── CRM Form States ──
  // 1. Membership Registration
  const [memberForm, setMemberForm] = useState({
    name: "",
    email: "",
    phone: "",
    city: "Jakarta",
    address: ""
  });
  const [memberSuccessMsg, setMemberSuccessMsg] = useState("");

  // 2. Membership Check Status
  const [checkQuery, setCheckQuery] = useState("");
  const [foundMember, setFoundMember] = useState(null);
  const [hasChecked, setHasChecked] = useState(false);

  // 3. Consultation Booking
  const [consultForm, setConsultForm] = useState({
    customerName: "",
    customerEmail: "",
    roomType: "Living Room",
    designPreference: "Japandi",
    budget: "",
    date: ""
  });
  const [consultSuccessMsg, setConsultSuccessMsg] = useState("");

  // 4. Customer Support
  const [supportForm, setSupportForm] = useState({
    customerName: "",
    customerEmail: "",
    category: "Keluhan Produk",
    subject: "",
    content: ""
  });
  const [supportSuccessMsg, setSupportSuccessMsg] = useState("");

  // ── Form Submissions ──
  const handleRegisterMember = (e) => {
    e.preventDefault();
    const newCust = addCustomer({
      name: memberForm.name,
      email: memberForm.email,
      phone: memberForm.phone,
      city: memberForm.city,
      address: memberForm.address,
      loyalty: "Bronze",
      totalSpent: 0,
      loyaltyPoints: 0
    });
    setMemberSuccessMsg(`Pendaftaran Berhasil! ID Member Anda adalah #MBR-${String(newCust.id).padStart(3, "0")}.`);
    setMemberForm({ name: "", email: "", phone: "", city: "Jakarta", address: "" });
    setTimeout(() => setMemberSuccessMsg(""), 7000);
  };

  const handleCheckMember = (e) => {
    e.preventDefault();
    const query = checkQuery.trim().toLowerCase();
    const matched = customers.find(c => 
      c.name.toLowerCase().includes(query) || 
      c.email.toLowerCase() === query ||
      String(c.id) === query.replace(/\D/g, "")
    );
    setFoundMember(matched || null);
    setHasChecked(true);
  };

  const handleBookConsultation = (e) => {
    e.preventDefault();
    // Check if customer email exists in CRM
    const matchedCust = customers.find(c => c.email.toLowerCase() === consultForm.customerEmail.trim().toLowerCase());
    const customerId = matchedCust ? matchedCust.id : customers.length + 999; // Fallback customer ID

    const newCons = addConsultation({
      customerId,
      customerName: consultForm.customerName,
      roomType: consultForm.roomType,
      designPreference: consultForm.designPreference,
      budget: Number(consultForm.budget) || 0,
      date: consultForm.date || new Date().toISOString().split("T")[0]
    });

    setConsultSuccessMsg(`Konsultasi Berhasil Dijadwalkan! ID Konsultasi Anda adalah #${newCons.id}. Tim desainer kami akan menghubungi Anda.`);
    setConsultForm({
      customerName: "",
      customerEmail: "",
      roomType: "Living Room",
      designPreference: "Japandi",
      budget: "",
      date: ""
    });
    setTimeout(() => setConsultSuccessMsg(""), 7000);
  };

  const handleCreateSupportTicket = (e) => {
    e.preventDefault();
    // Check if customer email exists in CRM
    const matchedCust = customers.find(c => c.email.toLowerCase() === supportForm.customerEmail.trim().toLowerCase());
    const customerId = matchedCust ? matchedCust.id : customers.length + 999;

    const newTicket = addTicket({
      customerId,
      customerName: supportForm.customerName,
      category: supportForm.category,
      subject: supportForm.subject,
      content: supportForm.content,
      status: "Open"
    });

    setSupportSuccessMsg(`Laporan Anda Terkirim! Nomor Tiket Bantuan: #${newTicket.id}. Kami akan memproses laporan Anda.`);
    setSupportForm({
      customerName: "",
      customerEmail: "",
      category: "Keluhan Produk",
      subject: "",
      content: ""
    });
    setTimeout(() => setSupportSuccessMsg(""), 7000);
  };

  return (
    <div className="min-h-screen flex flex-col text-[#2B2420]" style={{ background: C.bg, fontFamily: "'Inter', sans-serif" }}>
      {/* ── 1. Navigation Header ── */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#E8E2DD] px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#79553D] flex items-center justify-center text-white font-extrabold text-lg">
            T
          </div>
          <div className="flex flex-col text-left">
            <span className="font-extrabold text-sm tracking-wider uppercase leading-none">TimberCraft</span>
            <span className="text-[9px] font-semibold text-[#8A817A] tracking-widest mt-0.5">STUDIO</span>
          </div>
        </div>

        {/* Desktop Navbar menu */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-bold text-[#8A817A]">
          <a href="#showroom" className="hover:text-[#79553D] transition-colors no-underline">Showroom</a>
          <a href="#services" className="hover:text-[#79553D] transition-colors no-underline">Portal Services</a>
          <a href="#membership" className="hover:text-[#79553D] transition-colors no-underline">Loyalty & Benefits</a>
        </nav>

        {/* Admin Portal Button */}
        <button 
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-transparent border border-[#79553D] hover:bg-[#FAF6F3] text-[#79553D] rounded-xl text-xs font-bold transition-all cursor-pointer"
        >
          Portal Admin <FiArrowRight />
        </button>
      </header>

      {/* ── 2. Premium Hero Section ── */}
      <section className="relative px-6 py-12 md:py-20 flex flex-col lg:flex-row items-center gap-10 max-w-7xl mx-auto">
        <div className="flex-1 text-left">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#79553D] bg-[#FAF6F3] px-3 py-1 rounded-full border border-[#E8E2DD]">
            BESPOKE LUXURY FURNITURE
          </span>
          <h1 className="text-3xl md:text-5xl font-serif font-extrabold leading-tight text-[#2B2420] mt-4">
            Crafting Timeless Furniture for Elegant Spaces
          </h1>
          <p className="text-sm text-[#8A817A] mt-4 max-w-lg leading-relaxed">
            TimberCraft handcrafts luxury furniture pieces from premium sustainable timbers like solid walnut and Indonesian teak. Design your dream room today.
          </p>
          <div className="flex gap-3 mt-8">
            <a 
              href="#showroom" 
              className="px-5 py-3 bg-[#79553D] hover:bg-[#634430] text-white rounded-xl text-xs font-bold transition-all shadow-sm no-underline inline-block"
            >
              Explore Showroom
            </a>
            <a 
              href="#services" 
              className="px-5 py-3 border border-[#E8E2DD] hover:bg-[#FAF6F3] text-[#2B2420] rounded-xl text-xs font-bold transition-all no-underline inline-block"
            >
              Book Design Consultation
            </a>
          </div>
        </div>

        {/* Hero image container */}
        <div className="flex-1 relative w-full max-w-lg">
          <div className="absolute -inset-2 bg-[#FAF6F3] rounded-3xl -rotate-2 border border-[#E8E2DD]" />
          <img 
            src="/img/timbercraft_hero.png" 
            alt="TimberCraft Interior Showroom" 
            className="w-full h-auto rounded-3xl relative border border-[#E8E2DD] shadow-lg object-cover"
          />
        </div>
      </section>

      {/* ── 3. Furniture Showcase / Etalase ── */}
      <section id="showroom" className="bg-white border-y border-[#E8E2DD] py-16 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#79553D]">PRODUCT CATALOG</span>
          <h2 className="text-2xl font-serif font-bold text-[#2B2420] mt-2 mb-3">TimberCraft Signature Pieces</h2>
          <p className="text-xs text-[#8A817A] max-w-md mx-auto mb-10">
            A curated showcase of our most popular bespoke designs. Visit our showroom or request custom alterations.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            {ETALASE.map((item, idx) => (
              <div 
                key={idx} 
                className="group border border-[#E8E2DD] rounded-2xl overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col justify-between"
              >
                {/* Product Image */}
                <div className="relative overflow-hidden aspect-[4/3] bg-[#FAF6F3] border-b border-[#E8E2DD]">
                  <img 
                    src={item.img} 
                    alt={item.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-2.5 left-2.5 text-[9px] font-bold uppercase px-2 py-0.5 rounded-full bg-white/80 backdrop-blur-sm border border-[#E8E2DD]">
                    {item.wood}
                  </span>
                </div>

                {/* Product Detail info */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-[#8A817A]">{item.category}</span>
                    <h3 className="text-xs font-bold text-[#2B2420] mt-1 mb-1.5">{item.name}</h3>
                    <p className="text-[10px] text-[#8A817A] leading-normal line-clamp-3 mb-4">{item.desc}</p>
                  </div>
                  <div className="flex justify-between items-center border-t border-[#F3F4F6] pt-3">
                    <span className="text-xs font-extrabold text-[#79553D]">
                      {item.price.toLocaleString("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 })}
                    </span>
                    <button 
                      onClick={() => alert(`TimberCraft custom orders: Silakan hubungi Customer Service kami atau jadwalkan Konsultasi Interior untuk memesan '${item.name}' kustom.`)}
                      className="px-2.5 py-1.5 bg-[#FAF6F3] hover:bg-[#79553D] hover:text-white text-[#79553D] rounded-lg text-[9px] font-bold transition-all border-none cursor-pointer"
                    >
                      Custom Order
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. Interactive CRM Portal Section ── */}
      <section id="services" className="py-16 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Left Column - CRM description & Nav tabs */}
          <div className="text-left flex flex-col justify-between lg:pr-6">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#79553D]">INTEGRATED PORTAL SERVICES</span>
              <h2 className="text-2xl font-serif font-bold text-[#2B2420] mt-2 mb-4">Direct Customer Connectivity</h2>
              <p className="text-xs text-[#8A817A] leading-relaxed mb-6">
                Layanan ini terhubung langsung dengan sistem internal **TimberCraft CRM**. Permintaan konsultasi, tiket laporan keluhan, dan pendaftaran keanggotaan Anda akan diproses secara instan oleh tim sales dan admin kami.
              </p>

              {/* Service Navigation Buttons */}
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => setActiveFormTab("membership")}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold border transition-all cursor-pointer text-left ${activeFormTab === "membership" ? "bg-[#FAF6F3] border-[#79553D] text-[#79553D]" : "bg-white border-[#E8E2DD] text-[#8A817A] hover:bg-neutral-50"}`}
                >
                  <FiAward className="text-sm" /> Loyalty Membership Portal
                </button>
                <button
                  onClick={() => setActiveFormTab("consultation")}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold border transition-all cursor-pointer text-left ${activeFormTab === "consultation" ? "bg-[#FAF6F3] border-[#79553D] text-[#79553D]" : "bg-white border-[#E8E2DD] text-[#8A817A] hover:bg-neutral-50"}`}
                >
                  <FiCompass className="text-sm" /> Request Interior Consultation
                </button>
                <button
                  onClick={() => setActiveFormTab("support")}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold border transition-all cursor-pointer text-left ${activeFormTab === "support" ? "bg-[#FAF6F3] border-[#79553D] text-[#79553D]" : "bg-white border-[#E8E2DD] text-[#8A817A] hover:bg-neutral-50"}`}
                >
                  <FiLifeBuoy className="text-sm" /> Customer Service Desk
                </button>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-[#E8E2DD] hidden lg:block text-[11px] text-[#8A817A]">
              <div className="flex items-center gap-2 mb-2">
                <FiPhone className="text-[#79553D]" /> <span>+62 812-9876-5432</span>
              </div>
              <div className="flex items-center gap-2">
                <FiMail className="text-[#79553D]" /> <span>support@timbercraft.com</span>
              </div>
            </div>
          </div>

          {/* Right Columns - Dynamic CRM Forms */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-[#E8E2DD] p-6 md:p-8 text-left shadow-sm">
            
            {/* ── Form Tab A: Loyalty Membership ── */}
            {activeFormTab === "membership" && (
              <div className="flex flex-col gap-6">
                <div>
                  <h3 className="text-lg font-serif font-bold text-[#2B2420] flex items-center gap-2">
                    <FiAward className="text-[#79553D]" /> TimberCraft Loyalty Club
                  </h3>
                  <p className="text-xs text-[#8A817A] mt-1">
                    Daftar keanggotaan untuk menukarkan poin reward dengan voucher potongan harga dan konsultasi layout gratis.
                  </p>
                </div>

                {/* Grid split: Register new / check points */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                  
                  {/* Register Form */}
                  <div className="flex flex-col gap-4 border-r border-[#E8E2DD]/50 md:pr-6">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#2B2420] flex items-center gap-1.5">
                      <FiUserPlus className="text-[#79553D]" /> Join Membership
                    </h4>

                    {memberSuccessMsg ? (
                      <div className="bg-[#E6ECE5] border border-[#A6C0A0] text-[#4A6B46] rounded-xl p-3 text-[11px] font-medium leading-relaxed">
                        {memberSuccessMsg}
                      </div>
                    ) : (
                      <form onSubmit={handleRegisterMember} className="flex flex-col gap-3 text-[11px]">
                        <div className="flex flex-col gap-1">
                          <label className="font-semibold">Nama Lengkap</label>
                          <input 
                            type="text" 
                            placeholder="e.g. Clarissa Wulandari"
                            value={memberForm.name} 
                            onChange={(e) => setMemberForm({ ...memberForm, name: e.target.value })}
                            className="h-9 px-3 rounded-lg border border-[#E8E2DD] outline-none focus:border-[#79553D]" 
                            required 
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="font-semibold">Alamat Email</label>
                          <input 
                            type="email" 
                            placeholder="e.g. clarissa@gmail.com"
                            value={memberForm.email} 
                            onChange={(e) => setMemberForm({ ...memberForm, email: e.target.value })}
                            className="h-9 px-3 rounded-lg border border-[#E8E2DD] outline-none focus:border-[#79553D]" 
                            required 
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="font-semibold">Nomor Telepon</label>
                          <input 
                            type="text" 
                            placeholder="e.g. 081123456789"
                            value={memberForm.phone} 
                            onChange={(e) => setMemberForm({ ...memberForm, phone: e.target.value })}
                            className="h-9 px-3 rounded-lg border border-[#E8E2DD] outline-none focus:border-[#79553D]" 
                            required 
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="font-semibold">Kota Domisili</label>
                          <input 
                            type="text" 
                            placeholder="e.g. Jakarta Selatan"
                            value={memberForm.city} 
                            onChange={(e) => setMemberForm({ ...memberForm, city: e.target.value })}
                            className="h-9 px-3 rounded-lg border border-[#E8E2DD] outline-none focus:border-[#79553D]" 
                            required 
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="font-semibold">Alamat Lengkap</label>
                          <textarea 
                            rows="2"
                            placeholder="e.g. Pondok Indah Townhouse B-12"
                            value={memberForm.address} 
                            onChange={(e) => setMemberForm({ ...memberForm, address: e.target.value })}
                            className="p-3 rounded-lg border border-[#E8E2DD] outline-none focus:border-[#79553D] resize-none font-sans" 
                            required 
                          />
                        </div>
                        <button 
                          type="submit" 
                          className="mt-2 h-9 bg-[#79553D] hover:bg-[#634430] text-white rounded-lg font-bold transition-all cursor-pointer border-none"
                        >
                          Daftar Sekarang
                        </button>
                      </form>
                    )}
                  </div>

                  {/* Check points Form */}
                  <div className="flex flex-col gap-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#2B2420] flex items-center gap-1.5">
                      <FiSearch className="text-[#79553D]" /> Check Loyalty Points
                    </h4>
                    <p className="text-[11px] text-[#8A817A] leading-relaxed">
                      Masukkan Nama atau Email terdaftar untuk memeriksa level keanggotaan dan akumulasi poin belanja Anda.
                    </p>

                    <form onSubmit={handleCheckMember} className="flex gap-2 text-[11px]">
                      <input 
                        type="text" 
                        placeholder="Nama atau Email..."
                        value={checkQuery}
                        onChange={(e) => setCheckQuery(e.target.value)}
                        className="flex-1 h-9 px-3 rounded-lg border border-[#E8E2DD] outline-none focus:border-[#79553D]" 
                        required 
                      />
                      <button 
                        type="submit"
                        className="px-4 h-9 bg-white border border-[#E8E2DD] hover:bg-[#FAF6F3] text-[#2B2420] rounded-lg font-bold transition-all cursor-pointer"
                      >
                        Cari
                      </button>
                    </form>

                    {/* Member points search result card */}
                    {hasChecked && (
                      <div className="border border-[#E8E2DD] rounded-xl p-3.5 mt-2 text-xs" style={{ background: "#FCFAF8" }}>
                        {foundMember ? (
                          <div className="flex flex-col gap-2">
                            <div className="flex justify-between items-center">
                              <span className="font-extrabold text-[#2B2420]">{foundMember.name}</span>
                              <MembershipBadge tier={foundMember.loyalty} />
                            </div>
                            <div className="h-px bg-[#E8E2DD] my-1" />
                            <div className="flex justify-between text-[11px]">
                              <span className="text-[#8A817A]">Poin Reward:</span>
                              <span className="font-bold text-[#79553D]">{foundMember.loyaltyPoints || 0} Pts</span>
                            </div>
                            <div className="flex justify-between text-[11px]">
                              <span className="text-[#8A817A]">Total Belanja:</span>
                              <span className="font-bold text-[#2B2420]">
                                {(foundMember.totalSpent || 0).toLocaleString("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 })}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-xs text-[#B85C5C] font-semibold py-1">
                            <FiInfo /> Data member tidak ditemukan. Pastikan nama/email sudah terdaftar.
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ── Form Tab B: Book Consultation ── */}
            {activeFormTab === "consultation" && (
              <div className="flex flex-col gap-6">
                <div>
                  <h3 className="text-lg font-serif font-bold text-[#2B2420] flex items-center gap-2">
                    <FiCompass className="text-[#79553D]" /> Interior & Design Consultation
                  </h3>
                  <p className="text-xs text-[#8A817A] mt-1">
                    Diskusikan konsep ruangan Anda bersama desainer handal kami. Kami akan menjadwalkan konsultasi khusus baik tatap muka maupun online.
                  </p>
                </div>

                {consultSuccessMsg ? (
                  <div className="bg-[#E6ECE5] border border-[#A6C0A0] text-[#4A6B46] rounded-2xl p-5 text-xs font-semibold leading-relaxed flex items-start gap-2.5">
                    <FiCheckCircle className="text-base flex-shrink-0 mt-0.5" />
                    <span>{consultSuccessMsg}</span>
                  </div>
                ) : (
                  <form onSubmit={handleBookConsultation} className="flex flex-col gap-4 text-[11px]">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1">
                        <label className="font-semibold text-[#2B2420]">Nama Anda</label>
                        <input 
                          type="text" 
                          placeholder="e.g. Ahmad Reza"
                          value={consultForm.customerName}
                          onChange={(e) => setConsultForm({ ...consultForm, customerName: e.target.value })}
                          className="h-10 px-3 rounded-lg border border-[#E8E2DD] outline-none focus:border-[#79553D]" 
                          required 
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="font-semibold text-[#2B2420]">Alamat Email</label>
                        <input 
                          type="email" 
                          placeholder="e.g. reza.ahmad@gmail.com"
                          value={consultForm.customerEmail}
                          onChange={(e) => setConsultForm({ ...consultForm, customerEmail: e.target.value })}
                          className="h-10 px-3 rounded-lg border border-[#E8E2DD] outline-none focus:border-[#79553D]" 
                          required 
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex flex-col gap-1">
                        <label className="font-semibold text-[#2B2420]">Tipe Ruangan</label>
                        <select
                          value={consultForm.roomType}
                          onChange={(e) => setConsultForm({ ...consultForm, roomType: e.target.value })}
                          className="h-10 px-3 rounded-lg border border-[#E8E2DD] bg-white outline-none focus:border-[#79553D]"
                        >
                          <option value="Living Room">Living Room (Ruang Keluarga)</option>
                          <option value="Bed Room">Bed Room (Kamar Tidur)</option>
                          <option value="Dining Room">Dining Room (Ruang Makan)</option>
                          <option value="Kitchen Room">Kitchen Room (Dapur)</option>
                          <option value="Office Room">Office Room (Ruang Kerja)</option>
                        </select>
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="font-semibold text-[#2B2420]">Gaya Desain</label>
                        <select
                          value={consultForm.designPreference}
                          onChange={(e) => setConsultForm({ ...consultForm, designPreference: e.target.value })}
                          className="h-10 px-3 rounded-lg border border-[#E8E2DD] bg-white outline-none focus:border-[#79553D]"
                        >
                          <option value="Japandi">Japandi (Japanese-Scandinavian)</option>
                          <option value="Scandinavian">Scandinavian</option>
                          <option value="Industrial">Industrial</option>
                          <option value="Modern Classic">Modern Classic</option>
                          <option value="Minimalist Teak">Minimalist Teak</option>
                        </select>
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="font-semibold text-[#2B2420]">Estimasi Budget (Rp)</label>
                        <input 
                          type="number" 
                          placeholder="e.g. 50000000"
                          value={consultForm.budget}
                          onChange={(e) => setConsultForm({ ...consultForm, budget: e.target.value })}
                          className="h-10 px-3 rounded-lg border border-[#E8E2DD] outline-none focus:border-[#79553D]" 
                          required 
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="font-semibold text-[#2B2420]">Rencana Tanggal Konsultasi</label>
                      <input 
                        type="date"
                        value={consultForm.date}
                        onChange={(e) => setConsultForm({ ...consultForm, date: e.target.value })}
                        className="h-10 px-3 rounded-lg border border-[#E8E2DD] outline-none focus:border-[#79553D]" 
                        required 
                      />
                    </div>

                    <button 
                      type="submit" 
                      className="h-10 mt-3 bg-[#79553D] hover:bg-[#634430] text-white rounded-lg font-bold transition-all cursor-pointer border-none"
                    >
                      Ajukan Jadwal Konsultasi
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* ── Form Tab C: Customer Service support ── */}
            {activeFormTab === "support" && (
              <div className="flex flex-col gap-6">
                <div>
                  <h3 className="text-lg font-serif font-bold text-[#2B2420] flex items-center gap-2">
                    <FiLifeBuoy className="text-[#79553D]" /> Customer Service & Support Desk
                  </h3>
                  <p className="text-xs text-[#8A817A] mt-1">
                    Punya keluhan terkait keterlambatan pengiriman, goresan kayu, atau pengembalian mebel? Tuliskan tiket keluhan Anda agar segera ditindaklanjuti.
                  </p>
                </div>

                {supportSuccessMsg ? (
                  <div className="bg-[#E6ECE5] border border-[#A6C0A0] text-[#4A6B46] rounded-2xl p-5 text-xs font-semibold leading-relaxed flex items-start gap-2.5">
                    <FiCheckCircle className="text-base flex-shrink-0 mt-0.5" />
                    <span>{supportSuccessMsg}</span>
                  </div>
                ) : (
                  <form onSubmit={handleCreateSupportTicket} className="flex flex-col gap-4 text-[11px]">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1">
                        <label className="font-semibold text-[#2B2420]">Nama Pelapor</label>
                        <input 
                          type="text" 
                          placeholder="e.g. Siti Rahmawati"
                          value={supportForm.customerName}
                          onChange={(e) => setSupportForm({ ...supportForm, customerName: e.target.value })}
                          className="h-10 px-3 rounded-lg border border-[#E8E2DD] outline-none focus:border-[#79553D]" 
                          required 
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="font-semibold text-[#2B2420]">Alamat Email</label>
                        <input 
                          type="email" 
                          placeholder="e.g. siti.rahma@yahoo.com"
                          value={supportForm.customerEmail}
                          onChange={(e) => setSupportForm({ ...supportForm, customerEmail: e.target.value })}
                          className="h-10 px-3 rounded-lg border border-[#E8E2DD] outline-none focus:border-[#79553D]" 
                          required 
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="md:col-span-1 flex flex-col gap-1">
                        <label className="font-semibold text-[#2B2420]">Kategori Laporan</label>
                        <select
                          value={supportForm.category}
                          onChange={(e) => setSupportForm({ ...supportForm, category: e.target.value })}
                          className="h-10 px-3 rounded-lg border border-[#E8E2DD] bg-white outline-none focus:border-[#79553D]"
                        >
                          <option value="Keluhan Produk">Keluhan Produk (Gores, Retak, dll)</option>
                          <option value="Layanan Pengiriman">Layanan Pengiriman Terlambat</option>
                          <option value="Bantuan Pembayaran">Bantuan Pembayaran</option>
                          <option value="Lainnya">Lainnya</option>
                        </select>
                      </div>
                      <div className="md:col-span-2 flex flex-col gap-1">
                        <label className="font-semibold text-[#2B2420]">Subjek Laporan</label>
                        <input 
                          type="text" 
                          placeholder="e.g. Keterlambatan pengantaran Oslo walnut sofa"
                          value={supportForm.subject}
                          onChange={(e) => setSupportForm({ ...supportForm, subject: e.target.value })}
                          className="h-10 px-3 rounded-lg border border-[#E8E2DD] outline-none focus:border-[#79553D]" 
                          required 
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="font-semibold text-[#2B2420]">Detail Kendala / Pertanyaan</label>
                      <textarea 
                        rows="3"
                        placeholder="Deskripsikan secara lengkap permasalahan furnitur Anda..."
                        value={supportForm.content}
                        onChange={(e) => setSupportForm({ ...supportForm, content: e.target.value })}
                        className="p-3 rounded-lg border border-[#E8E2DD] outline-none focus:border-[#79553D] resize-none font-sans" 
                        required 
                      />
                    </div>

                    <button 
                      type="submit" 
                      className="h-10 mt-2 bg-[#79553D] hover:bg-[#634430] text-white rounded-lg font-bold transition-all cursor-pointer border-none"
                    >
                      Kirim Laporan Bantuan
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── 5. Minimalist Footer ── */}
      <footer className="mt-auto bg-white border-t border-[#E8E2DD] px-6 py-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-[#8A817A]">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-[#2B2420] tracking-wider uppercase">TimberCraft Studio</span>
            <span>|</span>
            <span>Bespoke Luxury Woodworking</span>
          </div>
          <div className="flex items-center gap-6 font-semibold">
            <button 
              onClick={() => navigate("/dashboard")}
              className="text-[#79553D] hover:underline cursor-pointer border-none bg-transparent"
            >
              Portal Admin
            </button>
            <span>© 2026 TimberCraft. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
