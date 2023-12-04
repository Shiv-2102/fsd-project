import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Login(props) {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [isLoggingIn, setIsLoggingIn] = useState(false); // State to track if login is in progress
    let history = useNavigate();
    const host = process.env.REACT_APP_API_URL;

    const handleLogin = async (e) => {
        e.preventDefault();

        // Disable the "Login" button and set text to "Logging In"
        setIsLoggingIn(true);

        const response = await fetch(`${host}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username: credentials.username, password: credentials.password }),
        });

        const json = await response.json();

        if (json.success) {
            localStorage.setItem('token', json.authToken);
            history('/');
        } else {
            alert('Invalid Credentials!');
            setIsLoggingIn(false); // Enable the button again
        }
    };

    const onChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh'
            }}
        >
            <div
                className="container text-center"
                style={{
                    backgroundColor: 'white',
                    border: '4px solid #2b3035',
                    borderRadius: '15px',
                    width: '90%',
                    maxWidth: '500px',
                    padding: '40px 40px',
                    textAlign: 'center',
                }}
            >
                <h2>
                    <b>Login</b>
                </h2>
                <form onSubmit={handleLogin}>
                    <div className="mb-3 my-5">
                        <input
                            type="text"
                            className="form-control"
                            name="username"
                            placeholder="Username"
                            autoComplete="username"
                            value={credentials.username}
                            onChange={onChange}
                            style={{ width: '100%' }}
                            required
                        />
                    </div>
                    <div className="mb-3 my-4">
                        <input
                            type="password"
                            className="form-control"
                            name="password"
                            placeholder="Password"
                            autoComplete="current-password"
                            value={credentials.password}
                            onChange={onChange}
                            style={{ width: '100%' }}
                            required
                        />
                    </div>

                    <button className="btn btn-success mb-3 mt-4" disabled={isLoggingIn}>
                        <b>{isLoggingIn ? "Logging In..." : "Login"}</b>
                    </button>
                    <br />
                </form>

                <Link to="/forgotpassword">
                    <button className="btn btn-danger mt-2">
                        <b>Forgot Password</b>
                    </button>
                </Link>

                <Link to="/home">
                    <button className="btn btn-primary mt-2 mx-2">
                        <b>Back</b>
                    </button>
                </Link>
            </div>
        </div>
    );
}
