import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { FiMail, FiBell, FiTrash2, FiCheckSquare, FiExternalLink, FiClock } from "react-icons/fi";

import NotificationItem from "../components/ui/NotificationItem";
import TabsComponent from "../components/ui/TabsComponent";
import Pagination from "../components/ui/Pagination";
import EmptyState from "../components/ui/EmptyState";
import DetailCard from "../components/ui/DetailCard";
import InfoRow from "../components/ui/InfoRow";

const ITEMS_PER_PAGE = 4;

export default function Notifications() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  // Generate 20 dummy notifications
  const initialNotifications = useMemo(() => {
    const types = ["promo", "membership", "complaint", "activity"];
    const titles = {
      promo: "Kode Voucher Diskon Baru Dirilis",
      membership: "Loyalty Tier Upgrade Terverifikasi",
      complaint: "Pengaduan Komplain Masuk",
      activity: "Registrasi Customer Baru"
    };
    const descriptions = {
      promo: "Kode kupon 'LEBARANSYAWAL10' diskon 10% s/d Rp 1.500.000 resmi aktif. Kupon ini berlaku hingga 15 Juni 2026.",
      membership: "Akumulasi belanja Siti Rahmawati mencapai target. Level di-upgrade ke Gold Tier otomatis.",
      complaint: "Customer Budi Santoso melaporkan kaki meja makan lecet setelah pengiriman pagi ini.",
      activity: "Pelanggan baru Clarissa Wulandari telah mendaftarkan alamat email & kontak showroom utama."
    };
    const links = {
      promo: "/promotions/301",
      membership: "/memberships/2",
      complaint: "/customer-service/403",
      activity: "/customers/6"
    };

    return Array.from({ length: 20 }, (_, i) => {
      const type = types[i % types.length];
      return {
        id: `NTF-${700 + i * 13}`,
        title: `${titles[type]} #${i + 1}`,
        description: descriptions[type],
        time: `${i + 1} jam yang lalu`,
        type: type,
        isRead: i > 2,
        link: links[type]
      };
    });
  }, []);

  const [notifications, setNotifications] = useState(initialNotifications);

  // Filter
  const filteredNotifications = useMemo(() => {
    if (activeTab === "all") return notifications;
    return notifications.filter(n => n.type === activeTab);
  }, [notifications, activeTab]);

  // Selected Notification for Preview
  const [selectedId, setSelectedId] = useState(
    filteredNotifications[0] ? filteredNotifications[0].id : null
  );

  const selectedNotif = useMemo(() => {
    return notifications.find(n => n.id === selectedId) || filteredNotifications[0] || null;
  }, [notifications, selectedId, filteredNotifications]);

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const handleClearAll = () => {
    if (window.confirm("Apakah Anda yakin ingin menghapus semua notifikasi?")) {
      setNotifications([]);
      setSelectedId(null);
    }
  };

  const handleItemClick = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    setSelectedId(id);
  };

  // Pagination
  const totalPages = Math.ceil(filteredNotifications.length / ITEMS_PER_PAGE);
  const paginatedNotifications = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredNotifications.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredNotifications, currentPage]);

  const tabs = [
    { key: "all", label: "Semua" },
    { key: "promo", label: "Promo" },
    { key: "membership", label: "Upgrade" },
    { key: "complaint", label: "Komplain" },
    { key: "activity", label: "Aktivitas" },
  ];

  return (
    <div className="p-5 md:p-6 max-w-6xl mx-auto font-sans bg-white border border-[#E8E2DD]/80 rounded-xl">
      
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 pb-3 border-b border-[#E8E2DD]/60">
        <div>
          <h1 
            className="text-2xl font-bold text-[#2B2420] tracking-tight"
            style={{ fontFamily: "ui-serif, Georgia, Cambria, serif" }}
          >
            Notification Inbox
          </h1>
        </div>

        <div className="flex gap-2">
          <button 
            onClick={handleMarkAllRead}
            className="flex items-center gap-1 px-2.5 py-1.5 border border-[#E8E2DD] hover:bg-[#FAFAFA] rounded-md text-xs font-semibold text-[#8A817A] hover:text-[#2B2420] transition-colors"
          >
            <FiCheckSquare className="text-sm" /> Read All
          </button>
          <button 
            onClick={handleClearAll}
            className="flex items-center gap-1 px-2.5 py-1.5 border border-[#F2E6E6] hover:bg-[#F2E6E6]/40 rounded-md text-xs font-semibold text-[#B85C5C] transition-colors"
          >
            <FiTrash2 className="text-sm" /> Clear
          </button>
        </div>
      </div>

      {/* Modern Split-Pane Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left Column: Category Tabs & List (with Fixed Height & Scroll) */}
        <div className="lg:col-span-5 flex flex-col justify-between border border-[#E8E2DD] rounded-xl p-4 bg-[#FAFAFA]/30">
          <div>
            {/* Tabs */}
            <div className="border-b border-[#E8E2DD] mb-3">
              <TabsComponent 
                tabs={tabs} 
                activeTab={activeTab} 
                onTabChange={(k) => { setActiveTab(k); setCurrentPage(1); setSelectedId(null); }} 
              />
            </div>

            {/* Scrollable List Container (Fixed Height to prevent vertical stretching) */}
            <div className="space-y-2.5 max-h-[320px] overflow-y-auto pr-1 scrollbar-thin">
              {paginatedNotifications.length > 0 ? (
                paginatedNotifications.map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => handleItemClick(notif.id)}
                    className={`p-3 border rounded-lg cursor-pointer transition-all ${
                      selectedId === notif.id
                        ? "border-[#79553D] bg-[#FAF6F3]"
                        : notif.isRead
                        ? "border-[#E8E2DD]/60 bg-white hover:bg-[#FAFAFA]"
                        : "border-[#79553D]/25 bg-[#FAF6F3]/30 hover:bg-[#FAF6F3]/50"
                    }`}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <p className={`text-xs ${notif.isRead ? "font-semibold" : "font-bold"} text-[#2B2420] truncate`}>
                        {notif.title}
                      </p>
                      {!notif.isRead && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#79553D] mt-1 flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-[11px] text-[#8A817A] mt-1 truncate">{notif.description}</p>
                    <span className="text-[9px] text-[#8A817A] font-semibold block mt-2">{notif.time}</span>
                  </div>
                ))
              ) : (
                <EmptyState 
                  icon={<FiBell />}
                  title="Tidak ada notifikasi" 
                  description="Inbox bersih untuk saat ini."
                />
              )}
            </div>
          </div>

          {/* Pagination at the bottom of the list card */}
          <div className="mt-3 pt-2 border-t border-[#E8E2DD]/40">
            <Pagination 
              currentPage={currentPage} 
              totalPages={totalPages} 
              onPageChange={setCurrentPage} 
              totalItems={filteredNotifications.length} 
              itemsPerPage={ITEMS_PER_PAGE}
            />
          </div>
        </div>

        {/* Right Column: Dynamic Notification Detail Preview Panel */}
        <div className="lg:col-span-7">
          {selectedNotif ? (
            <DetailCard title="Pratinjau Detail Notifikasi">
              <div className="space-y-4">
                <div className="bg-[#FAF6F3] border border-[#E8E2DD] p-4.5 rounded-lg">
                  <h4 
                    className="text-sm font-bold text-[#2B2420] mb-2"
                    style={{ fontFamily: "ui-serif, Georgia, Cambria, serif" }}
                  >
                    {selectedNotif.title}
                  </h4>
                  <p className="text-xs text-[#8A817A] leading-relaxed">
                    {selectedNotif.description}
                  </p>
                </div>
                
                <div className="space-y-0.5">
                  <InfoRow label="ID Notifikasi" value={selectedNotif.id} />
                  <InfoRow label="Kategori" value={<span className="font-semibold text-xs text-[#79553D]">{selectedNotif.type.toUpperCase()}</span>} />
                  <InfoRow label="Waktu Masuk" value={selectedNotif.time} />
                </div>

                <button
                  onClick={() => navigate(selectedNotif.link)}
                  className="w-full flex items-center justify-center gap-1.5 bg-[#79553D] hover:bg-[#634430] text-white py-2 rounded-lg text-xs font-semibold shadow-xs transition-colors"
                >
                  <FiExternalLink /> Buka Modul Terkait
                </button>
              </div>
            </DetailCard>
          ) : (
            <div className="h-full flex items-center justify-center border border-[#E8E2DD] border-dashed rounded-xl p-8 text-center text-[#8A817A]">
              <div>
                <FiMail className="text-3xl mx-auto opacity-30 mb-2" />
                <p className="text-xs font-semibold">Pilih notifikasi untuk melihat detail</p>
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
