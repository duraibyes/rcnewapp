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
function Previews({ onFilesChange }) {
    const [files, setFiles] = useState([]);
    const [titles, setTitles] = useState({});
    const [sortOrders, setSortOrders] = useState({});

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
            <div style={thumbInner}>
                {file.type.startsWith('image/') ? (
                    <img
                        src={file.preview}
                        style={img}
                        alt={`Preview ${index}`}
                        onLoad={() => URL.revokeObjectURL(file.preview)}
                    />
                ) : (
                    <div>
                        {/* Render different UI for non-image files */}
                        <p>{file.name}</p>
                    </div>
                )}
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

    const handleDrop = useCallback((acceptedFiles) => {
        const updatedFiles = acceptedFiles.map((file) => ({
            file,
            title: '',
            sortOrder: '',
            preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
        }));
        setFiles(updatedFiles);
        onFilesChange(updatedFiles);
    }, [onFilesChange]);

    const { getRootProps, getInputProps } = useDropzone({
        accept: ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.txt'], // Accept various file formats
        onDrop: handleDrop,
    });

    useEffect(() => {
        return () => files.forEach((file) => URL.revokeObjectURL(file.preview));
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

export default ProductForm1