import React, { useMemo, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiChevronLeft, FiAward } from "react-icons/fi";
import { CRMContext } from "../context/CRMContext";

import DetailCard from "../components/ui/DetailCard";
import InfoRow from "../components/ui/InfoRow";
import MembershipBadge from "../components/ui/MembershipBadge";
import MembershipCard from "../components/ui/MembershipCard";
import Avatar from "../components/ui/Avatar";

export default function MembershipDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { customers } = useContext(CRMContext);

  // Find customer from global context
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

  const memberInfo = useMemo(() => {
    if (!customer) return null;
    const tier = customer.loyalty;
    const totalSpent = customer.totalSpent;

    let nextTier = "";
    let requiredSpent = 0;
    let limit = 0;

    if (tier === "Bronze") {
      nextTier = "Silver";
      limit = 15000000;
      requiredSpent = limit - totalSpent;
    } else if (tier === "Silver") {
      nextTier = "Gold";
      limit = 50000000;
      requiredSpent = limit - totalSpent;
    } else if (tier === "Gold") {
      nextTier = "Platinum";
      limit = 120000000;
      requiredSpent = limit - totalSpent;
    } else if (tier === "Platinum") {
      nextTier = "VIP";
      limit = 300000000;
      requiredSpent = limit - totalSpent;
    }

    const progressPct = tier === "VIP" 
      ? 100 
      : Math.min(Math.round((totalSpent / limit) * 100), 99);

    return {
      nextTier,
      requiredSpent: requiredSpent > 0 ? requiredSpent : 0,
      progressPct: progressPct > 0 ? progressPct : 0
    };
  }, [customer]);

  if (!customer) {
    return (
      <div className="p-8 text-center text-[#2B2420] font-sans">
        <h2 className="text-xl font-bold">Member Tidak Ditemukan</h2>
        <p className="text-xs text-[#8A817A] mt-2">ID Pelanggan #{id} tidak terdaftar di database kami.</p>
        <button 
          onClick={() => navigate("/memberships")}
          className="mt-4 px-4 py-2 bg-[#79553D] text-white rounded-lg text-xs font-semibold cursor-pointer border-none"
        >
          Kembali ke List
        </button>
      </div>
    );
  }

  const getTierBenefits = (t) => {
    switch (t) {
      case "VIP":
        return [
          "Diskon langsung 20% untuk semua produk furniture",
          "Prioritas layanan konsultasi interior (Booking Tanpa Antre)",
          "Gratis pengiriman & instalasi seluruh Indonesia",
          "Poin reward berlipat 2x untuk setiap transaksi",
          "Layanan pengiriman akhir pekan prioritas"
        ];
      case "Platinum":
        return [
          "Diskon langsung 15% untuk semua produk furniture",
          "Gratis pengiriman & instalasi seluruh Indonesia",
          "Poin reward berlipat 1.5x untuk setiap transaksi",
          "Akses prioritas 7 hari lebih awal rilis koleksi baru"
        ];
      case "Gold":
        return [
          "Diskon langsung 10% untuk semua produk furniture",
          "Gratis pengiriman & instalasi se-Jabodetabek",
          "Poin reward standar 1.2x untuk setiap transaksi",
          "Undangan prioritas ke pameran showroom seasonal"
        ];
      case "Silver":
        return [
          "Diskon langsung 5% untuk semua produk furniture",
          "Diskon 50% biaya instalasi di Jabodetabek",
          "Poin reward standar 1x untuk setiap transaksi"
        ];
      case "Bronze":
      default:
        return [
          "Akses ke Loyalty Points (Belanja = Poin)",
          "Info promo produk terbaru berkala via email"
        ];
    }
  };

  const benefits = getTierBenefits(customer.loyalty);

  return (
    <div className="max-w-6xl mx-auto font-sans text-left">
      {/* Top Header & Navigation */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#E8E2DD]/60 bg-white p-6 rounded-2xl border border-[#E8E2DD]/85">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate("/memberships")}
            className="flex items-center justify-center w-8 h-8 border border-[#E8E2DD] hover:bg-[#FAFAFA] rounded-md text-[#8A817A] hover:text-[#2B2420] transition-colors bg-white cursor-pointer"
          >
            <FiChevronLeft className="text-base" />
          </button>
          <div>
            <span className="text-[10px] font-bold text-[#8A817A] uppercase tracking-wider block">Membership Detail</span>
            <div className="flex items-center gap-2 mt-0.5">
              <h2 
                className="text-base font-bold text-[#2B2420]"
                style={{ fontFamily: "ui-serif, Georgia, Cambria, serif" }}
              >
                {customer.name}
              </h2>
              <MembershipBadge tier={customer.loyalty} />
            </div>
          </div>
        </div>
      </div>

      {/* 2-Column Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Member Card & Stats */}
        <div className="lg:col-span-5 space-y-6">
          <div className="flex justify-center">
            <MembershipCard 
              tier={customer.loyalty} 
              count={customers.filter(c => c.loyalty === customer.loyalty).length}
              active={true}
              onClick={() => {}}
            />
          </div>
          <DetailCard title="Profil & Status Member">
            <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[#E8E2DD]/40">
              <Avatar name={customer.name} size="md" />
              <div>
                <p className="font-bold text-xs text-[#2B2420]">{customer.name}</p>
                <p className="text-[11px] text-[#8A817A]">{customer.email}</p>
              </div>
            </div>
            
            <div className="space-y-0.5">
              <InfoRow label="Tanggal Gabung" value={customer.joinDate} />
              <InfoRow 
                label="Total Belanja" 
                value={(customer.totalSpent || 0).toLocaleString("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 })} 
              />
              <InfoRow label="Poin Reward" value={`${customer.loyaltyPoints || 0} Poin`} />
            </div>

            {/* Progress bar to next level */}
            {customer.loyalty !== "VIP" && memberInfo && (
              <div className="mt-4 pt-3 border-t border-[#E8E2DD]/40 space-y-2">
                <div className="flex justify-between text-[11px] font-bold">
                  <span className="text-[#8A817A]">Target ke {memberInfo.nextTier}</span>
                  <span className="text-[#79553D]">{memberInfo.progressPct}%</span>
                </div>
                <div className="w-full bg-[#EFEBE7] h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-[#79553D] h-full rounded-full" 
                    style={{ width: `${memberInfo.progressPct}%` }}
                  />
                </div>
                <p className="text-[10px] text-[#8A817A] leading-tight">
                  Belanja <strong className="text-[#2B2420]">Rp {(memberInfo.requiredSpent || 0).toLocaleString("id-ID")}</strong> lagi untuk naik ke tier berikutnya.
                </p>
              </div>
            )}
          </DetailCard>
        </div>

        {/* Right Column: Benefits & Upgrade Logs */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Benefit Card */}
          <DetailCard title={`Benefit Tier ${customer.loyalty}`}>
            <ul className="space-y-2">
              {benefits.map((benefit, i) => (
                <li key={i} className="flex gap-2 text-xs text-[#8A817A] leading-normal items-start">
                  <span className="text-[#79553D] font-extrabold">•</span>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </DetailCard>

          {/* Upgrade History Timeline */}
          <DetailCard title="Riwayat Upgrade Status">
            <div className="relative pl-6 space-y-4 border-l border-[#E8E2DD] py-1 ml-4 mt-4">
              <div className="relative">
                <span className="absolute -left-[35px] top-0 w-6 h-6 rounded-full bg-[#FAF6F3] border border-[#E8E2DD] flex items-center justify-center text-[#79553D]">
                  <FiAward className="text-xs" />
                </span>
                <div className="flex justify-between items-start gap-4">
                  <h5 className="text-xs font-bold text-[#2B2420]">Member Level: {customer.loyalty}</h5>
                  <span className="text-[10px] text-[#8A817A] font-semibold">Aktif</span>
                </div>
                <p className="text-[10px] text-[#8A817A] mt-0.5">Status level membership aktif berdasarkan akumulasi transaksi.</p>
              </div>
              <div className="relative">
                <span className="absolute -left-[35px] top-0 w-6 h-6 rounded-full bg-[#FAF6F3] border border-[#E8E2DD] flex items-center justify-center text-[#79553D]">
                  <FiAward className="text-xs" />
                </span>
                <div className="flex justify-between items-start gap-4">
                  <h5 className="text-xs font-bold text-[#2B2420]">Registrasi Awal</h5>
                  <span className="text-[10px] text-[#8A817A] font-semibold">{customer.joinDate}</span>
                </div>
                <p className="text-[10px] text-[#8A817A] mt-0.5">Pendaftaran member awal di sistem CRM FurniCraft.</p>
              </div>
            </div>
          </DetailCard>

        </div>

      </div>

    </div>
  );
}
