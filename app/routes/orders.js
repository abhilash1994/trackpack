module.exports = function(app, db, baseNamespace) {

    app.get(baseNamespace+'/orders/:company', function(req, res, next) {
    	

    	console.log(req.params.company);
	    db.model("orders").find( {'company': req.params.company.toLowerCase()}, function(e, result){
	        if (e) {
	          return next(e);
	        }
	        var data = {}, userObject = {};
	        if (!result) {
	          result = {};
	        }
	        data["orders"] = result;
	        return res.send(data);
	      });
	    // don't forget to delete all req.files when done
	  });

    app.get(baseNamespace+'/user-orders/:user', function(req, res, next) {
    	
	    db.model("orders").find( {'userid': req.params.user.toLowerCase()}, function(e, result){
	        if (e) {
	          return next(e);
	        }
	        var data = {}, userObject = {};
	        if (!result) {
	          result = {};
	        }
	        data["orders"] = result;
	        return res.send(data);
	      });
	    // don't forget to delete all req.files when done
	  });


     app.put(baseNamespace+'/orders/', function(req, res, next) {

    	var model = db.model("orders"),
        options = {multi: false, upsert: false},
        query,
        updatedRecord = req.body["orderid"];

    	query = {orderid: req.body.orderid}
    	changedStatusRecord = {orderid: req.body.orderid, userid: req.body.userid}

        model.findOneAndUpdate(query, changedStatusRecord, options,function(err, result){
        	console.log(result)
        	// result['userlat'] = req.body.lat;
        	// result['userlng'] = req.body.lng;
        	return res.send({order: result})
		});
    });
}

