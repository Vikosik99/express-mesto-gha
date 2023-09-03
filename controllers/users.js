const User = require('../models/user');

module.exports.addUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: err.message });
      } else {
        res.status(500).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => res.status(500).send({ message: 'На сервере произошла ошибка' }));
};

module.exports.getUserById = (req, res) => {
  const usersid = req.params.userId;
  User.findById(usersid)
    .orFail()
    .then((user) => {
      res.status(201).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Количество символов в id не соответствует необходимому' });
      } else {
        res.status(404).send({ message: 'Пользователь не найден.' });
      }
    });
};

module.exports.editUserData = (req, res) => {
  const { name, about } = req.body;
  const userid = req.user._id;
  if (userid) {
    User.findByIdAndUpdate(userid, { name, about }, { new: 'true', runValidators: true })
      .then((user) => res.send(user))
      .catch((err) => {
        if (err.name === 'ValidationError') {
          res.status(400).send({ message: err.message });
        } else {
          res.status(404).send({ message: `Пользователь по данному _id: ${req.params.user._id} не найден.` });
        }
      });
  } else {
    res.status(500).send({ message: 'На сервере произошла ошибка' });
  }
};

module.exports.editUserAvatar = (req, res) => {
  const { avatar } = req.body;
  const userid = req.user._id;
  if (userid) {
    User.findByIdAndUpdate(userid, { avatar }, { new: 'true', runValidators: true })
      .then((user) => res.send(user))
      .catch((err) => {
        if (err.name === 'ValidationError') {
          res.status(400).send({ message: err.message });
        } else {
          res.status(404).send({ message: `Пользователь по данному _id: ${req.params.usersId} не найден.` });
        }
      });
  } else {
    res.status(500).send({ message: 'На сервере произошла ошибка' });
  }
};
