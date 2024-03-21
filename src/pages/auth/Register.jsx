import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Register() {

    const phoneRegExp = RegExp(
        /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/
      );
    const navigate = useNavigate();

    return (

        <Formik
            initialValues={{ username: '', password: '', mobile_no: '', confirm_password: '' }}
            validationSchema={Yup.object({
                username: Yup.string().required('Username is required'),
                mobile_no: Yup.string().required('Mobile Number is required').matches(phoneRegExp, 'Phone number is not valid'),
                password: Yup.string().required('Password is required').min(4, "Minimum 4 digits need"),
                confirm_password: Yup.string().required('Confirm Password is required').oneOf([Yup.ref('password'), null], 'Passwords must match')
            })}
            onSubmit={(values, { setSubmitting }) => {
                // You can handle form submission here, e.g., make an API call
                console.log('Form submitted:', values);
                const apiUrl = 'http://localhost:3200/api/users/register';
                const configurations = {
                    method: 'post',
                    url: apiUrl,
                    data: values
                }
                axios(configurations)
                .then((result) => {
                    if(result.data.status === 0) {
                        toast.success(result.data.message);
                        setTimeout(() => {
                            navigate('/login');
                        }, 1000);
                    } else {
                        toast.error(result.data.message);
                    }

                })
                .catch((error) => {
                    console.log(error);
                    toast.error(error.response.data.message);
                })
                setSubmitting(false);
            }}
        >
            <div className="login-page bg-light">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-10 offset-lg-1">
                            <h3 className="mb-3">Create Account</h3>
                            <div className="bg-white shadow rounded">
                                <div className="row">
                                    <div className="col-md-12 pe-0">
                                        <div className="form-left h-100 py-5 px-5">
                                            <Form className="row g-4">
                                                <div className="col-12">
                                                    <label>Username<span className="text-danger">*</span></label>
                                                    <div className="input-group">
                                                        <Field type="text" id="username" name="username" className="form-control" />
                                                    </div>
                                                    <div className='text-danger mt-2'>
                                                        <ErrorMessage name="username" />
                                                    </div>
                                                </div>
                                                <div className="col-12">
                                                    <label>Mobile Number<span className="text-danger">*</span></label>
                                                    <div className="input-group">
                                                        <Field type="text" id="mobile_no" name="mobile_no" className="form-control" />
                                                    </div>
                                                    <div className='text-danger mt-2'>
                                                        <ErrorMessage name="mobile_no" />
                                                    </div>
                                                </div>
                                                <div className="col-12">
                                                    <label>Password<span className="text-danger">*</span></label>
                                                    <div className="input-group">
                                                        <Field type="password" id="password" name="password" className="form-control"/>
                                                    </div>
                                                    <div className='text-danger mt-2'>
                                                        <ErrorMessage name="password" />
                                                    </div>
                                                </div>
                                                <div className="col-12">
                                                    <label>Confirm Password<span className="text-danger">*</span></label>
                                                    <div className="input-group">
                                                        <Field type="password" id="confirm_password" name="confirm_password" className="form-control"/>
                                                    </div>
                                                    <div className='text-danger mt-2'>
                                                        <ErrorMessage name="confirm_password" />
                                                    </div>
                                                </div>

                                                <div className="col-sm-6">
                                                    <Link to="/login" className='float-start text-primary' > Already User? Try Signin </Link>
                                                </div>

                                                <div className="col-12">
                                                    <button type="submit" className="btn btn-primary px-4 float-end mt-4">login</button>
                                                </div>
                                            </Form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <ToastContainer />
            </div>
        </Formik>
    )
}

export default Register;