import React, { useEffect } from 'react';
import Navbar from './Navbar'
import { useNavigate } from 'react-router-dom';

export default function Conact() {

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

            <div className="container"
                style={{
                    maxWidth: '600px',
                    margin: '50px auto',
                    backgroundColor: '#fff',
                    padding: '20px',
                    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
                    borderRadius: '5px',
                }}>

                <h2>Contact Us</h2>
                <form action="/" method="post">
                    <label for="name">Your Name:</label>
                    <input type="text" id="name" name="name" required />

                    <label for="email">Your Email:</label>
                    <input type="email" id="email" name="email" required />

                    <label for="phone">Your Contact No:</label>
                    <input type="email" id="email" name="email" required />

                    <label for="query">Query:</label>
                    <textarea id="message" name="message" rows="4" required></textarea>

                    <button type="submit">Submit</button>
                </form>
            </div >
        </>

    )
}
