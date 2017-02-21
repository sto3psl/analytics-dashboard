import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { addUp } from './utils.js'
import './styles/app.css'
import styles from './styles/layout.css'
import RealtimeUsers from './components/RealtimeUsers/RealtimeUsers.js'
import List from './components/List/List.js'
import Devices from './components/Devices/Devices.js'
import Chart from './components/Chart/Chart.js'

const dataFetchInterval = 10

class App extends Component {
  constructor () {
    super()

    this.state = {
      webapp: {
        activeUserCount: []
      },
      widget: {
        activeUserCount: []
      }
    }
  }

  getAnalytics (project) {
    window.fetch(`/api/analytics/${project}`)
      .then(response => response.json())
      .then(body => {
        const analytics = {
          activeUsers: body.rows,
          browsers: addUp(body.rows.map(d => ({ [d[0]]: parseInt(d[4]) }))),
          countries: addUp(body.rows.map(d => ({ [d[2]]: parseInt(d[4]) }))),
          device: addUp(body.rows.map(d => ({ [d[3]]: parseInt(d[4]) }))),
          os: addUp(body.rows.map(d => ({ [d[1]]: parseInt(d[4]) })))
        }
        this.setState(prevState => {
          const newUserCount = parseInt(body.totalsForAllResults['rt:activeUsers'])
          if (prevState[project].activeUserCount.length >= 360) {
            prevState[project].activeUserCount.shift()
          }

          return {
            [project]: {
              ...prevState[project],
              ...analytics,
              activeUserCount: [
                ...prevState[project].activeUserCount,
                newUserCount
              ]
            }
          }
        })
      })
  }

  componentDidMount () {
    this.getAnalytics('widget')
    this.getAnalytics('webapp')

    if (this.props.interval) {
      this.interval = window.setInterval(() => {
        this.getAnalytics('widget')
        this.getAnalytics('webapp')
      }, dataFetchInterval * 1000)
    }
  }

  componentWillUnmount () {
    if (this.props.interval) {
      window.clearInterval(this.interval)
    }
  }

  render () {
    const { widget, webapp } = this.state
    const total = widget.activeUserCount[widget.activeUserCount.length - 1]

    return (
      <div className={styles.app}>
        <Chart widget={widget.activeUserCount} webapp={webapp.activeUserCount} />
        <RealtimeUsers widget={widget.activeUserCount} webapp={webapp.activeUserCount} />
        <div className={styles.stretch}>
          <List
            title='Operating systems'
            list={widget.os}
            devices
            total={total}
          >
            <Devices
              title='Devices'
              list={widget.device}
              total={total}
            />
          </List>
          <List
            title='Browser'
            list={widget.browsers}
            total={total}
          />
          <List
            title='Countries'
            list={widget.countries}
            total={total}
          />
        </div>
      </div>
    )
  }
}

App.propTypes = {
  interval: PropTypes.bool
}

ReactDOM.render(<App interval />, document.getElementById('app'))
