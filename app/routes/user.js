module.exports = function(app, db, baseNamespace) {

  // Get.Id
  /*
  * Who can access this method
  *   : Only loggedin user and hotel
  * Access level
  *   User: Can read everything
  *   Hotel: Can read everything(public)
  * When is it accessed
  *   User: When viewing order
  *   Hotel: When viewing order, editing order
  *
  */
  app.get(baseNamespace+'/users/:id', function(req, res, next) {
    if (req.params.id == "self") {
      db.model("users").findById( req.user, function(e, result){
        if (e) {
          return next(e);
        }
        var data = {}, userObject = {};
        if (!result) {
          result = {};
        }else{
          userObject = result.toObject();
          delete userObject['__v'];
          delete userObject['isOnline'];
        }
        data["users"] = userObject;
        return res.send(data);
      });
    }else{
      db.model("hotels").findById(req.user, function(e, hotel){
        if (hotel) {
          db.model("users").findOne({_id: req.params.id }, function(err, result) {
            if (!err) {
              var data = {}, userObject = {};
              if (!result) {
                result = {};
              }else{
                userObject = result.toObject();
                delete userObject['__v'];
                delete userObject['isOnline'];
                // delete userObject['orders'];
              }
              data["users"] = userObject;
              return res.send(data);
            }else{
              return next(e);
            }
          });
        }else{
          return res.send(403);
        }
      });
    }
  });

  // Put
  app.put(baseNamespace+'/users/:id', function(req, res, next){
    return res.send(501);
  });

  // Post
  /*
  * Who can access this method
  *   : Any guest
  * Access level
  *   Guest: Can add everything
  * When is it accessed
  *   User: When signing up
  *
  */
  app.post(baseNamespace+'/users', function(req, res, next){

    // Check for empty input
    // Make other verfications too (later on)
    if (!req.body.lname || !req.body.fname || !req.body.email || !req.body.mobile || !req.body.password) {
      return res.send(500);
    }

    db.model("users").find({email: req.body.email}, function(err, userObject){
      if (err) {
        return res.send(200, {errmsg: "Something went wrong"});
      };

      if (userObject.length) {
        return res.send(200, {errmsg: "Email address already registered"});
      }

      db.model("users").find({mobile: req.body.mobile}, function(err, userObject){
        if (err) {
          return res.send(200, {errmsg: "Something went wrong"});
        }

        if (userObject.length) {
          return res.send(200, {errmsg: "Mobile number already registered"});
        }
        
        var newUser = new user({
          fname: req.body.fname,
          lname: req.body.lname,
          email: req.body.email,
          mobile: req.body.mobile,
          dob: req.body.dob
        });


        newUser.save(function(err, savedUser){
          if (err) {
            console.log(err);
            return res.send(500);
          }

          var newUserSecure = new userSecure({
            user: savedUser._id,
            password: req.body.password
          });

          newUserSecure.save(function(e, savedUserSecure){
            if (e) {
              return res.send(500);
            }

            return res.send({user: savedUser});
          });
        });
      });
    });


  });

  app.post(baseNamespace+'/generate-reset-link', function(req, res, next){
    var email = req.body.email;
    if (!email) {
      return res.send(500);
    }else{
      var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (!re.test(email)) {
        return res.send(500);
      }
    }

    db.model("users").findOne( {email: email}, function(e, result){
      if (e) {
        return next(e);
      }

      if (result) {
        var current_date = (new Date()).valueOf().toString();
        var random = Math.random().toString();
        var token = crypto.createHash('sha1').update(current_date + random).digest('hex');

        var newToken = new resetPassword({
          email: email,
          token: token
        });

        newToken.save(function(e, savedToken){
          if (e) {
            return res.send(500);
          }

          sendMail(email, result.name, "http://localhost:4200/authenticate/reset/"+savedToken.token, res)
        })
        
      }else{
        return res.send({success: false, reason: "No such user exists"});
      }

      
    });


  });

  app.post(baseNamespace+'/reset-password/:id', function(req, res, next){
  });

  app.get(baseNamespace+'/test-email', function(req, res, next){
    
  });

};

function sendMail(email, username, link, res){


  var message = {
    "html": getHtml(username, link),
    "text": '',
    "subject": "Password Reset - Zaaika",
    "from_email": "help@coderival.com",
    "from_name": "Zaaika",
    "to": [{
            "email": email,
            "name": username,
            "type": "to"
        }],
    "headers": {
        "Reply-To": "noreply@coderival.com"
    },
    "important": false,
    "track_opens": null,
    "track_clicks": null,
    "auto_text": null,
    "auto_html": null,
    "inline_css": null,
    "url_strip_qs": null,
    "preserve_recipients": null,
    "view_content_link": null,
    "tracking_domain": null,
    "signing_domain": null,
    "return_path_domain": null,
    "tags": [
        "password-resets"
    ],
    "metadata": {
        "website": "www.coderival.com"
    }
};
var async = false;
mandrill_client.messages.send({"message": message, "async": async}, function(result) {
    console.log(result);
    return res.send({success: true});
    /*
    [{
            "email": "recipient.email@example.com",
            "status": "sent",
            "reject_reason": "hard-bounce",
            "_id": "abc123abc123abc123abc123abc123"
        }]
    */
}, function(e) {
    // Mandrill returns the error as an object with name and message keys
    console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
    return res.send({success: false, reason: "Sending email failed."});
    // A mandrill error occurred: Unknown_Subaccount - No subaccount exists with the id 'customer-123'
});
}

function getHtml(username, link){
  return '<table><tbody><tr><td style="width:100%;background-color: #e6e2d9;font-family: \'Helvetica Neue\',Helvetica,Arial,sans-serif;color: #333;padding-bottom: 0;font-size: 15px"><table style="width:100%;background-color: #68391a"><tbody><tr><td><h2 style="font-weight: lighter; padding: 10px; color: #efefef; margin-bottom: 5px">Zaaika</h2></td></tr></tbody></table><table style="width:100%"><tbody><tr><td style="padding: 10px"><div style="width:100%;height: 5px"></div><p style="color: #333; font-size: 14px">Hi'+username+',</p><p style="color: #333; font-size: 14px">We recieved a password reset request for this email on Zaaika. Please click the link below to reset your password.</p><div style="width:100%;height: 10px"></div><a href="'+link+'" style="text-decoration: none;color: #fff;background-color: #4c8efa;border-color: #337ef9;display: inline-block;margin-bottom: 0;font-weight: normal;text-align: center;vertical-align: middle;cursor: pointer;background-image: none;border: 1px solid transparent;white-space: nowrap;padding: 6px 12px;font-size: 14px;line-height: 1.42857;border-radius: 2px;-webkit-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;transition: box-shadow 200ms cubic-bezier(0.4, 0, 0.2, 1);border: 0;border-radius: 2px;box-sizing: border-box" target="_blank">Reset your password</a><div style="width:100%;height: 5px"></div><p style="color: #333; font-size: 14px">If you did not request for a reset, simply ignore this email.</p></td></tr></tbody></table><table style="width:100%;background-color: #ddd"><tbody><tr><td style="padding: 10px"><hp style="color: #666;font-size: 12px; font-weight: lighter">Please do not reply to this message; it was sent from an unmonitored email address. This message is a service email related to your use of Zaaika.</hp></td></tr></tbody></table></td></tr></tbody></table>';

}