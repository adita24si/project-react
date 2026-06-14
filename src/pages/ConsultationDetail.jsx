import React, { useMemo, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiChevronLeft, FiSave, FiHeart, FiCheck } from "react-icons/fi";
import { CRMContext } from "../context/CRMContext";

import DetailCard from "../components/ui/DetailCard";
import InfoRow from "../components/ui/InfoRow";
import StatusBadge from "../components/ui/StatusBadge";
import Avatar from "../components/ui/Avatar";

const CONSULT_STAGES = ["Requested", "Scheduled", "In Discussion", "Quotation Sent", "Completed"];

export default function ConsultationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { consultations, customers } = useContext(CRMContext);

  // Find consultation
  const consult = useMemo(() => {
    return consultations.find(c => {
      if (!c || !c.id) return false;
      const idA = String(c.id).trim().toLowerCase().replace(/^(#|[a-z]+-)+/g, "");
      const idB = String(id).trim().toLowerCase().replace(/^(#|[a-z]+-)+/g, "");
      if (idA === idB) return true;
      const numA = Number(idA.replace(/^0+/, ""));
      const numB = Number(idB.replace(/^0+/, ""));
      if (!isNaN(numA) && !isNaN(numB) && numA === numB) return true;
      return false;
    });
  }, [consultations, id]);

  // Find associated customer
  const customerInfo = useMemo(() => {
    if (!consult) return null;
    return customers.find(c => {
      if (!c || !c.id) return false;
      const idA = String(c.id).trim().toLowerCase().replace(/^(#|[a-z]+-)+/g, "");
      const idB = String(consult.customerId).trim().toLowerCase().replace(/^(#|[a-z]+-)+/g, "");
      if (idA === idB) return true;
      const numA = Number(idA.replace(/^0+/, ""));
      const numB = Number(idB.replace(/^0+/, ""));
      if (!isNaN(numA) && !isNaN(numB) && numA === numB) return true;
      return false;
    });
  }, [customers, consult]);

  const [advice, setAdvice] = useState(consult?.salesAdvice || "Disarankan tata ruang minimalis atau scandinavian.");
  const [results, setResults] = useState(consult?.results || "Desain awal disetujui. Melanjutkan ke quotation harga.");
  const [saveStatus, setSaveStatus] = useState("");
  const [consultStage, setConsultStage] = useState(consult?.status || "Scheduled");

  if (!consult) {
    return (
      <div className="p-8 text-center text-[#2B2420] font-sans">
        <h2 className="text-xl font-bold">Konsultasi Tidak Ditemukan</h2>
        <p className="text-xs text-[#8A817A] mt-2">ID Konsultasi #{id} tidak terdaftar di database kami.</p>
        <button 
          onClick={() => navigate("/product-consultation")}
          className="mt-4 px-4 py-2 bg-[#79553D] text-white rounded-lg text-xs font-semibold cursor-pointer border-none"
        >
          Kembali ke List
        </button>
      </div>
    );
  }

  const currentIdx = CONSULT_STAGES.indexOf(consultStage);

  const handleSave = (e) => {
    e.preventDefault();
    setSaveStatus("Saving...");
    setTimeout(() => {
      setSaveStatus("Catatan konsultasi disimpan!");
      setTimeout(() => setSaveStatus(""), 2000);
    }, 500);
  };

  const recommendedProducts = [
    "Oslo Walnut Sofa", 
    "Mika Dining Table", 
    "Nara Lounge Chair"
  ];

  return (
    <div className="max-w-6xl mx-auto font-sans text-left">
      {/* Top Header & Navigation */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#E8E2DD]/60 bg-white p-6 rounded-2xl border border-[#E8E2DD]/85">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate("/product-consultation")}
            className="flex items-center justify-center w-8 h-8 border border-[#E8E2DD] hover:bg-[#FAFAFA] rounded-md text-[#8A817A] hover:text-[#2B2420] transition-colors bg-white cursor-pointer"
          >
            <FiChevronLeft className="text-base" />
          </button>
          <div>
            <span className="text-[10px] font-bold text-[#8A817A] uppercase tracking-wider block">Consultation Appointment</span>
            <h2 
              className="text-lg font-bold text-[#2B2420]"
              style={{ fontFamily: "ui-serif, Georgia, Cambria, serif" }}
            >
              Konsultasi {consult.id}
            </h2>
          </div>
        </div>
        <StatusBadge status={consultStage} />
      </div>

      {/* 2-Column Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Profile, Stepper & Recommended Products */}
        <div className="lg:col-span-5 space-y-6">
          {/* Customer Profile & Info */}
          <DetailCard title="Informasi Jadwal & Customer">
            <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[#E8E2DD]/40">
              <Avatar name={consult.customerName} size="sm" />
              <div>
                <p className="font-bold text-xs text-[#2B2420]">{consult.customerName}</p>
                <p className="text-[10px] text-[#8A817A]">{customerInfo?.email || "No email"}</p>
              </div>
            </div>
            
            <div className="space-y-0.5">
              <InfoRow label="No. Telepon" value={customerInfo?.phone || "-"} />
              <InfoRow label="Jenis Ruangan" value={consult.roomType} />
              <InfoRow label="Luas Ruangan" value={`${consult.roomArea} m²`} />
              <InfoRow 
                label="Estimasi Budget" 
                value={(consult.budget || 0).toLocaleString("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 })} 
              />
              <InfoRow label="Preferensi Desain" value={consult.designPreference} />
              <InfoRow label="Tanggal Konsultasi" value={consult.date} />
            </div>
          </DetailCard>

          {/* Stepper card */}
          <div className="bg-[#FAF6F3] border border-[#E8E2DD] p-4.5 rounded-xl text-left">
            <span className="text-[9px] font-bold uppercase tracking-wider text-[#8A817A] block mb-3">Tahapan Konsultasi</span>
            <div className="flex flex-col gap-2">
              {CONSULT_STAGES.map((stage, idx) => {
                const isActive = stage === consultStage;
                const isCompleted = CONSULT_STAGES.indexOf(consultStage) >= idx;
                return (
                  <button
                    key={stage}
                    onClick={() => setConsultStage(stage)}
                    className={`px-3 py-2 rounded-lg text-xs font-bold border transition-all text-left flex items-center justify-between cursor-pointer ${
                      isActive
                        ? "bg-[#79553D] text-white border-[#79553D]"
                        : isCompleted
                        ? "bg-[#E6ECE5] text-[#4A6B46] border-[#D8E2D7] hover:bg-[#FAF6F3]"
                        : "bg-white text-[#8A817A] border-[#E8E2DD] hover:text-[#2B2420] hover:bg-[#FAFAF8]"
                    }`}
                  >
                    <span>{stage}</span>
                    {isCompleted && <FiCheck className="text-sm text-[#4A6B46]" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Recommended Products */}
          <DetailCard title="Rekomendasi Furniture">
            <div className="grid grid-cols-3 gap-3">
              {recommendedProducts.map((prod, i) => (
                <div key={i} className="border border-[#E8E2DD] p-3 rounded-xl bg-[#FAFAF8] flex flex-col justify-between h-24 text-left">
                  <FiHeart className="text-[#79553D] text-xs self-start" />
                  <h5 className="text-[10px] font-bold text-[#2B2420] leading-tight line-clamp-2 mt-2">{prod}</h5>
                </div>
              ))}
            </div>
          </DetailCard>
        </div>

        {/* Right Column: Topic Description & Sales Notes Form */}
        <div className="lg:col-span-7 space-y-6">
          {/* Topic Description */}
          <DetailCard title="Topik & Deskripsi">
            <div className="bg-[#FAFAF8] border border-[#E8E2DD] p-4 rounded-xl text-left">
              <h5 className="text-xs font-bold text-[#2B2420] mb-2">Konsultasi Desain {consult.roomType}</h5>
              <p className="text-xs text-[#8A817A] leading-relaxed">
                Customer mengajukan pembuatan layout ruangan dan pemilihan furniture yang sesuai dengan tema {consult.designPreference}. 
                Budget pengerjaan adalah Rp {(consult.budget || 0).toLocaleString("id-ID")}.
              </p>
            </div>
          </DetailCard>

          {/* Note Logger Form */}
          <DetailCard title="Catatan Konsultan / Tim Sales">
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8A817A] mb-1.5">Saran Desainer / Tim Sales</label>
                <textarea
                  value={advice}
                  onChange={(e) => setAdvice(e.target.value)}
                  placeholder="Detail layout, tipe finishing, penataan furniture..."
                  rows={3}
                  className="w-full p-3.5 border border-[#E8E2DD] rounded-lg text-xs text-[#2B2420] outline-none focus:border-[#79553D] resize-none"
                />
              </div>
              
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8A817A] mb-1.5">Hasil Konsultasi & Deal</label>
                <textarea
                  value={results}
                  onChange={(e) => setResults(e.target.value)}
                  placeholder="Tulis kesepakatan akhir, jadwal survey lapangan..."
                  rows={3}
                  className="w-full p-3.5 border border-[#E8E2DD] rounded-lg text-xs text-[#2B2420] outline-none focus:border-[#79553D] resize-none"
                />
              </div>

              <div className="flex justify-between items-center pt-2">
                <span className="text-xs font-bold text-[#4A6B46]">{saveStatus}</span>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 bg-[#79553D] hover:bg-[#634430] text-white px-4.5 py-2 rounded-lg text-xs font-bold shadow-xs transition-colors border-none cursor-pointer"
                >
                  Simpan Catatan
                </button>
              </div>
            </form>
          </DetailCard>
        </div>

      </div>

    </div>
  );
}
