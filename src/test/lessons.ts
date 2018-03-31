///<reference path="../../node_modules/@types/mocha/index.d.ts"/>
'use strict';

process.env.NODE_ENV = 'test';

import * as chaiHttp from 'chai-http';

import Lessons from '../models/Lessons';
import server from '../server';

const chai = require('chai');
const should = chai.should();

chai.use(chaiHttp);

describe('Lessons', () => {
    beforeEach((done) => { // Before each test we empty the database
        Lessons.remove({}, (err) => {
            done();
        });
    });
    /*
      * Test the /GET route
      */
    describe('/GET lessons', () => {
        it('it should GET all the lessons', (done) => {
            chai.request(server)
                .get('/api/lessons')
                .end((err, res) => {
                    console.log(res.body.data);
                    res.should.have.status(200);
                    res.body.data.lesson.should.be.a('array');
                    res.body.data.lesson.length.should.be.eql(0);
                    done();
                });
        });
    });

    describe('/POST lessons', () => {
        it('it should not POST a lessons without title overview pages', (done) => {
            const lessons = {
                approach: 'test',
                checklist: {
                    equipment: 'test',
                    printOuts: 'test',
                    instructions: 'test'
                }
            };
            chai.request(server)
                .post('/api/lessons')
                .send(lessons)
                .end((err, res) => {
                    console.log(res.body);
                    res.should.have.status(422);
                    res.body.should.be.a('object');
                    res.body.data.should.have.property('error');
                    res.body.data.error.should.be.a('array');
                    res.body.data.error[0].message.should.have.eql('err required');
                    done();
                });
        });

        it('it should POST a lessons ', (done) => {
            const lessons = {
                title: 'The Lord of the Rings',
                overview: 'J.R.R. Tolkien',
                approach: 'test',
                checklist: {
                    equipment: 'test',
                    printOuts: 'test',
                    instructions: 'test'
                }
            };
            chai.request(server)
                .post('/api/lessons')
                .send(lessons)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    res.body.should.have.property('name').eql('Created');
                    res.body.data.should.have.property('title');
                    res.body.data.should.have.property('overview');
                    res.body.data.should.have.property('approach');
                    res.body.data.should.have.property('checklist');
                    done();
                });
        });
    });

    describe('/PUT/:id lessons', () => {
        it('it should UPDATE a lesson given the id', (done) => {
            const lessons = new Lessons({
                title: 'The Lord of the Rings',
                overview: 'J.R.R. Tolkien',
                approach: 'updated',
                checklist: {
                    equipment: 'updated',
                    printOuts: 'updated',
                    instructions: 'updated'
                }
            });
            lessons.save((err, lesson) => {
                chai.request(server)
                    .put('/api/lessons/' + lesson.id)
                    .send({
                        title: 'The Lord of the Rings',
                        overview: 'J.R.R. Tolkien',
                        approach: 'updated',
                        checklist: {
                            equipment: 'test',
                            printOuts: 'test',
                            instructions: 'test'
                        }
                    })
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('name').eql('Ok');
                        res.body.data.should.have.property('approach').eql('updated');
                        done();
                    });
            });
        });
    });

    describe('/DELETE/:id lesson', () => {
        it('it should DELETE a lesson given the id', (done) => {
            const lesson = new Lessons({
                title: 'The Lord of the Rings',
                overview: 'J.R.R. Tolkien',
                approach: 'test',
                checklist: {
                    equipment: 'test',
                    printOuts: 'test',
                    instructions: 'test'
                }
            });
            lesson.save((err, lesson) => {
                chai.request(server)
                    .delete('/api/lessons/' + lesson.id)
                    .end((err, res) => {
                        res.should.have.status(204);
                        res.body.should.be.a('object');
                        res.body.should.be.eql({});
                        done();
                    });
            });
        });
    });
});
