import React, { useState, useEffect } from 'react';
import { Autocomplete, Button, Grid, TextField } from '@mui/material';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import { TextareaAutosize as BaseTextareaAutosize } from '@mui/base/TextareaAutosize';
import { styled } from '@mui/system';
import axios from 'axios';
import { type } from '@testing-library/user-event/dist/type';

const blue = {
    100: '#DAECFF',
    200: '#b6daff',
    400: '#3399FF',
    500: '#007FFF',
    600: '#0072E5',
    900: '#003A75',
};

const grey = {
    50: '#F3F6F9',
    100: '#E5EAF2',
    200: '#DAE2ED',
    300: '#C7D0DD',
    400: '#B0B8C4',
    500: '#9DA8B7',
    600: '#6B7A90',
    700: '#434D5B',
    800: '#303740',
    900: '#1C2025',
};

const Textarea = styled(BaseTextareaAutosize)(
    ({ theme }) => `
    box-sizing: border-box;
    width: 100%;
    font-family: 'IBM Plex Sans', sans-serif;
    font-size: 0.875rem;
    font-weight: 400;
    line-height: 1.5;
    padding: 8px 12px;
    border-radius: 8px;
    border: 1px solid #ccc;
    color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
    background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
    border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
    box-shadow: 0px 2px 2px ${theme.palette.mode === 'dark' ? grey[900] : grey[50]};

    &:hover {
      border-color: ${blue[400]};
    }

    &:focus {
      border-color: ${blue[400]};
      box-shadow: 0 0 0 3px ${theme.palette.mode === 'dark' ? blue[600] : blue[200]};
    }

    // firefox
    &:focus-visible {
      outline: 0;
    }
  `,
);

