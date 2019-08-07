import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import Task from '../ui/Task';

export const Tasks = new Mongo.Collection('tasks');

if (Meteor.isServer) {
    Meteor.publish('tasks', function taskPublication() {
        return Tasks.find();
    });
}

Meteor.methods({
    'tasks.insert'(text) {
        check(text, String);

        if (!this.userId) throw new Meteor.Error('NOT AUTHORIZED');
        Tasks.insert(
            {
                text,
                createdAt: new Date(),
                owner: this.userId,
                username: Meteor.users.findOne(this.userId).username,
            }
        );
    },

    'tasks.remove'(taskId) {
        check(taskId, String);

        const task = Tasks.findOne(taskId);

        console.log('TASK', task);

        if (task.owner !== this.userId) {
            throw new Meteor.Error('ACCESS DENIED');
        }

        Tasks.remove(taskId);
    },
    'tasks.setChecked'(taskId, setChecked) {
        check(taskId, String);
        check(setChecked, Boolean);

        const task = Tasks.findOne(taskId);

        console.log('TASK', task);

        if (task.owner !== this.userId) {
            throw new Meteor.Error('ACCESS DENIED');
        }

        Tasks.update(taskId, { $set: { checked: setChecked } });
    },

    'tasks.setPrivate'(taskId, setToPrivate) {
        check(taskId, String);
        check(setToPrivate, Boolean);

        const task = Tasks.findOne(taskId);

        console.log('TASK', task);

        if (task.owner !== this.userId) {
            throw new Meteor.Error('ACCESS DENIED');
        }
        Tasks.update(taskId, { $set: { private: setToPrivate } })
    }
});