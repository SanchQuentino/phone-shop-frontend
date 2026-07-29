import { useState } from 'react'
import { useNavigate} from 'react-router-dom'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'
function Login(){
    const [form,setForm] = useState({username:'', password:''})
    const [loi,setLoi] =useState('')
    const navigate = useNavigate()
    const { login } = useAuth()
    const handleChange = (e) => {
        setForm({...form,[e.target.name]:e.target.value})
    }
    const handleSubmit = async (e) => {
    e.preventDefault()
    setLoi('')
    try {
        const res = await api.post('/api/auth/login', form)
        if (res.data.success) {
        login(res.data.user) // user có: userId, username, role, fullName
        navigate('/')
        }
    } catch (err) {
        setLoi(err.response?.data?.message || 'Lỗi kết nối server!')
    }
    }
    return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-orange-500 mb-6">Đăng nhập</h2>
        {loi && <p className="text-red-500 text-center mb-4">{loi}</p>}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
            type="text"
            name="username"
            placeholder="Tên đăng nhập"
            value={form.username}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-orange-500"
            />
            <input
            type="password"
            name="password"
            placeholder="Mật khẩu"
            value={form.password}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-orange-500"
            />
            <button
            type="submit"
            className="bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition font-semibold"
            >
            Đăng nhập
            </button>
        </form>
        <p className="text-center mt-4 text-gray-600">
            Chưa có tài khoản?{' '}
            <a href="/register" className="text-orange-500 font-semibold hover:underline">
            Đăng ký
            </a>
        </p>
        </div>
    </div>
    )
}
export default Login