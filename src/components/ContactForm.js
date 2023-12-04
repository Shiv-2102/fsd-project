import React, { useState } from 'react';
import Alert from '../components/Alert';
import Navbar from './Navbar';

const ContactForm = (props) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        contactNo: '',
        message: '',
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Send form data to the server
            const response = await fetch('http://localhost:5000/api/notes/submitcontact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                // console.log('Query submitted successfully!');
                props.showAlert('Query Submitted Successfully!', 'success');

            } else {
                console.error('Failed to submit query:', response.statusText);
            }
        } catch (error) {
            console.error('Error submitting query:', error.message);
        }
    };

    return (
        <>
            <div className="App">
                <Navbar title="Cloudbook" link1="About" link2="Contact Us" />
            </div>
            <Alert />

            <div className="container text-center" style={{
                padding: '10px 20%',
                backgroundColor: 'white',
                border: '4px solid #2b3035',
                borderRadius: '15px',
                width: '90%',
                maxWidth: '500px',
                padding: '40px 40px',
                textAlign: 'center',
                marginTop: '100px'
            }}>

                <h1 className='mb-3'>Contact Us</h1>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        className="form-control"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder='Enter Your Name'
                        required
                    /><br />

                    <input
                        type="email"
                        className="form-control"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder='Enter Your Email'
                        required
                    /><br />

                    <input
                        type="tel"
                        className="form-control"
                        id="contactNo"
                        name="contactNo"
                        value={formData.contactNo}
                        placeholder='Enter Your Contact Number'
                        onChange={handleChange}
                        required
                    /><br />

                    <textarea
                        id="message"
                        className="form-control"
                        name="message"
                        value={formData.message}
                        placeholder='Enter Your Message'
                        onChange={handleChange}
                        required
                    ></textarea><br />

                    <button className="btn btn-success" type="submit">Submit</button>
                </form>
            </div>
        </>
    );
};

export default ContactForm;
