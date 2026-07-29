import { useState } from 'react'
import api from '../services/api'
function Register(){
    const [form, setForm]= useState({full_name: '', username: '', email: '',password:'',phone:''})
    const [thongBao, setThongBao] = useState('')
    const [loi,setLoi] = useState('')

    const handleChange = (e) => {
        setForm({...form, [e.target.name]:e.target.value})
    }
    const handleSubmit = async (e) => {
            e.preventDefault()
            setLoi('')
            setThongBao('')
            if (!form.password || form.password.length < 10) {
            setLoi('Mật khẩu phải chứa ít nhất 10 ký tự!');
            return;
        }
            try {
                const res = await api.post('/api/auth/register', form)
                if (res.data.success){
                    setThongBao(res.data.message)
                }
            } catch (err) {
                setLoi(err.response?.data?.message || 'Lỗi kết nối server!')
            }
        }
    return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-orange-500 mb-6">Đăng ký</h2>
        {thongBao && <p className="text-green-500 text-center mb-4">{thongBao}</p>}
        {loi && <p className="text-red-500 text-center mb-4">{loi}</p>}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
            type="text"
            name="full_name"
            placeholder="Họ tên"
            value={form.full_name}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-orange-500"
            />
            <input
            type="text"
            name="username"
            placeholder="Tên đăng nhập"
            value={form.username}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-orange-500"
            />
            <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
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
            <input
            type="text"
            name="phone"
            placeholder="Số điện thoại (tuỳ chọn)"
            value={form.phone}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-orange-500"
            />
            <button
            type="submit"
            className="bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition font-semibold"
            >
            Đăng ký
            </button>
        </form>
        <p className="text-center mt-4 text-gray-600">
            Đã có tài khoản?{' '}
            <a href="/login" className="text-orange-500 font-semibold hover:underline">
            Đăng nhập
            </a>
        </p>
        </div>
    </div>
    )
}
export default Register