import { View, Text,StyleSheet,TouchableOpacity } from 'react-native'
import React from 'react'

const ButtonCard = props =>{
  const content = (
    <View style={[styles.button,{backgroundColor : props.color}]}>
    <TouchableOpacity onPress={props.onPress}>
      <Text style={styles.text}>{props.text}</Text>
    </TouchableOpacity>
  </View>
)
return content;
}
const styles = StyleSheet.create({
  button:{
    padding: 14, 

     right:30,
     marginTop: 400,
     margin: 2,
  },
  text:{
    textAlign: 'center',
     fontWeight: '600', 
     fontSize: 16, 
     color: 'black'
  }
})
export default ButtonCard