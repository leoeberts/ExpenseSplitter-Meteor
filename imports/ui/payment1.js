import {Template} from 'meteor/templating';
import {Meteor} from 'meteor/meteor';

import './payment1.html';

Template.payments.events({
    'click .delete'() {
        Meteor.call('payments.remove', this._id);
    },
});

