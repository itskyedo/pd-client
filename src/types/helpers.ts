export type CleanObject<T extends object> = {
  [K in keyof T]: T[K];
} & {};

export type IsOptional<T, TKey extends keyof T> =
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  {} extends Pick<T, TKey> ? true : false;
