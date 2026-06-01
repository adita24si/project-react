import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { FiEye, FiAward, FiArrowUp } from "react-icons/fi";

import DataTable from "../components/ui/DataTable";
import FilterDropdown from "../components/ui/FilterDropdown";
import Pagination from "../components/ui/Pagination";
import MembershipBadge from "../components/ui/MembershipBadge";
import StatCard from "../components/ui/StatCard";
import Modal from "../components/ui/Modal";

const ITEMS_PER_PAGE = 7;

export default function Memberships() {
  const navigate = useNavigate();
  const [tierFilter, setTierFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  
  // Upgrade state
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [newTier, setNewTier] = useState("");

  // 25 dummy membership records
  const initialMembers = useMemo(() => {
    const names = [
      "Budi Santoso", "Siti Rahmawati", "Ahmad Reza", "Dewi Lestari", "Andi Wijaya",
      "Clarissa Wulandari", "Hendra Gunawan", "Fitriani Siregar", "Rian Hidayat", "Indah Permatasari",
      "Eko Prasetyo", "Maria Ulfah", "Yusuf Habibie", "Megawati Putri", "Anwar Ibrahim",
      "Kartika Sari", "Dian Sastrowardoyo", "Raffi Ahmad", "Nagita Slavina", "Atta Halilintar",
      "Gisella Anastasia", "Gading Marten", "Jessica Iskandar", "Nia Ramadhani", "Ardi Bakrie"
    ];

    return Array.from({ length: 25 }, (_, i) => ({
      id: i + 1,
      name: names[i % names.length],
      tier: ["Silver", "Gold", "Platinum"][i % 3],
      totalSpent: (i + 1) * 4800000,
      rewardPoints: (i + 1) * 120,
      joinDate: `2025-${String((i % 12) + 1).padStart(2, "0")}-10`,
      status: "Aktif"
    }));
  }, []);

  const [members, setMembers] = useState(initialMembers);

  // Stats computation
  const stats = useMemo(() => {
    return {
      silver: members.filter(m => m.tier === "Silver").length,
      gold: members.filter(m => m.tier === "Gold").length,
      platinum: members.filter(m => m.tier === "Platinum").length,
    };
  }, [members]);

  const filteredMembers = useMemo(() => {
    if (tierFilter === "All") return members;
    return members.filter(m => m.tier === tierFilter);
  }, [members, tierFilter]);

  const totalPages = Math.ceil(filteredMembers.length / ITEMS_PER_PAGE);
  const paginatedMembers = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredMembers.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredMembers, currentPage]);

  const handleOpenUpgrade = (member, e) => {
    e.stopPropagation();
    setSelectedMember(member);
    setNewTier(member.tier);
    setUpgradeModalOpen(true);
  };

  const handleUpgradeSubmit = (e) => {
    e.preventDefault();
    setMembers(prev => prev.map(m => m.id === selectedMember.id ? { ...m, tier: newTier } : m));
    setUpgradeModalOpen(false);
  };

  const columns = [
    { key: "id", label: "ID Member", render: (r) => `#MBR-${String(r.id).padStart(3, "0")}` },
    { key: "name", label: "Member Name", render: (r) => <span className="font-semibold text-[#2B2420]">{r.name}</span> },
    { key: "tier", label: "Membership Tier", render: (r) => <MembershipBadge tier={r.tier} /> },
    { 
      key: "totalSpent", 
      label: "Total Belanja", 
      render: (r) => <span className="font-bold text-xs text-[#79553D]">{r.totalSpent.toLocaleString("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 })}</span> 
    },
    { key: "rewardPoints", label: "Poin Reward", render: (r) => `${r.rewardPoints} Pts` },
    { key: "joinDate", label: "Gabung Sejak" },
    {
      key: "actions",
      label: "Actions",
      render: (r) => (
        <div className="flex gap-1.5" onClick={(e) => e.stopPropagation()}>
          <button 
            title="View Details"
            onClick={() => navigate(`/memberships/${r.id}`)}
            className="p-1.5 text-[#8A817A] hover:text-[#79553D] hover:bg-[#F5ECE5] rounded-md transition-all"
          >
            <FiEye className="text-sm" />
          </button>
          <button 
            title="Upgrade Membership"
            onClick={(e) => handleOpenUpgrade(r, e)}
            className="p-1.5 text-[#8A817A] hover:text-[#79553D] hover:bg-[#F5ECE5] rounded-md transition-all"
          >
            <FiArrowUp className="text-sm" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto font-sans bg-white border border-[#E8E2DD]/80 rounded-xl">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 
            className="text-3xl font-bold text-[#2B2420] tracking-tight"
            style={{ fontFamily: "ui-serif, Georgia, Cambria, serif" }}
          >
            Membership
          </h1>
          <p className="text-sm text-[#8A817A] mt-2 font-medium">
            Kelola loyalty program mebel TimberCraft, pantau benefit tier, poin reward, dan upgrade status member.
          </p>
        </div>
      </div>

      {/* Tiers Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <StatCard icon={<FiAward />} value={String(stats.silver)} label="Member Silver" color="#6E6A67" />
        <StatCard icon={<FiAward />} value={String(stats.gold)} label="Member Gold" color="#967132" />
        <StatCard icon={<FiAward />} value={String(stats.platinum)} label="Member Platinum" color="#3D5266" />
      </div>

      {/* Filter Options */}
      <div className="flex justify-end gap-4 mb-6 pb-6 border-b border-[#E8E2DD]/60">
        <FilterDropdown 
          label="Filter Tier"
          value={tierFilter}
          onChange={(e) => {
            setTierFilter(e.target.value);
            setCurrentPage(1);
          }}
          options={[
            { value: "All", label: "Semua Tier" },
            { value: "Silver", label: "Silver" },
            { value: "Gold", label: "Gold" },
            { value: "Platinum", label: "Platinum" },
          ]}
        />
      </div>

      {/* Data Table */}
      <div className="border border-[#E8E2DD] rounded-xl overflow-hidden">
        <DataTable 
          columns={columns} 
          data={paginatedMembers} 
          onRowClick={(row) => navigate(`/memberships/${row.id}`)}
          emptyMessage="Tidak ada member yang ditemukan."
        />
        
        <Pagination 
          currentPage={currentPage} 
          totalPages={totalPages} 
          onPageChange={setCurrentPage} 
          totalItems={filteredMembers.length} 
          itemsPerPage={ITEMS_PER_PAGE}
        />
      </div>

      {/* Upgrade Membership Modal */}
      {selectedMember && (
        <Modal
          isOpen={upgradeModalOpen}
          onClose={() => setUpgradeModalOpen(false)}
          title="Upgrade Membership Tier"
        >
          <form onSubmit={handleUpgradeSubmit} className="space-y-4">
            <div>
              <p className="text-xs text-[#8A817A] mb-4">
                Pilih membership tier baru untuk member <strong className="text-[#2B2420]">{selectedMember.name}</strong>.
              </p>
              
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8A817A] mb-1.5">New Tier</label>
              <select
                value={newTier}
                onChange={(e) => setNewTier(e.target.value)}
                className="w-full px-3 py-2 border border-[#E8E2DD] bg-white rounded-lg text-sm text-[#2B2420] outline-none focus:ring-1 focus:ring-[#79553D] focus:border-[#79553D]"
              >
                <option value="Silver">Silver</option>
                <option value="Gold">Gold</option>
                <option value="Platinum">Platinum</option>
              </select>
            </div>
            
            <div className="flex justify-end gap-3 pt-4 border-t border-[#E8E2DD]/80">
              <button
                type="button"
                onClick={() => setUpgradeModalOpen(false)}
                className="px-4 py-2 border border-[#E8E2DD] rounded-lg text-xs font-semibold text-[#8A817A] hover:bg-[#FAFAFA]"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4.5 py-2 bg-[#79553D] hover:bg-[#634430] text-white rounded-lg text-xs font-semibold shadow-xs"
              >
                Upgrade Tier
              </button>
            </div>
          </form>
        </Modal>
      )}

    </div>
  );
}
