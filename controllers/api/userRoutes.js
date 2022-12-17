//This is where I can log in and it's also where I can create a new user.
const router = require('express').Router();
const { User } = require('../../models');

//This creates a new user.
router.post('/', async (req, res) => {
  try {
    const userData = await User.create(req.body);

     //What the req.session.save does is once I set-up the app.use with the session in the server.js file, everything I request will now have a session object. And, the session object has a save method.
    //This sets up sessions with a 'loggedIn' variable set to `true`.
    req.session.save(() => {
      req.session.user_id = userData.id;
      //When a user is created, they will automaticallyy be logged in.
      req.session.logged_in = true;

      res.status(200).json(userData);
    });
  } catch (err) {
    res.status(400).json(err);
  }
});

//This allows users to login.
router.post('/login', async (req, res) => {
  try {
    const userData = await User.findOne({ where: { email: req.body.email } });

    if (!userData) {
      res
        .status(400)
        .json({ message: 'Incorrect email or password' });
      return;
    }

    const validPassword = await userData.checkPassword(req.body.password);

    if (!validPassword) {
      res
        .status(400)
        .json({ message: 'Incorrect email or password' });
      return;
    }

    //Once the user successfully logs in, this sets up the sessions variable 'loggedIn'.
    req.session.save(() => {
      req.session.user_id = userData.id;
      //If the password was valid and the user was found, then log the user in.
      req.session.logged_in = true;
      
      res.json({ user: userData, message: 'You are logged in' });
    });

  } catch (err) {
    res.status(400).json(err);
  }
});

//This allows users to log out.
router.post('/logout', (req, res) => {
  //When the user logs out, destroy the session.
  if (req.session.logged_in) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

module.exports = router;