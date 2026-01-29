export type CleanObject<T extends object> = {
  [K in keyof T]: T[K];
} & {};
