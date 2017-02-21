import React from 'react'
import { VictoryArea } from 'victory-chart'
import styles from './chart.css'

const chartProps = {
  width: 1920,
  height: 1080,
  interpolation: 'natural',
  padding: { top: 0, bottom: 0, left: 0, right: 0 },
  style: {
    data: {
      fill: '#0D58B8',
      opacity: 0.3
    }
  },
  animate: {
    easing: 'linear',
    duration: 500,
    onEnter: {
      duration: 500
    }
  }
}

export default function Chart ({ widget, webapp }) {
  const domain = {
    widget: [
      Math.min(...widget) * 0.5,
      Math.max(...widget) * 1.5
    ],
    webapp: [
      0,
      Math.max(...widget) * 0.15
    ]
  }
  console.log(domain.widget)
  return (
    <div className={styles.container}>
      {widget.length > 2 &&
        <div className={styles.graph}>
          <VictoryArea
            domain={{ y: domain.widget }}
            data={widget.map((d, i) => ({ x: i, y: d }))}
            {...chartProps}
          />
        </div>
      }
      {widget.length > 2 &&
        <div className={styles.graph}>
          <VictoryArea
            domain={{ y: domain.webapp }}
            data={webapp.map((d, i) => ({ x: i, y: d }))}
            {...chartProps}
          />
        </div>
      }
    </div>
  )
}
