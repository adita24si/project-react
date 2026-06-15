import React, { useState, useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { CRMContext } from "../context/CRMContext";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend
} from "recharts";
import { FiUsers, FiAward, FiShoppingBag, FiDollarSign, FiCheckSquare, FiSquare, FiClock, FiStar, FiActivity } from "react-icons/fi";

import StatCard from "../components/ui/StatCard";
import Avatar from "../components/ui/Avatar";
import ActivityItem from "../components/ui/ActivityItem";

const C = {
  primary: "#79553D",
  primaryBg: "#FAF6F3",
  textDark: "#2B2420",
  textMuted: "#8A817A",
  border: "#E8E2DD",
  bg: "#FAFAFA",
  accent1: "#A67C52",
  accent2: "#4A6B46",
  accent3: "#967132",
  accent4: "#3D5266",
};

function ChartTooltip({ active, payload, label, prefix = "" }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-[#E8E2DD] rounded-xl p-3 text-xs shadow-md text-left">
      <p className="text-[#8A817A] font-bold mb-1">{label}</p>
      <p className="text-[#2B2420] font-extrabold">
        {prefix}{payload[0].value.toLocaleString("id-ID")}
      </p>
    </div>
  );
}

export default function Dashboard() {
  const { customers, transactions, activities } = useContext(CRMContext);
  const navigate = useNavigate();
  const [sidebarTab, setSidebarTab] = useState("activity");

  const user = useMemo(() => {
    try {
      const localUser = localStorage.getItem("user");
      return localUser ? JSON.parse(localUser) : null;
    } catch (e) {
      return null;
    }
  }, []);

  const adminName = user?.user_metadata?.full_name || user?.email || "Admin";

  // Tasks state (Follow-Up Tasks)
  const [tasks, setTasks] = useState([
    { id: 1, text: "Follow up proposal meja jati Budi Santoso", done: false },
    { id: 2, text: "Kirim katalog kitchen set ke Siti Rahmawati", done: true },
    { id: 3, text: "Klaim penyelesaian komplain sofa lecet Ahmad Reza", done: false },
    { id: 4, text: "Atur janji temu 3D layout Clarissa W.", done: false },
  ]);

  const toggleTask = (id) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  // KPIs Calculations
  const totalCustomers = customers.length;
  const activeMembers = customers.filter(c => c.loyalty !== "Bronze").length;
  const totalRevenue = transactions
    .filter(t => t.status !== "Cancelled")
    .reduce((acc, curr) => acc + curr.totalAmount, 0);

  // Growth calculations
  const newCustomersThisMonth = customers.filter(c => {
    const month = new Date(c.joinDate).getMonth();
    const currentMonth = new Date().getMonth();
    return month === currentMonth;
  }).length;

  // Recharts Monthly Revenue aggregation
  const monthlyRevenueData = useMemo(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const currentYear = new Date().getFullYear();
    
    // Group transactions by month
    const groups = {};
    months.forEach(m => { groups[m] = 0; });

    transactions.forEach(t => {
      if (t.status === "Cancelled") return;
      const d = new Date(t.date);
      if (d.getFullYear() === currentYear || d.getFullYear() === 2026) {
        const mName = months[d.getMonth()];
        groups[mName] += t.totalAmount;
      }
    });

    // Make sure we have a nice trend to show, filled up to June if empty
    const result = months.map(m => ({
      name: m,
      revenue: groups[m]
    }));

    // If transactions sum to 0, use fallback realistic dummy data for display
    const totalCalc = result.reduce((a, b) => a + b.revenue, 0);
    if (totalCalc === 0) {
      return [
        { name: "Jan", revenue: 140000000 },
        { name: "Feb", revenue: 195000000 },
        { name: "Mar", revenue: 250000000 },
        { name: "Apr", revenue: 180000000 },
        { name: "May", revenue: 320000000 },
        { name: "Jun", revenue: totalRevenue || 380000000 },
      ];
    }
    return result.slice(0, 6); // Show first 6 months
  }, [transactions, totalRevenue]);

  // Customer growth data aggregation
  const customerGrowthData = useMemo(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
    const counts = { Jan: 3, Feb: 4, Mar: 2, Apr: 5, May: 4, Jun: customers.length };
    return months.map(m => ({
      name: m,
      count: counts[m]
    }));
  }, [customers]);

  // Membership distribution data for pie chart
  const membershipDistribution = useMemo(() => {
    const tiers = { Bronze: 0, Silver: 0, Gold: 0, Platinum: 0, VIP: 0 };
    customers.forEach(c => {
      if (tiers[c.loyalty] !== undefined) tiers[c.loyalty]++;
    });
    return Object.keys(tiers).map(key => ({
      name: key,
      value: tiers[key]
    })).filter(item => item.value > 0);
  }, [customers]);

  // Product categories distribution
  const categoryData = [
    { name: "Sofa", value: 35 },
    { name: "Meja", value: 25 },
    { name: "Kursi", value: 15 },
    { name: "Lemari", value: 12 },
    { name: "Lainnya", value: 13 }
  ];

  const COLORS = [C.primary, C.accent1, C.accent2, C.accent3, C.accent4];

  // Top 5 Customers
  const topFiveCustomers = useMemo(() => {
    return [...customers]
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, 5);
  }, [customers]);

  return (
    <div className="max-w-7xl mx-auto font-sans text-[#2B2420]">
      
      {/* Good Morning Greeting Banner */}
      <div className="bg-[#FAF6F3] border border-[#E8E2DD] rounded-2xl p-6.5 mb-8 text-left">
        <h2 className="text-2xl font-bold text-[#2B2420] tracking-tight" style={{ fontFamily: "ui-serif, Georgia, serif" }}>
          Welcome back to FurniCraft CRM, {adminName}! 👋
        </h2>
        <p className="text-xs text-[#8A817A] mt-1 font-semibold">
          Berikut adalah ringkasan performa penjualan furniture, membership, dan aktivitas pelanggan hari ini.
        </p>
      </div>

      {/* KPI Section - 4 Main Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          icon={<FiUsers />} 
          value={totalCustomers} 
          label="Total Customers" 
          delta={8.4} 
        />
        <StatCard 
          icon={<FiAward />} 
          value={activeMembers} 
          label="Membership Aktif" 
          delta={12.1} 
          color={C.accent3}
        />
        <StatCard 
          icon={<FiDollarSign />} 
          value={`Rp ${(totalRevenue / 1000000).toFixed(1)}M`} 
          label="Revenue Bulan Ini" 
          delta={15.3} 
          color={C.accent2}
        />
        <StatCard 
          icon={<FiShoppingBag />} 
          value={transactions.length} 
          label="Total Orders" 
          delta={6.8} 
          color={C.accent4}
        />
      </div>

      {/* Sub KPIs Section (Customer, Sales, Product, Membership Details) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Customer KPIs */}
        <div className="bg-white border border-[#E8E2DD] p-4.5 rounded-xl text-left">
          <p className="text-[10px] font-bold text-[#8A817A] uppercase tracking-wider mb-2">Customer KPI</p>
          <div className="space-y-1.5 text-xs font-semibold">
            <div className="flex justify-between">
              <span className="text-[#8A817A]">New Customers</span>
              <span className="text-[#2B2420]">{newCustomersThisMonth}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#8A817A]">Active Customers</span>
              <span className="text-[#2B2420]">{customers.filter(c => c.status === "Active").length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#8A817A]">VIP Customers</span>
              <span className="text-[#2B2420]">{customers.filter(c => c.loyalty === "VIP").length}</span>
            </div>
          </div>
        </div>

        {/* Sales KPIs */}
        <div className="bg-white border border-[#E8E2DD] p-4.5 rounded-xl text-left">
          <p className="text-[10px] font-bold text-[#8A817A] uppercase tracking-wider mb-2">Sales KPI</p>
          <div className="space-y-1.5 text-xs font-semibold">
            <div className="flex justify-between">
              <span className="text-[#8A817A]">Revenue Today</span>
              <span className="text-[#2B2420]">Rp 195.0M</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#8A817A]">Avg. Order Value</span>
              <span className="text-[#2B2420]">Rp {(totalRevenue / (transactions.length || 1) / 1000000).toFixed(1)}M</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#8A817A]">Completed Orders</span>
              <span className="text-[#2B2420]">{transactions.filter(t => t.status === "Completed").length}</span>
            </div>
          </div>
        </div>

        {/* Product KPIs */}
        <div className="bg-white border border-[#E8E2DD] p-4.5 rounded-xl text-left">
          <p className="text-[10px] font-bold text-[#8A817A] uppercase tracking-wider mb-2">Product KPI</p>
          <div className="space-y-1.5 text-xs font-semibold">
            <div className="flex justify-between">
              <span className="text-[#8A817A]">Best Seller</span>
              <span className="text-[#2B2420] truncate max-w-[120px]">Oslo Sofa</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#8A817A]">Most Viewed</span>
              <span className="text-[#2B2420] truncate max-w-[120px]">Japandi Bed</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#8A817A]">Low Stock Item</span>
              <span className="text-[#B85C5C]">3 Items</span>
            </div>
          </div>
        </div>

        {/* Membership KPIs */}
        <div className="bg-white border border-[#E8E2DD] p-4.5 rounded-xl text-left">
          <p className="text-[10px] font-bold text-[#8A817A] uppercase tracking-wider mb-2">Membership KPI</p>
          <div className="space-y-1.5 text-xs font-semibold">
            <div className="flex justify-between">
              <span className="text-[#8A817A]">Total Members</span>
              <span className="text-[#2B2420]">{customers.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#8A817A]">Loyalty Points Issued</span>
              <span className="text-[#2B2420]">{customers.reduce((a, b) => a + b.loyaltyPoints, 0)} pts</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#8A817A]">Membership Growth</span>
              <span className="text-[#2B2420]">+14.2%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        
        {/* Sales Trend (Revenue Trend) */}
        <div className="bg-white border border-[#E8E2DD] rounded-2xl p-6 lg:col-span-2 text-left">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-[#2B2420]" style={{ fontFamily: "ui-serif, Georgia, serif" }}>
              Revenue & Sales Trend
            </h3>
            <p className="text-xs text-[#8A817A] mt-0.5">Perkembangan total omzet 6 bulan terakhir</p>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyRevenueData} margin={{ left: -15, right: 10, top: 10, bottom: 0 }}>
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

        {/* Membership Distribution (Pie Chart) */}
        <div className="bg-white border border-[#E8E2DD] rounded-2xl p-6 text-left flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#2B2420] mb-1" style={{ fontFamily: "ui-serif, Georgia, serif" }}>
              Membership Distribution
            </h3>
            <p className="text-xs text-[#8A817A] mb-4">Penyebaran level loyalty customer</p>
          </div>
          <div className="h-44 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={membershipDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {membershipDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value} Members`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-4 text-[10px] font-bold text-[#2B2420]">
            {membershipDistribution.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[index % COLORS.length] }} />
                <span>{entry.name} ({entry.value})</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Customer Growth & Categories Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Customer Growth Chart */}
        <div className="bg-white border border-[#E8E2DD] rounded-2xl p-6 text-left">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-[#2B2420]" style={{ fontFamily: "ui-serif, Georgia, serif" }}>
              Customer Growth
            </h3>
            <p className="text-xs text-[#8A817A]">Peningkatan jumlah pendaftar pelanggan baru</p>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={customerGrowthData} margin={{ left: -25, right: 10, top: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={C.border} />
                <XAxis dataKey="name" tick={{ fill: C.textMuted, fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fill: C.textMuted, fontSize: 10 }} tickLine={false} axisLine={false} />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="count" fill={C.accent1} radius={[4, 4, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Product Categories */}
        <div className="bg-white border border-[#E8E2DD] rounded-2xl p-6 text-left lg:col-span-2">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-[#2B2420]" style={{ fontFamily: "ui-serif, Georgia, serif" }}>
              Top Categories (Sales Share)
            </h3>
            <p className="text-xs text-[#8A817A]">Persentase penjualan berdasarkan kategori furniture</p>
          </div>
          <div className="space-y-3 mt-6">
            {categoryData.map((cat, idx) => (
              <div key={cat.name} className="space-y-1 text-xs font-bold">
                <div className="flex justify-between">
                  <span className="text-[#2B2420]">{cat.name}</span>
                  <span className="text-[#8A817A]">{cat.value}%</span>
                </div>
                <div className="w-full bg-[#FAFAF8] h-2 rounded-full overflow-hidden border border-[#E8E2DD]/40">
                  <div 
                    className="h-full rounded-full transition-all duration-500" 
                    style={{ 
                      width: `${cat.value}%`, 
                      background: COLORS[idx % COLORS.length] 
                    }} 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Grid Bottom: Top Customers & Activity Center */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Top Customers list */}
        <div className="bg-white border border-[#E8E2DD] rounded-2xl p-6 lg:col-span-2 text-left">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-sm font-bold text-[#2B2420]" style={{ fontFamily: "ui-serif, Georgia, serif" }}>
                Customer Pembelian Tertinggi
              </h3>
              <p className="text-xs text-[#8A817A] mt-0.5">Daftar pelanggan paling loyal berdasarkan total belanja</p>
            </div>
            <button 
              onClick={() => navigate("/customers")}
              className="text-xs font-bold text-[#79553D] hover:underline bg-transparent border-none cursor-pointer"
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
                {topFiveCustomers.map((cust) => (
                  <tr 
                    key={cust.id} 
                    className="hover:bg-[#FAFAF8] cursor-pointer" 
                    onClick={() => navigate(`/customers/${cust.id}`)}
                  >
                    <td className="py-3 flex items-center gap-3">
                      <Avatar name={cust.name} size="sm" />
                      <div>
                        <p className="font-bold text-xs text-[#2B2420]">{cust.name}</p>
                        <p className="text-[10px] text-[#8A817A]">{cust.email}</p>
                      </div>
                    </td>
                    <td className="py-3">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                        cust.loyalty === "VIP"
                          ? "bg-[#FDF2E9] text-[#79553D]"
                          : cust.loyalty === "Platinum" 
                          ? "bg-[#ECF2F7] text-[#3D5266]" 
                          : cust.loyalty === "Gold" 
                          ? "bg-[#FDF6E3] text-[#967132]" 
                          : "bg-[#F5F5F5] text-[#6E6A67]"
                      }`}>
                        {cust.loyalty}
                      </span>
                    </td>
                    <td className="py-3 text-right font-extrabold text-xs text-[#79553D]">
                      {(cust.totalSpent || 0).toLocaleString("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Activity Center & Tasks */}
        <div className="bg-white border border-[#E8E2DD] rounded-2xl p-6 flex flex-col justify-between text-left">
          <div>
            <div className="flex border-b border-[#E8E2DD] pb-2 mb-4.5 gap-4">
              <button
                onClick={() => setSidebarTab("activity")}
                className={`flex items-center gap-1.5 pb-2 text-xs font-bold border-b-2 transition-all outline-none bg-transparent border-none cursor-pointer ${
                  sidebarTab === "activity"
                    ? "border-b-[#79553D] text-[#79553D]"
                    : "text-[#8A817A] hover:text-[#2B2420]"
                }`}
              >
                <FiClock /> Aktivitas Center
              </button>
              <button
                onClick={() => setSidebarTab("tasks")}
                className={`flex items-center gap-1.5 pb-2 text-xs font-bold border-b-2 transition-all outline-none bg-transparent border-none cursor-pointer ${
                  sidebarTab === "tasks"
                    ? "border-b-[#79553D] text-[#79553D]"
                    : "text-[#8A817A] hover:text-[#2B2420]"
                }`}
              >
                <FiCheckSquare /> Tugas Follow-Up
              </button>
            </div>

            {/* Content Switcher */}
            {sidebarTab === "activity" ? (
              <div className="flex flex-col max-h-[300px] overflow-y-auto pr-1">
                {activities.slice(0, 5).map((act) => (
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