import { useState } from "react";
import { Link } from "react-router-dom";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

function Signup() {
    
    const [name, setName] = useState();   
    const [email, setEmail] = useState(); 
    const [password, setPassword] = useState(); 
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:3001/api/user/signUp', { name, email, password })
            .then(result => {
                console.log(result)
                navigate('/home')
            })
            .catch(err =>{
                 setError(err.response.data.message)
                 console.log(err)
                });
    }

    return (
        <div className="d-flex justify-content-center align-items-center bg-secondary vh-100">
            <div className="bg-white p-3 rounded w-25">
                <h2>signUp</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="name">
                            <strong>Name</strong>
                        </label>
                        <input
                            type="text"
                            placeholder="Enter Name"
                            autoComplete="off"
                            name="name"
                            className="form-control rounded-0"
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

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

                    <div className="mb-3">
                        <label htmlFor="password">
                            <strong>Password</strong>
                        </label>
                        <input
                            type="password"
                            placeholder="Enter Password"
                            name="password"
                            className="form-control rounded-0"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    {/* singout button*/}
                    <button type="submit" className="btn btn-primary w-100 rounded-0">signUp</button>
                </form>
                {/* Display error message if it exists */}
                {error && <div style={{ color: 'red' }}>{error}</div>}

                {/* login */}
                    <p className="text-center mt-2">
                    Already Have an Account{" "}
                        <Link to="/login">Login</Link>
                    </p>                

            </div>
        </div>
    );
}

export default Signup;
