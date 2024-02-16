const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  User,
  validateRegister,
  validatePassword,
  validateLogin,
  validateUpdateUser,
} = require("../Models/user.model");
const { Token } = require("../Models/token.model");
const { randomBytes } = require("node:crypto");
const { sendEmail } = require("../sendEmail");
const generateToken = () => {
  const token = randomBytes(18).toString("hex");
  return token;
};

// Add new User
const addUser = async (req, res, next) => {
  const { error, value } = validateRegister(req.body);
  if (error) return res.status(404).send(error);
  try {
    let user = await User.findOne({
      email: value.email,
    });
    if (user) return res.status(403).send("User Already Exists!!");

    const { isApproved = false } = res.locals;

    const newUser = new User({ ...value, isApproved });
    await newUser.save();
    res.status(200).send("User Inserted Successfully !!");
    // Generate and save token
    const token = await generateToken();
    const verify = new Token({
      token,
      user: newUser._id,
    });
    await verify.save();
    await verify.populate("user");
    console.log("http://localhost:3000/token/verify/" + token);
    sendEmail(newUser, token);
  } catch (error) {
    return next({ error });
  }
};

const getUsers = async (req, res, next) => {
  const page = parseInt(req.query.page || 1);
  const limit = parseInt(req.query.limit || 8);
  const { role, search } = req.query;
  const endIndex = (page - 1) * limit;

  const searchQuery = { $regex: search, $options: "i" };

  try {
    const users = await User.find({
      role,
      $or: [
        { first_name: searchQuery },
        { last_name: searchQuery },
        { email: searchQuery },
      ],
    })
      .skip(endIndex)
      .limit(limit);
    const count = await User.count({ role });
    if (!users.length) return res.status(404).send("User Does Not exist");
    res.send({ users, count, page, limit });
    return;
  } catch (error) {
    return next({ error });
  }
};

const getApprovedDoctor = async (req, res, next) => {
  const { search } = req.query;
  const searchQuery = { $regex: search, $options: "i" };
  const limit = parseInt(req.query.limit || 5);

  try {
    const users = await User.find({
      role: "Doctor",
      isApproved: true,
      $or: [
        { first_name: searchQuery },
        { last_name: searchQuery },
        { email: searchQuery },
      ],
    }).limit(limit);

    console.log(users);

    if (!users.length) return res.status(404).send("Doctor Does Not exist");
    res.send(users);
    return;
  } catch (error) {
    return next({ error });
  }
};

// Get User By ID
const getUserById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) return res.status(400).send("User Does Not Exist");
    res.send(user);
    return;
  } catch (error) {
    return next({ error });
  }
};

//Update User By ID
const updateUserById = async (req, res, next) => {
  const { id } = req.params;
  const { error, value } = validateUpdateUser(req.body);
  if (error) return res.status(404).send(error.message);
  try {
    const user = await User.findByIdAndUpdate(id, value);
    if (!user) return res.status(400).send("User Does Not Exist");

    return res.send("User Updated Successfully!!");
  } catch (error) {
    return next({ error });
  }
};

//Delete User
const deleteUserById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) return res.status(400).send("User Does Not Exist");
    res.send("User Deleted");
    return;
  } catch (error) {
    return next({ error });
  }
};

// Create Password
const createPassword = async (req, res, next) => {
  const { token } = req.query;
  const { error, value } = validatePassword(req.body);
  if (error) return res.status(404).send(error);
  try {
    const { user } = await Token.findOne({ token }, { user: 1 });

    // Encrypt Password
    const hash = await bcrypt.hash(value.password, 10);
    await User.findByIdAndUpdate(user, { password: hash, isVerified: true });

    // Delete token
    await Token.findOneAndDelete({ token });
    return next();
  } catch (error) {
    return next({ error });
  }
};

// Generate Password Reset Token
const passwordResetToken = async (req, res, next) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });

    // Check whether user exists or not
    if (!user) return res.status(401).send("User Does Not Exist!");

    const token = generateToken();

    await Token.findOneAndUpdate(
      { user: user._id },
      { token },
      { upsert: true }
    );
    console.log("http://localhost:3000/token/verify/" + token + "?route=reset");
    sendEmail(user, token);
    return next();
  } catch (error) {
    return next({ error });
  }
};

//Verify User
const login = async (req, res, next) => {
  const { error, value } = validateLogin(req.body);

  if (error) return res.status(404).send(error);
  try {
    const user = await User.findOne({ email: value.email });
    if (!user) return res.status(401).send("User Does Not Exist");

    // Check account is verified or not
    if (!user.isVerified) return res.status(403).send("Account Not Verified");
    if (!user.isApproved) return res.status(403).send("Account Not Approved");

    // Check password is valid or not
    const passwordValid = await bcrypt.compare(value.password, user.password);

    if (!passwordValid)
      return res.status(401).send("Invalid Username or password");

    res.locals.user = user;
    next();
  } catch (error) {
    return next({ error });
  }
};

// const accessTokenValidity = () => {
//   let dt = new Date();
//   dt.setHours(dt.getHours() + 72);
//   let ut = dt.toLocaleString();
//   return ut;
// };

//Generate Access Token
const accessToken = (req, res, next) => {
  const { user } = res.locals;
  const token = jwt.sign(
    { email: user.email, role: user.role },
    process.env.SECRET_KEY,
    {
      expiresIn: "2d",
    }
  );
  res.locals.token = token;
  return next();
};

const logout = async (req, res, next) => {
  const { user } = res.locals;

  try {
    await Token.findOneAndDelete({ token: user._id });

    return res.send();
  } catch (error) {
    return next({ error });
  }
};

const approveUser = async (req, res, next) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);

    // Check User exists or not
    if (!user) {
      return res.status(400).send("User Does Not Exist");
    }

    // Check Email is verified or not
    if (!user.isVerified) {
      return res.status(400).send("Email is not verified");
    }

    user.isApproved = true;
    await user.save();
    return res.send();
  } catch (error) {
    return next({ error });
  }
};

module.exports = {
  passwordResetToken,
  addUser,
  getUsers,
  getUserById,
  createPassword,
  login,
  approveUser,
  accessToken,
  updateUserById,
  deleteUserById,
  getApprovedDoctor,
  logout,
};
