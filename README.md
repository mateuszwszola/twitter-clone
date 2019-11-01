# twitter-clone
This project is built using Node, Express, React and MongoDB. The goal is learning MERN stack by putting these technologies together and building a full-stack web application,
that mimics the basic design and functionality of the official Twitter app.

## Deployed version
The project is hosted on AWS using elastic beanstalk, you can see the deployed version here: link

## Getting Started
These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites
Create a .env file in the root directory. The example of key/value pairs to include:
```
NODE_ENV=development
MONGO_URI_DEV=mongodb://localhost/twitter-clone-db
MONGO_URI_TEST=mongodb://localhost/twitter-clone-test-db
JWT_SECRET=jwt-secret
```
### Installing
To install the project dependencies run these commands in the root directory
```
npm install
npm run client:install
```

## Running the tests
### Backend API tests
To run tests which check if API routes work properly, first include MONGO_URI_TEST in .env file, then run:
```
npm test
```

### Client tests
To test client reducers run:
```
npm run client:test
```

## Built With

* [Express](http://expressjs.com/) - web framework for Node.js
* [Mongoose](https://mongoosejs.com/) - mongodb object modeling for Node.js
* [React](https://reactjs.org/) - a JavaScript library for building user interfaces
* [Redux](https://redux.js.org/) - a predictable state container for JavaScript apps


## Authors
* **Mateusz Wszoła** - [mateuszwszola](https://github.com/mateuszwszola)

> All right of picture and sign is reserved for [Twitter](https://twitter.com).
>
> If you see the code mistakes, bugs or have any tips on how I can improve the app, please let me know, thank you!


