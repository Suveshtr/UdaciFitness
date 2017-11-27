import React, { Component } from 'react'
import { connect } from 'react-redux'
import { View, Text } from 'react-native'
import { receiveEntries, addEntry } from '../actions/index'
import { timeToString, getDailyReminderValue } from '../util/helpers'
import { fetchCalendarResults } from '../util/api'

class History extends Component {

  componentDidMount() {
    const { dispatch } = this.props
    fetchCalendarResults()
      .then(entries => dispatch(receiveEntries(entries)))
      .then(({ entries }) => {
        
        if (!entries[timeToString()]) {
          
          dispatch(addEntry({
            [timeToString()]: getDailyReminderValue()
          }))
        }
      })
  }
  render () {
    return (
      <View>
        <Text>
          {JSON.stringify(this.props)}
        </Text>
      </View>
    )
  }
}

function mapStateToProps( entries ) {
  return {
    entries
  }
}

export default connect(mapStateToProps)(History)
