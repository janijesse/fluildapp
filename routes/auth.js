const express = require('express');
const { getUsers, saveUsers } = require('../models/user');
const path = require('path');
const { promisify } = require('util');
const runGoExecutable = require('../interaction'); // Import the interaction.js file
const fs = require('fs');
const multer = require('multer');

const router = express.Router();
const writeFile = promisify(fs.writeFile);

// Set up multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Save profile data and process it with Go executables
router.post('/profiles', upload.single('idImage'), async (req, res) => {
  const { firstName, lastName, age, address, postalCode, country, id, bio, walletAddress, profileComplete } = req.body;
  const idImage = req.file;

  if (profileComplete !== 'true') {
    return res.status(400).send('Profile is not complete.');
  }

  const newUser = {
    firstName,
    lastName,
    age,
    address,
    postalCode,
    country,
    id,
    bio,
    walletAddress,
    idImage: idImage.filename // Store the filename of the uploaded image
  };

  // Save the new user data to users.json
  const users = getUsers();
  users.push(newUser);
  saveUsers(users);

  // Save the new user data to input.json for encryption
  const inputData = JSON.stringify(users, null, 2);
  const inputFilePath = path.join(__dirname, '../data/input.json');
  await writeFile(inputFilePath, inputData);

  try {
    // Encrypt the data
    await runGoExecutable('encrypt');

    res.redirect('/profiles');
  } catch (error) {
    console.error('Failed to encrypt the data:', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;










