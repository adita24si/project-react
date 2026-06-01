import React, { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  FiChevronLeft, FiUser, FiAward, FiShoppingBag, FiAlertCircle, 
  FiFileText, FiSave, FiClock, FiPhone, FiMail, FiUsers, FiPlus 
} from "react-icons/fi";

import TabsComponent from "../components/ui/TabsComponent";
import DetailCard from "../components/ui/DetailCard";
import InfoRow from "../components/ui/InfoRow";
import StatusBadge from "../components/ui/StatusBadge";
import MembershipBadge from "../components/ui/MembershipBadge";
import Avatar from "../components/ui/Avatar";
import DataTable from "../components/ui/DataTable";
import PipelineStepper from "../components/ui/PipelineStepper";

export default function CustomerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profil");
  
  // Custom dummy data based on ID
  const customer = useMemo(() => {
    const names = [
      "Budi Santoso", "Siti Rahmawati", "Ahmad Reza", "Dewi Lestari", "Andi Wijaya",
      "Clarissa Wulandari", "Hendra Gunawan", "Fitriani Siregar", "Rian Hidayat", "Indah Permatasari"
    ];
    const index = (Number(id) - 1) % names.length;
    const name = names[index] || "Pelanggan Terhormat";
    
    return {
      id: Number(id),
      name: name,
      email: `${name.toLowerCase().replace(/\s+/g, "")}@gmail.com`,
      phone: `0812${10000000 + Number(id) * 2351}`,
      address: "Jl. Kemang Raya No. 42, Jakarta Selatan, DKI Jakarta",
      loyalty: ["Bronze", "Silver", "Gold", "Platinum"][index % 4],
      joinDate: "12 Januari 2024",
      totalSpent: (index + 1) * 7800000,
      rewardPoints: (index + 1) * 350,
      initialStage: ["New Lead", "Contacted", "Proposal", "Negotiation", "Won"][index % 5],
      purchases: [
        { id: "TX-9012", product: "Oslo Walnut Dining Table", qty: 1, total: 6400000, status: "Lunas", date: "2026-05-12" },
        { id: "TX-8941", product: "Linen Lounge Armchair", qty: 2, total: 3800000, status: "Lunas", date: "2026-04-18" },
        { id: "TX-8703", product: "Arco Walnut Floor Lamp", qty: 1, total: 1980000, status: "Lunas", date: "2026-02-05" },
      ],
      complaints: [
        { id: "CS-403", subject: "Kaki Meja Makan Lecet", date: "2026-05-14", status: "Resolved" },
        { id: "CS-281", subject: "Keterlambatan Pengiriman Kursi", date: "2026-04-19", status: "Resolved" },
      ],
      initialInteractions: [
        { id: 1, type: "Call", summary: "Telepon follow up penawaran lemari jati. Customer tertarik dengan diskon.", date: "2026-05-25", agent: "Ahmad Reza" },
        { id: 2, type: "Email", summary: "Mengirimkan quotation katalog untuk penataan ruang tamu Japandi.", date: "2026-05-20", agent: "Ahmad Reza" },
        { id: 3, type: "Meeting", summary: "Janji temu di showroom Kemang. Diskusi detail layout kitchen set.", date: "2026-05-15", agent: "Dewi Lestari" }
      ],
      notes: "Pelanggan menyukai mebel dari material kayu Walnut dengan finishing matte. Lebih menyukai pengiriman di akhir pekan."
    };
  }, [id]);

  const [currentStage, setCurrentStage] = useState(customer.initialStage);
  const [adminNotes, setAdminNotes] = useState(customer.notes);
  const [saveStatus, setSaveStatus] = useState("");
  const [interactions, setInteractions] = useState(customer.initialInteractions);

  // New interaction form state
  const [newLogType, setNewLogType] = useState("Call");
  const [newLogSummary, setNewLogSummary] = useState("");

  const handleSaveNotes = (e) => {
    e.preventDefault();
    setSaveStatus("Saving...");
    setTimeout(() => {
      setSaveStatus("Catatan berhasil disimpan!");
      setTimeout(() => setSaveStatus(""), 2000);
    }, 800);
  };

  const handleAddLog = (e) => {
    e.preventDefault();
    if (!newLogSummary.trim()) return;

    const nextId = interactions.length > 0 ? Math.max(...interactions.map(i => i.id)) + 1 : 1;
    const item = {
      id: nextId,
      type: newLogType,
      summary: newLogSummary,
      date: new Date().toISOString().split("T")[0],
      agent: "Ahmad Reza" // current user
    };

    setInteractions(prev => [item, ...prev]);
    setNewLogSummary("");
  };

  const getInteractionIcon = (type) => {
    switch (type) {
      case "Call":
        return <FiPhone className="text-xs" />;
      case "Email":
        return <FiMail className="text-xs" />;
      case "Meeting":
      default:
        return <FiUsers className="text-xs" />;
    }
  };

  const tabs = [
    { key: "profil", label: "Profil", icon: <FiUser /> },
    { key: "timeline", label: "Timeline & Interaksi", icon: <FiClock /> },
    { key: "membership", label: "Membership", icon: <FiAward /> },
    { key: "pembelian", label: "Riwayat Pembelian", icon: <FiShoppingBag /> },
    { key: "komplain", label: "Komplain", icon: <FiAlertCircle /> },
    { key: "catatan", label: "Catatan Admin", icon: <FiFileText /> },
  ];

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto font-sans bg-white border border-[#E8E2DD]/80 rounded-xl">
      {/* Back Button */}
      <button 
        onClick={() => navigate("/customers")}
        className="flex items-center gap-1.5 text-xs font-bold text-[#8A817A] hover:text-[#2B2420] mb-6 transition-colors"
      >
        <FiChevronLeft className="text-base" /> Back to Customers
      </button>

      {/* Customer Header summary */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 pb-6 mb-6 border-b border-[#E8E2DD]/60">
        <Avatar name={customer.name} size="lg" />
        <div className="flex-1 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-3 justify-center sm:justify-start">
            <h2 
              className="text-2xl font-bold text-[#2B2420]"
              style={{ fontFamily: "ui-serif, Georgia, Cambria, serif" }}
            >
              {customer.name}
            </h2>
            <MembershipBadge tier={customer.loyalty} />
          </div>
          <p className="text-xs text-[#8A817A] mt-1.5">{customer.email} · {customer.phone}</p>
          <p className="text-[11px] text-[#8A817A] mt-1">Terdaftar sejak: <span className="font-semibold text-[#2B2420]">{customer.joinDate}</span></p>
        </div>
      </div>

      {/* Interactive Stepper to Track Stages (CRM Core) */}
      <div className="mb-6">
        <PipelineStepper currentStage={currentStage} onChange={setCurrentStage} />
      </div>

      {/* Tab Navigation */}
      <TabsComponent tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Tab Contents */}
      <div className="mt-4">
        {activeTab === "profil" && (
          <DetailCard title="Informasi Profil Pelanggan">
            <div className="space-y-1">
              <InfoRow label="Nama Lengkap" value={customer.name} />
              <InfoRow label="Email" value={customer.email} />
              <InfoRow label="No. Handphone" value={customer.phone} />
              <InfoRow label="Alamat Pengiriman" value={customer.address} />
              <InfoRow label="ID Registrasi" value={`#CUST-${String(customer.id).padStart(4, "0")}`} />
              <InfoRow label="Tanggal Gabung" value={customer.joinDate} />
            </div>
          </DetailCard>
        )}

        {activeTab === "timeline" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Timeline feed log */}
            <div className="md:col-span-2">
              <DetailCard title="Histori Komunikasi & Interaksi">
                <div className="relative pl-6 space-y-6 border-l border-[#E8E2DD] mt-2">
                  {interactions.map((log) => (
                    <div key={log.id} className="relative">
                      {/* Round Type Icon */}
                      <span className="absolute -left-[31px] top-0 w-5 h-5 rounded-full bg-[#FAF6F3] border border-[#E8E2DD] flex items-center justify-center text-[#79553D]">
                        {getInteractionIcon(log.type)}
                      </span>
                      
                      <div className="flex justify-between items-start gap-4">
                        <span className="text-xs font-bold text-[#2B2420]">{log.type} Log</span>
                        <span className="text-[10px] text-[#8A817A] font-semibold">{log.date}</span>
                      </div>
                      <p className="text-xs text-[#8A817A] mt-1 leading-relaxed">{log.summary}</p>
                      <span className="text-[10px] text-[#8A817A] font-semibold block mt-1">Oleh: {log.agent}</span>
                    </div>
                  ))}
                </div>
              </DetailCard>
            </div>

            {/* Quick logger form */}
            <div>
              <DetailCard title="Catat Interaksi Baru">
                <form onSubmit={handleAddLog} className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8A817A] mb-1">
                      Tipe Hubungan
                    </label>
                    <select
                      value={newLogType}
                      onChange={(e) => setNewLogType(e.target.value)}
                      className="w-full px-3 py-2 border border-[#E8E2DD] bg-white rounded-lg text-xs text-[#2B2420] outline-none focus:ring-1 focus:ring-[#79553D]"
                    >
                      <option value="Call">Telepon (Call)</option>
                      <option value="Email">Surat Elektronik (Email)</option>
                      <option value="Meeting">Janji Temu (Meeting)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8A817A] mb-1">
                      Catatan Percakapan
                    </label>
                    <textarea
                      value={newLogSummary}
                      onChange={(e) => setNewLogSummary(e.target.value)}
                      placeholder="Masukkan poin penting dari percakapan..."
                      rows={3}
                      required
                      className="w-full p-3 border border-[#E8E2DD] rounded-lg text-xs text-[#2B2420] placeholder-[#8A817A] outline-none focus:ring-1 focus:ring-[#79553D]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-1.5 bg-[#79553D] hover:bg-[#634430] text-white py-2 rounded-lg text-xs font-semibold shadow-xs transition-colors"
                  >
                    <FiPlus /> Simpan Log
                  </button>
                </form>
              </DetailCard>
            </div>
          </div>
        )}

        {activeTab === "membership" && (
          <DetailCard title="Informasi Loyalitas & Benefit">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-1">
                <InfoRow label="Tier Saat Ini" value={<MembershipBadge tier={customer.loyalty} />} />
                <InfoRow label="Poin Reward" value={`${customer.rewardPoints} Poin`} />
                <InfoRow 
                  label="Total Belanja" 
                  value={customer.totalSpent.toLocaleString("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 })} 
                />
              </div>
              <div className="bg-[#FAFAFA] p-5 border border-[#E8E2DD] rounded-xl">
                <h4 
                  className="text-xs font-bold uppercase tracking-wider text-[#79553D] mb-3"
                  style={{ fontFamily: "ui-serif, Georgia, Cambria, serif" }}
                >
                  Benefit Tier {customer.loyalty}
                </h4>
                <ul className="text-xs text-[#8A817A] space-y-2 list-disc list-inside">
                  <li>Diskon langsung sebesar 5% untuk semua pembelian furniture</li>
                  <li>Undangan prioritas ke pameran koleksi seasonal TimberCraft</li>
                  <li>Gratis biaya instalasi di wilayah Jabodetabek</li>
                  <li>Layanan pengiriman prioritas akhir pekan</li>
                </ul>
              </div>
            </div>
          </DetailCard>
        )}

        {activeTab === "pembelian" && (
          <DetailCard title="Riwayat Pembelian Furniture">
            <div className="border border-[#E8E2DD] rounded-lg overflow-hidden">
              <DataTable
                columns={[
                  { key: "id", label: "ID Transaksi" },
                  { key: "date", label: "Tanggal" },
                  { key: "product", label: "Produk yang Dibeli" },
                  { key: "qty", label: "Qty", render: (r) => <span className="font-semibold">{r.qty} pcs</span> },
                  { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
                  { 
                    key: "total", 
                    label: "Nilai Transaksi", 
                    render: (r) => <span className="font-bold text-xs text-[#79553D]">{r.total.toLocaleString("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 })}</span>
                  }
                ]}
                data={customer.purchases}
                onRowClick={(row) => navigate(`/purchase-history/${row.id}`)}
              />
            </div>
          </DetailCard>
        )}

        {activeTab === "komplain" && (
          <DetailCard title="Laporan Komplain Customer">
            <div className="border border-[#E8E2DD] rounded-lg overflow-hidden">
              <DataTable
                columns={[
                  { key: "id", label: "ID Tiket" },
                  { key: "date", label: "Tanggal Masuk" },
                  { key: "subject", label: "Masalah / Komplain" },
                  { key: "status", label: "Status Tiket", render: (r) => <StatusBadge status={r.status} /> }
                ]}
                data={customer.complaints}
                onRowClick={(row) => navigate(`/customer-service/${row.id}`)}
                emptyMessage="Tidak ada komplain yang terdaftar untuk customer ini."
              />
            </div>
          </DetailCard>
        )}

        {activeTab === "catatan" && (
          <DetailCard title="Catatan Internal Admin">
            <form onSubmit={handleSaveNotes} className="space-y-4">
              <textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Tulis catatan penting mengenai preferensi customer atau log pembicaraan di sini..."
                rows={5}
                className="w-full p-4 border border-[#E8E2DD] rounded-lg text-sm text-[#2B2420] placeholder-[#8A817A] outline-none focus:ring-1 focus:ring-[#79553D] focus:border-[#79553D] transition-all"
              />
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-[#4A6B46]">{saveStatus}</span>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 bg-[#79553D] hover:bg-[#634430] text-white px-4.5 py-2 rounded-lg text-xs font-semibold shadow-xs transition-colors"
                >
                  <FiSave /> Simpan Catatan
                </button>
              </div>
            </form>
          </DetailCard>
        )}
      </div>
    </div>
  );
}
