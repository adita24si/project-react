import React, { useMemo, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiChevronLeft, FiGift, FiTag } from "react-icons/fi";
import { CRMContext } from "../context/CRMContext";

import DetailCard from "../components/ui/DetailCard";
import InfoRow from "../components/ui/InfoRow";
import StatusBadge from "../components/ui/StatusBadge";
import DataTable from "../components/ui/DataTable";

export default function PromotionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { promotions } = useContext(CRMContext);

  // Find promo
  const promo = useMemo(() => {
    return promotions.find(p => {
      if (!p || !p.id) return false;
      const idA = String(p.id).trim().toLowerCase().replace(/^(#|[a-z]+-)+/g, "");
      const idB = String(id).trim().toLowerCase().replace(/^(#|[a-z]+-)+/g, "");
      if (idA === idB) return true;
      const numA = Number(idA.replace(/^0+/, ""));
      const numB = Number(idB.replace(/^0+/, ""));
      if (!isNaN(numA) && !isNaN(numB) && numA === numB) return true;
      return false;
    });
  }, [promotions, id]);

  const promoInfo = useMemo(() => {
    if (!promo) return null;
    const usageLimit = 100;
    const usageCount = promo.uses || 0;
    const pctUsed = Math.min(Math.round((usageCount / usageLimit) * 100), 100);
    
    // Recent claims dummy log
    const recentUsers = [
      { customer: "Ahmad Reza", date: "2026-06-14", transactionId: "TRX-001", discountSaved: promo.type === "Promo Membership" ? 2850000 : promo.value },
      { customer: "Siti Rahmawati", date: "2026-06-12", transactionId: "TRX-002", discountSaved: promo.type === "Promo Membership" ? 2050000 : promo.value },
    ].slice(0, usageCount > 0 ? usageCount : 0);

    return {
      usageLimit,
      usageCount,
      pctUsed,
      recentUsers
    };
  }, [promo]);

  if (!promo || !promoInfo) {
    return (
      <div className="p-8 text-center text-[#2B2420] font-sans">
        <h2 className="text-xl font-bold">Promo Tidak Ditemukan</h2>
        <p className="text-xs text-[#8A817A] mt-2">ID Promo #{id} tidak terdaftar di database kami.</p>
        <button 
          onClick={() => navigate("/promotions")}
          className="mt-4 px-4 py-2 bg-[#79553D] text-white rounded-lg text-xs font-semibold cursor-pointer border-none"
        >
          Kembali ke List
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto font-sans text-left">
      {/* Top Header & Navigation */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#E8E2DD]/60 bg-white p-6 rounded-2xl border border-[#E8E2DD]/85">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate("/promotions")}
            className="flex items-center justify-center w-8 h-8 border border-[#E8E2DD] hover:bg-[#FAFAFA] rounded-md text-[#8A817A] hover:text-[#2B2420] transition-colors bg-white cursor-pointer"
          >
            <FiChevronLeft className="text-base" />
          </button>
          <div>
            <span className="text-[10px] font-bold text-[#8A817A] uppercase tracking-wider block">Promo Detail</span>
            <h2 
              className="text-lg font-bold text-[#2B2420] mt-0.5"
              style={{ fontFamily: "ui-serif, Georgia, Cambria, serif" }}
            >
              {promo.name}
            </h2>
          </div>
        </div>
        <StatusBadge status={promo.status === "Aktif" ? "Active" : "Expired"} />
      </div>

      {/* 2-Column Side-by-Side Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Primary Promo Details */}
        <div className="lg:col-span-5 space-y-6">
          <DetailCard title="Detail Informasi">
            <div className="space-y-0.5">
              <InfoRow label="Nama Promo" value={promo.name} />
              <InfoRow label="Tipe Promo" value={promo.type} />
              <InfoRow 
                label="Kode Kupon" 
                value={<span className="font-mono bg-[#FAF6F3] border border-[#E8E2DD] px-2.5 py-0.5 rounded text-xs text-[#79553D] font-bold">{promo.code}</span>} 
              />
              <InfoRow 
                label="Nilai Potongan" 
                value={promo.type === "Promo Membership" ? `${promo.value}%` : `Rp ${promo.value.toLocaleString("id-ID")}`} 
              />
              <InfoRow label="Target Customer" value="Semua Member" />
              <InfoRow label="Status Kampanye" value={promo.status} />
            </div>
          </DetailCard>
        </div>

        {/* Right Column: Budget Progression & Users logs */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Kuota & Penggunaan */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <DetailCard title="Kuota & Penggunaan">
              <div className="space-y-0.5">
                <InfoRow label="Limit Kuota" value={`${promoInfo.usageLimit} Penggunaan`} />
                <InfoRow label="Jumlah Pakai" value={`${promoInfo.usageCount} Kali`} />
              </div>
            </DetailCard>

            <DetailCard title="Anggaran Kampanye">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-[#8A817A]">Kuota Terpakai</span>
                  <span className="text-[#79553D]">{promoInfo.pctUsed}%</span>
                </div>
                <div className="w-full bg-[#EFEBE7] h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-[#79553D] h-full" 
                    style={{ width: `${promoInfo.pctUsed}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-[#8A817A] font-semibold">
                  <span>Pakai: {promoInfo.usageCount}</span>
                  <span>Sisa: {promoInfo.usageLimit - promoInfo.usageCount}</span>
                </div>
              </div>
            </DetailCard>
          </div>

          {/* Usage log list */}
          <DetailCard title="Klaim Penggunaan Terbaru">
            <div className="border border-[#E8E2DD] rounded-lg overflow-hidden">
              <DataTable
                columns={[
                  { key: "customer", label: "Customer", render: (r) => <span className="font-bold text-xs text-[#2B2420]">{r.customer}</span> },
                  { key: "date", label: "Tanggal Penggunaan" },
                  { 
                    key: "discountSaved", 
                    label: "Hemat", 
                    render: (r) => (
                      <span className="font-extrabold text-xs text-[#4A6B46]">
                        -Rp {r.discountSaved.toLocaleString("id-ID")}
                      </span>
                    ) 
                  }
                ]}
                data={promoInfo.recentUsers}
                onRowClick={(row) => navigate(`/purchase-history/${row.transactionId}`)}
                emptyMessage="Voucher belum pernah diklaim oleh customer."
              />
            </div>
          </DetailCard>

        </div>

      </div>

    </div>
  );
}
