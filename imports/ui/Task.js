import React, { Component } from 'react';
import { Tasks } from '../api/tasks';
import { Meteor } from 'meteor/meteor';

export default class Task extends Component {
    toggleChecked() {
        Meteor.call('tasks.setChecked', this.props.task._id, !this.props.task.checked);
    }
    deleteTask() {
        Meteor.call('tasks.remove', this.props.task._id);
    }

    togglePrivateButton() {
        Meteor.call('tasks.setPrivate', this.props.task._id, !this.props.task.private);
    }


    render() {
        const taskClassName = this.props.task.checked ? 'checked' : '';
        return (
            <li className={taskClassName}>
                <button className="delete" onClick={this.deleteTask.bind(this)}>
                    &times;
                </button>
                <input
                    type='checkbox'
                    readOnly
                    checked={!!this.props.task.checked}
                    onClick={this.toggleChecked.bind(this)}
                />
                {this.props.showPrivateButton ?
                    <button className='toggle-private' onClick={this.togglePrivateButton.bind(this)} >
                        {this.props.task.private ? 'private' : 'Public'}
                    </button> : ''
                }
                <span className="text">
                    <strong> {this.props.task.username} </strong> :
                    {this.props.task.text}
                </span>

            </li>
        );
    }
}