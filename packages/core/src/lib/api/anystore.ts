
import { ApiClient, BucketOperateModel, CollectionOperates, ObjectOperates, ResultType } from '@/network';
import { service } from '@/di/decorator/service';

/**
 * 奥集能任意数据存储API
 */
@service(["ApiClient"])
export default class AnyStore {

  readonly client: ApiClient;

  constructor(client: ApiClient) {
    this.client = client;
  }

  /**
   * 查询对象
   * @param {string} key 对象名称（eg: rootName.person.name）
   * @param {string} belongId 对象所在域, 个人域(user),单位域(company),开放域(all)
   * @returns {ResultType} 对象异步结果
   */
  public async get<T>(belongId: string, key: string): Promise<ResultType<T>> {
    return await this.client.requestObject({
      methodName: ObjectOperates.Get,
      key,
      belongId
    });
  }
  /**
   * 修改对象
   * @param {string} key 对象名称（eg: rootName.person.name）
   * @param {any} setData 对象新的值
   * @param {string} belongId 对象所在域, 个人域(user),单位域(company),开放域(all)
   * @returns {ResultType} 变更异步结果
   */
  public async set(belongId: string, key: string, setData: any): Promise<ResultType<any>> {
    return await this.client.requestObject({
      methodName: ObjectOperates.Set,
      key,
      belongId,
      data: setData
    });
  }
  /**
   * 删除对象
   * @param {string} key 对象名称（eg: rootName.person.name）
   * @param {string} belongId 对象所在域, 个人域(user),单位域(company),开放域(all)
   * @returns {ResultType} 删除异步结果
   */
  public async delete(belongId: string, key: string): Promise<ResultType<any>> {
    return await this.client.requestObject({
      methodName: ObjectOperates.Delete,
      key,
      belongId
    });
  }
  /**
   * 添加数据到数据集
   * @param {string} collName 数据集名称（eg: history-message）
   * @param {any} data 要添加的数据，对象/数组
   * @param {string} belongId 对象所在域, 个人域(user),单位域(company),开放域(all)
   * @returns {ResultType} 添加异步结果
   */
  public async insert(belongId: string,collName: string, data: any): Promise<ResultType<any>> {
    return await this.client.requestCollection({
      methodName: CollectionOperates.Insert,
      collName,
      belongId,
      option: data
    });
  }
  /**
   * 更新数据到数据集
   * @param {string} collName 数据集名称（eg: history-message）
   * @param {any} update 更新操作（match匹配，update变更,options参数）
   * @param {string} belongId 对象所在域, 个人域(user),单位域(company),开放域(all)
   * @returns {ResultType} 更新异步结果
   */
  public async update(belongId: string, collName: string, update: any): Promise<ResultType<any>> {
    return await this.client.requestCollection({
      methodName: CollectionOperates.Update,
      collName,
      belongId,
      option: update
    });
  }
  /**
   * 从数据集移除数据
   * @param {string} collName 数据集名称（eg: history-message）
   * @param {any} match 匹配信息
   * @param {string} belongId 对象所在域, 个人域(user),单位域(company),开放域(all)
   * @returns {ResultType} 移除异步结果
   */
  public async remove(belongId: string, collName: string, match: any): Promise<ResultType<any>> {
    return await this.client.requestCollection({
      methodName: CollectionOperates.Remove,
      collName,
      belongId,
      option: match
    });
  }
  /**
  * 从数据集查询数据
  * @param {string} collName 数据集名称（eg: history-message）
  * @param {any} options 聚合管道(eg: {match:{a:1},skip:10,limit:10})
  * @param {string} belongId 对象所在域, 个人域(user),单位域(company),开放域(all)
  * @returns {ResultType} 移除异步结果
  */
  public async aggregate(belongId: string, collName: string, options: any): Promise<ResultType<any>> {
    return await this.client.requestCollection({
      methodName: CollectionOperates.Aggregate,
      collName: collName,
      belongId,
      option: options
    });
  }

  /**
   * 操作桶
   * @param data 操作携带的数据
   * @returns {ResultType<T>} 移除异步结果
   */
  public async bucketOperate<T>(belongId: string, data: BucketOperateModel): Promise<ResultType<T>> {
    return await this.client.requestBucket(data);
  }

}
