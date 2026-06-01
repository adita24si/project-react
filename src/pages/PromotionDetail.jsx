import React, { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiChevronLeft, FiGift, FiTag } from "react-icons/fi";

import DetailCard from "../components/ui/DetailCard";
import InfoRow from "../components/ui/InfoRow";
import StatusBadge from "../components/ui/StatusBadge";
import DataTable from "../components/ui/DataTable";

export default function PromotionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Custom dummy details based on ID
  const promo = useMemo(() => {
    const cleanId = String(id).replace(/\D/g, "");
    const numeric = Number(cleanId) || 123;
    
    const types = ["Voucher", "Member Promo", "Diskon Khusus", "Campaign Marketing"];
    const targets = ["Semua Customer", "Member Gold & Platinum", "Member Silver", "New Registered Users"];
    
    const budgetTotal = 25000000;
    const budgetUsed = (numeric % 5 + 1) * 3500000;
    const budgetRemaining = budgetTotal - budgetUsed;
    const pctUsed = Math.round((budgetUsed / budgetTotal) * 100);

    return {
      id: id,
      name: "Diskon Lebaran Syawal",
      type: types[numeric % types.length],
      status: ["Active", "Expired", "Draft"][numeric % 3],
      start: "2026-05-01",
      end: "2026-06-15",
      target: targets[numeric % targets.length],
      code: "LEBARANSYAWAL10",
      discountValue: "Diskon 10% s/d Rp 1.500.000",
      minPurchase: "Rp 5.000.000",
      usageLimit: "100 Kali Penggunaan",
      usageCount: (numeric % 3 + 1) * 24,
      budgetUsed: budgetUsed,
      budgetRemaining: budgetRemaining,
      pctUsed: pctUsed,
      recentUsers: [
        { customer: "Ahmad Reza", date: "2026-05-24", transactionId: "TX-9012", discountSaved: 640000 },
        { customer: "Siti Rahmawati", date: "2026-05-22", transactionId: "TX-8971", discountSaved: 380000 },
        { customer: "Budi Santoso", date: "2026-05-20", transactionId: "TX-8912", discountSaved: 198000 },
      ]
    };
  }, [id]);

  return (
    <div className="p-5 md:p-6 max-w-6xl mx-auto font-sans bg-white border border-[#E8E2DD]/80 rounded-xl">
      {/* Top Header & Navigation on single line to save height */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#E8E2DD]/60">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate("/promotions")}
            className="flex items-center justify-center w-8 h-8 border border-[#E8E2DD] hover:bg-[#FAFAFA] rounded-md text-[#8A817A] hover:text-[#2B2420] transition-colors"
          >
            <FiChevronLeft className="text-base" />
          </button>
          <div>
            <span className="text-[10px] font-bold text-[#8A817A] uppercase tracking-wider block">Promo Detail</span>
            <h2 
              className="text-base font-bold text-[#2B2420]"
              style={{ fontFamily: "ui-serif, Georgia, Cambria, serif" }}
            >
              {promo.name}
            </h2>
          </div>
        </div>
        <StatusBadge status={promo.status} />
      </div>

      {/* 2-Column Side-by-Side Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left Column: Primary Promo Details */}
        <div className="lg:col-span-5 space-y-4">
          <DetailCard title="Detail Informasi">
            <div className="space-y-0.5">
              <InfoRow label="Nama Promo" value={promo.name} />
              <InfoRow label="Tipe Promo" value={promo.type} />
              <InfoRow 
                label="Kode Kupon" 
                value={<span className="font-mono bg-[#FAF6F3] border border-[#E8E2DD] px-2 py-0.5 rounded text-xs text-[#79553D] font-bold">{promo.code}</span>} 
              />
              <InfoRow label="Nilai Diskon" value={promo.discountValue} />
              <InfoRow label="Min. Belanja" value={promo.minPurchase} />
              <InfoRow label="Target" value={promo.target} />
              <InfoRow label="Mulai" value={promo.start} />
              <InfoRow label="Berakhir" value={promo.end} />
            </div>
          </DetailCard>
        </div>

        {/* Right Column: Budget Progression & Users logs */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Tightly aligned side-by-side card for budget & limit */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <DetailCard title="Kuota & Penggunaan">
              <div className="space-y-0.5">
                <InfoRow label="Limit Kuota" value={promo.usageLimit} />
                <InfoRow label="Jumlah Pakai" value={`${promo.usageCount} Kali`} />
              </div>
            </DetailCard>

            <DetailCard title="Anggaran Biaya">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-[#8A817A]">Terpakai</span>
                  <span className="text-[#79553D]">{promo.pctUsed}%</span>
                </div>
                <div className="w-full bg-[#EFEBE7] h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-[#79553D] h-full" 
                    style={{ width: `${promo.pctUsed}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-[#8A817A] font-semibold">
                  <span>Pakai: {(promo.budgetUsed / 1000000).toFixed(1)}M</span>
                  <span>Sisa: {(promo.budgetRemaining / 1000000).toFixed(1)}M</span>
                </div>
              </div>
            </DetailCard>
          </div>

          {/* Usage log list (Max 3 items, highly compact) */}
          <DetailCard title="Klaim Penggunaan Terbaru">
            <div className="border border-[#E8E2DD] rounded-lg overflow-hidden">
              <DataTable
                columns={[
                  { key: "customer", label: "Customer", render: (r) => <span className="font-semibold text-xs text-[#2B2420]">{r.customer}</span> },
                  { key: "date", label: "Tanggal" },
                  { 
                    key: "discountSaved", 
                    label: "Hemat", 
                    render: (r) => <span className="font-bold text-xs text-[#4A6B46]">-{r.discountSaved.toLocaleString("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 })}</span> 
                  }
                ]}
                data={promo.recentUsers}
                onRowClick={(row) => navigate(`/purchase-history/${row.transactionId}`)}
              />
            </div>
          </DetailCard>

        </div>

      </div>

    </div>
  );
}
