import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'

const ButtonPanel = props => {
  const content = (
    <View style={[styles.button, { backgroundColor: props.color }]}>
      <Text style={[styles.text, { color: props.Textcolor, }]}>{props.text}</Text>
    </View>
  )
  return <TouchableOpacity style={{}} onPress={props.onPress} >{content}</TouchableOpacity>
}
const styles = StyleSheet.create({
  button: {
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 1,
    paddingHorizontal: 10,




  },
  text: {
    textAlign: 'center',
    width: 115,
    fontWeight: '500',
    fontSize: 16,
    color: '#000000',

  }
})
export default ButtonPanel