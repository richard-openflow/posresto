import { View, StyleSheet } from 'react-native'
import FlaListcomponent from '../../components/Lists/FlaListcomponent';
import ButtonCard from '../../components/Button/ButtonCard';
import ButtonPanel from '../../components/Button/buttonPanel';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { getMenu } from '../../redux/actions/menuAction';




const menu = ({ navigation }) => {


  return (
    <View style={{ flex: 1, flexDirection: 'row' }}>

      <View style={{ flex: 0.78, flexDirection: 'row', backgroundColor: 'white' }}>
        <FlaListcomponent />
      </View>

      <View style={{ flex: 0.22, flexDirection: 'row', backgroundColor: 'gray' }}>

        <View>
          <FontAwesome name="user-circle" style={{ fontSize: 40, color: 'white', left: 170, marginTop: 5 }} onPress={() => navigation.navigate('commande')} />
        </View>

        <ButtonCard text='cash' color='white' />
        <ButtonCard text='carte' color='white' />
        <ButtonCard text='more' color='white' />

      </View>

      <View style={styles.bottomBar}>
        {/* <ButtonPanel text='Reservation' color='#E0E0E0' onPress={() => navigation.navigate('reservation')} /> */}
        <ButtonPanel text='commande' color='#E0E0E0' onPress={() => navigation.navigate('commande')} />
        <ButtonPanel text='control' color='#E0E0E0' onPress={() => navigation.navigate('control')} />

      </View>
    </View>
  )
}
const styles = StyleSheet.create({
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    height: 50,
    width: '100%',
    backgroundColor: 'gray',
  },
})
export default menu;











