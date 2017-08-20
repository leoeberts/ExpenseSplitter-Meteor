import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';
import {check} from 'meteor/check';
import {Payments} from "./payments.js";

export const Categories = new Mongo.Collection('categories');

if (Meteor.isServer) {
    Meteor.publish('categories', function categoriesPublication() {
        return Categories.find({});
    });
}

Meteor.methods({
    'categories.insert'(category) {
        checkUserLoggedIn(this.userId);
        checkStringNotEmpty(category);

        if (!isCategoryAlreadyRegistered(category)) {
            Categories.insert({
                category: category,
            });
        }
    },
    'categories.remove'(category) {
        checkStringNotEmpty(category);

        if (!isCategoryPresentInPayments(category)) {
            Categories.remove({category: category});
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

function isCategoryAlreadyRegistered(category) {
    return Categories.find({category: category}).count() > 0;
}

function isCategoryPresentInPayments(category) {
    return Payments.find({category: category}).count() > 0;
}

