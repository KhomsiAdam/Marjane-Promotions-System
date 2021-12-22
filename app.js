// dotenv
require('dotenv').config();

// Express
const express = require('express');
const bodyParser = require('body-parser');

// Database
const db = require('./config/database');

// Bcrypt
const bcrypt = require('bcryptjs');

// Models
const SuperAdmin = require('./models/SuperAdmin');
const Admin = require('./models/Admin');
const Manager = require('./models/Manager');
const Center = require('./models/Center');
const Product = require('./models/Product');
const Promotion = require('./models/Promotion');

// Routes
const superRoutes = require('./routes/superRoutes');
const adminRoutes = require('./routes/adminRoutes');
const managerRoutes = require('./routes/managerRoutes');

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// Endpoints
app.use('/super', superRoutes);
app.use('/admin', adminRoutes);
app.use('/manager', managerRoutes);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

// Relations
Admin.belongsTo(Center);
Manager.belongsTo(Center);
Promotion.belongsTo(Product);

//* Uncomment to drop tables and migrate fresh
// db.sync({ force: true })
// .then(result => {
//         bcrypt.hash('superadmin', 12).then(hashed => {
//             SuperAdmin.create({ email: 'superadmin@marjane.com', password: hashed });
//         })
//         Center.create({ name: 'Marjane Centre Ville', city: 'Safi' });
//         Center.create({ name: 'Marjane Hay Riad', city: 'Rabat' });
//         Product.create({ name: 'Camera', category: 'Multimedia', price: 4000, quantity: 80 });
//         Product.create({ name: 'TV', category: 'Multimedia', price: 8000, quantity: 20 });
//         Product.create({ name: 'M&Ms', category: 'Candy', price: 60, quantity: 80 });
//         Product.create({ name: 'Snickers', category: 'Candy', price: 40, quantity: 20 });
//     })
db.sync()
    .then(result => {
        app.listen(process.env.PORT || 3000, () => console.log('Server running'));
    })
    .catch(err => {
        console.log(err);
    })
