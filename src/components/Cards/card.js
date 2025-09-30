
import React from 'react';
import { View, StyleSheet, Text, Image } from 'react-native';

const Card = (props) => {
  return (
    <View style={styles.card}>
     <Text style={styles.cardTitle}>{props.title}</Text>
     <Text style={styles.cardPrice}>{props.price}</Text>
   </View>
     
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    padding: 20,
    margin: 2,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    elevation: 2,
  },
    
    cardImage: {
      width: '30%',
      height: 30,
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
   
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',


  },
  cardPrice: {
    fontSize: 16,
  },
 } );
export default Card;







