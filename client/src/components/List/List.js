import React from 'react'
import styles from './list.css'

export default function List ({ list, maxItems, total, title, children }) {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{title}</h2>
      {children}
      <ul className={styles.list}>
        {list.slice(0, maxItems).map((item, i) => (
          <li className={styles.item} key={i}>
            <span>{item.name}</span>
            <span className={styles.percent}>{((item.count / total) * 100).toFixed(1)}%</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

List.defaultProps = {
  list: [],
  maxItems: 5
}
