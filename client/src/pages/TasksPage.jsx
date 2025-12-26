import { useEffect } from "react";
import {useTasks} from "../components/useTasks"
import TaskCard from '../components/TaskCard'


function TasksPage() {
    const {getTasks, tasks} = useTasks();

    useEffect(() => {
        getTasks()
    }, [getTasks]);
    if (tasks.length === 0) return (<h1>No hay tareas</h1>)
    return <div className="grid grid-cols-4 gap-6">
        {
            tasks.map(task =>(
                <TaskCard task={task} key={task._id}/>
            ))
        }
    </div>
        
}

export default TasksPage