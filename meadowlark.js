var express = require('express');

var app = express();

var handlebars = require('express3-handlebars').create({
    defaultLayout: 'main',
    helpers: {
        section: function(name, options){
            if(!this._sections) this._sections = {};
            this._sections[name] = options.fn(this);
            return null; 
        }
    }
});

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

var fortunes = [
    "Fortune 1",
    "Fortune 2",
    "Fortune 3",
];

app.set('port', process.env.PORT || 3000);

function getWeatherData(){
    return {
        locations: [
            {
                name: 'Portland',
                forecastUrl: 'http://www.wunderground.com/US/OR/Portland.html',
                iconUrl: 'http://icons-ak.wxug.com/i/c/k/partlycloudy.gif',
                weather: 'Overcast',
                temp: '54.1 F (12.3 C)',
            },

            {
                name: 'Bend',
                forecastUrl: 'http://www.wunderground.com/US/OR/Bend.html',
                iconUrl: 'http://icons-ak.wxug.com/i/c/k/partlycloudy.gif',
                weather: 'Partly Cloudy',
                temp: '55.0 F (12.8 C)',
            },

            {
                name: 'Manzanita',
                forecastUrl: 'http://www.wunderground.com/US/OR/Manzanita.html',
                iconUrl: 'http://icons-ak.wxug.com/i/c/k/rain.gif',
                weather: 'Light Rain',
                temp: '55.0 F (12.8 C)',
            },

        ],
    };
}

app.use(function(req, res, next){
    if(!res.locals.partials) res.locals.partials = {};
    res.locals.partials.weather = getWeatherData();
    next();
});

app.use(express.static("public"));

app.use(require('body-parser')());

app.get('/newsletter', function(req, res){
    res.render('newsletter', {
        csrf: 'CSRF token goes here'
    });
})

app.post('/process', function(req, res){
    console.log('Form (from querystring): ' + req.query.form);
    console.log('CSRF token from hidden form field: ' + req.body._csrf);
    console.log('Name from visible form field: ' + req.body.name);
    console.log('Email from visible form field ' + req.body.email);
    res.redirect(303, '/thank-you');
})

app.get('/', function(req, res){
    res.render('home');
});

app.get('/jquery-test', function(req, res){
    res.render('jquery-test');
})

app.get('/nursery-rhyme', function(req, res){
    res.render('nursery-rhyme');
})

app.get('/about', function(req, res){
    var randomFortune = fortunes[Math.floor(Math.random() * fortunes.length)];
    res.render('about', {fortune: randomFortune});
})

app.get('/formtest', function(req, res){
    res.render('formtest');
})



app.use(function(req, res){
    res.status(404);
    res.render('404');
});

app.use(function(err, req, res, next){
    console.error(err.stack);
    res.status(500);
    res.render('500');
});

app.listen(app.get('port'), function(){
    console.log('Express sadasdasdasdasdas' +
        app.get('port' + ': press asdadas '));
});