const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const usersFilePath = path.join(__dirname, '../data/users.json');

// Read users from JSON file
function getUsers() {
  if (!fs.existsSync(usersFilePath)) {
    return [];
  }
  const usersData = fs.readFileSync(usersFilePath);
  return JSON.parse(usersData);
}

// Write users to JSON file
function saveUsers(users) {
  fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
}

// Find user by wallet address
function findUserByWallet(walletAddress) {
  const users = getUsers();
  return users.find(user => user.walletAddress === walletAddress);
}

// Create new user
async function createUser(walletAddress, password) {
  const users = getUsers();
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = { walletAddress, password: hashedPassword };
  users.push(newUser);
  saveUsers(users);
  return newUser;
}

// Validate user password
async function validatePassword(walletAddress, password) {
  const user = findUserByWallet(walletAddress);
  if (user) {
    return await bcrypt.compare(password, user.password);
  }
  return false;
}

// Generate JWT token
function generateToken(walletAddress) {
  return jwt.sign({ walletAddress }, process.env.JWT_SECRET, { expiresIn: '1h' });
}

module.exports = {
  getUsers,
  findUserByWallet,
  createUser,
  validatePassword,
  generateToken,
  saveUsers
};



  