import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './css/Sidebar.css';

export default function Sidebar() {
    const [notes, setNotes] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const history = useNavigate();
    const host = process.env.REACT_APP_API_URL;

    useEffect(() => {
        fetch(`${host}/api/notes/fetchnotes`, {
            method: 'GET',
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
                setNotes(data);

                const uniqueCategories = [...new Set(data.map(note => note.category))];
                setCategories(uniqueCategories);
            })
            .catch(error => {
                console.error('Error fetching notes data:', error);
            });

    }, []);

    const handleCategoryChange = (event) => {
        const selectedCategory = event.target.value;
        setSelectedCategory(selectedCategory);

        if (selectedCategory) {
            history(`/notes?category=${selectedCategory}`);
        } else {
            history('/notes');
        }
    };

    return (
        <div className="sidebar">
            <Link to="/">Create a New Note</Link>
            <Link to="/notes">View All Notes</Link>

            <select value={selectedCategory} onChange={handleCategoryChange}>
                <option selected hidden>Categories</option>
                {categories.map(category => (
                    <option key={category} value={category}>
                        {category}
                    </option>
                ))}
            </select>
        </div>
    );
}
