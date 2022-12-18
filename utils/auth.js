/*Here, the middleware is a function and the function accepts 3 parameters - the req, the res, and the next. 
This is saying "if the user is not logged in, then redirect them to the login. Otherwise, go to the next function."*/

const withAuth = (req, res, next) => {
  //I am checking if the user is logged in or not.
    if (!req.session.logged_in) {
      res.redirect('/login');
    } else {
      next();
    }
  };
  
  module.exports = withAuth;
  