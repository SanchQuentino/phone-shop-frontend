import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../services/api'
import ManageAttributesModal from './ManageAttributesModal'
import ManageOrdersModal from './ManageOrdersModal'
import ManageReturnsModal from './ManageReturnsModal'

function ManageProducts() {
  const [sanPham, setSanPham] = useState([])
  const [loading, setLoading] = useState(true)
  const [loi, setLoi] = useState('')
  const [thongBao, setThongBao] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 18

  const [isAttributeModalOpen, setIsAttributeModalOpen] = useState(false)
  const [isOrdersModalOpen, setIsOrdersModalOpen] = useState(false)
  const [isReturnsModalOpen, setIsReturnsModalOpen] = useState(false)

  const navigate = useNavigate()

  const getImageUrl = (path) => {
    if (!path) return ''
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path
    }
    const cleanPath = path.replace(/^\/?image\//, '')
    return `https://web-ban-dien-thoai-production.up.railway.app/image/${cleanPath}`
  }

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const res = await api.get('/api/products?limit=1000')
      const listData = Array.isArray(res.data) ? res.data : (res.data.data || [])
      setSanPham(listData)
    } catch (err) {
      setLoi('Không thể tải danh sách sản phẩm!')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const xoaSanPham = async (id) => {
    if (!window.confirm('Xác nhận xoá (ẩn) sản phẩm này?')) return
    try {
      const res = await api.delete(`/api/admin/products/${id}`)
      if (res.data?.success) {
        setThongBao(res.data.message || 'Xóa sản phẩm thành công!')
        setSanPham(prev => prev.filter(sp => sp.product_id !== id))
      }
    } catch (err) {
      setLoi(err.response?.data?.message || 'Không thể xoá sản phẩm!')
    }
  }

  const totalPages = Math.ceil(sanPham.length / itemsPerPage)
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentProducts = sanPham.slice(indexOfFirstItem, indexOfLastItem)

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">🛠️ Bảng Quản Trị Hệ Thống</h2>
          <p className="text-sm text-gray-500 mt-1">Quản lý sản phẩm, thuộc tính, đơn hàng và các yêu cầu bảo hành</p>
        </div>
        
        <div className="flex flex-wrap gap-2.5">
          <button
            onClick={() => setIsOrdersModalOpen(true)}
            className="bg-blue-600 text-white px-3.5 py-2 rounded-lg hover:bg-blue-700 transition font-medium text-xs shadow flex items-center gap-1.5"
          >
             Đơn hàng
          </button>

          <button
            onClick={() => setIsReturnsModalOpen(true)}
            className="bg-indigo-600 text-white px-3.5 py-2 rounded-lg hover:bg-indigo-700 transition font-medium text-xs shadow flex items-center gap-1.5"
          >
            Đổi trả & Bảo hành
          </button>

          <button
            onClick={() => setIsAttributeModalOpen(true)}
            className="bg-gray-800 text-white px-3.5 py-2 rounded-lg hover:bg-gray-900 transition font-medium text-xs shadow flex items-center gap-1.5"
          >
             Thuộc tính
          </button>

          <button
            onClick={() => navigate('/admin/products/add')}
            className="bg-orange-500 text-white px-3.5 py-2 rounded-lg hover:bg-orange-600 transition font-bold text-xs shadow flex items-center gap-1"
          >
            + Thêm sản phẩm
          </button>
        </div>
      </div>

      {loi && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">{loi}</div>}
      {thongBao && <div className="bg-green-50 text-green-600 p-3 rounded-lg mb-4 text-sm">{thongBao}</div>}

      {/* Product Table */}
      {loading ? (
        <div className="text-center py-10 text-gray-500">Đang tải dữ liệu sản phẩm...</div>
      ) : (
        <>
          <div className="bg-white rounded-xl shadow overflow-hidden border">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-100 border-b border-gray-200 text-gray-700 text-sm">
                <tr>
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Hình ảnh</th>
                  <th className="px-4 py-3">Tên sản phẩm</th>
                  <th className="px-4 py-3">Giá thấp nhất</th>
                  <th className="px-4 py-3 text-center">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-sm">
                {currentProducts.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-8 text-gray-500">Chưa có sản phẩm nào.</td>
                  </tr>
                ) : (
                  currentProducts.map((sp, index) => (
                    <tr key={sp.product_id} className={index % 2 === 0 ? 'bg-gray-50/50' : 'bg-white'}>
                      <td className="px-4 py-3 font-medium text-gray-600">#{sp.product_id}</td>
                      <td className="px-4 py-3">
                        {sp.main_image ? (
                          <img
                            src={getImageUrl(sp.main_image)}
                            alt={sp.product_name}
                            className="w-12 h-12 object-contain rounded border bg-gray-50"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-400">Không ảnh</div>
                        )}
                      </td>
                      <td className="px-4 py-3 font-semibold text-gray-800">{sp.product_name}</td>
                      <td className="px-4 py-3 text-orange-600 font-semibold">
                        {Number(sp.min_sale_price || 0).toLocaleString('vi-VN')} đ
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex gap-2 justify-center">
                          <button onClick={() => navigate(`/admin/products/edit/${sp.product_id}`)} className="bg-blue-500 text-white px-3 py-1.5 rounded text-xs hover:bg-blue-600">Sửa</button>
                          <button onClick={() => xoaSanPham(sp.product_id)} className="bg-red-500 text-white px-3 py-1.5 rounded text-xs hover:bg-red-600">Xóa</button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-4 px-4 py-3 bg-white rounded-xl border shadow-sm">
              <div className="text-xs text-gray-500">
                Hiển thị từ <span className="font-semibold text-gray-700">{indexOfFirstItem + 1}</span> đến <span className="font-semibold text-gray-700">{Math.min(indexOfLastItem, sanPham.length)}</span> trên tổng số <span className="font-semibold text-gray-700">{sanPham.length}</span> sản phẩm
              </div>

              <div className="flex items-center gap-1.5 text-xs">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed font-medium transition"
                >
                  ‹ Trước
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-1.5 rounded-lg border transition font-medium ${
                      currentPage === page
                        ? 'bg-orange-500 text-white border-orange-500 font-bold shadow-sm'
                        : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed font-medium transition"
                >
                  Sau ›
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Modals */}
      <ManageAttributesModal
        isOpen={isAttributeModalOpen}
        onClose={() => setIsAttributeModalOpen(false)}
      />

      <ManageOrdersModal
        isOpen={isOrdersModalOpen}
        onClose={() => setIsOrdersModalOpen(false)}
      />

      <ManageReturnsModal
        isOpen={isReturnsModalOpen}
        onClose={() => setIsReturnsModalOpen(false)}
      />
    </div>
  )
}

export default ManageProducts