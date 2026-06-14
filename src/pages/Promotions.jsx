import React, { useState, useMemo, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FiEye, FiGift, FiPlus, FiTag, FiTrendingUp } from "react-icons/fi";
import { CRMContext } from "../context/CRMContext";

import DataTable from "../components/ui/DataTable";
import FilterDropdown from "../components/ui/FilterDropdown";
import Pagination from "../components/ui/Pagination";
import StatusBadge from "../components/ui/StatusBadge";
import StatCard from "../components/ui/StatCard";
import Modal from "../components/ui/Modal";

const ITEMS_PER_PAGE = 7;

export default function Promotions() {
  const { promotions, addPromotion } = useContext(CRMContext);
  const navigate = useNavigate();
  const [typeFilter, setTypeFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  // New Promo form state
  const [newPromo, setNewPromo] = useState({
    name: "",
    type: "Diskon Produk",
    code: "",
    value: 1000000,
    status: "Aktif"
  });

  // Stats calculation
  const stats = useMemo(() => {
    return {
      total: promotions.length,
      active: promotions.filter(p => p.status === "Aktif").length,
      finished: promotions.filter(p => p.status === "Selesai").length,
      totalUsage: promotions.reduce((sum, p) => sum + p.uses, 0),
    };
  }, [promotions]);

  const filteredPromos = useMemo(() => {
    if (typeFilter === "All") return promotions;
    return promotions.filter(p => p.type === typeFilter);
  }, [promotions, typeFilter]);

  const totalPages = Math.ceil(filteredPromos.length / ITEMS_PER_PAGE);
  const paginatedPromos = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredPromos.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredPromos, currentPage]);

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    addPromotion(newPromo);
    setCreateModalOpen(false);
    setNewPromo({ name: "", type: "Diskon Produk", code: "", value: 1000000, status: "Aktif" });
  };

  const columns = [
    { key: "id", label: "Promo ID" },
    { key: "name", label: "Nama Promo", render: (r) => <span className="font-bold text-[#2B2420]">{r.name}</span> },
    { 
      key: "type", 
      label: "Tipe Promo",
      render: (r) => (
        <span className="flex items-center gap-1.5 text-xs text-[#8A817A] font-semibold">
          <FiTag className="text-[10px]" />
          {r.type}
        </span>
      )
    },
    { key: "code", label: "Kode Voucher", render: (r) => <code className="font-bold text-xs bg-[#FAFAF8] px-2 py-0.5 rounded border border-[#E8E2DD]">{r.code}</code> },
    { 
      key: "value", 
      label: "Potongan", 
      render: (r) => (
        <span className="font-bold text-xs text-[#79553D]">
          {r.type === "Promo Membership" ? `${r.value}%` : `Rp ${r.value.toLocaleString("id-ID")}`}
        </span>
      ) 
    },
    { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
    { key: "uses", label: "Jumlah Penggunaan", render: (r) => <span className="font-bold text-xs text-[#2B2420]">{r.uses} kali</span> },
    {
      key: "actions",
      label: "Actions",
      render: (r) => (
        <button 
          title="Detail Promo"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/promotions/${r.id}`);
          }}
          className="p-1.5 text-[#8A817A] hover:text-[#79553D] hover:bg-[#F5ECE5] rounded-md transition-all cursor-pointer border-none bg-transparent"
        >
          <FiEye className="text-sm" />
        </button>
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
            Promotions
          </h1>
          <p className="text-sm text-[#8A817A] mt-2 font-semibold">
            Kelola diskon showroom, kode voucher belanja online/offline, dan monitor keefektifan program promosi FurniCraft.
          </p>
        </div>

        <button
          onClick={() => setCreateModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-[#79553D] hover:bg-[#634430] text-white px-4.5 py-2.5 rounded-lg text-xs font-bold shadow-xs transition-all duration-150 cursor-pointer border-none"
        >
          <FiPlus className="text-sm" /> Add Promotion
        </button>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={<FiGift />} value={String(stats.total)} label="Total Promosi" color="#79553D" />
        <StatCard icon={<FiGift />} value={String(stats.active)} label="Promo Aktif" color="#4A6B46" />
        <StatCard icon={<FiGift />} value={String(stats.finished)} label="Promo Selesai" color="#8A817A" />
        <StatCard icon={<FiTrendingUp />} value={String(stats.totalUsage)} label="Penggunaan Voucher" color="#3D5266" />
      </div>

      {/* Filter and options */}
      <div className="flex justify-end gap-4 mb-6 pb-6 border-b border-[#E8E2DD]/60">
        <FilterDropdown 
          label="Tipe Promo"
          value={typeFilter}
          onChange={(e) => {
            setTypeFilter(e.target.value);
            setCurrentPage(1);
          }}
          options={[
            { value: "All", label: "Semua Tipe" },
            { value: "Diskon Produk", label: "Diskon Produk" },
            { value: "Flash Sale", label: "Flash Sale" },
            { value: "Voucher", label: "Voucher" },
            { value: "Promo Membership", label: "Promo Membership" },
          ]}
        />
      </div>

      {/* Data Table */}
      <div className="bg-white border border-[#E8E2DD] rounded-xl overflow-hidden shadow-xs">
        <DataTable 
          columns={columns} 
          data={paginatedPromos} 
          onRowClick={(row) => navigate(`/promotions/${row.id}`)}
          emptyMessage="Tidak ada promosi yang ditemukan."
        />
        
        <Pagination 
          currentPage={currentPage} 
          totalPages={totalPages} 
          onPageChange={setCurrentPage} 
          totalItems={filteredPromos.length} 
          itemsPerPage={ITEMS_PER_PAGE}
        />
      </div>

      {/* Create Promotion Modal */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Buat Promo Campaign Baru"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4 text-left">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8A817A] mb-1.5">Nama Program Promo</label>
            <input
              type="text"
              required
              value={newPromo.name}
              onChange={(e) => setNewPromo(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g. Diskon Sofa Akhir Tahun"
              className="w-full px-3.5 py-2 border border-[#E8E2DD] rounded-lg text-xs text-[#2B2420] outline-none focus:border-[#79553D]"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8A817A] mb-1.5">Tipe</label>
              <select
                value={newPromo.type}
                onChange={(e) => setNewPromo(prev => ({ ...prev, type: e.target.value }))}
                className="w-full px-3.5 py-2 border border-[#E8E2DD] bg-white rounded-lg text-xs text-[#2B2420] outline-none focus:border-[#79553D]"
              >
                <option value="Diskon Produk">Diskon Produk</option>
                <option value="Flash Sale">Flash Sale</option>
                <option value="Voucher">Voucher</option>
                <option value="Promo Membership">Promo Membership</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8A817A] mb-1.5">Kode Voucher</label>
              <input
                type="text"
                required
                value={newPromo.code}
                onChange={(e) => setNewPromo(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                placeholder="SOFA100"
                className="w-full px-3.5 py-2 border border-[#E8E2DD] rounded-lg text-xs text-[#2B2420] outline-none focus:border-[#79553D]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8A817A] mb-1.5">
                Nilai {newPromo.type === "Promo Membership" ? "Potongan (%)" : "Potongan (Rp)"}
              </label>
              <input
                type="number"
                required
                value={newPromo.value}
                onChange={(e) => setNewPromo(prev => ({ ...prev, value: Number(e.target.value) }))}
                className="w-full px-3.5 py-2 border border-[#E8E2DD] rounded-lg text-xs text-[#2B2420] outline-none focus:border-[#79553D]"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8A817A] mb-1.5">Status</label>
              <select
                value={newPromo.status}
                onChange={(e) => setNewPromo(prev => ({ ...prev, status: e.target.value }))}
                className="w-full px-3.5 py-2 border border-[#E8E2DD] bg-white rounded-lg text-xs text-[#2B2420] outline-none focus:border-[#79553D]"
              >
                <option value="Aktif">Aktif</option>
                <option value="Selesai">Selesai</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3.5 pt-4 border-t border-[#E8E2DD]/80">
            <button
              type="button"
              onClick={() => setCreateModalOpen(false)}
              className="px-4 py-2 border border-[#E8E2DD] rounded-lg text-xs font-semibold text-[#8A817A] hover:bg-[#FAFAF8] bg-transparent cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#79553D] hover:bg-[#634430] text-white rounded-lg text-xs font-bold shadow-xs border-none cursor-pointer"
            >
              Simpan Promo
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
