import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';
import {check} from 'meteor/check';
import {Payments} from "./payments.js";

export const Months = new Mongo.Collection('months');

if (Meteor.isServer) {
    Meteor.publish('uniqueMonths', function uniqueMonthsPublication() {
        return Months.find({});
    });
}

Meteor.methods({
    'months.insert'(year, month) {
        checkUserLoggedIn(this.userId);
        //TODO: validade year
        checkStringNotEmpty(year);
        checkStringNotEmpty(month);

        if (!isYearAlreadyRegistered(year, month)) {
            Months.insert({
                year: year,
                month: month,
            });
        }
    },
    'months.remove'(year, month) {
        checkStringNotEmpty(year);
        checkStringNotEmpty(month);

        if (!isYearPresentInPayments(year, month)) {
            Months.remove({year: year, month: month});
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

function isYearAlreadyRegistered(year, month) {
    return Months.find({year: year, month: month}).count() > 0;
}

function isYearPresentInPayments(year, month) {
    return Payments.find({year: year, month: month}).count() > 0;
}

