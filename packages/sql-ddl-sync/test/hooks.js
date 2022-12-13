
const DBDriver  = require("@fxjs/db-driver").Driver;
const { getAllSqlQueryDialects } = require('../lib/Utils');

const TABLE_NAME = 'sql-ddl-sync-fixture__table';
const { Sync, dialect: getDialect } = require('..')

const Dialects = getAllSqlQueryDialects();
/**
 * @param {{
 *  database?: string
 *  tableName?: string
 * }} options 
 */
exports.useTest = (options = {}) => {
    const {
        connection = process.env.URI,
        database = 'sql-ddl-sync-test',
        tableName = TABLE_NAME
    } = options;
    
	const dbdriver = DBDriver.create(connection);
	const dialect = getDialect(dbdriver.type);

	/** @type {Sync} */
	const sync = new Sync({
		dbdriver: dbdriver,
		suppressColumnDrop: false,
		debug   : function (text) {
			process.env.DEBUG_SYNC && console.log("> %s", text);
		}
	});

	const transformerCtx = {
		customTypes: {},
		driver: dbdriver,
	}

    function switchDatabase () {
        dbdriver.switchDb(database);
    }

    function createDatabase (options = {}) {
        switch (dbdriver.type) {
            case "mysql":
                dbdriver.execute(
                    Dialects[dbdriver.type].escape(
                        'CREATE DATABASE IF NOT EXISTS ??', [ database ]
                    )
                );
                break ;
            case "psql":
                if (!dbdriver.dbExists(database)) {
                    dbdriver.execute(
                        Dialects[dbdriver.type].escape(
                            `CREATE DATABASE ??`,
                            [ database ]
                        )
                    );
                }
                break ;
            case "sqlite": break ;
        }
    };

    function dropDatabase () {
        switch (dbdriver.type) {
            case "mysql":
                dbdriver.execute(
                    Dialects[dbdriver.type].escape(
                        'DROP DATABASE IF EXISTS ??', [ database ]
                    )
                );
                break;
            case "psql":
                if (dbdriver.dbExists(database)) {
                    dbdriver.execute(
                        Dialects[dbdriver.type].escape(
                            `DROP DATABASE ??`,
                            [ database ]
                        )
                    );
                }
                break;
            case "sqlite": break;
        }
    };

    /**
     * @param {string | string[]} names 
     */
    function dropTable (names = [tableName]) {
        if (!Array.isArray(names)) names = [names]

        names.forEach(name => {
            dbdriver.execute(
                Dialects[dbdriver.type].escape(
                    "DROP TABLE IF EXISTS ??", [name]
                )
            );
        });
    }

    return {
        ctx: {
            tableName,
            dbdriver,
            dialect,
            sync,
            transformerCtx,
        },
        helpers: {
            createDatabase,
            dropDatabase,
            switchDatabase,
            dropTable,
        }
    }
}