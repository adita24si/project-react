import React, { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiChevronLeft, FiAward } from "react-icons/fi";

import DetailCard from "../components/ui/DetailCard";
import InfoRow from "../components/ui/InfoRow";
import MembershipBadge from "../components/ui/MembershipBadge";
import Avatar from "../components/ui/Avatar";

export default function MembershipDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Custom membership detail dummy data based on ID
  const member = useMemo(() => {
    const names = [
      "Budi Santoso", "Siti Rahmawati", "Ahmad Reza", "Dewi Lestari", "Andi Wijaya"
    ];
    const cleanId = String(id).replace(/\D/g, "");
    const numeric = Number(cleanId) || 123;
    const name = names[numeric % names.length];
    const tier = ["Silver", "Gold", "Platinum"][numeric % 3];
    const totalSpent = (numeric % 5 + 1) * 6500000;
    const rewardPoints = (numeric % 5 + 1) * 230;

    // Progression variables towards next tier
    let nextTier = "";
    let requiredSpent = 0;
    if (tier === "Silver") {
      nextTier = "Gold";
      requiredSpent = 15000000 - totalSpent > 0 ? 15000000 - totalSpent : 2500000;
    } else if (tier === "Gold") {
      nextTier = "Platinum";
      requiredSpent = 30000000 - totalSpent > 0 ? 30000000 - totalSpent : 5000000;
    }

    const progressPct = tier === "Platinum" ? 100 : Math.min(Math.round((totalSpent / (totalSpent + requiredSpent)) * 100), 100);

    return {
      id: id,
      name: name,
      email: `${name.toLowerCase().replace(/\s+/g, "")}@gmail.com`,
      tier: tier,
      totalSpent: totalSpent,
      rewardPoints: rewardPoints,
      joinDate: `10 Januari 2025`,
      nextTier: nextTier,
      requiredSpent: requiredSpent,
      progressPct: progressPct,
      history: [
        { date: "2026-04-12", action: "Upgrade to " + tier, notes: "Automated upgrade." },
        { date: "2025-10-10", action: "Member Created (Bronze)", notes: "Initial registration." },
      ]
    };
  }, [id]);

  const getTierBenefits = (t) => {
    switch (t) {
      case "Platinum":
        return [
          "Diskon langsung 10% untuk semua koleksi mebel",
          "Gratis pengiriman & instalasi seluruh Indonesia",
          "Poin reward berlipat 2x untuk setiap transaksi",
          "Akses prioritas 7 hari lebih awal rilis koleksi baru"
        ];
      case "Gold":
        return [
          "Diskon langsung 7% untuk semua koleksi mebel",
          "Gratis pengiriman & instalasi se-Jabodetabek",
          "Poin reward berlipat 1.5x untuk setiap transaksi",
          "Undangan prioritas ke pameran showroom seasonal"
        ];
      case "Silver":
      default:
        return [
          "Diskon langsung 5% untuk semua koleksi mebel",
          "Diskon 50% biaya instalasi di Jabodetabek",
          "Poin reward standar 1x untuk setiap transaksi"
        ];
    }
  };

  const benefits = getTierBenefits(member.tier);

  return (
    <div className="p-5 md:p-6 max-w-6xl mx-auto font-sans bg-white border border-[#E8E2DD]/80 rounded-xl">
      {/* Top Header & Navigation on single line */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#E8E2DD]/60">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate("/memberships")}
            className="flex items-center justify-center w-8 h-8 border border-[#E8E2DD] hover:bg-[#FAFAFA] rounded-md text-[#8A817A] hover:text-[#2B2420] transition-colors"
          >
            <FiChevronLeft className="text-base" />
          </button>
          <div>
            <span className="text-[10px] font-bold text-[#8A817A] uppercase tracking-wider block">Membership Detail</span>
            <div className="flex items-center gap-2">
              <h2 
                className="text-base font-bold text-[#2B2420]"
                style={{ fontFamily: "ui-serif, Georgia, Cambria, serif" }}
              >
                {member.name}
              </h2>
              <MembershipBadge tier={member.tier} />
            </div>
          </div>
        </div>
      </div>

      {/* 2-Column Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left Column: Member Card & Stats */}
        <div className="lg:col-span-5 space-y-4">
          <DetailCard title="Profil & Status Member">
            <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[#E8E2DD]/40">
              <Avatar name={member.name} size="md" />
              <div>
                <p className="font-semibold text-xs text-[#2B2420]">{member.name}</p>
                <p className="text-[11px] text-[#8A817A]">{member.email}</p>
              </div>
            </div>
            
            <div className="space-y-0.5">
              <InfoRow label="Tanggal Gabung" value={member.joinDate} />
              <InfoRow 
                label="Total Belanja" 
                value={member.totalSpent.toLocaleString("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 })} 
              />
              <InfoRow label="Poin Reward" value={`${member.rewardPoints} Poin`} />
            </div>

            {/* Inlined progress target inside profile card */}
            {member.tier !== "Platinum" && (
              <div className="mt-4 pt-3 border-t border-[#E8E2DD]/40 space-y-2">
                <div className="flex justify-between text-[11px] font-semibold">
                  <span className="text-[#8A817A]">Target ke {member.nextTier}</span>
                  <span className="text-[#79553D]">{member.progressPct}%</span>
                </div>
                <div className="w-full bg-[#EFEBE7] h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-[#79553D] h-full rounded-full" 
                    style={{ width: `${member.progressPct}%` }}
                  />
                </div>
                <p className="text-[10px] text-[#8A817A] leading-tight">
                  Belanja <strong className="text-[#2B2420]">{(member.requiredSpent / 1000000).toFixed(1)}M</strong> lagi untuk naik ke tier berikutnya.
                </p>
              </div>
            )}
          </DetailCard>
        </div>

        {/* Right Column: Benefits & Upgrade Logs */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Benefit Card */}
          <DetailCard title={`Benefit Tier ${member.tier}`}>
            <ul className="space-y-2">
              {benefits.map((benefit, i) => (
                <li key={i} className="flex gap-2 text-xs text-[#8A817A] leading-normal items-start">
                  <span className="text-[#79553D] font-bold">•</span>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </DetailCard>

          {/* Compact Timeline Upgrade logs */}
          <DetailCard title="Riwayat Upgrade Status">
            <div className="relative pl-6 space-y-4 border-l border-[#E8E2DD] py-1">
              {member.history.map((hist, i) => (
                <div key={i} className="relative">
                  <span className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-[#FAF6F3] border border-[#E8E2DD] flex items-center justify-center text-[#79553D]">
                    <FiAward className="text-[8px]" />
                  </span>
                  <div className="flex justify-between items-start gap-4">
                    <h5 className="text-xs font-semibold text-[#2B2420]">{hist.action}</h5>
                    <span className="text-[10px] text-[#8A817A] font-semibold">{hist.date}</span>
                  </div>
                  <p className="text-[10px] text-[#8A817A] mt-0.5">{hist.notes}</p>
                </div>
              ))}
            </div>
          </DetailCard>

        </div>

      </div>

    </div>
  );
}
