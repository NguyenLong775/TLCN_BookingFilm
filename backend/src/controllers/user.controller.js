const {
  getUserService,
  updateUserService,
} = require("../services/user.service");

const getUsers = async (req, res) => {
  try {
    const users = await getUserService();
    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateUser = async (req, res) => {
  const { user_id } = req.params;
  const updatedData = req.body;

  try {
    const updatedUser = await updateUserService(user_id, updatedData);
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(updatedUser); // Trả về thông tin user sau khi cập nhật
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getUsers,
  updateUser,
};
