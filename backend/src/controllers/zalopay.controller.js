const axios = require("axios");
const CryptoJS = require("crypto-js");
const moment = require("moment");
const qs = require("qs");
const config = require("../config/zalopay.config");
const Payment = require("../models/payment.model");
exports.createOrderZaloPay = async (req, res) => {
  try {
    const { show_time_id, list_seat, total_price, discount, paid_amount } =
      req.body;

    const app_trans_id = `${moment().format("YYMMDD")}_${Math.floor(
      Math.random() * 1000000
    )}`;

    const order = {
      app_id: config.app_id,
      app_trans_id,
      app_user: req.user.id,
      app_time: Date.now(),
      amount: paid_amount,
      description: `Thanh toán vé xem phim ghế: ${list_seat.join(", ")}`,
      embed_data: JSON.stringify({
        user_id: req.user.userId,
        show_time_id,
        list_seat,
        total_price,
        discount,
        paid_amount,
        redirecturl: `https://booking-film.onrender.com/user`,
      }),
      item: JSON.stringify([]),
      bank_code: "zalopayapp",
      callback_url: `${config.callback_url}`,
    };

    const rawSignature = [
      order.app_id,
      order.app_trans_id,
      order.app_user,
      order.amount,
      order.app_time,
      order.embed_data,
      order.item,
    ].join("|");
    order.mac = CryptoJS.HmacSHA256(rawSignature, config.key1).toString();

    console.log("Payload gửi tới ZaloPay:", order);

    const response = await axios.post(
      "https://sb-openapi.zalopay.vn/v2/create",
      qs.stringify(order),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    console.log("Phản hồi từ ZaloPay:", response.data);
    if (response.data.return_code === 1) {
      res.json({
        app_trans_id,
        zp_trans_id: response.data.zp_trans_token,
        order_url: response.data.order_url,
      });
    } else {
      throw new Error("Tạo giao dịch thất bại.");
    }
  } catch (error) {
    console.error("Lỗi tạo giao dịch:", error.message);
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

exports.handleCallback = async (req, res) => {
  try {
    const { data, mac } = req.body;
    console.log("Received data from ZaloPay callback:", req.body);
    const generatedMac = CryptoJS.HmacSHA256(data, config.key2).toString();
    console.log("Generated MAC:", generatedMac);

    if (generatedMac !== mac) {
      console.error("MAC không hợp lệ!");
      return res.status(400).json({
        return_code: -1,
        return_message: "Invalid MAC",
      });
    }
    const parsedData = JSON.parse(data);
    console.log("Dữ liệu embed_data từ callback:", parsedData.embed_data);
    if (parsedData.zp_trans_id) {
      console.log("Giao dịch thành công:", parsedData);
      const paymentData = JSON.parse(parsedData.embed_data);

      if (!paymentData.user_id) {
        console.error("user_id không tồn tại trong embed_data");
        throw new Error("user_id missing in embed_data");
      }
      await Payment.create({
        user_id: paymentData.user_id,
        show_time_id: paymentData.show_time_id,
        list_seat: paymentData.list_seat,
        total_price: paymentData.total_price,
        discount: paymentData.discount,
        paid_amount: paymentData.paid_amount,
        app_trans_id: parsedData.app_trans_id,
        zp_trans_id: parsedData.zp_trans_id,
        status: "success",
      });

      console.log("Thanh toán thành công và đã lưu vào database.");
      return res.status(200).json({
        return_code: 1,
        return_message: "Callback processed successfully",
      });
    } else {
      console.error("Dữ liệu giao dịch không hợp lệ:", parsedData);
      return res.status(400).json({
        return_code: -1,
        return_message: "Invalid transaction data",
      });
    }
  } catch (error) {
    console.error("Error processing callback:", error.message);
    return res.status(500).json({
      return_code: -1,
      return_message: "Internal Server Error",
    });
  }
};

exports.verifyPaymentZaloPay = async (app_trans_id) => {
  try {
    const response = await axios.get(
      `${process.env.HOSTNAME}/zalopay/verify-payment?app_trans_id=${app_trans_id}`
    );

    console.log("Trạng thái giao dịch từ ZaloPay:", response.data);

    if (response.data.success) {
      const paymentData = JSON.parse(response.data.data.embed_data);

      await Payment.create({
        user_id: paymentData.user_id,
        show_time_id: paymentData.show_time_id,
        list_seat: paymentData.list_seat,
        total_price: paymentData.total_price,
        discount: paymentData.discount,
        paid_amount: paymentData.paid_amount,
        app_trans_id,
      });

      console.log("Thanh toán thành công và đã lưu vào database.");
    } else {
      console.log("Giao dịch chưa thành công.");
    }
  } catch (error) {
    console.error("Lỗi kiểm tra trạng thái giao dịch:", error.message);
  }
};
