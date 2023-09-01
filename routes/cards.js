const router = require('express').Router();

const {
  addCard, getCards, deleteCard, likeCard, deletelikeCard,
} = require('../controllers/cards');

router.get('/', getCards);
router.delete('/:cardId', deleteCard);
router.post('/', addCard);
router.put('/:cardId/likes', likeCard);
router.delete('/:cardId/likes', deletelikeCard);
module.exports = router;
