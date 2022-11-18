# movie_api

## Description

This backend API stores information about movies. It provides users with access to information about different movies, directors, genres and synopsis. Users will be able to sign up, update their personal information, and create a list of their favorite movies.

## Key features:

- Return a list of all movies to the user
- Return data (synopsis, genre, director, image URL) about a single movie by title to the user
- Return data about a genre by name/title
- Return data about a director (bio) by name
- Allow new users to register
- Allow users to update their user info (username, password, email, date of birth)
- Allow users to add a movie to their list of favorites
- Allow users to remove a movie from their list of favorites
- Allow existing users to delete their user info/profile

## Dependencies:

- Node.JS
- bcrypt: "^5.0.1",
- body-parser: "^1.20.0",
- cors: "^2.8.5",
- express: "^4.18.1",
- express-validator: "^6.14.2",
- jsonwebtoken: "^8.5.1",
- mongoose: "^6.4.6",
- morgan: "^1.10.0",
- passport: "^0.6.0",
- passport-jwt: "^4.0.0",
- passport-local: "^1.0.0",
- uuid: "^8.3.2"
- nodemon: "^2.0.19"

## Links to a client-side of movie database apps which fetches data from its server-side "movie-api":

- myFlix-client:
  https://github.com/VadimIshkarin/myFlix-client#readme
- myFlix-Angular-client:
  https://github.com/VadimIshkarin/myFlix-Angular-client#readme
