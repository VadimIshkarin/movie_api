const express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  uuid = require("uuid");

app.use(bodyParser.json());

let users = [
  {
    id: 1,
    name: "Kim",
    email: "kimrymn951@gmail.com",
    favoriteMovies: [],
  },
  {
    id: 2,
    name: "Joe",
    email: "joerymn3811@gmail.com",
    favoriteMovies: ["The Matrix"],
  },
  {
    id: 3,
    name: "Peter",
    email: "peterrymn481@gmail.com",
    favoriteMovies: ["The Dark Knight"],
  },
];

let movies = [
  {
    Title: "The Matrix Reloaded",
    Description:
      "It depicts a dystopian future in which humanity is unknowingly trapped inside a simulated reality, the Matrix, which intelligent machines have created to distract humans while using their bodies as an energy source. When computer programmer Thomas Anderson, under the hacker alias Neo, uncovers the truth, he joins a rebellion against the machines along with other people who have been freed from the Matrix.",
    Genre: {
      Name: "Science fiction action film",
      Description:
        "Science fiction action film is a genre that uses speculative, fictional science-based depictions of phenomena that are not fully accepted by mainstream science, such as extraterrestrial lifeforms, spacecraft, robots, cyborgs, interstellar travel or other technologies. The genre tends to feature a mostly resourceful hero struggling against incredible odds, which include life-threatening situations, a dangerous villain, or a pursuit which usually concludes in victory for the hero.",
    },
    Director: {
      Name: "Lana and Lilly Wachowski",
      Bio: "Lana Wachowski (born June 21, 1965, formerly known as Larry Wachowski and Lilly Wachowski (born December 29, 1967, formerly known as Andy Wachowski) are American film and television directors, writers and producers.The sisters are both trans women.Collectively known as the Wachowskis, the sisters have worked as a writing and directing team through most of their careers.",
    },
    ImageURL: "https://www.imdb.com/title/tt0234215/",
    Featured: false,
  },
  {
    Title: "The Matrix",
    Description:
      "It depicts a dystopian future in which humanity is unknowingly trapped inside a simulated reality, the Matrix, which intelligent machines have created to distract humans while using their bodies as an energy source. When computer programmer Thomas Anderson, under the hacker alias Neo, uncovers the truth, he joins a rebellion against the machines along with other people who have been freed from the Matrix.",
    Genre: {
      Name: "Science fiction action film",
      Description:
        "Science fiction action film is a genre that uses speculative, fictional science-based depictions of phenomena that are not fully accepted by mainstream science, such as extraterrestrial lifeforms, spacecraft, robots, cyborgs, interstellar travel or other technologies. The genre tends to feature a mostly resourceful hero struggling against incredible odds, which include life-threatening situations, a dangerous villain, or a pursuit which usually concludes in victory for the hero.",
    },
    Director: {
      Name: "Lana and Lilly Wachowski",
      Bio: "Lana Wachowski (born June 21, 1965, formerly known as Larry Wachowski and Lilly Wachowski (born December 29, 1967, formerly known as Andy Wachowski) are American film and television directors, writers and producers.The sisters are both trans women.Collectively known as the Wachowskis, the sisters have worked as a writing and directing team through most of their careers.",
    },
    ImageURL: "https://www.netflix.com/in/title/20557937",
    Featured: false,
  },
  {
    Title: "Predator",
    Description:
      "An elite paramilitary rescue team on a mission to save hostages in guerrilla-held territory in a Central American rainforest, who encounter the deadly Predator, a skilled, technologically advanced alien who stalks and hunts them down.",
    Genre: {
      Name: "Science fiction action film",
      Description:
        "Science fiction action film is a genre that uses speculative, fictional science-based depictions of phenomena that are not fully accepted by mainstream science, such as extraterrestrial lifeforms, spacecraft, robots, cyborgs, interstellar travel or other technologies. The genre tends to feature a mostly resourceful hero struggling against incredible odds, which include life-threatening situations, a dangerous villain, or a pursuit which usually concludes in victory for the hero.",
    },
    Director: {
      Name: "John McTierman",
      Bio: "John Campbell McTiernan Jr. (born January 8, 1951 in Albany, New York) is an American filmmaker. He attended the Juilliard School before graduating with a Master of Fine Arts from the AFI Conservatory in 1975.",
    },
    ImageURL:
      "https://www.hulu.com/movie/predator-784d3d44-0cf3-429c-a372-bbf8ecbedba7",
    Featured: false,
  },
  {
    Title: "Alien",
    Description:
      "Alien is a 1979 science fiction horror film directed by Ridley Scott and written by Dan O'Bannon. Based on a story by O'Bannon and Ronald Shusett, it follows the crew of the commercial space tug Nostromo, who, after coming across a mysterious derelict spaceship on an undiscovered moon, find themselves up against an aggressive and deadly extraterrestrial set loose on the Nostromo.",
    Genre: {
      Name: "Science fiction horror film",
      Description:
        "Science fiction horror film is a genre that uses speculative, fictional science-based depictions of phenomena that are not fully accepted by mainstream science, such as extraterrestrial lifeforms, spacecraft, robots, cyborgs, interstellar travel or other technologies and seeks to elicit fear or disgust in its audience for entertainment purposes.",
    },
    Director: {
      Name: "Ridley Scott",
      Bio: "Ridley Scott (born 30 November 1937 in South Shields, County Durham) is an English film director and producer.",
    },
    ImageURL:
      "https://www.hulu.com/movie/alien-27389b6b-bf27-45a6-afdf-cef0fe723cff",
    Featured: false,
  },

  {
    Title: "The Dark Knight",
    Description:
      "The Dark Knight is a 2008 superhero film directed by Christopher Nolan from a screenplay he co-wrote with his brother Jonathan. Based on the DC Comics superhero Batman, it is the sequel to Batman Begins (2005) and the second installment in The Dark Knight Trilogy. In the film's plot, the superhero vigilante Batman, Police Lieutenant James Gordon and District Attorney Harvey Dent form an alliance to dismantle organized crime in Gotham City, but their efforts are derailed by the intervention of an anarchistic mastermind, the Joker, who seeks to test how far Batman will go to save the city from complete chaos.",
    Genre: {
      Name: "Superhero film",
      Description:
        "A superhero film is a film that focuses on the actions of superheroes. Superheroes are individuals who possess extraordinary (superhuman) abilities, and are dedicated to protecting the public.",
    },
    Director: {
      Name: "Christopher Nolan",
      Bio: "Christopher Nolan (born 30 July 1970 in London)is a British-American film director, producer, and screenwriter. His films have grossed more than US$5 billion worldwide, and have garnered 11 Academy Awards from 36 nominations. Born and raised in London, Nolan developed an interest in filmmaking from a young age. He studied English literature at University College London.",
    },
    ImageURL:
      "https://play.google.com/store/movies/details/The_Dark_Knight?id=qY3UkAHufLY&hl=en_US&gl=US",
    Featured: false,
  },
  {
    Title: "Inception",
    Description:
      "A professional thief who steals information by infiltrating the subconscious of his targets. He is offered a chance to have his criminal history erased as payment for the implantation of another person's idea into a target's subconscious.",
    Genre: {
      Name: "Science fiction action film",
      Description:
        "Science fiction action film is a genre that uses speculative, fictional science-based depictions of phenomena that are not fully accepted by mainstream science, such as extraterrestrial lifeforms, spacecraft, robots, cyborgs, interstellar travel or other technologies. The genre tends to feature a mostly resourceful hero struggling against incredible odds, which include life-threatening situations, a dangerous villain, or a pursuit which usually concludes in victory for the hero.",
    },
    Director: {
      Name: "Christopher Nolan",
      Bio: "Christopher Nolan (born 30 July 1970 in London)is a British-American film director, producer, and screenwriter. His films have grossed more than US$5 billion worldwide, and have garnered 11 Academy Awards from 36 nominations. Born and raised in London, Nolan developed an interest in filmmaking from a young age. He studied English literature at University College London.",
    },
    ImageURL: "https://www.netflix.com/title/70131314",
    Featured: false,
  },
  {
    Title: "Interstellar",
    Description:
      "A dystopian future where humanity is struggling to survive, the film follows a group of astronauts who travel through a wormhole near Saturn in search of a new home for mankind.",
    Genre: {
      Name: "Science fiction film",
      Description:
        "Science fiction film is a genre that uses speculative, fictional science-based depictions of phenomena that are not fully accepted by mainstream science, such as extraterrestrial lifeforms, spacecraft, robots, cyborgs, interstellar travel or other technologies.",
    },
    Director: {
      Name: "Christopher Nolan",
      Bio: "Christopher Nolan (born 30 July 1970 in London)is a British-American film director, producer, and screenwriter. His films have grossed more than US$5 billion worldwide, and have garnered 11 Academy Awards from 36 nominations. Born and raised in London, Nolan developed an interest in filmmaking from a young age. He studied English literature at University College London.",
    },
    ImageURL: "https://www.paramountmovies.com/movies/interstellar",
    Featured: false,
  },
  {
    Title: "The Abyss",
    Description:
      "When an American submarine sinks in the Caribbean, a US search and recovery team works with an oil platform crew, racing against Soviet vessels to recover the boat. Deep in the ocean, they encounter something unexpected.",
    Genre: {
      Name: "Science fiction film",
      Description:
        "Science fiction film is a genre that uses speculative, fictional science-based depictions of phenomena that are not fully accepted by mainstream science, such as extraterrestrial lifeforms, spacecraft, robots, cyborgs, interstellar travel or other technologies.",
    },
    Director: {
      Name: "James Cameron",
      Bio: "James Francis Cameron (born August 16, 1954 in Kapuskasing, Ontario) is a Canadian-American filmmaker. Best known for making science fiction and epic films.",
    },
    ImageURL:
      "https://www.hulu.com/movie/the-abyss-733df76b-d280-4f96-b13e-3b0c0c345dee",
    Featured: false,
  },
  {
    Title: "The Hangover",
    Description:
      "It tells the story of Phil Wenneck, Stu Price, Alan Garner, and Doug Billings, who travel to Las Vegas for a bachelor party to celebrate Doug's impending marriage. However, Phil, Stu, and Alan wake up with Doug missing and no memory of the previous night's events, and must find the groom before the wedding can take place.",
    Genre: {
      Name: "Comedy film",
      Description:
        "A comedy film is a category of film which emphasizes humor. These films are designed to make the audience laugh through amusement.",
    },
    Director: {
      Name: "Todd Phillips",
      Bio: "Todd Phillips (born December 20, 1970 in Brooklyn, New York City) is an American filmmaker and occasional actor. He attended New York University Film School, but dropped out because he could not afford to complete his first film and pay tuition simultaneously.Around that time, he worked at Kim's Video and Music.",
    },
    ImageURL: "https://www.imdb.com/title/tt1119646/",
    Featured: false,
  },
  {
    Title: "The Hangover Part 2",
    Description:
      "It tells the story of Phil, Stu, Alan, and Doug as they travel to Thailand for Stu's wedding. After the bachelor party in Las Vegas, Stu takes no chances and opts for a safe, subdued pre-wedding brunch. Things do not go as planned, resulting in another bad hangover with no memories of the previous night.",
    Genre: {
      Name: "Comedy film",
      Description:
        "A comedy film is a category of film which emphasizes humor. These films are designed to make the audience laugh through amusement.",
    },
    Director: {
      Name: "Todd Phillips",
      Bio: "Todd Phillips (born December 20, 1970 in Brooklyn, New York City) is an American filmmaker and occasional actor. He attended New York University Film School, but dropped out because he could not afford to complete his first film and pay tuition simultaneously.Around that time, he worked at Kim's Video and Music.",
    },
    ImageURL: "https://www.imdb.com/title/tt1411697/",
    Featured: false,
  },
];

