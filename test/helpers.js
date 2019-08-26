exports.testNoTokenError = function(res) {
    res.should.have.status(401);
    res.body.should.be.a('object');
    res.body.should.have.property('errors');
    res.body.errors.should.be.a('array');
    res.body.errors[0].should.have.property('msg', 'No token, authorization denied');
};