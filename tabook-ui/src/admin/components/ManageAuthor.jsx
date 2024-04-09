import * as React from 'react';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { styled, alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import { Alert, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Snackbar } from '@mui/material';
import UpdateAuthor from './UpdateAuthor';
import AddNewAuthor from './AddNewAuthor';
import dayjs from 'dayjs';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 800,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(1),
        width: 'auto',
    },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    width: '100%',
    '& .MuiInputBase-input': {
        border: '1px solid black',
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        [theme.breakpoints.up('sm')]: {
            width: '12ch',
            '&:focus': {
                width: '50ch',
            },
        },
    },
}));

const handleAddAuthorSuccess = () => {
    // eslint-disable-next-line no-undef
    fetchAuthors();
    // eslint-disable-next-line no-undef
    // handleClose();
};

export default function ManageAuthor() {
    const [authors, setAuthors] = React.useState([]);
    const [currentPage, setCurrentPage] = React.useState(1);
    const [totalPages, setTotalPages] = React.useState(1);
    const [open, setOpen] = React.useState(false);
    const [showUpdateModal, setShowUpdateModal] = React.useState(false);
    const [updatingAuthorId, setUpdatingAuthorId] = React.useState(null);
    const [deleteAuthorId, setDeleteAuthorId] = React.useState(null);

    const [error, setError] = React.useState('');
    const [success, setSuccess] = React.useState('');
    const [searchKeyword, setSearchKeyword] = React.useState('');

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const fetchAuthors = async () => {
        try {
            const response = await fetch(`http://localhost:8098/admin/author/all?page=${currentPage - 1}&size=5`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();

            // Chuyển đổi định dạng ngày tháng của dob (ngày sinh của tác giả)
            const authors = data.content[0].content.map((author) => ({
                ...author,
                dob: dayjs(author.dob).format('YYYY-MM-DD'),
            }));

            console.log(authors);
            setAuthors(authors);
            setTotalPages(data.content[0].totalPages);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleUpdate = (authorId) => {
        setUpdatingAuthorId(authorId);
        setShowUpdateModal(true);
    };

    const handleCloseUpdateModal = () => {
        setShowUpdateModal(false);
    };

    React.useEffect(() => {
        fetchAuthors();
    }, [currentPage]);

    const handlePageChange = (event, pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleDelete = async (authorId) => {
        try {
            console.log(authorId);
            const response = await fetch(`http://localhost:8098/admin/author?authorId=${authorId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            setSuccess('Xoá tác giả thành công!');
            fetchAuthors();
            setDeleteAuthorId(null);
        } catch (error) {
            console.error('Error deleting book:', error);
            setError('Đã có lỗi xảy ra!');
        }
    };

    React.useEffect(() => {
        let errorTimeout, successTimeout;

        if (error) {
            errorTimeout = setTimeout(() => {
                setError(null);
            }, 3000);
        }

        if (success) {
            successTimeout = setTimeout(() => {
                setSuccess(null);
            }, 3000);
        }

        return () => {
            clearTimeout(errorTimeout);
            clearTimeout(successTimeout);
        };
    }, [error, success]);

    const searchAuthors = async () => {
        // Hàm tìm kiếm dựa trên từ khóa
        try {
            const response = await fetch(`http://localhost:8098/admin/author/search?keyword=${searchKeyword}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setAuthors(data); // Cập nhật authors với dữ liệu tìm kiếm mới
        } catch (error) {
            console.error('Error searching authors:', error);
        }
    };

    // Xử lý sự kiện onChange của ô search để cập nhật từ khóa tìm kiếm
    const handleSearchChange = (event) => {
        setSearchKeyword(event.target.value);
    };

    // Xử lý sự kiện khi submit form search
    const handleSearchSubmit = (event) => {
        event.preventDefault(); // Ngăn chặn việc reload trang khi submit form
        if (!searchKeyword.trim()) {
            fetchAuthors();
            return;
        }

        // Kiểm tra nếu từ khóa tìm kiếm quá dài
        if (searchKeyword.trim().length > 100) {
            setError('Từ khóa tìm kiếm quá dài, vui lòng nhập ít hơn 100 ký tự');
            return;
        }
        searchAuthors(); // Gọi hàm searchauthors khi submit form
    };

    const handleAddAuthorSuccess = () => {
        fetchAuthors();
    };

    return (
        <>
            <div className="d-flex justify-content-between mb-5">
                <form onSubmit={handleSearchSubmit}>
                    <Search>
                        <SearchIconWrapper>
                            <SearchIcon />
                        </SearchIconWrapper>
                        <StyledInputBase
                            placeholder="Tìm kiếm tên..."
                            inputProps={{ 'aria-label': 'search' }}
                            value={searchKeyword}
                            onChange={handleSearchChange} // Xử lý sự kiện onChange để cập nhật từ khóa tìm kiếm
                        />
                    </Search>
                </form>
                <Stack spacing={2}>{error && <Alert severity="error">{error}</Alert>}</Stack>
                <Stack spacing={2}>{success && <Alert severity="success">{success}</Alert>}</Stack>
                <Button
                    variant="contained"
                    className="mr-3"
                    sx={{
                        bgcolor: '#fcd650',
                        color: 'black',
                        '&:hover': { bgcolor: '#fbbf24' },
                    }}
                    onClick={handleOpen}
                >
                    Thêm tác giả
                </Button>
            </div>

            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead className="bg-yellow-400">
                        <TableRow>
                            <TableCell align="left" style={{ width: '15%' }}>
                                Tên tác giả
                            </TableCell>
                            <TableCell align="left" style={{ width: '55%' }}>
                                Về tác giả
                            </TableCell>
                            <TableCell align="left" style={{ width: '10%' }}>
                                Ngày sinh
                            </TableCell>
                            <TableCell align="left" style={{ width: '20%' }}>
                                Action
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {authors.map((author) => (
                            <TableRow key={author.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                <TableCell component="th" scope="row" sx={{ wordBreak: 'break-word' }}>
                                    {author.name}
                                </TableCell>
                                <TableCell align="left" sx={{ wordBreak: 'break-word' }}>
                                    {!author.bio ? 'NOT FOUND' : author.bio}
                                </TableCell>
                                <TableCell align="left">{author.dob}</TableCell>
                                <TableCell align="left">
                                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '70%' }}>
                                        <Button
                                            variant="outlined"
                                            color="primary"
                                            onClick={() => handleUpdate(author.id)}
                                        >
                                            Cập nhật
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            color="error"
                                            onClick={() => setDeleteAuthorId(author.id)}
                                        >
                                            Xoá
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Stack
                spacing={2}
                sx={{ marginTop: '30px', textAlign: 'center', justifyContent: 'center', alignItems: 'center' }}
            >
                <Pagination
                    sx={{
                        '& .MuiPaginationItem-root.Mui-selected': {
                            color: '#000',
                            bgcolor: '#FFD700',
                        },
                        '& .MuiButtonBase-root': {
                            '&:hover': {
                                bgcolor: '#FFECB3',
                            },
                        },
                    }}
                    count={totalPages}
                    color="secondary"
                    page={currentPage}
                    onChange={handlePageChange}
                />
            </Stack>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <AddNewAuthor handleClose={handleClose} handleAddAuthorSuccess={handleAddAuthorSuccess} />
                </Box>
            </Modal>

            <Modal
                open={showUpdateModal}
                onClose={handleCloseUpdateModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <UpdateAuthor
                        handleClose={handleCloseUpdateModal}
                        handleAddAuthorSuccess={handleAddAuthorSuccess}
                        authorId={updatingAuthorId}
                    />
                </Box>
            </Modal>

            <Dialog
                open={deleteAuthorId !== null}
                onClose={() => setDeleteAuthorId(null)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">Xác nhận xoá</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Bạn chắc chắn muốn xoá tác giả này?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteAuthorId(null)} color="primary">
                        Huỷ
                    </Button>
                    <Button onClick={() => handleDelete(deleteAuthorId)} color="primary" autoFocus>
                        Xoá
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
