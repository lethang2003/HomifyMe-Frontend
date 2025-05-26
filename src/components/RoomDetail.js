import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "../axiosConfig"; // Sử dụng axios từ config của bạn
import { toast, ToastContainer } from "react-toastify";
import ReactModal from "react-modal";
import {
  FaDollarSign,
  FaBed,
  FaMapMarkerAlt,
  FaInfoCircle,
  FaShoppingCart,
  FaPhoneAlt,
  FaClipboardList,
  FaStar,
} from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import RoomMap from "./RoomMap"; // Import thêm RoomMap component để hiển thị bản đồ
import CommentForm from "./CommentForm";
import { getToken } from "../components/Login/app/static";

// Set app element for modal accessibility
ReactModal.setAppElement("#root");

const RoomDetail = () => {
  const { roomId } = useParams();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showAllImages, setShowAllImages] = useState(false);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const token = getToken();
        const response = await axios.get(`/rooms/${roomId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log(response.data.comments);
        setRoom(response.data);
      } catch (err) {
        setError("Không thể lấy thông tin phòng.");
        toast.error("Không thể lấy thông tin phòng.");
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();
  }, [roomId]);

  const handleCommentAdded = (newRoomData) => {
    console.log(newRoomData);
    setRoom(newRoomData);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-xl text-blue-500">
        Đang tải...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-xl text-red-600">
        Lỗi: {error}
      </div>
    );
  }

  const defaultImages = Array.isArray(room.images)
    ? room.images.filter((image) => image.default)
    : [];
  const nonDefaultImages = Array.isArray(room.images)
    ? room.images.filter((image) => !image.default)
    : [];
  const allImages = [...defaultImages, ...nonDefaultImages];

  const handleImageClick = (index) => {
    setCurrentImageIndex(index);
    setModalIsOpen(true);
    setShowAllImages(false);
  };

  const handleShowAllImages = () => {
    setShowAllImages(true);
    setModalIsOpen(false);
  };

  const handleBackToSingle = () => {
    setShowAllImages(false);
    setModalIsOpen(true);
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex < allImages.length - 1 ? prevIndex + 1 : 0
    );
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : allImages.length - 1
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 relative z-0">
      <ToastContainer className="z-[10001]" />
      {room ? (
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h1 className="uppercase text-3xl font-extrabold mb-4 text-gray-800">
            {room.name}
          </h1>

          {room.address && room.address.length > 0 && (
            <div className="text-gray-700  mb-4 flex">
              <h3 className="text-xl font-semibold flex items-center">
                <FaMapMarkerAlt className="text-red-500 mr-[3px] text-xl" /> Địa
                chỉ:
              </h3>
              {room.address.map((addr, index) => (
                <div className="text-xl ml-2" key={index}>
                  <p>
                    {addr.detail}, {addr.ward}, {addr.district}, {addr.city}
                  </p>
                </div>
              ))}
            </div>
          )}

          <div className="grid grid-cols-3 gap-2 mb-6">
            {/* Hai ảnh lớn bên trái */}
            <div className="col-span-2 flex flex-col gap-2">
              {allImages[0] && (
                <img
                  src={allImages[0].url || "/no-image.png"}
                  alt="Room Image 1"
                  className="object-cover rounded-lg shadow-md cursor-pointer w-full h-[465px]"
                  onClick={() => handleImageClick(0)}
                />
              )}
              {allImages[1] && (
                <img
                  src={allImages[1].url || "/no-image.png"}
                  alt="Room Image 2"
                  className="object-cover rounded-lg shadow-md cursor-pointer w-full h-[465px]"
                  onClick={() => handleImageClick(1)}
                />
              )}
            </div>
            {/* Các ảnh nhỏ bên phải, xếp dọc */}
            <div className="col-span-1 flex flex-col gap-2">
              {/* Ảnh thứ 3 */}
              {allImages[2] && (
                <img
                  src={allImages[2].url || "/no-image.png"}
                  alt="Room Image 3"
                  className="object-cover rounded-lg shadow-md cursor-pointer w-full h-[308px]"
                  onClick={() => handleImageClick(2)}
                />
              )}

              {/* Ảnh thứ 4 */}
              {allImages[3] && (
                <img
                  src={allImages[3].url || "/no-image.png"}
                  alt="Room Image 4"
                  className="object-cover rounded-lg shadow-md cursor-pointer w-full h-[308px]"
                  onClick={() => handleImageClick(3)}
                />
              )}

              {/* Nút "Xem thêm" sẽ hiển thị ở vị trí ảnh thứ 5 nếu có nhiều hơn 4 ảnh */}
              {allImages.length > 4 && (
                <div
                  className="relative group cursor-pointer h-[308px]"
                  onClick={handleShowAllImages}
                >
                  {/* Hiển thị ảnh thứ 5 làm background nếu có */}
                  {allImages[4] && (
                    <img
                      src={allImages[4].url || "/no-image.png"}
                      alt="Room Image 5"
                      className="object-cover rounded-lg shadow-md w-full h-full"
                    />
                  )}

                  {/* Overlay với nút "Xem thêm" */}
                  <div className="absolute inset-0 bg-black bg-opacity-60 rounded-lg flex items-center justify-center transition-all duration-300 hover:bg-opacity-70">
                    <div className="text-center text-white">
                      <div className="text-xl font-bold mb-1">
                        +{allImages.length - 4} ảnh
                      </div>
                      <div className="text-sm font-medium">Xem thêm</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Modal xem chi tiết từng ảnh */}
          <ReactModal
            isOpen={modalIsOpen}
            onRequestClose={() => setModalIsOpen(false)}
            contentLabel="Room Image Detail"
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-2xl max-w-4xl max-h-[90vh] overflow-auto z-[10000]"
            overlayClassName="fixed inset-0 bg-black bg-opacity-75 z-[9999]"
          >
            <div className="p-6">
              {/* Header với nút đóng */}
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">
                  Hình ảnh {currentImageIndex + 1} / {allImages.length}
                </h2>
                <button
                  onClick={() => setModalIsOpen(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                >
                  ×
                </button>
              </div>

              {/* Ảnh chính */}
              <div className="mb-4">
                <img
                  src={allImages[currentImageIndex]?.url || "/no-image.png"}
                  alt={`Room Image ${currentImageIndex + 1}`}
                  className="w-full max-h-[60vh] object-contain rounded-lg shadow-md"
                />
              </div>

              {/* Điều hướng ảnh */}
              <div className="flex justify-between items-center mb-4">
                <button
                  onClick={handlePrevImage}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
                  disabled={allImages.length <= 1}
                >
                  ← Trước
                </button>

                <button
                  onClick={handleShowAllImages}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                >
                  Xem tất cả ({allImages.length} ảnh)
                </button>

                <button
                  onClick={handleNextImage}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
                  disabled={allImages.length <= 1}
                >
                  Tiếp →
                </button>
              </div>

              {/* Thumbnails */}
              <div className="flex gap-2 overflow-x-auto pb-2">
                {allImages.map((img, index) => (
                  <img
                    key={img._id || index}
                    src={img.url || "/no-image.png"}
                    alt={`Thumbnail ${index + 1}`}
                    className={`w-16 h-16 object-cover rounded cursor-pointer border-2 transition ${
                      index === currentImageIndex
                        ? "border-blue-500"
                        : "border-gray-300 hover:border-blue-300"
                    }`}
                    onClick={() => setCurrentImageIndex(index)}
                  />
                ))}
              </div>
            </div>
          </ReactModal>

          {/* Modal xem tất cả ảnh */}
          <ReactModal
            isOpen={showAllImages}
            onRequestClose={() => setShowAllImages(false)}
            contentLabel="All Room Images"
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-2xl max-w-6xl max-h-[90vh] overflow-auto z-[10000]"
            overlayClassName="fixed inset-0 bg-black bg-opacity-75 z-[9999]"
          >
            <div className="p-6">
              {/* Header với nút back và đóng */}
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-4">
                  <button
                    onClick={handleBackToSingle}
                    className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition flex items-center gap-2"
                  >
                    ← Quay lại
                  </button>
                  <h2 className="text-2xl font-bold text-gray-800">
                    Tất cả hình ảnh ({allImages.length} ảnh)
                  </h2>
                </div>
                <button
                  onClick={() => setShowAllImages(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                >
                  ×
                </button>
              </div>

              {/* Grid hiển thị tất cả ảnh */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {allImages.map((img, index) => (
                  <div
                    key={img._id || index}
                    className="relative group cursor-pointer"
                    onClick={() => {
                      setCurrentImageIndex(index);
                      handleBackToSingle();
                    }}
                  >
                    <img
                      src={img.url || "/no-image.png"}
                      alt={`Room Image ${index + 1}`}
                      className="w-full h-48 object-cover rounded-lg shadow-md transition transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 rounded-lg flex items-center justify-center">
                      <span className="text-white font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                        Xem chi tiết
                      </span>
                    </div>
                    <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                      {index + 1}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ReactModal>

          <div className="mt-6">
            <div className="bg-gray-100 p-4 rounded-lg shadow">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <FaDollarSign className="text-green-500 mr-2 text-xl" />
                  <h2 className="text-2xl text-gray-700">
                    <p>
                      <span className="font-semibold">Giá chỉ từ:</span>{" "}
                      {room.room_quantity > 0 ? (
                        <span className="text-red-600 font-semibold">
                          {room.price} VND/tháng
                        </span>
                      ) : (
                        <span className="text-red-600 font-semibold">
                          Sold Out
                        </span>
                      )}
                    </p>
                  </h2>
                </div>

                <div className="flex justify-end space-x-4">
                  {/* <button className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition ease-in-out duration-300 shadow-lg">
                    <FaShoppingCart className="mr-2" />
                    Thanh toán
                  </button> */}
                  <button className="flex items-center bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition ease-in-out duration-300 shadow-lg">
                    <FaPhoneAlt className="mr-2" />
                    Liên hệ: 0343690062
                  </button>
                </div>
              </div>
              <div className="flex items-center mb-2">
                <FaBed className="text-blue-500 mr-2 text-xl" />
                <p className="text-gray-600">
                  <span className="font-semibold">Loại phòng:</span>{" "}
                  {room.room_type}
                </p>
              </div>
              <div className="flex items-center">
                <FaClipboardList className="text-purple-500 mr-2 text-xl" />
                <p className="text-gray-600">
                  <span className="font-semibold">Số lượng phòng:</span>{" "}
                  {room.room_quantity}
                </p>
              </div>
            </div>

            <div className="bg-gray-100 p-4 rounded-lg shadow mt-4">
              <h2 className="text-2xl font-semibold text-gray-700 flex items-center mb-2">
                <FaInfoCircle className="text-blue-500 mr-2" />
                Thông tin chi tiết:
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {room.description}
              </p>
            </div>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg shadow mt-4 relative z-0">
            <h2 className="text-2xl font-semibold text-gray-700 flex items-center mb-4">
              <FaMapMarkerAlt className="text-red-500 mr-2" />
              Vị trí trên bản đồ:
            </h2>
            {/* Container cho map với z-index thấp */}
            <div className="relative z-0 overflow-hidden rounded-lg">
              <RoomMap address={room.address[0]} />
            </div>
          </div>

          {/* Phần bình luận */}

          <CommentForm roomId={roomId} onCommentAdded={handleCommentAdded} />

          {/* Display Comments */}
          <div className="bg-gray-100 p-4 rounded-lg shadow mt-4">
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">
              Bình luận về phòng:
            </h2>
            {room.comments.length > 0 ? (
              room.comments.map((comment) => (
                <div key={comment._id} className="mb-4 border-b pb-2">
                  <div className="flex items-center mb-1">
                    <strong className="text-gray-800">
                      {comment.user_id.username}:
                    </strong>
                    <span className="text-gray-500 ml-2">
                      {new Date(comment.created_at).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-1">{comment.content}</p>
                  <div className="flex items-center">
                    {Array.from({ length: comment.rating }).map((_, index) => (
                      <FaStar key={index} className="text-yellow-500 mr-1" />
                    ))}
                    {Array.from({ length: 5 - comment.rating }).map(
                      (_, index) => (
                        <FaStar
                          key={index + comment.rating}
                          className="text-gray-300 mr-1"
                        />
                      )
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">Chưa có bình luận nào.</p>
            )}
          </div>
        </div>
      ) : (
        <p>Không có thông tin phòng để hiển thị</p>
      )}
    </div>
  );
};

export default RoomDetail;
