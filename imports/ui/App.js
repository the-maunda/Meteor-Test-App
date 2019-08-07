import React, { Component } from 'react'
import ReactDom from 'react-dom';
import { withTracker } from 'meteor/react-meteor-data';
import Task from './Task.js';
import { Tasks } from '../api/tasks.js';

class App extends Component {
    handleSubmit(event) {
        event.preventDefault();
        // find the text field via React ref:
        const text = ReactDom.findDOMNode(this.refs.textInput).value.trim();
        Tasks.insert({
            text,
            createdAt: new Date()
        });

        ReactDom.findDOMNode(this.refs.textInput).value = '';
    }
    renderTasks() {
        return this.props.tasks.map((task) => (
            <Task key={task._id} task={task} />
        ));
    }
    render() {
        return (
            <div className="container">
                <header>
                    <h1>
                        Todo List
                    </h1>
                    <form className='new-task' onSubmit={this.handleSubmit.bind(this)}>
                        <input
                            type="text"
                            ref="textInput"
                            placeholder="Add new task to the list"
                        />

                    </form>
                </header>
                <ul>
                    {this.renderTasks()}
                </ul>
            </div>
        )
    }
}

export default withTracker(() => {
    return {
        tasks: Tasks.find({}, { sort: { createdAt: -1 } }).fetch(),
    };
})(App);