import React, { Component } from 'react'
import ReactDom from 'react-dom';
import { withTracker } from 'meteor/react-meteor-data';
import Task from './Task.js';
import { Tasks } from '../api/tasks.js';
import { Meteor } from 'meteor/meteor';
import AccountsUIWrapper from './AccountsUIWrapper.js';

class App extends Component {
    constructor(props) {
        super(props);
        // State
        this.state = {
            hideCompleted: false,
        }
    }

    toggleHideCompleted() {
        this.setState({
            hideCompleted: !this.state.hideCompleted
        });
    }


    handleSubmit(event) {
        event.preventDefault();
        // find the text field via React ref:
        const text = ReactDom.findDOMNode(this.refs.textInput).value.trim();
        Meteor.call('tasks.insert', text);

        ReactDom.findDOMNode(this.refs.textInput).value = '';
    }
    renderTasks() {
        let filteredTasks = this.props.tasks;
        if (this.state.hideCompleted) {
            filteredTasks = filteredTasks.filter(task => !task.checked);
        }
        return filteredTasks.map((task) => {
            const currentUserId = this.props.currentUser && this.props.currentUser._id;
            const showPrivateButton = task.owner === currentUserId
            return (
                <Task key={task._id} task={task} showPrivateButton={showPrivateButton} />
            )
        });
    }
    render() {
        return (
            <div className="container">
                <header>
                    <h1>
                        Todo List ({this.props.incompleteCount})
                    </h1>
                    <label className="hide-completed">
                        <input type="checkbox" readOnly checked={this.state.hideCompleted}
                            onClick={this.toggleHideCompleted.bind(this)}
                        />
                        Hide completed Tasks
                    </label>
                    <AccountsUIWrapper />
                    {this.props.currentUser ?
                        <form className='new-task' onSubmit={this.handleSubmit.bind(this)}>
                            <input
                                type="text"
                                ref="textInput"
                                placeholder="Add new task to the list"
                            />

                        </form> : ''
                    }
                </header>
                <ul>
                    {this.renderTasks()}
                </ul>
            </div>
        )
    }
}

export default withTracker(() => {
    Meteor.subscribe('tasks');
    return {
        tasks: Tasks.find({}, { sort: { createdAt: -1 } }).fetch(),
        incompleteCount: Tasks.find({ checked: { $ne: true } }).count(),
        currentUser: Meteor.user(),
    };
})(App);