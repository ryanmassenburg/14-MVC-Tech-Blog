
const router = require('express').Router();
const { User } = require('../../models');

//login
router.post('/login', async (req, res) => {
	try {
		const userData = await User.findOne({
			where: {
				email: req.body.email,
			}
		});
	
	if (!userData) {
		res
		.status(400)
		.json({message: 'Invalid email or password'})
		return;
	}

	const password = await userData.checkPassword(req.body.password);

	if (!password) {
		res
		.status(400)
		.json({message: 'Invalid email or password'})
		return;
	}

	req.session.save(() => {
      req.session.loggedIn = true;
      res
        .status(200)
        .json({ user: userData, message: 'Successfully logged in!' });
    });
	} catch (err) {
		res.status(500).json(err);
	}
})

//logout
router.post('/logout', (req, res) => {
	if (req.session.loggedIn) {
		req.session.destroy(() => {
			res.status(204).end();
		});
	} else {
		res.status(404).end();
	}
});


// create user
router.post('/', async (req, res) => {
	try {
		const userData = await User.create({
			username: req.body.username,
			email: req.body.email,
			password: req.body.password,
		});

		req.session.save(() => {
			req.session.loggedIn = true;
			res.session(200).json(userData);
		});
	} catch (err) {
		res.status(500).json(err);
	}
});

module.exports = router;