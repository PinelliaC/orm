/// <reference types="@fibjs/types" />
import FxORMCore = require('@fxjs/orm-core');
import { FxSqlQuery, FxSqlQuerySubQuery } from '@fxjs/sql-query';
import type { FxOrmInstance } from './Typo/instance';
import type { FxOrmModel } from './Typo/model';
import type { FxOrmQuery } from './Typo/query';
import type { FxOrmAssociation } from './Typo/assoc';
import { FxOrmProperty } from './Typo/property';
import { FxOrmCommon } from './Typo/_common';
import { FxOrmNS } from './Typo/ORM';
import { FxOrmError } from './Typo/Error';
import { FxOrmHook } from './Typo/hook';
export declare function standardizeOrder(order: FxOrmModel.ModelOptions__Find['order']): FxOrmQuery.OrderNormalizedTupleMixin;
export declare function addTableToStandardedOrder(order: FxOrmQuery.OrderNormalizedTupleMixin, table_alias: string): FxOrmQuery.ChainFindOptions['order'];
/**
 * @description filtered out FxOrmInstance.Instance in mixed FxSqlQuerySubQuery.SubQueryConditions | { [k: string]: FxOrmInstance.Instance }
 */
export declare function checkConditions(conditions: (FxSqlQuerySubQuery.SubQueryConditions | {
    [k: string]: FxOrmInstance.Instance;
}), one_associations: (FxOrmAssociation.InstanceAssociatedInstance | FxOrmAssociation.InstanceAssociationItem_HasOne)[]): FxSqlQuerySubQuery.SubQueryConditions;
/**
 * Gets all the values within an object or array, optionally
 * using a keys array to get only specific values
 */
export declare function values(obj: any[] | {
    [k: string]: any;
}, keys?: string[]): any[];
export declare function hasValues(obj: {
    [k: string]: any;
}, keys: string[]): boolean;
/**
 * @description from from <source> object, copy specific ids(determined by <source_model>) to <target> object as
 * correspoding <associacted_fields>, for example:
 *
 * if <source_model> id: id1, id2
 * if <associacted_fields>: user_id, production_id
 * source.id1 = 1, source.id2 = 2
 * target.user_id = undefined, target.production_id = undefined
 *
 * Then, we will get:
 *
 * target.user_id = 1, target.production_id = 2
 *
 * if target.user_id is not undefined, it wouldn't be overwritten unless <overwrite> is true
 *
 * @param source_model
 * @param associacted_fields
 * @param source
 * @param target
 * @param overwrite
 */
export declare function populateModelIdKeysConditions(source_model: FxOrmModel.Model, associacted_fields: string[], source: FxOrmInstance.InstanceDataPayload, target: FxSqlQuerySubQuery.SubQueryConditions, overwrite?: boolean): void;
export declare function getConditions(model: FxOrmModel.Model, fields: string[], from: FxSqlQuerySubQuery.SubQueryConditions): FxSqlQuerySubQuery.SubQueryConditions;
/**
 * TODO: add comment for this method
 *
 * @description WIP
 * @param params
 * @returns
 */
export declare function wrapFieldObject(params: {
    field: FxOrmAssociation.InstanceAssociationItem['field'];
    model: FxOrmModel.Model;
    altName: string;
    mapsTo?: FxOrmModel.ModelPropertyDefinition['mapsTo'];
}): Record<string, FxOrmProperty.NormalizedProperty>;
/**
 * TODO: add comment for this method
 * @param model related Model
 * @param name field name
 * @param required is field required for relationship
 * @param reversed is model is reversed in relationship
 */
export declare function formatAssociatedField(model: FxOrmModel.Model, name: string, required: boolean, reversed: boolean): Record<string, FxOrmProperty.NormalizedProperty>;
export declare function convertPropToJoinKeyProp(props: Record<string, FxOrmProperty.NormalizedProperty>, opts: {
    required: boolean;
    makeKey: boolean;
}): Record<string, FxOrmProperty.NormalizedProperty>;
export declare function getRealPath(path_str: string, stack_index?: number): string;
/**
 * @description rename a field name in <dataIn> according to the name map in <properties>
 * @example
 * ```
 * dataIn: { a: 1, b: 2 };
 * properties: { a: { mapsTo: 'a1' }, b: { mapsTo: 'b' } };
 * -->
 * result: { a1: 1, b: 2 };
 * ```
 *
 * @param dataIn
 * @param properties
 */
