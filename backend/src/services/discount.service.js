const Discount = require("../models/discount.model");

const createDiscountService = async (discount) => {
  try {
    return await Discount.create(discount);
  } catch (error) {
    throw new Error(error.message);
  }
};

const updateDiscountService = async (id, discount) => {
  try {
    return await Discount.findByIdAndUpdate(id, discount, {
      new: true,
      runValidators: true,
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

const getDiscountsService = async () => {
  try {
    return await Discount.find();
  } catch (error) {
    throw new Error(error.message);
  }
};

const getDiscountByCodeService = async (code) => {
  try {
    const discount = await Discount.findOne({ discount_code: code });

    if (!discount) {
      throw new Error("Mã giảm giá không tồn tại");
    }

    if (!discount.is_active) {
      throw new Error("Mã giảm giá không hoạt động");
    }

    const now = new Date();
    if (
      now < new Date(discount.start_date) ||
      now > new Date(discount.end_date)
    ) {
      throw new Error("Mã giảm giá không hợp lệ vào thời điểm này");
    }

    if (discount.quantity <= 0) {
      throw new Error("Mã giảm giá đã hết số lượng sử dụng");
    }

    return discount;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  createDiscountService,
  updateDiscountService,
  getDiscountsService,
  getDiscountByCodeService,
};
