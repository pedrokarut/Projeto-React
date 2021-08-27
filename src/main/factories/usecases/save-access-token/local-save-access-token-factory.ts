import { SaveAccessToken } from '@/domain/usecases/save-access-token'
import { LocalSaveAccessToken } from '@/domain/usecases/save-access-token/local-save-access-token'
import { makeLocalStorageAdapter } from '../../cache/local-storage-adapter-factory'

export const makeLocalSaveAccessToken = (): SaveAccessToken => {
  return new LocalSaveAccessToken(makeLocalStorageAdapter())
}