import React, { useState, useMemo, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FiEye, FiTrash2, FiUserPlus, FiEdit } from "react-icons/fi";
import { CRMContext } from "../context/CRMContext";

import DataTable from "../components/ui/DataTable";
import SearchInput from "../components/ui/SearchInput";
import FilterDropdown from "../components/ui/FilterDropdown";
import Pagination from "../components/ui/Pagination";
import MembershipBadge from "../components/ui/MembershipBadge";
import Modal from "../components/ui/Modal";

const ITEMS_PER_PAGE = 6;

export default function Customers() {
  const { customers, addCustomer, updateCustomer, deleteCustomer } = useContext(CRMContext);
  const navigate = useNavigate();
  
  const [search, setSearch] = useState("");
  const [tierFilter, setTierFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  
  // Modal states for editing/adding
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // Filter & Search logic
  const filteredData = useMemo(() => {
    return customers.filter((c) => {
      const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || 
                          c.email.toLowerCase().includes(search.toLowerCase()) ||
                          c.city.toLowerCase().includes(search.toLowerCase());
      const matchTier = tierFilter === "All" || c.loyalty === tierFilter;
      return matchSearch && matchTier;
    });
  }, [customers, search, tierFilter]);

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
    if (customers.some(c => c.id === selectedCustomer.id)) {
      updateCustomer(selectedCustomer);
    } else {
      addCustomer(selectedCustomer);
    }
    setEditModalOpen(false);
  };

  const handleDeleteClick = (id, e) => {
    e.stopPropagation();
    if (window.confirm("Apakah Anda yakin ingin menghapus data pelanggan ini?")) {
      deleteCustomer(id);
    }
  };

  // Columns definition for DataTable component
  const columns = [
    { key: "id", label: "ID", render: (r) => `#${String(r.id).padStart(3, "0")}` },
    { 
      key: "name", 
      label: "Customer Name", 
      render: (r) => (
        <span className="font-bold text-xs text-[#2B2420] hover:underline cursor-pointer" onClick={() => navigate(`/customers/${r.id}`)}>
          {r.name}
        </span>
      ) 
    },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "city", label: "City", render: (r) => <span>{r.city || "Jakarta"}</span> },
    { key: "loyalty", label: "Loyalty Tier", render: (r) => <MembershipBadge tier={r.loyalty} /> },
    { 
      key: "totalSpent", 
      label: "Total Pembelian", 
      render: (r) => (
        <span className="font-extrabold text-xs text-[#79553D]">
          {(r.totalSpent || 0).toLocaleString("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 })}
        </span>
      ) 
    },
    {
      key: "actions",
      label: "Actions",
      render: (r) => (
        <div className="flex gap-1.5" onClick={(e) => e.stopPropagation()}>
          <button 
            title="View Details"
            onClick={() => navigate(`/customers/${r.id}`)}
            className="p-1.5 text-[#8A817A] hover:text-[#79553D] hover:bg-[#F5ECE5] rounded-md transition-all cursor-pointer border-none bg-transparent"
          >
            <FiEye className="text-sm" />
          </button>
          <button 
            title="Edit Customer"
            onClick={(e) => handleEditClick(r, e)}
            className="p-1.5 text-[#8A817A] hover:text-[#79553D] hover:bg-[#F5ECE5] rounded-md transition-all cursor-pointer border-none bg-transparent"
          >
            <FiEdit className="text-sm" />
          </button>
          <button 
            title="Delete Customer"
            onClick={(e) => handleDeleteClick(r.id, e)}
            className="p-1.5 text-[#8A817A] hover:text-[#B85C5C] hover:bg-[#F2E6E6] rounded-md transition-all cursor-pointer border-none bg-transparent"
          >
            <FiTrash2 className="text-sm" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="max-w-7xl mx-auto font-sans text-left">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 
            className="text-3xl font-bold text-[#2B2420] tracking-tight"
            style={{ fontFamily: "ui-serif, Georgia, Cambria, serif" }}
          >
            Customers
          </h1>
          <p className="text-sm text-[#8A817A] mt-2 font-semibold">
            Kelola pelanggan loyal TimberCraft, pantau membership tier, dan riwayat transaksi mereka.
          </p>
        </div>

        <button
          onClick={() => {
            setSelectedCustomer({ 
              id: Date.now(), 
              name: "", 
              email: "", 
              phone: "", 
              city: "Jakarta",
              address: "",
              loyalty: "Bronze", 
              totalSpent: 0, 
              joinDate: new Date().toISOString().split('T')[0] 
            });
            setEditModalOpen(true);
          }}
          className="flex items-center justify-center gap-2 bg-[#79553D] hover:bg-[#634430] text-white px-4.5 py-2.5 rounded-lg text-xs font-bold shadow-xs transition-all duration-150 cursor-pointer border-none"
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
          placeholder="Search by name, email or city..." 
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
            { value: "VIP", label: "VIP" },
          ]}
        />
      </div>

      {/* Data Table Wrapper */}
      <div className="bg-white border border-[#E8E2DD] rounded-xl overflow-hidden shadow-xs">
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
          title={customers.some(c => c.id === selectedCustomer.id) ? "Edit Customer Data" : "Add New Customer"}
        >
          <form onSubmit={handleSaveEdit} className="space-y-4 text-left">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8A817A] mb-1.5">Nama Lengkap</label>
              <input
                type="text"
                required
                value={selectedCustomer.name}
                onChange={(e) => setSelectedCustomer(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3.5 py-2 border border-[#E8E2DD] rounded-lg text-xs text-[#2B2420] outline-none focus:border-[#79553D]"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8A817A] mb-1.5">Email</label>
              <input
                type="email"
                required
                value={selectedCustomer.email}
                onChange={(e) => setSelectedCustomer(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-3.5 py-2 border border-[#E8E2DD] rounded-lg text-xs text-[#2B2420] outline-none focus:border-[#79553D]"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8A817A] mb-1.5">Telepon</label>
                <input
                  type="text"
                  required
                  value={selectedCustomer.phone}
                  onChange={(e) => setSelectedCustomer(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-3.5 py-2 border border-[#E8E2DD] rounded-lg text-xs text-[#2B2420] outline-none focus:border-[#79553D]"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8A817A] mb-1.5">Kota</label>
                <input
                  type="text"
                  required
                  value={selectedCustomer.city || ""}
                  onChange={(e) => setSelectedCustomer(prev => ({ ...prev, city: e.target.value }))}
                  className="w-full px-3.5 py-2 border border-[#E8E2DD] rounded-lg text-xs text-[#2B2420] outline-none focus:border-[#79553D]"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8A817A] mb-1.5">Membership</label>
                <select
                  value={selectedCustomer.loyalty}
                  onChange={(e) => setSelectedCustomer(prev => ({ ...prev, loyalty: e.target.value }))}
                  className="w-full px-3.5 py-2 border border-[#E8E2DD] bg-white rounded-lg text-xs text-[#2B2420] outline-none focus:border-[#79553D]"
                >
                  <option value="Bronze">Bronze</option>
                  <option value="Silver">Silver</option>
                  <option value="Gold">Gold</option>
                  <option value="Platinum">Platinum</option>
                  <option value="VIP">VIP</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8A817A] mb-1.5">Total Pembelian (Rp)</label>
                <input
                  type="number"
                  required
                  disabled={customers.some(c => c.id === selectedCustomer.id)}
                  value={selectedCustomer.totalSpent}
                  onChange={(e) => setSelectedCustomer(prev => ({ ...prev, totalSpent: Number(e.target.value) }))}
                  className="w-full px-3.5 py-2 border border-[#E8E2DD] rounded-lg text-xs text-[#2B2420] outline-none focus:border-[#79553D] disabled:bg-[#FAFAF8] disabled:cursor-not-allowed"
                />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8A817A] mb-1.5">Alamat Lengkap</label>
              <textarea
                value={selectedCustomer.address || ""}
                onChange={(e) => setSelectedCustomer(prev => ({ ...prev, address: e.target.value }))}
                className="w-full px-3.5 py-2 border border-[#E8E2DD] rounded-lg text-xs text-[#2B2420] outline-none focus:border-[#79553D] h-20 resize-none"
              />
            </div>
            
            <div className="flex justify-end gap-3.5 pt-4 border-t border-[#E8E2DD]/80">
              <button
                type="button"
                onClick={() => setEditModalOpen(false)}
                className="px-4 py-2 border border-[#E8E2DD] rounded-lg text-xs font-semibold text-[#8A817A] hover:bg-[#FAFAF8] bg-transparent cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#79553D] hover:bg-[#634430] text-white rounded-lg text-xs font-bold shadow-xs cursor-pointer border-none"
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