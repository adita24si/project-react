import React, { useMemo, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiChevronLeft, FiCheckCircle, FiTrash2 } from "react-icons/fi";
import { CRMContext } from "../context/CRMContext";

import DetailCard from "../components/ui/DetailCard";
import InfoRow from "../components/ui/InfoRow";
import StatusBadge from "../components/ui/StatusBadge";
import Avatar from "../components/ui/Avatar";

const ORDER_STAGES = ["Pending", "Processing", "Shipping", "Completed", "Cancelled"];

export default function PurchaseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { transactions, customers, updateTransactionStatus } = useContext(CRMContext);

  // Find transaction
  const purchase = useMemo(() => {
    return transactions.find(t => {
      if (!t || !t.id) return false;
      const idA = String(t.id).trim().toLowerCase().replace(/^(#|[a-z]+-)+/g, "");
      const idB = String(id).trim().toLowerCase().replace(/^(#|[a-z]+-)+/g, "");
      if (idA === idB) return true;
      const numA = Number(idA.replace(/^0+/, ""));
      const numB = Number(idB.replace(/^0+/, ""));
      if (!isNaN(numA) && !isNaN(numB) && numA === numB) return true;
      return false;
    });
  }, [transactions, id]);

  // Find associated customer
  const customerInfo = useMemo(() => {
    if (!purchase) return null;
    return customers.find(c => {
      if (!c || !c.id) return false;
      const idA = String(c.id).trim().toLowerCase().replace(/^(#|[a-z]+-)+/g, "");
      const idB = String(purchase.customerId).trim().toLowerCase().replace(/^(#|[a-z]+-)+/g, "");
      if (idA === idB) return true;
      const numA = Number(idA.replace(/^0+/, ""));
      const numB = Number(idB.replace(/^0+/, ""));
      if (!isNaN(numA) && !isNaN(numB) && numA === numB) return true;
      return false;
    });
  }, [customers, purchase]);

  if (!purchase) {
    return (
      <div className="p-8 text-center text-[#2B2420] font-sans">
        <h2 className="text-xl font-bold">Transaksi Tidak Ditemukan</h2>
        <p className="text-xs text-[#8A817A] mt-2">Nomor Order #{id} tidak terdaftar di database kami.</p>
        <button 
          onClick={() => navigate("/purchase-history")}
          className="mt-4 px-4 py-2 bg-[#79553D] text-white rounded-lg text-xs font-semibold cursor-pointer border-none"
        >
          Kembali ke Riwayat
        </button>
      </div>
    );
  }

  const currentIdx = ORDER_STAGES.indexOf(purchase.status);

  const subtotal = purchase.products.reduce((acc, p) => acc + (p.price * p.qty), 0);
  const shippingCost = purchase.shippingCost || 250000;
  const grandTotal = subtotal + shippingCost;

  return (
    <div className="max-w-6xl mx-auto font-sans text-left">
      {/* Top Header & Navigation */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#E8E2DD]/60 bg-white p-6 rounded-2xl border border-[#E8E2DD]/85">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate("/purchase-history")}
            className="flex items-center justify-center w-8 h-8 border border-[#E8E2DD] hover:bg-[#FAFAFA] rounded-md text-[#8A817A] hover:text-[#2B2420] transition-colors bg-white cursor-pointer"
          >
            <FiChevronLeft className="text-base" />
          </button>
          <div>
            <span className="text-[10px] font-bold text-[#8A817A] uppercase tracking-wider block">Transaction Summary</span>
            <h2 
              className="text-lg font-bold text-[#2B2420]"
              style={{ fontFamily: "ui-serif, Georgia, Cambria, serif" }}
            >
              Transaksi {purchase.id}
            </h2>
          </div>
        </div>
        <StatusBadge status={purchase.status} />
      </div>

      {/* 2-Column Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Customer Info & Stepper */}
        <div className="lg:col-span-5 space-y-6">
          {/* Customer Card */}
          <DetailCard title="Informasi Pelanggan">
            <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[#E8E2DD]/40">
              <Avatar name={purchase.customerName} size="sm" />
              <div>
                <p className="font-bold text-xs text-[#2B2420]">{purchase.customerName}</p>
                <p className="text-[10px] text-[#8A817A]">{customerInfo?.email || "No email"}</p>
              </div>
            </div>
            <div className="space-y-0.5">
              <InfoRow label="No. Telepon" value={customerInfo?.phone || "-"} />
              <InfoRow label="Kota Tujuan" value={customerInfo?.city || "Jakarta"} />
              <InfoRow label="Alamat Kirim" value={customerInfo?.address || "Jl. Kemang Raya No. 42"} />
            </div>
          </DetailCard>

          {/* Stepper tracker */}
          <div className="bg-[#FAF6F3] border border-[#E8E2DD] p-4.5 rounded-xl text-left">
            <span className="text-[9px] font-bold uppercase tracking-wider text-[#8A817A] block mb-3">
              Ubah Status Pemrosesan Pesanan
            </span>
            <div className="flex flex-col gap-2">
              {ORDER_STAGES.map((stage, idx) => {
                const isActive = stage === purchase.status;
                const isCompleted = ORDER_STAGES.indexOf(purchase.status) >= idx && purchase.status !== "Cancelled";
                
                return (
                  <button
                    key={stage}
                    onClick={() => updateTransactionStatus(purchase.id, stage)}
                    className={`px-3 py-2 rounded-lg text-xs font-bold border transition-all text-left flex items-center justify-between cursor-pointer ${
                      isActive
                        ? "bg-[#79553D] text-white border-[#79553D]"
                        : isCompleted && stage !== "Cancelled"
                        ? "bg-[#E6ECE5] text-[#4A6B46] border-[#D8E2D7] hover:bg-[#FAF6F3]"
                        : stage === "Cancelled" && purchase.status === "Cancelled"
                        ? "bg-[#F2E6E6] text-[#B85C5C] border-[#E8D1D1]"
                        : "bg-white text-[#8A817A] border-[#E8E2DD] hover:text-[#2B2420] hover:bg-[#FAFAF8]"
                    }`}
                  >
                    <span>{stage}</span>
                    {isCompleted && stage !== "Cancelled" && <FiCheckCircle className="text-sm" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Transaction Details */}
        <div className="lg:col-span-7 space-y-6">
          <DetailCard title="Rincian Pembelian Mebel">
            {/* Products List Table */}
            <div className="border border-[#E8E2DD] rounded-xl overflow-hidden mb-6">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#E8E2DD] bg-[#FAFAF8]">
                    <th className="px-4 py-3 font-bold text-[#8A817A] uppercase">Nama Produk</th>
                    <th className="px-4 py-3 font-bold text-[#8A817A] uppercase text-right">Harga</th>
                    <th className="px-4 py-3 font-bold text-[#8A817A] uppercase text-center">Qty</th>
                    <th className="px-4 py-3 font-bold text-[#8A817A] uppercase text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8E2DD]/40 text-[#2B2420]">
                  {purchase.products.map((p, idx) => (
                    <tr key={idx} className="hover:bg-[#FAFAF8]/50">
                      <td className="px-4 py-3 font-semibold">{p.name}</td>
                      <td className="px-4 py-3 text-right">Rp {(p.price || 0).toLocaleString("id-ID")}</td>
                      <td className="px-4 py-3 text-center font-bold">{p.qty || 0}</td>
                      <td className="px-4 py-3 text-right font-bold">Rp {((p.price || 0) * (p.qty || 0)).toLocaleString("id-ID")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Calculations block */}
            <div className="space-y-0.5">
              <InfoRow 
                label="Subtotal Produk" 
                value={(subtotal || 0).toLocaleString("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 })} 
              />
              <InfoRow 
                label="Biaya Ongkos Kirim" 
                value={(shippingCost || 0).toLocaleString("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 })} 
              />
              <div className="border-t border-[#E8E2DD] my-2 pt-2" />
              <div className="flex justify-between items-center py-2">
                <span className="text-xs font-bold text-[#2B2420]">Total Pembayaran</span>
                <span className="text-sm font-extrabold text-[#79553D]">
                  {(grandTotal || 0).toLocaleString("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 })}
                </span>
              </div>
              <InfoRow label="Metode Pembayaran" value={purchase.paymentMethod} />
              <InfoRow label="Tanggal Transaksi" value={purchase.date} />
            </div>
          </DetailCard>
        </div>

      </div>

    </div>
  );
}
