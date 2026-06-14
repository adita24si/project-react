import React, { useState, useMemo, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FiMail, FiBell, FiTrash2, FiCheckSquare, FiExternalLink, FiClock } from "react-icons/fi";
import { CRMContext } from "../context/CRMContext";

import TabsComponent from "../components/ui/TabsComponent";
import Pagination from "../components/ui/Pagination";
import EmptyState from "../components/ui/EmptyState";
import DetailCard from "../components/ui/DetailCard";
import InfoRow from "../components/ui/InfoRow";

const ITEMS_PER_PAGE = 4;

export default function Notifications() {
  const navigate = useNavigate();
  const { 
    notifications, 
    markNotificationAsRead, 
    markAllNotificationsAsRead, 
    clearNotifications 
  } = useContext(CRMContext);
  
  const [activeTab, setActiveTab] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  // Filter
  const filteredNotifications = useMemo(() => {
    if (activeTab === "all") return notifications;
    
    // Maps tab key to notification type
    const tabMap = {
      order: "Order Baru",
      customer: "Customer Baru",
      membership: "Membership Upgrade",
      ticket: "Ticket Baru",
      promo: "Promo Berakhir"
    };
    
    return notifications.filter(n => n.type === tabMap[activeTab]);
  }, [notifications, activeTab]);

  // Selected Notification for Preview
  const [selectedId, setSelectedId] = useState(null);

  const selectedNotif = useMemo(() => {
    if (selectedId) {
      return notifications.find(n => n.id === selectedId) || null;
    }
    return filteredNotifications[0] || null;
  }, [notifications, selectedId, filteredNotifications]);

  const handleItemClick = (id) => {
    markNotificationAsRead(id);
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
    { key: "order", label: "Order" },
    { key: "customer", label: "Customer" },
    { key: "membership", label: "Upgrade" },
    { key: "ticket", label: "Tiket CS" },
  ];

  // Map notification type to route links
  const getRouteLink = (type) => {
    switch (type) {
      case "Order Baru":
        return "/purchase-history";
      case "Customer Baru":
        return "/customers";
      case "Membership Upgrade":
        return "/memberships";
      case "Ticket Baru":
        return "/customer-service";
      default:
        return "/";
    }
  };

  return (
    <div className="max-w-6xl mx-auto font-sans text-left">
      
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
            onClick={markAllNotificationsAsRead}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-[#E8E2DD] hover:bg-[#FAFAF8] rounded-lg text-xs font-semibold text-[#8A817A] hover:text-[#2B2420] transition-colors bg-white cursor-pointer"
          >
            <FiCheckSquare className="text-sm" /> Read All
          </button>
          <button 
            onClick={clearNotifications}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-[#F2E6E6] hover:bg-[#F2E6E6]/40 rounded-lg text-xs font-semibold text-[#B85C5C] transition-colors bg-white cursor-pointer"
          >
            <FiTrash2 className="text-sm" /> Clear
          </button>
        </div>
      </div>

      {/* Modern Split-Pane Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Category Tabs & List */}
        <div className="lg:col-span-5 flex flex-col justify-between border border-[#E8E2DD] rounded-2xl p-4 bg-white shadow-xs">
          <div>
            {/* Tabs */}
            <div className="border-b border-[#E8E2DD] mb-3">
              <TabsComponent 
                tabs={tabs} 
                activeTab={activeTab} 
                onTabChange={(k) => { setActiveTab(k); setCurrentPage(1); setSelectedId(null); }} 
              />
            </div>

            {/* Scrollable List Container */}
            <div className="space-y-2.5 max-h-[350px] overflow-y-auto pr-1">
              {paginatedNotifications.length > 0 ? (
                paginatedNotifications.map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => handleItemClick(notif.id)}
                    className={`p-3 border rounded-xl cursor-pointer transition-all ${
                      selectedNotif && selectedNotif.id === notif.id
                        ? "border-[#79553D] bg-[#FAF6F3]"
                        : notif.isRead
                        ? "border-[#E8E2DD]/60 bg-white hover:bg-[#FAFAF8]"
                        : "border-[#79553D]/25 bg-[#FAF6F3]/30 hover:bg-[#FAF6F3]/50"
                    }`}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <p className={`text-xs ${notif.isRead ? "font-semibold" : "font-extrabold"} text-[#2B2420] truncate`}>
                        {notif.title}
                      </p>
                      {!notif.isRead && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#79553D] mt-1 flex-shrink-0 animate-ping" />
                      )}
                    </div>
                    <p className="text-[11px] text-[#8A817A] mt-1 line-clamp-2 leading-relaxed">{notif.description}</p>
                    <span className="text-[9px] text-[#8A817A] font-bold block mt-2">{notif.time}</span>
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

          {/* Pagination */}
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

        {/* Right Column: Dynamic Preview Panel */}
        <div className="lg:col-span-7 bg-white border border-[#E8E2DD] rounded-2xl p-6">
          {selectedNotif ? (
            <div className="space-y-4">
              <div className="bg-[#FAF6F3] border border-[#E8E2DD] p-4.5 rounded-xl text-left">
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
              
              <div className="space-y-0.5 text-left">
                <InfoRow label="ID Notifikasi" value={`#NTF-${selectedNotif.id}`} />
                <InfoRow label="Kategori" value={<span className="font-bold text-xs text-[#79553D]">{selectedNotif.type.toUpperCase()}</span>} />
                <InfoRow label="Waktu Masuk" value={selectedNotif.time} />
              </div>

              <button
                onClick={() => navigate(getRouteLink(selectedNotif.type))}
                className="w-full flex items-center justify-center gap-1.5 bg-[#79553D] hover:bg-[#634430] text-white py-2.5 rounded-lg text-xs font-bold shadow-xs transition-colors cursor-pointer border-none"
              >
                <FiExternalLink /> Buka Modul Terkait
              </button>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center border border-[#E8E2DD] border-dashed rounded-xl p-8 text-center text-[#8A817A] min-h-[300px]">
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
