import React, { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiChevronLeft, FiSend, FiCheck, FiCheckCircle } from "react-icons/fi";

import DetailCard from "../components/ui/DetailCard";
import InfoRow from "../components/ui/InfoRow";
import StatusBadge from "../components/ui/StatusBadge";
import Avatar from "../components/ui/Avatar";

const SERVICE_STAGES = ["Open", "Assigned", "Investigating", "Proposed Solution", "Resolved"];

export default function ServiceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Custom ticket data based on ID
  const ticket = useMemo(() => {
    const customers = [
      "Budi Santoso", "Siti Rahmawati", "Ahmad Reza", "Dewi Lestari", "Andi Wijaya"
    ];
    const cleanId = String(id).replace(/\D/g, "");
    const numeric = Number(cleanId) || 123;
    const custName = customers[numeric % customers.length];

    return {
      id: id,
      customer: custName,
      customerEmail: `${custName.toLowerCase().replace(/\s+/g, "")}@gmail.com`,
      category: ["Komplain", "Bantuan", "Feedback"][numeric % 3],
      priority: ["High", "Medium", "Low"][numeric % 3],
      initialStage: SERVICE_STAGES[numeric % SERVICE_STAGES.length],
      date: `2026-05-${String((numeric % 20) + 1).padStart(2, "0")}`,
      subject: "Kaki meja makan lecet setelah pengiriman",
      description: "Saat meja makan jati pesanan kami unboxing pagi ini, kami menemukan salah satu kaki penyangga mengalami lecet yang cukup dalam di bagian dasarnya. Mohon bantuan untuk penanganan atau poles ulang agar tidak merusak kayu jati.",
      history: [
        { date: "2026-05-18", action: "Log tiket dibuat di sistem.", actor: "System" },
        { date: "2026-05-19", action: "Tiket ditugaskan ke bagian Teknisi.", actor: "CS Team" },
        { date: "2026-05-20", action: "Penyelesaian disiapkan.", actor: "Technical" }
      ]
    };
  }, [id]);

  const [currentStatus, setCurrentStatus] = useState(ticket.initialStage);
  const [response, setResponse] = useState("");
  const [submitStatus, setSubmitStatus] = useState("");
  const [localHistory, setLocalHistory] = useState(ticket.history);

  const currentIdx = SERVICE_STAGES.indexOf(currentStatus);

  const handleResponseSubmit = (e) => {
    e.preventDefault();
    if (!response.trim()) return;
    
    setSubmitStatus("Submitting...");
    setTimeout(() => {
      const today = new Date().toISOString().split('T')[0];
      setLocalHistory(prev => [
        ...prev, 
        { date: today, action: `Respon: "${response}"`, actor: "Ahmad Reza" }
      ]);
      setResponse("");
      setSubmitStatus("Tanggapan dikirim!");
      setTimeout(() => setSubmitStatus(""), 2000);
    }, 600);
  };

  const handleStageClick = (stage) => {
    setCurrentStatus(stage);
    const today = new Date().toISOString().split('T')[0];
    setLocalHistory(prev => [
      ...prev,
      { date: today, action: `Status tiket diubah ke ${stage}`, actor: "Ahmad Reza" }
    ]);
  };

  return (
    <div className="p-5 md:p-6 max-w-6xl mx-auto font-sans bg-white border border-[#E8E2DD]/80 rounded-xl">
      {/* Top Header & Navigation on single line */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#E8E2DD]/60">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate("/customer-service")}
            className="flex items-center justify-center w-8 h-8 border border-[#E8E2DD] hover:bg-[#FAFAFA] rounded-md text-[#8A817A] hover:text-[#2B2420] transition-colors"
          >
            <FiChevronLeft className="text-base" />
          </button>
          <div>
            <span className="text-[10px] font-bold text-[#8A817A] uppercase tracking-wider block">Ticket Support</span>
            <h2 
              className="text-base font-bold text-[#2B2420]"
              style={{ fontFamily: "ui-serif, Georgia, Cambria, serif" }}
            >
              Tiket {ticket.id}
            </h2>
          </div>
        </div>
        <StatusBadge status={currentStatus} />
      </div>

      {/* Tightly structured 2-Column Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left Column: Profile, Description & Stepper */}
        <div className="lg:col-span-5 space-y-4">
          {/* Customer & Ticket Info in a unified card */}
          <DetailCard title="Laporan & Informasi">
            <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[#E8E2DD]/40">
              <Avatar name={ticket.customer} size="sm" />
              <div>
                <p className="font-semibold text-xs text-[#2B2420]">{ticket.customer}</p>
                <p className="text-[10px] text-[#8A817A]">{ticket.customerEmail}</p>
              </div>
            </div>
            
            <div className="space-y-0.5">
              <InfoRow label="Kategori" value={ticket.category} />
              <InfoRow label="Prioritas" value={ticket.priority} />
              <InfoRow label="Tanggal Masuk" value={ticket.date} />
            </div>
          </DetailCard>

          {/* Stepper directly inside Left column */}
          <div className="bg-[#FAF6F3] border border-[#E8E2DD] p-3.5 rounded-xl">
            <span className="text-[9px] font-bold uppercase tracking-wider text-[#8A817A] block mb-2">Progres Penyelesaian</span>
            <div className="flex flex-wrap gap-1 items-center justify-between">
              {SERVICE_STAGES.map((stage, idx) => {
                const isActive = idx === currentIdx;
                const isCompleted = idx < currentIdx;
                return (
                  <button
                    key={stage}
                    onClick={() => handleStageClick(stage)}
                    className={`px-2 py-1 rounded text-[10px] font-bold border transition-all flex-1 text-center truncate ${
                      isActive
                        ? "bg-[#79553D] text-white border-[#79553D]"
                        : isCompleted
                        ? "bg-[#E6ECE5] text-[#4A6B46] border-[#D8E2D7]"
                        : "bg-white text-[#8A817A] border-[#E8E2DD]"
                    }`}
                  >
                    {stage}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Description */}
          <DetailCard title="Detail Masalah">
            <div className="bg-[#FAFAFA] border border-[#E8E2DD] p-3 rounded-lg">
              <h5 className="text-xs font-bold text-[#2B2420] mb-1.5">{ticket.subject}</h5>
              <p className="text-[11px] text-[#8A817A] leading-relaxed line-clamp-4">{ticket.description}</p>
            </div>
          </DetailCard>
        </div>

        {/* Right Column: Timeline Log & Admin Response form */}
        <div className="lg:col-span-7 space-y-4">
          {/* Response Form */}
          <DetailCard title="Kirim Respon">
            <form onSubmit={handleResponseSubmit} className="space-y-3">
              <textarea
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                placeholder="Tulis instruksi perbaikan atau respon ke pelanggan..."
                rows={2} // Reduced rows to save height
                required
                className="w-full p-3 border border-[#E8E2DD] rounded-lg text-xs text-[#2B2420] placeholder-[#8A817A] outline-none focus:ring-1 focus:ring-[#79553D]"
              />
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-[#4A6B46]">{submitStatus}</span>
                <button
                  type="submit"
                  className="flex items-center gap-1 bg-[#79553D] hover:bg-[#634430] text-white px-4 py-1.5 rounded-lg text-xs font-semibold shadow-xs transition-colors"
                >
                  Kirim Respon
                </button>
              </div>
            </form>
          </DetailCard>

          {/* Timeline logs */}
          <DetailCard title="Lini Masa Log Aduan">
            <div className="relative pl-6 space-y-3.5 border-l border-[#E8E2DD] py-1">
              {localHistory.map((hist, i) => (
                <div key={i} className="relative">
                  <span className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-[#EFEBE7] border border-[#E8E2DD] flex items-center justify-center text-[#79553D]">
                    <FiCheck className="text-[8px]" />
                  </span>
                  <div className="flex justify-between items-start gap-4">
                    <h5 className="text-[11px] font-bold text-[#2B2420]">{hist.action}</h5>
                    <span className="text-[10px] text-[#8A817A] font-semibold">{hist.date}</span>
                  </div>
                  <p className="text-[10px] text-[#8A817A]">Oleh: {hist.actor}</p>
                </div>
              ))}
            </div>
          </DetailCard>
        </div>

      </div>

    </div>
  );
}
