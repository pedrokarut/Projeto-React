/* eslint-disable @typescript-eslint/camelcase */
import React, { useContext } from 'react'
import Styles from './form-status-styles.scss'
import Spinner from '@/presentation/components/spinner/spinner'
import Context from '@/presentation/context/form/form-context'

const FormStatus: React.FC = () => {
  const { state } = useContext(Context)
  const { isLoading, mainError } = state
  return (
    <div data-testid="error-wrap" className={Styles.errorWrap}>
      {isLoading && <Spinner className={Styles.spinner}></Spinner>}
      { mainError && <span data-testid="main" className={Styles.error}>{mainError}</span>}
    </div>
  )
}

export default FormStatus
