const User = require("../../db/models/User");

const getUser = async (where) => {
  return await User.findOne({ where: where });
};

const getUsers = async (where) => {
  return await User.findAll({ where: where });
};

const deleteUser = async (where) => {
  return await User.destroy({ where: where });
};

const createUser = async (user) => {
  return await User.create(user);
};

const incrementUser = async (inc, user = null) => {
  if (user instanceof User) {
    return await user.increment(inc);
  } else {
    return await User.increment(inc, { where: user });
  }
};

const updateUser = async (update, user = null) => {
  if (user instanceof User) {
    return await user.update(update);
  } else {
    return await User.update(update, { where: user });
  }
};

module.exports = {
  getUser,
  getUsers,
  deleteUser,
  createUser,
  incrementUser,
  updateUser,
};
