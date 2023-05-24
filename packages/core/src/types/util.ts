/**
 * 创建自定义的类型保护
 * @param value 要检查的对象
 * @param condition 类型保护的检查代码
 * @returns 返回T类型的类型保护
 */
export function is<T>(value: unknown, condition: boolean): value is T {
  return condition;
}