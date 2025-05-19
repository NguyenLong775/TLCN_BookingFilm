import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { CheckCircle } from "lucide-react";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const [transactionInfo, setTransactionInfo] = useState({
    amount: "",
    apptransid: "",
    discountamount: "",
    status: "",
  });

  useEffect(() => {
    const amount = searchParams.get("amount");
    const discountamount = searchParams.get("discountamount");
    const apptransid = searchParams.get("apptransid");
    const status = searchParams.get("status");

    setTransactionInfo({
      amount,
      discountamount,
      apptransid,
      status,
    });
  }, [searchParams]);

  const formatCurrency = (value) => {
    return Number(value).toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  };

  if (transactionInfo.status !== "1") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600 font-semibold text-xl">
          ❌ Thanh toán thất bại hoặc bị hủy.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="border-4 border-blue-500 bg-white rounded-xl shadow-md p-6 max-w-md w-full text-center">
        
        {/* Logo + Icon */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQe6SEQ293X0nfFojf6nsCWKA8dNGOrqn21jg&s"
            alt="Biểu tượng ZaloPay"
            className="w-24"
          />
          <CheckCircle className="text-green-500 w-6 h-6" />
        </div>

        {/* Tiêu đề */}
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Thanh toán thành công!
        </h2>

        {/* Nội dung */}
        <p className="text-gray-600">
          Cảm ơn bạn đã sử dụng <strong>ZaloPay</strong> để thanh toán.
        </p>
        <p className="text-pink-600 font-semibold my-3">
          🎉 Chúc bạn một ngày thật tuyệt vời! 🎉
        </p>

        {/* Thông tin giao dịch */}
        <div className="text-left text-gray-800 bg-gray-100 p-4 rounded-lg mb-6 text-sm">
          <p><strong>Mã giao dịch:</strong> #{transactionInfo.apptransid}</p>
          <p><strong>Thời gian:</strong> {new Date().toLocaleString("vi-VN")}</p>
          <p><strong>Số tiền thanh toán:</strong> {formatCurrency(transactionInfo.amount)}</p>
          <p><strong>Đã giảm giá:</strong> {formatCurrency(transactionInfo.discountamount)}</p>
        </div>

        {/* Nút */}
        <button
          onClick={() => window.location.href = "/"}
          className="bg-white border border-gray-300 hover:bg-gray-100 text-black font-semibold py-2 px-6 rounded-full transition"
        >
          Về trang chủ
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;
