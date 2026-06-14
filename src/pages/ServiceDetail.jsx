import React, { useMemo, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiChevronLeft, FiSend, FiCheck, FiCheckCircle } from "react-icons/fi";
import { CRMContext } from "../context/CRMContext";

import DetailCard from "../components/ui/DetailCard";
import InfoRow from "../components/ui/InfoRow";
import StatusBadge from "../components/ui/StatusBadge";
import Avatar from "../components/ui/Avatar";

const SERVICE_STAGES = ["Open", "In Progress", "Resolved", "Closed"];

export default function ServiceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { tickets, customers, updateTicket, updateTicketStatus } = useContext(CRMContext);

  // Find ticket
  const ticket = useMemo(() => {
    return tickets.find(t => {
      if (!t || !t.id) return false;
      const idA = String(t.id).trim().toLowerCase().replace(/^(#|[a-z]+-)+/g, "");
      const idB = String(id).trim().toLowerCase().replace(/^(#|[a-z]+-)+/g, "");
      if (idA === idB) return true;
      const numA = Number(idA.replace(/^0+/, ""));
      const numB = Number(idB.replace(/^0+/, ""));
      if (!isNaN(numA) && !isNaN(numB) && numA === numB) return true;
      return false;
    });
  }, [tickets, id]);

  // Find associated customer
  const customerInfo = useMemo(() => {
    if (!ticket) return null;
    return customers.find(c => {
      if (!c || !c.id) return false;
      const idA = String(c.id).trim().toLowerCase().replace(/^(#|[a-z]+-)+/g, "");
      const idB = String(ticket.customerId).trim().toLowerCase().replace(/^(#|[a-z]+-)+/g, "");
      if (idA === idB) return true;
      const numA = Number(idA.replace(/^0+/, ""));
      const numB = Number(idB.replace(/^0+/, ""));
      if (!isNaN(numA) && !isNaN(numB) && numA === numB) return true;
      return false;
    });
  }, [customers, ticket]);

  const [response, setResponse] = useState("");
  const [submitStatus, setSubmitStatus] = useState("");

  if (!ticket) {
    return (
      <div className="p-8 text-center text-[#2B2420] font-sans">
        <h2 className="text-xl font-bold">Tiket Tidak Ditemukan</h2>
        <p className="text-xs text-[#8A817A] mt-2">ID Tiket #{id} tidak terdaftar di database kami.</p>
        <button 
          onClick={() => navigate("/customer-service")}
          className="mt-4 px-4 py-2 bg-[#79553D] text-white rounded-lg text-xs font-semibold cursor-pointer border-none"
        >
          Kembali ke List
        </button>
      </div>
    );
  }

  const currentIdx = SERVICE_STAGES.indexOf(ticket.status);

  // History/replies logic
  const localHistory = ticket.history || [
    { date: ticket.date, action: "Log tiket aduan dibuat di sistem.", actor: "System" }
  ];

  const handleResponseSubmit = (e) => {
    e.preventDefault();
    if (!response.trim()) return;
    
    setSubmitStatus("Submitting...");
    const today = new Date().toISOString().split('T')[0];
    const newHistoryItem = { 
      date: today, 
      action: `Tanggapan: "${response}"`, 
      actor: "Ahmad Reza (Admin)" 
    };

    updateTicket({
      ...ticket,
      history: [...localHistory, newHistoryItem]
    });
    setResponse("");
    setSubmitStatus("Tanggapan berhasil dikirim!");
    setTimeout(() => setSubmitStatus(""), 2000);
  };

  const handleStageClick = (stage) => {
    const today = new Date().toISOString().split('T')[0];
    const newHistoryItem = { 
      date: today, 
      action: `Status tiket diubah ke ${stage}`, 
      actor: "Ahmad Reza (Admin)" 
    };

    updateTicket({
      ...ticket,
      status: stage,
      history: [...localHistory, newHistoryItem]
    });
  };

  return (
    <div className="max-w-6xl mx-auto font-sans text-left">
      {/* Top Header & Navigation */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#E8E2DD]/60 bg-white p-6 rounded-2xl border border-[#E8E2DD]/85">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate("/customer-service")}
            className="flex items-center justify-center w-8 h-8 border border-[#E8E2DD] hover:bg-[#FAFAFA] rounded-md text-[#8A817A] hover:text-[#2B2420] transition-colors bg-white cursor-pointer"
          >
            <FiChevronLeft className="text-base" />
          </button>
          <div>
            <span className="text-[10px] font-bold text-[#8A817A] uppercase tracking-wider block">Ticket Support</span>
            <h2 
              className="text-lg font-bold text-[#2B2420]"
              style={{ fontFamily: "ui-serif, Georgia, Cambria, serif" }}
            >
              Tiket {ticket.id}
            </h2>
          </div>
        </div>
        <StatusBadge status={ticket.status} />
      </div>

      {/* 2-Column Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Profile, Description & Stepper */}
        <div className="lg:col-span-5 space-y-6">
          {/* Customer & Ticket Info */}
          <DetailCard title="Laporan & Informasi">
            <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[#E8E2DD]/40">
              <Avatar name={ticket.customerName} size="sm" />
              <div>
                <p className="font-bold text-xs text-[#2B2420]">{ticket.customerName}</p>
                <p className="text-[10px] text-[#8A817A]">{customerInfo?.email || "No email"}</p>
              </div>
            </div>
            
            <div className="space-y-0.5">
              <InfoRow label="No. Telepon" value={customerInfo?.phone || "-"} />
              <InfoRow label="Kategori" value={ticket.category} />
              <InfoRow label="Prioritas" value={ticket.priority || "Medium"} />
              <InfoRow label="Tanggal Masuk" value={ticket.date} />
            </div>
          </DetailCard>

          {/* Stepper */}
          <div className="bg-[#FAF6F3] border border-[#E8E2DD] p-4.5 rounded-xl text-left">
            <span className="text-[9px] font-bold uppercase tracking-wider text-[#8A817A] block mb-3">Progres Penyelesaian</span>
            <div className="flex flex-col gap-2">
              {SERVICE_STAGES.map((stage, idx) => {
                const isActive = stage === ticket.status;
                const isCompleted = SERVICE_STAGES.indexOf(ticket.status) >= idx;
                
                return (
                  <button
                    key={stage}
                    onClick={() => handleStageClick(stage)}
                    className={`px-3 py-2 rounded-lg text-xs font-bold border transition-all text-left flex items-center justify-between cursor-pointer ${
                      isActive
                        ? "bg-[#79553D] text-white border-[#79553D]"
                        : isCompleted
                        ? "bg-[#E6ECE5] text-[#4A6B46] border-[#D8E2D7] hover:bg-[#FAF6F3]"
                        : "bg-white text-[#8A817A] border-[#E8E2DD] hover:text-[#2B2420] hover:bg-[#FAFAF8]"
                    }`}
                  >
                    <span>{stage}</span>
                    {isCompleted && <FiCheckCircle className="text-sm" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Description */}
          <DetailCard title="Detail Masalah">
            <div className="bg-[#FAFAF8] border border-[#E8E2DD] p-4 rounded-xl text-left">
              <h5 className="text-xs font-bold text-[#2B2420] mb-2">{ticket.subject}</h5>
              <p className="text-xs text-[#8A817A] leading-relaxed">{ticket.description || "Tidak ada rincian penjelasan tambahan."}</p>
            </div>
          </DetailCard>
        </div>

        {/* Right Column: Timeline Log & Admin Response form */}
        <div className="lg:col-span-7 space-y-6">
          {/* Response Form */}
          <DetailCard title="Kirim Respon">
            <form onSubmit={handleResponseSubmit} className="space-y-4">
              <textarea
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                placeholder="Tulis tanggapan resmi atau instruksi perbaikan..."
                rows={3}
                required
                className="w-full p-4 border border-[#E8E2DD] rounded-lg text-xs text-[#2B2420] placeholder-[#8A817A] outline-none focus:border-[#79553D] resize-none"
              />
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-[#4A6B46]">{submitStatus}</span>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 bg-[#79553D] hover:bg-[#634430] text-white px-4.5 py-2 rounded-lg text-xs font-bold shadow-xs transition-colors border-none cursor-pointer"
                >
                  Kirim Respon
                </button>
              </div>
            </form>
          </DetailCard>

          {/* Timeline logs */}
          <DetailCard title="Lini Masa Log Aduan">
            <div className="relative pl-6 space-y-4 border-l border-[#E8E2DD] py-1 ml-4 mt-4 text-left">
              {localHistory.map((hist, i) => (
                <div key={i} className="relative">
                  <span className="absolute -left-[35px] top-0 w-6 h-6 rounded-full bg-[#FAF6F3] border border-[#E8E2DD] flex items-center justify-center text-[#79553D]">
                    <FiCheck className="text-[10px]" />
                  </span>
                  <div className="flex justify-between items-start gap-4">
                    <h5 className="text-xs font-bold text-[#2B2420]">{hist.action}</h5>
                    <span className="text-[10px] text-[#8A817A] font-semibold">{hist.date}</span>
                  </div>
                  <p className="text-[10px] text-[#8A817A] mt-0.5">Oleh: {hist.actor}</p>
                </div>
              ))}
            </div>
          </DetailCard>
        </div>

      </div>

    </div>
  );
}
