const express = require('express');      //подключаем саму библиотеку express
const config = require('config');        //подключаем файл с константами
const mongoose = require('mongoose');        //подключаемся к библиотеке
const path = require('path');
const { response } = require('express');
const { resolve } = require('path');

const app = express();       //будущий сервер

app.use(express.json({ extended: true }));      //необходимо для парсинга body нодой

app.use('/api/auth', require('./routes/auth.routes'));

app.use('/api/link', require('./routes/link.routes'));

app.use('/t', require('./routes/redirect.routes'));

if (process.env.NODE_ENV === 'production') {
    app.use('/', express.static(path.join(_dirname, 'client', 'build')));

    app.get('*', () => {
        response.sendFile(path, resolve(__dirname, 'client', 'build', 'index.html'));
    })
}

const PORT = config.get("port") || 5000;

async function start() {
    try {
        await mongoose.connect(config.get('mongoURI'), {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });
        app.listen(PORT, () => {        //запускаем сервер на порте 5000
            console.log(`App started on port ${PORT}`);
        })
    } catch (error) {
        console.log((`server error - ${error}`));
        process.exit(1)     //завершение процесса, если что-то пошло не так
    }
}

start();



//npm i express mongoose
//express - работа с приложением
//mongoose - для работы с базой и для работы с MongoDB
//npm i config библиотека для взаимодействия с конфигурационными константами   
//bcrypt.js - либа для шифрования паролей пользователей     npm i bcryptjs
//npm i express-validator - валидатор полей для экспресс
//jsonwebtoket - npm i jsonwebtoken. Данная либа нужна для авторизации. Будет генерировать jwt token


//в packaje.json делаем    "client": "npm run start --prefix client"     //делаем --prefix client для того, чтобы запустить из другой папки

//с помощью библиотеки concurrently можно запускать несколько скриптов одной командой. 
//Т.е., можно одной командой запустить сразу и сервер, и приложение
//Указываем в package.json:
//    "dev": "concurrently \"npm run server\" \"npm run client\""


//wixim30573@whyflkj.com email test
//Testadm123 - account password

//npm i shortid библиотека для сокращения ссылок

//npm install --save-dev cross-env
//либа для добавления переменных для разных платформ (винда, убунту и т.д.)