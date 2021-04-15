const { Schema, model, Types } = require('mongoose');

const schema = new Schema({     //создаём схему через конструктор класса
    email: {
        type: String,
        required: true,
        unique: true
    },       //unique: true - пользователь может иметь только уникальный имейл
    password: {
        type: String,
        required: true
    },
    links: [
        { type: Types.ObjectId, ref: 'Link' },
    ]

})

module.exports = model('User', schema)       //экспортируем и даём название модели - User