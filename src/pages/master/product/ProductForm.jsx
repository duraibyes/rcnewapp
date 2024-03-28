import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Fieldset } from 'primereact/fieldset';
import { InputTextarea } from 'primereact/inputtextarea';
import { Checkbox } from 'primereact/checkbox';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import './product.css';
import axios from 'axios';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { useFetchData } from '../../../app/service';

const thumbsContainer = {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16
};

const thumb = {
    display: 'inline-flex',
    flexDirection: 'column', // Change to column layout
    borderRadius: 2,
    border: '1px solid #eaeaea',
    marginBottom: 8,
    marginRight: 8,
    width: 200,
    height: 200, // Change to auto height
    padding: 4,
    boxSizing: 'border-box'
};

const thumbInner = {
    display: 'flex',
    minWidth: 0,
    overflow: 'hidden'
};

const img = {
    display: 'block',
    width: 'auto',
    height: '100%'
};

function Previews({ onImagesChange, existingImages }) {
    const [files, setFiles] = useState([]);
    const [titles, setTitles] = useState({}); // State for titles of each image
    const [sortOrders, setSortOrders] = useState({}); // State for sort orders of each image

    const handleTitleChange = (e, index) => {
        const updatedFiles = [...files];
        updatedFiles[index].title = e.target.value;
        setFiles(updatedFiles);
    };

    const handleSortOrderChange = (e, index) => {
        const updatedFiles = [...files];
        updatedFiles[index].sortOrder = e.target.value;
        setFiles(updatedFiles);
    };

    const thumbs = files.map((file, index) => (
        <div style={thumb} key={index}>
            {console.log(' files ', files)}
            <div style={thumbInner}>
                <img
                    src={file.preview}
                    style={img}
                    onLoad={() => { URL.revokeObjectURL(file.preview) }}
                    alt={`Preview ${index}`}
                />
            </div>
            <InputText
                type="text"
                placeholder="Title"
                value={file.title || ''}
                onChange={(e) => handleTitleChange(e, index)}
            />
            <InputText
                type="text"
                placeholder="Sort Order"
                value={file.sortOrder || ''}
                onChange={(e) => handleSortOrderChange(e, index)}
                keyfilter="int"
            />
        </div>
    ));

    const handleDrop = useCallback(acceptedFiles => {
        const updatedFiles = acceptedFiles.map(file => ({
            file,
            title: '', // Initialize title to empty string
            sortOrder: '', // Initialize sortOrder to empty string
            preview: URL.createObjectURL(file)
        }));
        setFiles(updatedFiles);
        onImagesChange(updatedFiles); // Call the onImagesChange function with the updated files
    }, [onImagesChange]);

    const { getRootProps, getInputProps } = useDropzone({
        accept: {
            'image/*': []
        },
        onDrop: handleDrop
    });

    useEffect(() => {
        if (existingImages && existingImages.length > 0) {
            console.log(' datata ', existingImages)
            const mappedFiles = existingImages.map((image, index) => ({
                
                preview: 'http://localhost:3200/'+image.image,
                title: image.title || '',
                sortOrder: image.sortOrder || '',
                is_existing: true
            }));
            console.log('  mappedFiles ', mappedFiles)
            setFiles(mappedFiles);
        }
    }, [existingImages]);

    useEffect(() => {
        // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
        return () => files.forEach(file => URL.revokeObjectURL(file.preview));
    }, [files]);

    return (
        <section className="container img-dropzone">
            <div {...getRootProps({ className: 'dropzone' })}>
                <input {...getInputProps()} />
                <p>Drag 'n' drop some files here, or click to select files</p>
            </div>
            <aside style={thumbsContainer}>
                {thumbs}
            </aside>
        </section>
    );
}

