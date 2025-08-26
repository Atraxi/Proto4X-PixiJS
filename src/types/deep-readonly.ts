export type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends Function | Primitive ?
    T[K] : 
    T[K] extends object ?
      DeepReadonly<T[K]>
      : T[K]
}

type Primitive =
| null
| undefined
| string
| number
| boolean
| symbol
| bigint