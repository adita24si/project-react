import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { FiEye, FiGift, FiPlus, FiTag, FiCalendar, FiTrendingUp } from "react-icons/fi";

import DataTable from "../components/ui/DataTable";
import FilterDropdown from "../components/ui/FilterDropdown";
import Pagination from "../components/ui/Pagination";
import StatusBadge from "../components/ui/StatusBadge";
import StatCard from "../components/ui/StatCard";
import Modal from "../components/ui/Modal";

const ITEMS_PER_PAGE = 7;

export default function Promotions() {
  const navigate = useNavigate();
  const [typeFilter, setTypeFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  // New Promo form state
  const [newPromo, setNewPromo] = useState({
    name: "",
    type: "Voucher",
    start: "",
    end: "",
    target: "Semua Customer",
    status: "Active"
  });

  // Generate 15 dummy promos
  const initialPromos = useMemo(() => {
    const promoNames = [
      "Diskon Lebaran Syawal", "Promo Khusus Member Gold", "Voucher Furniture Baru",
      "Campaign Bed Frame Ramadhan", "Diskon Akhir Tahun", "Spesial Cashback Sofa",
      "Voucher Instalasi Gratis", "Promo Ulang Tahun Member", "Diskon Meja Makan Jati",
      "Flash Sale Arco Floor Lamp", "Exclusive Platinum Perks", "Earthy Living Fair",
      "Voucher Ongkir Jabodetabek", "Cashback Cicilan 0%", "Kupon Potongan Harga Pertama"
    ];
    const types = ["Voucher", "Member Promo", "Diskon Khusus", "Campaign Marketing"];
    const targets = ["Semua Customer", "Member Gold & Platinum", "Member Silver", "New Registered Users"];
    const statuses = ["Active", "Expired", "Draft"];

    return Array.from({ length: 15 }, (_, i) => ({
      id: `PRM-${300 + i * 11}`,
      name: promoNames[i % promoNames.length],
      type: types[i % types.length],
      period: `2026-05-${String((i % 15) + 1).padStart(2, "0")} s/d 2026-06-15`,
      target: targets[i % targets.length],
      status: statuses[i % statuses.length],
      usage: (i + 1) * 23
    }));
  }, []);

  const [promos, setPromos] = useState(initialPromos);

  // Stats calculation
  const stats = useMemo(() => {
    return {
      active: promos.filter(p => p.status === "Active").length,
      vouchers: promos.filter(p => p.type === "Voucher").length,
      totalUsage: promos.reduce((sum, p) => sum + p.usage, 0),
    };
  }, [promos]);

  const filteredPromos = useMemo(() => {
    if (typeFilter === "All") return promos;
    return promos.filter(p => p.type === typeFilter);
  }, [promos, typeFilter]);

  const totalPages = Math.ceil(filteredPromos.length / ITEMS_PER_PAGE);
  const paginatedPromos = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredPromos.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredPromos, currentPage]);

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    const nextId = promos.length > 0 ? Math.max(...promos.map(p => Number(p.id.replace(/\D/g, "")))) + 1 : 301;
    const item = {
      id: `PRM-${nextId}`,
      name: newPromo.name,
      type: newPromo.type,
      period: `${newPromo.start} s/d ${newPromo.end}`,
      target: newPromo.target,
      status: newPromo.status,
      usage: 0
    };
    setPromos(prev => [item, ...prev]);
    setCreateModalOpen(false);
    setNewPromo({ name: "", type: "Voucher", start: "", end: "", target: "Semua Customer", status: "Active" });
  };

  const columns = [
    { key: "id", label: "Promo ID" },
    { key: "name", label: "Nama Promo", render: (r) => <span className="font-semibold text-[#2B2420]">{r.name}</span> },
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
    { key: "period", label: "Periode Promo" },
    { key: "target", label: "Target Customer", render: (r) => <span className="text-xs text-[#8A817A]">{r.target}</span> },
    { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
    { key: "usage", label: "Jumlah Digunakan", render: (r) => <span className="font-bold text-xs text-[#79553D]">{r.usage} kali</span> },
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
          className="p-1.5 text-[#8A817A] hover:text-[#79553D] hover:bg-[#F5ECE5] rounded-md transition-all"
        >
          <FiEye className="text-sm" />
        </button>
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
            Promotions
          </h1>
          <p className="text-sm text-[#8A817A] mt-2 font-medium">
            Kelola diskon showroom, kode voucher belanja online/offline, dan monitor keefektifan program promosi marketing TimberCraft.
          </p>
        </div>

        <button
          onClick={() => setCreateModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-[#79553D] hover:bg-[#634430] text-white px-4.5 py-2.5 rounded-lg text-xs font-semibold shadow-xs transition-all duration-150"
        >
          <FiPlus className="text-sm" /> Add Promotion
        </button>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <StatCard icon={<FiGift />} value={String(stats.active)} label="Promo Aktif" color="#4A6B46" />
        <StatCard icon={<FiTag />} value={String(stats.vouchers)} label="Total Kode Voucher" color="#79553D" />
        <StatCard icon={<FiTrendingUp />} value={String(stats.totalUsage)} label="Statistik Penggunaan (Klip)" color="#3D5266" />
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
            { value: "Voucher", label: "Voucher" },
            { value: "Member Promo", label: "Member Promo" },
            { value: "Diskon Khusus", label: "Diskon Khusus" },
            { value: "Campaign Marketing", label: "Campaign Marketing" },
          ]}
        />
      </div>

      {/* Data Table */}
      <div className="border border-[#E8E2DD] rounded-xl overflow-hidden">
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
        title="Buat Promo Baru"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8A817A] mb-1.5">Nama Program Promo</label>
            <input
              type="text"
              required
              value={newPromo.name}
              onChange={(e) => setNewPromo(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g. Diskon Lebaran Showroom"
              className="w-full px-3 py-2 border border-[#E8E2DD] rounded-lg text-sm text-[#2B2420] outline-none focus:ring-1 focus:ring-[#79553D] focus:border-[#79553D]"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8A817A] mb-1.5">Tipe</label>
              <select
                value={newPromo.type}
                onChange={(e) => setNewPromo(prev => ({ ...prev, type: e.target.value }))}
                className="w-full px-3 py-2 border border-[#E8E2DD] bg-white rounded-lg text-sm text-[#2B2420] outline-none focus:ring-1 focus:ring-[#79553D] focus:border-[#79553D]"
              >
                <option value="Voucher">Voucher</option>
                <option value="Member Promo">Member Promo</option>
                <option value="Diskon Khusus">Diskon Khusus</option>
                <option value="Campaign Marketing">Campaign Marketing</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8A817A] mb-1.5">Target Customer</label>
              <select
                value={newPromo.target}
                onChange={(e) => setNewPromo(prev => ({ ...prev, target: e.target.value }))}
                className="w-full px-3 py-2 border border-[#E8E2DD] bg-white rounded-lg text-sm text-[#2B2420] outline-none focus:ring-1 focus:ring-[#79553D] focus:border-[#79553D]"
              >
                <option value="Semua Customer">Semua Customer</option>
                <option value="Member Gold & Platinum">Member Gold & Platinum</option>
                <option value="Member Silver">Member Silver</option>
                <option value="New Registered Users">New Registered Users</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8A817A] mb-1.5">Mulai</label>
              <input
                type="date"
                required
                value={newPromo.start}
                onChange={(e) => setNewPromo(prev => ({ ...prev, start: e.target.value }))}
                className="w-full px-3 py-2 border border-[#E8E2DD] rounded-lg text-xs text-[#2B2420] outline-none focus:ring-1 focus:ring-[#79553D]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8A817A] mb-1.5">Berakhir</label>
              <input
                type="date"
                required
                value={newPromo.end}
                onChange={(e) => setNewPromo(prev => ({ ...prev, end: e.target.value }))}
                className="w-full px-3 py-2 border border-[#E8E2DD] rounded-lg text-xs text-[#2B2420] outline-none focus:ring-1 focus:ring-[#79553D]"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-[#E8E2DD]/80">
            <button
              type="button"
              onClick={() => setCreateModalOpen(false)}
              className="px-4 py-2 border border-[#E8E2DD] rounded-lg text-xs font-semibold text-[#8A817A] hover:bg-[#FAFAFA]"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4.5 py-2 bg-[#79553D] hover:bg-[#634430] text-white rounded-lg text-xs font-semibold shadow-xs"
            >
              Simpan Promo
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
