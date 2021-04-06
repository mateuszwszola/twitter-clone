const dummyUser = {
  name: 'John Doe',
  username: 'johndoe',
  email: 'johndoe@email.com',
  password: '123456',
  password2: '123456',
};

const dummyTweet = {
  text: 'Dummy tweet text',
  media: 'dummytweet.jpg',
};

exports.dummyUser = dummyUser;
exports.dummyTweet = dummyTweet;

exports.dummyUsers = [
  dummyUser,
  {
    ...dummyUser,
    name: 'Bob Doe',
    username: 'bobdoe',
    email: 'bobdoe@email.com',
  },
];
