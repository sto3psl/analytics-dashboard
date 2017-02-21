import React from 'react'
import styles from './realtime-users.css'
import Logo from '../../images/logo.svg'

export default function RealtimeUsers ({ widget, webapp }) {
  const currentUsers = [widget[widget.length - 1], webapp[webapp.length - 1]]
  return (
    <div className={styles.container}>
      <img className={styles.logo} src={Logo} alt='Civey' />
      <div className={styles.numberContainer}>
        <div className={styles.numbers}>
          <div className={styles.widget}>
            <div className={styles.label}>
              Widget
            </div>
            <div className={styles.number}>
              {currentUsers[0]}
            </div>
          </div>
          <div className={styles.webapp}>
            <span className={styles.labelSmall}>Webapp</span>
            {currentUsers[1]}
          </div>
        </div>
      </div>
    </div>
  )
}
