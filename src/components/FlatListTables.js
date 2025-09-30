import { View, Text, FlatList, TouchableOpacity, StyleSheet, ScrollView } from 'react-native'
import React from 'react'
import { ShapeUnitDesign } from './Design/ShapeUnitDesign';
const TableItem = ({ item, }) => {

  return (
    <TouchableOpacity  >
      <Text style={styles.item}>{item?.unitName}</Text>
    </TouchableOpacity>
  );
};
const FlatListTables = ({ data = [] }) => {
  return (
    <ScrollView>
      <View style={{ flexDirection: "row", flexWrap: "wrap", paddingBottom: 150 }}>
        {
          data.map((rr) => {
            return <ShapeUnitDesign shape={rr.shape} {...rr} color={"#aaa"} />
          })
        }
      </View>

    </ScrollView>
  )

}

export default FlatListTables
const styles = StyleSheet.create({
  item: {
    backgroundColor: 'white',
    padding: 15,
    height: 60,
    marginHorizontal: 100,
    marginVertical: 2,
  },
})