const AddNewBook = ({ handleClose, handleAddBookSuccess }) => {
    const [publicationYear, setPublicationYear] = useState('');
    const [name, setName] = useState('');
    const [totalPages, setTotalPages] = useState('');
    const [publisher, setPublisher] = useState('');
    const [ibsn, setIbsn] = useState('');
    const [fileSource, setFileSource] = useState('');
    const [introduce, setIntroduce] = useState('');
    const [error, setError] = useState('');
    const [pointPrice, setPointPrice] = useState('');
    const [typeValue, setTypeValue] = useState(null);
    const [authorValue, setAuthorValue] = useState(null);
    const [typeOptions, setTypeOptions] = useState([]);
    const [authorOptions, setAuthorOptions] = useState([]);

    useEffect(() => {
        const fetchTypes = async () => {
            try {
                const response = await axios.get('http://localhost:8098/admin/type/all?size=30', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                const types = response.data.content[0].content;
                const typeNames = types.map((type) => ({ label: type.name }));
                setTypeOptions(typeNames);
            } catch (error) {
                console.error('Error fetching types:', error);
            }
        };

        const fetchAuthors = async () => {
            try {
                const response = await axios.get('http://localhost:8098/admin/author/all?size=30', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                const authors = response.data.content[0].content;
                const authorNames = authors.map((author) => ({ label: author.name }));
                setAuthorOptions(authorNames);
            } catch (error) {
                console.error('Error fetching authors:', error);
            }
        };

        fetchTypes();
        fetchAuthors();
    }, []);

    const handlePublicationYearChange = (event) => {
        const year = parseInt(event.target.value);
        const currentYear = new Date().getFullYear();

        if (year <= 0) {
            setError('Năm xuất bản phải lớn hơn 0');
        } else if (year < 1975 || year > currentYear) {
            setError(`Năm xuất bản phải nằm trong khoảng từ 1975 đến ${currentYear}`);
        } else {
            setError('');
        }

        setPublicationYear(event.target.value);
    };

    const handleNameChange = (event) => {
        const name = event.target.value;

        if (!name || name.trim() === '') {
            setError('Tên sách không được để trống');
        } else if (name.length > 500) {
            setError(`Tên sách phải nằm trong khoảng từ 0 đến 500 ký tự`);
        } else {
            setError('');
        }

        setName(event.target.value);
    };

    const handleFileSourceChange = (event) => {
        const value = event.target.value;

        if (!value.trim()) {
            setError('File Source không được để trống');
        } else {
            setError('');
        }

        setFileSource(value);
    };

    const handlePubliserChange = (event) => {
        const name = event.target.value;

        if (!name || name.trim() === '') {
            setError('Nhà xuất bản không được để trống');
        } else if (name.length > 500) {
            setError(`Nhà xuất bản phải nằm trong khoảng từ 0 đến 500 ký tự`);
        } else {
            setError('');
        }

        setPublisher(event.target.value);
    };

    const handleTotalPageChange = (event) => {
        const totalPage = parseInt(event.target.value);
        if (totalPage <= 0) {
            setError('Tổng số trang phải lớn hơn 0');
        } else if (totalPage > 1000) {
            setError(`Tổng số trang phải lớn hơn 1 và bé hơn hoặc bằng 1000`);
        } else {
            setError('');
        }
        setTotalPages(event.target.value);
    };

    const handleIbsnChange = (event) => {
        const ibsn = event.target.value;

        if (!ibsn || ibsn.trim() === '') {
            setError('IBSN không được để trống');
        } else if (ibsn.length > 500) {
            setError(`IBSN phải nằm trong khoảng từ 0 đến 500 ký tự`);
        } else {
            setError('');
        }

        setIbsn(event.target.value);
    };

    const handlePointPriceChange = (event) => {
        const value = event.target.value;
        const intValue = parseInt(value);

        if (intValue <= 0) {
            setError('Point Price phải là số lớn hơn 0');
        } else if (isNaN(intValue)) {
            setError('Point Price không hợp lệ');
        } else {
            setError('');
        }

        setPointPrice(value);
    };

    const handleIntroduceChange = (event) => {
        const introduce = event.target.value;

        if (introduce.length > 500) {
            setError(`Giới thiệu sách phải nằm trong khoảng từ 0 đến 500 ký tự`);
        } else {
            setError('');
        }

        setIntroduce(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const inputData = {
            name: formData.get('name'),
            introduce: formData.get('introduce'),
            ibsn: formData.get('ibsn'),
            publicationYear: formData.get('publicationYear'),
            publisher: formData.get('publisher'),
            totalPages: formData.get('totalPages'),
            pointPrice: formData.get('pointPrice'),
            isFree: false,
            fileSource: formData.get('fileSource'),
            typeName: typeValue ? typeValue.label : '',
            authorName: authorValue ? authorValue.label : '',
            fileSource: formData.get('fileSource'),
        };
        console.log(inputData);
        try {
            const response = await axios.post('http://localhost:8098/admin/book', inputData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            if (response) {
                window.alert('Thêm mới sách thành công!');
                handleClose();
                handleAddBookSuccess();
            }
        } catch (error) {
            console.error('Error adding book:', error);
            setError('Failed to add new book');
        }
    };

    return (
        <form className="space-y-6" sx={{ width: '800px' }} onSubmit={handleSubmit}>
            <Stack sx={{ width: '100%' }} spacing={2}>
                {error && <Alert severity="error">{error}</Alert>}
            </Stack>
            <Grid container spacing={3} sx={{ width: '100%' }}>
                <Grid item xs={6}>
                    <TextField
                        required
                        type="text"
                        id="name"
                        name="name"
                        label="Tên sách"
                        fullWidth
                        autoComplete="Tên sách"
                        value={name}
                        onChange={handleNameChange}
                    />
                </Grid>

                <Grid item xs={6}>
                    <TextField
                        required
                        type="number"
                        id="publicationYear"
                        name="publicationYear"
                        label="Năm xuất bản"
                        fullWidth
                        autoComplete="Năm xuất bản"
                        value={publicationYear}
                        onChange={handlePublicationYearChange}
                    />
                </Grid>

                <Grid item xs={6}>
                    <TextField
                        required
                        type="text"
                        id="publisher"
                        name="publisher"
                        label="Nhà xuất bản"
                        fullWidth
                        autoComplete="Nhà xuất bản"
                        value={publisher}
                        onChange={handlePubliserChange}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        required
                        type="text"
                        id="ibsn"
                        name="ibsn"
                        label="IBSN"
                        fullWidth
                        autoComplete="IBSN"
                        value={ibsn}
                        onChange={handleIbsnChange}
                    />
                </Grid>

                <Grid item xs={6}>
                    <TextField
                        required
                        type="number"
                        id="totalPages"
                        name="totalPages"
                        label="Tổng số trang"
                        fullWidth
                        autoComplete="200"
                        value={totalPages}
                        onChange={handleTotalPageChange}
                    />
                </Grid>

                <Grid item xs={6}>
                    <Autocomplete
                        id="typeName"
                        name="typeName"
                        options={typeOptions}
                        getOptionLabel={(option) => (option && option.label ? option.label : '')}
                        value={typeValue} // Giá trị đã chọn từ state
                        onChange={(event, newValue) => setTypeValue(newValue)} // Cập nhật state khi có sự thay đổi
                        renderInput={(params) => <TextField {...params} label="Thể loại" />}
                    />
                </Grid>
                <Grid item xs={6}>
                    <Autocomplete
                        id="authorName"
                        name="authorName"
                        options={authorOptions}
                        getOptionLabel={(option) => (option && option.label ? option.label : '')}
                        value={authorValue} // Giá trị đã chọn từ state
                        onChange={(event, newValue) => setAuthorValue(newValue)} // Cập nhật state khi có sự thay đổi
                        renderInput={(params) => <TextField {...params} label="Tên tác giả" />}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        required
                        type="number"
                        id="pointPrice"
                        name="pointPrice"
                        label="Point Price"
                        fullWidth
                        autoComplete="Thể loại"
                        value={pointPrice}
                        onChange={handlePointPriceChange}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        required
                        type="text"
                        id="fileSource"
                        name="fileSource"
                        label="File Source"
                        fullWidth
                        autoComplete="Thể loại"
                        value={fileSource}
                        onChange={handleFileSourceChange}
                    />
                </Grid>

                <Grid item xs={12}>
                    <Textarea
                        id="introduce"
                        name="introduce"
                        label="Giới thiệu"
                        aria-label="minimum height"
                        minRows={5}
                        fullWidth
                        placeholder="Giới thiệu về sách"
                        value={introduce}
                        onChange={handleIntroduceChange}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Button
                        className="bg-[#9155FD] w-full"
                        type="submit"
                        variant="contained"
                        size="large"
                        sx={{ padding: '.8rem 0', bgcolor: '#fcd650', color: 'black' }}
                    >
                        Lưu lại
                    </Button>
                </Grid>
            </Grid>
        </form>
    );
};

export default AddNewBook;
