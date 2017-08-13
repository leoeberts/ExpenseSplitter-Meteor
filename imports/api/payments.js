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
    'payments.insert'(year, month, payer, category, amount) {
        checkUserLoggedIn(this.userId);
        //TODO: validade year
        checkStringNotEmpty(year);
        //TODO: validade month
        checkStringNotEmpty(month);
        checkStringNotEmpty(payer);
        checkStringNotEmpty(category);
        //TODO: validade amount
        //check(amount, Number);

        Payments.insert({
            year: year,
            month: month,
            payer: payer,
            category: category,
            amount: amount,
            createAt: new Date(),
            owner: this.userId,
            username: this.userId.username,
        });

        Meteor.call('years.insert', year);
    },
    'payments.remove'(paymentId) {
        check(paymentId, String);
        checkAuthorization(paymentId, this.userId);

        const paymentRemoved = Payments.findOne({_id: paymentId});
        Payments.remove(paymentId);
        Meteor.call('years.remove', paymentRemoved.year);
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

