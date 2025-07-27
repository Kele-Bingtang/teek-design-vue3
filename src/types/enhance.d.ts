/**
 * 将对象的某个属性变为可选，如：

interface User {
  name: string;
  age: string;
  gender: string;
}

// gender 变为可选
let user: PartialKey<User, "gender"> = {
  name: "",
  age: "",
};
// age 和 gender 变为可选
let user: PartialKey<User, "age" | gender"> = {
  name: "",
};

 */
declare type PartialKey<T, U extends keyof T> = Pick<T, Exclude<keyof T, U>> & Partial<Pick<T, U>>;

/**
 * 指定属性变为必选
 */
declare type RequiredKey<T, U extends keyof T> = Pick<T, Exclude<keyof T, U>> & Required<Pick<T, U>>;

/**
 * 指定的属性为必选，其他属性都变为可选
 *
 * 如 RequiredKey<User, "name">
 * 则只有 name 是必填，age 和 gender 变为可选
 */
declare type RequiredKeyPartialOther<T, U extends keyof T> = Partial<Pick<T, Exclude<keyof T, U>>> &
  Required<Pick<T, U>>;

/**
 * 指定属性变为只读
 */
declare type ReadOnlyKey<T, U extends keyof T> = Pick<T, Exclude<keyof T, U>> & Readonly<Pick<T, U>>;

/**
 * 对象类型
 */
declare type Recordable<T = string, K = any> = Record<T extends null | undefined ? string : T, K>;

/**
 * 可空类型
 */
declare type Nullable<T> = T | null;

/**
 * 对象 key 转小写后返回字面量，
 *
 * 如 interface User = {NAME: string, AGE: string}
 * keyLowercase<User> 返回 "name" | "name"
 */
declare type keyLowercase<T> = Lowercase<keyof T>;

/**
 * 对象 key 转大写后返回字面量
 *
 * 如 interface User = {name: string, age: string}
 * keyUppercase<User> 返回 "NAME" | "AGE"
 */
declare type keyUppercase<T> = Uppercase<keyof T>;

/**
 * 创建一个类型，用于将键名添加 'on' 前缀
 * 如 type Search = {search: [params: string], reset: [params: string]}
 *
 * type SearchOn = keyOnPrefix<Search>
 *
 * SearchOn 为 {onSearch: (params: string) => void, onReset: (params: string) => void}
 *
 * 该类型可以用于 Emits 类型
 */
declare type keyOnPrefix<T> = {
  [K in keyof T as `on${Capitalize<K>}`]: T[K] extends readonly any[] ? (...t: T[K]) => void : never;
};

/**
 * 深层递归所有属性为可选
 */
type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

/**
 * 深层递归所有属性为只读
 */
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};
