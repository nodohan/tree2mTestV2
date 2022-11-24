module.exports = {
    db: {
        host: 'localhost',
        port: 3306,
        user: 'user1',
        password: 'password',
        database: 'treeTest',

        // [START cloud_sql_mysql_mysql_limit]
        // 'connectionLimit' is the maximum number of connections the pool is allowed to keep at once.
        connectionLimit: 100,
        // [END cloud_sql_mysql_mysql_limit]
        // [START cloud_sql_mysql_mysql_timeout]
        connectTimeout: 10000,
        acquireTimeout: 10000,
        waitForConnections: true,
        // 'queueLimit' is the maximum number of requests for connections the pool
        // will queue at once before returning an error. If 0, there is no limit.
        queueLimit: 0, // Default: 0
        // [END cloud_sql_mysql_mysql_timeout]

    },
    schedulerRun: false

}