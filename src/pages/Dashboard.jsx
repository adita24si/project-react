import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
} from "recharts";
import { FiUsers, FiAward, FiShoppingBag, FiDollarSign, FiUserPlus, FiCheckSquare, FiSquare, FiClock } from "react-icons/fi";

import StatCard from "../components/ui/StatCard";
import StatusBadge from "../components/ui/StatusBadge";
import Avatar from "../components/ui/Avatar";
import ActivityItem from "../components/ui/ActivityItem";

// Design tokens match C
const C = {
  primary: "#79553D",
  primaryBg: "#FAF6F3",
  textDark: "#2B2420",
  textMuted: "#8A817A",
  border: "#E8E2DD",
  bg: "#FAFAFA",
};

const salesData = [
  { name: "Jan", revenue: 420000000 },
  { name: "Feb", revenue: 675000000 },
  { name: "Mar", revenue: 580000000 },
  { name: "Apr", revenue: 810000000 },
  { name: "May", revenue: 950000000 },
  { name: "Jun", revenue: 1180000000 },
];

const newCustomersData = [
  { name: "Jan", count: 28 },
  { name: "Feb", count: 42 },
  { name: "Mar", count: 35 },
  { name: "Apr", count: 50 },
  { name: "May", count: 48 },
  { name: "Jun", count: 64 },
];

const topCustomers = [
  { id: 1, name: "Ahmad Reza", email: "reza@gmail.com", loyalty: "Platinum", totalSpent: "Rp 128.500.000" },
  { id: 2, name: "Siti Rahmawati", email: "siti.rahma@yahoo.com", loyalty: "Gold", totalSpent: "Rp 94.200.000" },
  { id: 3, name: "Budi Santoso", email: "budi_s@hotmail.com", loyalty: "Gold", totalSpent: "Rp 87.800.000" },
  { id: 4, name: "Dewi Lestari", email: "dewi.les@gmail.com", loyalty: "Silver", totalSpent: "Rp 64.300.000" },
  { id: 5, name: "Andi Wijaya", email: "andiw@outlook.com", loyalty: "Silver", totalSpent: "Rp 58.900.000" },
];

const recentActivities = [
  { id: 1, title: "Pembelian Baru", desc: "Ahmad Reza membeli 1x Oslo Walnut Sofa", time: "10m ago", type: "purchase" },
  { id: 2, title: "Upgrade Membership", desc: "Siti Rahmawati di-upgrade ke Gold Tier", time: "1h ago", type: "membership" },
  { id: 3, title: "Komplain Diselesaikan", desc: "Masalah pengiriman kursi makan Budi Santoso selesai", time: "2h ago", type: "complaint" },
  { id: 4, title: "Konsultasi Selesai", desc: "Konsultasi desain ruang tamu Clarissa Wulandari telah dijadwalkan", time: "4h ago", type: "consultation" },
  { id: 5, title: "Voucher Digunakan", desc: "Voucher Diskon Lebaran digunakan oleh Andi Wijaya", time: "1d ago", type: "promo" },
];

