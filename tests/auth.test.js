const request = require('supertest');
const { expect } = require('chai');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
require('dotenv').config();  // Ensure dotenv is correctly required

const app = require('../app');

let mongoServer;

describe('Auth Routes', function() {
  // Increase the timeout to 10000ms (10 seconds)
  this.timeout(10000);

  before(async function() {
    this.timeout(10000); // Increase the timeout for the before hook
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();

    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }).then(() => {
      console.log('Connected to in-memory MongoDB');
    }).catch(err => {
      console.error('MongoDB connection error:', err);
      throw err;
    });
  });

  after(async function() {
    this.timeout(10000); // Increase the timeout for the after hook
    await mongoose.disconnect();
    await mongoServer.stop();
    console.log('Disconnected from in-memory MongoDB');
  });

  it('should authenticate a user and return a JWT token', async function() {
    this.timeout(5000); // Increase the timeout for this test case
    const response = await request(app)
      .post('/auth/login')
      .send({ walletAddress: '0x1234567890abcdef1234567890abcdef12345678' });

    expect(response.status).to.equal(200);
    expect(response.body).to.have.property('token');
  });
});





