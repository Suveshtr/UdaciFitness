import React from 'react';
import { View, Text, Platform, StatusBar } from 'react-native';
import { TabNavigator, StackNavigator } from 'react-navigation'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import AddEntry from './components/AddEntry'
import History from './components/History'
import reducer from './reducers'
import EntryDetails from './components/EntryDetails'
import { white, purple } from './util/colors'
import { FontAwesome, Ionicons } from '@expo/vector-icons'
import { Constants } from 'expo'
import Live from './components/Live'
import { setLocalNotification } from './util/helpers'

function UdaciStatusBar ({backgroundColor, ...props}) {
  return (
    <View style={{backgroundColor, height: Constants.statusBarHeight}}>
      <StatusBar  translucent backgroundColor = {backgroundColor}/>
    </View>
  )
}


const Tabs = TabNavigator({
  Histoty: {
    screen: History,
    navigationOptions: {
      tabBarLabel: 'History',
      tabBarIcon: ({ tintColor }) => <Ionicons name='ios-bookmarks' size={30} color={tintColor}/>
    }
  },
  AddEntry: {
    screen: AddEntry,
    navigationOptions: {
      tabBarLabel: 'Add Entry',
      tabBarIcon: ({ tintColor }) => <FontAwesome name='plus-square' size={30} color={tintColor}/>
    }

  },
  Live: {
    screen: Live,
    navigationOptions: {
      tabBarLabel: 'Live',
      tabBarIcon: ({ tintColor }) => <Ionicons name='ios-speedometer' size={30} color={tintColor}/>
    }
  }

}, { 
  navigationOptions: {
    header: null
  },
  tabBarOptions: {
    activeTintColor: Platform.OS === 'ios' ? purple : white,
    style: {
      height: 56,
      padding: 10,
      backgroundColor: Platform.OS === 'ios' ? white : purple,
      shadowRadius: 6,
      shadowOpacity: 1,
      shadowColor: 'rgba(0, 0, 0, 0.24)',
      shadowOffset: {
      width: 0,
      height: 3
    },
    }
  }
})

const MainNavigator = StackNavigator({
  Home: {
    screen: Tabs,
  },
  
  EntryDetails: {
    screen: EntryDetails,
    navigationOptions: {
      headerTintColor: white,
      headerStyle: {
        backgroundColor: purple,
      }
    }
  }
  
})

const store = createStore(reducer)

export default class App extends React.Component {
  componentDidMount() {
    setLocalNotification()
  }
  render() {
    return (
      <Provider store={store}>
        <View style={{flex: 1}}>
          <UdaciStatusBar backgroundColor={purple} barStyle='light-content' />
            <MainNavigator />
        </View>
      </Provider>
    );
  }
}

