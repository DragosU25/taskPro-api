// services/authService.js
const User = require("../models/userSchema");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const sendVerificationEmail = require("../utils/emailService");
const path = require("path");
const fs = require("fs/promises");
const Jimp = require("jimp");
const sharp = require("sharp");
const validator = require("validator");

exports.registerUser = async ({ name, email, password }) => {
  try {
    // Verifică dacă utilizatorul există deja
    let user = await User.findOne({ email });
    if (user) {
      return { error: "User already exists" };
    }

    const verificationToken = await sendVerificationEmail(email);

    // Creează utilizatorul
    user = new User({
      name,
      email,
      password,
      verificationToken,
    });

    await user.save();
    return { user };
  } catch (err) {
    throw new Error(err.message);
  }
};

exports.loginUser = async ({ email, password }) => {
  try {
    // Verifică dacă utilizatorul există
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Email is wrong");
    }

    // Compară parola hash-uită
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("password is wrong");
    }

    if (!user.verify) {
      throw new Error("Verify your email to confirm registration...!");
    }
    // Creează token-ul JWT
    const payload = {
      user: {
        id: user._id,
        name: user.username,
        email: user.email,
      },
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    user.token = token;

    return { user };
  } catch (err) {
    throw new Error(err.message);
  }
};

exports.getUserById = async (userId) => {
  return await User.findById(userId);
};

exports.logoutUser = async (userId) => {
  try {
    const loggedOutUser = await User.findByIdAndUpdate(
      userId,
      { $set: { token: null } }, // Setează câmpul `token` la `null`
      { new: true } // Returnează documentul actualizat
    );

    if (!loggedOutUser) {
      throw new Error("User not found");
    }

    return loggedOutUser;
  } catch (err) {
    throw new Error(err.message);
  }
};

exports.editUserData = async (userId, updatedData) => {
  try {
    // Găsește utilizatorul după ID
    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    // Actualizează câmpurile permise
    const allowedUpdates = ["name", "email", "password", "theme"];

    for (let key of Object.keys(updatedData)) {
      if (allowedUpdates.includes(key)) {
        if (key === "email" && !validator.isEmail(updatedData.email)) {
          throw new Error("Invalid email format");
        }

        if (key === "password" && updatedData.password.length < 6) {
          throw new Error("Password must be at least 6 characters long");
        }

        if (
          key === "theme" &&
          !["light", "dark", "violet"].includes(updatedData.theme)
        ) {
          throw new Error("Invalid theme");
        }

        if (key === "password") {
          updatedData.password = await bcrypt.hash(updatedData.password, 10); // Criptăm parola
        }

        user[key] = updatedData[key];
      }
    }

    // Salvează modificările
    const updatedUser = await user.save();
    return updatedUser;
  } catch (error) {
    console.error("Error updating user data:", error.message);
    throw new Error("Failed to update user data");
  }
};

exports.verifyUserEmail = async (verificationToken) => {
  const updates = {
    verify: true,
    verificationToken: null,
  };

  try {
    const user = await User.findOne({ verificationToken });
    if (!user) {
      throw new Error("Invalid or expired verification token.");
    }

    if (user.verify) {
      throw new Error("Verification has already been passed");
    }

    const updatedUser = await User.findOneAndUpdate(
      { verificationToken },
      { $set: updates },
      { new: true }
    );

    return updatedUser;
  } catch (error) {
    console.error("Error verifying user email:", error.message);
    throw error;
  }
};

exports.resendVerificationEmail = async (email) => {
  const user = await User.findOne({ email: email });

  if (!user) {
    throw new Error("User not found");
  }

  if (user.verify) {
    throw new Error("Verification has already been passed");
  }

  try {
    const verificationToken = await sendVerificationEmail(user.email);
    user.verificationToken = verificationToken;

    await user.save();
  } catch (error) {
    throw new Error(
      `Failed to send verification email. Error: ${error.message}`
    );
  }

  return { message: "Verification email sent" };
};

exports.processAvatar = async (file, userId) => {
  if (!file) {
    throw new Error("File not provided");
  }

  const tempFilePath = file.path;
  const avatarName = `${userId}_${Date.now()}${path.extname(
    file.originalname
  )}`;
  const avatarURL = `/avatars/${avatarName}`; // URL-ul relativ către imagine

  const publicAvatarPath = path.join(
    __dirname,
    "../../public/avatars",
    avatarName
  );

  try {
    // Procesează imaginea
    await sharp(tempFilePath)
      .resize(250, 250) // Redimensionează imaginea
      .toFormat("png", { quality: 80 })
      .toFile(publicAvatarPath); // Salvează fișierul pe server

    console.log("Image processed successfully");

    // Șterge fișierul temporar
    await fs.unlink(tempFilePath);

    return avatarURL; // Returnează URL-ul imaginii procesate
  } catch (error) {
    // Șterge fișierul temporar în caz de eroare
    await fs.unlink(tempFilePath).catch(() => {});
    throw new Error("Image processing failed");
  }
};
