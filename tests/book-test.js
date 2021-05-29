
const { expect } = require('chai');
const request = require('supertest');
const { Book } = require('../src/models');
const app = require('../src/app')

describe('/books', () => {
    let books;
    
    before(async () => Book.sequelize.sync());

    beforeEach(async () => {
        await Book.destroy({ where: {} });
    
        await Promise.all([
            Book.create({
                title: 'It',
                author: 'Stephen King',
                genre: 'Horror',
                ISBN: '1473666945'
            }),
            Book.create({
                title: 'Ickabog',
                author: 'J.K. Rowling',
                genre: 'Fantasy',
                ISBN: '1510202250'
            }),
            Book.create({
                title: 'Javascript in easy steps',
                author: 'Mike McGrath',
                genre: 'Fiction',
                ISBN: '187402989'
            })
        ]);
            books = await Book.findAll()
        });
    describe('with no records in the database', () => {
        describe('POST /books', () => {
            it('creates a new book in the database', async () => {
                const response = await request(app).post('/books').send({
                    title: 'It',
                    author: 'Stephen King',
                    genre: 'Horror',
                    ISBN: '1473666945'
                });
                const newBook = await Book.findByPk(response.body.id, {
                    raw: true,
                });
                expect(response.status).to.equal(201);
                expect(response.body.title).to.equal('It');

                expect(newBook.title).to.equal('It');
                expect(newBook.author).to.equal('Stephen King');
                expect(newBook.genre).to.equal('Horror');
                expect(newBook.ISBN).to.equal('1473666945');
            });
        });
    });   

        describe('GET /books', () => {
            it('gets all book records', async () => {
                const response = await request(app).get('/books');

                expect(response.status).to.equal(200);
                expect(response.body.length).to.equal(3);

                response.body.forEach((book) => {
                    const expected = books.find((a) => a.id === book.id);

                    expect(book.title).to.equal(expected.title);
                    expect(book.author).to.equal(expected.author);
                    expect(book.genre).to.equal(expected.genre);
                    expect(book.ISBN).to.equal(expected.ISBN);
                });
            });
        });

        describe('GET /books/:id', () => {
            it('gets a book by id', async () => {
                const book = books[0];
                const response = await request(app).get(`/books/${book.id}`);

                expect(response.status).to.equal(200);

                expect(response.body.title).to.equal(book.title);
                expect(response.body.author).to.equal(book.author);
                expect(response.body.genre).to.equal(book.genre);
                expect(response.body.ISBN).to.equal(book.ISBN);
            });

            it('returns a 404 if the book does not exist', async () => {
                const response = await request(app).get('/books/12345');

                expect(response.status).to.equal(404);
                expect(response.body.error).to.equal('The book could not be found.');
            });
        });

        describe('PATCH /books/:id', () => {
            it('updates books genre by id', async () => {
                const book = books[0];
                const response = await request(app)
                    .patch(`/books/${book.id}`)
                    .send({ author: 'James Herbert' });
                const updateBookRecord = await Book.findByPk(book.id, {
                    raw: true,
                });

                expect(response.status).to.equal(200);
                expect(updateBookRecord.author).to.equal('James Herbert');
            });
        

            it('returns a 404 if the book does not exist', async () => {
                const response = await request(app)
                    .patch('/books/12345')
                    .send({ author: 'no author' });

                expect(response.status).to.equal(404);
                expect(response.body.error).to.equal('The book could not be found.')
            });
        });

        describe('DELETE /books/:id', () => {
            it('deletes a book record by id', async () => {
                const book = books[0];
                const response = await request(app).delete(`/books/${book.id}`);
                const deletedBook = await Book.findByPk(book.id, 
                { 
                    raw: true
                })

                expect(response.status).to.equal(204);
                expect(deletedBook).to.equal(null);
            });

            it('returns a 404 if the book does not exist', async () => {
                const response = await request(app).delete('/books/12345');
                expect(response.status).to.equal(404);
                expect(response.body.error).to.equal('The book could not be found.') 
            });
        });
    });
