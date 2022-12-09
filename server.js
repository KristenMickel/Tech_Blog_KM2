// Dependencies
const express = require('express');

// Import express-handlebars
const exphbs = require('express-handlebars');
const hbs = exphbs.create({});
const path = require('path');

// Sets up the Express App
const app = express();
const PORT = process.env.PORT || 3001;

const routes = require('./controllers');
const sequelize = require('./config/connection');

// Describe what the following two lines of code are doing.
// The following two lines of code are setting Handlebars.js as the default template engine.
//This is how you have to set it up per the documentation.
//We are setting up our view engine stuff.
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');


app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Setting up our static folder called "public".
//When we use this express.static below, it makes everything in the public folder a route even though it may not be in our controller folder (so like /images) so I can do a GET to it. Otherwise, we have to make individual routes for everything in the public folder.
app.use(express.static(path.join(__dirname, 'public')));
// Sets up the routes
//Controllers folder follows MVC pattern.
//app.use(require('./controllers/dish-routes'));
app.use(routes);

// Starts the server to begin listening
sequelize.sync({ force: false }).then(() => {
    app.listen(PORT, () => console.log('Now listening'));
  });



/*Now, we are looking at how we can use handlebars with sequelize with mysql as the DB. How we can put everything together.*/
/*Change here is that instead of our data coming from a list in our file like in the previous examples, now we will be connecting to our database.*/

/*To run this, you have to do the following:
1). Go to db folder, login to MySQL, and source the schema.sql file.
2). Go back to main, and then seed using the seeds folder and the index.js file in that folder.
3). Then run "npm i".
4). Then run "node server.js".
5). Then go to the browser and enter the correct routes.
6). When first run it, you are not going to get your JSON the way you should be getting it. To get our JSON data properly, we have to pass an option to Sequelize when we use our query.*/