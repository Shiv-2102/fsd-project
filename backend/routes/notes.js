const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const Notes = require('../models/Notes');
const { body, validationResult } = require('express-validator');

// ROUTE 1: Fetch Notes by Category from the user 
router.get('/fetchnotes', fetchuser, async (req, res) => {
    const { category } = req.query; // Extract the category query parameter

    try {
        // Construct a query to filter notes by user and optionally by category
        const query = { user: req.user.id };
        if (category) {
            query.category = category;
        }

        const notes = await Notes.find(query)

        res.json(notes);

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error!");
    }
});


// ROUTE 2: Add note 
router.post('/addnote', fetchuser, [
    body('title', 'Enter a Valid Title').isLength({ min: 3 }),
    body('description', 'Note Description must be atleast 8 characters').isLength({ min: 8 }),
], async (req, res) => {

    const { title, description, category } = req.body;

    // If there is any error, return bad request and array of errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: result.array() });
    }

    try {
        const note = new Notes({
            title, description, category, user: req.user.id
        })

        const newNote = await note.save();
        res.json(newNote);

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error!");
    }
});

// ROUTE 3: Update an existing note 

router.put('/updatenote/:id', fetchuser, async (req, res) => {
    // Get new title description from body
    const { title, description, category } = req.body;

    // Create new note 
    const newNote = {};

    // Add New Title, Description and Category to new Note
    if (title) { newNote.title = title };
    if (description) { newNote.description = description };
    if (category) { newNote.category = category };

    // Find Note with the same ID in the request
    let note = await Notes.findById(req.params.id);
    if (!note) { res.status(404).send("Not Found!") };

    if (note.user.toString() !== req.user.id) {
        return res.status(401).send("Not Allowed!");
    }

    // Update the note and Send response
    note = await Notes.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true });
    res.json({ note });
});

// ROUTE 4: Delete an existing note
router.delete('/deletenote/:id', fetchuser, async (req, res) => {

    // Find Note with the same ID in the request
    let note = await Notes.findById(req.params.id);
    if (!note) { res.status(404).send("Not Found!") };

    if (note.user.toString() !== req.user.id) {
        return res.status(401).send("Not Allowed!");
    }

    // Update the note and Send response
    note = await Notes.findByIdAndDelete(req.params.id);
    res.json({ Success: "The Note has been deleted successfully!", note: note });
});

module.exports = router;