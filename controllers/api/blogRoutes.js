const router = require('express').Router();
const { Blog } = require('../../models');
const withAuth = require('../../utils/auth');

router.post('/', withAuth, async (req, res) => {
  try {
    //Blog, being a Sequelize model, has the create method by default and then I am just passing the data coming from the request body.
    const newBlog = await Blog.create({
      ...req.body,
      user_id: req.session.user_id,
    });
    //If the dish is successfully created, the new response will be returned as JSON.
    res.status(200).json(newBlog);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.delete('/:id', withAuth, async (req, res) => {
  try {
    const blogData = await Blog.destroy({
      where: {
        id: req.params.id,
        user_id: req.session.user_id,
      },
    });

    if (!blogData) {
      res.status(404).json({ message: 'No blog found with this id!' });
      return;
    }

    res.status(200).json(blogData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;