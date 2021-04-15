const { Router } = require('express');
const Link = require('../models/Link');
const router = Router();
const auth = require('../middleware/auth.middleware');
const shortid = require('shortid')
const config = require('config')

router.post('/generate', auth, async (req, res) => {
	try {
		const baseUrl = config.get('baseUrl');
		const { from } = req.body;

		const code = shortid.generate();		//генерируем уникальный код

		const existing = await Link.findOne({ from });

		if (existing) {
			return res.json({ link: existing })
		}

		const to = baseUrl + '/t/' + code;
		const link = new Link({
			code, to, from, owner: req.user.userId
		})

		await link.save();
		res.status(201).json({ link })

	} catch (e) {
		response.status(500).json({ message: 'Что-то пошло не так, попробуйте снова!' })
	}

});

router.get('/', auth, async (req, res) => {
	try {
		const links = await Link.find({ owner: req.user.userId });		//делаем запрос в базу, где ищутся все ссылки, которые относятся к конкретному пользователю

		res.json(links);
	} catch (e) {
		response.status(500).json({ message: 'Что-то пошло не так, попробуйте снова!' })
	}


});

router.get('/:id', auth, async (req, res) => {
	try {
		const link = await Link.findById(req.params.id);

		res.json(link);

	} catch (e) {
		response.status(500).json({ message: 'Что-то пошло не так, попробуйте снова!' })
	}


});

module.exports = router;