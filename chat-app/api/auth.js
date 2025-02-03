import axios from 'axios';

const API_URL = "http://localhost:3000";

// To sign user
export const signup = async (email, password) => {
    try{

        const res = await axios.post(`${API_URL}/signup`, { email, password });
        return res.data;
    } catch(err){
        console.log(err);
    }
};

// To login user
export const login = async (email, password) => {
    const res = await axios.post(`${API_URL}/login`, { email, password});
    return res.data;
};