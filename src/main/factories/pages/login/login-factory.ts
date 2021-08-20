import React from 'react'
import { Login } from '@/presentation/pages/login'
import { RemoteAuthentication } from '@/domain/data/usecases/authentication/remote-authentication'
import { AxiosHttpClient } from '@/infra/http/axios-http-client/axios-http-client'
import { ValidationComposite } from '@/validation/validators'
import { ValidationBuilder } from '@/validation/validators/builder/validation-builder'
import { makeAxiosHttpClient } from '../../http/axios-http-client-factory'
import { makeApiUrl } from '../../http/api-url-factory'

export const makeLogin: React.FC = () => {
  return (
    <Login 
      authentication={makeRemoteAuthentication()} 
      validation={makeLoginValidation()}>
    </Login>
  )
}