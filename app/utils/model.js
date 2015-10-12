var mongoose = require('mongoose');
var Schema = mongoose.Schema;

function AbstractModelSchema (modelSchema) {
  var schema = new Schema({
    createDate: Date,
    updateDate: Date
  });

  schema.pre('save', function(next){
    this.updateDate = new Date();
    if ( !this.createDate ) {
      this.createDate = new Date();
    }
    next();
  });

  if(modelSchema) {
    schema.add(modelSchema);
  }

  return schema;
}

module.exports = AbstractModelSchema;
