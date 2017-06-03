"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Created by Edwin on 2017/6/3.
 */
var express = require("express");
var ws_1 = require("ws");
var app = express();
app.get('/api/stock', function (req, res) {
    var result = stocks;
    var params = req.query;
    if (params.name) {
        result = result.filter(function (stock) { return stock.name.indexOf(params.name) !== -1; });
    }
    res.json(result);
});
app.get('/api/stock/:id', function (req, res) {
    res.json(stocks.find(function (stock) { return stock.id == req.params.id; }));
});
var server = app.listen(8000, 'localhost', function () {
    console.log('服务器已启动,地址是 http://localhost:8000');
});
// 这个集合用来存放所有连接到websocket的客户端
var subscriptions = new Set();
var wsServer = new ws_1.Server({ port: 8085 });
wsServer.on('connection', function (websocket) {
    subscriptions.add(websocket);
});
var messageCount = 0;
setInterval(function () {
    subscriptions.forEach(function (ws) {
        if (ws.readyState === 1) {
            ws.send(JSON.stringify({ messageCount: messageCount++ }));
        }
        else {
            subscriptions.delete(ws);
        }
    });
}, 2000);
var Stock = (function () {
    function Stock(id, name, price, rating, desc, categories) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.rating = rating;
        this.desc = desc;
        this.categories = categories;
    }
    return Stock;
}());
exports.Stock = Stock;
var stocks = [
    new Stock(1, '股票名1', 1.99, 3.5, '股票说明1', ['IT', '互联网']),
    new Stock(2, '股票名2', 5.37, 4.5, '股票说明2', ['IT', '互联网']),
    new Stock(3, '股票名3', 3.37, 2.5, '股票说明3', ['金融', '互联网']),
    new Stock(4, '股票名4', 4.37, 3.5, '股票说明4', ['IT', '金融']),
    new Stock(5, '股票名5', 5.37, 4.5, '股票说明5', ['金融', '互联网']),
    new Stock(6, '股票名6', 6.37, 2.0, '股票说明6', ['金融', '互联网']),
    new Stock(7, '股票名7', 7.37, 4.0, '股票说明7', ['IT', '互联网']),
    new Stock(8, '股票名8', 8.37, 3.0, '股票说明8', ['金融', 'IT']),
];
