const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = (req, res, next) => {
	if (req.method === 'OPTIONS') {		//проверяем доступность сервера
		return next();		//метод next() необходим для продолжения выполнения запроса
	}

	try {
		const token = req.headers.authorization.split(' ')[1]

		if (!token) {
			return res.status(401).json({ message: 'Нет авторизации' })
		}

		const decoded = jwt.verify(token, config.get('jwtSecret'));
		req.user = decoded;
		next();
	} catch (e) {
		return res.status(401).json({ message: 'Нет авторизации' })
	}
}