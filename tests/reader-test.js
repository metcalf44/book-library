
const { expect } = require('chai');
const request = require('supertest');
const { Reader } = require('../src/models');
const app = require('../src/app');

describe('/readers', () => {
    let readers;

    before(async () => Reader.sequelize.sync());

    beforeEach(async () => {
        await Reader.destroy({ where: {} });

        await Promise.all([
            Reader.create({
                name: 'Elizabeth Bennet',
                email: 'future_ms_darcy@gmail.com',
                password: 'mrDarcy19'
            }),
            Reader.create({
                name: 'Arya Stark',
                email: 'vmorgul@me.com',
                password: '123456'
            }),
            Reader.create({
                name: 'Lyra Belacqua',
                email: 'darknorth123@msn.org',
                password: 'PassWord'
            }),
        ]);
        readers = await Reader.findAll();
    });

    describe('POST /readers', () => {
        it('returns a 409 error if the email has already been used', async () => {
            const response = await request(app).post('/readers').send({
                name: 'Elizabeth Bennet',
                email: 'future_ms_darcy@gmail.com',
                password: 'mrDarcy19'
            });

            expect(response.status).to.equal(409);
            expect(response.body.error).to.equal(`the email future_ms_darcy@gmail.com is already being used`)
        });
    }),

    describe('with no records in the database', () => {
        describe('POST /readers', () => {
            it('creates a new reader in the database', async () => {
                const response = await request(app).post('/readers').send({
                    name: 'Ernie',
                    email: 'ernie@gmail.com',
                    password: 'ernie1234'
                });

                const newReaderRecord = await Reader.findByPk(response.body.id, {
                    raw: true
                });

                expect(response.status).to.equal(201);
                expect(response.body.name).to.equal('Ernie');
                
                expect(newReaderRecord.name).to.equal('Ernie');
                expect(newReaderRecord.email).to.equal('ernie@gmail.com');
                expect(newReaderRecord.password).to.equal('ernie1234');
            });
            
            it('returns a 400 error if the field is null', async () => {
                const response = await request(app).post('/readers').send({
                    name: 'Elizabeth Bennet',
                    email: 'future_ms_darcy@gmail.com',
                });
                expect(response.status).to.equal(400);
                expect(response.body.error).to.equal('Please check for missing text') 
            });

            it(`returns a 401 error if the password isn't between 8 and 16 characters`, async () => {
                const response = await request(app).post('/readers').send({
                    name: 'Arya Stark',
                    email: 'vmorgul@me.com',
                    password: '123456'
                });
                expect(response.status).to.equal(401);
                expect(response.body.error).to.equal('Password must be between 8 - 16 characters');
            });
        });
    });
    
    describe('GET /readers', () => {
        it('gets all readers records', async () => {
            const response = await request(app).get('/readers');

            expect(response.status).to.equal(200);
            expect(response.body.length).to.equal(3);

            response.body.forEach((reader) => {
                const expected = readers.find((a) => a.id === reader.id);

                expect(reader.name).to.equal(expected.name);
                expect(reader.email).to.equal(expected.email);
            });
        });
    });

    describe('GET /readers/:id', () => {
        it('gets readers record by id', async () => {
            const reader = readers[0];
            const response = await request(app).get(`/readers/${reader.id}`);

            expect(response.status).to.equal(200);
            expect(response.body.name).to.equal(reader.name);
            expect(response.body.email).to.equal(reader.email);
            expect(response.body.password).to.equal(reader.password)
        });

        it('returns a 404 if the reader does not exist', async () => {
            const response = await request(app).get('/readers/12345');

            expect(response.status).to.equal(404);
            expect(response.body.error).to.equal('The reader could not be found.');
        });
    });

    describe('PATCH /readers/:id', () => {
        it('updates readers email by id', async () => {
        const reader = readers[0];
        const response = await request(app)
            .patch(`/readers/${reader.id}`)
            .send({ email: 'miss_e_bennet@gmail.com' });
        const updateReaderRecord = await Reader.findByPk(reader.id, {
            raw: true,
        });

        expect(response.status).to.equal(200);
        expect(updateReaderRecord.email).to.equal('miss_e_bennet@gmail.com');
        });

        it('returns a 404 if the reader does not exist', async () => {
            const response = await request(app)
                .patch('/readers/12345')
                .send({ email: 'some_new_email@gmail.com' });

            expect(response.status).to.equal(404);
            expect(response.body.error).to.equal('The reader could not be found.');
        });
    });

    describe('DELETE /readers/:id', () => {
        it('deletes reader record by id', async () => {
            const reader = readers[0];
            const response = await request(app).delete(`/readers/${reader.id}`);
            const deletedReader = await Reader.findByPk(reader.id, { 
                raw: true 
            })

            expect(response.status).to.equal(204);
            expect(deletedReader).to.equal(null);
        });

        it('returns a 404 if the reader does not exist', async () => {
            const response = await request(app).delete('/readers/12345');
            expect(response.status).to.equal(404);
            expect(response.body.error).to.equal('The reader could not be found.');
        });
    });
});

