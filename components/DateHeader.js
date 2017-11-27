import React from 'react'
import { Text, View } from 'react-native'
import { purple } from '../util/colors'

export default function DateHeader({date}) {
  return (
    <Text style={{color: purple, fontSize: 25}}>
      {date}
    </Text>
  )
}