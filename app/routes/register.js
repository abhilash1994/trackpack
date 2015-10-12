module.exports = function(app, db, baseNamespace) {

    app.post(baseNamespace+'/register', function(req, res, next){

      // Check for empty input
      // Make other verfications too (later on)
      if (!req.body.orderid || !req.body.company || !req.body.frmlat || !req.body.frmlng || !req.body.tolat || !req.body.tolng) {
        return res.send(500);
      }

      var newUser = new register({
          orderid: req.body.orderid,
          company: req.body.company,
          frmlat: req.body.frmlat,
          frmlng: req.body.frmlng,
          tolat: req.body.tolat,
          tolng: req.body.tolng
        });


      newUser.save(function(err, savedUser){
        if (err) {
          console.log(err);
          return res.send(500);
        }

        return res.send({user: savedUser});
      });

    });
}

