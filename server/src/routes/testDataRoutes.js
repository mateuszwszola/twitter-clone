const router = require('express').Router();
const Joi = require('joi');
const mongoose = require('mongoose');
const { seedDB, getCollectionDocuments } = require('../config/db');
const validate = require('../middleware/validate');

router.post('/seed', async (req, res) => {
  await seedDB();
  res.status(200).send();
});

const entityValidation = {
  params: {
    entity: Joi.string().valid('users', 'profiles', 'tweets'),
  },
};

router.get('/:entity', validate(entityValidation), async (req, res) => {
  const { entity } = req.params;

  const collections = mongoose.connection.collections;

  const collection = collections[`${entity}`];

  const results = await getCollectionDocuments(collection);

  res.send(results);
});

module.exports = router;
