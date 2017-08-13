import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';
import {check} from 'meteor/check';
import {Payments} from "./payments.js";

export const AmountPayedPerMonth = new Mongo.Collection('amountPayedPerMonth');

if (Meteor.isServer) {
    Meteor.publish('amountPayedPerMonth', function amountPayedPerMonthPublication() {
        return AmountPayedPerMonth.find({});
    });
}

Meteor.methods({
    'amountPayedPerMonth.insert'(year, month, payer, amount) {
        checkUserLoggedIn(this.userId);
        //TODO: validade year
        checkStringNotEmpty(year);
        checkStringNotEmpty(month);
        checkStringNotEmpty(payer);
        check(amount, Number);

        if (!isYearAlreadyRegistered(year, month, payer)) {
            AmountPayedPerMonth.insert({
                year: year,
                month: month,
                payer: payer,
                amount: amount,
            });
        } else {
            AmountPayedPerMonth.update({year: year, month: month, payer: payer}, {$inc: {amount: amount}});
        }
    },
    'amountPayedPerMonth.remove'(year, month, payer, amount) {
        checkUserLoggedIn(this.userId);
        //TODO: validade year
        checkStringNotEmpty(year);
        checkStringNotEmpty(month);
        checkStringNotEmpty(payer);
        check(amount, Number);

        if (!isYearPresentInPayments(year, month, payer)) {
            AmountPayedPerMonth.remove({year: year, month: month, payer: payer});
        } else {
            let decrementValue = amount * -1;
            AmountPayedPerMonth.update({year: year, month: month, payer: payer}, {$inc: {amount: decrementValue}});
        }
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

function isYearAlreadyRegistered(year, month, payer) {
    return AmountPayedPerMonth.find({year: year, month: month, payer: payer}).count() > 0;
}

function isYearPresentInPayments(year, month, payer) {
    return Payments.find({year: year, month: month, payer: payer}).count() > 0;
}

