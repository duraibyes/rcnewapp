import React, { useEffect, useState } from 'react'
import { Button } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';


const AddCategory = ({ show, handleClose, fetchCategoryData, editMode, editData }) => {
  const navigate = useNavigate();
  const [previewImage, setPreviewImage] = useState(null);
  const accessToken = useSelector(state => state.auth.user?.token || null);

  useEffect(() => {
    if (editMode && editData) {
      // If in edit mode and editData is available, populate the form fields with editData
      setPreviewImage(editData.category_image);
    }
  }, [editMode, editData])
  
  console.log(  editData, '  editData ');
  console.log(  editMode, '  editMode ');
  const onInputChange = (e) => {
    const file = e.target.files[0];
    setPreviewImage(URL.createObjectURL(file));
  }

  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Category Form</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            initialValues={{
              name: editMode ? editData.name : '',
              description: editMode ? editData.description : '',
              status: editMode ? editData.is_active === 'yes' : false,
              category_image: ''
            }}
            validationSchema={Yup.object({
              name: Yup.string().required('Category name is required'),
              category_image: Yup.mixed().test(
                "fileType",
                "Invalid file format, only images are allowed",
                (value) => {
                  if (value) {
                    return value && ['image/jpeg', 'image/png', 'image/gif'].includes(value.type);
                  }
                  return true;
                }
              )
            })}
            onSubmit={async (values, { setSubmitting }) => {
              console.log( ' values ', values);
              const apiUrl = editMode ? `http://localhost:3200/api/category/${editData._id}` : 'http://localhost:3200/api/category';
              const method = editMode ? 'put' : 'post';
              const configurations = {
                method,
                url: apiUrl,
                data: values,
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                  "Content-Type": "multipart/form-data"
                }
              }
              await axios(configurations)
                .then((result) => {
                  if (result.data.status === 0) {
                    toast.success(result.data.message);
                    setTimeout(() => {
                      handleClose()
                      fetchCategoryData(1);
                      navigate('/category');
                    }, 1000);
                  } else {
                    toast.error(result.data.message);
                  }
                })
                .catch((error) => {
                  console.log(error);
                })
              setSubmitting(false);
            }}
          >
            {({ values, setFieldValue }) => (

              <Form className="row g-4" >
                <div className="col-12">
                  <label>Category Name<span className="text-danger">*</span></label>
                  <div className="input-group">
                    <input type="hidden" name="_method" value="PUT" />
                    <Field type="text" id="name" name="name" className="form-control" />
                  </div>
                  <div className='text-danger mt-2'>
                    <ErrorMessage name="name" />
                  </div>
                </div>
                <div className="col-12">
                  <label>Icon or Logo</label>
                  <div className="input-group">
                    <Field type="file" id="category_image" name="category_image" value="" onChange={(e) => { onInputChange(e); setFieldValue('category_image', e.currentTarget.files[0]); }} className="form-control" />
                  </div>
                  <div className='text-danger mt-2'>
                    <ErrorMessage name="category_image" />
                    {previewImage && <img src={previewImage} alt="Preview" style={{ maxWidth: "100px", marginTop: "10px" }} />}
                  </div>
                </div>
                <div className="col-12">
                  <label>Description</label>
                  <div className="input-group">
                    <Field name="description" as="textarea" className="form-control" />
                  </div>
                  <div className='text-danger mt-2'>
                    <ErrorMessage name="description" />
                  </div>
                </div>
                <div className="col-12">
                  <label>Status</label>
                  <div className="input-group">
                    <Field type="checkbox" id="checkbox" name="status" />
                    <label htmlFor="checkbox" className='px-3'>
                      Active
                    </label>
                  </div>
                  <div className='text-danger mt-2'>
                    <ErrorMessage name="confirm_password" />
                  </div>
                </div>

                <div className="col-12">
                  <Modal.Footer>
                    <button type="submit" className="btn btn-primary px-4 float-end mt-4">Create</button>
                  </Modal.Footer>
                </div>
              </Form>
            )}
          </Formik>
        </Modal.Body>
      </Modal>
    </>
  )
}
export default AddCategory