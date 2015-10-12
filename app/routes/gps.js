module.exports = function(app, db, baseNamespace) {

    app.put(baseNamespace+'/gps', function(req, res, next) {

    	var model = db.model("gps"),
        options = {multi: false, upsert: false},
        query,
        updatedRecord = req.body["userid"];

    	query = {userid: req.body.userid}
    	changedStatusRecord = {userid: req.body.userid, userlat: req.body.userlat, userlng: req.body.userlng}

        model.findOneAndUpdate(query, changedStatusRecord, options,function(err, result){
        	console.log(result)
        	// result['userlat'] = req.body.lat;
        	// result['userlng'] = req.body.lng;
        	return res.send({gps: result})
		});
    });
	
	     

    app.get(baseNamespace+'/gps/:company', function(req, res, next) {
	    
	    db.model("registers").find( {'company': req.params.company.toLowerCase()}, function(e, users){
	        if (e) {
	        	console.log(e);
	          return next(e);
	        }
	        if (!users.length) {
	        	res.send(users);
	        };

	        var locations = [], count = 0;
	        for (var i = users.length - 1; i >= 0; i--) {
	     		db.model("gps").findOne( {'userid': users[i].userid.toLowerCase()}, function(e, gps){
	     			count++;
			        if (e) {
			          return next(e);
			        }

			        locations.push(gps);
			        console.log(count, gps);
			        if(count == users.length){
			        	return res.send({gps: locations});	
			        }
	        		
			      });   	
	        };
	      });
	    // don't forget to delete all req.files when done
	  });
}

