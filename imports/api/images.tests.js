import {Meteor} from 'meteor/meteor';
import {Random} from 'meteor/random';
import {assert} from 'meteor/practicalmeteor:chai';

import {Payments} from './payments.js';

if (Meteor.isServer) {
    describe('Add payments', () => {
        const userId = Random.id();
        const addPayment = Meteor.server.method_handlers['payments.insert'];

        let url = 'http://test.com/paymentAdded.jpg';
        let title = 'Test payment';
        let description = 'Some description';
        let privatePayment = false;

        describe('Adding payments', () => {
            beforeEach(() => {
                Payments.remove({});
            });

            it('can add public payment', () => {
                addPayment.apply({userId}, [url, title, description, privatePayment]);

                assert.equal(Payments.find({
                    url: url,
                    title: title,
                    description: description,
                    privatePayment: privatePayment,
                    owner: userId
                }).count(), 1);
            });

            it('can add private payment', () => {
                privatePayment = true;

                addPayment.apply({userId}, [url, title, description, privatePayment]);

                assert.equal(Payments.find({
                    url: url,
                    title: title,
                    description: description,
                    privatePayment: privatePayment,
                    owner: userId
                }).count(), 1);
            });
        });

        describe('Validation', () => {
            beforeEach(() => {
                Payments.remove({});
            });

            it('can add an payment with an empty description', () => {
                description = '';

                addPayment.apply({userId}, [url, title, description, privatePayment]);

                assert.equal(Payments.find({
                    url: url,
                    title: title,
                    description: description,
                    privatePayment: privatePayment,
                    owner: userId
                }).count(), 1);
            });

            it('can\'t add an payment with an undefined description', () => {
                description = undefined;

                try {
                    addPayment.apply({userId}, [url, title, description, privatePayment]);
                    assert.fail('No exception threw when user tried to add an payment with an undefined description.');
                } catch (e) {
                    assert.equal(Payments.find().count(), 0);
                }
            });

            it('can\'t add an payment URL that not contains jpg, gif, png, jpeg', () => {
                url = 'http://test.com/paymentAdded.test';

                try {
                    addPayment.apply({userId}, [url, title, description, privatePayment]);
                    assert.fail('No exception threw when user tried to add an payment with an invalid URL.');
                } catch (e) {
                    assert.equal(Payments.find().count(), 0);
                }
            });

            it('can\'t add an payment without title', () => {
                title = '';

                try {
                    addPayment.apply({userId}, [url, title, description, privatePayment]);
                    assert.fail('No exception threw when user tried to add an payment without title.');
                } catch (e) {
                    assert.equal(Payments.find().count(), 0);
                }
            });

            it('can\'t add an payment without informing it\'s privacy', () => {
                privatePayment = undefined;

                try {
                    addPayment.apply({userId}, [url, title, description, privatePayment]);
                    assert.fail('No exception threw when user tried to add an payment without informing it\'s privacy.');
                } catch (e) {
                    assert.equal(Payments.find().count(), 0);
                }
            });
        });
    });

    describe('Remove payments', () => {
        const userId = Random.id();
        const deletePayment = Meteor.server.method_handlers['payments.remove'];
        let paymentId;

        describe('Public payments', () => {
            beforeEach(() => {
                Payments.remove({});
                paymentId = insertPaymentDirect(userId, false);
            });

            it('can delete owned public payment', () => {
                deletePayment.apply({userId}, [paymentId]);
                assert.equal(Payments.find().count(), 0);
            });

            it('can\'t delete another user public payment', () => {
                let anotherUserId = Random.id();

                try {
                    deletePayment.apply({anotherUserId}, [paymentId]);
                    assert.fail('No exception threw when user tried to delete another user public payment.');
                } catch (e) {
                    assert.equal(Payments.find().count(), 1);
                }
            });
        });

        describe('Private payments', () => {
            beforeEach(() => {
                Payments.remove({});
                paymentId = insertPaymentDirect(userId, true);
            });

            it('can delete owned private payment', () => {
                deletePayment.apply({userId}, [paymentId]);
                assert.equal(Payments.find().count(), 0);
            });

            it('can\'t delete another user private payment', () => {
                let anotherUserId = Random.id();

                try {
                    deletePayment.apply({anotherUserId}, [paymentId]);
                    assert.fail('No exception threw when user tried to delete another user private payment.');
                } catch (e) {
                    assert.equal(Payments.find().count(), 1);
                }
            });
        });
    });
}

function insertPaymentDirect(userId, privatePayment) {
    return Payments.insert({
        url: 'http://test.com/payment.jpg',
        title: 'test payment',
        privatePayment: privatePayment,
        createdAt: new Date(),
        owner: userId,
        username: 'tmeasday',
    });
}