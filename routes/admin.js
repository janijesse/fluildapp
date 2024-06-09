const express = require('express');
const { getUsers } = require('../models/user');

const router = express.Router();

router.get('/', (req, res) => {
    const users = getUsers();
    res.render('admin', { users });
});

module.exports = router;

