import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { connect } from 'react-redux'
import { white } from '../util/colors'
import MetricCard from './MetricCard'
import TextButton from './TextButton'
import {addEntry } from '../actions'
import { removeEntry } from '../util/api'
import { timeToString, getDailyReminderValue } from '../util/helpers'

class EntryDetails extends React.Component {

  static navigationOptions = ({navigation}) => {
    const { entryId } = navigation.state.params
    const year = entryId.slice(0,4)
    const month = entryId.slice(5,7)
    const day = entryId.slice(8)

    return {
      title: `${month}/${day}/ ${year}`
    }
  }


  reset = () => {
    const { entryId, dispatch } = this.props
    
    dispatch(addEntry({
      [entryId]: timeToString() === entryId 
        ? getDailyReminderValue()
        : null
    }))
    
    this.goBack()
    //remove entry from local storage
    removeEntry(entryId)
  }

  goBack = () => {
    
    const { navigation } = this.props
    
    navigation.goBack()
  }

  shouldComponentUpdate (nextProps) {
    return nextProps.metrics !== null && !nextProps.metrics.today
  }

  render () {
    const { metrics, entryId } = this.props
    return (
      <View style={styles.container}>
        <MetricCard metrics={metrics} />
        
        <TextButton style={{margin:20}} onPress={this.reset}>
          RESET
        </TextButton>
        
      </View>
    )
  }
}

const styles = StyleSheet.create( {
  container: {
    flex:1,
    backgroundColor: white,
    padding: 15,
  }
})

//state and the props get passed to mapStateToProps
const mapStateToProps = (state, { navigation }) => {
  const { entryId } = navigation.state.params
  
  return {
    entryId,
    metrics: state[entryId]
  }

}

export default connect(mapStateToProps)(EntryDetails)