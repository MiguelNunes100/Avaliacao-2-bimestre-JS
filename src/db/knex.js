const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });

const knex = require('knex');
const configuracao = require('../../knexfile');

const bd = knex(configuracao.development);

module.exports = bd;
