import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native'
import { connect } from 'react-redux'
import { getMetricMetaInfo, timeToString, getDailyReminderValue  } from '../util/helpers'
import { white, purple } from '../util/colors'
import UdaciSlider from './UdaciSlider'
import UdaciStepper from './UdaciStepper'
import DateHeader from './DateHeader'
import {Ionicons } from '@expo/vector-icons'
import TextButton from './TextButton'
import { submitEntry, removeEntry } from '../util/api'
import { addEntry } from '../actions'
import { NavigationActions } from 'react-navigation'

class AddEntry extends React.Component {
  //steps initialized to 0
  state = {
    run: 0,
    bike: 0,
    swim: 0,
    sleep:0,
    eat:0
  }

// for run, bike and swim metric, increment the state
  increment = (metric) => {
    const { max, step } = getMetricMetaInfo(metric)

    this.setState( (state) => {
      const count = state[metric] + step

      return {
        ...state,
        [metric]: count > max ? max : count
      }
    })
  }

  decrement = (metric) => {
    
    this.setState( (state) => {
      const count = state[metric] - getMetricMetaInfo(metric).step

      return {
        ...state,
        [metric]: count < 0 ? 0 : count
      }
    })
  }

  slide = (metric, value) => {
     this.setState( () => ({
      [metric]: value,
    }))
  }

  submit = () => {
     const key = timeToString()
     const entry = this.state
 
     // Update Redux
     this.props.dispatch(addEntry({
       [key]: entry
     }))
     this.setState(() => ({ run: 0, bike: 0, swim: 0, sleep: 0, eat: 0 }))
 
     // Navigate to home
     this.toHome()
     // Save to "DB"
     submitEntry({key, entry})
     // Clear local notification
   }

   reset = () => {
     const key = timeToString()
     // update redux
     this.props.dispatch(addEntry({
       [key]: getDailyReminderValue()
     }))
     //route to home
     this.toHome()
     //update database
     removeEntry(key)

   }

   toHome = () => {
     this.props.navigation.dispatch(NavigationActions.back({
       key: 'AddEntry'
     }))
   }

  render() {
    const metaInfo = getMetricMetaInfo()
    if (this.props.alreadyLogged) {
      return (
        <View style={styles.center}>
          <Ionicons
            name={ Platform.OS === 'ios' ? 'ios-happy-outline' : 'md-happy'}
            size={100}
          />
          <Text>You already logged information for today</Text>
          
          <TextButton onPress={this.reset}>
            Reset
          </TextButton>
        </View>
      )
    }
    return (
      <View style={styles.container}>
        <DateHeader date={(new Date()).toLocaleDateString()} />
        {Object.keys(metaInfo).map((key) => {
          const { getIcon, type, ...rest} = metaInfo[key]
          const value = this.state[key]
          return (
            <View key={key} style={styles.applyRow}>
              {getIcon()}
              {type === 'slider'
                ? <UdaciSlider 
                    value={value} 
                    onChange={(value) => this.slide(key, value)}
                    {...rest} 
                  />
                : <UdaciStepper 
                    value={value}
                    onIncrement={()=> this.increment(key)}
                    onDecrement={()=> this.decrement(key)}
                    {...rest}
                />
              }
            </View>
          )
        })}
        <SubmitBtn onPress={this.submit} />
      </View>
    )
  }
}

// local component

function SubmitBtn ({ onPress }) {
   return (
     <TouchableOpacity 
       style={Platform.OS === 'ios' ? styles.iosSubmitBtn : styles.androidBtn}
       onPress={onPress}>
         <Text style={styles.submitBtnText}>SUBMIT</Text>
     </TouchableOpacity>
   )
 }

 const styles = StyleSheet.create({
   container: {
     flex: 1,
     padding: 20,
     backgroundColor: white,
   },
   applyRow: {
     flexDirection: 'row',
     flex:1,
     alignItems: 'center'

   },
   iosSubmitBtn: {
      backgroundColor: purple,
      padding: 10,
      borderRadius: 7,
      height: 45,
      marginLeft: 40,
      marginRight: 40,
   },
   androidBtn: {
      backgroundColor: purple,
      padding: 10,
      paddingLeft: 30,
      paddingRight: 30,
      borderRadius: 2,
      height: 45,
      alignSelf: 'flex-end',
      justifyContent: 'center',
      alignItems: 'center',
   },
   submitBtnText: {
     color: white,
     fontSize: 22,
     textAlign: 'center'
   },
   center: {
     flex:1,
     justifyContent: 'center',
     alignItems: 'center',
     marginLeft: 30,
     marginRight: 30,
   }
 })

 function mapStateToProps(state) {
   const key = timeToString()
   return {
     alreadyLogged: state[key] && typeof state[key].today === 'undefined'
   }
 }

 export default connect(mapStateToProps)(AddEntry)