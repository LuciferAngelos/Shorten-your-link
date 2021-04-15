const { Schema, model, Types } = require('mongoose');

const schema = new Schema({     //создаём схему через конструктор класса
    from: {
        type: String,
        required: true
    },
    to: {
        type: String,
        required: true,
        unique: true
    },
    code: {
        type: String,
        required: true,
        unique: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    clicks: {
        type: Number,
        default: 0
    },
    owner: {
        type: Types.ObjectId,
        ref: "User"     //указываем модель
    }

})

module.exports = model('Link', schema)       //экспортируем и даём название модели - User