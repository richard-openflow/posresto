import { StyleSheet, Text, View, useWindowDimensions, TouchableOpacity } from 'react-native';
import { TabView, SceneMap } from 'react-native-tab-view'
import React from 'react'
import { EarnedTabScreen, AffiliateTabScreen, StatisticsTabScreen, } from "@screens";
import Entypo from "react-native-vector-icons/Entypo"
import { primaryColor } from "@theme"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"

const renderScene = SceneMap({
  EarnedTab: EarnedTabScreen,
  AffiliateTab: AffiliateTabScreen,
  StatisticsTab: StatisticsTabScreen,
});

const MyAffiliateScreen = () => {
  const layout = useWindowDimensions();

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'EarnedTab', title: 'Earned' },
    { key: 'AffiliateTab', title: 'Affiliate' },
  ]);
  return <View style={{ flex: 1, backgroundColor: "white" }}>
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
      renderTabBar={(props) => {
        return (
          <View
            style={styles.tabBar}
          >
            {props.navigationState.routes.map((route, i) => {
              return (
                <TouchableOpacity
                  style={styles.tabItem}
                  onPress={() => setIndex(i)}>
                  <MaterialCommunityIcons size={18} color={i == index ? primaryColor : "gray"} name={i == 0 ? "hand-coin" : (i == 1 ? "share-variant" : "chart-box")} style={{ opacity: i == index ? 1 : 0.6, }} />
                  <Text style={{ opacity: i == index ? 1 : 0.6, marginLeft: 10, color: i == index ? primaryColor : "gray" }}>{route.title}</Text>
                </TouchableOpacity>
              );
            })}
          </View >
        )
      }}
    />
  </View>
}

export { MyAffiliateScreen }

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: "white",
    justifyContent: "center",
    paddingHorizontal: 30,
    paddingLeft: 35,

  },
  tabItem: {
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 15,
    flexDirection: "row"
  }
})