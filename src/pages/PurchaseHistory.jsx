import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { FiEye } from "react-icons/fi";

import DataTable from "../components/ui/DataTable";
import SearchInput from "../components/ui/SearchInput";
import FilterDropdown from "../components/ui/FilterDropdown";
import Pagination from "../components/ui/Pagination";
import StatusBadge from "../components/ui/StatusBadge";

const ITEMS_PER_PAGE = 7;

export default function PurchaseHistory() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  // Generate 30 dummy purchase records
  const data = useMemo(() => {
    const products = [
      "Oslo Walnut Sofa 3-Seat", "Noir Dining Table", "Linen Lounge Chair", 
      "Arco Brass Floor Lamp", "Danish Teak Credenza", "Queen Bed Frame", 
      "Minimalist Oak Sideboard", "Ergonomic Desk Chair", "Velvet Accent Pouf"
    ];
    const customers = [
      "Budi Santoso", "Siti Rahmawati", "Ahmad Reza", "Dewi Lestari", "Andi Wijaya",
      "Clarissa Wulandari", "Hendra Gunawan", "Fitriani Siregar", "Rian Hidayat", "Indah Permatasari"
    ];
    const statusOpts = ["Lunas", "Cicilan", "Pending"];

    return Array.from({ length: 30 }, (_, i) => {
      const price = ((i % 5) + 1) * 2200000;
      const qty = (i % 3) + 1;
      return {
        id: `TX-${9000 - i * 13}`,
        customer: customers[i % customers.length],
        product: products[i % products.length],
        qty: qty,
        total: price * qty,
        status: statusOpts[i % statusOpts.length],
        date: `2026-05-${String((i % 25) + 1).padStart(2, "0")}`,
        paymentMethod: ["Transfer Bank", "Kartu Kredit", "E-Wallet"][i % 3]
      };
    });
  }, []);

  // Filter & Search
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchSearch = item.customer.toLowerCase().includes(search.toLowerCase()) || 
                          item.product.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "All" || item.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [data, search, statusFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredData.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredData, currentPage]);

  const columns = [
    { key: "id", label: "ID Transaksi" },
    { 
      key: "customer", 
      label: "Customer", 
      render: (r) => <span className="font-semibold text-[#2B2420]">{r.customer}</span> 
    },
    { key: "product", label: "Produk Furniture" },
    { key: "qty", label: "Qty", render: (r) => `${r.qty} Pcs` },
    { 
      key: "total", 
      label: "Total Nilai", 
      render: (r) => <span className="font-bold text-xs text-[#79553D]">{r.total.toLocaleString("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 })}</span> 
    },
    { key: "status", label: "Status Pembayaran", render: (r) => <StatusBadge status={r.status} /> },
    { key: "date", label: "Tanggal" },
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
            Purchase History
          </h1>
          <p className="text-sm text-[#8A817A] mt-2 font-medium">
            Riwayat pembelian mebel seluruh customer, monitor status pembayaran dan metode transaksi.
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
          placeholder="Cari customer atau produk..." 
        />
        
        <FilterDropdown 
          label="Status Pembayaran"
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setCurrentPage(1);
          }}
          options={[
            { value: "All", label: "Semua Status" },
            { value: "Lunas", label: "Lunas" },
            { value: "Cicilan", label: "Cicilan" },
            { value: "Pending", label: "Pending" },
          ]}
        />
      </div>

      {/* Table */}
      <div className="border border-[#E8E2DD] rounded-xl overflow-hidden">
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
