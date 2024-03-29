const express = require("express"),
  bodyParser = require("body-parser"),
  uuid = require("uuid");

const { check, validationResult } = require("express-validator");

//AWS SDK________________________________________
const fs = require("fs");
const fileUpload = require("express-fileupload");
//import a version of the client class that exposes all the service’s commands as methods in a single import
const { S3 } = require("@aws-sdk/client-s3");

const {
  S3Client,
  ListObjectsV2Command,
  PutObjectCommand,
  GetObjectCommand,
} = require("@aws-sdk/client-s3");

const s3Config = {
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_ACCESS_SECRET,
  region: "us-east-1",
};
const s3Client = new S3Client(s3Config);

//Using CORS (added vercel.app)
const cors = require("cors");
// app.use(cors());
//A list of allowed domains within the variable allowedOrigins
let allowedOrigins = [
  "http://localhost:8080",
  "http://testsite.com",
  "http://localhost:1234",
  "http://localhost:4200",
  "https://myflix-client.vercel.app",
  "https://vadimishkarin.github.io/myFlix-Angular-client",
  "https://vadimishkarin.github.io",
  "http://3.239.67.95",
  "http://myflix-bucket-x.s3-website-us-east-1.amazonaws.com",
];

const morgan = require("morgan");
const app = express();
const mongoose = require("mongoose");
const Models = require("./models.js");

const Movies = Models.Movie;
const Users = Models.User;
const Genres = Models.Genre;
const Directors = Models.Director;
// mongoose.connect("mongodb://localhost:27017/myFlixDB", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });
mongoose.connect(process.env.CONNECTION_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
// .then(() => {
//   console.log('Connected to Mongo!');
// })
// .catch((err) => {
//   console.error('Error connecting to Mongo', err);
// });

app.use(fileUpload());
UPLOAD_TEMP_PATH = "/tmp";

app.use(bodyParser.json());
//Serving static documentation file located in public folder
app.use("/", express.static("public"));

//It will set the application to allow requests from certain origins
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        // If a specific origin isn’t found on the list of allowed origins
        let message =
          "The CORS policy for this application doesn't allow access from origin " +
          origin;
        return callback(new Error(message), false);
      }
      return callback(null, true);
    },
  })
);

// Importing auth.js file into my project
let auth = require("./auth")(app);

//Importing passport.js file
const passport = require("passport");
require("./passport");

//log requests to server
app.use(morgan("common"));

//Default text response
app.get("/", (req, res) => {
  res.send("Welcome to MyFlixDB!");
});

