const router = require('express').Router();
const { BlogEntry } = require('../../models');
const withAuth = require('../../utils/auth');

router.post('/', withAuth, async (req, res) => {
  try {
    const newBlogEntry = await BlogEntry.create({
      ...req.body,
      user_id: req.session.user_id,
    });

    res.status(200).json(newBlogEntry);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.delete('/:id', withAuth, async (req, res) => {
  try {
    const blogentryData = await BlogEntry.destroy({
      where: {
        id: req.params.id,
        user_id: req.session.user_id,
      },
    });

    if (!blogentryData) {
      res.status(404).json({ message: 'No blog found with this id!' });
      return;
    }

    res.status(200).json(blogentryData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;