// A list of all movies
app.get("/movies", (req, res) => {
  res.status(200).json(movies);
});

//Return data about a single movie by title to the user
app.get("/movies/:title", (req, res) => {
  const { title } = req.params; // object destructuring
  const movie = movies.find((movie) => movie.Title === title);

  if (movie) {
    res.status(200).json(movie);
  } else {
    res.status(400).send("no such movie");
  }
});

// Return data about a genre
app.get("/movies/genre/:genreName", (req, res) => {
  const { genreName } = req.params; // object destructuring
  const genre = movies.find((movie) => movie.Genre.Name === genreName).Genre;

  if (genre) {
    res.status(200).json(genre);
  } else {
    res.status(400).send("no such genre");
  }
});

// Return data about a director
app.get("/movies/directors/:directorName", (req, res) => {
  const { directorName } = req.params; // object destructuring
  const director = movies.find(
    (movie) => movie.Director.Name === directorName
  ).Director;

  if (director) {
    res.status(200).json(director);
  } else {
    res.status(400).send("no such director");
  }
});

//Create new user/register
app.post("/users", (req, res) => {
  const newUser = req.body;
  if (newUser.name) {
    newUser.id = uuid.v4();
    users.push(newUser);
    res.status(201).json(newUser);
  } else {
    res.status(400).send("no such names");
  }
});

