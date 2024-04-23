const { token } = require("morgan");
const { User } = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//Guest User SignUp (without role property)
const signUp = async (req, res) => {
  let user = new User({
    name: req.body.name,
    email: req.body.email,
    passwordHash: bcrypt.hashSync(req.body.password, 10),
    phone: req.body.phone,
  });

  user = await user.save();
  if (!user) return res.status(400).send("he user cannot be created!");
  res.send(user);
};

//User Login
const login = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  const secret = process.env.secret;

  if (!user) {
    return res.status(400).send("The user not found");
  }

  if (user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
    const token = jwt.sign(
      {
        userId: user.id,
        role: user.role,
      },
      secret,
      { expiresIn: "1d" }
    );
    res.status(200).send({ user: user.email, name: user.name, token: token });
  } else {
    res.status(400).send("Invalid Password");
  }
};

const getUsers = async (req, res) => {
  const userList = await User.find();
  res.send(userList);
  if (!userList) {
    return res.status(500).json({
      success: false,
    });
  }
};

exports.login = login;
exports.signUp = signUp;
exports.getUsers = getUsers;
