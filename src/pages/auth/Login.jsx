import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from "universal-cookie";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Login() {

    const navigate = useNavigate();
    const cookies = new Cookies();
    return (
        <Formik
            initialValues={{ username: '', password: '' }}
            validationSchema={Yup.object({
                username: Yup.string().required('Username is required'),
                password: Yup.string().required('Password is required')
            })}
            onSubmit={(values, { setSubmitting }) => {
                // You can handle form submission here, e.g., make an API call
                console.log('Form submitted:', values);
                const apiUrl = 'http://localhost:3200/api/users/login';
                const configurations = {
                    method: 'post',
                    url: apiUrl,
                    data: values
                }
                axios(configurations)
                    .then((result) => {
                        if (result.data.status === 1) {
                            toast.error(result.data.message);
                        } else {
                            toast.success(result.data.message);

                            cookies.set("TOKEN", result.data.token, {
                                path: "/",
                            });
                            setTimeout(() => {
                                navigate('/');
                            }, 1000);
                        }

                    })
                    .catch((error) => { console.log(error); })
                setSubmitting(false);
            }}
        >
            <div className="login-page bg-light">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-10 offset-lg-1">
                            <h3 className="mb-3">Login Now</h3>
                            <div className="bg-white shadow rounded">
                                <div className="row">
                                    <div className="col-md-7 pe-0">
                                        <div className="form-left h-100 py-5 px-5">
                                            <Form className="row g-4">
                                                <div className="col-12">
                                                    <label>Username<span className="text-danger">*</span></label>
                                                    <div className="input-group">
                                                        <Field type="text" id="username" name="username" className="form-control" />
                                                        <ErrorMessage name="username" />
                                                    </div>
                                                </div>

                                                <div className="col-12">
                                                    <label>Password<span className="text-danger">*</span></label>
                                                    <div className="input-group">
                                                        <Field type="password" id="password" name="password" className="form-control" />
                                                        <ErrorMessage name="password" />
                                                    </div>
                                                </div>

                                                {/* <div className="col-sm-6">
                                                    <div className="form-check">
                                                        <input className="form-check-input" type="checkbox" id="inlineFormCheck" />
                                                        <label className="form-check-label" htmlFor="inlineFormCheck">Remember me</label>
                                                    </div>
                                                </div>

                                                <div className="col-sm-6">
                                                    <a href="#" className="float-end text-primary">Forgot Password?</a>
                                                </div> */}
                                                <div className="col-sm-6">
                                                    <Link to="/register" className='float-start text-primary' > Create Account</Link>
                                                </div>

                                                <div className="col-sm-6">
                                                    <button type="submit" className="btn btn-primary px-4 float-end mt-4">login</button>
                                                </div>
                                            </Form>
                                        </div>
                                    </div>
                                    <div className="col-md-5 ps-0 d-none d-md-block">
                                        <div className="form-right h-100 bg-primary text-white text-center pt-5">
                                            <i className="bi bi-bootstrap"></i>
                                            <h2 className="fs-1">Welcome!!!</h2>
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

export default Login;