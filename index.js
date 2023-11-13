import express from "express";
import mysql from "mysql";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = 8800;

app.use(express.json());
app.use(cors());

//connecting to the MySQL db
const db = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  //   rsc = means ReactSqlCRUD
});

//* To check if connection to MYSQL DB is error free or not
db.connect((err) => {
  if (err) console.log(`Err in connecting to the DB :${err}`);
  else {
    console.log("Connected to the db.... ✅");
  }
});

app.get("/", (req, res) => {
  res.json("Server is live 🟢");
});

//* Get all books
app.get("/books", (req, res) => {
  const q = "SELECT * FROM books";
  db.query(q, (err, data) => {
    if (err) {
      console.log(err);
      return res.json(err);
    } else {
      // console.log("data : ", data);
      return res.json(data);
    }
  });
});

//*Add a new book

app.post("/createBook", (req, res) => {
  console.log(req.body);
  //? While specifying the columns like here title , cbout and cover use backticks (`) and not " or '

  const q = "INSERT INTO books (`title`,`about`,`cover`,`price`) VALUES (?)";

  //This question mark is for safety purposes
  const values = [
    req.body.title,
    req.body.about,
    req.body.cover,
    req.body.price,
  ];
  console.log(values);
  db.query(q, [values], (err, data) => {
    if (err) {
      console.log("error", err);
      res.status(400).json(err);
    } else {
      console.log("successfully inserted into table");
      res.status(200).json("successfully inserted into table");
    }
  });
});

app.delete("/delete", (req, res) => {
  console.log("Deleting : ", req.body);
  try {
    const q = "DELETE FROM books  WHERE id=?";
    const values = req.body.id;
    db.query(q, [values], (err, data) => {
      if (err) {
        console.log("error", err);
        res.status(400).json(err);
      } else {
        console.log(data);
        console.log("successfully deleted from table");
        res.status(200).json("successfully deleted from the  table");
      }
    });
  } catch (error) {}
});

app.put("/updateBook/:id", async (req, res) => {
  const id = req.params.id.split(" ")[2];
  console.log("Req Params", req.params.id.split(" ")[2]);
  try {
    const q =
      "UPDATE books SET `title`=? , `about`=? , `cover`=? , `price`=? WHERE id = ?";
    const values = [
      req.body.title,
      req.body.about,
      req.body.cover,
      req.body.price,
    ];

    db.query(q, [...values, id], (err, data) => {
      if (err) {
        console.log("error : ", err);
        res.status(400).json(err);
      } else {
        console.log(data);
        console.log("successfully updated ✅");
        res.status(200).json("successfully updated ✅");
      }
    });
  } catch (error) {}
});
// app.use(function (req, res, next) {});

// Listening
app.listen(PORT, () => {
  console.log(` Running on PORT : ${PORT}.Connected to the backend .... ✅`);
});
