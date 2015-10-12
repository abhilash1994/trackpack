var baseNamespace 		= "";

module.exports = function(app, db) {

	require('./models/index')();
	require('./routes/index')(app, db, baseNamespace);
};
