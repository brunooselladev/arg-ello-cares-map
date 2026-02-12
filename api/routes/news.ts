import express from 'express';
const router = express.Router();

// @route   GET api/news
// @desc    Get all news
// @access  Public
router.get('/', (req, res) => {
    res.json({ msg: 'News route placeholder' });
});

export default router;