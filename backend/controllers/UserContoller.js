import User from "../modals/User.js";
export const createRegisterUser = async (req, res) => {
  try {
    const { name } = req.body;
    const newUser = new User({ name: name });
    await newUser.save();

    res.status(201).json("success");
  } catch (err) {
    console.log("asd");
    res.status(500).send(err.message);
  }
};

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id, { isDeleted: false });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedUser = await User.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export const getUsers = async (req, res) => {
  try {
    const data = await User.find({ isDeleted: false });
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await User.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true }
    );
    res.status(200).json(deletedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
