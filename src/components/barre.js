import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import ButtonPanel from './Button/buttonPanel'
import { navigate } from '../../NavigationService'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigationState, useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux'

const { width } = Dimensions.get('screen')
const Barre = ({ navigation, showKeyPad, isMaster, dispatch }) => {
  const state = useNavigationState(state => state);



  if (state?.routes[state?.routes?.length - 1]?.name == 'landing')
    return null

  
  return (
    <View style={{
      position: 'absolute',
      bottom: 0,
      flexDirection: 'row',
      height: 75,
      width: state?.routes[state?.routes?.length - 1]?.name != 'control' ? '100%' : width - 300,
      backgroundColor: '#000',
      borderColor: "#000",
      borderTopWidth: 1,
      alignItems: 'center'
    }}>
      <TouchableOpacity onPress={() => {
        dispatch({ type: 'SHOW_PROFILE' })
      }}>
        <View style={{ width: 35, height: 50, borderColor: 'white', justifyContent: 'center', alignItems: 'center' }}>
          <Ionicons name={'menu'} size={30} color={'white'} />
        </View>
      </TouchableOpacity>
      {/* <View style={{ backgroundColor: 'white', width: StyleSheet.hairlineWidth, height: '50%' }} /> */}

      <ButtonPanel text='POS' color={'#000'} Textcolor={state?.routes[state?.routes?.length - 1]?.name == 'control' ? 'red' : 'white'} onPress={() => { navigate('control') }} />

      <View style={{ backgroundColor: 'white', width: StyleSheet.hairlineWidth, height: '50%' }} />

      <ButtonPanel text='COMMANDE' color={'#000'} Textcolor={state?.routes[state?.routes?.length - 1]?.name == 'pagerCommande' ? 'red' : 'white'} onPress={() => { navigate('pagerCommande') }} />

      <View style={{ backgroundColor: 'white', width: StyleSheet.hairlineWidth, height: '50%' }} />

      <ButtonPanel text='TABLE MAP' color={'#000'} Textcolor={state?.routes[state?.routes?.length - 1]?.name == 'tableMap' ? 'red' : 'white'} onPress={() => { navigate('tableMap') }} />

      <View style={{ backgroundColor: 'white', width: StyleSheet.hairlineWidth, height: '50%' }} />

      {isMaster && <>
        <ButtonPanel text='PRODUCTION' color={'#000'} Textcolor={state?.routes[state?.routes?.length - 1]?.name == 'kitchen' ? 'red' : 'white'} onPress={() => { navigate('kitchen') }} />

      </>
      }
      <View style={{ flexGrow: 1 }} />

      {isMaster && <View style={{ backgroundColor: 'white', width: StyleSheet.hairlineWidth, height: '50%' }} />}
      {state?.routes[state?.routes?.length - 1]?.name == 'control' &&
        <TouchableOpacity onPress={() => {
          dispatch({ type: 'SHOW_KEY_PAD' })
        }}>
          <View style={{ width: 75, height: 50, borderColor: 'white', justifyContent: 'center', alignItems: 'center' }}>
            <Ionicons name={'keypad-sharp'} size={40} color={showKeyPad ? 'red' : 'white'} />
          </View>
        </TouchableOpacity>}
    </View>
  )
}

export default Barre