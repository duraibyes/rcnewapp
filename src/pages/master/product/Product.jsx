import { Button } from 'primereact/button';
import { ConfirmDialog } from 'primereact/confirmdialog'
import { Toast } from 'primereact/toast'
import React, { useEffect, useRef, useState } from 'react'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useExportFiles, useFetchData, useSendDeleteData } from '../../../app/service';
import DataTable from 'react-data-table-component';
import { Link } from 'react-router-dom';

const Product = () => {
    const [visible, setVisible] = useState(false);
    const toast = useRef(null);
    const [product, setProduct] = useState([]);
    const fetchData = useFetchData();
    const deleteData = useSendDeleteData();
    const exportData = useExportFiles();
    const [searchTerm, setSearchTerm] = useState('');
    const [totalRows, setTotalRows] = useState(0);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1); // Add currentPage state
    const [deleteId, setDeleteId] = useState('');
    const [perPage, setPerPage] = useState(10);

    const columns = [
        {
            name: 'Name',
            // selector: row => row.name,
            sortable: true,
            cell: row => (
                <div>
                    <div>{row.product_name}</div>
                    <img src={row.profile_image} alt="" width={50} />
                </div>
            ),
        },
        {
            name: 'SKU',
            selector: row => row.product_sku,
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
                    <Link to={`form/${row._id}`}>
                        <Button icon="pi pi-check" label="Edit" />
                    </Link>
                    <Button onClick={() => handleDelete(row)} icon="pi pi-times" label="Delete" className="p-button-danger"></Button>
                </div>
            ),
        },
    ];

    const fetchProductData = async (page) => {
        setLoading(true);
        try {
            await fetchData(`http://localhost:3200/api/product?page=${page}&per_page=${perPage}&delay=1&search=${searchTerm}`).then(response => {
                console.log(' response ', response.data);

                setProduct(response.data.products);
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
            deleteData(`http://localhost:3200/api/product/${delete_id}`).then(response => {
                console.log(' delete response ', response);
                if (response.data.status === 0) {
                    toast.current.show({ severity: 'info', summary: 'Confirmed', detail: response.data.message, life: 3000 });
                    fetchProductData(1);
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


    const handleDelete = (row) => {
        setVisible(true);
        setDeleteId(row);
    };

    const handlePageChange = page => {
        fetchProductData(page);
    };
    const handleSearch = event => {
        const searchTerm = event.target.value.toLowerCase();
        setSearchTerm(searchTerm.length > 2 ? searchTerm : '');
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

    useEffect(() => {
        fetchProductData(1);
    }, [searchTerm])
    

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
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-lg-12">
                            <h3 className="mb-3"> Products </h3>
                            <div className="bg-white shadow rounded">
                                <div className="row">
                                    <div className="col-md-12">
                                        <Link to="form" className='p-button float-end ' >
                                            <Button variant="primary">Add Products</Button>
                                        </Link>
                                        <div className="form-left h-100 py-5 px-1 mt-3">
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
                                                data={product}
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
        </>
    )
}

export default Product