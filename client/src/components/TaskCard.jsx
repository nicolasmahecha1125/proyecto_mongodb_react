import  {useTasks}  from '../components/useTasks';
import {Link} from 'react-router-dom';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc)

function TaskCard({task}) {
    const { deleteTask } = useTasks();
    return (
        <div className="bg-zinc-900 max-w-md w-full p-5 rounded-md mt-5">
            <h1 className="text-2xl font-bold">{task.title}</h1>
            <p className="text-slate-300">{task.description}</p>
            <p>{dayjs(task.date).utc().format('DD/MM/YYYY')}</p>
            <div className="mt-2">
                <button className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg shadow-md transition-all mr-5" onClick={() => {
                    deleteTask(task._id)
                }}>
                    Borrar
                </button>
                <button className="bg-sky-600 hover:bg-sky-700 text-white px-3 py-1 rounded-lg shadow-md transition-all">
                     <Link to={`/tasks/${task._id}`}>Editar</Link>
                </button>
            </div>
        </div>
    )
}
export default TaskCard