import React, { useState, useMemo, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FiEye, FiHeadphones, FiCheckCircle, FiClock, FiAlertCircle, FiPlus } from "react-icons/fi";
import { CRMContext } from "../context/CRMContext";

import DataTable from "../components/ui/DataTable";
import FilterDropdown from "../components/ui/FilterDropdown";
import SearchInput from "../components/ui/SearchInput";
import Pagination from "../components/ui/Pagination";
import StatusBadge from "../components/ui/StatusBadge";
import PremiumStatCard from "../components/ui/PremiumStatCard";
import Modal from "../components/ui/Modal";

const ITEMS_PER_PAGE = 7;

export default function CustomerService() {
  const { tickets, customers, addTicket } = useContext(CRMContext);
  const navigate = useNavigate();
  
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Ticket creation modal
  const [modalOpen, setModalOpen] = useState(false);
  const [newTicketForm, setNewTicketForm] = useState({
    customerId: "",
    category: "Keluhan Produk",
    subject: "",
    priority: "Medium"
  });

  // Stat calculations
  const stats = useMemo(() => {
    return {
      total: tickets.length,
      open: tickets.filter(t => t.status === "Open").length,
      inProgress: tickets.filter(t => t.status === "In Progress").length,
      resolved: tickets.filter(t => t.status === "Resolved").length,
      closed: tickets.filter(t => t.status === "Closed").length,
    };
  }, [tickets]);

  const filteredTickets = useMemo(() => {
    let result = tickets;
    if (statusFilter !== "All") {
      result = result.filter(t => t.status === statusFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(t => 
        (t.customerName && t.customerName.toLowerCase().includes(q)) ||
        (t.category && t.category.toLowerCase().includes(q)) ||
        (t.subject && t.subject.toLowerCase().includes(q)) ||
        String(t.id).includes(q)
      );
    }
    return result;
  }, [tickets, statusFilter, searchQuery]);

  const totalPages = Math.ceil(filteredTickets.length / ITEMS_PER_PAGE);
  const paginatedTickets = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredTickets.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredTickets, currentPage]);

  const handleAddTicketSubmit = (e) => {
    e.preventDefault();
    const selectedCust = customers.find(c => c.id === Number(newTicketForm.customerId));
    if (!selectedCust) return alert("Pilih customer terlebih dahulu");

    const ticketData = {
      customerId: selectedCust.id,
      customerName: selectedCust.name,
      category: newTicketForm.category,
      subject: newTicketForm.subject,
      priority: newTicketForm.priority,
      status: "Open",
      date: new Date().toISOString().split("T")[0]
    };

    const newTrx = addTicket(ticketData);
    setNewTicketForm({ customerId: "", category: "Keluhan Produk", subject: "", priority: "Medium" });
    setModalOpen(false);
    navigate(`/customer-service/${newTrx.id}`);
  };

  const columns = [
    { key: "id", label: "Ticket ID" },
    { 
      key: "customerName", 
      label: "Customer Name", 
      render: (r) => (
        <span 
          className="font-bold text-[#2B2420] hover:underline cursor-pointer" 
          onClick={() => navigate(`/customers/${r.customerId}`)}
        >
          {r.customerName}
        </span>
      ) 
    },
    { key: "category", label: "Kategori" },
    { key: "subject", label: "Masalah / Kategori aduan", render: (r) => <span className="block max-w-xs truncate text-xs text-[#8A817A]">{r.subject}</span> },
    { 
      key: "priority", 
      label: "Prioritas", 
      render: (r) => {
        const priority = r.priority || "Medium";
        const dotColor = priority === "High" ? "bg-[#B85C5C]" : priority === "Medium" ? "bg-[#A86E2E]" : "bg-[#4A6B46]";
        return (
          <span className="flex items-center gap-1.5 text-xs text-[#2B2420] font-bold">
            <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
            {priority}
          </span>
        );
      }
    },
    { key: "status", label: "Status Tiket", render: (r) => <StatusBadge status={r.status} /> },
    { key: "date", label: "Tanggal Masuk" },
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
            Customer Service
          </h1>
          <p className="text-sm text-[#8A817A] mt-2 font-semibold">
            Kelola pengaduan tiket, retur, garansi, dan feedback customer TimberCraft untuk menjamin kepuasan layanan pelanggan.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-[#79553D] hover:bg-[#634430] text-white px-4.5 py-2.5 rounded-lg text-xs font-bold shadow-xs transition-all duration-150 cursor-pointer border-none"
        >
          <FiPlus className="text-sm" /> Create CS Ticket
        </button>
      </div>

      {/* CS KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <PremiumStatCard 
          icon={<FiHeadphones />} 
          value={String(stats.total)} 
          label="Total Laporan" 
          description="Akumulasi keluhan masuk"
          theme="primary"
          active={statusFilter === "All"}
          onClick={() => {
            setStatusFilter("All");
            setCurrentPage(1);
          }}
        />
        <PremiumStatCard 
          icon={<FiAlertCircle />} 
          value={String(stats.open)} 
          label="Tiket Open" 
          description="Menunggu penanganan awal"
          theme="danger"
          active={statusFilter === "Open"}
          onClick={() => {
            setStatusFilter(statusFilter === "Open" ? "All" : "Open");
            setCurrentPage(1);
          }}
        />
        <PremiumStatCard 
          icon={<FiClock />} 
          value={String(stats.inProgress)} 
          label="In Progress" 
          description="Sedang dalam proses tindak lanjut"
          theme="warning"
          active={statusFilter === "In Progress"}
          onClick={() => {
            setStatusFilter(statusFilter === "In Progress" ? "All" : "In Progress");
            setCurrentPage(1);
          }}
        />
        <PremiumStatCard 
          icon={<FiCheckCircle />} 
          value={String(stats.resolved + stats.closed)} 
          label="Resolved / Closed" 
          description="Tiket yang telah terselesaikan"
          theme="success"
          active={statusFilter === "Resolved"}
          onClick={() => {
            setStatusFilter(statusFilter === "Resolved" ? "All" : "Resolved");
            setCurrentPage(1);
          }}
        />
      </div>

      {/* Filters and Search Options */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-end gap-4 mb-6 pb-6 border-b border-[#E8E2DD]/60">
        <SearchInput
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          placeholder="Cari tiket berdasarkan nama, keluhan..."
        />
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
            { value: "Closed", label: "Closed" },
          ]}
        />
      </div>

      {/* Table grid */}
      <div className="bg-white border border-[#E8E2DD] rounded-xl overflow-hidden shadow-xs">
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

      {/* Create CS Ticket Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Open New Support Ticket"
      >
        <form onSubmit={handleAddTicketSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8A817A] mb-1">Customer</label>
            <select
              required
              value={newTicketForm.customerId}
              onChange={(e) => setNewTicketForm(prev => ({ ...prev, customerId: e.target.value }))}
              className="w-full px-3.5 py-2 border border-[#E8E2DD] rounded-lg text-xs bg-white text-[#2B2420] outline-none focus:border-[#79553D]"
            >
              <option value="">-- Pilih Customer --</option>
              {customers.map(c => (
                <option key={c.id} value={c.id}>{c.name} ({c.email})</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8A817A] mb-1">Kategori Aduan</label>
              <select
                value={newTicketForm.category}
                onChange={(e) => setNewTicketForm(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3.5 py-2 border border-[#E8E2DD] rounded-lg text-xs bg-white text-[#2B2420] outline-none focus:border-[#79553D]"
              >
                <option value="Pertanyaan Produk">Pertanyaan Produk</option>
                <option value="Keluhan Produk">Keluhan Produk</option>
                <option value="Pengiriman">Pengiriman</option>
                <option value="Garansi">Garansi</option>
                <option value="Retur">Retur</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8A817A] mb-1">Prioritas</label>
              <select
                value={newTicketForm.priority}
                onChange={(e) => setNewTicketForm(prev => ({ ...prev, priority: e.target.value }))}
                className="w-full px-3.5 py-2 border border-[#E8E2DD] rounded-lg text-xs bg-white text-[#2B2420] outline-none focus:border-[#79553D]"
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8A817A] mb-1">Detail Masalah / Deskripsi</label>
            <textarea
              required
              placeholder="Jelaskan masalah secara mendetail..."
              value={newTicketForm.subject}
              onChange={(e) => setNewTicketForm(prev => ({ ...prev, subject: e.target.value }))}
              className="w-full px-3.5 py-2 border border-[#E8E2DD] rounded-lg text-xs text-[#2B2420] outline-none focus:border-[#79553D] h-24 resize-none"
            />
          </div>
          <div className="flex justify-end gap-3.5 pt-4 border-t border-[#E8E2DD]">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 border border-[#E8E2DD] rounded-lg text-xs font-semibold text-[#8A817A] hover:bg-[#FAFAF8] bg-transparent cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#79553D] hover:bg-[#634430] text-white rounded-lg text-xs font-bold transition-colors cursor-pointer border-none"
            >
              Submit Ticket
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
