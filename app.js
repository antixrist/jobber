var Agenda = require('agenda');
var config = require('./config');

var pulse = require('./source/jobs/pulse');
var spread = require('./source/jobs/spread');

var logger = require('./source/utils/logger');
var timing = require('./source/utils/timing');

var agenda = new Agenda({db: {address: config.connection, collection: 'jobs'} });

agenda.purge(function () {
	// agenda.define('measure pulse day', function (job, callback) {
	// 	pulse('day', callback);
	// });

	// agenda.define('measure pulse week', function (job, callback) {
	// 	pulse('week', callback);
	// });

	// agenda.define('measure pulse month', function (job, callback) {
	// 	pulse('month', callback);
	// });

	agenda.define('send weekly pulse', function (job, callback) {
		spread('week', callback);
	});

	agenda.every('3 minutes', 'measure pulse day');
	agenda.every('12 minutes', 'measure pulse week');
	agenda.every('29 minutes', 'measure pulse month');

	agenda.every('3 minutes', 'send weekly pulse');

	agenda.on('start', function (job) {
		timing.start(job.attrs.name);
		logger.info({message: 'job started', job: job.attrs.name });
	});

	agenda.on('success', function (job) {
		var duration = timing.finish(job.attrs.name);
		logger.success({message: 'job compeleted', job: job.attrs.name, duration: duration.asMilliseconds()});
	});

	agenda.on('fail', function (err, job) {
		logger.error({message: 'job failed', job: job.attrs.name, err: err});
	});

	agenda.start();
});
