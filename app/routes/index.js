
module.exports = function(app, db, baseNamespace) {
  // require('./uploads')(app, db, baseNamespace);

  require('./orders')(app, db, baseNamespace);
  require('./register')(app, db, baseNamespace);
  require('./gps')(app, db, baseNamespace);

}
