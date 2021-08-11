import { AuthenticationParams } from '@/domain/usecases'
import { AccountModel } from '../models'
import faker from 'faker'


export const mochAuthentication = (): AuthenticationParams => ({
  email: faker.internet.email(),
  password: faker.internet.password()
})

export const mochAccountModel = (): AccountModel => ({
  accessToken: faker.random.uuid()
}) 
