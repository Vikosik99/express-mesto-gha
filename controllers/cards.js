const Card = require('../models/cards');

module.exports.addCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      Card.findById(card._id)
        .populate('owner')
        .then((data) => res.send(data))
        .catch(() => res.status(404).send({ message: 'Карточка c указанным _id не найдена.' }));
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: err.message });
      } else {
        res.status(500).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.getCards = (req, res) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.send(cards))
    .catch(() => res.status(500).send({ message: 'На сервере произошла ошибка' }));
};

module.exports.deleteCard = (req, res) => {
  const cardid = req.params.cardId;
  if (cardid.length === 24) {
    Card.findByIdAndRemove(cardid)
      .then((card) => {
        if (!card) {
          res.status(404).send({ message: `Карточка c _id: ${cardid} не найдена.` });
          return;
        }
        res.send({ message: `Карточка ${cardid} удалена` });
      })
      .catch(() => res.status(404).send({ message: `Карточка c _id: ${cardid} не найдена.` }));
  } else {
    res.status(400).send({ message: `Некорректный _id карточки: ${cardid}` });
  }
};

module.exports.likeCard = (req, res) => {
  const cardid = req.params.cardId;
  if (cardid.length === 24) {
    Card.findByIdAndUpdate(cardid, { $addToSet: { likes: req.user._id } }, { new: true })
      .populate(['owner', 'likes'])
      .then((card) => {
        if (!card) {
          res.status(404).send({ message: `Карточка c _id: ${cardid} не найдена.` });
          return;
        }
        res.send(card);
      })
      .catch(() => res.status(404).send({ message: `Карточка c _id: ${cardid} не найдена.` }));
  } else {
    res.status(400).send({ message: `Некорректный _id карточки: ${cardid}` });
  }
};

module.exports.deletelikeCard = (req, res) => {
  const cardid = req.params.cardId;
  if (req.params.cardId.length === 24) {
    Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
      .populate(['owner', 'likes'])
      .then((card) => {
        if (!card) {
          res.status(404).send({ message: `Карточка c _id: ${cardid} не найдена.` });
          return;
        }
        res.send(card);
      })
      .catch(() => res.status(404).send({ message: `Карточка c _id: ${cardid} не найдена.` }));
  } else {
    res.status(400).send({ message: `Некорректный _id карточки: ${cardid}` });
  }
};
