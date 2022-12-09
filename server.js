/*Notes:
We are now dealing with a design principle called "Separation of Concerns", which views that each sectin of a program should only address a separate concern.
The Model-View-Controller framework is an architectural pattern that adheres to this principle.
The Model is only concerned with storing data and data-related logic.
The View is only concerned with UI/UX issues, essentially what the user will see and interact with.
The Controllers is the interface/middleman between the Model and View. It processes requests from the View, uses the Model to manipulate data, and sends data to the View for rendering. It is essentially the routes in Express.js.
A Template Engine is used to render views. It is software that allows us to combine data with a static template to generate dynamic HTML. It offers variables (placholders for the data to include), functions, conditional rendering and looping, and text replacement. Handlebars is the TE used in this challenge/module. It is an extension of the templating language Mustache.
The benefits of using a TE are:
1). It helps you to follow the separation of concerns principle by providing an easy, clean way to separate HTML and JS.
2). It offers tools that reduce repitition in code.
3). It is easy to create, use, and maintain.
4). It improves search engine optimization and makes fewer client-to-server requests.*/

/*Required Folder Structure (necessary in order to be able to work with express-handlebars):
1). controllers - is the replacement for the "routes" folder.
2). config - has the database connection file.
3). db - has the database schema file.
4). models - has the Sequelize model files.
5). public - holds any CSS or frontend Javascript, or any needed images.
6). seeds - has the files with the data used for seeding the database.
7). utils - is where to store any utility functions that you want to be able to re-use like the helpers.js file.
8). views - has layouts and partials.
*/

const path = require('path');
const express = require('express');

//Here, I am importing express-session (included in my Package.json file) which is a simple session middleware for Express.js. I give it a secret which it then uses to create the Cookie string. When you use an express-session, it creates a store like a database in memory so it just has an array and the details of everything in there. Secret is used to encrypt everything.
const session = require('express-session');

//Here, I am importing express-handlebars to use with sequelize and mysql as the DB so that instead of my data coming from a list in a file, like in the previous examples, I will now be connecting to my relational database.*/
const exphbs = require('express-handlebars');

const routes = require('./controllers');

//Here, I am importing the custom helper methods. There are built-in helpers (like IF, UNLESS, EACH, etc), but you can also have custom helpers. Helpers are a way to mix in JS into your handlebars template.
const helpers = require('./utils/helpers');

const sequelize = require('./config/connection');

//I am creating a new Sequelize store in order to save the sessions in my database using the connect express-session package.
const SequelizeStore = require('connect-session-sequelize')(session.Store);

//I am setting up the Express App and PORT.
const app = express();
const PORT = process.env.PORT || 3001;

//I am setting up my session object with cookies and connecting to my Sequelize database using SequelizeStore. I am putting all of my options into a variable called "sess" and then passing this to express-session.
const sess = {
  secret: 'Super secret secret',
    //express-session will use cookies by default, but I can specify options for those cookies by adding a cookies property to my session options.
    //This is my cookie property, which is stored in milliseconds.
    //The number of times I visit a site is stored by Cookies. They are similar to Local Storage but they send data from the server to the browser back and forth. This is how the browser knows who is accessing it. Only the server understands the Cookie - it is using the Cookie to track how many times you are visting the site and also who is logged in.
  cookie: { 
    //This is how long the cookie can be alive for. Once you log-in, you will be logged in for X amount of time, then you will be automatically logged out. By default, this is set to null so it cannot expire.
    //maxAge sets the maximum age for the cookie to be valid. Here, the cookie (and session) will expire after one hour. So, this is essentially its expiration date.
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true,
    //The secure option tells express-session to only initialize session cookies when the protocol being used is HTTPS. Having this set to true, and running a server without encryption, will result in the cookies not showing up in the developer console. So the fact that this is set to false is saying not to work with HTTPS because when it is running on your local machine, it can only use the unsecured version (http).
    secure: false,
    //Per the class documentation, "sameSite tells express-session to only initialize session cookies when the referrer provided by the client matches the domain our server is hosted from"
    sameSite: 'strict',
  },
  resave: false,
  saveUninitialized: true,
  //By default, when you use an express-session, it stores it in memory. But, here I am storing it in my database. One benefit of doing this is I can track what people are doing when I track their sessions. If it's in memory, if I stop my server, I lose all of it. But, if I save in the database, when I stop my server, then it will remain. This is coming from a new package set to the variable "SequelizeStore" above. The connect-session-sequelize package is in my package.json file now. Connect was the framework people used before express existed. But, I can use this for express too. SequelizeStore is creating a sessions table containing the sessions data.
  store: new SequelizeStore({ //Creating a new copy of a class.
    db: sequelize
  })
};

//I am adding express-session and storing it as Express.js middleware. Then I am passing the "sess" variable I mentioned earlier. The system will check every X minutes to see if the session is expired and if it is expired, it will delete it from my database. Also, when I log out, it will delete it from my database.
app.use(session(sess));

//I am creating the Handlebars.js engine object with custom helper functions. This is the object that is going to have all of my helpers.
const hbs = exphbs.create({ helpers });

//The following two lines of code are setting Handlebars.js as the default template engine. This will inform Express.js which template engine I am using.
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

//Here, I am applying the JSON middleware to the entire server, but I could also apply middleware to specific routes.
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//This is setting up my static folder called "public". When I use this express.static below, it makes everything in the public folder into a route even though it may not be in my controller folder so I can do a GET to it. Otherwise, I would have to make individual routes for everything in the public folder.
app.use(express.static(path.join(__dirname, 'public')));

//This is setting up my routes.
app.use(routes);

//This starts the server to begin listening.
sequelize.sync({ force: false }).then(() => {
    app.listen(PORT, () => 
      console.log(
        `\nServer running on port ${PORT}. Visit http://localhost:${PORT} and create an account!`
      )
    );
  });