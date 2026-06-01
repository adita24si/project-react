import React, { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiChevronLeft, FiSave, FiHeart, FiCheck } from "react-icons/fi";

import DetailCard from "../components/ui/DetailCard";
import InfoRow from "../components/ui/InfoRow";
import StatusBadge from "../components/ui/StatusBadge";
import Avatar from "../components/ui/Avatar";

const CONSULT_STAGES = ["Requested", "Scheduled", "In Discussion", "Quotation Sent", "Completed"];

export default function ConsultationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Custom dummy details based on ID
  const consult = useMemo(() => {
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
      customerPhone: `0812${10000000 + numeric * 43}`,
      topic: "Layout & Tata Letak Dapur Minimalis",
      type: ["Desain Ruangan", "Pemilihan Produk"][numeric % 2],
      schedule: "2026-06-02 10:00 WIB",
      initialStage: CONSULT_STAGES[numeric % CONSULT_STAGES.length],
      description: "Customer ingin melakukan renovasi kitchen set dapur berukuran 3x4 meter. Menyukai gaya Japandi dengan kombinasi kayu jati muda.",
      salesAdvice: "Disarankan menggunakan layout L-shape kitchen cabinet. Menambahkan kitchen island di bagian tengah dengan top table dari material quartz putih.",
      results: "Desain 3D awal dikirimkan. Customer setuju dengan konsep warna. Langkah berikutnya adalah mencocokkan budget dengan material showroom.",
      recommendedProducts: ["Japandi Teak Dining Stool", "Walnut Serving Credenza", "Arco Brass Cabinet Knobs"]
    };
  }, [id]);

  const [advice, setAdvice] = useState(consult.salesAdvice);
  const [results, setResults] = useState(consult.results);
  const [saveStatus, setSaveStatus] = useState("");
  const [consultStage, setConsultStage] = useState(consult.initialStage);
  const currentIdx = CONSULT_STAGES.indexOf(consultStage);

  const handleSave = (e) => {
    e.preventDefault();
    setSaveStatus("Saving...");
    setTimeout(() => {
      setSaveStatus("Catatan konsultasi disimpan!");
      setTimeout(() => setSaveStatus(""), 2000);
    }, 800);
  };

  return (
    <div className="p-5 md:p-6 max-w-6xl mx-auto font-sans bg-white border border-[#E8E2DD]/80 rounded-xl">
      {/* Top Header & Navigation on single line */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#E8E2DD]/60">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate("/product-consultation")}
            className="flex items-center justify-center w-8 h-8 border border-[#E8E2DD] hover:bg-[#FAFAFA] rounded-md text-[#8A817A] hover:text-[#2B2420] transition-colors"
          >
            <FiChevronLeft className="text-base" />
          </button>
          <div>
            <span className="text-[10px] font-bold text-[#8A817A] uppercase tracking-wider block">Consultation Appointment</span>
            <h2 
              className="text-base font-bold text-[#2B2420]"
              style={{ fontFamily: "ui-serif, Georgia, Cambria, serif" }}
            >
              Konsultasi {consult.id}
            </h2>
          </div>
        </div>
        <StatusBadge status={consultStage} />
      </div>

      {/* 2-Column Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left Column: Profile, Stepper & Recommended Products */}
        <div className="lg:col-span-5 space-y-4">
          {/* Customer Profile & Info in unified card */}
          <DetailCard title="Informasi Jadwal & Customer">
            <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[#E8E2DD]/40">
              <Avatar name={consult.customer} size="sm" />
              <div>
                <p className="font-semibold text-xs text-[#2B2420]">{consult.customer}</p>
                <p className="text-[10px] text-[#8A817A]">{consult.customerEmail}</p>
              </div>
            </div>
            
            <div className="space-y-0.5">
              <InfoRow label="Jenis Pertemuan" value={consult.type} />
              <InfoRow label="Jadwal" value={consult.schedule} />
              <InfoRow label="Telepon" value={consult.customerPhone} />
            </div>
          </DetailCard>

          {/* Stepper card */}
          <div className="bg-[#FAF6F3] border border-[#E8E2DD] p-3.5 rounded-xl">
            <span className="text-[9px] font-bold uppercase tracking-wider text-[#8A817A] block mb-2">Tahapan Konsultasi</span>
            <div className="flex flex-wrap gap-1 items-center justify-between">
              {CONSULT_STAGES.map((stage, idx) => {
                const isActive = idx === currentIdx;
                const isCompleted = idx < currentIdx;
                return (
                  <button
                    key={stage}
                    onClick={() => setConsultStage(stage)}
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

          {/* Recommended Products in tight grid */}
          <DetailCard title="Rekomendasi Furniture">
            <div className="grid grid-cols-3 gap-2">
              {consult.recommendedProducts.map((prod, i) => (
                <div key={i} className="border border-[#E8E2DD] p-2 rounded bg-[#FAFAFA]/40 flex flex-col justify-between h-20">
                  <FiHeart className="text-[#79553D] text-[10px] self-start" />
                  <h5 className="text-[9px] font-bold text-[#2B2420] leading-tight line-clamp-2">{prod}</h5>
                </div>
              ))}
            </div>
          </DetailCard>
        </div>

        {/* Right Column: Topic Description & Sales Notes Form */}
        <div className="lg:col-span-7 space-y-4">
          {/* Topic Description */}
          <DetailCard title="Topik & Deskripsi">
            <div className="bg-[#FAFAFA] border border-[#E8E2DD] p-3 rounded-lg">
              <h5 className="text-xs font-bold text-[#2B2420] mb-1">{consult.topic}</h5>
              <p className="text-[11px] text-[#8A817A] leading-relaxed">{consult.description}</p>
            </div>
          </DetailCard>

          {/* Note Logger Form */}
          <DetailCard title="Catatan Konsultan / Tim Sales">
            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8A817A] mb-1">Saran Desainer / Tim Sales</label>
                <textarea
                  value={advice}
                  onChange={(e) => setAdvice(e.target.value)}
                  placeholder="Detail layout, tipe finishing..."
                  rows={2} // Reduced rows
                  className="w-full p-2.5 border border-[#E8E2DD] rounded-lg text-xs text-[#2B2420] outline-none focus:ring-1 focus:ring-[#79553D]"
                />
              </div>
              
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8A817A] mb-1">Hasil Konsultasi & Deal</label>
                <textarea
                  value={results}
                  onChange={(e) => setResults(e.target.value)}
                  placeholder="Tulis kesepakatan akhir..."
                  rows={2} // Reduced rows
                  className="w-full p-2.5 border border-[#E8E2DD] rounded-lg text-xs text-[#2B2420] outline-none focus:ring-1 focus:ring-[#79553D]"
                />
              </div>

              <div className="flex justify-between items-center pt-1">
                <span className="text-xs font-semibold text-[#4A6B46]">{saveStatus}</span>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 bg-[#79553D] hover:bg-[#634430] text-white px-4 py-1.5 rounded-lg text-xs font-semibold shadow-xs transition-colors"
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
