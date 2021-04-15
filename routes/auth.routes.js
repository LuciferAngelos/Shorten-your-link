const { Router } = require('express');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
const config = require("config");
const jwt = require('jsonwebtoken');
const User = require('../models/User')
const router = Router();

// /api/auth/register
//обработка пост запроса
router.post(
  '/register',
  [       //массив middlware для валидации
    check('email', 'Некорректный email').isEmail(),        //1 параметр - что проверяем, 2 параметр - сообщение об ошибке. isEmail - проверяет, имейл ли это
    check('password', 'Минимальная длина пароля 6 символов').isLength({ min: 6 })       //1 параметр - что проверяем, 2 параметр - сообщение об ошибке. islength - min - минимальная длина пароля. Думаю, есть куча других свойств. Дока
  ],
  async (request, response) => {
    try {
      const errors = validationResult(request);

      if (!errors.isEmpty()) {
        return response.status(400).json({
          errors: errors.array(),     //приводим к массиву методом array
          message: 'Некорректные данные при регистрации'
        })
      }

      const { email, password } = request.body;

      const candidate = await User.findOne({ email })        //модель ищет совпадение пользователя по почте

      if (candidate) {
        return response.status(400).json({ message: 'Такой пользователь уже существует' })
      }

      const hashedPassword = await bcrypt.hash(password, 12);
      const user = new User({ email, password: hashedPassword })

      await user.save();

      response.status(201).json({ message: 'Пользователь создан' })       //201 статус - создание


    } catch (e) {
      console.log(`ошибка ${e}`);
      response.status(500).json({ message: 'Что-то пошло не так, попробуйте снова!' })
    }
  })

// /api/auth/login
//обработка пост запроса
router.post(
  '/login',

  [       //массив middlware для валидации
    check('email', 'Введите корректный email.').normalizeEmail().isEmail(),        //1 параметр - что проверяем, 2 параметр - сообщение об ошибке. isEmail - проверяет, имейл ли это. normalizeEmail - приводит к нормальному виду email
    check('password', 'Введите пароль').exists()       //1 параметр - что проверяем, 2 параметр - сообщение об ошибке. Валидатор exists - проверяет, существует ли такой пароль. Думаю, есть куча других свойств. Дока
  ],
  async (request, response) => {
    try {
      const errors = validationResult(request);

      if (!errors.isEmpty()) {
        return response.status(400).json({
          errors: errors.array(),     //приводим к массиву методом array
          message: 'Некорректные данные при входе в систему'
        })
      }

      const { email, password } = request.body;

      const user = await User.findOne({
        email
      });

      if (!user) {
        return response.status(400).json({ message: 'Пользователь не найден' })
      }

      const isMatch = await bcrypt.compare(password, user.password)      //сравниваем захэшированные пароли - который получили с фронта и пароль, которых хранится в бд

      if (!isMatch) {
        return response.status(400).json({ message: "Не верный пароль. Попробуйте снова" })
      }

      const token = jwt.sign(        //передаём параметры для токена. Первый параметр - объект, где необходимо указать те данные, которые будут зашифрованы в данном токене. Вторым параметром - секретный ключ. Третий параметр, где указываем параметр, через сколько токен закончит своё существование
        { userId: user.id },
        config.get('jwtSecret'),
        { expiresIn: "1h" }     //рекомендуется указывать время существования токена 1 час. Соответственно, пишем 1h
      )

      response.json({ token, userId: user.id })



    } catch (e) {
      response.status(500).json({ message: 'Что-то пошло не так, попробуйте снова!' })
    }

  })

module.exports = router;