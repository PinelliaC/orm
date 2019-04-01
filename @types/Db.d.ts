declare namespace FxOrmDb {
    interface DatabaseBase {
        conn: FxOrmNS.IDbConnection;
        on: {
            <T=any>(ev: string, func: FxOrmNS.GenericCallback<T>): void
        };
        execute: {
            (sql: string, ...args: any[]): any[];
        }

        end?: {
            (cb: FxOrmNS.VoidCallback): void
        };
        connect?: {
            (cb: FxOrmNS.GenericCallback<FxOrmNS.IDbConnection>): void
        }
        // useless now
        pool: any
    }

    interface DatabaseBase_SQLite extends DatabaseBase {
        close: {
            <T=any>(cb?: FxOrmNS.GenericCallback<T>): void
        }
        all: {
            <T=any>(query: string, cb?: FxOrmNS.GenericCallback<T>): void
        }
    }

    interface DatabaseBase_MySQL extends DatabaseBase {
        opts: FxOrmNS.IDBConnectionConfig;

        ping: {
            (cb?: FxOrmNS.VoidCallback): void
        }
    }

    // not supported now.
    interface DatabaseBase_PostgreSQL extends DatabaseBase {
    }
}