//Add new user
app.post(
  "/users",
  [
    check("Username", "Username is required").isLength({ min: 5 }),
    check(
      "Username",
      "Username contains non alphanumeric characters - not allowed."
    ).isAlphanumeric(),
    check("Password", "Password is required").not().isEmpty(),
    check("Email", "Email does not appear to be valid").isEmail(),
    // check("Birthday", "Birthday needs to be a valid date").isDate({
    //   format: "DD-MM-YYYY",
    // }),
  ],
  (req, res) => {
    // check the validation object for errors
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    let hashedPassword = Users.hashPassword(req.body.Password);
    Users.findOne({ Username: req.body.Username })
      .then((user) => {
        if (user) {
          return res.status(400).send(req.body.Username + "already exists");
        } else {
          Users.create({
            Username: req.body.Username,
            Password: hashedPassword,
            Email: req.body.Email,
            Birthday: req.body.Birthday,
          })
            .then((user) => {
              res.status(201).json(user);
            })
            .catch((error) => {
              console.error(error);
              res.status(500).send("Error: " + error);
            });
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send("Error: " + error);
      });
  }
);

//Update user info/profile
app.put(
  "/users/:Username",
  passport.authenticate("jwt", { session: false }),
  [
    check("Username", "Username is required").isLength({ min: 5 }),
    check(
      "Username",
      "Username contains non alphanumeric characters - not allowed."
    ).isAlphanumeric(),
    check("Password", "Password is required").not().isEmpty(),
    // check("Email", "Email does not appear to be valid").isEmail(),
    // check("Birthday", "Birthday needs to be a valid date").isDate({
    //   format: "DD-MM-YYYY",
    // }),
  ],
  (req, res) => {
    // check the validation object for errors
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    let hashedPassword = req.body.Password
      ? Users.hashPassword(req.body.Password)
      : null;
    //if submitting password update it gets hashed

    // let hashedPassword = Users.hashPassword(req.body.Password);
    Users.findOneAndUpdate(
      { Username: req.params.Username },
      {
        $set: {
          Username: req.body.Username,
          // Password: req.body.Password,
          Password: hashedPassword,
          Email: req.body.Email,
          Birthday: req.body.Birthday,
        },
      },
      { new: true }, // This line makes sure that the updated document is returned
      (err, updatedUser) => {
        if (err) {
          console.error(err);
          res.status(500).send("Error: " + err);
        } else {
          res.json(updatedUser);
        }
      }
    );
  }
);

//Delete a user by username
app.delete(
  "/users/:Username",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.findOneAndRemove({ Username: req.params.Username })
      .then((user) => {
        if (!user) {
          res.status(400).send(req.params.Username + " was not found");
        } else {
          res.status(200).send(req.params.Username + " was deleted");
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

//Get all users
app.get(
  "/users",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.find()
      .then((users) => {
        res.status(201).json(users);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

// Get a user by username
app.get(
  "/users/:Username",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.findOne({ Username: req.params.Username })
      .then((user) => {
        res.json(user);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

//Get all movies
app.get(
  "/movies",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Movies.find()
      .then((movies) => {
        res.status(201).json(movies);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

//Get a movie by title
app.get(
  "/movies/:Title",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Movies.findOne({ Title: req.params.Title })
      .then((movie) => {
        res.json(movie);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

///AWS SDK ___________________________________________________________

// Upload an object to a bucket
app.post("/images", async (req, res) => {
  console.log("req.files", req.files);
  const imagefile = req.files.file;
  const fileName = req.files.file.name;
  const tempPath = `${UPLOAD_TEMP_PATH}/${fileName}`;
  imagefile.mv(tempPath, (err) => {
    res.status(500);
  });
  // const fileStream = fs.createReadStream(imagefile);
  // Set the parameters
  const bucketParams = {
    Bucket: "iam-bucket-v",
    // Specify the name of the new object. For example, 'index.html'.
    // To create a directory for the object, use '/'. For example, 'myApp/package.json'.
    Key: fileName,
    // Content of the new object.
    Body: imagefile.data,
  };
  try {
    const data = await s3Client.send(new PutObjectCommand(bucketParams));
    console.log("Success", data);
    res.send(data);
  } catch (err) {
    console.log("Error", err);
  }
});

//List all objects in a bucket
app.get("/images", (req, res) => {
  listObjectsParams = {
    Bucket: "iam-bucket-v",
  };
  s3Client
    .send(new ListObjectsV2Command(listObjectsParams))
    .then((listObjectsResponse) => {
      res.send(listObjectsResponse);
    });
});

//Retrieve an object from a bucket
app.get("/images/:id", async (req, res) => {
  console.log(req.params["id"]);
  const bucketParams = {
    Bucket: "iam-bucket-v",
    Key: req.params["id"],
  };
  try {
    const data = await s3Client.send(new GetObjectCommand(bucketParams));
    res.send(await data.Body.transformToString());
    // return await data.Body.transformToString();
  } catch (err) {
    console.log("Error", err);
  }
});
///___________________________________________________________

//Get genre info when looking for specific genre
app.get(
  "/movies/genre/:Name",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Movies.findOne({ "Genre.Name": req.params.Name })
      .then((movie) => {
        res.status(201).json(movie.Genre);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

//Get director info when looking for specific director
app.get(
  "/movies/director/:Name",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Movies.findOne({ "Director.Name": req.params.Name })
      .then((movie) => {
        res.status(201).json(movie.Director);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

//Add favorite movie to username's list
app.post(
  "/users/:Username/movies/:MovieID",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.findOneAndUpdate(
      { Username: req.params.Username },
      { $push: { FavoriteMovies: req.params.MovieID } },
      { new: true },
      (err, updatedUser) => {
        if (err) {
          console.error(err);
          res.status(500).send("Error: " + err);
        } else {
          res.json(updatedUser);
        }
      }
    );
  }
);

//Remove movie from username's list
app.delete(
  "/users/:Username/Movies/:MovieID",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.findOneAndUpdate(
      { Username: req.params.Username },
      { $pull: { FavoriteMovies: req.params.MovieID } },
      { new: true },
      (error, updatedUser) => {
        if (error) {
          console.error(error);
          res.status(500).send("Error: " + error);
        } else {
          res.json(updatedUser);
        }
      }
    );
  }
);

// Listen for requests
// app.listen(8080, () => {
//   console.log("Your app is listening on port 8080.");
// });
const port = process.env.PORT || 8080;
app.listen(port, "0.0.0.0", () => {
  console.log("Listening on Port " + port);
});
