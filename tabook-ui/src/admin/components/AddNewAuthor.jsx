import { Autocomplete, Button, Grid, TextField } from '@mui/material';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import { TextareaAutosize as BaseTextareaAutosize } from '@mui/base/TextareaAutosize';
import React, { useState } from 'react';
import { styled } from '@mui/system';
import axios from 'axios';
import dayjs from 'dayjs';

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

const AddNewAuthor = ({ handleAddAuthorSuccess, handleClose }) => {
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [dob, setDob] = useState(new Date());
    const [bio, setBio] = useState('');

    const handleNameChange = (event) => {
        const name = event.target.value;

        if (!name || name.trim() === '') {
            setError('Tên tác giả không được để trống');
        } else if (name.length > 255) {
            setError(`Tên tác giả phải nằm trong khoảng từ 0 đến 255 ký tự`);
            setName(name.substring(0, 255));
            return;
        } else {
            setError('');
        }

        setName(event.target.value);
    };

    const handleBirthdayChange = (event) => {
        setDob(event.target.value);
    };

    const handleIntroduceChange = (event) => {
        const introduce = event.target.value;

        if (!introduce || introduce.trim() === '') {
            setError('Giới thiệu không được để trống');
        } else if (introduce.length > 255) {
            setError('Giới thiệu không được vượt quá 255 ký tự');
            setBio(introduce.substring(0, 255));
            return;
        } else {
            setError('');
        }

        setBio(introduce);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const inputData = {
            name: formData.get('name'),
            dob: dayjs(formData.get('dob')).format('YYYY-MM-DD'),
            bio: bio,
        };

        const dobPattern = /^\d{4}-\d{2}-\d{2}$/;
        if (!dobPattern.test(inputData.dob)) {
            setError('Định dạng ngày sinh không hợp lệ');
            return;
        }
        const dobDate = new Date(inputData.dob);

        // Kiểm tra xem ngày sinh có nằm trong khoảng thời gian hợp lệ không
        const currentDate = new Date();
        if (dobDate >= currentDate) {
            setError('Ngày sinh phải nhỏ hơn ngày hiện tại');
            return;
        }
        console.log(inputData);
        try {
            const response = await axios.post('http://localhost:8098/admin/author', inputData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            if (response) {
                window.alert('Thêm mới tác giả thành công!');
                handleClose();
                handleAddAuthorSuccess();
                console.log('Author added successfully!');
            }
        } catch (error) {
            console.error('Error adding author:', error);
            setError('Failed to add new author');
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
                        label="Tên tác giả"
                        fullWidth
                        autoComplete="Tên tác giả"
                        value={name}
                        onChange={handleNameChange}
                    />
                </Grid>

                <Grid item xs={6}>
                    <TextField
                        required
                        type="date"
                        id="dob"
                        name="dob"
                        label="Ngày sinh"
                        fullWidth
                        value={dob}
                        onChange={handleBirthdayChange}
                    />
                </Grid>

                <Grid item xs={12}>
                    <Textarea
                        id="bio"
                        name="bio"
                        label="Giới thiệu"
                        aria-label="minimum height"
                        minRows={5}
                        fullWidth
                        placeholder="Giới thiệu về tác giả"
                        value={bio}
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

export default AddNewAuthor;
