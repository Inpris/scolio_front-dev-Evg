import { Injectable } from '@angular/core';

@Injectable()
export class LocalStorage {
  private storage = window.localStorage || window.sessionStorage;

  get length() {
    return this.storage.length;
  }

  clear() {
    window.localStorage.clear();
    window.sessionStorage.clear();
  }

  getItem(key: string) {
    return this.storage.getItem(key);
  }

  public getTemplJsonItem(key) {
    const value = window.sessionStorage.getItem(key);
    if (value === null) {
      return value;
    }
    return this.deserialize(value);
  }

  public getJsonItem(key) {
    const value = window.localStorage.getItem(key);
    if (value === null) {
      return value;
    }
    return this.deserialize(value);
  }

  key(index: number) {
    return this.storage.key(index);
  }

  public removeItem(key: string) {
    this.storage.removeItem(key);
  }

  public removeTempItem(key) {
    window.sessionStorage.removeItem(key);
  }

  public setItem(key: string, data: string) {
    this.storage.setItem(key, data);
  }

  public setTempJsonItem(key, value) {
    window.sessionStorage.setItem(key, this.serialize(value));
  }

  public setJsonItem(key, value) {
    window.localStorage.setItem(key, this.serialize(value));
  }

  private serialize(data): string {
    if (typeof data === 'undefined') {
      throw new Error('Storage service serialization error: Unable to store undefined value!');
    }
    if (typeof data !== 'string') {
      try {
        return JSON.stringify(data);
      } catch (_) {
        console.error(data);
        throw new Error('Storage service serialization error: Unable to serialize that value!');
      }
    }
    return data;
  }

  private deserialize(data): any {
    try {
      return JSON.parse(data);
    } catch (_) {
      console.error(data);
      throw new Error('Storage service deserialization error: Unable to parse stored data!');
    }
  }
}
