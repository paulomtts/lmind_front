export function mapObject<K, V>(
    obj: Record<string, K>
    , callback: (key: string, value: K) => V
): V[] {
    return Object.entries(obj).map(([key, value]) => callback(key, value));
}