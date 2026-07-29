import { useNavigate } from 'react-router-dom'

function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center text-center px-4">
      <p className="text-9xl font-bold text-orange-500">404</p>
      <h2 className="text-2xl font-bold text-gray-800 mt-4 mb-2">
        Trang không tồn tại!
      </h2>
      <p className="text-gray-500 mb-8">
        Trang bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
      </p>
      <button
        onClick={() => navigate('/')}
        className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition font-semibold"
      >
        Về trang chủ
      </button>
    </div>
  )
}

export default NotFound