var express    = require('express');
var router     = express.Router();
var functions  = require('./functions');
var server     = require('./server');

router.get('/', function(req, res){
    res.render('index');
});

module.exports = router;