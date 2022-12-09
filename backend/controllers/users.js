const { StatusCodes } = require('http-status-codes');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const ResourceNotFoundError = require('../errors/resourceNotFoundError');
const EmailIsRegisteredError = require('../errors/emailIsRegisteredError');
const ValidationError = require('../errors/validationError');
const WrongEmailOrPasswordError = require('../errors/wrongEmailOrPasswordError');
const BadRequestError = require('../errors/badRequestError');

const { JWT_SECRET_DEV } = require('../constants');

const { NODE_ENV, JWT_SECRET } = process.env;

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

// общая функция, используется в 2х контроллерах: getUserById, getMyProfile
const findUserById = (req, res, id, next) => {
  User.findById(id)
    .orFail(() => {
      throw new ResourceNotFoundError();
    })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError());
      } else if (err.name === 'ResourceNotFoundError') {
        next(new ResourceNotFoundError());
      } else {
        next(err);
      }
    });
};

const getUserById = (req, res, next) => {
  findUserById(req, res, req.params.userId, next);
};

const getMyProfile = (req, res, next) => {
  findUserById(req, res, req.user._id, next);
};

const createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => res
      .status(StatusCodes.CREATED)
      .send(user.toJSON()))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError());
      } else if (err.code === 11000) {
        next(new EmailIsRegisteredError());
      } else {
        next(err);
      }
    });
};

const updateProfile = (req, res, next) => {
  const { name, about } = req.body;
  const id = req.user._id;
  User.findByIdAndUpdate(id, { name, about }, { runValidators: true, new: true })
    .orFail(() => {
      throw new ResourceNotFoundError();
    })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ResourceNotFoundError') {
        next(new ResourceNotFoundError());
      } else if (err.name === 'CastError' || err.name === 'ValidationError') {
        next(new ValidationError());
      } else {
        next(err);
      }
    });
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  const id = req.user._id;
  User.findByIdAndUpdate(id, { avatar }, { runValidators: true, new: true })
    .orFail(() => {
      throw new ResourceNotFoundError();
    })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ResourceNotFoundError') {
        next(new ResourceNotFoundError());
      } else if (err.name === 'CastError' || err.name === 'ValidationError') {
        next(new ValidationError());
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : JWT_SECRET_DEV, { expiresIn: '7d' });

      res
        .cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
          sameSite: false,
          secure: NODE_ENV === 'production',
        })
        .send({ message: 'Вы успешно авторизовались' })
        .end();
    })
    .catch((err) => {
      if (err.name === 'WrongEmailOrPasswordError') {
        next(new WrongEmailOrPasswordError());
      } else {
        next(err);
      }
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateProfile,
  updateAvatar,
  login,
  getMyProfile,
};
