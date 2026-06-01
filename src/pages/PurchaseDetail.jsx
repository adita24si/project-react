import React, { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiChevronLeft, FiCheckCircle } from "react-icons/fi";

import DetailCard from "../components/ui/DetailCard";
import InfoRow from "../components/ui/InfoRow";
import StatusBadge from "../components/ui/StatusBadge";
import Avatar from "../components/ui/Avatar";

const ORDER_STAGES = ["Ordered", "Paid", "In Production", "Shipped", "Delivered"];

export default function PurchaseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Custom dummy data for a specific transaction
  const purchase = useMemo(() => {
    const products = [
      "Oslo Walnut Sofa 3-Seat", "Noir Dining Table", "Linen Lounge Chair", 
      "Arco Brass Floor Lamp", "Danish Teak Credenza", "Queen Bed Frame"
    ];
    const customers = [
      "Budi Santoso", "Siti Rahmawati", "Ahmad Reza", "Dewi Lestari", "Andi Wijaya"
    ];
    
    const cleanId = String(id).replace(/\D/g, "");
    const numeric = Number(cleanId) || 123;
    const prodName = products[numeric % products.length];
    const custName = customers[numeric % customers.length];
    const price = (numeric % 3 + 1) * 3400000;
    const qty = (numeric % 2 + 1);

    return {
      id: id,
      customer: custName,
      customerEmail: `${custName.toLowerCase().replace(/\s+/g, "")}@gmail.com`,
      product: prodName,
      qty: qty,
      total: price * qty,
      initialStage: ORDER_STAGES[numeric % ORDER_STAGES.length],
      paymentMethod: ["Transfer Bank", "Kartu Kredit", "E-Wallet"][numeric % 3],
      shippingAddress: "Jl. Kemang Raya No. 42, Jakarta Selatan, DKI Jakarta",
      notes: "Customer meminta pengantaran di hari Sabtu pagi pukul 09.00 - 12.00."
    };
  }, [id]);

  const [orderStage, setOrderStage] = useState(purchase.initialStage);
  const currentIdx = ORDER_STAGES.indexOf(orderStage);

  return (
    <div className="p-5 md:p-6 max-w-6xl mx-auto font-sans bg-white border border-[#E8E2DD]/80 rounded-xl">
      {/* Top Header & Navigation on single line */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#E8E2DD]/60">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate("/purchase-history")}
            className="flex items-center justify-center w-8 h-8 border border-[#E8E2DD] hover:bg-[#FAFAFA] rounded-md text-[#8A817A] hover:text-[#2B2420] transition-colors"
          >
            <FiChevronLeft className="text-base" />
          </button>
          <div>
            <span className="text-[10px] font-bold text-[#8A817A] uppercase tracking-wider block">Transaction Summary</span>
            <h2 
              className="text-base font-bold text-[#2B2420]"
              style={{ fontFamily: "ui-serif, Georgia, Cambria, serif" }}
            >
              Transaksi {purchase.id}
            </h2>
          </div>
        </div>
        <StatusBadge status={orderStage} />
      </div>

      {/* 2-Column Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left Column: Customer Info & Stepper */}
        <div className="lg:col-span-5 space-y-4">
          {/* Customer Card */}
          <DetailCard title="Informasi Pelanggan">
            <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[#E8E2DD]/40">
              <Avatar name={purchase.customer} size="sm" />
              <div>
                <p className="font-semibold text-xs text-[#2B2420]">{purchase.customer}</p>
                <p className="text-[10px] text-[#8A817A]">{purchase.customerEmail}</p>
              </div>
            </div>
            <div className="space-y-0.5">
              <InfoRow label="Alamat Kirim" value={purchase.shippingAddress} />
              <InfoRow label="Catatan" value={purchase.notes} />
            </div>
          </DetailCard>

          {/* Compact Stepper tracker */}
          <div className="bg-[#FAF6F3] border border-[#E8E2DD] p-3.5 rounded-xl">
            <span className="text-[9px] font-bold uppercase tracking-wider text-[#8A817A] block mb-2">Pemrosesan Pesanan</span>
            <div className="flex flex-wrap gap-1 items-center justify-between">
              {ORDER_STAGES.map((stage, idx) => {
                const isActive = idx === currentIdx;
                const isCompleted = idx < currentIdx;
                return (
                  <button
                    key={stage}
                    onClick={() => setOrderStage(stage)}
                    className={`px-2 py-1 rounded text-[10px] font-bold border transition-all flex-1 text-center truncate ${
                      isActive
                        ? "bg-[#79553D] text-white border-[#79553D]"
                        : isCompleted
                        ? "bg-[#E6ECE5] text-[#4A6B46] border-[#D8E2D7]"
                        : "bg-white text-[#8A817A] border-[#E8E2DD]"
                    }`}
                  >
                    {stage}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Transaction Details */}
        <div className="lg:col-span-7 space-y-4">
          <DetailCard title="Rincian Pembelian Mebel">
            <div className="space-y-0.5">
              <InfoRow label="Produk Furniture" value={purchase.product} />
              <InfoRow label="Jumlah Barang" value={`${purchase.qty} Pcs`} />
              <InfoRow 
                label="Nilai Transaksi" 
                value={purchase.total.toLocaleString("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 })} 
              />
              <InfoRow label="Metode Pembayaran" value={purchase.paymentMethod} />
              <InfoRow label="Tanggal Transaksi" value={purchase.date} />
            </div>
          </DetailCard>
        </div>

      </div>

    </div>
  );
}
