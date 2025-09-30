import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, useWindowDimensions, TouchableHighlight } from 'react-native';
import { SceneMap, TabView } from 'react-native-tab-view';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Commande from '../screens/commande';
import Historique from '../screens/Historique';
import { colors } from '../theme/Styles';
import { ModalStuffPinPadSelector } from './ModalStuffPinPadSelector';
import { useQuery } from '../utils/realmDB/store';
import { useDispatch, useSelector } from 'react-redux';
import { getAllBookingOfDay } from '../redux/actions/orderActions';

const primaryColor = "black"
const renderScene = SceneMap({
  first: Commande,
  second: Historique,
});

export default function TabViewExample() {
  const layout = useWindowDimensions();

  const { currentRestaurant } = useSelector(state => state.user)


  //const staff = useQuery('User')?.filtered('pointOfSale._id == $0', new Realm.BSON.ObjectID(currentRestaurant))
  const dispatch = useDispatch()
  const { currentRestaurant: pointOfSale } = useSelector(state => state.user)
  const { stuff, activeStuff } = useSelector(state => state.stuff)
  const [index, setIndex] = useState(0);
  const [showPin, setShowPin] = useState(false);
  const [routes] = React.useState([
    { key: 'first', title: "Unpaid" },
    { key: 'second', title: 'Paid' },
  ]);

  return (
    <View style={{ flex: 1 }}>
      <TabView
        lazy
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        renderTabBar={(props) => {
          return (
            <View
              style={[styles.tabBar, { alignItems: 'center' }]}
            >

              {props.navigationState.routes.map((route, i) => {
                return (
                  <TouchableOpacity
                    style={styles.tabItem}
                    onPress={() => setIndex(i)}>
                    <MaterialCommunityIcons size={18} color={i == index ? primaryColor : "gray"} name={i == 0 ? "calendar-today" : (i == 1 ? "history" : "chart-box")} style={{ opacity: i == index ? 1 : 0.6, }} />
                    <Text style={{ opacity: i == index ? 1 : 0.6, marginLeft: 10, color: i == index ? primaryColor : "gray" }}>{route.title}</Text>
                  </TouchableOpacity>
                );
              })}

              <View style={{ height: 25, flexGrow: 1, }} />
              <TouchableHighlight onPress={() => {
                setShowPin(true)
              }}>
                <View style={{ backgroundColor: colors.primary, padding: 10, flexDirection: 'row' }}>
                  <Text style={{ color: 'white' }}>Transfer</Text>
                </View>
              </TouchableHighlight>

            </View>
          )
        }}
      />

      <ModalStuffPinPadSelector currentRestaurant={currentRestaurant} stuff={stuff} transfering={true} show={showPin} setShow={setShowPin} />
    </View>

  );

}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: "white",
    // justifyContent: "space-between",
    // justifyContent: "center",
    paddingHorizontal: 30,
    paddingLeft: 35,
    // paddingTop: Constants.statusBarHeight,
    // paddingTop: 100,
    // height: 100
  },
  tabItem: {
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 15,
    flexDirection: "row"
  }
})