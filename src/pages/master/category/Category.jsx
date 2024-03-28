import React, { useEffect, useRef, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button } from 'primereact/button';
import AddCategory from './AddCategory';
import DataTable from 'react-data-table-component';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import { useExportFiles, useFetchData, useSendDeleteData } from '../../../app/service'

const Category = () => {
    const [visible, setVisible] = useState(false);
    const toast = useRef(null);
    const [show, setShow] = useState(false);
    const [category, setCategory] = useState([]);
    const fetchData = useFetchData();
    const deleteData = useSendDeleteData();
    const exportData = useExportFiles();
    const [searchTerm, setSearchTerm] = useState('');
    const [totalRows, setTotalRows] = useState(0);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1); // Add currentPage state
    const [deleteId, setDeleteId] = useState('');
    const [perPage, setPerPage] = useState(10);
    const [editMode, setEditMode] = useState(false); // State to toggle edit mode
    const [editData, setEditData] = useState(null); // State to hold data for editing

    const columns = [
        {
            name: 'Name',
            // selector: row => row.name,
            sortable: true,
            cell: row => (
                <div>
                    <div>{row.name}</div>
                    <img src={row.category_image} alt="" width={50} />
                </div>
            ),
        },
        {
            name: 'Description',
            selector: row => row.description,
        },
        {
            name: 'Status',
            selector: row => row.is_active,
            sortable: true,
        },
        {
            name: 'Actions',
            cell: row => (
                <div>
                    <Button onClick={() => handleEdit(row)} icon="pi pi-check" label="Edit" />
                    <Button onClick={() => handleDelete(row)} icon="pi pi-times" label="Delete" className="p-button-danger"></Button>
                </div>
            ),
        },
    ];

    const fetchCategoryData = async (page) => {
        setLoading(true);
        try {
            await fetchData(`http://localhost:3200/api/category?page=${page}&per_page=${perPage}&delay=1&search=${searchTerm}`).then(response => {
                console.log(' response ', response.data);

                setCategory(response.data.categories);
                setTotalRows(response.data.total);
                setCurrentPage(page); // Update currentPage when fetching data
                setLoading(false);
            });
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const accept = () => {
        const delete_id = deleteId._id;
        try {
            deleteData(`http://localhost:3200/api/category/${delete_id}`).then(response => {
                console.log(' delete response ', response);
                if (response.data.status === 0) {
                    toast.current.show({ severity: 'info', summary: 'Confirmed', detail: response.data.message, life: 3000 });
                    fetchCategoryData(1);
                } else {
                    toast.current.show({ severity: 'warn', summary: 'Rejected', detail: response.data.message, life: 3000 });
                }
            })
        } catch (error) {
            console.log(error, ' error ');
        }
    }

    const reject = () => {
        toast.current.show({ severity: 'warn', summary: 'Rejected', detail: 'You have rejected the Delete Process', life: 3000 });
    }

    const handleEdit = (row) => {
        setEditMode(true);
        setEditData(row); // Set data for editing
        setShow(true); // Show modal
    };

    const handleDelete = (row) => {
        setVisible(true);
        setDeleteId(row);
    };

    const handlePageChange = page => {
        fetchCategoryData(page);
    };
    const handleSearch = event => {
        const searchTerm = event.target.value.toLowerCase();
        setSearchTerm(searchTerm.length > 2 ? searchTerm : '');
    };

    const handleClose = () => {
        setShow(false);
        setEditMode(false); // Reset edit mode
        setEditData(null); // Reset edit data
    };

    const exportFile = async (format) => {

        try {
            exportData(`http://localhost:3200/api/category/export/${format}`, {}, format).then(response => {
                console.log(' export response ', response);
                if (response?.data?.status === 0 ) {
                    toast.current.show({ severity: 'info', summary: 'Confirmed', detail: response.data.message, life: 3000 });
                } else if (response?.data?.status === 1) {
                    toast.current.show({ severity: 'warn', summary: 'Rejected', detail: response.data.message, life: 3000 });
                } else {
                    toast.current.show({severity: 'success', summary: 'Confirmed', detail: 'File Export processing and will get soon', life: 3000});
                }
            })
        } catch (error) {
            console.log(error, ' error ');
        }
    }

    const handleShow = () => setShow(true);
    useEffect(() => {
        fetchCategoryData(1);
    }, [searchTerm]);

    return (
        <>
            <Toast ref={toast} />
            <ConfirmDialog
                group="declarative"
                visible={visible}
                onHide={() => setVisible(false)}
                message="Are you sure you want to delete?"
                header="Confirmation"
                icon="pi pi-exclamation-triangle"
                accept={accept}
                reject={reject}
                style={{ width: '50vw' }}
                breakpoints={{ '1100px': '75vw', '960px': '100vw' }}
            />
            <div className="Category-page bg-light">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <h3 className="mb-3"> Create Category </h3>
                            <div className="bg-white shadow rounded">
                                <div className="row">
                                    <div className="col-md-12">
                                        <Button variant="primary" className='float-end' onClick={handleShow}>
                                            Create Category
                                        </Button>
                                        <div className="form-left h-100 py-5 px-1">
                                            <div className="d-flex justify-content-between">
                                                <div>
                                                    <Button icon="pi pi-download" onClick={() => exportFile('excel')} label="Excel" severity="success" raised />
                                                    <Button icon="pi pi-download" onClick={() => exportFile('pdf')} label="Pdf" severity="danger" raised />
                                                </div>
                                                <div>
                                                    <input
                                                        type="text"
                                                        placeholder="Type min 3 letters to search..."
                                                        onChange={handleSearch}
                                                        style={{ marginBottom: '10px' }}
                                                    />
                                                </div>
                                            </div>

                                            <DataTable
                                                columns={columns}
                                                data={category}
                                                progressPending={loading}
                                                selectableRows
                                                fixedHeader
                                                pagination
                                                paginationServer
                                                paginationTotalRows={totalRows}
                                                onChangePage={handlePageChange}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer />
            <AddCategory show={show} handleClose={handleClose} fetchCategoryData={fetchCategoryData} editMode={editMode} editData={editData} />
        </>
    );
}
export default Category