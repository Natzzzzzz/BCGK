import axios from "../axios";

const handleLoginApi = (email, password) => {
    return axios.post('/api/v1/login', { email, password });
}

const handleRegister = (user) => {
    return axios.post('/api/v1/app_users', {
        username: user.username,
        email: user.email,
        password: user.password
    })
}

export {
    handleLoginApi,
    handleRegister
}