import React, { useEffect } from 'react';
import Navbar from './Navbar'
import { useNavigate } from 'react-router-dom';

export default function About() {

    let history = useNavigate();

    useEffect(() => {
        if (!localStorage.getItem('token')) {
            history("/");
        }

        else {
            console.log(localStorage.getItem('token'))
        }

        //eslint-disable-next-line
    }, [])


    return (
        <>
            <div className="App">
                <Navbar title="Cloudbook" link1="About" link2="Contact Us" />
            </div>

            <div className="container my-5">
                <h1>About Cloudbook</h1>
                <p>
                    Welcome to Cloudbook, your online cloud storage solution for notes.
                    Cloudbook is designed to help you store, organize, edit, and manage your notes with ease.
                </p>
                <ul>
                    <li>Effortlessly create and categorize your notes.</li>
                    <li>Ensure the security and privacy of your data.</li>
                </ul>
            </div>
        </>

    )
}
