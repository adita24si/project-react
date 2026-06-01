import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { FiEye, FiCalendar, FiBookOpen, FiCheckCircle } from "react-icons/fi";

import DataTable from "../components/ui/DataTable";
import FilterDropdown from "../components/ui/FilterDropdown";
import Pagination from "../components/ui/Pagination";
import StatusBadge from "../components/ui/StatusBadge";
import StatCard from "../components/ui/StatCard";

const ITEMS_PER_PAGE = 7;

export default function ProductConsultation() {
  const navigate = useNavigate();
  const [typeFilter, setTypeFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  // Generate 20 dummy consultation logs
  const initialConsultations = useMemo(() => {
    const customers = [
      "Budi Santoso", "Siti Rahmawati", "Ahmad Reza", "Dewi Lestari", "Andi Wijaya",
      "Clarissa Wulandari", "Hendra Gunawan", "Fitriani Siregar", "Rian Hidayat", "Indah Permatasari"
    ];
    const topics = [
      "Layout & Tata Letak Dapur Minimalis",
      "Pemilihan Sofa & Palet Warna Ruang Keluarga",
      "Desain Ruang Kerja Kayu Walnut Rumah",
      "Kombinasi Pencahayaan & Kamar Tidur Utama",
      "Penyusunan Meja Makan & Kredenza Kayu Teak",
      "Desain Furnitur Kamar Anak Modular",
      "Layout Ruang Rapat Kantor Korporat",
      "Konsultasi Flooring Kayu Terang",
      "Pemilihan Kursi Teras Tahan Cuaca",
      "Konsep Lemari Pakaian Walk-in Closet"
    ];
    const consultationTypes = ["Desain Ruangan", "Pemilihan Produk"];
    const scheduleDates = [
      "2026-06-02 10:00", "2026-06-02 14:00", "2026-06-03 11:00", "2026-06-03 16:00",
      "2026-05-28 09:30", "2026-05-27 15:00", "2026-05-26 13:00", "2026-05-25 10:30"
    ];
    const statuses = ["Scheduled", "Completed", "Cancelled"];

    return Array.from({ length: 20 }, (_, i) => ({
      id: `CON-${500 + i * 9}`,
      customer: customers[i % customers.length],
      topic: topics[i % topics.length],
      type: consultationTypes[i % consultationTypes.length],
      schedule: scheduleDates[i % scheduleDates.length],
      status: statuses[i % statuses.length]
    }));
  }, []);

  const [consultations] = useState(initialConsultations);

  // Stats calculation
  const stats = useMemo(() => {
    return {
      total: consultations.length,
      today: consultations.filter(c => c.schedule.startsWith("2026-06-02") && c.status === "Scheduled").length,
      completed: consultations.filter(c => c.status === "Completed").length,
    };
  }, [consultations]);

  const filteredConsultations = useMemo(() => {
    if (typeFilter === "All") return consultations;
    return consultations.filter(c => c.type === typeFilter);
  }, [consultations, typeFilter]);

  const totalPages = Math.ceil(filteredConsultations.length / ITEMS_PER_PAGE);
  const paginatedConsultations = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredConsultations.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredConsultations, currentPage]);

  const columns = [
    { key: "id", label: "Consult ID" },
    { key: "customer", label: "Customer Name", render: (r) => <span className="font-semibold text-[#2B2420]">{r.customer}</span> },
    { key: "topic", label: "Topik Konsultasi", render: (r) => <span className="block max-w-xs truncate text-xs text-[#8A817A]">{r.topic}</span> },
    { 
      key: "type", 
      label: "Tipe", 
      render: (r) => (
        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
          r.type === "Desain Ruangan" ? "bg-[#ECF2F7] text-[#3D5266]" : "bg-[#FAF0E6] text-[#8C5E3C]"
        }`}>
          {r.type}
        </span>
      )
    },
    { key: "schedule", label: "Jadwal Pertemuan" },
    { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
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
            Product Consultation
          </h1>
          <p className="text-sm text-[#8A817A] mt-2 font-medium">
            Atur dan pantau janji temu konsultasi desain interior dan pencocokan mebel showroom bersama tim sales ahli kami.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <StatCard icon={<FiBookOpen />} value={String(stats.total)} label="Total Konsultasi" color="#79553D" />
        <StatCard icon={<FiCalendar />} value={String(stats.today)} label="Jadwal Hari Ini" color="#3D5266" />
        <StatCard icon={<FiCheckCircle />} value={String(stats.completed)} label="Selesai Bulan Ini" color="#4A6B46" />
      </div>

      {/* Filters dropdowns */}
      <div className="flex justify-end gap-4 mb-6 pb-6 border-b border-[#E8E2DD]/60">
        <FilterDropdown 
          label="Tipe Konsultasi"
          value={typeFilter}
          onChange={(e) => {
            setTypeFilter(e.target.value);
            setCurrentPage(1);
          }}
          options={[
            { value: "All", label: "Semua Tipe" },
            { value: "Desain Ruangan", label: "Desain Ruangan" },
            { value: "Pemilihan Produk", label: "Pemilihan Produk" },
          ]}
        />
      </div>

      {/* Table grid */}
      <div className="border border-[#E8E2DD] rounded-xl overflow-hidden">
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
