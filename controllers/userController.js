import User from "../models/User.js";
import generarId from "../helpers/generarId.js";
import generarJWT from "../helpers/generarJWT.js";
import { emailRegister, emailForgetPassword } from "../helpers/email.js";

const register = async (req, res) => {
  // Evitar registros duplicados
  const { email } = req.body;
  const existeUser = await User.findOne({ email });

  if (existeUser) {
    const error = new Error("Membre déja inscrit");
    return res.status(400).json({ msg: error.message });
  }

  try {
    const user = new User(req.body);
    user.token = generarId();
    await user.save();

    // Enviar el email de confirmacion
    emailRegister({
      email: user.email,
      nombre: user.nombre,
      token: user.token,
    });

    res.json({
      msg: "Inscription réalisée, Revisez votre Email pour confirmer votre compte",
    });
  } catch (error) {
    console.log(error);
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    const error = new Error("Membre non inscrit");
    return res.status(404).json({ msg: error.message });
  }

  if (!user.confirm) {
    const error = new Error("Le compte n'est pas confirmé");
    return res.status(403).json({ msg: error.message });
  }

  if (await user.verifyPassword(password)) {
    res.json({
      _id: user._id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      token: generarJWT(user._id),
    });
  } else {
    const error = new Error("Le mot de passe est érroné");
    return res.status(403).json({ msg: error.message });
  }
};

const confirm = async (req, res) => {
  const { token } = req.params;
  const userConfirm = await User.findOne({ token });
  if (!userConfirm) {
    const error = new Error("Token érroné");
    return res.status(403).json({ msg: error.message });
  }

  try {
    userConfirm.confirm = true;
    userConfirm.token = "";
    await userConfirm.save();
    res.json({ msg: "Membre confirmé correctement" });
  } catch (error) {
    console.log(error);
  }
};

const forgetPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    const error = new Error("Membre non inscrit");
    return res.status(404).json({ msg: error.message });
  }

  try {
    user.token = generarId();
    await user.save();

    // Enviar el email
    emailForgetPassword({
      email: user.email,
      firstname: user.firstname,
      lastname: user.lastname,
      token: user.token,
    });

    res.json({ msg: "Nous avons envoyé un email" });
  } catch (error) {
    console.log(error);
  }
};

const verifyToken = async (req, res) => {
  const { token } = req.params;

  const tokenValid = await User.findOne({ token });

  if (tokenValid) {
    res.json({ msg: "Token et le membre existent" });
  } else {
    const error = new Error("Token erroné");
    return res.status(404).json({ msg: error.message });
  }
};

const newPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const user = await User.findOne({ token });

  if (user) {
    user.password = password;
    user.token = "";
    try {
      await user.save();
      res.json({ msg: "Password modifié correctement" });
    } catch (error) {
      console.log(error);
    }
  } else {
    const error = new Error("Token érroné");
    return res.status(404).json({ msg: error.message });
  }
};

const profil = async (req, res) => {
  const { user } = req;

  res.json(user);
};

export {
  register,
  login,
  confirm,
  forgetPassword,
  verifyToken,
  newPassword,
  profil,
};
