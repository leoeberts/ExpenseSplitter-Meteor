import {Template} from 'meteor/templating';
import {Meteor} from 'meteor/meteor';

import './payment.html';

Template.paymentThumb.events({
    'click .delete'() {
        Meteor.call('payments.remove', this._id);
    },
});