function ProductForm() {

    const [imagesData, setImagesData] = useState([]);
    const [productData, setProductData] = useState('');
    const accessToken = useSelector(state => state.auth.user?.token || null);
    const navigate = useNavigate();
    const { id } = useParams();
    const fetchData = useFetchData();

    const getProductInfo = async (id) => {

        try {
            await fetchData(`http://localhost:3200/api/product/${id}`).then(response => {
                console.log(' response ', response.data);
                setProductData(response.data);
                formik.setValues({
                    productName: response.data.product_name,
                    productSKU: response.data.product_sku,
                    productTag: response.data.product_tag,
                    productDescription: response.data.description,
                    productStatus: productData.is_active === 'yes',
                    // Set other form values...
                });
            });
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        if (id && !productData) {
            getProductInfo(id);
        }
    }, [])

    const formik = useFormik({
        initialValues: {
            productName: productData.product_name || '', // Ensure a default value if product_name is null
            productSKU: productData.product_sku || '',
            productTag: productData.product_tag || '',
            productDescription: productData.description || '',
            productStatus: true, // Set to true if is_active is 'yes'
            imagesData: []
        },
        validationSchema: Yup.object({
            productName: Yup.string().required('Product Name is required'),
            productSKU: Yup.string().required('Product SKU is required')
        }),
        onSubmit: async (values, { setSubmitting }) => {
            console.log('  productData ', productData);
            const formData = { ...values, imagesData };
            const apiUrl = productData ? `http://localhost:3200/api/product/${productData._id}` : 'http://localhost:3200/api/product';
            const method = productData ? 'put' : 'post';
            const configurations = {
                method,
                url: apiUrl,
                data: formData,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "multipart/form-data"
                }
            }
            console.log(configurations);
            // return false;
            await axios(configurations)
                .then((result) => {

                    if (result.data.status === 0) {
                        toast.success(result.data.message);
                        setTimeout(() => {
                            navigate('/product/form/' + result.data._doc._id);
                        }, 1000);
                    } else {
                        toast.error(result.data.message);
                    }
                })
                .catch((error) => {
                    console.log(error);
                })
            setSubmitting(false);
        },
    });

    return (

        <div className='row'>
            <form onSubmit={formik.handleSubmit}>
                <h1 className='m-3'>Product Form</h1>
                <div className="bg-white shadow rounded">
                    <div className="row m-3">
                        <div className="col-md-6">
                            <div className="row">
                                <div className='col-sm-4 form-group p-2'>
                                    <div>
                                        <label htmlFor='productName'> Product Name <span className="text-danger">*</span></label>
                                    </div>
                                    <div>
                                        <InputText id="productName" name='productName' onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.productName} className={formik.touched.productName && formik.errors.productName ? 'p-invalid' : ''} />
                                        {formik.touched.productName && formik.errors.productName ? (
                                            <div className="p-error">{formik.errors.productName}</div>
                                        ) : null}
                                    </div>
                                </div>
                                <div className='col-sm-4 form-group p-2'>
                                    <div>
                                        <label>Product SKU<span className="text-danger">*</span></label>
                                    </div>
                                    <div>
                                        <InputText id='productSKU' name='productSKU' onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            value={formik.values.productSKU}
                                            className={formik.touched.productSKU && formik.errors.productSKU ? 'p-invalid' : ''}
                                        />
                                        {formik.touched.productSKU && formik.errors.productSKU ? (
                                            <div className="p-error">{formik.errors.productSKU}</div>
                                        ) : null}
                                    </div>
                                </div>
                                <div className='col-sm-4 form-group p-2'>
                                    <div>
                                        <label id='productTag'> Product Tag </label>
                                    </div>
                                    <div>
                                        <InputText id='productTag' name='productTag' onChange={formik.handleChange}
                                        />
                                       
                                    </div>
                                </div>
                                <div className="col-sm-4 form-group p-2">
                                    <div>
                                        <label htmlFor='productDescription'> Product Description </label>
                                    </div>
                                    <div>
                                        <InputTextarea name='productDescription' onChange={formik.handleChange} rows={5} cols={30} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-6">
                            <Fieldset legend="Gallery Images">
                                <Previews onImagesChange={setImagesData} existingImages={productData.gallery} /> {/* Render the Previews component */}
                            </Fieldset>
                        </div>
                        <div className="col-sm-12 p-3 pb-5">
                            <div className="form-group">
                                <Checkbox
                                    checked={formik.values.productStatus} // Use checked prop for controlled component
                                    name="product_status"
                                    onChange={(e) => formik.setFieldValue('productStatus', e.target.checked)}
                                />
                                <label htmlFor="product_status" className="ml-2">Active</label>
                            </div>
                        </div>
                    </div>
                </div>
                <Button type="submit">Submit</Button>
            </form>
            <ToastContainer />
        </div>
    );
}
export default ProductForm;