const mongoose = require('mongoose');
const User = require('../models/User');
const Profile = require('../models/Profile');
const { dummyUsers } = require('./dummy_data');

exports.testNoTokenError = function(res) {
    res.should.have.status(401);
    res.body.should.be.a('object');
    res.body.should.have.property('errors');
    res.body.errors.should.be.a('array');
    res.body.errors[0].should.have.property('msg', 'No token, authorization denied');
};

exports.createTwoUsersWithProfile = async function() {
    const userA = await new User(dummyUsers[0]).save();
    const profileA = await new Profile({ user: userA.id }).save();
    const userB = await new User(dummyUsers[1]).save();
    const profileB = await new Profile({ user: userB.id }).save();

    return { userA, profileA, userB, profileB };
};