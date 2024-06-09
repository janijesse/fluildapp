const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');
const multer = require('multer');
const { exec } = require('child_process');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Set the view engine to ejs
app.set('view engine', 'ejs');

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'data/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// Route to serve the index page
app.get('/', (req, res) => {
  // Define items array (you can also load this from a data source)
  const items = []; // Example: const items = [{ name: 'Item 1', description: 'Description 1' }];

  // Load users from data/users.json
  const usersFilePath = path.join(__dirname, 'data/users.json');
  let users = [];
  if (fs.existsSync(usersFilePath)) {
    const usersData = fs.readFileSync(usersFilePath);
    users = JSON.parse(usersData);
  }

  res.render('index', { items, users });
});

// Route to serve the profile page
app.get('/profiles', (req, res) => {
  const usersFilePath = path.join(__dirname, 'data/users.json');
  let users = [];
  if (fs.existsSync(usersFilePath)) {
    const usersData = fs.readFileSync(usersFilePath);
    users = JSON.parse(usersData);
  }
  res.render('profiles', { users: users });
});

// Route to handle profile form submission
app.post('/profiles', upload.single('idImage'), (req, res) => {
  const newUser = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    age: req.body.age,
    address: req.body.address,
    postalCode: req.body.postalCode,
    country: req.body.country,
    id: req.body.id,
    bio: req.body.bio,
    walletAddress: req.body.walletAddress,
    idImage: req.file.filename
  };

  const userData = JSON.stringify(newUser);
  const saveAndEncryptPath = path.join(__dirname, 'saveAndEncrypt.js');

  exec(`node ${saveAndEncryptPath} '${userData}'`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Execution error: ${error}`);
      console.error(`stderr: ${stderr}`);
      return res.status(500).send('Internal Server Error');
    }
    console.log(`stdout: ${stdout}`);
    res.redirect('/profiles');
  });
});

// Route to serve the transfer page
app.get('/transfer', (req, res) => {
  res.render('transfer');
});

// Route to serve the admin page
app.get('/admin', (req, res) => {
  res.render('admin');
});

// Route to serve the login page
app.get('/login', (req, res) => {
  res.render('login');
});

// Route to serve the pools page
app.get('/pools', (req, res) => {
  res.render('pools');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});




















