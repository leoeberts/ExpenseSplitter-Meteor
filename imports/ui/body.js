import {Template} from 'meteor/templating';
import {ReactiveDict} from 'meteor/reactive-dict';

import {Payments} from "../api/payments.js";
import {Years} from "../api/years.js";
import {Months} from "../api/months.js";

import './body.html';
import './payment.js';

Template.body.onCreated(function bodyOnCreated() {
    this.state = new ReactiveDict();
    Meteor.subscribe('settings');
    Meteor.subscribe('payments');
    Meteor.subscribe('payers');
    Meteor.subscribe('categories');
    Meteor.subscribe('uniqueYears');
    Meteor.subscribe('uniqueMonths');
    Meteor.subscribe('amountPayedPerMonth');
});

Template.body.helpers({
    payments() {
        let yearToShow = Template.instance().state.get('yearToShow');
        let monthToShow = Template.instance().state.get('monthToShow');
        if (monthToShow && monthToShow.length > 0) {
            return Payments.find({year: yearToShow, month: monthToShow}, {sort: {createdAt: 1}});
        }

        if (yearToShow > 0) {
            return Payments.find({year: yearToShow}, {sort: {createdAt: 1}});
        }

        if (Meteor.userId()) {
            return Payments.find({year: new Date().getFullYear().toString()}, {sort: {createdAt: 1}});
        } else {
            return Payments.find({year: new Date().getFullYear().toString()}, {sort: {createdAt: 1}});
        }
    },
    amountPayedPerMonth() {
        let yearToShow = Template.instance().state.get('yearToShow');
        let monthToShow = Template.instance().state.get('monthToShow');
        if (monthToShow && monthToShow.length > 0) {
            return Payments.find({year: yearToShow, month: monthToShow}, {sort: {createdAt: 1}});
        }
        return Payments.find({year: yearToShow}, {sort: {createdAt: 1}});
    },
    uniqueYears() {
        return Years.find({}, {sort: {year: -1}});
    },
    uniqueMonths() {
        let yearToShow = Template.instance().state.get('yearToShow');
        return Months.find({year: yearToShow}, {sort: {year: 1}});
    },
    actualYear() {
        return getActualYear();
    },
    actualMonth() {
        return getActualMonth();
    }
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
            Number(target.amount.value));

        target.payer.value = '';
        target.category.value = '';
        target.amount.value = '';

        //TODO: Focus from amount to payer by JS?
        /*Template.yourTemplate.rendered = function(){
            var input = this.find('#payer');
            if(input){
                input.focus();
            }
        }*/
    },
    'change #year-filter'(event, instance) {
        instance.state.set('yearToShow', event.target.value);
    },
    'change #month-filter'(event, instance) {
        instance.state.set('monthToShow', event.target.value);
    },
});

function getActualYear() {
    return new Date().getFullYear();
}

function getActualMonth() {
    let month = new Date().toLocaleString("pt-br", {month: "long"});
    //TODO: Underscore not working (_.capitalize)
    return month.charAt(0).toUpperCase() + month.slice(1);
}