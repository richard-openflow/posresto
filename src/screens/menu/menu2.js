
import { View, Text, ScrollView } from 'react-native'
import React from 'react'

import { useDispatch, useSelector } from "react-redux"
import Button from '../../components/Button/Button'
import { AddAction, AddFailedAction, AddSuccessAction } from '../../redux/actions/userActions'

import { getMenu, getMenuSuccess } from '../../redux/actions/menuAction'
const table = () => {
  const { menu } = useSelector(state => state.menu)

  const dispatch = useDispatch()

 /* 
  //affiche la base API de menu dans le console 
  */

  
  return (
    <ScrollView>


      <Text style={{ fontSize: 30 }}>{
        JSON.stringify({ menu }, "", "\t")
      }</Text>


      <Button text="dddd" color="blue" onPress={() => dispatch(getMenu())} />
    </ScrollView>

  )
}

export default table


/*
import { View, Text } from 'react-native'
import React from 'react'
import { useDispatch, useSelector } from "react-redux"
import Button from '../../components/Button/Button'
import { ADDONEAction } from '../../redux/actions/CounterActions'

const table = () => {
  const user = useSelector(state => state.user)
  const dispatch = useDispatch()
  return (
    <View>
      
      <Text style={{ fontSize: 30 }}>{
        JSON.stringify({ user }, "", "\t")
      }</Text>


      <Button text="dddd" onPress={() => dispatch(ADDONEAction({ email: "support@upxp.pro", password: "123456" }))} />

    </View>
    
  )
}

export default table*/

