import {Template} from 'meteor/templating';
import {ReactiveDict} from 'meteor/reactive-dict';

import {Payments} from "../api/payments.js";

import './body.html';
import './payment.js';

Template.body.onCreated(function bodyOnCreated() {
    this.state = new ReactiveDict();
    Meteor.subscribe('payments');
});

Template.body.helpers({
    payments() {
        if (Template.instance().state.get('showPrivatePayments')) {
            return Payments.find({privatePayment: true}, {sort: {createdAt: 1}});
        }

        if (Meteor.userId()) {
            return Payments.find({}, {sort: {createdAt: 1}});
        } else {
            return Payments.find({}, {sort: {createdAt: 1}});
        }
    },
});

Template.body.events({
    'submit .new-payment'(event) {
        event.preventDefault();

        const target = event.target;
        Meteor.call('payments.insert',
            target.month.value,
            target.payer.value,
            target.category.value,
            target.amount.value);

        target.month.value = '';
        target.payer.value = '';
        target.category.value = '';
        target.amount.value = '';
    },
});
