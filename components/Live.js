import React, { Component } from 'react'
import { View, Text, ActivityIndicator, TouchableOpacity, StyleSheet, Animated  } from 'react-native'
import { Foundation } from '@expo/vector-icons'
import { purple, white } from '../util/colors'
import {Location, Permissions } from 'expo'
import { calculateDirection } from '../util/helpers'

export default class Live extends Component {
  state = {
    coords: {latitude:1,longitude:1,altitude:1,accuracy:1,heading:1,speed:1},
    status: 'undetermined',
    direction: '',
    bounceValue: new Animated.Value(1),
  }
  componentDidMount () {
    Permissions.getAsync(Permissions.LOCATION)
      .then(({ status }) => {
        console.log("ComponentDidMount", status)
        if (status === 'granted') {
          return this.setLocation()
        }
        this.setState(() => ({ status }))
      })
      .catch((error) => {
        console.warn('Error getting Location permission: ', error)

        this.setState(() => ({ status: 'undetermined' }))
      })
    //this.askPermission()
  }
  askPermission = () => {
    Permissions.askAsync(Permissions.LOCATION)
      .then(({ status }) => {
        if (status === 'granted') {
          return this.setLocation()
        }

        this.setState(() => ({ status }))
      })
      .catch((error) => console.warn('error asking Location permission: ', error))
  }
  setLocation = () => {
    Location.watchPositionAsync({
      enableHighAccuracy: true,
      timeInterval: 1,
      distanceInterval: 1,
    }, ({ coords }) => {
      const newDirection = calculateDirection(coords.heading)
      const { direction, bounceValue } = this.state
      if (newDirection !== direction) {
        Animated.sequence([
          Animated.timing(bounceValue, { duration: 200, toValue: 1.04}),
          Animated.spring(bounceValue, { toValue: 1, friction: 4})
        ]).start()
      }
      this.setState(() => ({
        coords,
        status: 'granted',
        direction: newDirection,
      }))
    })
  }
  render() {
    const { status, coords, direction } = this.state

    if (status === null) {
      return <ActivityIndicator style={{marginTop: 30}}/>
    }

    if (status === 'denied') {
      return (
        <View style={styles.center}>
          <Foundation name='alert' size={50} />
          <Text>
            You denied your location. You can fix this by visiting your settings and enabling location services for this app.
          </Text>
        </View>
      )
    }

    if (status === 'undetermined') {
      return (
        <View style={styles.center}>
          <Foundation name='alert' size={50} />
          <Text>
            You need to enable location services for this app.
          </Text>
          <TouchableOpacity style={styles.button} onPress={this.askPermission}>
            <Text style={styles.buttonText}>
              Enable
            </Text>
          </TouchableOpacity>
        </View>
      )
    }

    return (
      <View style={styles.container}>
        <View style={styles.directionContainer}>
          <Text style={styles.header}>You're heading</Text>
          <Text style={styles.direction}>
            {direction}
          </Text>
        </View>
        <View style={styles.metricContainer}>
          <View style={styles.metric}>
            <Text style={[styles.header, {color: white}]}>
              Altitude
            </Text>
            <Text style={[styles.subHeader, {color: white}]}>
              {coords.altitude} feet
            </Text>
          </View>
          <View style={styles.metric}>
            <Text style={[styles.header, {color: white}]}>
              Speed
            </Text>
            <Text style={[styles.subHeader, {color: white}]}>
              {coords.speed} MPH
            </Text>
          </View>
        </View>
      </View>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between'
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 30,
    marginRight: 30,
  },
  button: {
    padding: 10,
    backgroundColor: purple,
    alignSelf: 'center',
    borderRadius: 5,
    margin: 20,
  },
  buttonText :{
    color: white,
    fontSize: 20,
  },
  directionContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  header: {
    fontSize: 35,
    textAlign: 'center',
  },
  direction: {
    color: purple,
    fontSize: 120,
    textAlign: 'center',
  },
  metricContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: purple,
  },
  metric: {
    flex: 1,
    paddingTop: 15,
    paddingBottom: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginTop: 20,
    marginBottom: 20,
    marginLeft: 10,
    marginRight: 10,
  },
  subHeader: {
    fontSize: 25,
    textAlign: 'center',
    marginTop: 5,
  },
})