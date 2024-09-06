const express = require('express');
const app = express();
var fs = require("fs");
var dotenv = require("dotenv");
var cors = require("cors");
const { pool } = require("./connectDB");
const bcrypt = require("bcrypt");

dotenv.config();

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-origin", "*")
  res.setHeader('Access-Control-Allow-Methods', "GET,POST,OPTIONS")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  next();
})
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    try {
        return res.status(200).json({
          message: " Welcome to Simple Test API",
        });
      } catch (error) {
        return res.status(500).json({
          message: "Internal Server Error",
        });
      }
});

app.post('/auth/sign-up', async (req, res) => {
  try {
    let { name, email, password } = req.body;

    console.log({
      name,
      email,
      password
    });

    hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);
    
    pool.query(
      `SELECT * FROM users
        WHERE email = $1`,
      [email],
      (err, results) => {
        if (err) {
          console.log(err);
        }
        console.log(results.rows);

        if (results.rows.length > 0) {
          return res.status(200).json({
            message: "Email already registered",
            success: false
          });
        } else {
          pool.query(
            `INSERT INTO users (name, email, password)
                VALUES ($1, $2, $3)
                RETURNING did, password`,
            [name, email, hashedPassword],
            (err, results) => {
              if (err) {
                return res.status(500).json({
                  message: "Internal Server Error",
                });
              }
              console.log(results.rows);
              return res.status(200).json({
                message: " You have successfully signed up!",
                success: true
              });
            }
          );
        }
      }
    );
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
  
});

app.post('/auth/sign-in', async (req, res) => {
  try {
    let { email, password } = req.body;

    console.log({
      email,
      password
    });
    
    pool.query(
      `SELECT * FROM users
        WHERE email = $1`,
      [email],
      (err, results) => {
        if (err) {
          return res.status(500).json({
            message: "Internal Server Error",
          });
        }
        console.log(results.rows);

        if (results.rows.length > 0) {
          var hashedPassword = results.rows[0]['password'];
          bcrypt.compare(password, hashedPassword, function(err, result) {
            if (err) {
              return res.status(500).json({
                message: "Internal Server Error",
              });
            }
            if (result) {
              return res.status(200).json({
                message: "Login was successful! Welcome!",
                success: true,
                user: results.rows[0]['name']
              });
            }
            else {
              return res.status(200).json({
                message: "User email or password incorrect",
                success: false
              });
            }
          });
        } else {
          return res.status(200).json({
            message: "User email or password incorrect",
            success: false
          });
        }
      }
    );
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

app.listen(PORT, async () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
