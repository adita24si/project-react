import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { FiEye, FiHeadphones, FiCheckCircle, FiClock, FiAlertCircle } from "react-icons/fi";

import DataTable from "../components/ui/DataTable";
import FilterDropdown from "../components/ui/FilterDropdown";
import Pagination from "../components/ui/Pagination";
import StatusBadge from "../components/ui/StatusBadge";
import StatCard from "../components/ui/StatCard";

const ITEMS_PER_PAGE = 7;

export default function CustomerService() {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  // Generate 20 dummy CS tickets
  const initialTickets = useMemo(() => {
    const customers = [
      "Budi Santoso", "Siti Rahmawati", "Ahmad Reza", "Dewi Lestari", "Andi Wijaya",
      "Clarissa Wulandari", "Hendra Gunawan", "Fitriani Siregar", "Rian Hidayat", "Indah Permatasari"
    ];
    const issues = [
      "Kaki meja makan lecet setelah pengiriman",
      "Keterlambatan pengiriman sofa ruang tamu",
      "Request panduan instalasi lemari jati",
      "Busa bantal kursi makan kurang empuk",
      "Gagang laci sideboard pecah saat unboxing",
      "Permintaan penukaran warna sarung bantal linen",
      "Komplain jahitan bed frame kurang rapi",
      "Tanya promo diskon pembelian kedua",
      "Saran penambahan koleksi mebel rotan alami",
      "Masalah pembayaran kartu kredit gagal tapi saldo terpotong"
    ];
    const categories = ["Komplain", "Bantuan", "Feedback"];
    const priorities = ["High", "Medium", "Low"];
    const statusOpts = ["Open", "In Progress", "Resolved"];

    return Array.from({ length: 20 }, (_, i) => ({
      id: `CS-${400 + i * 7}`,
      customer: customers[i % customers.length],
      subject: issues[i % issues.length],
      category: categories[i % categories.length],
      priority: priorities[i % priorities.length],
      status: statusOpts[i % statusOpts.length],
      date: `2026-05-${String((i % 25) + 1).padStart(2, "0")}`
    }));
  }, []);

  const [tickets] = useState(initialTickets);

  // Stat calculations
  const stats = useMemo(() => {
    return {
      total: tickets.length,
      open: tickets.filter(t => t.status === "Open").length,
      inProgress: tickets.filter(t => t.status === "In Progress").length,
      resolved: tickets.filter(t => t.status === "Resolved").length,
    };
  }, [tickets]);

  const filteredTickets = useMemo(() => {
    if (statusFilter === "All") return tickets;
    return tickets.filter(t => t.status === statusFilter);
  }, [tickets, statusFilter]);

  const totalPages = Math.ceil(filteredTickets.length / ITEMS_PER_PAGE);
  const paginatedTickets = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredTickets.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredTickets, currentPage]);

  const columns = [
    { key: "id", label: "Ticket ID" },
    { key: "customer", label: "Customer Name", render: (r) => <span className="font-semibold text-[#2B2420]">{r.customer}</span> },
    { key: "subject", label: "Masalah / Kategori", render: (r) => <span className="block max-w-xs truncate text-xs text-[#8A817A]">{r.subject}</span> },
    { key: "category", label: "Jenis" },
    { 
      key: "priority", 
      label: "Prioritas", 
      render: (r) => {
        const dotColor = r.priority === "High" ? "bg-[#B85C5C]" : r.priority === "Medium" ? "bg-[#A86E2E]" : "bg-[#4A6B46]";
        return (
          <span className="flex items-center gap-1.5 text-xs text-[#2B2420] font-medium">
            <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
            {r.priority}
          </span>
        );
      }
    },
    { key: "status", label: "Status Tiket", render: (r) => <StatusBadge status={r.status} /> },
    { key: "date", label: "Tanggal" },
    {
      key: "actions",
      label: "Actions",
      render: (r) => (
        <button 
          title="Detail Tiket"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/customer-service/${r.id}`);
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
            Customer Service
          </h1>
          <p className="text-sm text-[#8A817A] mt-2 font-medium">
            Kelola pengaduan, konsultasi bantuan teknis, dan feedback customer TimberCraft untuk menjamin kepuasan layanan.
          </p>
        </div>
      </div>

      {/* CS KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-8">
        <StatCard icon={<FiHeadphones />} value={String(stats.total)} label="Total Laporan" color="#79553D" />
        <StatCard icon={<FiAlertCircle />} value={String(stats.open)} label="Tiket Open" color="#B85C5C" />
        <StatCard icon={<FiClock />} value={String(stats.inProgress)} label="In Progress" color="#A86E2E" />
        <StatCard icon={<FiCheckCircle />} value={String(stats.resolved)} label="Resolved" color="#4A6B46" />
      </div>

      {/* Filters options */}
      <div className="flex justify-end gap-4 mb-6 pb-6 border-b border-[#E8E2DD]/60">
        <FilterDropdown 
          label="Filter Status"
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setCurrentPage(1);
          }}
          options={[
            { value: "All", label: "Semua Tiket" },
            { value: "Open", label: "Open" },
            { value: "In Progress", label: "In Progress" },
            { value: "Resolved", label: "Resolved" },
          ]}
        />
      </div>

      {/* Table grid */}
      <div className="border border-[#E8E2DD] rounded-xl overflow-hidden">
        <DataTable 
          columns={columns} 
          data={paginatedTickets} 
          onRowClick={(row) => navigate(`/customer-service/${row.id}`)}
          emptyMessage="Tidak ada tiket aduan yang terdaftar."
        />
        
        <Pagination 
          currentPage={currentPage} 
          totalPages={totalPages} 
          onPageChange={setCurrentPage} 
          totalItems={filteredTickets.length} 
          itemsPerPage={ITEMS_PER_PAGE}
        />
      </div>

    </div>
  );
}
