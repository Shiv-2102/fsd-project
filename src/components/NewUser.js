import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function NewUser() {
    const [credentials, setCredentials] = useState({ name: '', username: '', email: '', password: '', cpassword: '' });
    const [isCreatingAccount, setIsCreatingAccount] = useState(false); 
    const [alert, setAlert] = useState({ type: null, message: '' });

    let history = useNavigate();
    const host = process.env.REACT_APP_API_URL;

    const handleSubmit = async (e) => {
        e.preventDefault();

        setIsCreatingAccount(true);

        if (credentials.password !== credentials.cpassword) {
            alert('Passwords Do Not match!');
            setIsCreatingAccount(false);
            return;
        }

        const response = await fetch(`${host}/api/auth/createuser`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: credentials.name, username: credentials.username, email: credentials.email, password: credentials.password }),
        });

        const json = await response.json();

        if (json.success) {
            localStorage.setItem('token', json.authToken);
            history('/');
        } else {
            setAlert({
                type: 'danger',
                message: json.message,
            });
            setIsCreatingAccount(false);
        }
    };


    const onChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    return (
        <>

            {alert.type && (
                <div className={`alert alert-${alert.type}`} role="alert">
                    {alert.message}
                </div>
            )}

            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '100vh'
                }}
            >
                <div
                    className="container"
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
                        <b>Create Account</b>
                    </h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3 my-5">
                            <input
                                type="text"
                                className="form-control"
                                name="name"
                                placeholder="Enter your Name"
                                autoComplete="name"
                                minLength={5}
                                value={credentials.name}
                                onChange={onChange}
                                style={{ width: '100%' }}
                                required
                            />
                        </div>

                        <div className="mb-3">
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
                        <div className="mb-3">
                            <input
                                type="email"
                                className="form-control"
                                name="email"
                                placeholder="Email Address"
                                autoComplete="email"
                                value={credentials.email}
                                onChange={onChange}
                                style={{ width: '100%' }}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <input
                                type="password"
                                className="form-control"
                                name="password"
                                placeholder="Password"
                                autoComplete="current-password"
                                minLength={8}
                                value={credentials.password}
                                onChange={onChange}
                                style={{ width: '100%' }}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <input
                                type="password"
                                className="form-control"
                                name="cpassword"
                                placeholder="Confirm Password"
                                autoComplete="current-password"
                                minLength={8}
                                value={credentials.cpassword}
                                onChange={onChange}
                                style={{ width: '100%' }}
                                required
                            />
                        </div>

                        <button className="btn btn-success mt-4" disabled={isCreatingAccount}>
                            <b>{isCreatingAccount ? "Creating Account..." : "Create Account"}</b>
                        </button>
                    </form>

                    <Link to="/home">
                        <button className="btn btn-sm btn-primary mt-3">
                            <b>Back</b>
                        </button>
                    </Link>
                </div>
            </div>

        </>
    );
}
