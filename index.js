const express = require('express');
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app = express();
const saltRounds = 10;
const port = 3000;

// use middelware
app.use(express.json());

app.get('/api/v1/pengguna', async (req, res) => {
  const get_pengguna = await prisma.pengguna.findMany();

  res.json({
    message: 'success',
    data: get_pengguna
  });
})

app.post('/api/v1/pengguna', async (req, res) => {
  bcrypt.genSalt(saltRounds, (err, salt) => {
    if (err) {
      return;
    }

    const userPassword = req.body.password;
    bcrypt.hash(userPassword, salt, async (err, hash) => {
      if (err) {
        // Handle error
        return;
      }

      // Hashing successful, 'hash' contains the hashed password
      const create_pengguna = await prisma.pengguna.create({
        data: {
          nama: req.body.nama,
          email: req.body.email,
          password: hash,
        }
      });

      return res.json({
        message: 'success',
        data: create_pengguna
      });
    });
  });
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
})