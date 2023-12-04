import React, { useContext, useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import './css/Notes.css';
import noteContext from '../context/notes/noteContext';
import { useNavigate } from 'react-router-dom';
import Alert from './Alert';

export default function CreateNote(props) {
    let history = useNavigate();
    useEffect(() => {
        if (!localStorage.getItem('token')) {
            history("/home")
        }
    })
    const context = useContext(noteContext);
    const { addNote } = context;
    const [note, setNote] = useState({ title: '', description: '', category: '' });

    const handleClick = (e) => {
        e.preventDefault();
        addNote(note.title, note.description, note.category);
        setNote({ title: '', description: '', category: '' });
        props.showAlert('Note Created Successfully!', 'success');
    };

    const onChange = (e) => {
        setNote({ ...note, [e.target.name]: e.target.value });
    };

    return (
        <>
            <div className="App">
                <Navbar title="Cloudbook" link1="About" link2="Contact Us" />
            </div>
            <Alert />
            <Sidebar />
            <div className="container">
                <h1 className="text-center" style={{ marginLeft: '250px', marginBottom: '20px' }}>Create a Note</h1>
                <div className="notes">
                    <div className="row">
                        <div className="col-md-7 col-sm-12 col-12 mb-3">
                            <h5>Title</h5>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                className="form-control"
                                value={note.title}
                                onChange={onChange}
                                placeholder="Example: Shopping List"
                            />
                        </div>
                        <div className="col-md-5 col-sm-12 col-12 mb-3">
                            <h5>Category</h5>
                            <input
                                type="text"
                                id="category"
                                name="category"
                                className="form-control"
                                value={note.category}
                                onChange={onChange}
                                placeholder="Example: priority, personal"
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 mb-3">
                            <h5>Description</h5>
                            <textarea
                                className="form-control custom-textarea"
                                id="description"
                                placeholder="Your Text Goes Here"
                                name="description"
                                rows="8"
                                value={note.description}
                                onChange={onChange}
                            ></textarea>
                        </div>
                    </div>

                    <button
                        disabled={note.title.length < 4 || note.description.length < 8}
                        type="submit"
                        className="btn btn-primary mb-3 mx-2"
                        onClick={handleClick}
                    >
                        Add Note
                    </button>
                </div>
            </div>
        </>
    );
}
