import React, { useState, useMemo, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FiEye, FiCalendar, FiBookOpen, FiCheckCircle } from "react-icons/fi";
import { CRMContext } from "../context/CRMContext";

import DataTable from "../components/ui/DataTable";
import FilterDropdown from "../components/ui/FilterDropdown";
import SearchInput from "../components/ui/SearchInput";
import Pagination from "../components/ui/Pagination";
import StatusBadge from "../components/ui/StatusBadge";
import PremiumStatCard from "../components/ui/PremiumStatCard";

const ITEMS_PER_PAGE = 7;

export default function ProductConsultation() {
  const { consultations } = useContext(CRMContext);
  const navigate = useNavigate();
  const [designFilter, setDesignFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Stats calculation
  const stats = useMemo(() => {
    return {
      total: consultations.length,
      today: consultations.filter(c => c.date === new Date().toISOString().split("T")[0]).length,
      budgetSum: consultations.reduce((acc, c) => acc + (c.budget || 0), 0),
    };
  }, [consultations]);

  const filteredConsultations = useMemo(() => {
    let result = consultations;
    
    // Design Preference filter
    if (designFilter !== "All") {
      result = result.filter(c => c.designPreference === designFilter);
    }
    
    // Date filter (Today)
    if (dateFilter === "Today") {
      const todayStr = new Date().toISOString().split("T")[0];
      result = result.filter(c => c.date === todayStr);
    }
    
    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(c => 
        (c.customerName && c.customerName.toLowerCase().includes(q)) ||
        (c.roomType && c.roomType.toLowerCase().includes(q)) ||
        (c.designPreference && c.designPreference.toLowerCase().includes(q)) ||
        String(c.id).includes(q)
      );
    }
    
    return result;
  }, [consultations, designFilter, dateFilter, searchQuery]);

  const totalPages = Math.ceil(filteredConsultations.length / ITEMS_PER_PAGE);
  const paginatedConsultations = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredConsultations.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredConsultations, currentPage]);

  const columns = [
    { key: "id", label: "Consult ID" },
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
    { key: "roomType", label: "Jenis Ruangan" },
    { key: "roomArea", label: "Luas Ruangan", render: (r) => `${r.roomArea} m²` },
    { 
      key: "budget", 
      label: "Budget", 
      render: (r) => (
        <span className="font-extrabold text-[#79553D]">
          {(r.budget || 0).toLocaleString("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 })}
        </span>
      ) 
    },
    { 
      key: "designPreference", 
      label: "Preferensi Desain", 
      render: (r) => (
        <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-bold bg-[#FAF6F3] text-[#79553D] border border-[#E8E2DD]">
          {r.designPreference}
        </span>
      )
    },
    { key: "date", label: "Tanggal Konsultasi" },
    {
      key: "actions",
      label: "Actions",
      render: (r) => (
        <button 
          title="Detail Konsultasi"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/product-consultation/${r.id}`);
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
            Interior Consultation
          </h1>
          <p className="text-sm text-[#8A817A] mt-2 font-semibold">
            Kelola janji temu dan data pengajuan desain tata ruang interior mebel custom TimberCraft untuk rumah pelanggan.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <PremiumStatCard 
          icon={<FiBookOpen />} 
          value={String(stats.total)} 
          label="Total Pengajuan" 
          description="Semua janji konsultasi masuk"
          theme="primary"
          active={designFilter === "All" && dateFilter === "All"}
          onClick={() => {
            setDesignFilter("All");
            setDateFilter("All");
            setCurrentPage(1);
          }}
        />
        <PremiumStatCard 
          icon={<FiCalendar />} 
          value={String(stats.today)} 
          label="Pengajuan Hari Ini" 
          description="Agenda konsultasi tanggal hari ini"
          theme="info"
          active={dateFilter === "Today"}
          onClick={() => {
            setDateFilter(dateFilter === "Today" ? "All" : "Today");
            setDesignFilter("All");
            setCurrentPage(1);
          }}
        />
        <PremiumStatCard 
          icon={<FiCheckCircle />} 
          value={`Rp ${(stats.budgetSum / 1000000).toFixed(0)}Jt`} 
          label="Total Estimasi Budget" 
          description="Akumulasi budget rencana dekorasi"
          theme="success"
          active={false}
          onClick={() => {}}
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
          placeholder="Cari konsultasi berdasarkan nama, jenis ruangan..."
        />
        <FilterDropdown 
          label="Preferensi Desain"
          value={designFilter}
          onChange={(e) => {
            setDesignFilter(e.target.value);
            setCurrentPage(1);
          }}
          options={[
            { value: "All", label: "Semua Preferensi" },
            { value: "Minimalis", label: "Minimalis" },
            { value: "Scandinavian", label: "Scandinavian" },
            { value: "Industrial", label: "Industrial" },
            { value: "Modern", label: "Modern" },
            { value: "Japandi", label: "Japandi" },
          ]}
        />
      </div>



      {/* Table grid */}
      <div className="bg-white border border-[#E8E2DD] rounded-xl overflow-hidden shadow-xs">
        <DataTable 
          columns={columns} 
          data={paginatedConsultations} 
          onRowClick={(row) => navigate(`/product-consultation/${row.id}`)}
          emptyMessage="Tidak ada konsultasi terdaftar."
        />
        
        <Pagination 
          currentPage={currentPage} 
          totalPages={totalPages} 
          onPageChange={setCurrentPage} 
          totalItems={filteredConsultations.length} 
          itemsPerPage={ITEMS_PER_PAGE}
        />
      </div>

    </div>
  );
}
