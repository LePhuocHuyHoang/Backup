import * as React from 'react';
import { useState, useEffect } from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import ListSubheader from '@mui/material/ListSubheader';
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';
import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';

export default function TitlebarImageList({ handleClose, handleAddBookSuccess, bookId }) {
    const [images, setImages] = useState([]);
    const [error, setError] = useState('');
    const [selectedImageInfo, setSelectedImageInfo] = useState(null);
    const [selectedFileCount, setSelectedFileCount] = useState(0);
    const [formExpanded, setFormExpanded] = useState(false);

    const handleImageChange = (event) => {
        const files = event.target.files;
        const filteredFiles = Array.from(files).filter((file) => !images.some((image) => image.name === file.name));
        setImages([...images, ...filteredFiles]);
        setSelectedFileCount((prevCount) => prevCount + filteredFiles.length);
        setFormExpanded(true);
    };

    const handleRemoveAllImages = () => {
        setImages([]);
        setSelectedFileCount(0);
        setFormExpanded(false);
    };

    const handleRemoveImage = (indexToRemove) => {
        setImages(images.filter((_, index) => index !== indexToRemove));
        setSelectedFileCount((prevCount) => prevCount - 1);
        if (images.length === 1) {
            setFormExpanded(false);
        }
    };

    const handleViewImageInfo = (index) => {
        if (selectedImageInfo === images[index]) {
            setSelectedImageInfo(null);
        } else {
            setSelectedImageInfo(images[index]);
        }
    };

    const currentDate = new Date();
    const formattedDate = `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;

    const handleSubmit = async (event) => {
        event.preventDefault();

        const createFolderUrl = `http://localhost:8098/file/mkdir?folderPath=book_${bookId}`;
        const uploadImageUrl = `http://localhost:8098/file/uploads?uploadPath=/data/book/book_${bookId}`;

        try {
            const createFolderResponse = await fetch(createFolderUrl, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (!createFolderResponse.ok) {
                throw new Error('Failed to create folder');
            }
            const formData = new FormData();
            images.forEach((image) => {
                formData.append('files', image);
            });

            const uploadImageResponse = await fetch(uploadImageUrl, {
                method: 'POST',
                body: formData,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (!uploadImageResponse.ok) {
                throw new Error('Failed to upload images');
            }
            handleClose();
            handleAddBookSuccess();
            setFormExpanded(false);
        } catch (error) {
            console.error('Error:', error);
            setError('Failed to create folder or upload images');
        }
        setFormExpanded(true);
    };

    return (
        <React.Fragment>
            <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
                <input type="file" id="image" name="image" multiple accept="image/*" onChange={handleImageChange} />
                <div style={{ float: 'right' }}>
                    {' '}
                    <Button
                        variant="contained"
                        color="error"
                        onClick={handleRemoveAllImages}
                        style={{ marginBottom: '10px' }}
                    >
                        Xóa Tất Cả Ảnh
                    </Button>
                </div>
                {error && <Alert severity="error">{error}</Alert>}
                <ImageList sx={{ width: 765, height: formExpanded ? 450 : 'auto', transition: 'height 0.5s' }}>
                    <ImageListItem key="Subheader" cols={2}>
                        <ListSubheader component="div">{formattedDate}</ListSubheader>
                    </ImageListItem>
                    {images.map((image, index) => (
                        <ImageListItem key={index}>
                            <img src={URL.createObjectURL(image)} alt={`img-${index}`} loading="lazy" />
                            <ImageListItemBar
                                title={`Image ${index}`}
                                actionIcon={
                                    <React.Fragment>
                                        <IconButton
                                            sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
                                            aria-label={`info about Image ${index}`}
                                            onClick={() => handleViewImageInfo(index)}
                                        >
                                            <InfoIcon />
                                        </IconButton>
                                        <IconButton
                                            sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
                                            aria-label="delete"
                                            onClick={() => handleRemoveImage(index)}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </React.Fragment>
                                }
                            />
                        </ImageListItem>
                    ))}
                </ImageList>
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    style={{
                        marginTop: '10px',
                        marginBottom: '10px',
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        display: 'block',
                    }}
                >
                    Upload ({selectedFileCount})
                </Button>
            </form>
            {selectedImageInfo && (
                <div>
                    <h2>Thông tin ảnh</h2>
                    <p>Tên: {selectedImageInfo.name}</p>
                    <p>Kích thước: {selectedImageInfo.size} bytes</p>
                    <p>Loại: {selectedImageInfo.type}</p>
                    <p>Đường dẫn: {selectedImageInfo.preview}</p>
                </div>
            )}
        </React.Fragment>
    );
}
