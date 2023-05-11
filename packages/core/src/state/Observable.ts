import { AnyKey } from "@/types/base";

export interface IObservable {}
export interface ObservableAction<O extends IObservable> {
  /**
   * 创建可观察对象
   * @param initialValue 
   */
  create<T extends {}>(initialValue?: T) : T;
  /** 
   * 向对象增加属性
   * @param target 目标对象
   * @param prop 待增加的属性名
   * @param value 待增加的属性值
   */
  add<T extends {}, P extends AnyKey, V = any>(target: T, prop: P, value: V): T & { [F in P] : V };

  /** 
   * 向对象增加或者修改属性值 
   * @param target 目标对象
   * @param prop 待设置的属性名
   * @param value 待设置的属性值
   */
  set<T extends {}>(target: T, prop: AnyKey, value: any): T;

  /** 
   * 向对象移除属性
   * @param target 目标对象
   * @param prop 待移除的属性名
   */
  del<T extends {}, P extends AnyKey>(target: T, prop: P): Omit<T, P>;

  /**
   * 判断给定的Object是否为当前注册的可观察对象，并返回其具体实现的类型保护
   * @param obj 要判断的对象
   */
  is(obj: {}): obj is O;
}
