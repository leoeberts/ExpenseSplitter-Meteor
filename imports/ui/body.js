import {Template} from 'meteor/templating';
import {ReactiveDict} from 'meteor/reactive-dict';

import {Payments} from "../api/payments.js";
import {Years} from "../api/years.js";

import './body.html';
import './payment.js';

Template.body.onCreated(function bodyOnCreated() {
    this.state = new ReactiveDict();
    Meteor.subscribe('payments');
    Meteor.subscribe('uniqueYears');
});

Template.body.helpers({
    payments() {
        let yearToShow = Template.instance().state.get('yearToShow');
        if (yearToShow > 0) {
            return Payments.find({year: yearToShow}, {sort: {createdAt: 1}});
        }

        if (Meteor.userId()) {
            return Payments.find({year: new Date().getFullYear().toString()}, {sort: {createdAt: 1}});
        } else {
            return Payments.find({year: new Date().getFullYear().toString()}, {sort: {createdAt: 1}});
        }
    },
    uniqueYears() {
        return Years.find({}, {sort: {year: 1}});
    },
});

Template.body.events({
    'submit .new-payment'(event) {
        event.preventDefault();

        const target = event.target;
        Meteor.call('payments.insert',
            target.year.value,
            target.month.value,
            target.payer.value,
            target.category.value,
            target.amount.value);

        target.year.value = '';
        target.month.value = '';
        target.payer.value = '';
        target.category.value = '';
        target.amount.value = '';
    },
    'change .show-year input'(event, instance) {
        instance.state.set('yearToShow', event.target.id);
    },
});
