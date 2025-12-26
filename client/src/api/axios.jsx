import axios from 'axios'

// Conexion con el backend 
const instance = axios.create({
    baseURL: 'http://localhost:4000/api',
    withCredentials: true,
    
})

export default instance