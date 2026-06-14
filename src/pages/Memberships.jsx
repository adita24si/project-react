import React, { useState, useMemo, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FiEye, FiAward, FiArrowUp } from "react-icons/fi";
import { CRMContext } from "../context/CRMContext";

import DataTable from "../components/ui/DataTable";
import FilterDropdown from "../components/ui/FilterDropdown";
import Pagination from "../components/ui/Pagination";
import MembershipBadge from "../components/ui/MembershipBadge";
import StatCard from "../components/ui/StatCard";
import Modal from "../components/ui/Modal";

const ITEMS_PER_PAGE = 7;

export default function Memberships() {
  const { customers, updateCustomer } = useContext(CRMContext);
  const navigate = useNavigate();
  const [tierFilter, setTierFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  
  // Upgrade state
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [newTier, setNewTier] = useState("");

  // Stats computation
  const stats = useMemo(() => {
    return {
      bronze: customers.filter(c => c.loyalty === "Bronze").length,
      silver: customers.filter(c => c.loyalty === "Silver").length,
      gold: customers.filter(c => c.loyalty === "Gold").length,
      platinum: customers.filter(c => c.loyalty === "Platinum").length,
      vip: customers.filter(c => c.loyalty === "VIP").length,
    };
  }, [customers]);

  const filteredMembers = useMemo(() => {
    if (tierFilter === "All") return customers;
    return customers.filter(c => c.loyalty === tierFilter);
  }, [customers, tierFilter]);

  const totalPages = Math.ceil(filteredMembers.length / ITEMS_PER_PAGE);
  const paginatedMembers = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredMembers.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredMembers, currentPage]);

  const handleOpenUpgrade = (member, e) => {
    e.stopPropagation();
    setSelectedMember(member);
    setNewTier(member.loyalty);
    setUpgradeModalOpen(true);
  };

  const handleUpgradeSubmit = (e) => {
    e.preventDefault();
    updateCustomer({
      ...selectedMember,
      loyalty: newTier
    });
    setUpgradeModalOpen(false);
  };

  const columns = [
    { key: "id", label: "ID Member", render: (r) => `#MBR-${String(r.id).padStart(3, "0")}` },
    { key: "name", label: "Member Name", render: (r) => <span className="font-bold text-[#2B2420]">{r.name}</span> },
    { key: "loyalty", label: "Membership Tier", render: (r) => <MembershipBadge tier={r.loyalty} /> },
    { 
      key: "totalSpent", 
      label: "Total Belanja", 
      render: (r) => (
        <span className="font-extrabold text-xs text-[#79553D]">
          {(r.totalSpent || 0).toLocaleString("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 })}
        </span>
      ) 
    },
    { key: "loyaltyPoints", label: "Poin Reward", render: (r) => `${r.loyaltyPoints || 0} Pts` },
    { key: "joinDate", label: "Gabung Sejak" },
    {
      key: "actions",
      label: "Actions",
      render: (r) => (
        <div className="flex gap-1.5" onClick={(e) => e.stopPropagation()}>
          <button 
            title="View Details"
            onClick={() => navigate(`/memberships/${r.id}`)}
            className="p-1.5 text-[#8A817A] hover:text-[#79553D] hover:bg-[#F5ECE5] rounded-md transition-all cursor-pointer border-none bg-transparent"
          >
            <FiEye className="text-sm" />
          </button>
          <button 
            title="Upgrade Membership"
            onClick={(e) => handleOpenUpgrade(r, e)}
            className="p-1.5 text-[#8A817A] hover:text-[#79553D] hover:bg-[#F5ECE5] rounded-md transition-all cursor-pointer border-none bg-transparent"
          >
            <FiArrowUp className="text-sm" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="max-w-7xl mx-auto font-sans text-left">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 
            className="text-3xl font-bold text-[#2B2420] tracking-tight"
            style={{ fontFamily: "ui-serif, Georgia, Cambria, serif" }}
          >
            Membership
          </h1>
          <p className="text-sm text-[#8A817A] mt-2 font-semibold">
            Kelola loyalty program mebel FurniCraft, monitor status benefit tier, poin reward, dan pertumbuhan member.
          </p>
        </div>
      </div>

      {/* Tiers Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-8">
        <StatCard icon={<FiAward />} value={String(stats.bronze)} label="Bronze" color="#8A817A" />
        <StatCard icon={<FiAward />} value={String(stats.silver)} label="Silver" color="#6E6A67" />
        <StatCard icon={<FiAward />} value={String(stats.gold)} label="Gold" color="#967132" />
        <StatCard icon={<FiAward />} value={String(stats.platinum)} label="Platinum" color="#3D5266" />
        <StatCard icon={<FiAward />} value={String(stats.vip)} label="VIP / Premium" color="#79553D" />
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
            { value: "Bronze", label: "Bronze" },
            { value: "Silver", label: "Silver" },
            { value: "Gold", label: "Gold" },
            { value: "Platinum", label: "Platinum" },
            { value: "VIP", label: "VIP" },
          ]}
        />
      </div>

      {/* Data Table */}
      <div className="bg-white border border-[#E8E2DD] rounded-xl overflow-hidden shadow-xs">
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
              
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8A817A] mb-1.5">New Tier</label>
              <select
                value={newTier}
                onChange={(e) => setNewTier(e.target.value)}
                className="w-full px-3.5 py-2 border border-[#E8E2DD] bg-white rounded-lg text-xs text-[#2B2420] outline-none focus:border-[#79553D]"
              >
                <option value="Bronze">Bronze</option>
                <option value="Silver">Silver</option>
                <option value="Gold">Gold</option>
                <option value="Platinum">Platinum</option>
                <option value="VIP">VIP</option>
              </select>
            </div>
            
            <div className="flex justify-end gap-3.5 pt-4 border-t border-[#E8E2DD]/80">
              <button
                type="button"
                onClick={() => setUpgradeModalOpen(false)}
                className="px-4 py-2 border border-[#E8E2DD] rounded-lg text-xs font-semibold text-[#8A817A] hover:bg-[#FAFAF8] bg-transparent cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#79553D] hover:bg-[#634430] text-white rounded-lg text-xs font-bold shadow-xs cursor-pointer border-none"
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
