import React, { useEffect, useState } from "react";

const List = () => {
    const [newTask, setNewTask] = useState('');
    const [tasks, setTasks] = useState([]);

    // 1. hacer el GET para obtener la informacion del API con el useEffect
    useEffect(() => {
        fetch("https://playground.4geeks.com/todo/users/josedu")
            .then(response => response.json())
            .then(data => setTasks(data.todos))
            .catch(error => console.error('Error fetching tasks:', error));
    }, []);

    // 2. hacer un POST para crear nuevas tareas
    const addTask = (e) => {
        if (e.key === 'Enter' && newTask.trim()) {
            const taskToAdd = { label: newTask };

            fetch("https://playground.4geeks.com/todo/todos/josedu", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(taskToAdd),
            })
            .then(response => response.json())
            .then(data => {
                console.log('Task added:', data); // Es para verificar que la tarea se esta creando con los datos correctos
                if (data && data.id) {
                    setTasks([...tasks, data]);
                    setNewTask(''); 
                } else {
                    console.error('Unexpected response format:', data);
                }
            })
            .catch(error => console.error('Error adding task:', error));
        }
    };

    // 3. hacer un DELETE para eliminar la tarea una a una
    const deleteTask = (indexToDelete) => {
        const taskToDelete = tasks[indexToDelete];
        if (taskToDelete && taskToDelete.id) {
            fetch(`https://playground.4geeks.com/todo/todos/${taskToDelete.id}`, {
                method: 'DELETE',
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.text();
            })
            .then(() => {
                const updatedTasks = tasks.filter((_, index) => index !== indexToDelete);
                setTasks(updatedTasks);
            })
            .catch(error => console.error('Error deleting task:', error));
        } else {
            console.error('Task does not have an id:', taskToDelete);
        }
    };

    // 4. eliminar todas las tareas
    const deleteAllTasks = () => {
        tasks.forEach(task => {
            fetch(`https://playground.4geeks.com/todo/todos/${task.id}`, {
                method: 'DELETE',
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.text();
            })
            .catch(error => console.error('Error deleting task:', error));
        });

        setTasks([]);
    };

    return (
        <div className="Container">
            <h1 className="display-1 text-secondary text-center">todos</h1>
            <div className="row justify-content-center">
                <div className="col-6 card">
                    <input className="form-control"
                        value={newTask}
                        onChange={(e) => { setNewTask(e.target.value) }}
                        onKeyPress={addTask}
                        type="text"
                        placeholder="Nueva Tarea"
                        aria-label="default input example">
                    </input>
                    {tasks.length === 0 ? (
                        <p className="empty-list-message form-text fw-light">No hay tareas, añadir tareas</p>
                    ) : (
                        <>
                            <ul className="task-list list-group list-group-flush">
                                {tasks.map((task, index) => (
                                    <li className="task-item list-group-item" key={task.id}>
                                        {task.label}
                                        <button className="delete-btn" onClick={() => deleteTask(index)}>
                                            X
                                        </button>
                                    </li>
                                ))}
                            </ul>
                            <p className="tareasPendientes form-text fw-light">Tareas pendientes: {tasks.length}</p>
                        </>
                    )}
                    <button className="botonTareas btn btn-outline-secondary mb-2" onClick={deleteAllTasks}>
                        Eliminar Todas Las Tareas
                    </button>
                </div>
            </div>
        </div>
    );
};

export default List;
