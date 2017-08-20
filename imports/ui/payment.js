import {Template} from 'meteor/templating';
import {Meteor} from 'meteor/meteor';

import {Payers} from "../api/payers.js";
import {Categories} from "../api/category.js";

import './payment.html';

Template.payerInput.helpers({
    settings: function () {
        return {
            position: "top",
            limit: 10,
            rules: [
                {
                    // token: '',
                    collection: Payers,
                    field: 'payer',
                    matchAll: true,
                    template: Template.standardPayers,
                }
            ]
        };
    },
    standardPayers() {
        return Payers.find({});
    }
});

Template.categoryInput.helpers({
    settings: function () {
        return {
            position: "top",
            limit: 10,
            rules: [
                {
                    // token: '',
                    collection: Categories,
                    field: 'category',
                    matchAll: true,
                    template: Template.uniqueCategories,
                }
            ]
        };
    },
    uniqueCategories() {
        return Categories.find({});
    }
});


Template.payment.events({
    'click .delete'() {
        Meteor.call('payments.remove', this._id);
    },
});

