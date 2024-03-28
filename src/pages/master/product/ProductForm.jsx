import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import React, { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Fieldset } from 'primereact/fieldset';

import { InputTextarea } from 'primereact/inputtextarea';

import './product.css';


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

function Previews({ onImagesChange }) {
    const [files, setFiles] = useState([]);
    const [titles, setTitles] = useState({}); // State for titles of each image
    const [sortOrders, setSortOrders] = useState({}); // State for sort orders of each image

    const handleTitleChange = (e, index) => {
        setTitles({ ...titles, [index]: e.target.value });
        files[index].title = e.target.value;
    };

    const handleSortOrderChange = (e, index) => {
        setSortOrders({ ...sortOrders, [index]: e.target.value });
        files[index].sortOrder = e.target.value;
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
                value={titles[index] || ''}
                onChange={(e) => handleTitleChange(e, index)}
            />
            <InputText
                type="text"
                placeholder="Sort Order"
                value={sortOrders[index] || ''}
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

    const handleSubmit = (e) => {
        e.preventDefault();
        // Submit data with files, titles, and sort orders
        console.log(' imagesData ', imagesData);
    };

    return (
        <div className='row'>

            <form onSubmit={handleSubmit}>
                <h1>Product Form</h1>
                <div className="bg-white shadow rounded">
                    <div className="row">
                        <div className="col-md-6">
                            <div className="row">
                                <div className='col-sm-4 form-group p-2'>
                                    <div>
                                        <label>Product Name<span className="text-danger">*</span></label>
                                    </div>
                                    <div>
                                        <InputText id="product_name" name='product_name' />
                                    </div>
                                </div>
                                <div className='col-sm-4 form-group p-2'>
                                    <div>
                                        <label>Product SKU<span className="text-danger">*</span></label>
                                    </div>
                                    <div>
                                        <InputText />
                                    </div>
                                </div>
                                <div className='col-sm-4 form-group p-2'>
                                    <div>
                                        <label> Product Tag </label>
                                    </div>
                                    <div>
                                        <InputText />
                                    </div>
                                </div>
                                <div className="col-sm-4 form-group p-2">
                                    <div>
                                        <label> Product Tag </label>
                                    </div>
                                    <div>
                                        <InputTextarea rows={5} cols={30} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-6">
                            <Fieldset legend="Gallery Images">
                                <Previews onImagesChange={setImagesData} /> {/* Render the Previews component */}
                            </Fieldset>
                        </div>
                    </div>
                </div>
                <Button type="submit">Submit</Button>
            </form>
        </div>
    );
}

export default ProductForm;