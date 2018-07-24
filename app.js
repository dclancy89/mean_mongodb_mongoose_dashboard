const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyparser = require('body-parser');
mongoose.connect('mongodb://localhost/mongoose_dashboard');

var OtterSchema = new mongoose.Schema({
    name: String,
    age: Number,
    location: String
})

mongoose.model('Otter', OtterSchema);
var Otter = mongoose.model('Otter');

app.use(bodyparser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/views');
app.set('view engine', 'pug');



// Routes
app.get('/', function(req, res) {
    res.render('index');
});

app.get('/otters', function(req, res) {
    Otter.find({}, function(err, otters){
        if(err) {
            console.log(err);
        }
        res.render('show_otters', {otters: otters});
    });
    
});

app.post('/otters', function(req, res) {
    let otter = new Otter({
        name: req.body.name,
        age: req.body.age,
        location: req.body.location
    });

    otter.save(function(err) {
        if(err) {
            console.log('Oops. Something went wrong');
        } else {
            console.log("Successfully added new Otter");
            res.redirect('/otters');
        }
    });
});

app.get('/otters/new', function(req, res) {
    res.render('new_otter');
});

app.get('/otters/:id', function(req, res) {
    Otter.find({_id: req.params.id}, function(err, otter) {
        res.render('otters', {otter: otter});
    })
});

app.post('/otters/:id', function(req, res) {
    Otter.update({_id: req.params.id}, req.body, function(err, result) {
        if(err) {
            console.log(err);
        }
        console.log("updated user");
        res.redirect('/otters/' + req.params.id);
    });
})

app.get('/otters/edit/:id', function(req, res){
    Otter.find({_id: req.params.id}, function(err, otter) {
        console.log(otter);
        res.render('edit_otter', {otter: otter});
    })
});

app.post('/otters/destroy/:id', function(req, res) {
    Otter.remove({_id: req.params.id}, function(err){
        console.log('deleted user');
        res.redirect('/otters');
    });
})

app.listen(8000, function() {
    console.log("Listening on port 8000");
})


