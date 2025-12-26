import {useForm} from 'react-hook-form'
import { useTasks } from '../components/useTasks';
import {useNavigate, useParams} from "react-router-dom";
import { useEffect } from 'react';


function TaskFormPage() {
    const {register, handleSubmit, setValue, } = useForm();
    const {createTask, getTask, updateTask} = useTasks();
    const navigate = useNavigate();
    const params = useParams();

    function formatDateForInput(isoString) {
     if (!isoString) return "";
        const date = new Date(isoString);
        return date.toISOString().split("T")[0];
    }

    useEffect(() =>{
        async function loadTask(){
            if (params.id) {
           const task = await getTask(params.id);
           setValue('title', task.title);
           setValue('description', task.description)
           setValue('date', formatDateForInput(task.date));
        }
        }
        loadTask()
    }, [getTask, params.id, setValue])
    

    const onSubmit = handleSubmit((data) => {
        if (params.id) {
        updateTask(params.id, data);
         } else {
         createTask(data);
         }
         navigate("/tasks");
        });

    return (
     <div className="flex h-[calc(100vh-100px)] items-center justify-center">

        <form onSubmit={onSubmit}>
         <label htmlFor='title'>Titulo</label>
         <input type="text" placeholder="Title" {...register("title")} className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2" autoFocus />
         <label htmlFor='descripcion'>Descripcion</label>
         <textarea rows="3" placeholder="Description" {...register("description")} className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"></textarea>
         <div className="flex items-center justify-between gap-4 mt-2">
            <button 
                type="submit"
                className="bg-sky-600 text-white px-4 py-2 rounded-md hover:bg-sky-700 mt-2">
             Guardar
            </button>

            {/* Contenedor label + input en la misma línea */}
             <div className="flex items-center gap-2">
                <label htmlFor='date'>Fecha</label>
                <input 
                type="date" 
                {...register("date")}
                 className="bg-zinc-700 text-white px-5 py-2 rounded-md"
             />
            </div>
        </div>
        </form>
     </div>
    )
}

export default TaskFormPage