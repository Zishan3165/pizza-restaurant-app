import React from 'react';
import {
    View,
    TouchableOpacity,
    Image,
    Text
} from 'react-native';
import {
     createBottomTabNavigator, BottomTabBar 
} from '@react-navigation/bottom-tabs';

import Svg, { Path } from 'react-native-svg';

import icons from '../constants/icons';
import COLORS from '../constants/theme';

import AdminPage from '../Screens/AdminPage';

const Tab = createBottomTabNavigator();

const Tabs = () => {
    return(
        <Tab.Navigator
            tabBarOptions= {{
                style: {
                    borderTopWidth: 0,
                    backgroundColor: 'transparent',
                    elevation: 0
                }
            }}
        >
            <Tab.Screen 
                name= 'Add Item'
                component= {AdminPage}
                options={{
                    tabBarIcon: ({focused}) => (
                        <Image
                        source= {icons.pizza}
                        resizeMode='contain'
                        style={{
                            width:25,
                            height: 25,
                            tintColor : focused ? COLORS.COLORS.darkTeal : COLORS.COLORS.lightTeal
                        }}
                    />
                    )
                }}
            />
            <Tab.Screen 
                name= 'Add Gift Cards'
                component= {AdminPage}
                options={{
                    tabBarIcon: ({focused}) => (
                        <Image
                        source= {icons.plus}
                        resizeMode='contain'
                        style={{
                            width:25,
                            height: 25,
                            tintColor : focused ? COLORS.COLORS.darkTeal : COLORS.COLORS.lightTeal
                        }}
                    />
                    )
                }}
            />
            <Tab.Screen 
                name= 'Add Deals'
                component= {AdminPage}
                options={{
                    tabBarIcon: ({focused}) => (
                        <Image
                        source= {icons.deals}
                        resizeMode='contain'
                        style={{
                            width:25,
                            height: 25,
                            tintColor : focused ? COLORS.COLORS.darkTeal : COLORS.COLORS.lightTeal
                        }}
                    />
                    )
                }}
            />
            <Tab.Screen 
                name= 'Profile'
                component= {AdminPage}
                options={{
                    tabBarIcon: ({focused}) => (
                        <Image
                        source= {icons.user}
                        resizeMode='contain'
                        style={{
                            width:25,
                            height: 25,
                            tintColor : focused ? COLORS.COLORS.darkTeal : COLORS.COLORS.lightTeal
                        }}
                    />
                    )
                }}
            />
        </Tab.Navigator>
        
    )
}

export default Tabs;