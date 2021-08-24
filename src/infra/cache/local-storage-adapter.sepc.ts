import { SetStorage } from '@/domain/data/protocols/cache/set-storage'
import faker from 'faker'

class LocalStorageAdapter implements SetStorage {
  async set (key: string, value: any): Promise<void> {
  }
}

describe('LocalStorageAdapter', () => {
  test('Should call localStorage with correct values', () => {
    const sut = new LocalStorageAdapter()
    const key = faker.database.column()
    const value = faker.random.word()
    await sut.set(key, value)
  })
})
