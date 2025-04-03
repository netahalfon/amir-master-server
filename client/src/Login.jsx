import React from "react";
import { useState } from 'react'
import { Link } from "react-router-dom";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

function Login(){
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [error, setError] = useState('');
    const navigate = useNavigate();
    
    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:3001/api/user/login', { email, password })
            .then(result => {
                console.log(result)
                const isAdmin = result.data.isAdmin
                if (isAdmin) {
                    navigate('/admin'); // מעבר למסך אדמין
                } else {
                    navigate('/home'); // מעבר למסך משתמש רגיל
                }            })
            .catch(err =>{
                setError(err.response.data.message)
                console.log(err)
            });
    }

    
     
    return(
        <div className="d-flex justify-content-center align-items-center bg-secondary vh-100">
            <div className="bg-white p-3 rounded w-25">
                {/* login */}
                <h2>Login</h2>
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

                    {/* password */}
                    <div className="mb-3">
                        <label htmlFor="password">
                            <strong>Password</strong>
                        </label>
                        <input
                            type="password"
                            placeholder="Enter Password"
                            autoComplete="off"
                            name="password"
                            className="form-control rounded-0"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    
                    {/* forgot password */}
                    <p>
                    <Link to="/forgotPassword">Forgot Password?</Link>
                    </p>


                    {/* login button*/}
                    <button type="submit" className="btn btn-primary w-100 rounded-0">Login</button>
                </form>
                
                {/* Display error message if it exists */}
                {error && <div style={{ color: 'red' }}>{error}</div>}
                
                {/* sign up */}
                <p className="text-center mt-2">
                    Don't have an account?{" "}
                    <Link to="/signup">signUp</Link>
                </p>
            </div>
        </div>
    )
}

export default Login 