import React, { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiChevronLeft, FiBell, FiExternalLink } from "react-icons/fi";

import DetailCard from "../components/ui/DetailCard";
import InfoRow from "../components/ui/InfoRow";

export default function NotificationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Custom details based on ID
  const notification = useMemo(() => {
    const cleanId = String(id).replace(/\D/g, "");
    const numeric = Number(cleanId) || 123;
    
    const types = ["promo", "membership", "complaint", "activity"];
    const type = types[numeric % types.length];

    const titles = {
      promo: "Kode Voucher Diskon Baru Dirilis",
      membership: "Loyalty Tier Upgrade Terverifikasi",
      complaint: "Pengaduan Komplain Masuk",
      activity: "Registrasi Customer Baru"
    };

    const details = {
      promo: "Kode kupon 'LEBARANSYAWAL10' diskon 10% s/d Rp 1.500.000 resmi aktif. Voucher ini disebarkan melalui kampanye email marketing ke seluruh member terdaftar yang memenuhi kualifikasi. Promosi ini berlaku hingga tanggal 15 Juni 2026.",
      membership: "Sistem mencatat akumulasi belanja Siti Rahmawati melampaui Rp 15.000.000. Upgrade tier otomatis ke Gold Tier berhasil divalidasi. Customer berhak mendapatkan potongan belanja sebesar 7% mulai transaksi berikutnya.",
      complaint: "Tiket komplain masuk dari customer Budi Santoso mengenai adanya goresan lecet di kaki meja makan jati. Tim teknisi showroom telah menjadwalkan kunjungan perbaikan ke rumah pelanggan di akhir pekan ini.",
      activity: "Pelanggan baru Clarissa Wulandari telah sukses melakukan registrasi dan menginput detail alamat pengiriman utama melalui showroom. Akun terdaftar di database TimberCraft."
    };

    const links = {
      promo: "/promotions",
      membership: "/memberships",
      complaint: "/customer-service",
      activity: "/customers"
    };

    return {
      id: id,
      title: titles[type],
      content: details[type],
      time: "2026-06-01 14:32 WIB",
      type: type,
      link: links[type],
      linkText: `Lihat Detail di Halaman ${type.charAt(0).toUpperCase() + type.slice(1)}`
    };
  }, [id]);

  return (
    <div className="p-6 md:p-8 max-w-2xl mx-auto font-sans bg-white border border-[#E8E2DD]/80 rounded-xl">
      {/* Back Button */}
      <button 
        onClick={() => navigate("/notifications")}
        className="flex items-center gap-1.5 text-xs font-bold text-[#8A817A] hover:text-[#2B2420] mb-6 transition-colors"
      >
        <FiChevronLeft className="text-base" /> Back to Notifications
      </button>

      {/* Header */}
      <div className="flex justify-between items-center pb-5 mb-6 border-b border-[#E8E2DD]/60">
        <div>
          <span className="text-xs font-semibold text-[#8A817A] uppercase tracking-wider">NOTIFICATION CONTENT</span>
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
            <div className="bg-[#FAFAFA] border border-[#E8E2DD] p-4.5 rounded-lg">
              <p className="text-xs text-[#2B2420] leading-relaxed">
                {notification.content}
              </p>
            </div>
            
            <div className="space-y-1">
              <InfoRow label="ID Notifikasi" value={notification.id} />
              <InfoRow label="Waktu Masuk" value={notification.time} />
              <InfoRow label="Tipe Notifikasi" value={<span className="font-semibold text-xs text-[#79553D]">{notification.type.toUpperCase()}</span>} />
            </div>
          </div>
        </DetailCard>

        {/* Call to Action Navigation Link */}
        <button
          onClick={() => navigate(notification.link)}
          className="w-full flex items-center justify-center gap-2 bg-[#79553D] hover:bg-[#634430] text-white py-3 rounded-lg text-xs font-semibold shadow-xs transition-colors"
        >
          <FiExternalLink />
          {notification.linkText}
        </button>
      </div>

    </div>
  );
}
