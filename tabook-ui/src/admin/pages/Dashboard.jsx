import React, { useEffect } from 'react';
import 'datatables.net-autofill-dt';
import $ from 'jquery';

const Dashboard = () => {
    const [books, setBooks] = React.useState([]);
    const [currentPage, setCurrentPage] = React.useState(1);
    const [totalPages, setTotalPages] = React.useState(1);
    React.useEffect(() => {
        async function fetchBooks() {
            try {
                const response = await fetch(`http://localhost:8098/admin/book/all?page=${currentPage - 1}&size=5`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                console.log();
                setBooks(data.content[0].content);
                setTotalPages(data.content[0].totalPages);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }

        fetchBooks();
    }, [currentPage]);

    const handlePageChange = (event, pageNumber) => {
        setCurrentPage(pageNumber);
    };

    useEffect(() => {
        $('#example').DataTable();
    }, []);
    return (
        <table id="example" className="table table-striped table-bordered" style={{ width: '100%' }}>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Position</th>
                    <th>Office</th>
                    <th>Age</th>
                    <th>Start date</th>
                    <th>Salary</th>
                </tr>
            </thead>
            <tbody>
                {books.map((book, index) => (
                    <tr key={index}>
                        <td>{book.name}</td>
                        <td>{book.calories}</td>
                        <td>{book.fat}</td>
                        <td>{book.carbs}</td>
                        <td>{book.protein}</td>
                    </tr>
                ))}
            </tbody>
            <tfoot>
                <tr>
                    <th>Name</th>
                    <th>Position</th>
                    <th>Office</th>
                    <th>Age</th>
                    <th>Start date</th>
                    <th>Salary</th>
                </tr>
            </tfoot>
        </table>
    );
};

export default Dashboard;
