import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { colors } from '../../theme/Styles'

const Button = props => {
  const content = (
    <View style={[styles.button, { backgroundColor: props.color || colors.primary }]}>
      <Text style={styles.text}>{props.text}</Text>
    </View>
  )
  return <TouchableOpacity testID={props.testID} accessibilityLabel={props.accessibilityLabel} onPress={props.onPress}>{content}</TouchableOpacity>
}
const styles = StyleSheet.create({
  button: {
    padding: 10,
    paddingHorizontal: 25,
    borderRadius: 10,
    backgroundColor: colors.primary
  },
  text: {
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 16,
    color: '#fff'
  }
})
export default Button