/* eslint-disable @typescript-eslint/camelcase */
import React from 'react'
import Styles from './form-status-styles.scss'
import Spinner from '@/presentation/components/spinner/spinner'

const FormStatus: React.FC = () => {
  return (
    <div className={Styles.errorWrap}>
      <Spinner className={Styles.spinner}></Spinner>
      <span className={Styles.error}>Erro</span>
    </div>
  )
}

export default FormStatus
