import React, { useMemo, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiChevronLeft, FiExternalLink } from "react-icons/fi";
import { CRMContext } from "../context/CRMContext";

import DetailCard from "../components/ui/DetailCard";
import InfoRow from "../components/ui/InfoRow";

export default function NotificationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { notifications, markNotificationAsRead } = useContext(CRMContext);

  // Find notification by ID
  const notification = useMemo(() => {
    // Find matching by either string id or number id
    const found = notifications.find(n => {
      if (!n || !n.id) return false;
      const idA = String(n.id).trim().toLowerCase().replace(/^(#|[a-z]+-)+/g, "");
      const idB = String(id).trim().toLowerCase().replace(/^(#|[a-z]+-)+/g, "");
      if (idA === idB) return true;
      const numA = Number(idA.replace(/^0+/, ""));
      const numB = Number(idB.replace(/^0+/, ""));
      if (!isNaN(numA) && !isNaN(numB) && numA === numB) return true;
      return false;
    });
    if (found) {
      // Mark read as a side effect
      setTimeout(() => markNotificationAsRead(found.id), 100);
    }
    return found;
  }, [notifications, id, markNotificationAsRead]);

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

  if (!notification) {
    return (
      <div className="p-8 text-center text-[#2B2420] font-sans">
        <h2 className="text-xl font-bold">Pemberitahuan Tidak Ditemukan</h2>
        <p className="text-xs text-[#8A817A] mt-2">ID Notifikasi #{id} tidak terdaftar.</p>
        <button 
          onClick={() => navigate("/notifications")}
          className="mt-4 px-4 py-2 bg-[#79553D] text-white rounded-lg text-xs font-semibold cursor-pointer border-none"
        >
          Kembali ke Inbox
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto font-sans text-left">
      {/* Back Button */}
      <button 
        onClick={() => navigate("/notifications")}
        className="flex items-center gap-1.5 text-xs font-bold text-[#8A817A] hover:text-[#2B2420] mb-6 transition-colors bg-transparent border-none cursor-pointer"
      >
        <FiChevronLeft className="text-base" /> Back to Notifications
      </button>

      {/* Header */}
      <div className="flex justify-between items-center pb-5 mb-6 border-b border-[#E8E2DD]/60 bg-white p-6 rounded-2xl border border-[#E8E2DD]/85">
        <div>
          <span className="text-xs font-bold text-[#8A817A] uppercase tracking-wider">NOTIFICATION CONTENT</span>
          <h2 
            className="text-xl font-bold text-[#2B2420] mt-1"
            style={{ fontFamily: "ui-serif, Georgia, Cambria, serif" }}
          >
            {notification.title}
          </h2>
        </div>
      </div>

      <div className="space-y-6">
        {/* Full content card */}
        <DetailCard title="Detail Isi Pemberitahuan">
          <div className="space-y-4">
            <div className="bg-[#FAFAF8] border border-[#E8E2DD] p-4.5 rounded-lg">
              <p className="text-xs text-[#2B2420] leading-relaxed">
                {notification.description}
              </p>
            </div>
            
            <div className="space-y-1">
              <InfoRow label="ID Notifikasi" value={`#NTF-${notification.id}`} />
              <InfoRow label="Waktu Masuk" value={notification.time} />
              <InfoRow label="Tipe Notifikasi" value={<span className="font-bold text-xs text-[#79553D]">{notification.type.toUpperCase()}</span>} />
            </div>
          </div>
        </DetailCard>

        {/* Call to Action Navigation Link */}
        <button
          onClick={() => navigate(getRouteLink(notification.type))}
          className="w-full flex items-center justify-center gap-2 bg-[#79553D] hover:bg-[#634430] text-white py-3 rounded-lg text-xs font-bold shadow-xs transition-colors border-none cursor-pointer"
        >
          <FiExternalLink />
          Buka Modul Terkait
        </button>
      </div>

    </div>
  );
}
