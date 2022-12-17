const router = require('express').Router();
const { Blog, User } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', async (req, res) => {
  try {
    //This gets all of the blog entries and JOINs with the appropriate user data.
    const blogData = await Blog.findAll({
      include: [
        {
          model: User,
          attributes: ['name'],
        },
      ],
    });

    /*Here, "get plain true" will give me back a plain object, just the data values. The plain data is what will work with the templates I am using. Sequelize will return a complex object that has methods. But that will not work for my template.
    I am using "map" to iterate over my blogData.
    Then, I am rendering the template.*/
    const blogs = blogData.map((blog) => blog.get({ plain: true }));

    res.render('homepage', { 
      blogs, 
      logged_in: req.session.logged_in 
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/blog/:id', async (req, res) => {
  try {
    //This will search the database for a dish with an id that matches params.
    const blogData = await Blog.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ['name'],
        },
      ],
    });

    const blog = blogData.get({ plain: true });

    res.render('blog', {
      ...blog,
      logged_in: req.session.logged_in
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

//withAuth is middleware.
router.get('/profile', withAuth, async (req, res) => {
  try {
    //This find the logged-in user based on their session ID.
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ['password'] },
      include: [{ model: Blog }],
    });

    const user = userData.get({ plain: true });

    res.render('profile', {
      ...user,
      logged_in: true
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/login', (req, res) => {
  //If the user is already logged in, then redirect the request to another route.
  if (req.session.logged_in) {
    res.redirect('/profile');
    return;
  }

  res.render('login');
});

module.exports = router;
