var express = require("express");
var path = require("path");
var fs = require("fs");
var data = fs.readFileSync('db/db.json', 'utf8'); //reading from the JSON db file
var notes = JSON.parse(data); //parses the data from the JSON db

var app = express();
var PORT = process.env.PORT || 3000;

//creates a randomly generated ID for each of the note entries
var uniqueId = function() {
    return 'id-' + Math.random().toString(36).substr(2, 16);
  };

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('./public/'));

//path for homepage
app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "./public/index.html"));
});

//path for notes page
app.get("/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "./public/notes.html"));
});

//api path for notes page. Returns the entries in the json file when calling this API endpoint
app.get("/api/notes", function(req, res) {
    console.log(notes);
    return res.json(notes);
    });

//default route
app.get("*", function(req, res) {
        res.sendFile(path.join(__dirname, "./public/index.html"));
    });

//api route to create new notes and save them to the db.json file
app.post("/api/notes", function(req,res) {
    var newNote = req.body;
    newNote.id = uniqueId();
    notes.push(newNote);
    fs.writeFileSync("./db/db.json", JSON.stringify(notes));
    res.json(notes);
})

//api route to delete notes based on the unique identifier
app.delete("/api/notes/:id", function(req,res) {
    var noteToDelete = req.params.id;

    for (var i = 0; i < notes.length; i++) {
        if (noteToDelete === notes[i].id) {
            notes.splice(i,1);
            fs.writeFileSync("./db/db.json", JSON.stringify(notes));
            return res.json(notes);
        }
    }
    return res.json(false);
})

// Starts the server to begin listening
app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
  });