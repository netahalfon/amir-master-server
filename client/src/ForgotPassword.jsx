import React from "react";
import { useState } from 'react'
import { Link } from "react-router-dom";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

function ForgotPassword(){
    const [email, setEmail] = useState();
    const [error, setError] = useState('');
     const navigate = useNavigate();
        
        const handleSubmit = (e) => {
            e.preventDefault();
            axios.post('http://localhost:3001/api/user/forgotPassword', {email})
                .then(result => {
                    console.log(result)
                    //TODO: Display success message or redirect to another page
                    navigate('/login')
                })
                .catch(err =>{
                    setError(err.response.data.message)
                    console.log(err)
                });
        }
     
        return(
            <div className="d-flex justify-content-center align-items-center bg-secondary vh-100">
                <div className="bg-white p-3 rounded w-25">
                    {/* login */}
                    <h2>Forgot Password</h2>
                    <form onSubmit={handleSubmit}>
    
                        {/* email */}
                        <div className="mb-3">
                            <label htmlFor="email">
                                <strong>Email</strong>
                            </label>
                            <input
                                type="email"
                                placeholder="Enter Email"
                                autoComplete="off"
                                name="email"
                                className="form-control rounded-0"
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
    
    
                        {/* send email button*/}
                        <button type="submit" className="btn btn-primary w-100 rounded-0">Send the password to email </button>
                    </form>
                    
                    {/* Display error message if it exists */}
                    {error && <div style={{ color: 'red' }}>{error}</div>}

                    {/* sign up login */}
                    <p className="text-center mt-2">
                        <Link to="/signup">SignUp</Link>
                        <span className="mx-2">|</span>
                        <Link to="/login">Login</Link>
                    </p>        
                </div>
            </div>
        )
}

export default ForgotPassword 