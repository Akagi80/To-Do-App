import React from 'react';
import io from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';

class App extends React.Component {

  state = {
    tasks: [],
    taskName: '',
  };

  componentDidMount() {
     // inicjacja socketu serwera na porcie lockalhost:8000, konieczna gdy klient odpalany jest innym porcie (lockalhost:3000),
     this.socket = io.connect('http://localhost:8000/');
     this.socket.on('addTask', (task) => this.addTask(task));
     this.socket.on('removeTask', (id) => this.removeTask(id));
     this.socket.on('updateData', (data) => this.updateTasks(data));
  };

  removeTask = (id, local) => {
    this.setState({ tasks: this.state.tasks.filter(task => task.id !== id) });
    if (local) this.socket.emit('removeTask', id);
  };

  submitForm = (event) => {
    event.preventDefault();
    const addNewTask = {id: uuidv4(), name: this.state.taskName};
    this.addTask(addNewTask);
    this.socket.emit('addTask', addNewTask);
    this.setState({taskName: ''});
  };

  addTask = (task) =>{
    this.setState({tasks: [...this.state.tasks, task]});
  };

  updateTasks = (data) => {
    this.setState({tasks: data});
  };

  render() {
    const {tasks, taskName} = this.state;

    return (
      <div className="App">
    
        <header>
          <h1>ToDoList.app</h1>
        </header>
    
        <section className="tasks-section" id="tasks-section">
          <h2>Tasks</h2>
    
          <ul className="tasks-section__list" id="tasks-list">
            {tasks.map(task => (
              <li key={task.id} className='task'>
                {task.name}
                <button className="btn btn--red" onClick={() => this.removeTask(task.id, true)}>Remove</button>
              </li>
            ))}
          </ul>
    
          <form 
            id="add-task-form"
            onSubmit={event => this.submitForm(event)}
            >
            <input 
              className="text-input" 
              autocomplete="off" 
              type="text" 
              placeholder="Type your description" 
              id="task-name" 
              value={taskName}
              onChange={event => this.setState({ taskName: event.target.value })}
              />
            <button className="btn" type="submit">Add</button>
          </form>
    
        </section>
      </div>
    );
  };

};

export default App;