export declare function transformPropertyNames(dataIn: FxOrmInstance.InstanceDataPayload, properties: Record<string, FxOrmProperty.NormalizedProperty> | FxOrmModel.ModelPropertyDefinition): FxOrmInstance.InstanceDataPayload;
export declare function transformOrderPropertyNames(order: FxOrmQuery.ChainFindOptions['order'], properties: Record<string, FxOrmProperty.NormalizedProperty>): FxSqlQuery.OrderNormalizedResult[];
export declare function renameDatastoreFieldsToPropertyNames(data: FxOrmInstance.InstanceDataPayload, fieldToPropertyMap: FxOrmProperty.FieldToPropertyMapType): FxOrmInstance.InstanceDataPayload;
export declare function camelCaseHasMany(text: string): string;
export declare function ucfirst(text: string): string;
export declare function formatNameFor(key: 'assoc:hasMany' | 'assoc:hasOne' | 'findBy:common' | 'findBy:hasOne' | 'assoc:extendsTo' | 'findBy:extendsTo' | 'field:lazyload' | 'syncify:assoc', name: string): string;
export declare function combineMergeInfoToArray(merges: FxOrmQuery.ChainFindOptions['merge']): FxOrmQuery.ChainFindMergeInfo[];
export declare function parseFallbackTableAlias(ta_str: string): string;
export declare function tableAlias(table: string, alias?: string, same_suffix?: string): string;
export declare function tableAliasCalculatorInOneQuery(): (tableName: string, get_only?: boolean) => number;
export declare function ORM_Error(err: Error, cb?: FxOrmCommon.VoidCallback): FxOrmNS.ORMLike;
export declare function queryParamCast(val: any): any;
export declare function isDriverNotSupportedError(err: FxOrmError.ExtendedError): boolean;
export declare const catchBlocking: typeof FxORMCore.Utils.exposeErrAndResultFromSyncMethod;
export declare const takeAwayResult: typeof FxORMCore.Utils.throwErrOrCallabckErrResult;
export declare function doWhenErrIs(compare: {
    message?: string;
    literalCode?: string;
}, callback: Function, err?: FxOrmError.ExtendedError): void;
export declare function getErrWaitor(shouldWait?: boolean): FxOrmError.ErrorWaitor;
export declare function getValueWaitor<T = any>(shouldWait?: boolean): FxOrmCommon.ValueWaitor<T>;
export declare function parallelQueryIfPossible<T = any, RESP = any>(can_parallel: boolean, iteratee: T[], iterator: (value: T, index?: number, array?: T[]) => RESP): RESP[];
/**
 * @description do some mutation for field-value in conditions
 *
 * @param conditions
 * @param host
 */
export declare function filterWhereConditionsInput(conditions: FxSqlQuerySubQuery.SubQueryConditions, host: {
    allProperties: Record<string, FxOrmProperty.NormalizedProperty>;
}): FxSqlQuerySubQuery.SubQueryConditions;
export declare function addUnwritableProperty(obj: any, property: string, value: any, propertyConfiguration?: PropertyDescriptor): void;
export declare function addHiddenUnwritableMethodToInstance(instance: FxOrmInstance.Instance, method_name: 'save' | 'saveSync' | string, fn: Function, propertyConfiguration?: PropertyDescriptor): void;
export declare function addHiddenPropertyToInstance(instance: FxOrmInstance.Instance, property_name: string, value: any, propertyConfiguration?: PropertyDescriptor): void;
export declare function addHiddenReadonlyPropertyToInstance(instance: FxOrmInstance.Instance, property_name: string, getter: () => any, propertyConfiguration?: PropertyDescriptor): void;
export declare function fillSyncVersionAccessorForAssociation(association: FxOrmAssociation.InstanceAssociationItem): FxOrmAssociation.InstanceAssociationItem;
export declare function addHookPatchHelperForAssociation(association: FxOrmAssociation.InstanceAssociationItem): void;
export declare function generateUID4SoloGet(m_opts: FxOrmModel.ModelConstructorOptions, ids: (string | number)[]): string;
export declare function generateUID4ChainFind(m_opts: FxOrmModel.ModelConstructorOptions, merges: FxOrmQuery.ChainFindMergeInfo[], data: FxOrmInstance.InstanceDataPayload): string;
export declare function generateUID4Model(m_opts: FxOrmModel.ModelConstructorOptions): string;
export declare function makeIdForDriverTable(driver_uid: string, table: string): string;
export declare function bindInstance(instance: FxOrmInstance.Instance, fn: Function): any;
export declare function buildAssociationActionHooksPayload(hookName: keyof FxOrmAssociation.InstanceAssociationItem['hooks'], payload: {
    instance?: FxOrmInstance.Instance;
    association?: FxOrmInstance.InstanceDataPayload;
    associations?: FxOrmInstance.InstanceDataPayload[];
    association_ids?: any[];
    removeConditions?: Fibjs.AnyObject;
    $ref: Fibjs.AnyObject;
    useChannel?: Function;
}): Fibjs.AnyObject;
export declare function hookHandlerDecorator({ thisArg, onlyOnce }?: {
    thisArg?: any;
    onlyOnce?: boolean;
}): (hdlr: Function) => any;
export declare function reusableChannelGenerator(): () => FxOrmHook.HookChannelResults<Function>;
export declare const createHookHelper: (hooks: Fibjs.AnyObject, hook: keyof FxOrmModel.Hooks | keyof FxOrmAssociation.InstanceAssociationItem['hooks'], { initialHooks }?: Fibjs.AnyObject) => (cb: FxOrmHook.HookActionCallback | FxOrmHook.HookResultCallback, opts?: FxOrmModel.ModelHookPatchOptions) => any;
export declare function attachOnceTypedHookRefToInstance(instance: FxOrmInstance.Instance, type: 'save' | 'create' | 'remove', typedHookRef: Fibjs.AnyObject): void;
export declare function arraify<T = any>(item: T | T[]): T[];
export declare function isKeyProperty(prop: FxOrmProperty.NormalizedProperty): boolean;
export declare function isKeyPrimaryProperty(prop: FxOrmProperty.NormalizedProperty): boolean;
