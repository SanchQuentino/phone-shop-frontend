import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../services/api'

function ManageProducts() {
  const [sanPham, setSanPham] = useState([])
  const [loi, setLoi] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    api.get('/api/products')
      .then(res => setSanPham(res.data.data))
      .catch(err => {
        if (err.response?.status === 403) {
          navigate('/') 
        } else {
          setLoi('Không thể tải sản phẩm!')
        }
      })
  }, [])

  const xoaSanPham = async (id) => {
    if (!window.confirm('Xác nhận xoá sản phẩm này?')) return
    try {
      await api.delete(`/api/admin/products/${id}`)
      setSanPham(sanPham.filter(sp => sp.product_id !== id))
    } catch (err) {
      setLoi('Không thể xoá sản phẩm!')
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">🛠️ Quản lý sản phẩm</h2>
        <button
          onClick={() => navigate('/admin/products/add')}
          className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition font-semibold"
        >
          + Thêm sản phẩm
        </button>
      </div>

      {loi && <p className="text-red-500 mb-4">{loi}</p>}

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-orange-500 text-white">
            <tr>
              <th className="px-4 py-3 text-left">ID</th>
              <th className="px-4 py-3 text-left">Tên sản phẩm</th>
              <th className="px-4 py-3 text-left">Giá bán</th>
              <th className="px-4 py-3 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {sanPham.map((sp, index) => (
              <tr key={sp.product_id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                <td className="px-4 py-3 text-gray-600">{sp.product_id}</td>
                <td className="px-4 py-3 font-medium text-gray-800">{sp.product_name}</td>
                <td className="px-4 py-3 text-orange-500 font-semibold">
                  {Number(sp.min_sale_price).toLocaleString('vi-VN')} đ
                </td>
                <td className="px-4 py-3 text-center flex gap-2 justify-center">
                  <button
                    onClick={() => navigate(`/admin/products/edit/${sp.product_id}`)}
                    className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition text-sm"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => xoaSanPham(sp.product_id)}
                    className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition text-sm"
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ManageProducts