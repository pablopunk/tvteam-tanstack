export interface CacheProvider {
  get(key: string): Promise<any | null>;
  set(key: string, value: any): Promise<void>;
}
