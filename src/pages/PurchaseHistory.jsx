import React, { useState, useMemo, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FiEye } from "react-icons/fi";
import { CRMContext } from "../context/CRMContext";

import DataTable from "../components/ui/DataTable";
import SearchInput from "../components/ui/SearchInput";
import FilterDropdown from "../components/ui/FilterDropdown";
import Pagination from "../components/ui/Pagination";
import StatusBadge from "../components/ui/StatusBadge";

const ITEMS_PER_PAGE = 7;

export default function PurchaseHistory() {
  const { transactions } = useContext(CRMContext);
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  // Filter & Search
  const filteredData = useMemo(() => {
    return transactions.filter((item) => {
      const productNames = item.products.map(p => p.name).join(", ");
      const matchSearch = item.customerName.toLowerCase().includes(search.toLowerCase()) || 
                          productNames.toLowerCase().includes(search.toLowerCase()) ||
                          item.id.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "All" || item.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [transactions, search, statusFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredData.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredData, currentPage]);

  const columns = [
    { key: "id", label: "Nomor Order" },
    { 
      key: "customerName", 
      label: "CustomerName", 
      render: (r) => <span className="font-bold text-[#2B2420]">{r.customerName}</span> 
    },
    { 
      key: "products", 
      label: "Produk Furniture",
      render: (r) => <span>{r.products.map(p => `${p.name} (x${p.qty})`).join(", ")}</span>
    },
    { 
      key: "totalAmount", 
      label: "Total Pembayaran", 
      render: (r) => (
        <span className="font-extrabold text-xs text-[#79553D]">
          {(r.totalAmount || 0).toLocaleString("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 })}
        </span>
      ) 
    },
    { key: "paymentMethod", label: "Metode" },
    { key: "status", label: "Status Pesanan", render: (r) => <StatusBadge status={r.status} /> },
    { key: "date", label: "Tanggal Pembelian" },
    {
      key: "actions",
      label: "Actions",
      render: (r) => (
        <button 
          title="Detail Transaksi"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/purchase-history/${r.id}`);
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
            Purchase History
          </h1>
          <p className="text-sm text-[#8A817A] mt-2 font-semibold">
            Riwayat pembelian mebel seluruh customer, monitor status pengiriman dan metode pembayaran.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 pb-6 border-b border-[#E8E2DD]/60">
        <SearchInput 
          value={search} 
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }} 
          placeholder="Cari order #, customer, atau produk..." 
        />
        
        <FilterDropdown 
          label="Status Pesanan"
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setCurrentPage(1);
          }}
          options={[
            { value: "All", label: "Semua Status" },
            { value: "Pending", label: "Pending" },
            { value: "Processing", label: "Processing" },
            { value: "Shipping", label: "Shipping" },
            { value: "Completed", label: "Completed" },
            { value: "Cancelled", label: "Cancelled" },
          ]}
        />
      </div>

      {/* Table */}
      <div className="bg-white border border-[#E8E2DD] rounded-xl overflow-hidden shadow-xs">
        <DataTable 
          columns={columns} 
          data={paginatedData} 
          onRowClick={(row) => navigate(`/purchase-history/${row.id}`)}
          emptyMessage="Tidak ada transaksi yang ditemukan."
        />
        
        <Pagination 
          currentPage={currentPage} 
          totalPages={totalPages} 
          onPageChange={setCurrentPage} 
          totalItems={filteredData.length} 
          itemsPerPage={ITEMS_PER_PAGE}
        />
      </div>

    </div>
  );
}
