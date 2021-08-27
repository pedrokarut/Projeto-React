import { SetStorage } from '@/domain/data/protocols/cache/set-storage'

export class LocalStorageAdapter implements SetStorage {
  async set (key: string, value: any): Promise<void> {
    localStorage.setItem(key, value)
  }
}