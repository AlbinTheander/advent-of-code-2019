export class KeyedMap<KeyType, ValueType> {
  data = new Map<string, ValueType>();
  keyFn: (key: KeyType) => string;
  defaultValue: (key: KeyType) => ValueType;

  constructor(
    keyFn: (key: KeyType) => string,
    defaultValue: (key: KeyType) => ValueType = (): ValueType => null
  ) {
    this.keyFn = keyFn;
    this.defaultValue = defaultValue;
  }

  set(key: KeyType, value: ValueType): KeyedMap<KeyType, ValueType> {
    this.data.set(this.keyFn(key), value);
    return this;
  }

  get(key: KeyType): ValueType | null {
    const theKey = this.keyFn(key);
    if (this.data.has(theKey)) return this.data.get(theKey);
    return this.defaultValue(key);
  }

  has(key: KeyType): boolean {
    return this.data.has(this.keyFn(key));
  }

  values(): IterableIterator<ValueType> {
    return this.data.values();
  }
}
