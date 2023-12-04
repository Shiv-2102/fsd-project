import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'


export default function Navbar(props) {
    const host = process.env.REACT_APP_API_URL;
    let history = useNavigate();
    const location = useLocation();
    const [userData, setUserData] = useState({});

    useEffect(() => {
        fetch(`${host}/api/auth/getuser`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem('token'),
            },
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setUserData(data);
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
            });
        //eslint-disable-next-line
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        history("/");
    }

    return (
        <div>
            <nav className="navbar navbar-expand-lg bg-body-tertiary" data-bs-theme="dark">
                <div className="container-fluid" >
                    <a className="navbar-brand" href="/">
                        {props.title}</a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNavDropdown">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <Link className={`nav-link ${location.pathname === "/about" ? "active" : ""}`} aria-current="page" to="/about">{props.link1}</Link>
                            </li>
                            <li className="nav-item">
                                <Link className={`nav-link ${location.pathname === "/contact" ? "active" : ""}`} aria-current="page" to="/contact">{props.link2}</Link>
                            </li>
                        </ul>

                        <li className="nav-item dropdown">
                            <a className="btn btn-dark dropdown-toggle" href="/" role="button" data-bs-toggle="dropdown" aria-expanded="false">{userData.username}
                            </a>
                            <ul className="dropdown-menu">
                                {/* eslint-disable-next-line */}
                                <li><a className="dropdown-item" onClick={handleLogout}>Logout</a></li>
                            </ul>
                        </li>
                    </div>



                </div>
            </nav>
        </div>
    )
}
