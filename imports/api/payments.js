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
        //TODO: validate year
        checkStringNotEmpty(year);
        //TODO: validate month
        checkStringNotEmpty(month);
        checkStringNotEmpty(payer);
        checkStringNotEmpty(category);
        check(amount, Number);

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
        Meteor.call('months.insert', year, month);
        Meteor.call('payers.insert', payer);
        Meteor.call('categories.insert', category);
        Meteor.call('amountPayedPerMonth.insert', year, month, payer, amount);
    },
    'payments.remove'(paymentId) {
        check(paymentId, String);
        checkAuthorization(paymentId, this.userId);

        const payment = Payments.findOne({_id: paymentId});
        Payments.remove(paymentId);
        Meteor.call('years.remove', payment.year);
        Meteor.call('months.remove', payment.year, payment.month);
        Meteor.call('payers.remove', payment.payer);
        Meteor.call('categories.remove', payment.category);
        Meteor.call('amountPayedPerMonth.remove', payment.year, payment.month, payment.payer, payment.amount);
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

