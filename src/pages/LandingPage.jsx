import React, { useContext, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { CRMContext } from "../context/CRMContext";
import { 
  FiLayout, FiDatabase, FiTrendingUp, FiArchive, FiTruck, 
  FiPercent, FiShield, FiChevronDown, FiChevronUp, FiSend, 
  FiCpu, FiCheck, FiLayers, FiStar, FiHelpCircle, FiClock, 
  FiUsers, FiFileText, FiActivity, FiArrowRight, FiPlay, 
  FiGrid, FiLock, FiCheckCircle, FiDollarSign, FiAward,
  FiMessageSquare, FiSliders, FiSmartphone
} from "react-icons/fi";

const C = {
  primary: "#79553D",        // Walnut Wood
  primaryBg: "#FAF6F3",      // Sand Beige
  primaryHover: "#634430",
  accent: "#4A6B46",         // Olive Green
  accentBg: "#E6ECE5",       // Light Olive
  accentHover: "#3B5537",
  bg: "#FAFAF9",             // Warm Gray
  surface: "#FFFFFF",
  border: "#E8E2DD",
  textDark: "#2B2420",       // Charcoal
  textMuted: "#8A817A",      // Muted Earthy
  success: "#4A6B46",
  warning: "#A86E2E",
  danger: "#B85C5C"
};

const TRUST_LOGOS = [
  { name: "Kalingga Jati", location: "Jepara" },
  { name: "DecoWood", location: "Jakarta" },
  { name: "JatiLuxe Showroom", location: "Bali" },
  { name: "TimberStyle Studio", location: "Bandung" },
  { name: "MinimaliHome", location: "Surabaya" }
];

const TESTIMONIALS = [
  {
    quote: "Semenjak showroom kami memakai Timber CRM, follow-up prospek pesanan kustom menjadi 3x lebih cepat. Stok kayu jati dan status produksi mebel juga bisa kami pantau langsung dari handphone. Sangat direkomendasikan!",
    author: "Bambang Hermawan",
    role: "Owner Kalingga Jati Showroom",
    avatarColor: "bg-[#79553D]"
  },
  {
    quote: "Sebelumnya kami kewalahan mencatat data loyalty pelanggan dan poin reward secara manual. Dengan integrasi Supabase dan sistem membership otomatis di platform ini, repeat order toko kami melonjak hingga 42% dalam 3 bulan.",
    author: "Riana Putri",
    role: "Direktur Marketing DecoWood Jakarta",
    avatarColor: "bg-[#4A6B46]"
  },
  {
    quote: "Fitur kalkulator quotation dan monitoring pengiriman armada logistik sangat mempermudah operasional harian admin showroom kami. Pelanggan juga senang karena mendapat notifikasi WhatsApp otomatis saat mebel mulai dikirim.",
    author: "Hendry Prasetyo",
    role: "Operational Manager FurniStyle Bandung",
    avatarColor: "bg-[#A86E2E]"
  }
];

export default function LandingPage() {
  const navigate = useNavigate();
  const { customers, transactions, tickets, consultations, addCustomer, addConsultation } = useContext(CRMContext);

  // States
  const [activeWorkflowStep, setActiveWorkflowStep] = useState(0);
  const [activePreviewTab, setActivePreviewTab] = useState("analytics");
  const [expandedFaq, setExpandedFaq] = useState(null);
  
  // Custom interactive states for V3 Sandbox
  const [guestName, setGuestName] = useState("Budi Santoso");
  const [waSimulationType, setWaSimulationType] = useState("lead");
  
  // ROI Calculator states
  const [roiSalesTeam, setRoiSalesTeam] = useState(5);
  const [roiRevenue, setRoiRevenue] = useState(150000000); // 150 Million

  // Stock sandbox states
  const [sandboxWood, setSandboxWood] = useState("Teak");
  const [sandboxFinish, setSandboxFinish] = useState("Natural Oil");
  const [sandboxQty, setSandboxQty] = useState(10);

  // Workflow Sandbox interactive states
  const [wfLeadName, setWfLeadName] = useState("Budi Santoso");
  const [wfLeadCity, setWfLeadCity] = useState("Jepara");
  const [wfLeadLogged, setWfLeadLogged] = useState(false);
  const [wfLeadLog, setWfLeadLog] = useState("");

  const [wfRoomType, setWfRoomType] = useState("Living Room");
  const [wfDesignPref, setWfDesignPref] = useState("Japandi");
  
  const [wfQuoteQty, setWfQuoteQty] = useState(2);
  const [wfQuoteWood, setWfQuoteWood] = useState("Teak Wood");
  const [wfQuoteGenerated, setWfQuoteGenerated] = useState(false);

  const [wfSigned, setWfSigned] = useState(false);
  
  const [wfPaid, setWfPaid] = useState(false);
  const [wfPayMethod, setWfPayMethod] = useState("Virtual Account");

  const [wfProdProgress, setWfProdProgress] = useState(2);
  const [wfDeliverProgress, setWfDeliverProgress] = useState(0);

  const [wfReviewStars, setWfReviewStars] = useState(5);
  const [wfReviewSubmitted, setWfReviewSubmitted] = useState(false);

  const [wfPoints, setWfPoints] = useState(1250);
  const [wfLoyaltyTier, setWfLoyaltyTier] = useState("Bronze");
  
  const [wfCampaignSent, setWfCampaignSent] = useState(false);

  // Auto-play state
  const [isWfPlaying, setIsWfPlaying] = useState(false);

  // Auto-play effect
  React.useEffect(() => {
    let interval = null;
    if (isWfPlaying) {
      interval = setInterval(() => {
        setActiveWorkflowStep((prev) => (prev + 1) % 10);
      }, 5000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isWfPlaying]);

  // Trial Signup Modal State
  const [trialModalOpen, setTrialModalOpen] = useState(false);
  const [trialForm, setTrialForm] = useState({ name: "", email: "", phone: "", showroomName: "" });
  const [trialSuccess, setTrialSuccess] = useState(false);

  // Book Demo Form State
  const [demoForm, setDemoForm] = useState({ name: "", email: "", date: "", time: "10:00", topic: "Konsultasi Setup CRM" });
  const [demoSuccess, setDemoSuccess] = useState(false);

  // Compute live statistics from CRM context
  const liveStats = useMemo(() => {
    const totalCust = customers ? customers.length : 0;
    const totalTrx = transactions ? transactions.length : 0;
    const totalTicket = tickets ? tickets.length : 0;
    const totalCons = consultations ? consultations.length : 0;

    // Calculate dynamic total revenue from transactions
    const totalRevenue = transactions 
      ? transactions.reduce((sum, t) => sum + (t.totalSpent || t.total || 0), 0)
      : 0;

    return {
      customers: totalCust,
      orders: totalTrx,
      tickets: totalTicket,
      consultations: totalCons,
      revenue: totalRevenue
    };
  }, [customers, transactions, tickets, consultations]);

  // Dynamic ROI calculations
  const roiResults = useMemo(() => {
    const timeSaved = roiSalesTeam * 18; // 18 hours per sales/month saved
    const potentialIncrease = Math.round(roiRevenue * 0.26); // 26% conversion lift
    const adminCostSaved = timeSaved * 65000; // Rp 65.000 / hour admin labor
    const totalImpact = potentialIncrease + adminCostSaved;

    return {
      timeSaved,
      potentialIncrease,
      adminCostSaved,
      totalImpact
    };
  }, [roiSalesTeam, roiRevenue]);

  // Dynamic sandbox stock estimation
  const stockSandboxEstimate = useMemo(() => {
    let basePricePerUnit = 3500000; // Sofa/Table base
    if (sandboxWood === "Walnut") basePricePerUnit = 5500000;
    else if (sandboxWood === "Oak") basePricePerUnit = 4200000;

    let finishMultiplier = 1.0;
    if (sandboxFinish === "PU Lacquer") finishMultiplier = 1.25;
    else if (sandboxFinish === "Melamine") finishMultiplier = 1.15;

    const pricePerUnit = basePricePerUnit * finishMultiplier;
    const totalPrice = pricePerUnit * sandboxQty;

    // Status logic
    let statusText = "Stok Optimal";
    let statusColor = "text-[#4A6B46]";
    if (sandboxQty < 5) {
      statusText = "Stok Kritis";
      statusColor = "text-[#B85C5C]";
    } else if (sandboxQty > 25) {
      statusText = "Stok Overcapacity";
      statusColor = "text-[#A86E2E]";
    }

    return {
      pricePerUnit,
      totalPrice,
      statusText,
      statusColor
    };
  }, [sandboxWood, sandboxFinish, sandboxQty]);

  // WhatsApp simulation message builder
  const simulatedWaMessage = useMemo(() => {
    const name = guestName.trim() || "Customer";
    switch (waSimulationType) {
      case "dp":
        return `Timber CRM:\nHalo ${name},\nPembayaran uang muka (DP) sebesar Rp 10.000.000 untuk pemesanan Set Meja Makan Kayu ${sandboxWood} Anda telah kami verifikasi.\nStatus produksi: Antrean Workshop.\nDetail: crm.timber.id/o/trx-202`;
      case "kirim":
        return `Timber CRM:\nKabar gembira ${name}! Pesanan Kursi Santai dengan finishing ${sandboxFinish} Anda sedang dikirim oleh driver kami (Bambang - 0812-987x-xxxx).\nEstimasi tiba: Hari ini pukul 15:30 WIB.\nLacak posisi: crm.timber.id/track/driver-991`;
      case "feedback":
        return `Timber CRM:\nHalo ${name},\nMebel kustom Anda telah selesai dipasang dengan baik. Bagaimana kualitas pemasangan hari ini?\nBeri kami ulasan & dapatkan 100 loyalty points bonus: crm.timber.id/review/trx-202`;
      case "lead":
      default:
        return `Timber CRM:\nHalo ${name}, terima kasih telah berkunjung ke showroom kami hari ini. Berikut spesifikasi mebel kustom Kayu ${sandboxWood} yang tadi Anda minati:\nUkuran: Custom P200 x L90 x T75 cm\nFinishing: ${sandboxFinish}\nKatalog online kami: crm.timber.id/catalog/102`;
    }
  }, [waSimulationType, guestName, sandboxWood, sandboxFinish]);

  // Handle Free Trial Signup Submission
  const handleTrialSubmit = (e) => {
    e.preventDefault();
    if (!trialForm.name || !trialForm.email) return;

    addCustomer({
      name: trialForm.name,
      email: trialForm.email,
      phone: trialForm.phone || "-",
      city: trialForm.showroomName || "Showroom Baru",
      address: "Pendaftaran Akun Trial Baru via Landing Page",
      loyalty: "Bronze",
      totalSpent: 0,
      loyaltyPoints: 0
    });

    setTrialSuccess(true);
    setTimeout(() => {
      setTrialSuccess(false);
      setTrialModalOpen(false);
      setTrialForm({ name: "", email: "", phone: "", showroomName: "" });
    }, 4000);
  };

  // Handle Book Demo Submission
  const handleDemoSubmit = (e) => {
    e.preventDefault();
    if (!demoForm.name || !demoForm.email || !demoForm.date) return;

    addConsultation({
      customerId: 999,
      customerName: demoForm.name,
      roomType: "Demo Live Setup",
      designPreference: demoForm.topic,
      budget: 0,
      date: demoForm.date
    });

    setDemoSuccess(true);
    setTimeout(() => {
      setDemoSuccess(false);
      setDemoForm({ name: "", email: "", date: "", time: "10:00", topic: "Konsultasi Setup CRM" });
    }, 4000);
  };

  // Workflow steps definitions
  const workflowSteps = [
    {
      title: "Registrasi Prospek",
      desc: "Data calon pembeli masuk otomatis dari form showroom fisik, WhatsApp, atau landing page pelanggan.",
      icon: <FiUsers />
    },
    {
      title: "Katalog & Konsultasi",
      desc: "Sales membagikan link e-katalog mebel kustom, lalu menjadwalkan janji konsultasi tata ruang interior.",
      icon: <FiLayers />
    },
    {
      title: "Pembuatan Quotation",
      desc: "Sistem membuatkan draf surat penawaran harga (Quotation) otomatis dengan rincian material kayu & finishing.",
      icon: <FiFileText />
    },
    {
      title: "Konfirmasi Pesanan",
      desc: "Prospek menyetujui quotation, status penawaran otomatis berubah menjadi pesanan (Order) aktif di sistem.",
      icon: <FiCheckCircle />
    },
    {
      title: "Transaksi & Pembayaran",
      desc: "Penerimaan DP/Pelunasan terintegrasi dengan Payment Gateway (Midtrans/Xendit) untuk pencatatan otomatis.",
      icon: <FiDollarSign />
    },
    {
      title: "Produksi di Workshop",
      desc: "Tim produksi/workshop memantau spesifikasi ukuran & bahan, merakit mebel sesuai detail order.",
      icon: <FiArchive />
    },
    {
      title: "Pengiriman Armada",
      desc: "Armada logistik showroom mengirimkan mebel, melacak status pengantaran & konfirmasi penerimaan barang.",
      icon: <FiTruck />
    },
    {
      title: "Feedback Keluhan",
      desc: "Bila terdapat keluhan (misal finishing lecet), tiket CS otomatis terbuka di dasbor admin untuk ditindaklanjuti.",
      icon: <FiMessageSquare />
    },
    {
      title: "Loyalty Membership",
      desc: "Setelah transaksi selesai, sistem memberikan loyalty points dan menaikkan level keanggotaan pelanggan.",
      icon: <FiAward />
    },
    {
      title: "Targeted Campaign",
      desc: "CRM menganalisis riwayat mebel yang dibeli dan mengirim promo kustom (diskon ulang tahun, dll.) via email/WA.",
      icon: <FiPercent />
    }
  ];

  // 10 Features list
  const featuresList = [
    {
      title: "Customer Management (CRM)",
      desc: "Pusatkan data pelanggan showroom, riwayat chat, catatan ukuran ruangan, dan preferensi mebel dalam satu tempat terstruktur.",
      icon: <FiUsers />,
      badge: "Operasional"
    },
    {
      title: "Digital Product Catalog",
      desc: "Kelola stok mebel, jenis kayu (Jati, Mahoni, Walnut), tipe finishing (Melamine, PU), dan foto estetis mebel siap pajang.",
      icon: <FiLayers />,
      badge: "Operasional"
    },
    {
      title: "Sales Order Pipeline",
      desc: "Pantau siklus penjualan dari penawaran awal hingga deal akhir menggunakan papan visual Kanban Sales Pipeline.",
      icon: <FiLayout />,
      badge: "Operasional"
    },
    {
      title: "Kalkulator Quotation Instan",
      desc: "Buat draf penawaran harga mebel kustom, estimasi margin keuntungan, dan kirim file PDF profesional langsung ke customer.",
      icon: <FiFileText />,
      badge: "Operasional"
    },
    {
      title: "Live Stock & Inventory",
      desc: "Pantau ketersediaan kayu mentah, bahan jok kain, hingga mebel jadi di gudang. Dapatkan notifikasi jika stok menipis.",
      icon: <FiArchive />,
      badge: "Operasional"
    },
    {
      title: "Delivery & Assembly Tracker",
      desc: "Atur jadwal rute kurir showroom, status pengantaran, hingga konfirmasi foto tanda terima pemasangan mebel di rumah.",
      icon: <FiTruck />,
      badge: "Logistik"
    },
    {
      title: "Membership & Loyalty Points",
      desc: "Kelola program keanggotaan otomatis (Bronze, Silver, Gold, Platinum, VIP) beserta perhitungan poin bonus belanja.",
      icon: <FiAward />,
      badge: "Strategis"
    },
    {
      title: "Targeted Promotion Campaign",
      desc: "Kirim voucher diskon khusus produk komplementer (misal: penawaran meja kopi setelah pelanggan membeli set sofa).",
      icon: <FiPercent />,
      badge: "Strategis"
    },
    {
      title: "Dashboard Business Analytics",
      desc: "Visualisasi data penjualan, proyeksi pendapatan bulanan, jenis ruangan terpopuler, serta kinerja tim sales showroom.",
      icon: <FiTrendingUp />,
      badge: "Analitis"
    },
    {
      title: "Integrasi Supabase & Cloud",
      desc: "Autentikasi admin aman, database terenkripsi, sinkronisasi cloud real-time, dan akses database yang responsif.",
      icon: <FiCpu />,
      badge: "Teknis"
    }
  ];

  // 10 FAQs
  const faqList = [
    {
      q: "Apa itu Timber CRM?",
      a: "Timber CRM adalah platform manajemen hubungan pelanggan (CRM) terpadu yang dirancang khusus untuk industri retail mebel, showroom furnitur, pabrik kayu, dan desainer interior guna menyatukan database pelanggan, pipeline penjualan, stok gudang, dan logistik pengiriman."
    },
    {
      q: "Apakah sistem ini cocok untuk showroom furnitur skala kecil?",
      a: "Tentu saja. Sistem ini sangat skalabel dan dapat diadaptasi untuk toko mebel kecil independen hingga rantai showroom besar dengan banyak cabang (multi-outlet)."
    },
    {
      q: "Bagaimana cara kerja integrasi database Supabase di platform ini?",
      a: "Timber CRM memanfaatkan Supabase untuk autentikasi admin yang aman serta pencatatan data transaksi terenkripsi. Hal ini menjamin sinkronisasi data yang cepat, aman, dan dapat diakses 24/7."
    },
    {
      q: "Apakah data pelanggan kami aman di dalam sistem?",
      a: "Keamanan adalah prioritas utama kami. Seluruh database dilindungi dengan Row Level Security (RLS) di PostgreSQL Supabase, serta protokol enkripsi SSL saat pengiriman data."
    },
    {
      q: "Apakah ada uji coba (trial) gratis?",
      a: "Ya! Kami menyediakan uji coba gratis selama 14 hari penuh tanpa kartu kredit. Anda dapat mendaftar langsung melalui tombol 'Mulai Gratis' di atas."
    },
    {
      q: "Bagaimana cara menyambungkan WhatsApp dengan CRM ini?",
      a: "Timber CRM mendukung integrasi API WhatsApp Business (seperti Fonnte/Waba) untuk mengirimkan notifikasi otomatis ke pelanggan saat janji konsultasi dibuat, tagihan jatuh tempo, atau mebel mulai dikirim."
    },
    {
      q: "Apakah kami bisa mengimpor data pelanggan lama dari Microsoft Excel?",
      a: "Bisa. Tersedia fitur import wizard di dashboard admin untuk mengimpor file CSV/Excel berisi data kontak pelanggan, katalog produk, dan transaksi lama Anda dalam hitungan menit."
    },
    {
      q: "Apakah tersedia fitur monitoring stok kayu & material mentah?",
      a: "Ya, modul Inventory Management kami mendukung pencatatan material mentah (raw materials) seperti kubikasi kayu jati, persediaan busa jok, cat duco, hingga aksesoris engsel pintu kabinet."
    },
    {
      q: "Bagaimana sistem pembayaran langganan bekerja?",
      a: "Kami menawarkan opsi pembayaran bulanan (SaaS) atau tahunan yang fleksibel, terintegrasi otomatis dengan sistem pembayaran transfer bank, kartu kredit, atau e-wallet."
    },
    {
      q: "Apakah ada tim bantuan teknis untuk proses setup awal?",
      a: "Tentu saja. Seluruh langganan berhak atas layanan panduan setup gratis, migrasi database awal, serta pelatihan dasar untuk admin showroom dan sales Anda."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col text-[#2B2420]" style={{ background: C.bg, fontFamily: "'Inter', sans-serif" }}>
      
      {/* ── 1. Navbar Sticky ── */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-[#E8E2DD]/85 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#79553D] flex items-center justify-center text-white font-extrabold text-xl shadow-sm">
            F
          </div>
          <div className="flex flex-col text-left">
            <span className="font-extrabold text-sm tracking-wider uppercase leading-none text-[#2B2420]">Timber </span>
            <span className="text-[9px] font-extrabold text-[#4A6B46] tracking-widest mt-0.5 uppercase">SaaS Platform</span>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-bold text-[#8A817A]">
          <a href="#features" className="hover:text-[#79553D] transition-colors no-underline">Fitur Utama</a>
          <a href="#workflow" className="hover:text-[#79553D] transition-colors no-underline">Alur Kerja</a>
          <a href="#calculator" className="hover:text-[#79553D] transition-colors no-underline">Kalkulator ROI</a>
          <a href="#wa-simulator" className="hover:text-[#79553D] transition-colors no-underline">Simulasi WhatsApp</a>
          <a href="#faq" className="hover:text-[#79553D] transition-colors no-underline">Pertanyaan</a>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate("/login")}
            className="hidden sm:inline-block text-xs font-bold text-[#79553D] hover:text-[#634430] bg-transparent border-none cursor-pointer"
          >
            Login Admin
          </button>
          <button 
            onClick={() => setTrialModalOpen(true)}
            className="px-4 py-2.5 bg-[#79553D] hover:bg-[#634430] text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer border-none"
          >
            Mulai Gratis
          </button>
        </div>
      </header>

      {/* ── 2. Hero Section ── */}
      <section className="relative px-6 pt-16 pb-20 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 text-left">
        <div className="flex-1 space-y-6 lg:max-w-xl">
          <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#4A6B46] bg-[#E6ECE5] px-3.5 py-1.5 rounded-full border border-[#4A6B46]/20">
            <FiShield className="text-[11px]" /> No. 1 CRM Khusus Showroom Mebel
          </span>
          
          <h1 
            className="text-4xl md:text-5xl font-extrabold leading-tight text-[#2B2420]" 
            style={{ fontFamily: "ui-serif, Georgia, Cambria, serif" }}
          >
            Kelola Bisnis Furniture Lebih Mudah dengan <span className="text-[#79553D]">Timber </span>
          </h1>
          
          <p className="text-sm text-[#8A817A] leading-relaxed">
            Pusatkan data pelanggan showroom, pantau katalog produk kustom, buat surat penawaran quotation otomatis, lacak pengiriman mebel, dan pantau analitik penjualan secara real-time dari satu dashboard modern berbasis cloud.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
            <button
              onClick={() => setTrialModalOpen(true)}
              className="px-6 py-3.5 bg-[#79553D] hover:bg-[#634430] text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all cursor-pointer border-none flex items-center justify-center gap-2"
            >
              Mulai Uji Coba Gratis <FiArrowRight className="text-sm" />
            </button>
            <a
              href="#book-demo"
              className="px-6 py-3.5 bg-white border border-[#E8E2DD] hover:bg-[#FAF6F3] text-[#79553D] rounded-xl text-xs font-bold shadow-xs hover:border-[#79553D]/50 transition-all text-center no-underline flex items-center justify-center gap-1.5"
            >
              <FiPlay className="text-xs" /> Jadwalkan Demo Live
            </a>
          </div>

          {/* Social Proof Badges */}
          <div className="pt-6 border-t border-[#E8E2DD]/70 flex flex-wrap gap-6 items-center">
            <div className="flex -space-x-2">
              <span className="w-8 h-8 rounded-full border-2 border-white bg-amber-700 flex items-center justify-center text-[10px] text-white font-bold">AH</span>
              <span className="w-8 h-8 rounded-full border-2 border-white bg-[#4A6B46] flex items-center justify-center text-[10px] text-white font-bold">SR</span>
              <span className="w-8 h-8 rounded-full border-2 border-white bg-slate-700 flex items-center justify-center text-[10px] text-white font-bold">BS</span>
            </div>
            <div>
              <div className="flex text-amber-500 gap-0.5 text-xs">
                <FiStar className="fill-amber-500" />
                <FiStar className="fill-amber-500" />
                <FiStar className="fill-amber-500" />
                <FiStar className="fill-amber-500" />
                <FiStar className="fill-amber-500" />
              </div>
              <span className="text-[11px] text-[#8A817A] font-semibold mt-0.5 block">
                Dipercaya oleh <strong>120+ Showroom Furnitur</strong> di Indonesia
              </span>
            </div>
          </div>
        </div>

        {/* ── 3. Live Dashboard Preview Mockup (Connected to Context + Configurator Sandbox) ── */}
        <div className="flex-1 w-full lg:max-w-xl">
          <div className="bg-[#1E1B18] text-[#FAF6F3] rounded-3xl p-5 border border-white/10 shadow-2xl relative overflow-hidden">
            {/* Header Mockup */}
            <div className="flex justify-between items-center pb-4 border-b border-white/5">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#B85C5C]" />
                <span className="w-3 h-3 rounded-full bg-[#A86E2E]" />
                <span className="w-3 h-3 rounded-full bg-[#4A6B46]" />
                <span className="text-[10px] font-bold text-white/40 tracking-wider ml-2 uppercase font-mono">LIVE PREVIEW MODUL</span>
              </div>
              
              {/* Tab Selector */}
              <div className="flex gap-1.5 bg-white/5 rounded-lg p-0.5 text-[9px] font-bold">
                <button
                  onClick={() => setActivePreviewTab("analytics")}
                  className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer border-none ${activePreviewTab === "analytics" ? "bg-[#79553D] text-white" : "bg-transparent text-white/50"}`}
                >
                  Analitik
                </button>
                <button
                  onClick={() => setActivePreviewTab("inventory")}
                  className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer border-none ${activePreviewTab === "inventory" ? "bg-[#79553D] text-white" : "bg-transparent text-white/50"}`}
                >
                  Gudang Sandbox
                </button>
              </div>
            </div>

            {activePreviewTab === "analytics" ? (
              <div className="space-y-4 pt-4 text-left">
                {/* Dynamic Stats Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                    <span className="text-[9px] uppercase tracking-wider text-white/45 block">Total Pelanggan</span>
                    <span className="text-xl font-bold text-white font-mono mt-1 block">{liveStats.customers}</span>
                    <span className="text-[8px] text-[#4A6B46] font-semibold mt-0.5 block">↑ 12% Bulan ini</span>
                  </div>
                  <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                    <span className="text-[9px] uppercase tracking-wider text-white/45 block">Total Transaksi Mebel</span>
                    <span className="text-xl font-bold text-white font-mono mt-1 block">{liveStats.orders}</span>
                    <span className="text-[8px] text-[#4A6B46] font-semibold mt-0.5 block">↑ 8% Bulan ini</span>
                  </div>
                  <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                    <span className="text-[9px] uppercase tracking-wider text-white/45 block">Estimasi Revenue Showroom</span>
                    <span className="text-base font-bold text-[#D9B780] font-mono mt-1 block truncate">
                      {liveStats.revenue.toLocaleString("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 })}
                    </span>
                    <span className="text-[8px] text-[#4A6B46] font-semibold mt-0.5 block">Dari data transaksi</span>
                  </div>
                  <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                    <span className="text-[9px] uppercase tracking-wider text-white/45 block">Agenda Konsultasi</span>
                    <span className="text-xl font-bold text-white font-mono mt-1 block">{liveStats.consultations}</span>
                    <span className="text-[8px] text-[#4A6B46] font-semibold mt-0.5 block">Live CRM Booking</span>
                  </div>
                </div>

                {/* Sales Chart Mockup */}
                <div className="bg-white/3 p-3 rounded-xl border border-white/5">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-bold text-white/70">Grafik Penjualan Showroom</span>
                    <span className="text-[8px] text-white/40">Terakhir 4 Bulan</span>
                  </div>
                  <div className="flex justify-between items-end h-20 pt-4 px-2">
                    <div className="flex flex-col items-center w-8 space-y-1">
                      <div className="w-3 bg-white/20 h-8 rounded-t" />
                      <span className="text-[7px] text-white/40">Maret</span>
                    </div>
                    <div className="flex flex-col items-center w-8 space-y-1">
                      <div className="w-3 bg-[#79553D]/40 h-12 rounded-t" />
                      <span className="text-[7px] text-white/40">April</span>
                    </div>
                    <div className="flex flex-col items-center w-8 space-y-1">
                      <div className="w-3 bg-[#79553D]/70 h-16 rounded-t" />
                      <span className="text-[7px] text-white/40">Mei</span>
                    </div>
                    <div className="flex flex-col items-center w-8 space-y-1">
                      <div className="w-3 bg-[#79553D] h-20 rounded-t shadow-[0_0_8px_#79553D]" />
                      <span className="text-[7px] text-white font-bold">Juni</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4 pt-4 text-left">
                {/* Product Configurator Sandbox */}
                <div className="bg-white/5 p-4 rounded-xl border border-white/5 space-y-3.5">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#D9B780] block">Simulasi Konfigurator Produk</span>
                  
                  <div className="grid grid-cols-3 gap-2 text-[10px]">
                    <div>
                      <label className="block text-white/50 mb-1">Jenis Kayu</label>
                      <select 
                        value={sandboxWood} 
                        onChange={(e) => setSandboxWood(e.target.value)}
                        className="w-full bg-white/10 border border-white/10 text-white p-1 rounded outline-none"
                      >
                        <option value="Teak" className="bg-[#1E1B18]">Teak Wood</option>
                        <option value="Oak" className="bg-[#1E1B18]">Oak Wood</option>
                        <option value="Walnut" className="bg-[#1E1B18]">Walnut Wood</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-white/50 mb-1">Finishing</label>
                      <select 
                        value={sandboxFinish} 
                        onChange={(e) => setSandboxFinish(e.target.value)}
                        className="w-full bg-white/10 border border-white/10 text-white p-1 rounded outline-none"
                      >
                        <option value="Natural Oil" className="bg-[#1E1B18]">Natural Oil</option>
                        <option value="Melamine" className="bg-[#1E1B18]">Melamine Gloss</option>
                        <option value="PU Lacquer" className="bg-[#1E1B18]">PU Lacquer</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-white/50 mb-1">Jumlah Unit ({sandboxQty})</label>
                      <input 
                        type="range" 
                        min="1" 
                        max="30" 
                        value={sandboxQty} 
                        onChange={(e) => setSandboxQty(parseInt(e.target.value))}
                        className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#79553D]"
                      />
                    </div>
                  </div>

                  {/* Calculations */}
                  <div className="pt-3.5 border-t border-white/5 grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-[8px] text-white/40 uppercase block">Estimasi Harga / Unit</span>
                      <span className="font-bold text-white font-mono">
                        {stockSandboxEstimate.pricePerUnit.toLocaleString("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 })}
                      </span>
                    </div>
                    <div>
                      <span className="text-[8px] text-white/40 uppercase block">Total Nilai Pesanan</span>
                      <span className="font-bold text-[#D9B780] font-mono">
                        {stockSandboxEstimate.totalPrice.toLocaleString("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 })}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-between items-center text-[10px]">
                    <span className="text-white/60">Status Stok Teranalisis:</span>
                    <span className={`font-bold ${stockSandboxEstimate.statusColor}`}>{stockSandboxEstimate.statusText}</span>
                  </div>
                </div>

                {/* Note message */}
                <p className="text-[9px] text-white/40 italic text-center">
                  *Pilih kayu & finishing di atas untuk memicu notifikasi simulasi WhatsApp di bawah!
                </p>
              </div>
            )}

            {/* Glowing backdrop circle */}
            <div className="absolute -right-16 -bottom-16 w-44 h-44 rounded-full bg-[#79553D]/10 blur-3xl pointer-events-none" />
          </div>
        </div>
      </section>

      {/* ── 3. Trusted Showrooms Logo Ticker ── */}
      <section className="bg-white border-y border-[#E8E2DD]/70 py-8 px-6 text-center">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8A817A] mb-4">
          Telah Membantu Digitalisasi Operasional Showroom
        </p>
        <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-6 max-w-5xl mx-auto">
          {TRUST_LOGOS.map((l, i) => (
            <div key={i} className="flex flex-col items-center">
              <span className="font-extrabold text-base tracking-wider text-[#2B2420]/40 uppercase font-serif">
                {l.name}
              </span>
              <span className="text-[8px] font-bold tracking-widest text-[#8A817A]/55 uppercase -mt-0.5">
                {l.location}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ── 4. Interactive ROI Calculator (Interactive Widget V3) ── */}
      <section id="calculator" className="py-20 px-6 max-w-7xl mx-auto space-y-12">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#79553D]">Kalkulator ROI</span>
          <h2 className="text-3xl font-bold text-[#2B2420] font-serif">Hitung Potensi Kenaikan Omzet Showroom Anda</h2>
          <p className="text-xs text-[#8A817A] font-semibold">
            Geser slider di bawah ini untuk melihat estimasi jam kerja yang dihemat dan proyeksi keuntungan finansial.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Sliders panel */}
          <div className="lg:col-span-5 bg-white border border-[#E8E2DD] rounded-3xl p-6 md:p-8 space-y-6 text-left flex flex-col justify-center">
            {/* Slider 1: Sales Team */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <label className="font-bold text-[#2B2420] uppercase tracking-wider text-[10px]">Jumlah Sales Team</label>
                <span className="font-extrabold text-[#79553D] font-mono text-sm bg-[#FAF6F3] px-2.5 py-0.5 rounded-lg border border-[#E8E2DD]">
                  {roiSalesTeam} Orang
                </span>
              </div>
              <input 
                type="range"
                min="1"
                max="30"
                value={roiSalesTeam}
                onChange={(e) => setRoiSalesTeam(parseInt(e.target.value))}
                className="w-full h-1.5 bg-[#EFEBE7] rounded-lg appearance-none cursor-pointer accent-[#79553D]"
              />
              <span className="text-[9px] text-[#8A817A] block">Mengurangi beban rekap nota & quotation manual per orang.</span>
            </div>

            {/* Slider 2: Showroom Revenue */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <label className="font-bold text-[#2B2420] uppercase tracking-wider text-[10px]">Omzet Bulanan Saat Ini</label>
                <span className="font-extrabold text-[#79553D] font-mono text-xs bg-[#FAF6F3] px-2.5 py-0.5 rounded-lg border border-[#E8E2DD] truncate max-w-[150px]">
                  {roiRevenue.toLocaleString("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 })}
                </span>
              </div>
              <input 
                type="range"
                min="20000000"
                max="1000000000"
                step="10000000"
                value={roiRevenue}
                onChange={(e) => setRoiRevenue(parseInt(e.target.value))}
                className="w-full h-1.5 bg-[#EFEBE7] rounded-lg appearance-none cursor-pointer accent-[#79553D]"
              />
              <span className="text-[9px] text-[#8A817A] block">Omzet gabungan toko retail mebel & pesanan kustom.</span>
            </div>
          </div>

          {/* ROI Outputs panel */}
          <div className="lg:col-span-7 bg-[#FAF6F3] border border-[#E8E2DD] rounded-3xl p-6 md:p-8 grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-[9px] font-bold uppercase tracking-wider text-[#8A817A] block">Jam Kerja Dihemat / Bulan</span>
              <div className="text-3xl font-extrabold text-[#79553D] font-mono flex items-baseline gap-1 justify-center sm:justify-start">
                {roiResults.timeSaved} <span className="text-xs font-bold text-[#8A817A]">Jam</span>
              </div>
              <p className="text-[10px] text-[#8A817A] leading-tight">Berkat otomatisasi PDF quotation & stok gudang.</p>
            </div>

            <div className="space-y-1 text-center sm:text-left">
              <span className="text-[9px] font-bold uppercase tracking-wider text-[#8A817A] block">Potensi Kenaikan Omzet</span>
              <div className="text-xl font-extrabold text-[#4A6B46] font-mono flex items-baseline gap-0.5 justify-center sm:justify-start">
                +Rp {Math.round(roiResults.potentialIncrease / 1000000)}Jt
              </div>
              <p className="text-[10px] text-[#8A817A] leading-tight">Proyeksi kenaikan closing rate penjualan (+26%).</p>
            </div>

            <div className="bg-white border border-[#E8E2DD] rounded-2xl p-5 text-center sm:text-left space-y-1.5 shadow-xs">
              <span className="text-[9px] font-extrabold uppercase tracking-wider text-[#4A6B46] bg-[#E6ECE5] px-2 py-0.5 rounded border border-[#4A6B46]/20 inline-block">
                TOTAL POTENSI PENINGKATAN
              </span>
              <div className="text-lg font-extrabold text-[#2B2420] font-mono">
                Rp {Math.round(roiResults.totalImpact / 1000000)} Juta <span className="text-[9px] font-bold text-[#8A817A]">/ bln</span>
              </div>
              <p className="text-[9px] text-[#8A817A] leading-normal">
                Investasi minim biaya langganan cloud SaaS, hasilkan laba efisiensi bernilai puluhan juta.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. Problem vs. Solution ── */}
      <section className="py-20 px-6 bg-[#FAF6F3] border-y border-[#E8E2DD]/70">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#79553D]">Tantangan Showroom</span>
            <h2 className="text-3xl font-bold text-[#2B2420] tracking-tight font-serif">
              Mengapa Cara Tradisional Menghambat Bisnis Furniture Anda?
            </h2>
            <p className="text-xs text-[#8A817A] font-semibold">
              Beralihlah dari cara manual yang lambat dan berisiko, ke otomatisasi CRM yang cerdas dan efisien.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Old Way */}
            <div className="bg-white rounded-2xl p-8 border border-[#E8E2DD] shadow-sm space-y-5 text-left">
              <h4 className="text-sm font-bold text-[#B85C5C] uppercase tracking-wider flex items-center gap-2">
                ❌ Cara Manual & Konvensional
              </h4>
              <ul className="space-y-4 text-xs text-[#8A817A]">
                <li className="flex gap-2">
                  <span className="text-[#B85C5C] font-bold">•</span>
                  <span>Data pelanggan tersebar di kertas nota, excel terpisah, dan chat WhatsApp sales pribadi. Risiko data hilang sangat besar.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[#B85C5C] font-bold">•</span>
                  <span>Follow-up penawaran prospek telat karena tidak ada reminder, menyebabkan pembeli kabur ke showroom pesaing.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[#B85C5C] font-bold">•</span>
                  <span>Kesulitan memantau stok bahan mentah kayu mentah & status pengerjaan pengrajin mebel di workshop.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[#B85C5C] font-bold">•</span>
                  <span>Owner buta terhadap tren mebel paling laris dan performa real tim sales lapangan karena tidak ada laporan terpadu.</span>
                </li>
              </ul>
            </div>

            {/* New Way */}
            <div className="bg-[#EFEBE7]/70 rounded-2xl p-8 border border-[#79553D]/30 shadow-sm space-y-5 text-left relative overflow-hidden">
              <div className="absolute right-0 top-0 w-24 h-24 bg-[#79553D]/5 rounded-bl-full pointer-events-none" />
              <h4 className="text-sm font-bold text-[#79553D] uppercase tracking-wider flex items-center gap-2">
                ✨ Dengan Timber CRM
              </h4>
              <ul className="space-y-4 text-xs text-[#2B2420]">
                <li className="flex gap-2">
                  <span className="text-[#79553D] font-extrabold">✓</span>
                  <span><strong>Data Terpusat Seketika</strong>: Akses instan ke riwayat transaksi, catatan ukuran, dan material pilihan pembeli secara rapi.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[#79553D] font-extrabold">✓</span>
                  <span><strong>Pipa Penjualan Visual</strong>: Lacak tahapan prospek mebel dengan Kanban sales board agar follow-up selalu teratur.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[#79553D] font-extrabold">✓</span>
                  <span><strong>Stok Bahan Termonitor</strong>: Pengrajin dan admin gudang terhubung memantau persediaan material kayu, cat, dan busa.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[#79553D] font-extrabold">✓</span>
                  <span><strong>Dasbor Laporan Live</strong>: Owner memantau proyeksi omzet bulanan dan metrik performa sales hanya dalam hitungan detik.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. Interactive CRM Workflow Stepper ── */}
      <section id="workflow" className="py-20 px-6 max-w-7xl mx-auto space-y-12">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#4A6B46]">Alur Operasional</span>
          <h2 className="text-3xl font-bold text-[#2B2420] tracking-tight font-serif">
            Workflow Penjualan Mebel Terintegrasi
          </h2>
          <p className="text-xs text-[#8A817A] font-semibold">
            Bagaimana Timber CRM mengawal proses transaksi dari awal registrasi hingga repeat order secara terstruktur.
          </p>
        </div>

        {/* Play / Pause Autoplay */}
        <div className="flex justify-center items-center gap-4 mb-4">
          <button
            type="button"
            onClick={() => setIsWfPlaying(!isWfPlaying)}
            className="px-4 py-2 bg-white border border-[#E8E2DD] text-xs font-bold text-[#79553D] rounded-full shadow-xs flex items-center gap-1.5 cursor-pointer hover:bg-[#FAF6F3]"
          >
            {isWfPlaying ? (
              <>
                <span className="w-2 h-2 bg-[#4A6B46] rounded-full animate-ping inline-block" />
                Pause Auto-Play
              </>
            ) : (
              <>
                <FiPlay className="text-[10px]" />
                Mulai Auto-Play (5s)
              </>
            )}
          </button>
        </div>

        {/* Stepper Timeline Tracker */}
        <div className="relative mb-10 pb-4">
          {/* Progress connecting line */}
          <div className="absolute top-4 left-[30px] right-[30px] h-1 bg-[#E8E2DD] -z-10 rounded-full" />
          <div 
            className="absolute top-4 left-[30px] h-1 bg-[#79553D] -z-10 rounded-full transition-all duration-500"
            style={{ width: `calc(${(activeWorkflowStep / 9) * 100}% - 40px)` }}
          />

          <div className="flex overflow-x-auto gap-2 justify-between py-2">
            {workflowSteps.map((step, idx) => {
              const isActive = activeWorkflowStep === idx;
              const isCompleted = activeWorkflowStep > idx;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setActiveWorkflowStep(idx);
                    setIsWfPlaying(false); // Stop autoplay on manual click
                  }}
                  className="flex-1 min-w-[100px] border-none bg-transparent cursor-pointer flex flex-col items-center gap-2 focus:outline-none"
                >
                  <div 
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-extrabold transition-all duration-300 ${
                      isActive 
                        ? "bg-[#79553D] text-white ring-4 ring-[#79553D]/25 scale-110" 
                        : isCompleted
                          ? "bg-[#4A6B46] text-white shadow-xs"
                          : "bg-white border-2 border-[#E8E2DD] text-[#8A817A] hover:border-[#79553D]"
                    }`}
                  >
                    {isCompleted ? <FiCheck className="text-[11px]" /> : idx + 1}
                  </div>
                  <span className={`text-[9px] leading-tight font-bold tracking-tight text-center ${isActive ? "text-[#79553D]" : "text-[#8A817A]"}`}>
                    {step.title}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Workflow Detail & Simulator Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch bg-white border border-[#E8E2DD] rounded-3xl p-6 md:p-8 shadow-xs text-left">
          
          {/* Left Column: Info & Controls */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <span className="px-2.5 py-0.5 text-[8px] font-extrabold uppercase tracking-wider rounded bg-[#FAF6F3] text-[#79553D] border border-[#E8E2DD] inline-block">
                LANGKAH {activeWorkflowStep + 1} DARI 10
              </span>
              <h3 className="text-xl font-bold text-[#2B2420] font-serif tracking-tight">
                {workflowSteps[activeWorkflowStep].title}
              </h3>
              <p className="text-xs text-[#8A817A] leading-relaxed">
                {workflowSteps[activeWorkflowStep].desc}
              </p>
            </div>

            {/* Stepper buttons */}
            <div className="flex items-center gap-3 pt-6 border-t border-[#E8E2DD]/50">
              <button
                type="button"
                disabled={activeWorkflowStep === 0}
                onClick={() => {
                  setActiveWorkflowStep((prev) => Math.max(0, prev - 1));
                  setIsWfPlaying(false);
                }}
                className="flex-1 py-2 bg-transparent border border-[#E8E2DD] hover:bg-[#FAF6F3] text-[#8A817A] hover:text-[#2B2420] disabled:opacity-40 disabled:hover:bg-transparent rounded-lg text-xs font-bold cursor-pointer transition-colors"
              >
                Kembali
              </button>
              <button
                type="button"
                disabled={activeWorkflowStep === 9}
                onClick={() => {
                  setActiveWorkflowStep((prev) => Math.min(9, prev + 1));
                  setIsWfPlaying(false);
                }}
                className="flex-1 py-2 bg-[#79553D] hover:bg-[#634430] text-white disabled:opacity-40 rounded-lg text-xs font-bold cursor-pointer transition-all border-none"
              >
                Lanjutkan
              </button>
            </div>
          </div>

          {/* Right Column: Interactive Sandbox Sandbox */}
          <div className="lg:col-span-7 bg-[#FAF6F3] border border-[#E8E2DD] rounded-2xl p-5 md:p-6 flex flex-col justify-center min-h-[260px]">
            {activeWorkflowStep === 0 && (
              <div className="space-y-4">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#4A6B46] block">
                  Simulasi Input Prospek Baru
                </span>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[9px] font-bold uppercase tracking-wider text-[#8A817A] mb-1">Nama Prospek</label>
                      <input 
                        type="text" 
                        value={wfLeadName} 
                        onChange={(e) => {
                          setWfLeadName(e.target.value);
                          setWfLeadLogged(false);
                        }}
                        className="w-full px-2.5 py-1.5 border border-[#E8E2DD] bg-white rounded-lg text-xs outline-none focus:border-[#79553D]"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold uppercase tracking-wider text-[#8A817A] mb-1">Kota Domisili</label>
                      <input 
                        type="text" 
                        value={wfLeadCity} 
                        onChange={(e) => {
                          setWfLeadCity(e.target.value);
                          setWfLeadLogged(false);
                        }}
                        className="w-full px-2.5 py-1.5 border border-[#E8E2DD] bg-white rounded-lg text-xs outline-none focus:border-[#79553D]"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setWfLeadLog(`[INFO] Menyambungkan ke Supabase Cloud...\n[INFO] Mengirim payload: { name: "${wfLeadName}", city: "${wfLeadCity}" }\n[SUKSES] Prospek baru disimpan! ID: #MBR-${Math.floor(Math.random() * 800 + 100)}`);
                      setWfLeadLogged(true);
                    }}
                    className="w-full py-2.5 bg-[#79553D] hover:bg-[#634430] text-white text-xs font-bold rounded-lg cursor-pointer border-none"
                  >
                    Kirim Prospek ke Database CRM
                  </button>
                </div>
                {wfLeadLogged && (
                  <pre className="p-3 bg-[#1E1B18] text-[#4A6B46] font-mono text-[9px] rounded-lg whitespace-pre-line leading-relaxed">
                    {wfLeadLog}
                  </pre>
                )}
              </div>
            )}

            {activeWorkflowStep === 1 && (
              <div className="space-y-4">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#4A6B46] block">
                  Simulasi Konfigurator Konsultasi Desain
                </span>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-wider text-[#8A817A] mb-1">Tipe Ruangan</label>
                    <select 
                      value={wfRoomType} 
                      onChange={(e) => setWfRoomType(e.target.value)}
                      className="w-full p-2 border border-[#E8E2DD] rounded-lg outline-none bg-white"
                    >
                      <option value="Living Room">Ruang Tamu</option>
                      <option value="Dining Room">Ruang Makan</option>
                      <option value="Bedroom">Kamar Tidur</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-wider text-[#8A817A] mb-1">Gaya Desain</label>
                    <select 
                      value={wfDesignPref} 
                      onChange={(e) => setWfDesignPref(e.target.value)}
                      className="w-full p-2 border border-[#E8E2DD] rounded-lg outline-none bg-white"
                    >
                      <option value="Japandi">Japandi</option>
                      <option value="Minimalis">Minimalis</option>
                      <option value="Scandinavian">Scandinavian</option>
                    </select>
                  </div>
                </div>
                
                <div className="p-3 bg-white rounded-xl border border-[#E8E2DD] space-y-1">
                  <span className="text-[9px] uppercase tracking-wider text-[#8A817A] font-bold">Rekomendasi Paket Mebel:</span>
                  <p className="text-xs text-[#2B2420] font-bold">
                    Set {wfRoomType} - Gaya {wfDesignPref}
                  </p>
                  <p className="text-[10px] text-[#8A817A] leading-relaxed">
                    Kombinasi material kayu solid dengan tekstur linen alami. Estimasi budget: Rp 24Jt - Rp 38Jt.
                  </p>
                </div>
              </div>
            )}

            {activeWorkflowStep === 2 && (
              <div className="space-y-4">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#4A6B46] block">
                  Simulasi Pembuat Penawaran Harga (PDF)
                </span>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-wider text-[#8A817A] mb-1">Bahan Kayu</label>
                    <select 
                      value={wfQuoteWood} 
                      onChange={(e) => {
                        setWfQuoteWood(e.target.value);
                        setWfQuoteGenerated(false);
                      }}
                      className="w-full p-2 border border-[#E8E2DD] rounded-lg outline-none bg-white"
                    >
                      <option value="Teak Wood">Solid Teak Wood</option>
                      <option value="Oak Wood">American White Oak</option>
                      <option value="Walnut Wood">French Walnut</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-wider text-[#8A817A] mb-1">Jumlah Unit</label>
                    <div className="flex items-center border border-[#E8E2DD] rounded-lg p-0.5 bg-white">
                      <button 
                        type="button"
                        onClick={() => { setWfQuoteQty(Math.max(1, wfQuoteQty - 1)); setWfQuoteGenerated(false); }}
                        className="w-8 py-1 bg-transparent hover:bg-[#FAF6F3] border-none font-bold text-xs cursor-pointer"
                      >-</button>
                      <span className="flex-1 text-center font-bold text-xs">{wfQuoteQty}</span>
                      <button 
                        type="button"
                        onClick={() => { setWfQuoteQty(wfQuoteQty + 1); setWfQuoteGenerated(false); }}
                        className="w-8 py-1 bg-transparent hover:bg-[#FAF6F3] border-none font-bold text-xs cursor-pointer"
                      >+</button>
                    </div>
                  </div>
                </div>
                
                <button
                  type="button"
                  onClick={() => setWfQuoteGenerated(true)}
                  className="w-full py-2 bg-[#79553D] hover:bg-[#634430] text-white text-xs font-bold rounded-lg cursor-pointer border-none"
                >
                  Generate Quotation Invoice
                </button>

                {wfQuoteGenerated && (
                  <div className="p-3.5 bg-white border-2 border-dashed border-[#E8E2DD] rounded-xl font-mono text-[10px] text-[#2B2420] space-y-1 relative">
                    <div className="absolute right-3 top-3 text-[9px] text-[#4A6B46] font-bold border border-[#4A6B46] px-1 rounded uppercase tracking-wider">DRAFT</div>
                    <h6 className="font-extrabold border-b border-[#E8E2DD] pb-1 uppercase">Timber CRM INVOICE</h6>
                    <p>Klien: {wfLeadName}</p>
                    <p>Bahan: 1x {wfQuoteWood} Set</p>
                    <p>Jumlah: {wfQuoteQty} Pcs</p>
                    <p className="font-bold border-t border-[#E8E2DD] pt-1">
                      Estimasi: Rp {(wfQuoteQty * (wfQuoteWood === "Walnut Wood" ? 7500000 : wfQuoteWood === "Oak Wood" ? 5200000 : 4500000)).toLocaleString("id-ID")}
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeWorkflowStep === 3 && (
              <div className="space-y-4">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#4A6B46] block">
                  Simulasi Tanda Tangan Kontrak Sales
                </span>
                <p className="text-[11px] text-[#8A817A] leading-relaxed">
                  Prospek mebel kustom menyetujui detail quotation. Klik tombol di bawah untuk menyegel kontrak penjualan digital.
                </p>

                <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-[#E8E2DD] rounded-2xl bg-white relative overflow-hidden h-32">
                  {wfSigned ? (
                    <div className="text-center space-y-1.5">
                      <span className="text-3xl">🛡️</span>
                      <h5 className="text-xs font-extrabold text-[#4A6B46] tracking-widest uppercase">CONTRACT LOCKED & SECURED</h5>
                      <span className="text-[8px] font-mono text-slate-500">Hash: 8b73f8a9e1022c091054</span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setWfSigned(true)}
                      className="px-6 py-2.5 bg-[#4A6B46] hover:bg-[#3B5537] text-white text-xs font-bold rounded-lg shadow-sm cursor-pointer border-none"
                    >
                      Bubuhkan Tanda Tangan Digital
                    </button>
                  )}
                </div>
                {wfSigned && (
                  <button 
                    type="button"
                    onClick={() => setWfSigned(false)}
                    className="text-[9px] text-[#B85C5C] font-semibold hover:underline block text-center mx-auto border-none bg-transparent cursor-pointer"
                  >
                    Reset Tanda Tangan
                  </button>
                )}
              </div>
            )}

            {activeWorkflowStep === 4 && (
              <div className="space-y-4">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#4A6B46] block">
                  Simulasi Pembayaran DP (Payment Gateway)
                </span>
                
                <div className="space-y-3">
                  <div className="flex gap-2">
                    {["Virtual Account", "Credit Card", "E-Wallet"].map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => { setWfPayMethod(m); setWfPaid(false); }}
                        className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold border transition-colors cursor-pointer ${wfPayMethod === m ? "bg-[#FAF6F3] border-[#79553D] text-[#79553D]" : "bg-white border-[#E8E2DD] text-[#8A817A]"}`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>

                  <div className="p-3 bg-white border border-[#E8E2DD] rounded-xl flex justify-between items-center text-xs">
                    <div>
                      <span className="text-[8px] text-[#8A817A] uppercase block">Uang Muka (DP 30%)</span>
                      <span className="font-extrabold text-[#2B2420]">Rp 4.500.000</span>
                    </div>
                    <span className="text-[9px] text-slate-500 font-mono">ID: Midtrans-TRX-101</span>
                  </div>

                  {wfPaid ? (
                    <div className="p-2.5 bg-[#E6ECE5] border border-[#4A6B46]/35 text-[#4A6B46] text-xs font-bold text-center rounded-xl flex items-center justify-center gap-1.5">
                      <FiCheckCircle /> DP Sukses Terbayar (Status: LUNAS SEBAGIAN)
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setWfPaid(true)}
                      className="w-full py-2 bg-[#79553D] hover:bg-[#634430] text-white text-xs font-bold rounded-lg cursor-pointer border-none"
                    >
                      Bayar DP via {wfPayMethod}
                    </button>
                  )}
                </div>
              </div>
            )}

            {activeWorkflowStep === 5 && (
              <div className="space-y-4">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#4A6B46] block">
                  Simulasi Workshop Production Tracker
                </span>

                <div className="space-y-2 text-xs">
                  {[
                    { label: "Pemotongan Papan Kayu", idx: 0 },
                    { label: "Perakitan Rangka Mebel", idx: 1 },
                    { label: "Finishing & Coating Melamine", idx: 2 },
                    { label: "Quality Control & Wrapping", idx: 3 }
                  ].map((stage) => {
                    const isDone = wfProdProgress > stage.idx;
                    const isCurrent = wfProdProgress === stage.idx;
                    return (
                      <div key={stage.idx} className="flex justify-between items-center p-2 rounded-lg bg-white border border-[#E8E2DD]/70">
                        <span className={`${isDone ? "text-[#8A817A] line-through" : "text-[#2B2420] font-semibold"}`}>
                          {stage.label}
                        </span>
                        {isDone ? (
                          <span className="text-[#4A6B46] font-bold text-[10px]">✓ SELESAI</span>
                        ) : isCurrent ? (
                          <span className="text-[#A86E2E] font-bold text-[10px] animate-pulse">⚡ BERJALAN</span>
                        ) : (
                          <span className="text-slate-400 text-[10px]">MENUNGGU</span>
                        )}
                      </div>
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={() => setWfProdProgress((prev) => (prev < 4 ? prev + 1 : 0))}
                  className="w-full py-2 bg-[#79553D] hover:bg-[#634430] text-white text-xs font-bold rounded-lg cursor-pointer border-none text-center block"
                >
                  {wfProdProgress === 4 ? "Reset Progress Produksi" : "Lanjutkan ke Tahap Berikutnya"}
                </button>
              </div>
            )}

            {activeWorkflowStep === 6 && (
              <div className="space-y-4">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#4A6B46] block">
                  Simulasi Lacak Kurir & Peta
                </span>
                <p className="text-[11px] text-[#8A817A] leading-relaxed">
                  Mebel dikirim menggunakan mobil box showroom. Klik tombol di bawah untuk menyimulasikan perjalanan armada.
                </p>

                {/* Simulated GPS path */}
                <div className="p-3 bg-white border border-[#E8E2DD] rounded-xl space-y-2">
                  <div className="flex justify-between text-[10px] font-bold text-[#8A817A]">
                    <span>Workshop Jepara</span>
                    <span>Rumah {wfLeadName}</span>
                  </div>
                  
                  <div className="relative w-full h-2 bg-[#EFEBE7] rounded-full overflow-hidden">
                    <div 
                      className="absolute top-0 bottom-0 bg-[#79553D] transition-all duration-500 rounded-full" 
                      style={{ width: `${wfDeliverProgress}%` }}
                    />
                    <div 
                      className="absolute top-1/2 -translate-y-1/2 w-4.5 h-4.5 rounded-full bg-white border-2 border-[#79553D] flex items-center justify-center transition-all duration-500 shadow-xs" 
                      style={{ left: `calc(${wfDeliverProgress}% - 9px)` }}
                    >
                      🚚
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-[10px] pt-1">
                    <span className="text-[#8A817A]">Status Kurir:</span>
                    <span className="font-extrabold text-[#2B2420]">
                      {wfDeliverProgress === 0 ? "Menunggu Kirim" : wfDeliverProgress === 100 ? "Barang Tiba & Dipasang! ✓" : `Dalam Perjalanan (${wfDeliverProgress}%)`}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setWfDeliverProgress(0);
                      let current = 0;
                      const timer = setInterval(() => {
                        current += 20;
                        if (current >= 100) {
                          setWfDeliverProgress(100);
                          clearInterval(timer);
                        } else {
                          setWfDeliverProgress(current);
                        }
                      }, 600);
                    }}
                    className="flex-1 py-2 bg-[#79553D] hover:bg-[#634430] text-white text-xs font-bold rounded-lg cursor-pointer border-none text-center"
                  >
                    Kirim Armada
                  </button>
                  <button
                    type="button"
                    onClick={() => setWfDeliverProgress(0)}
                    className="px-3 py-2 bg-transparent border border-[#E8E2DD] rounded-lg text-xs text-[#8A817A] hover:bg-[#FAF6F3] cursor-pointer"
                  >
                    Reset
                  </button>
                </div>
              </div>
            )}

            {activeWorkflowStep === 7 && (
              <div className="space-y-4">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#4A6B46] block">
                  Simulasi Form Survey Kepuasan Pelanggan
                </span>

                <div className="space-y-4 text-center">
                  <div className="flex justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => { setWfReviewStars(star); setWfReviewSubmitted(false); }}
                        className="text-2xl hover:scale-125 transition-transform bg-transparent border-none cursor-pointer p-0"
                      >
                        <FiStar className={star <= wfReviewStars ? "fill-amber-500 text-amber-500" : "text-slate-300"} />
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => setWfReviewSubmitted(true)}
                    className="w-full py-2 bg-[#79553D] hover:bg-[#634430] text-white text-xs font-bold rounded-lg cursor-pointer border-none"
                  >
                    Kirim Ulasan Pelanggan
                  </button>

                  {wfReviewSubmitted && (
                    <div className="p-3 bg-white border border-[#E8E2DD] rounded-xl text-left text-[11px] space-y-1">
                      {wfReviewStars <= 2 ? (
                        <>
                          <span className="text-[#B85C5C] font-extrabold uppercase block text-[8px] tracking-wider animate-pulse">⚠️ ALARM CS TICKET CREATED</span>
                          <p className="text-[#8A817A] leading-normal">
                            Ulasan buruk terdeteksi (Bintang {wfReviewStars}). CRM otomatis membuka tiket CS keluhan produk untuk investigasi tim retur.
                          </p>
                        </>
                      ) : (
                        <>
                          <span className="text-[#4A6B46] font-extrabold uppercase block text-[8px] tracking-wider">✓ FEEDBACK SUBMITTED</span>
                          <p className="text-[#8A817A] leading-normal">
                            Rating bintang {wfReviewStars} diterima! Status pelanggan puas. Terima kasih atas masukan positif Anda.
                          </p>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeWorkflowStep === 8 && (
              <div className="space-y-4">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#4A6B46] block">
                  Simulasi Kenaikan Level Anggota
                </span>

                <div className="p-4 bg-gradient-to-br from-[#FAF6F3] via-white to-[#F5ECE5] border border-[#E8E2DD] rounded-2xl relative overflow-hidden space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[8px] uppercase tracking-wider text-[#8A817A] block">Timber LOYALTY CARD</span>
                      <h5 className="text-base font-bold text-[#2B2420]">{wfLeadName}</h5>
                    </div>
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-[#FAF0E6] text-[#8C5E3C] border border-[#E3D1C1]">
                      {wfLoyaltyTier} Member
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-end pt-3 text-xs border-t border-[#E8E2DD]/40">
                    <div>
                      <span className="text-[8px] text-[#8A817A] uppercase block">Poin Reward</span>
                      <span className="font-mono font-extrabold text-sm">{wfPoints} Pts</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[8px] text-[#8A817A] uppercase block">Total Belanja</span>
                      <span className="font-mono text-slate-600">Rp 12.500.000</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setWfPoints(wfPoints + 500);
                      if (wfPoints + 500 >= 2000) setWfLoyaltyTier("Gold");
                      else if (wfPoints + 500 >= 1500) setWfLoyaltyTier("Silver");
                    }}
                    className="flex-1 py-2 bg-[#79553D] hover:bg-[#634430] text-white text-xs font-bold rounded-lg cursor-pointer border-none"
                  >
                    Simulasikan Belanja (+500 Poin)
                  </button>
                  <button
                    type="button"
                    onClick={() => { setWfPoints(1000); setWfLoyaltyTier("Bronze"); }}
                    className="px-3 py-2 bg-transparent border border-[#E8E2DD] rounded-lg text-xs text-[#8A817A] hover:bg-[#FAF6F3] cursor-pointer"
                  >
                    Reset
                  </button>
                </div>
              </div>
            )}

            {activeWorkflowStep === 9 && (
              <div className="space-y-4">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#4A6B46] block">
                  Simulasi Automasi Campaign Marketing
                </span>
                <p className="text-[11px] text-[#8A817A] leading-relaxed">
                  CRM mendeteksi {wfLeadName} baru berbelanja produk mebel kustom. Sistem otomatis menyusun email kampanye repeat order.
                </p>

                {wfCampaignSent ? (
                  <div className="p-3.5 bg-white border border-[#79553D]/30 rounded-xl space-y-2 text-xs relative animate-pulse">
                    <div className="flex justify-between items-center text-[9px] text-[#79553D] font-bold border-b border-[#E8E2DD]/60 pb-1.5">
                      <span>Subjek: Rekomendasi Khusus Untuk {wfLeadName}</span>
                      <span>Email Terkirim!</span>
                    </div>
                    <p className="text-[10px] text-[#2B2420] leading-relaxed">
                      "Halo {wfLeadName}, kami melihat Anda menyukai kayu {sandboxWood}. Dapatkan penawaran meja kopi komplementer dengan voucher 15%: **WOOD2026**."
                    </p>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setWfCampaignSent(true)}
                    className="w-full py-2.5 bg-[#4A6B46] hover:bg-[#3B5537] text-white text-xs font-bold rounded-lg cursor-pointer border-none text-center"
                  >
                    Simulasikan Kirim Email Promosi Otomatis
                  </button>
                )}
                {wfCampaignSent && (
                  <button
                    type="button"
                    onClick={() => setWfCampaignSent(false)}
                    className="text-[9px] text-[#8A817A] hover:underline block text-center mx-auto border-none bg-transparent cursor-pointer"
                  >
                    Reset Simulasi
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── 7. Live WhatsApp Notification Simulator (Interactive Widget V3) ── */}
      <section id="wa-simulator" className="py-20 px-6 bg-[#FAF6F3] border-y border-[#E8E2DD]/70">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#4A6B46]">Simulasi Interaktif</span>
            <h2 className="text-3xl font-bold text-[#2B2420] font-serif">Simulasi Pengiriman Notifikasi WhatsApp</h2>
            <p className="text-xs text-[#8A817A] font-semibold">
              Ketik nama Anda dan klik tombol pemicu untuk melihat simulasi pesan WhatsApp otomatis dari sistem CRM.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Interactive Control Panel */}
            <div className="lg:col-span-5 bg-white border border-[#E8E2DD] rounded-3xl p-6 md:p-8 space-y-5 text-left">
              {/* Name Input */}
              <div className="space-y-2">
                <label className="block text-[9px] font-bold uppercase tracking-wider text-[#8A817A]">1. Tulis Nama Anda (Untuk Personalisasi)</label>
                <input 
                  type="text"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="Ketik nama Anda di sini..."
                  className="w-full px-3 py-2 border border-[#E8E2DD] bg-white rounded-xl text-xs text-[#2B2420] outline-none focus:border-[#79553D]"
                />
              </div>

              {/* Simulation Buttons */}
              <div className="space-y-2.5">
                <label className="block text-[9px] font-bold uppercase tracking-wider text-[#8A817A]">2. Pilih Pemicu Alur Transaksi</label>
                <div className="grid grid-cols-1 gap-2">
                  <button
                    onClick={() => setWaSimulationType("lead")}
                    className={`px-4 py-3 rounded-xl text-xs font-bold text-left border flex items-center justify-between transition-all cursor-pointer ${waSimulationType === "lead" ? "bg-[#79553D] border-[#79553D] text-white" : "bg-white border-[#E8E2DD] text-[#2B2420] hover:bg-[#FAF6F3]"}`}
                  >
                    <span>Pelanggan Baru (Lead Follow-up)</span>
                    <FiArrowRight />
                  </button>
                  <button
                    onClick={() => setWaSimulationType("dp")}
                    className={`px-4 py-3 rounded-xl text-xs font-bold text-left border flex items-center justify-between transition-all cursor-pointer ${waSimulationType === "dp" ? "bg-[#79553D] border-[#79553D] text-white" : "bg-white border-[#E8E2DD] text-[#2B2420] hover:bg-[#FAF6F3]"}`}
                  >
                    <span>DP / Pembayaran Terkonfirmasi</span>
                    <FiArrowRight />
                  </button>
                  <button
                    onClick={() => setWaSimulationType("kirim")}
                    className={`px-4 py-3 rounded-xl text-xs font-bold text-left border flex items-center justify-between transition-all cursor-pointer ${waSimulationType === "kirim" ? "bg-[#79553D] border-[#79553D] text-white" : "bg-white border-[#E8E2DD] text-[#2B2420] hover:bg-[#FAF6F3]"}`}
                  >
                    <span>Mebel Sedang Dikirim Driver</span>
                    <FiArrowRight />
                  </button>
                  <button
                    onClick={() => setWaSimulationType("feedback")}
                    className={`px-4 py-3 rounded-xl text-xs font-bold text-left border flex items-center justify-between transition-all cursor-pointer ${waSimulationType === "feedback" ? "bg-[#79553D] border-[#79553D] text-white" : "bg-white border-[#E8E2DD] text-[#2B2420] hover:bg-[#FAF6F3]"}`}
                  >
                    <span>Minta Ulasan & Feedback CS</span>
                    <FiArrowRight />
                  </button>
                </div>
              </div>
            </div>

            {/* Simulated Phone UI Screen */}
            <div className="lg:col-span-7 flex justify-center">
              <div className="relative w-72 h-[480px] bg-black rounded-[40px] border-4 border-slate-800 shadow-2xl p-3 flex flex-col justify-between overflow-hidden">
                {/* Phone Speaker/Camera notch */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-b-xl z-20 flex justify-center items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-900 mr-2" />
                  <span className="w-12 h-1 bg-slate-950 rounded-full" />
                </div>

                {/* WhatsApp Chat interface */}
                <div className="flex-1 bg-[#ECE5DD] rounded-[30px] pt-7 p-3 flex flex-col justify-between overflow-hidden text-left relative">
                  {/* Phone Status bar mock */}
                  <div className="absolute top-1 inset-x-4 flex justify-between text-[8px] font-bold text-black/60 font-mono">
                    <span>09:41</span>
                    <div className="flex gap-1">
                      <span>LTE</span>
                      <span>100%</span>
                    </div>
                  </div>

                  {/* Chat Header */}
                  <div className="bg-[#075E54] text-white p-2 rounded-t-xl -mx-3 -mt-7 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-bold">TC</div>
                    <div>
                      <h6 className="text-[10px] font-bold leading-none">Timber Showroom</h6>
                      <span className="text-[7px] text-white/70">Online</span>
                    </div>
                  </div>

                  {/* Chat bubble body */}
                  <div className="flex-1 py-4 flex flex-col justify-end space-y-3 overflow-y-auto">
                    {/* Received Message Bubble */}
                    <div className="bg-white rounded-lg p-2.5 shadow-xs text-[10px] max-w-[85%] self-start relative">
                      <p className="whitespace-pre-line text-[#2B2420] font-sans leading-normal">
                        {simulatedWaMessage}
                      </p>
                      <span className="text-[7px] text-[#8A817A] absolute bottom-1 right-2 font-mono">09:41</span>
                    </div>
                  </div>

                  {/* Chat Input bar */}
                  <div className="bg-white rounded-full p-2 -mx-1 flex justify-between items-center text-[10px] text-black/30 border border-black/5">
                    <span>Ketik balasan...</span>
                    <span className="w-5 h-5 rounded-full bg-[#128C7E] text-white flex items-center justify-center text-xs">
                      <FiSend className="text-[9px]" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 8. Feature Grid Section ── */}
      <section id="features" className="py-20 px-6 max-w-7xl mx-auto space-y-12">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#79553D]">Fitur Platform</span>
          <h2 className="text-3xl font-bold text-[#2B2420] font-serif">Fitur Lengkap Modern SaaS Timber CRM</h2>
          <p className="text-xs text-[#8A817A] font-semibold">
            Platform modern dengan set lengkap modul operasional untuk mempercepat laju pertumbuhan bisnis retail mebel.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuresList.map((f, idx) => (
            <div
              key={idx}
              className="bg-white border border-[#E8E2DD] rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-md hover:border-[#79553D]/40 text-left space-y-4"
            >
              <div className="flex justify-between items-center">
                <div className="w-10 h-10 rounded-xl bg-[#FAF6F3] text-[#79553D] flex items-center justify-center text-lg">
                  {f.icon}
                </div>
                <span className="px-2.5 py-0.5 text-[8px] font-extrabold uppercase tracking-wider rounded bg-[#FAF6F3] text-[#79553D] border border-[#E8E2DD]">
                  {f.badge}
                </span>
              </div>
              <div className="space-y-1.5">
                <h4 className="text-sm font-bold text-[#2B2420] font-serif">{f.title}</h4>
                <p className="text-xs text-[#8A817A] leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 9. Integrations Center ── */}
      <section className="py-20 px-6 max-w-7xl mx-auto bg-white rounded-3xl border border-[#E8E2DD]/80 space-y-12">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#4A6B46]">Ekosistem Terhubung</span>
          <h2 className="text-3xl font-bold text-[#2B2420] font-serif">Integrasi Aplikasi Eksternal Tanpa Batas</h2>
          <p className="text-xs text-[#8A817A] font-semibold">
            Sinkronkan Timber CRM dengan berbagai aplikasi favorit tim Anda untuk mendukung otomatisasi kerja maksimal.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 p-4">
          <div className="bg-[#FAFAFA] border border-[#E8E2DD] rounded-2xl p-5 flex flex-col items-center text-center space-y-3">
            <span className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-lg">WA</span>
            <h5 className="text-xs font-bold text-[#2B2420]">WhatsApp API</h5>
            <span className="text-[9px] font-extrabold text-[#4A6B46] px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200">TERHUBUNG</span>
          </div>
          <div className="bg-[#FAFAFA] border border-[#E8E2DD] rounded-2xl p-5 flex flex-col items-center text-center space-y-3">
            <span className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold text-lg">GM</span>
            <h5 className="text-xs font-bold text-[#2B2420]">Gmail System</h5>
            <span className="text-[9px] font-extrabold text-[#4A6B46] px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200">TERHUBUNG</span>
          </div>
          <div className="bg-[#FAFAFA] border border-[#E8E2DD] rounded-2xl p-5 flex flex-col items-center text-center space-y-3">
            <span className="w-10 h-10 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center font-bold text-lg">SP</span>
            <h5 className="text-xs font-bold text-[#2B2420]">Supabase DB</h5>
            <span className="text-[9px] font-extrabold text-[#4A6B46] px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200">TERHUBUNG</span>
          </div>
          <div className="bg-[#FAFAFA] border border-[#E8E2DD] rounded-2xl p-5 flex flex-col items-center text-center space-y-3">
            <span className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg">MT</span>
            <h5 className="text-xs font-bold text-[#2B2420]">Midtrans PG</h5>
            <span className="text-[9px] font-bold text-[#A86E2E] px-2 py-0.5 rounded bg-amber-50 border border-amber-200">SIAP SETUP</span>
          </div>
          <div className="bg-[#FAFAFA] border border-[#E8E2DD] rounded-2xl p-5 flex flex-col items-center text-center space-y-3">
            <span className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center font-bold text-lg">GC</span>
            <h5 className="text-xs font-bold text-[#2B2420]">Google Calendar</h5>
            <span className="text-[9px] font-bold text-[#A86E2E] px-2 py-0.5 rounded bg-amber-50 border border-amber-200">SIAP SETUP</span>
          </div>
        </div>
      </section>

      {/* ── 10. Testimonials ── */}
      <section className="py-20 px-6 bg-[#FAF6F3] border-y border-[#E8E2DD]/70">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#79553D]">Testimonial</span>
            <h2 className="text-3xl font-bold text-[#2B2420] font-serif">Kata Mereka yang Telah Sukses</h2>
            <p className="text-xs text-[#8A817A] font-semibold">
              Kisah nyata transformasi bisnis dari pemilik showroom furniture di berbagai penjuru Indonesia.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="bg-white border border-[#E8E2DD] rounded-2xl p-6 flex flex-col justify-between text-left space-y-4 shadow-xs">
                <p className="text-xs text-[#8A817A] leading-relaxed italic">
                  "{t.quote}"
                </p>
                <div className="flex items-center gap-3 pt-3 border-t border-[#E8E2DD]/40">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs ${t.avatarColor}`}>
                    {t.author.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-[#2B2420]">{t.author}</h5>
                    <span className="text-[9px] text-[#8A817A] font-semibold">{t.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 11. Interactive Lead Form: Book a Demo ── */}
      <section id="book-demo" className="py-20 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 text-left space-y-4">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#4A6B46]">Jadwalkan Live Demo</span>
            <h2 className="text-3xl font-bold text-[#2B2420] font-serif">Lihat Bagaimana Timber CRM Bekerja untuk Anda</h2>
            <p className="text-xs text-[#8A817A] leading-relaxed">
              Dapatkan sesi presentasi privat selama 30 menit bersama spesialis CRM kami untuk mendiskusikan workflow toko mebel Anda, strategi otomatisasi follow-up sales, hingga penyesuaian integrasi database Supabase.
            </p>
            <div className="space-y-2 pt-2 text-xs text-[#8A817A]">
              <div className="flex items-center gap-2">
                <FiCheck className="text-[#4A6B46] font-bold" /> Gratis & Tanpa Kontrak Langganan
              </div>
              <div className="flex items-center gap-2">
                <FiCheck className="text-[#4A6B46] font-bold" /> Q&A Interaktif Tanya Jawab Teknis
              </div>
              <div className="flex items-center gap-2">
                <FiCheck className="text-[#4A6B46] font-bold" /> Solusi Skema Kustom Showroom Anda
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 bg-[#FAFAFA] border border-[#E8E2DD] rounded-3xl p-6 md:p-8">
            {demoSuccess ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-[#E6ECE5] text-[#4A6B46] flex items-center justify-center mx-auto text-xl">
                  <FiCheck />
                </div>
                <h4 className="text-base font-bold text-[#2B2420] font-serif">Jadwal Demo Berhasil Dibuat!</h4>
                <p className="text-xs text-[#8A817A] max-w-md mx-auto leading-relaxed">
                  Terima kasih, <strong>{demoForm.name}</strong>. Permintaan demo Anda tentang tema <strong>{demoForm.topic}</strong> telah masuk ke database konsultasi CRM kami. Tim kami akan menghubungi Anda via email dalam waktu dekat.
                </p>
              </div>
            ) : (
              <form onSubmit={handleDemoSubmit} className="space-y-4 text-left">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-wider text-[#8A817A] mb-1.5">Nama Lengkap</label>
                    <input 
                      type="text" 
                      required
                      value={demoForm.name}
                      onChange={(e) => setDemoForm({...demoForm, name: e.target.value})}
                      placeholder="Contoh: Budi Santoso"
                      className="w-full px-3 py-2.5 border border-[#E8E2DD] bg-white rounded-xl text-xs text-[#2B2420] outline-none focus:border-[#79553D]"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-wider text-[#8A817A] mb-1.5">Email Bisnis</label>
                    <input 
                      type="email" 
                      required
                      value={demoForm.email}
                      onChange={(e) => setDemoForm({...demoForm, email: e.target.value})}
                      placeholder="Contoh: showroom@gmail.com"
                      className="w-full px-3 py-2.5 border border-[#E8E2DD] bg-white rounded-xl text-xs text-[#2B2420] outline-none focus:border-[#79553D]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-wider text-[#8A817A] mb-1.5">Tanggal Demo</label>
                    <input 
                      type="date" 
                      required
                      value={demoForm.date}
                      onChange={(e) => setDemoForm({...demoForm, date: e.target.value})}
                      className="w-full px-3 py-2.5 border border-[#E8E2DD] bg-white rounded-xl text-xs text-[#2B2420] outline-none focus:border-[#79553D]"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-wider text-[#8A817A] mb-1.5">Fokus Topik Pembahasan</label>
                    <select
                      value={demoForm.topic}
                      onChange={(e) => setDemoForm({...demoForm, topic: e.target.value})}
                      className="w-full px-3 py-2.5 border border-[#E8E2DD] bg-white rounded-xl text-xs text-[#2B2420] outline-none focus:border-[#79553D]"
                    >
                      <option value="Konsultasi Setup CRM">Setup Awal & Database Supabase</option>
                      <option value="Manajemen Stok & Gudang">Manajemen Stok & Gudang Kayu</option>
                      <option value="Quotation & Order Sales">Otomatisasi Quotation & Nota Sales</option>
                      <option value="Membership & Loyalty">Membership & Program Poin</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#79553D] hover:bg-[#634430] text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer border-none text-center"
                >
                  Jadwalkan Live Demo Sekarang
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ── 12. FAQ Section ── */}
      <section id="faq" className="py-20 px-6 bg-[#FAF6F3] border-y border-[#E8E2DD]/70">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#79553D]">FAQ</span>
            <h2 className="text-3xl font-bold text-[#2B2420] font-serif">Pertanyaan yang Sering Diajukan</h2>
            <p className="text-xs text-[#8A817A] font-semibold">
              Berikut jawaban atas berbagai pertanyaan umum tentang penggunaan dan instalasi platform.
            </p>
          </div>

          <div className="space-y-3.5 text-left">
            {faqList.map((faq, idx) => {
              const isExpanded = expandedFaq === idx;
              return (
                <div key={idx} className="bg-white border border-[#E8E2DD] rounded-xl overflow-hidden shadow-xs transition-all">
                  <button
                    type="button"
                    onClick={() => setExpandedFaq(isExpanded ? null : idx)}
                    className="w-full px-5 py-4 flex justify-between items-center text-xs font-bold text-[#2B2420] hover:bg-[#FAF6F3] border-none bg-transparent cursor-pointer text-left"
                  >
                    <span className="flex items-center gap-2.5">
                      <FiHelpCircle className="text-sm text-[#79553D]" />
                      {faq.q}
                    </span>
                    {isExpanded ? <FiChevronUp className="text-sm" /> : <FiChevronDown className="text-sm" />}
                  </button>
                  {isExpanded && (
                    <div className="px-5 pb-5 pt-1 text-xs text-[#8A817A] leading-relaxed border-t border-[#E8E2DD]/40">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 13. Final CTA Banner ── */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto bg-gradient-to-br from-[#79553D] via-[#634430] to-[#362315] rounded-3xl p-8 md:p-12 text-center text-[#FAF6F3] relative overflow-hidden shadow-xl space-y-6">
          <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 pointer-events-none" />
          <div className="absolute -left-12 -bottom-12 w-44 h-44 rounded-full border border-white/5 pointer-events-none" />
          <div className="absolute -right-6 -top-6 w-32 h-32 rounded-full border border-white/10 pointer-events-none" />

          <h2 className="text-3xl md:text-4xl font-extrabold font-serif max-w-2xl mx-auto leading-tight">
            Siap Merevolusi Cara Kelola Bisnis Furniture Anda?
          </h2>
          <p className="text-xs text-[#C9B19C] max-w-xl mx-auto leading-relaxed">
            Daftar sekarang dan nikmati akses trial 14 hari penuh. Mulai pantau stok bahan workshop, rekap quotation, dan data pelanggan di mana saja, kapan saja.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-3.5 pt-4">
            <button
              onClick={() => setTrialModalOpen(true)}
              className="px-7 py-3.5 bg-white text-[#79553D] hover:bg-[#FAF6F3] rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer border-none"
            >
              Mulai Uji Coba Gratis
            </button>
            <a
              href="#book-demo"
              className="px-7 py-3.5 bg-transparent border border-white hover:bg-white/10 text-white rounded-xl text-xs font-bold transition-all text-center no-underline flex items-center justify-center gap-1.5"
            >
              <FiPlay className="text-[10px]" /> Hubungi Tim Sales
            </a>
          </div>
        </div>
      </section>

      {/* ── 14. Newsletter ── */}
      <section className="bg-[#FAF6F3] py-12 px-6 border-t border-[#E8E2DD]/70 text-center">
        <div className="max-w-2xl mx-auto space-y-4">
          <h4 className="text-sm font-bold text-[#2B2420] uppercase tracking-wider">Langganan Artikel & Update</h4>
          <p className="text-xs text-[#8A817A]">Dapatkan tips digitalisasi bisnis furniture, trend desain mebel, dan rilis fitur baru kami langsung di email Anda.</p>
          <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto pt-2">
            <input 
              type="email" 
              placeholder="Masukkan email Anda" 
              className="flex-1 px-4 py-2.5 border border-[#E8E2DD] bg-white rounded-xl text-xs outline-none focus:border-[#79553D]"
            />
            <button className="px-5 py-2.5 bg-[#4A6B46] hover:bg-[#3B5537] text-white rounded-xl text-xs font-bold transition-all border-none cursor-pointer">
              Berlangganan
            </button>
          </div>
        </div>
      </section>

      {/* ── 15. Footer ── */}
      <footer className="bg-white border-t border-[#E8E2DD]/70 py-12 px-6 text-xs text-[#8A817A] text-left">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#79553D] flex items-center justify-center text-white font-bold text-base">F</div>
              <span className="font-extrabold text-sm text-[#2B2420]">Timber CRM</span>
            </div>
            <p className="leading-relaxed">
              Aplikasi CRM & ERP terpadu untuk industri showroom, pabrik mebel kayu, desainer interior, dan toko ritel furniture di Indonesia.
            </p>
            <span className="block pt-2">© {new Date().getFullYear()} Timber CRM. Hak Cipta Dilindungi.</span>
          </div>

          {/* Links 1 */}
          <div className="space-y-3">
            <h5 className="font-bold text-[#2B2420] uppercase tracking-wider text-[10px]">Fitur Platform</h5>
            <ul className="space-y-2 list-none p-0 m-0">
              <li><a href="#features" className="text-[#8A817A] hover:text-[#79553D] no-underline">Manajemen Pelanggan</a></li>
              <li><a href="#features" className="text-[#8A817A] hover:text-[#79553D] no-underline">Katalog & Stok Kayu</a></li>
              <li><a href="#features" className="text-[#8A817A] hover:text-[#79553D] no-underline">Kanban Pipeline</a></li>
              <li><a href="#features" className="text-[#8A817A] hover:text-[#79553D] no-underline">Kalkulasi Penawaran</a></li>
            </ul>
          </div>

          {/* Links 2 */}
          <div className="space-y-3">
            <h5 className="font-bold text-[#2B2420] uppercase tracking-wider text-[10px]">Perusahaan</h5>
            <ul className="space-y-2 list-none p-0 m-0">
              <li><a href="#" className="text-[#8A817A] hover:text-[#79553D] no-underline">Tentang Kami</a></li>
              <li><a href="#" className="text-[#8A817A] hover:text-[#79553D] no-underline">Syarat Layanan</a></li>
              <li><a href="#" className="text-[#8A817A] hover:text-[#79553D] no-underline">Kebijakan Privasi</a></li>
              <li><a href="#" className="text-[#8A817A] hover:text-[#79553D] no-underline">Kontak Support</a></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h5 className="font-bold text-[#2B2420] uppercase tracking-wider text-[10px]">Hubungi Kami</h5>
            <p className="leading-relaxed">
              Graha Furniture Digital Lt. 4<br />
              Jl. Kayu Jati No. 89, Jakarta Selatan<br />
              Indonesia<br />
              Email: info@furniturecrm.id
            </p>
          </div>
        </div>
      </footer>

      {/* ── 16. Free Trial Signup Modal ── */}
      {trialModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl relative text-left">
            <button
              onClick={() => setTrialModalOpen(false)}
              className="absolute right-5 top-5 p-1 bg-transparent hover:bg-[#FAF6F3] border-none text-[#8A817A] hover:text-[#2B2420] rounded-lg cursor-pointer transition-colors"
            >
              <span className="text-xl font-bold font-mono">×</span>
            </button>

            {trialSuccess ? (
              <div className="py-8 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-[#E6ECE5] text-[#4A6B46] flex items-center justify-center mx-auto text-xl">
                  <FiCheck />
                </div>
                <h3 className="text-lg font-bold text-[#2B2420] font-serif">Pendaftaran Akun Trial Sukses!</h3>
                <p className="text-xs text-[#8A817A] max-w-sm mx-auto leading-relaxed">
                  Selamat, akun trial untuk <strong>{trialForm.showroomName || "Showroom Anda"}</strong> telah siap. Kami juga telah mendaftarkan email <strong>{trialForm.email}</strong> ke dalam CRM prospek.
                </p>
              </div>
            ) : (
              <form onSubmit={handleTrialSubmit} className="space-y-4">
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-[#2B2420] font-serif">Mulai Uji Coba 14 Hari Gratis</h3>
                  <p className="text-[11px] text-[#8A817A]">
                    Dapatkan akses penuh ke modul CRM, stok mebel, pipeline sales, dan analitik.
                  </p>
                </div>

                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-wider text-[#8A817A] mb-1.5">Nama Anda</label>
                  <input 
                    type="text" 
                    required
                    value={trialForm.name}
                    onChange={(e) => setTrialForm({ ...trialForm, name: e.target.value })}
                    placeholder="Contoh: Andi Wijaya"
                    className="w-full px-3 py-2 border border-[#E8E2DD] bg-white rounded-xl text-xs text-[#2B2420] outline-none focus:border-[#79553D]"
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-wider text-[#8A817A] mb-1.5">Nama Showroom / Bisnis</label>
                  <input 
                    type="text" 
                    required
                    value={trialForm.showroomName}
                    onChange={(e) => setTrialForm({ ...trialForm, showroomName: e.target.value })}
                    placeholder="Contoh: Wijaya Furniture Jepara"
                    className="w-full px-3 py-2 border border-[#E8E2DD] bg-white rounded-xl text-xs text-[#2B2420] outline-none focus:border-[#79553D]"
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-wider text-[#8A817A] mb-1.5">Email Bisnis</label>
                  <input 
                    type="email" 
                    required
                    value={trialForm.email}
                    onChange={(e) => setTrialForm({ ...trialForm, email: e.target.value })}
                    placeholder="Contoh: andi@wijayajati.com"
                    className="w-full px-3 py-2 border border-[#E8E2DD] bg-white rounded-xl text-xs text-[#2B2420] outline-none focus:border-[#79553D]"
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-wider text-[#8A817A] mb-1.5">Nomor Handphone</label>
                  <input 
                    type="text" 
                    value={trialForm.phone}
                    onChange={(e) => setTrialForm({ ...trialForm, phone: e.target.value })}
                    placeholder="Contoh: 08123456789"
                    className="w-full px-3 py-2 border border-[#E8E2DD] bg-white rounded-xl text-xs text-[#2B2420] outline-none focus:border-[#79553D]"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 bg-[#79553D] hover:bg-[#634430] text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer border-none text-center"
                  >
                    Daftar Sekarang & Mulai Trial
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
