import { createContext, useState } from "react"
import { createTaskRequest, getTasksRequest, deleteTaskRequest, getTaskRequest, updateTaskRequest } from '../api/tasks'

const TaskContext = createContext();

export function TaskProvider({ children }) {
    const [tasks, setTasks] = useState([]);

    const getTasks = async () => {
      try {
        const res = await getTasksRequest();
        setTasks(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    const createTask = async (task) => {
      try{
        const res = await createTaskRequest(task)
        console.log(res)
      } catch(error) {
        console.log(error)
      }
    }

    const deleteTask = async (id) => {
      try{
        const res = await deleteTaskRequest(id);
        if (res.status == 204) setTasks(tasks.filter((task) => task._id != id))
      } catch (error) {
        console.log(error)
      }
      
    }

    const getTask = async (id) => {
      try {
        const res = await getTaskRequest(id);
        return res.data;
      } catch (error) {
        console.log(error)
      }
    }

    const updateTask = async (id, task) => {
      try {
        await updateTaskRequest(id, task);
      } catch (error) {
        console.error(error);
      }
    }
    return (
        <TaskContext.Provider 
          value={{
            tasks, 
            createTask,
            getTasks,
            deleteTask,
            getTask,
            updateTask
          }}>
            {children}
        </TaskContext.Provider>
    );
}
export default TaskContext;