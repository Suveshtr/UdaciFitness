import React from 'react'
import { View, Text } from 'react-native'
import { getMetricMetaInfo } from '../util/helpers'

export default class AddEntry extends React.Component {
  render() {
    return (
      <View>
        {getMetricMetaInfo('bike').getIcon() }
      </View>
    )
  }
}