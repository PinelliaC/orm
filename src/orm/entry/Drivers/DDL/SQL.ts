import coroutine = require('coroutine')

import _merge = require('lodash.merge')
import { Sync } from "@fxjs/sql-ddl-sync";
import * as Utilities from '../../Utilities';

function setIndex (p: FxOrmProperty.NormalizedPropertyHash, v: FxOrmProperty.NormalizedProperty, k: string) {
	v.index = true;
	p[k] = v;
};

export const sync: FxOrmDMLDriver.DMLDriver['sync'] = function (
	this: FxOrmDMLDriver.DMLDriver,
	opts,
	cb?
) {
	const syncInstance = new Sync({
		driver  : this,
		debug: function (text: string) {
			process.env.DEBUG_SQLDDLSYNC && (global as any).console.log("> %s", text);
		}
	});
	let props: FxOrmProperty.NormalizedPropertyHash = {};

	if (this.customTypes) {
		for (let k in this.customTypes) {
			syncInstance.defineType(k, this.customTypes[k]);
		}
	}

	syncInstance.defineCollection(opts.table, opts.allProperties);

	for (let i = 0; i < opts.many_associations.length; i++) {
		props = {};

		_merge(props, opts.many_associations[i].mergeId);
		_merge(props, opts.many_associations[i].mergeAssocId);
		Object.entries(props).forEach(([k, v]) => setIndex(props, v, k))
		_merge(props, opts.many_associations[i].props);

		syncInstance.defineCollection(
			opts.many_associations[i].mergeTable,
			props as FxOrmSqlDDLSync__Collection.Collection['properties']
		);
	}

	const syncResponse = Utilities.exposeErrAndResultFromSyncMethod<FxOrmSqlDDLSync.SyncResult>(
		() => syncInstance.sync()
	);

	Utilities.throwErrOrCallabckErrResult(syncResponse, { callback: cb });

	return this;
};

export const drop: FxOrmDMLDriver.DMLDriver['drop'] = function (
	this: FxOrmDMLDriver.DMLDriver, opts, cb?
) {
	let drop_queries = [], pending: number, err: FxOrmError.ExtendedError;

	drop_queries.push(`DROP TABLE IF EXISTS ${this.query.escapeId(opts.table)}`);

	for (let i = 0; i < opts.many_associations.length; i++) {
		drop_queries.push(`DROP TABLE IF EXISTS ${this.query.escapeId(opts.many_associations[i].mergeTable)}`);
	}

	pending = drop_queries.length;

	for (let i = 0; i < drop_queries.length; i++) {
		err = Utilities.exposeErrAndResultFromSyncMethod(this.execQuery, [drop_queries[i]], { thisArg: this }).error
		if (err || --pending === 0)
			break
	}
	Utilities.throwErrOrCallabckErrResult({ error: err }, { callback: cb });

	return this;
};
