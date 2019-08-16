var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var NoteSchema = new Schema({
  body: {
    type: String,
    required: true,
    trim: true
  }
});

var Note = mongoose.model("Note", NoteSchema);

module.exports = Note;