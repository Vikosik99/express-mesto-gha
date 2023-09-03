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
  if (usersid.length === 24) {
    User.findById(req.params.userId)
      .then((user) => {
        if (!user) {
          res.status(404).send({ message: `Пользователь по данному _id: ${usersid} не найден.` });
        }
        res.send(user);
      })
      .catch(() => res.status(404).send({ message: `Пользователь по данному _id: ${usersid} не найден.` }));
  } else {
    res.status(400).send({ message: 'Количество символов в id не соответствует необходимому' });
  }
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
