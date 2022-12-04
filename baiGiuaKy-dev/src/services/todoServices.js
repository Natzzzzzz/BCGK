import axios from "../axios";

const getAllTodo = (app_user_id) => {
    return axios.get(`/api/v1/todo?app_user_id=${app_user_id}`);
}

const addTodo = (todo) => {
    return axios.post('/api/v1/todo', todo);
}

const editTodo = (id, todo) => {
    return axios.put(`/api/v1/todo/${id}`, todo);
}

const deleteTodo = (id) => {
    return axios.delete(`/api/v1/todo/${id}`);
}

export {
    getAllTodo,
    addTodo,
    editTodo,
    deleteTodo
}
