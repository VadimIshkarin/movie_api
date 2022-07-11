const express = require("express"),
  morgan = require("morgan");
let topTenMovies = [
  { title: "Lord of the Rings", author: "J.R.R. Tolkien" },
  { title: "Equilibrium", author: "Kurt Wimmer" },
  { title: "Alien", authors: "Dan O'Bannon, Ronald Shusett" },
  { title: "Predator", authors: "Jim and John Thomas" },
  { title: "The Matrix", authors: "Lana and Lilly Wachowski" },
  { title: "Back to the Future", authors: "Robert Zemeckis, Bob Gale" },
  { title: "Inception", author: "Christopher Nolan" },
  { title: "The Dark Knight", author: "Christopher Nolan" },
  { title: "Interstellar", authors: "Christopher and Jonathan Nolan" },
  { title: "The Abyss", author: "James Cameron" },
];
// GET requests
const app = express();
app.use(morgan("common"));

app.get("/", (req, res) => {
  res.send("This is my top 10 movie list!");
});

app.use(express.static("public"));
// app.get("/documentation", (req, res) => {
//   res.sendFile("public/documentation.html", { root: __dirname });
// });

app.get("/movies", (req, res) => {
  res.json(topTenMovies);
});

//Error Handling in Express
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// listen for requests
app.listen(8080, () => {
  console.log("Your app is listening on port 8080.");
});
