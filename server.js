global.logger = require('./config/winston');
var express = require('express');
var app = express();
var favicon = require('serve-favicon');
var path = require('path');

const commonUtil = require('./server/util/commonUtil');
const scheduler = require('node-schedule');
var maria = require('./config/maria');

const loggerCatcher = require('./config/logger-catcher');
const logger = require('./config/winston');

// 사용자 검색
const treeController = require('./server/controller/treeController')(scheduler, maria, loggerCatcher);

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');
app.use(favicon(path.join(__dirname, 'ico', 'favicon.ico')))
app.use('/js', express.static(__dirname + "/js"));
app.use('/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist/js')); // redirect 
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css')); // redirect 
app.use('/css', express.static(__dirname + '/css')); // redirect 
//app.use('/mobile', express.static(__dirname + '/mobile')); // redirect 
app.use('/image', express.static(__dirname + '/image')); // redirect
//app.use('/sitemap', express.static(__dirname + '/sitemap')); // redirect sitemap
app.use('/tree', treeController);

app.use(loggerCatcher());

const port = 8081;

app.get('/', function(req, res) {
    // commonUtil.getIp(req);
    // if (commonUtil.isMobile(req)) {
    //     res.render('./mobile/treeView');
    // } else {
    //     res.render('./pc/treeView');
    // }

    res.render('./pc/treeView');
});

app.get("/robots.txt", (req, res) => {
    res.type("text/plain");
    res.send("User-agent: *\nAllow: /\nSitemap: http://doseh.co.kr/sitemap/sitemap.xml");
});


app.listen(port, () => {
    logger.info('Server START listening on port ' + port);
})
