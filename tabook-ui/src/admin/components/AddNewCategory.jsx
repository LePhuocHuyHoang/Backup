import { Autocomplete, Button, Grid, TextField } from '@mui/material';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import { TextareaAutosize as BaseTextareaAutosize } from '@mui/base/TextareaAutosize';
import React, { useState } from 'react';
import { styled } from '@mui/system';
import axios from 'axios';

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

const top100Films = [
    { label: 'The Shawshank Redemption', year: 1994 },
    { label: 'The Godfather', year: 1972 },
    { label: 'The Godfather: Part II', year: 1974 },
    { label: 'The Dark Knight', year: 2008 },
    { label: '12 Angry Men', year: 1957 },
    { label: "Schindler's List", year: 1993 },
    { label: 'Pulp Fiction', year: 1994 },
];

const AddNewCategory = ({ handleAddCategorySuccess, handleClose }) => {
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [description, setDescription] = useState('');

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

    const handleDescriptionChange = (event) => {
        setDescription(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const inputData = {
            name: formData.get('name'),
            description: formData.get('description'),
        };
        console.log(inputData);
        try {
            const response = await axios.post('http://localhost:8098/admin/type', inputData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            if (response) {
                window.alert('Thêm thể loại thành công!');
                handleClose();
                handleAddCategorySuccess();
            }
        } catch (error) {
            console.error('Error adding author:', error);
            setError('Thêm mới thể loại thất bại');
        }
    };

    return (
        <form className="space-y-6" sx={{ width: '800px' }} onSubmit={handleSubmit}>
            <Stack sx={{ width: '100%' }} spacing={2}>
                {error && <Alert severity="error">{error}</Alert>}
            </Stack>
            <Grid container spacing={3} sx={{ width: '100%' }}>
                <Grid item xs={12}>
                    <TextField
                        required
                        type="text"
                        id="name"
                        name="name"
                        label="Tên thể loại"
                        fullWidth
                        autoComplete="Tên thể loại"
                        value={name}
                        onChange={handleNameChange}
                    />
                </Grid>

                <Grid item xs={12}>
                    <Textarea
                        id="description"
                        name="description"
                        label="Mô tả"
                        aria-label="minimum height"
                        minRows={5}
                        fullWidth
                        placeholder="Mô tả thể loại"
                        value={description}
                        onChange={handleDescriptionChange}
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

export default AddNewCategory;
