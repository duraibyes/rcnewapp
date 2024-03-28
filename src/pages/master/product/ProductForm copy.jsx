import React, { useCallback, useState } from 'react'
import { InputText } from 'primereact/inputtext';
import { FileUploader } from "react-drag-drop-files";
import { useDropzone } from 'react-dropzone';

const fileTypes = ["JPG", "PNG", "GIF"];

const ProductForm1 = () => {
    const [file, setFile] = useState(null);
    const handleChange = (file) => {
        setFile(file);
    };

    const onDrop = useCallback(acceptedFiles => {
        // Do something with the files
    }, [])
    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })
    return (
        <>
            <div className="Category-page bg-light">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-lg-12">
                            <h3 className="mb-3"> Products </h3>
                            <div className="bg-white shadow rounded">
                                <div className="row">
                                    <div className="col-md-8">
                                        <div className='form-group p-2'>
                                            <div>
                                                <label>Product Name<span className="text-danger">*</span></label>
                                            </div>
                                            <div>
                                                <InputText id="product_name" name='product_name' />
                                            </div>
                                        </div>
                                        <div className='form-group p-2'>
                                            <div>
                                                <label>Product SKU<span className="text-danger">*</span></label>
                                            </div>
                                            <div>
                                                <InputText />
                                            </div>
                                        </div>
                                        <div className='form-group p-2'>
                                            <div>
                                                <label> Product Tag </label>
                                            </div>
                                            <div>
                                                <InputText />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <FileUploader handleChange={handleChange} name="file" types={fileTypes} />
                                    </div>
                                    <div className="col-sm-12">
                                        <div {...getRootProps()}>
                                            <input {...getInputProps()} />
                                            {
                                                isDragActive ?
                                                    <p>Drop the files here ...</p> :
                                                    <p>Drag 'n' drop some files here, or click to select files</p>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ProductForm1