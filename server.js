var express = require("express");
var path = require("path");

var fs = require("fs");
const { json } = require("express");
var data = fs.readFileSync('db/db.json', 'utf8');
var notes = JSON.parse(data);

var app = express();
var PORT = process.env.PORT || 3000;

var uniqueId = function() {
    return 'id-' + Math.random().toString(36).substr(2, 16);
  };

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/assets", express.static('./public/assets/'));

app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.get("/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "./public/notes.html"));
});

app.get("/api/notes", function(req, res) {
    console.log(notes);
    return res.json(notes);
    });

app.get("*", function(req, res) {
        res.sendFile(path.join(__dirname, "./public/index.html"));
    });

app.post("/api/notes", function(req,res) {
    var newNote = req.body;
    newNote.id = uniqueId();
    notes.push(newNote);
    fs.writeFileSync("./db/db.json", JSON.stringify(notes));
    res.json(notes);
})

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