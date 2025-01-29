// controllers/authController.js
const authService = require("../services/auth");
const validator = require("validator");
const Joi = require("joi");

//error handler
const handleError = (res, error, next) => {
  res.status(500).json({ message: error.message });
  next(error);
};

//register
exports.register = async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!validator.isStrongPassword(password)) {
    return res.status(400).json({ msg: "Password is not strong enough" });
  }

  try {
    const result = await authService.registerUser({ name, email, password });

    if (result.error) {
      return res.status(400).json({ msg: result.error });
    }

    res.status(201).json({
      result,
    });
  } catch (err) {
    handleError(res, err, next);
  }
};

//login
exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const result = await authService.loginUser({ email, password });

    if (result.error) {
      return res.status(400).json({ msg: result.error });
    }

    res.json({ result });
  } catch (err) {
    handleError(res, err, next);
  }
};

//logout
exports.logout = async (req, res, next) => {
  if (!req.user) {
    return res
      .status(401)
      .json({ status: "error", message: "User not authenticated" });
  }

  try {
    const result = await authService.logoutUser(req.user.id);

    return res.status(200).json({
      status: "success",
      message: "User logged out successfully",
      data: result,
    });
  } catch (error) {
    console.error("Logout error:", error.message);
    handleError(res, error, next);
  }
};

//get current user
exports.getCurrentUser = async (req, res) => {
  try {
    if (!req.user) {
      cosole.log(req.user);
      return res
        .status(404)
        .json({ status: "error", message: "User not found" });
    }

    // Returnează utilizatorul din `req.user`
    res.status(200).json({
      status: "success",
      code: 200,
      data: req.user,
    });
  } catch (error) {
    console.error("Error in getCurrentUser:", error.message);
    res.status(500).json({ status: "error", message: "Server error" });
  }
};

exports.updateUser = async (req, res, next) => {
  const userId = req.user.id; // Presupunem că utilizatorul este autentificat și ID-ul este în `req.user`
  const updatedData = req.body;

  try {
    const updatedUser = await authService.editUserData(userId, updatedData);

    res.status(200).json({
      status: "success",
      message: "User data updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Error in updateUser controller:", error.message);
    res.status(500).json({
      status: "error",
      message: "Failed to update user data",
    });
  }
};
//verify email
exports.verifyUserEmail = async (req, res, next) => {
  const { verificationToken } = req.params;
  try {
    await authService.verifyUserEmail(verificationToken);
    res.status(200).json({ message: "User successfully verified", code: 200 });
  } catch (error) {
    handleError(res, err, next);
  }
};

//resend verify email
exports.handleResendVerificationEmail = async (req, res) => {
  const { email } = req.body;
  const emailSchema = Joi.object({ email: Joi.string().email().required() });
  const { error } = emailSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  try {
    const response = await authService.resendVerificationEmail(email);
    res.status(200).json(response);
  } catch (error) {
    const statusCode =
      error.message === "User not found" ||
      error.message === "Verification has already been passed"
        ? 400
        : 500;
    res.status(statusCode).json({ message: error.message });
  }
};

exports.updateAvatar = async (req, res, next) => {
  try {
    const { file, user } = req;

    // Procesează avatarul
    const avatarURL = await authService.processAvatar(file, user._id);

    // Actualizează avatarul în baza de date
    user.avatar = avatarURL;
    await user.save();

    // Trimite URL-ul imaginii în răspuns
    res.status(200).json({ avatarURL });
  } catch (error) {
    if (error.message === "File not provided") {
      return res.status(400).json({ message: error.message });
    }
    next(error);
  }
};