//Update user info/username
app.put("/users/:id", (req, res) => {
  const { id } = req.params;
  const updatedUser = req.body;

  let user = users.find((user) => user.id == id);
  if (user) {
    user.name = updatedUser.name;
    res.status(200).json(user);
  } else {
    res.status(400).send("no such user");
  }
});

//Add a movie to the list of favorites
app.post("/users/:id/:movieTitle", (req, res) => {
  const { id, movieTitle } = req.params;

  let user = users.find((user) => user.id == id);
  if (user) {
    user.favoriteMovies.push(movieTitle);
    res.status(200).send(`${movieTitle} has been added to user ${id}'s array`);
  } else {
    res.status(400).send("no such user");
  }
});

//Remove a movie from the list of favorites
app.delete("/users/:id/:movieTitle", (req, res) => {
  const { id, movieTitle } = req.params;

  let user = users.find((user) => user.id == id);
  if (user) {
    user.favoriteMovies = user.favoriteMovies.filter(
      (title) => title !== movieTitle
    );
    res
      .status(200)
      .send(`${movieTitle} has been removed from user ${id}'s array`);
  } else {
    res.status(400).send("no such user");
  }
});

//Delete/deregister existing user
app.delete("/users/:id", (req, res) => {
  const { id } = req.params;

  let user = users.find((user) => user.id == id);

  if (user) {
    users = users.filter((user) => user.id != id);
    // res.json(users);
    res.status(200).send(`user ${id} has been deleted`);
  } else {
    res.status(400).send("no such user");
  }
});

// Listen for requests
app.listen(8080, () => {
  console.log("Your app is listening on port 8080.");
});
