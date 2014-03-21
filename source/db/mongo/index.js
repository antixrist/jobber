var mongo = require('mongojs');

module.exports = function (config) {
	var connection = config.connection || 'mongodb://localhost:27017/likeastoredb';
	var db = mongo.connect(connection, ['items', 'pulse']);
	if (!db) {
		throw new Error('could not connect to ' + connection);
	}

	return db;
};