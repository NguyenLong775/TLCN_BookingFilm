import React from "react";
import { CheckCircle } from "lucide-react";

const PaymentSuccess = () => {
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
          <p><strong>Mã giao dịch:</strong> #ZP123456789</p>
          <p><strong>Thời gian:</strong> 05/11/2025 - 14:32</p>
          <p><strong>Số tiền:</strong> 120.000đ</p>
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
