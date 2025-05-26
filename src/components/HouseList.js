import React, { useEffect, useState } from "react";
import axios from "../axiosConfig"; // Cấu hình axios để gọi API
import { toast, ToastContainer } from "react-toastify";
import { Link } from "react-router-dom"; // Import Link if you need navigation

const RoomList = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get("/rooms/all");
        setRooms(response.data);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          toast.error(
            error.response.data.message || "Không tìm thấy phòng nào."
          );
          setError("Không tìm thấy phòng nào.");
          setRooms([]); // Set rooms to empty array if no rooms found
        } else {
          console.error("Error fetching rooms:", error);
          toast.error("Lỗi khi lấy danh sách phòng.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-8 text-xl text-blue-500">Đang tải...</div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Danh sách phòng</h1>
      <ToastContainer />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {error && rooms.length === 0 && (
          <div className="text-center text-red-500">{error}</div>
        )}
        {rooms.map((room) => (
          <div
            key={room._id}
            className="bg-white shadow-lg rounded-lg overflow-hidden transform transition-transform hover:scale-105 hover:shadow-2xl"
          >
            <Link to={`/house-list/${room._id}`}>
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2 text-gray-800">
                  {room.name}
                </h2>
                <p className="text-gray-700 mb-2">Giá: {room.price} VND</p>
                <div className="flex">
                  <span>Trạng thái: </span> &nbsp;
                  <p
                    className={`text-gray-700 mb-2 ${
                      room.status ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {room.status ? "Còn trống" : "Đã thuê"}
                  </p>
                </div>
                <p className="text-gray-700 mb-2">
                  Số lượng còn lại: {room.room_quantity}
                </p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoomList;
