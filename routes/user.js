import express from 'express';
const router = express.Router();

import { userById, read, update } from '../controllers/user';

router.get('/secret/:userId', (req, res) => {
    res.json({
        user: req.profile
    })
});

router.get('/user/:userId', read);
router.put('/user/:userId', update);

router.param('userId', userById);

module.exports = router;