function ChartTooltip({ active, payload, label, prefix = "" }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-[#E8E2DD] rounded-lg p-3 text-xs shadow-xs">
      <p className="text-[#8A817A] font-semibold mb-1">{label}</p>
      <p className="text-[#2B2420] font-bold">
        {prefix}{payload[0].value.toLocaleString("id-ID")}
      </p>
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [sidebarTab, setSidebarTab] = useState("activity"); // "activity" | "tasks"

  // Tasks state
  const [tasks, setTasks] = useState([
    { id: 1, text: "Follow up proposal meja jati Budi Santoso", done: false },
    { id: 2, text: "Kirim katalog kitchen set ke Siti Rahmawati", done: true },
    { id: 3, text: "Klaim penyelesaian komplain sofa lecet Ahmad Reza", done: false },
    { id: 4, text: "Atur janji temu 3D layout Clarissa W.", done: false },
  ]);

  const toggleTask = (id) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto font-sans text-[#2B2420] bg-white rounded-xl border border-[#E8E2DD]/80">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
        <div>
          <h1 
            className="text-3xl font-bold tracking-tight text-[#2B2420]"
            style={{ fontFamily: "ui-serif, Georgia, Cambria, serif" }}
          >
            Dashboard Overview
          </h1>
          <p className="text-sm text-[#8A817A] mt-2 font-medium">
            Analisis data pelanggan, monitoring loyalitas, dan pelacakan transaksi mebel TimberCraft.
          </p>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          icon={<FiUsers />} 
          value="1,247" 
          label="Total Customer" 
          delta={8.4} 
        />
        <StatCard 
          icon={<FiAward />} 
          value="856" 
          label="Total Member Aktif" 
          delta={12.1} 
          color="#967132"
        />
        <StatCard 
          icon={<FiDollarSign />} 
          value="Rp 2.84B" 
          label="Total Penjualan" 
          delta={15.3} 
          color="#4A6B46"
        />
        <StatCard 
          icon={<FiUserPlus />} 
          value="48" 
          label="Customer Baru (Bulan Ini)" 
          delta={-4.2} 
          color="#3D5266"
        />
      </div>

      {/* Recharts Graphs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Sales Chart */}
        <div className="bg-white border border-[#E8E2DD] rounded-xl p-6">
          <div className="mb-4">
            <h3 
              className="text-sm font-semibold text-[#2B2420]"
              style={{ fontFamily: "ui-serif, Georgia, Cambria, serif" }}
            >
              Grafik Penjualan
            </h3>
            <p className="text-xs text-[#8A817A] mt-1">Perkembangan total omzet 6 bulan terakhir</p>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesData} margin={{ left: -15, right: 10, top: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={C.border} />
                <XAxis dataKey="name" tick={{ fill: C.textMuted, fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis 
                  tick={{ fill: C.textMuted, fontSize: 10 }} 
                  tickLine={false} 
                  axisLine={false} 
                  tickFormatter={(v) => `${(v / 1000000).toFixed(0)}M`}
                />
                <Tooltip content={<ChartTooltip prefix="Rp " />} />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke={C.primary} 
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: "#FFF", stroke: C.primary, strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* New Customers Chart */}
        <div className="bg-white border border-[#E8E2DD] rounded-xl p-6">
          <div className="mb-4">
            <h3 
              className="text-sm font-semibold text-[#2B2420]"
              style={{ fontFamily: "ui-serif, Georgia, Cambria, serif" }}
            >
              Customer Baru Per Bulan
            </h3>
            <p className="text-xs text-[#8A817A] mt-1">Jumlah pendaftaran pelanggan baru</p>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={newCustomersData} margin={{ left: -20, right: 10, top: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={C.border} />
                <XAxis dataKey="name" tick={{ fill: C.textMuted, fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fill: C.textMuted, fontSize: 10 }} tickLine={false} axisLine={false} />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="count" fill="#D1C4BC" radius={[4, 4, 0, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Grid Bottom: Top Customers & Sidebar Tab Widget */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Customers */}
        <div className="bg-white border border-[#E8E2DD] rounded-xl p-6 lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 
                className="text-sm font-semibold text-[#2B2420]"
                style={{ fontFamily: "ui-serif, Georgia, Cambria, serif" }}
              >
                Customer dengan Pembelian Tertinggi
              </h3>
              <p className="text-xs text-[#8A817A] mt-1">Daftar pelanggan paling loyal</p>
            </div>
            <button 
              onClick={() => navigate("/customers")}
              className="text-xs font-bold text-[#79553D] hover:underline"
            >
              Lihat Semua
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-[#E8E2DD]/80 pb-2">
                  <th className="font-bold text-[#8A817A] text-xs pb-3 uppercase tracking-wider">Nama</th>
                  <th className="font-bold text-[#8A817A] text-xs pb-3 uppercase tracking-wider">Loyalitas</th>
                  <th className="font-bold text-[#8A817A] text-xs pb-3 uppercase tracking-wider text-right">Total Transaksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E2DD]/40">
                {topCustomers.map((cust) => (
                  <tr key={cust.id} className="hover:bg-[#FAFAFA]/50 cursor-pointer" onClick={() => navigate(`/customers/${cust.id}`)}>
                    <td className="py-3 flex items-center gap-3">
                      <Avatar name={cust.name} size="sm" />
                      <div>
                        <p className="font-semibold text-xs text-[#2B2420]">{cust.name}</p>
                        <p className="text-[11px] text-[#8A817A]">{cust.email}</p>
                      </div>
                    </td>
                    <td className="py-3">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
                        cust.loyalty === "Platinum" 
                          ? "bg-[#ECF2F7] text-[#3D5266]" 
                          : cust.loyalty === "Gold" 
                          ? "bg-[#FDF6E3] text-[#967132]" 
                          : "bg-[#F5F5F5] text-[#6E6A67]"
                      }`}>
                        {cust.loyalty}
                      </span>
                    </td>
                    <td className="py-3 text-right font-bold text-xs text-[#79553D]">{cust.totalSpent}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Tabbed Sidebar Widget (Radix/Shadcn inspired) */}
        <div className="bg-white border border-[#E8E2DD] rounded-xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex border-b border-[#E8E2DD] pb-2 mb-4.5 gap-4">
              <button
                onClick={() => setSidebarTab("activity")}
                className={`flex items-center gap-1.5 pb-2 text-xs font-bold border-b-2 transition-all outline-none ${
                  sidebarTab === "activity"
                    ? "border-[#79553D] text-[#79553D]"
                    : "border-transparent text-[#8A817A] hover:text-[#2B2420]"
                }`}
              >
                <FiClock /> Aktivitas
              </button>
              <button
                onClick={() => setSidebarTab("tasks")}
                className={`flex items-center gap-1.5 pb-2 text-xs font-bold border-b-2 transition-all outline-none ${
                  sidebarTab === "tasks"
                    ? "border-[#79553D] text-[#79553D]"
                    : "border-transparent text-[#8A817A] hover:text-[#2B2420]"
                }`}
              >
                <FiCheckSquare /> Tugas Follow-Up
              </button>
            </div>

            {/* Content Switcher */}
            {sidebarTab === "activity" ? (
              <div className="flex flex-col">
                {recentActivities.map((act) => (
                  <ActivityItem 
                    key={act.id}
                    title={act.title}
                    description={act.desc}
                    time={act.time}
                    type={act.type}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {tasks.map((task) => (
                  <div 
                    key={task.id} 
                    onClick={() => toggleTask(task.id)}
                    className="flex gap-2.5 items-start cursor-pointer hover:bg-[#FAF6F3] p-2 rounded-lg transition-colors"
                  >
                    <span className="text-[#79553D] mt-0.5 flex-shrink-0">
                      {task.done ? <FiCheckSquare className="text-sm stroke-[2.5]" /> : <FiSquare className="text-sm" />}
                    </span>
                    <span className={`text-xs font-semibold leading-relaxed ${
                      task.done ? "line-through text-[#8A817A]" : "text-[#2B2420]"
                    }`}>
                      {task.text}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}