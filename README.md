# twitter-clone

![project-preview](https://res.cloudinary.com/dtti654qn/image/upload/c_scale,w_1280/v1626618841/github-projects/twitter-clone_w4gwyy.png)

## Description

A full-stack Twitter clone app built using Node.js, Express.js, React.js, and MongoDB.

### Background

The project was originally created a few years ago and as I have learned a lot since then I recently decided to update it and create the base for developing new features.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine.

### Prerequisites

Make sure you have a running MongoDB instance.

### Configuration

Copy the `server/.env.example` file to `server/.env` and update the values if your configuration is different than the default.

### Installing

Install server dependencies

```bash
$ cd server
$ npm install
```

Install client dependencies

```bash
$ cd client
$ npm install
```

### Start the server in development mode

```bash
$ cd server
$ npm run dev
```

If everything was successful, you should see the messages being displayed in the terminal, telling that the server has successfully connected to a MongoDB and runs on a given port.

### Start the client

```bash
$ cd client
$ npm start
```

Now, the app should be running on `http://localhost:3000`.

## Running the tests

### Server

To test API routes

```bash
# run all tests
$ npm test

# or

# run all tests in watch mode
$ npm run test:watch
```

### Client

To run tests with Cypress first, copy the `client/.env` file to a `client/.env.local`. There is a default password for test users. You do not need to change that. Then simply run:

```bash
$ npm run cypress:open
```

## Inspirations

- https://github.com/hagopj13/node-express-boilerplate (server)
