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
import UpdateType from './UpdateType';
import { Alert, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Snackbar } from '@mui/material';
import AddNewCategory from './AddNewCategory';

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

export default function ManageCategory() {
    const [category, setCategory] = React.useState([]);
    const [currentPage, setCurrentPage] = React.useState(1);
    const [totalPages, setTotalPages] = React.useState(1);
    const [open, setOpen] = React.useState(false);
    const [showUpdateModal, setShowUpdateModal] = React.useState(false);
    const [updatingTypeId, setUpdatingTypeId] = React.useState(null);
    const [deleteCategoryId, setDeleteCategoryId] = React.useState(null);

    const [error, setError] = React.useState('');
    const [success, setSuccess] = React.useState('');
    const [searchKeyword, setSearchKeyword] = React.useState('');

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const fetchCategory = async () => {
        try {
            const response = await fetch(`http://localhost:8098/admin/type/all?page=${currentPage - 1}&size=5`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log(data.content[0].content);
            setCategory(data.content[0].content);
            setTotalPages(data.content[0].totalPages);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    const handleUpdate = (typeId) => {
        setUpdatingTypeId(typeId);
        setShowUpdateModal(true); // Khi nhấn nút "Cập nhật", hiển thị modal
    };

    const handleCloseUpdateModal = () => {
        setShowUpdateModal(false); // Hàm để đóng modal
    };
    React.useEffect(() => {
        fetchCategory();
    }, [currentPage]);

    const handlePageChange = (event, pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleDelete = async (typeId) => {
        try {
            console.log(typeId);
            const response = await fetch(`http://localhost:8098/admin/type?typeId=${typeId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            setSuccess('Xoá thể loại thành công!');
            fetchCategory();
            setDeleteCategoryId(null);
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

    const searchType = async () => {
        // Hàm tìm kiếm dựa trên từ khóa
        try {
            const response = await fetch(`http://localhost:8098/admin/type/search?keyword=${searchKeyword}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setCategory(data); // Cập nhật authors với dữ liệu tìm kiếm mới
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
            setError('Vui lòng nhập từ khóa tìm kiếm');
            return;
        }

        // Kiểm tra nếu từ khóa tìm kiếm quá dài
        if (searchKeyword.trim().length > 100) {
            setError('Từ khóa tìm kiếm quá dài, vui lòng nhập ít hơn 100 ký tự');
            return;
        }
        searchType(); // Gọi hàm searchType khi submit form
    };

    const handleAddCategorySuccess = () => {
        fetchCategory();
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
                    Thêm thể loại
                </Button>
            </div>

            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead className="bg-yellow-400">
                        <TableRow>
                            <TableCell align="left">Tên thể loại</TableCell>
                            <TableCell align="left">Mô tả</TableCell>
                            <TableCell align="left">Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {category.map((cate) => (
                            <TableRow key={cate.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                <TableCell component="th" scope="row">
                                    {cate.name}
                                </TableCell>
                                <TableCell align="left">{cate.description}</TableCell>
                                <TableCell align="left">
                                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '70%' }}>
                                        <Button
                                            variant="outlined"
                                            color="primary"
                                            onClick={() => handleUpdate(cate.id)}
                                        >
                                            Cập nhật
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            color="error"
                                            onClick={() => setDeleteCategoryId(cate.id)}
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
                    <AddNewCategory handleClose={handleClose} handleAddCategorySuccess={handleAddCategorySuccess} />
                </Box>
            </Modal>

            <Modal
                open={showUpdateModal}
                onClose={handleCloseUpdateModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <UpdateType
                        handleClose={handleCloseUpdateModal}
                        handleAddCategorySuccess={handleAddCategorySuccess}
                        typeId={updatingTypeId}
                    />
                </Box>
            </Modal>

            <Dialog
                open={deleteCategoryId !== null}
                onClose={() => setDeleteCategoryId(null)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">Xác nhận xoá</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Bạn chắc chắn muốn xoá thể loại này?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteCategoryId(null)} color="primary">
                        Huỷ
                    </Button>
                    <Button onClick={() => handleDelete(deleteCategoryId)} color="primary" autoFocus>
                        Xoá
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
