import React, { useContext } from 'react'
import noteContext from '../context/notes/noteContext';

export default function Noteitem(props) {
    const context = useContext(noteContext);
    const { deleteNote } = context;
    const { note, updateNote } = props;

    return (
        <div className="container">
            <div className="card my-3" style={{ width: '70em' }}>
                <div className="card-body">
                    <h5 className="card-title">{note.title}</h5>
                    <h6 className="card-title">{note.category}</h6>
                    <p className="card-text">{note.description}</p>
                    <i className="fa-solid fa-trash mx-2" onClick={() => {
                        deleteNote(note._id);
                        props.showAlert("Note Deleted!", "danger");
                    }}></i>
                    <i className="fa-solid fa-pencil mx-2" onClick={() => { updateNote(note) }}></i>
                </div>
            </div>
        </div >
    )
} 
