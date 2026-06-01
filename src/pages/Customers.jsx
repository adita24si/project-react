import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { FiEye, FiTrash2, FiUserPlus, FiEdit } from "react-icons/fi";

import DataTable from "../components/ui/DataTable";
import SearchInput from "../components/ui/SearchInput";
import FilterDropdown from "../components/ui/FilterDropdown";
import Pagination from "../components/ui/Pagination";
import MembershipBadge from "../components/ui/MembershipBadge";
import Modal from "../components/ui/Modal";

const ITEMS_PER_PAGE = 6;

export default function Customers() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [tierFilter, setTierFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  
  // Modal states for editing
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // Generate 30 dummy Indonesian customers
  const initialData = useMemo(() => {
    const names = [
      "Budi Santoso", "Siti Rahmawati", "Ahmad Reza", "Dewi Lestari", "Andi Wijaya",
      "Clarissa Wulandari", "Hendra Gunawan", "Fitriani Siregar", "Rian Hidayat", "Indah Permatasari",
      "Eko Prasetyo", "Maria Ulfah", "Yusuf Habibie", "Megawati Putri", "Anwar Ibrahim",
      "Kartika Sari", "Dian Sastrowardoyo", "Raffi Ahmad", "Nagita Slavina", "Atta Halilintar",
      "Gisella Anastasia", "Gading Marten", "Jessica Iskandar", "Nia Ramadhani", "Ardi Bakrie",
      "Luna Maya", "Ariel Noah", "Tulus Subagyo", "Isyana Sarasvati", "Raisa Andriana"
    ];
    
    return Array.from({ length: 30 }, (_, i) => ({
      id: i + 1,
      name: names[i % names.length],
      email: `${names[i % names.length].toLowerCase().replace(/\s+/g, "")}@gmail.com`,
      phone: `0812${10000000 + i * 2351}`,
      loyalty: ["Bronze", "Silver", "Gold", "Platinum"][i % 4],
      totalSpent: (i + 1) * 3500000,
      joinDate: `2025-${String((i % 12) + 1).padStart(2, "0")}-15`
    }));
  }, []);

  const [data, setData] = useState(initialData);

  // Filter & Search logic
  const filteredData = useMemo(() => {
    return data.filter((c) => {
      const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || 
                          c.email.toLowerCase().includes(search.toLowerCase());
      const matchTier = tierFilter === "All" || c.loyalty === tierFilter;
      return matchSearch && matchTier;
    });
  }, [data, search, tierFilter]);

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredData.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredData, currentPage]);

  const handleEditClick = (cust, e) => {
    e.stopPropagation();
    setSelectedCustomer({ ...cust });
    setEditModalOpen(true);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    setData(prev => prev.map(c => c.id === selectedCustomer.id ? selectedCustomer : c));
    setEditModalOpen(false);
  };

  const handleDeleteClick = (id, e) => {
    e.stopPropagation();
    if (window.confirm("Apakah Anda yakin ingin menghapus data pelanggan ini?")) {
      setData(prev => prev.filter(c => c.id !== id));
    }
  };

  // Columns definition for DataTable component
  const columns = [
    { key: "id", label: "ID", render: (r) => `#${String(r.id).padStart(3, "0")}` },
    { key: "name", label: "Customer Name", render: (r) => <span className="font-semibold text-xs text-[#2B2420]">{r.name}</span> },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "loyalty", label: "Loyalty Tier", render: (r) => <MembershipBadge tier={r.loyalty} /> },
    { 
      key: "totalSpent", 
      label: "Total Pembelian", 
      render: (r) => <span className="font-bold text-xs text-[#79553D]">{r.totalSpent.toLocaleString("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 })}</span> 
    },
    {
      key: "actions",
      label: "Actions",
      render: (r) => (
        <div className="flex gap-1.5" onClick={(e) => e.stopPropagation()}>
          <button 
            title="View Details"
            onClick={() => navigate(`/customers/${r.id}`)}
            className="p-1.5 text-[#8A817A] hover:text-[#79553D] hover:bg-[#F5ECE5] rounded-md transition-all"
          >
            <FiEye className="text-sm" />
          </button>
          <button 
            title="Edit Customer"
            onClick={(e) => handleEditClick(r, e)}
            className="p-1.5 text-[#8A817A] hover:text-[#79553D] hover:bg-[#F5ECE5] rounded-md transition-all"
          >
            <FiEdit className="text-sm" />
          </button>
          <button 
            title="Delete Customer"
            onClick={(e) => handleDeleteClick(r, e)}
            className="p-1.5 text-[#8A817A] hover:text-[#B85C5C] hover:bg-[#F2E6E6] rounded-md transition-all"
          >
            <FiTrash2 className="text-sm" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto font-sans bg-white border border-[#E8E2DD]/80 rounded-xl">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 
            className="text-3xl font-bold text-[#2B2420] tracking-tight"
            style={{ fontFamily: "ui-serif, Georgia, Cambria, serif" }}
          >
            Customers
          </h1>
          <p className="text-sm text-[#8A817A] mt-2 font-medium">
            Kelola pelanggan loyal TimberCraft, pantau membership tier, dan riwayat transaksi mereka.
          </p>
        </div>

        <button
          onClick={() => {
            const nextId = data.length > 0 ? Math.max(...data.map(c => c.id)) + 1 : 1;
            setSelectedCustomer({ id: nextId, name: "", email: "", phone: "", loyalty: "Bronze", totalSpent: 0, joinDate: new Date().toISOString().split('T')[0] });
            setEditModalOpen(true);
          }}
          className="flex items-center justify-center gap-2 bg-[#79553D] hover:bg-[#634430] text-white px-4.5 py-2.5 rounded-lg text-xs font-semibold shadow-xs transition-all duration-150"
        >
          <FiUserPlus className="text-sm" /> Add Customer
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 pb-6 border-b border-[#E8E2DD]/60">
        <SearchInput 
          value={search} 
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }} 
          placeholder="Search by name or email..." 
        />
        
        <FilterDropdown 
          label="Membership Tier"
          value={tierFilter}
          onChange={(e) => {
            setTierFilter(e.target.value);
            setCurrentPage(1);
          }}
          options={[
            { value: "All", label: "All Tiers" },
            { value: "Bronze", label: "Bronze" },
            { value: "Silver", label: "Silver" },
            { value: "Gold", label: "Gold" },
            { value: "Platinum", label: "Platinum" },
          ]}
        />
      </div>

      {/* Data Table Wrapper */}
      <div className="border border-[#E8E2DD] rounded-xl overflow-hidden">
        <DataTable 
          columns={columns} 
          data={paginatedData} 
          onRowClick={(row) => navigate(`/customers/${row.id}`)}
          emptyMessage="Tidak ada pelanggan yang cocok dengan pencarian Anda."
        />
        
        <Pagination 
          currentPage={currentPage} 
          totalPages={totalPages} 
          onPageChange={setCurrentPage} 
          totalItems={filteredData.length} 
          itemsPerPage={ITEMS_PER_PAGE}
        />
      </div>

      {/* Edit/Add Modal */}
      {selectedCustomer && (
        <Modal
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          title={data.some(c => c.id === selectedCustomer.id) ? "Edit Customer Data" : "Add New Customer"}
        >
          <form onSubmit={handleSaveEdit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8A817A] mb-1.5">Nama Lengkap</label>
              <input
                type="text"
                required
                value={selectedCustomer.name}
                onChange={(e) => setSelectedCustomer(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-[#E8E2DD] rounded-lg text-sm text-[#2B2420] outline-none focus:ring-1 focus:ring-[#79553D] focus:border-[#79553D]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8A817A] mb-1.5">Email</label>
              <input
                type="email"
                required
                value={selectedCustomer.email}
                onChange={(e) => setSelectedCustomer(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-3 py-2 border border-[#E8E2DD] rounded-lg text-sm text-[#2B2420] outline-none focus:ring-1 focus:ring-[#79553D] focus:border-[#79553D]"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8A817A] mb-1.5">Telepon</label>
                <input
                  type="text"
                  required
                  value={selectedCustomer.phone}
                  onChange={(e) => setSelectedCustomer(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-3 py-2 border border-[#E8E2DD] rounded-lg text-sm text-[#2B2420] outline-none focus:ring-1 focus:ring-[#79553D] focus:border-[#79553D]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8A817A] mb-1.5">Membership</label>
                <select
                  value={selectedCustomer.loyalty}
                  onChange={(e) => setSelectedCustomer(prev => ({ ...prev, loyalty: e.target.value }))}
                  className="w-full px-3 py-2 border border-[#E8E2DD] bg-white rounded-lg text-sm text-[#2B2420] outline-none focus:ring-1 focus:ring-[#79553D] focus:border-[#79553D]"
                >
                  <option value="Bronze">Bronze</option>
                  <option value="Silver">Silver</option>
                  <option value="Gold">Gold</option>
                  <option value="Platinum">Platinum</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 pt-4 border-t border-[#E8E2DD]/80">
              <button
                type="button"
                onClick={() => setEditModalOpen(false)}
                className="px-4 py-2 border border-[#E8E2DD] rounded-lg text-xs font-semibold text-[#8A817A] hover:bg-[#FAFAFA]"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4.5 py-2 bg-[#79553D] hover:bg-[#634430] text-white rounded-lg text-xs font-semibold shadow-xs"
              >
                Simpan Perubahan
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}