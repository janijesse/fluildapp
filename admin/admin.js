const AdminJS = require('adminjs');
const AdminJSMongoose = require('@adminjs/mongoose');
const mongoose = require('mongoose');
const Item = require('../models/item');
const User = require('../models/user');

AdminJS.registerAdapter(AdminJSMongoose);

const adminJsConfig = {
  resources: [
    {
      resource: User,
      options: {
        properties: {
          encryptedPassword: { isVisible: false },
          password: {
            type: 'string',
            isVisible: {
              list: false, edit: true, filter: false, show: false,
            },
          },
        },
        actions: {
          new: {
            before: async (request) => {
              if (request.payload.password) {
                request.payload = {
                  ...request.payload,
                  encryptedPassword: await User.hashPassword(request.payload.password),
                  password: undefined,
                };
              }
              return request;
            },
          },
        },
      },
    },
    { resource: Item },
  ],
  rootPath: '/admin',
};

module.exports = adminJsConfig;
