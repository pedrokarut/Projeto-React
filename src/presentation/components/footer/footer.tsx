import React, { memo } from 'react'
import Styles from './footer-styles.scss'

const Footer: React.FC = () => {
  return (
    <header className={Styles.header}>
      <footer className={Styles.footer} />
    </header>
  )
}

export default memo(Footer)
