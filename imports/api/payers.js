import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';
import {check} from 'meteor/check';
import {Payments} from "./payments.js";

export const Payers = new Mongo.Collection('payers');

if (Meteor.isServer) {
    Meteor.publish('payers', function payersPublication() {
        return Payers.find({});
    });
}

Meteor.methods({
    'payers.insert'(payer) {
        checkUserLoggedIn(this.userId);
        checkStringNotEmpty(payer);

        if (!isYearAlreadyRegistered(payer)) {
            Payers.insert({
                payer: payer,
            });
        }
    },
    'payers.remove'(payer) {
        checkStringNotEmpty(payer);

        if (!isYearPresentInPayments(payer)) {
            Payers.remove({payer: payer});
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

function isYearAlreadyRegistered(payer) {
    return Payers.find({payer: payer}).count() > 0;
}

function isYearPresentInPayments(payer) {
    return Payments.find({payer: payer}).count() > 0;
}

