import React, { useState, useEffect } from 'react';
import { FiEye, FiTrash2 } from 'react-icons/fi';

const ImageViewer = ({ bookId }) => {
    const [images, setImages] = useState([]);
    const [selectedImageIndex, setSelectedImageIndex] = useState(null);
    const [imageOpened, setImageOpened] = useState(false);
    const [loading, setLoading] = useState(true); // Trạng thái loading

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(
                    `http://localhost:8098/file/readFilesToImages?directoryPath=/data/book/book_${bookId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    },
                );
                if (!response.ok) {
                    throw new Error('Failed to fetch images');
                }
                const imageData = await response.json();
                if (Array.isArray(imageData.data) && imageData.data.length > 0) {
                    const imagesData = imageData.data.map((item) => ({
                        data: item.data,
                        name: item.name,
                    }));
                    setImages(imagesData);
                    console.log(imageData);
                } else {
                    console.error('Invalid image data format:', imageData);
                }
            } catch (error) {
                console.error('Error fetching images:', error);
            } finally {
                setLoading(false); // Kết thúc fetching, set loading về false
            }
        };

        fetchImages();
    }, [bookId]);

    const openImage = (index) => {
        setSelectedImageIndex(index);
        setImageOpened(true); // Mở ảnh
    };

    const closeImage = () => {
        setSelectedImageIndex(null);
        setImageOpened(false); // Đóng ảnh
    };

    const deleteImage = async (index) => {
        try {
            const token = localStorage.getItem('token');
            const imageData = images[index]; // Dữ liệu hình ảnh tại index
            if (!imageData) {
                console.error('Image data not found');
                return;
            }
            const imageName = imageData.name; // Lấy tên hình ảnh từ dữ liệu hình ảnh
            console.log(imageData);
            const response = await fetch(
                `http://localhost:8098/file/rmdir?path=/data/book/book_${bookId}/${imageName}`,
                {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );
            if (!response.ok) {
                throw new Error('Failed to delete image');
            }
            const updatedImages = [...images];
            updatedImages.splice(index, 1);
            setImages(updatedImages);
        } catch (error) {
            console.error('Error deleting image:', error);
        }
    };

    const deleteAllImages = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:8098/file/rmdir?path=/data/book/book_${bookId}`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                throw new Error('Failed to delete all images');
            }
            setImages([]); // Xóa tất cả hình ảnh khỏi state
        } catch (error) {
            console.error('Error deleting all images:', error);
        }
    };

    return (
        <div className="image-container">
            <button onClick={deleteAllImages} className="delete-all-button">
                <div className="delete-all-content">
                    <span>Xóa tất cả ảnh</span>
                </div>
            </button>
            {loading ? ( // Kiểm tra trạng thái loading
                <div className="loading-container">
                    <p className="loading-text">Loading...</p>
                </div>
            ) : images.length > 0 ? ( // Nếu không loading và có ảnh
                <div className="image-grid">
                    {images.map((image, index) => (
                        <div key={index} className="image-item">
                            <img
                                src={`data:image/jpeg;base64,${image.data}`}
                                alt={`Book ${index + 1}`}
                                className="thumbnail"
                            />
                            <div className="view-icon-container" onClick={() => openImage(index)}>
                                {/* Thêm icon và gắn sự kiện onClick */}
                                <FiEye className="view-icon" />
                            </div>
                            <div className="delete-icon-container" onClick={() => deleteImage(index)}>
                                {/* Thêm icon thùng rác và gắn sự kiện onClick */}
                                <FiTrash2 className="delete-icon" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                // Nếu không loading và không có ảnh
                <div className="loading-container">
                    <p className="loading-text">Sách không có ảnh nào.</p>
                </div>
            )}

            {selectedImageIndex !== null && imageOpened && (
                <div className="image-modal">
                    <span className="close-icon" onClick={closeImage}>
                        ×
                    </span>
                    <img
                        src={`data:image/jpeg;base64,${images[selectedImageIndex].data}`} // Sửa đổi ở đây
                        alt={`Book ${selectedImageIndex + 1}`}
                        className="modal-image"
                    />
                </div>
            )}
        </div>
    );
};

export default ImageViewer;
