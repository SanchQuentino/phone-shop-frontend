import axios from "axios";
const api = axios.create({
    baseURL: 'https://web-ban-dien-thoai-production.up.railway.app',
    withCredentials:true,
})
export default api