import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';
import {check} from 'meteor/check';

export const Payments = new Mongo.Collection('payments');

if (Meteor.isServer) {
    Meteor.publish('payments', function paymentsPublication() {
        return Payments.find({});
    });
}

Meteor.methods({
    'payments.insert'(month, payer, category, amount) {
        checkUserLoggedIn(this.userId);
        checkStringNotEmpty(month);
        checkStringNotEmpty(payer);
        checkStringNotEmpty(category);
        //check(amount, Number);

        Payments.insert({
            month: month,
            payer: payer,
            category: category,
            amount: amount,
            createAt: new Date(),
            owner: this.userId,
            username: this.userId.username,
        });
    },
    'payments.remove'(paymentId) {
        check(paymentId, String);
        checkAuthorization(paymentId, this.userId);
        Payments.remove(paymentId);
    },
});

function checkUserLoggedIn(userId) {
    if (!userId) {
        throw new Meteor.Error('not-authorized')
    }
}

function checkStringNotEmpty(value) {
    check(value, String);
    check(value.length > 0, true);
}

function checkAuthorization(paymentId, userId) {
    const payment = Payments.findOne(paymentId);
    if (payment.owner !== userId) {
        throw new Meteor.Error('not-authorized');
    }
}

