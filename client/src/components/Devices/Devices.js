import React from 'react'
import styles from './devices.css'
import MobileIcon from '../../images/mobile.svg'
import TabletIcon from '../../images/tablet.svg'
import DesktopIcon from '../../images/desktop.svg'

function getIcon (name) {
  switch (name.toLowerCase()) {
    case 'tablet':
      return TabletIcon
    case 'desktop':
      return DesktopIcon
    default:
      return MobileIcon
  }
}

export default function Devices ({ list, title, total }) {
  return (
    <div className={styles.container}>
      {list.map((item, i) => (
        <div
          key={i}
          style={{ width: `${item.count / total * 100}%` }}
          className={styles[item.name.toLowerCase()]}
        >
          {item.count / total * 100 > 0.08 &&
            <img className={styles.icon} src={getIcon(item.name)} alt={item.name} />
          }
        </div>
      ))}
    </div>
  )
}

Devices.defaultProps = {
  list: []
}
