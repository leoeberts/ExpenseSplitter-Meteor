import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';
import {check} from 'meteor/check';
import {Payments} from "./payments.js";

export const Years = new Mongo.Collection('years');

if (Meteor.isServer) {
    Meteor.publish('uniqueYears', function uniqueYearsPublication() {
        return Years.find({});
    });
}

Meteor.methods({
    'years.insert'(year) {
        checkUserLoggedIn(this.userId);
        //TODO: validade year
        checkStringNotEmpty(year);

        if (!isYearAlreadyRegistered(year)) {
            Years.insert({
                year: year,
            });
        }
    },
    'years.remove'(year) {
        check(year, String);

        if (!isYearPresentInPayments(year)) {
            Years.remove({year: year});
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

function isYearAlreadyRegistered(year) {
    return Years.find({year: year}).count() > 0;
}

function isYearPresentInPayments(year) {
    return Payments.find({year: year}).count() > 0;
}

