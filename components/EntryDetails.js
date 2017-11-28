import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { connect } from 'react-redux'
import { white } from '../util/colors'
import MetricCard from './MetricCard'

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


  render () {
    const { metrics, entryId } = this.props
    return (
      <View style={styles.container}>
        <MetricCard metrics={metrics} />
        <Text>
          Entry Detail - {this.props.navigation.state.params.entryId}
        </Text>
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