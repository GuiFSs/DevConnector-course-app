const express = require('express'),
      mongoose = require('mongoose'),
      bodyParser = require('body-parser'),
      passport = require('passport');


const users = require('./routes/api/users'),
      profile = require('./routes/api/profile');
      posts = require('./routes/api/posts');

const port = process.env.PORT || 5000;
const app = express();

// Body parser middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// DB config
const db = require('./config/keys').mongoURI;

// Connect to MongoDB
mongoose.connect(db, {useNewUrlParser: true })
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

// Passport middleware
app.use(passport.initialize());

// Passport config
require('./config/passport')(passport);

// Use Routes
app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);

app.listen(port, () => console.log(`Server running on port ${port}`));