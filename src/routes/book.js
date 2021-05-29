
const express = require('express');
const bookController = require('../controllers/book')
const router = express.Router();

router.post('/books', bookController.create);

router.get('/books', bookController.findAll);

router.get('/books/:id', bookController.findById);
router.post('/books/genre', bookController.findByGenre);
router.post('/books/author', bookController.findByISBN);
router.post('/books/isbn', bookController.findByTitle);
router.post('/books/author', bookController.findByAuthor);


router.patch('/books/:id', bookController.update);

router.delete('/books/:id', bookController.delete);

module.exports = router