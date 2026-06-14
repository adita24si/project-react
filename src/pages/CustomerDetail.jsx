import React, { useState, useMemo, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CRMContext } from "../context/CRMContext";
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
  const { customers, transactions, tickets, updateCustomer } = useContext(CRMContext);
  
  const [activeTab, setActiveTab] = useState("profil");

  // Find current customer from global context
  const customer = useMemo(() => {
    return customers.find(c => {
      if (!c || !c.id) return false;
      const idA = String(c.id).trim().toLowerCase().replace(/^(#|[a-z]+-)+/g, "");
      const idB = String(id).trim().toLowerCase().replace(/^(#|[a-z]+-)+/g, "");
      if (idA === idB) return true;
      const numA = Number(idA.replace(/^0+/, ""));
      const numB = Number(idB.replace(/^0+/, ""));
      if (!isNaN(numA) && !isNaN(numB) && numA === numB) return true;
      return false;
    });
  }, [customers, id]);

  // If customer not found
  if (!customer) {
    return (
      <div className="p-8 text-center text-[#2B2420] font-sans">
        <h2 className="text-xl font-bold">Pelanggan Tidak Ditemukan</h2>
        <p className="text-xs text-[#8A817A] mt-2">ID Pelanggan #{id} tidak terdaftar di database kami.</p>
        <button 
          onClick={() => navigate("/customers")}
          className="mt-4 px-4 py-2 bg-[#79553D] text-white rounded-lg text-xs font-semibold cursor-pointer border-none"
        >
          Kembali ke List
        </button>
      </div>
    );
  }

  // Filter transactions for this customer
  const customerTransactions = useMemo(() => {
    return transactions.filter(t => t.customerId === customer.id);
  }, [transactions, customer.id]);

  // Filter customer service tickets for this customer
  const customerTickets = useMemo(() => {
    return tickets.filter(t => t.customerId === customer.id);
  }, [tickets, customer.id]);

  // Stage state (pipeline)
  const currentStage = customer.stage || "New Lead";
  const handleStageChange = (newStage) => {
    updateCustomer({
      ...customer,
      stage: newStage
    });
  };

  // Notes state
  const [adminNotes, setAdminNotes] = useState(customer.notes || "");
  const [saveStatus, setSaveStatus] = useState("");

  const handleSaveNotes = (e) => {
    e.preventDefault();
    setSaveStatus("Saving...");
    updateCustomer({
      ...customer,
      notes: adminNotes
    });
    setTimeout(() => {
      setSaveStatus("Catatan berhasil disimpan!");
      setTimeout(() => setSaveStatus(""), 2000);
    }, 500);
  };

  // Interactions (timeline)
  const interactions = customer.interactions || [
    { id: 1, type: "Call", summary: "Telepon follow up penawaran lemari jati. Customer tertarik dengan diskon.", date: "2026-06-12", agent: "Ahmad Reza" },
    { id: 2, type: "Email", summary: "Mengirimkan quotation katalog untuk penataan ruang tamu Japandi.", date: "2026-06-10", agent: "Ahmad Reza" }
  ];

  // New interaction form state
  const [newLogType, setNewLogType] = useState("Call");
  const [newLogSummary, setNewLogSummary] = useState("");

  const handleAddLog = (e) => {
    e.preventDefault();
    if (!newLogSummary.trim()) return;

    const nextId = interactions.length > 0 ? Math.max(...interactions.map(i => i.id)) + 1 : 1;
    const newLogItem = {
      id: nextId,
      type: newLogType,
      summary: newLogSummary,
      date: new Date().toISOString().split("T")[0],
      agent: "Ahmad Reza"
    };

    updateCustomer({
      ...customer,
      interactions: [newLogItem, ...interactions]
    });
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
    <div className="max-w-5xl mx-auto font-sans text-left">
      {/* Back Button */}
      <button 
        onClick={() => navigate("/customers")}
        className="flex items-center gap-1.5 text-xs font-bold text-[#8A817A] hover:text-[#2B2420] mb-6 transition-colors bg-transparent border-none cursor-pointer"
      >
        <FiChevronLeft className="text-base" /> Back to Customers
      </button>

      {/* Customer Header summary */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 pb-6 mb-6 border-b border-[#E8E2DD]/60 bg-white p-6 rounded-2xl border border-[#E8E2DD]/85">
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
      <div className="mb-6 bg-white p-6 rounded-2xl border border-[#E8E2DD]/85">
        <PipelineStepper currentStage={currentStage} onChange={handleStageChange} />
      </div>

      {/* Tab Navigation */}
      <div className="bg-white px-6 pt-4 rounded-t-2xl border-t border-x border-[#E8E2DD]/85">
        <TabsComponent tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      {/* Tab Contents */}
      <div className="bg-white px-6 pb-6 rounded-b-2xl border-b border-x border-[#E8E2DD]/85">
        {activeTab === "profil" && (
          <DetailCard title="Informasi Profil Pelanggan">
            <div className="space-y-1">
              <InfoRow label="Nama Lengkap" value={customer.name} />
              <InfoRow label="Email" value={customer.email} />
              <InfoRow label="No. Handphone" value={customer.phone} />
              <InfoRow label="Kota" value={customer.city || "Jakarta"} />
              <InfoRow label="Alamat Pengiriman" value={customer.address || "Belum ada alamat"} />
              <InfoRow label="ID Registrasi" value={`#CUST-${String(customer.id).padStart(4, "0")}`} />
              <InfoRow label="Tanggal Gabung" value={customer.joinDate} />
              <InfoRow label="Status Customer" value={customer.status || "Active"} />
            </div>
          </DetailCard>
        )}

        {activeTab === "timeline" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-3">
            {/* Timeline feed log */}
            <div className="md:col-span-2">
              <DetailCard title="Histori Komunikasi & Interaksi">
                <div className="relative pl-6 space-y-6 border-l border-[#E8E2DD] mt-4 ml-4">
                  {interactions.map((log) => (
                    <div key={log.id} className="relative">
                      {/* Round Type Icon */}
                      <span className="absolute -left-[35px] top-0 w-6 h-6 rounded-full bg-[#FAF6F3] border border-[#E8E2DD] flex items-center justify-center text-[#79553D]">
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
                      className="w-full px-3 py-2 border border-[#E8E2DD] bg-white rounded-lg text-xs text-[#2B2420] outline-none focus:border-[#79553D]"
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
                      className="w-full p-3 border border-[#E8E2DD] rounded-lg text-xs text-[#2B2420] placeholder-[#8A817A] outline-none focus:border-[#79553D] resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-1.5 bg-[#79553D] hover:bg-[#634430] text-white py-2 rounded-lg text-xs font-bold shadow-xs transition-colors cursor-pointer border-none"
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
                <InfoRow label="Poin Reward" value={`${customer.loyaltyPoints || 0} Poin`} />
                <InfoRow 
                  label="Total Belanja" 
                  value={(customer.totalSpent || 0).toLocaleString("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 })} 
                />
              </div>
              <div className="bg-[#FAF6F3] p-5 border border-[#E8E2DD] rounded-xl text-left">
                <h4 
                  className="text-xs font-bold uppercase tracking-wider text-[#79553D] mb-3"
                  style={{ fontFamily: "ui-serif, Georgia, Cambria, serif" }}
                >
                  Benefit Tier {customer.loyalty}
                </h4>
                <ul className="text-xs text-[#8A817A] space-y-2 list-disc list-inside">
                  <li>Diskon langsung sebesar {customer.loyalty === "Silver" ? "5%" : customer.loyalty === "Gold" ? "10%" : customer.loyalty === "Platinum" ? "15%" : customer.loyalty === "VIP" ? "20%" : "0%"} untuk pembelian furniture</li>
                  <li>Undangan prioritas ke pameran koleksi seasonal TimberCraft</li>
                  <li>Gratis biaya instalasi di seluruh wilayah layanan</li>
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
                  { key: "products", label: "Produk yang Dibeli", render: (r) => <span>{r.products.map(p => `${p.name} (x${p.qty})`).join(", ")}</span> },
                  { key: "paymentMethod", label: "Metode" },
                  { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
                  { 
                    key: "totalAmount", 
                    label: "Nilai Transaksi", 
                    render: (r) => <span className="font-extrabold text-xs text-[#79553D]">{(r.totalAmount || 0).toLocaleString("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 })}</span>
                  }
                ]}
                data={customerTransactions}
                onRowClick={(row) => navigate(`/purchase-history/${row.id}`)}
                emptyMessage="Tidak ada pembelian yang terdaftar untuk customer ini."
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
                  { key: "category", label: "Kategori" },
                  { key: "subject", label: "Masalah / Komplain" },
                  { key: "status", label: "Status Tiket", render: (r) => <StatusBadge status={r.status} /> }
                ]}
                data={customerTickets}
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
                className="w-full p-4 border border-[#E8E2DD] rounded-lg text-sm text-[#2B2420] placeholder-[#8A817A] outline-none focus:border-[#79553D] transition-all resize-none"
              />
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-[#4A6B46]">{saveStatus}</span>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 bg-[#79553D] hover:bg-[#634430] text-white px-4.5 py-2 rounded-lg text-xs font-bold shadow-xs transition-colors cursor-pointer border-none"
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
