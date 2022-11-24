const { has } = require('cheerio/lib/api/traversing');
const logger = require('../../config/winston');
const commonUtil = require('../util/commonUtil');

module.exports = (scheduler, maria, acclogger) => {
    const app = require('express').Router();
    app.use(acclogger());

    //  url = "/tree/treeView"
    app.get('/treeView', function(req, res) {
        // commonUtil.getIp(req);
        // if (commonUtil.isMobile(req)) {
        //     res.render('./mobile/treeView');
        // } else {
        //     res.render('./pc/treeView');
        // }

        res.render('./pc/treeView');
    });

    // url = "/tree/makeTreeItem"
    app.get('/makeTreeItem', async function(req, res) {

        pool = await maria.getPool();
        try {
            let createCount = req.query.count;
            if (createCount == null) {
                createCount = 20000;
            }

            let wait;
            wait = await createTable(pool);
            wait = await removeItem(pool);
            wait = await makeTreeItem(pool, createCount);

            res.status(200).send({ "reuslt": true }); // rows 를 보내주자
        } catch (err) {
            console.log(err);
            // If something goes wrong, handle the error in this section. This might
            // involve retrying or adjusting parameters depending on the situation.
            // [START_EXCLUDE]
            logger.error(err);
            return res
                .status(500)
                .send('오류 발생')
                .end();
            // [END_EXCLUDE]
        }

    });

    async function createTable(pool) {
        logger.debug("createTable");

        let hasTable =
            `SELECT 
                COUNT(table_name) count
            FROM information_schema.TABLES 
            WHERE 1=1
            AND TABLE_SCHEMA LIKE 'treeTest' 
            AND TABLE_TYPE LIKE 'BASE TABLE' 
            AND TABLE_NAME = 'tree' `;

        let result = await pool.query(hasTable);
        if (result[0].count == 0) {
            let createQuery = ` CREATE TABLE tree (
                treeId varchar(10) NOT NULL,
                treeName varchar(10) DEFAULT NULL,
                upperTreeId varchar(10) DEFAULT NULL,
                lv smallint(6) DEFAULT NULL,
                PRIMARY KEY (treeId)
              ) `;

            result = await pool.query(createQuery);
        }

        logger.debug("end createTable");
        return;
    }

    async function removeItem(pool) {
        return await pool.query('delete from tree');
    }

    async function makeTreeItem(pool, size) {
        logger.debug("make item start");
        let insertQuery = 'insert into tree ( treeId, treeName, upperTreeId, lv ) values (?,?,?,?) ';
        let insertValue = new Array([0, '첫번째', '#', 0]);

        for (let i = 1; i < size; i++) {
            insertValue.push([i, `${i}번째`, Math.floor(i / 10), i.toString().length]);
        }

        await pool.batch(insertQuery, insertValue, function(err) {
            if (err) throw err;
        });

        logger.debug("make item end");
        return;
    }

    //  url = "/tree/getTreeList"
    app.get('/getTreeList', async function(req, res) {
        let query = `SELECT 
                        treeId id
                        , treeName text
                        , upperTreeId parent
                     FROM tree 
                     ORDER BY lv `;
        pool = await maria.getPool();
        try {
            let rows = await pool.query(query);
            if (rows == null) {
                res.send({ resultCode: -1 });
                return;
            }
            res.send(rows); // rows 를 보내주자
        } catch (err) {
            console.log(err);
            // If something goes wrong, handle the error in this section. This might
            // involve retrying or adjusting parameters depending on the situation.
            // [START_EXCLUDE]
            logger.error(err);
            return res
                .status(500)
                .send('오류 발생')
                .end();
            // [END_EXCLUDE]
        }
    });

    return app;
}