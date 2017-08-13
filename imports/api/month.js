import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';
import {check} from 'meteor/check';
import {Payments} from "./payments.js";

export const Month = new Mongo.Collection('month');

if (Meteor.isServer) {
    Meteor.publish('uniqueMonths', function uniqueMonthsPublication() {
        return Month.find({});
    });
}

Meteor.methods({
    'month.insert'(year, month) {
        checkUserLoggedIn(this.userId);
        //TODO: validade year
        checkStringNotEmpty(year);
        checkStringNotEmpty(month);

        if (!isYearAlreadyRegistered(year, month)) {
            Month.insert({
                year: year,
                month: month,
            });
        }
    },
    'month.remove'(year, month) {
        checkStringNotEmpty(year);
        checkStringNotEmpty(month);

        if (!isYearPresentInPayments(year, month)) {
            Month.remove({year: year, month: month});
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
    return Month.find({year: year, month: month}).count() > 0;
}

function isYearPresentInPayments(year, month) {
    return Payments.find({year: year, month: month}).count() > 0;
}

