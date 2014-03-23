var Agenda = require('agenda');
var pulse = require('./source/jobs/pulse');
var logger = require('./source/utils/logger');
var config = require('./config');

var agenda = new Agenda({db: {address: config.connection, collection: 'jobs' }, maxConcurrency: 1});

agenda.define('daily pulse', function (job, callback) {
	pulse('day', callback);
});

agenda.define('weekly pulse', function (job, callback) {
	pulse('week', callback);
});

agenda.every('1 minute', 'daily pulse');
agenda.every('1 minute', 'weekly pulse');

agenda.on('start', function (job) {
	logger.info({message: 'job started', job: job});
});

agenda.on('complete', function (job) {
	logger.success({message: 'job compeleted', job: job});
});

agenda.on('fail', function (err, job) {
	logger.error({message: 'job failed', job: job, err: err});
});

agenda.start();