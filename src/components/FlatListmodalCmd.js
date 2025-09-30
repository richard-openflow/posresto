import React from 'react';
import { FlatList, Text, StyleSheet, TouchableOpacity, View, Image } from 'react-native';
import FastImage from 'react-native-fast-image'

const OrderLineItem = ({ item, onPress }) => {
  
  return (

    <TouchableOpacity onPress={() => { }} style={styles.item}>
      <View style={styles.itemContainer}>

        <View style={[styles.itemInfo, { alignItems: "flex-end" }]}>
          <FastImage
            source={{
              uri: "https://api.openflow.pro/" + item?.product?.image?.path,
              priority: FastImage.priority.normal,
            }}
            style={styles.itemImage}
            resizeMode={FastImage.resizeMode.cover}
          />
          <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", height: 30 }}>
            <Text style={styles.itemQuantity}>{item?.quantity}X </Text>
            <Text style={styles.itemname}>{item?.product?.itemName}</Text>
            <Text style={styles.itemText}>{item?.product?.price}</Text>

          </View>

        </View>



      </View>
    </TouchableOpacity>
  );
}

const keyExtractor = item => item?.id;

const FlatListmodalCmd = ({ data = [], onPress }) => {
  const total = data?.orderLines.reduce((acc, item) => acc + item?.product?.price * item?.quantity, 0);
  const lastOrderStatus = data?.orderStatus;
  const statusSteps = [
    { name: 'Nouveau', completed: lastOrderStatus.some((e) => e.status == "new") },
    { name: 'Accepté', completed: lastOrderStatus.some((e) => e.status == "accepted") },
    { name: 'En préparation', completed: lastOrderStatus.some((e) => e.status == "in_preparation") },
    { name: 'En attente de collecte', completed: lastOrderStatus.some((e) => e.status == "awaiting_collection") },
    { name: 'Complète', completed: lastOrderStatus.some((e) => e.status == "completed") },
  ];


  return (
    <View>

      <View style={styles.statusContainer}>
        {statusSteps.map((step, index) => (
          <React.Fragment key={index}>
            {index > 0 && <View style={styles.line} />}
            <View style={styles.stepContainer}>
              <View
                style={[
                  styles.step,
                  step.completed ? styles.completedStep : null,
                ]}
              />
              <Text style={styles.stepText}>{step.name}</Text>
            </View>
          </React.Fragment>
        ))}
      </View>
      <FlatList
        data={data?.orderLines}
        style={{}}
        renderItem={({ item }) => {
          return <OrderLineItem item={item} onPress={onPress} />;
        }}
        keyExtractor={keyExtractor}
        ListFooterComponent={() => {
          return (
            <View style={styles.totalContainer}>
              <Text style={styles.totalText}>Total: {total}</Text>
            </View>
          )
        }}
      />

    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    backgroundColor: 'white',
    padding: 5
  },

  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemInfo: {
    flexDirection: 'row',
  },
  itemText: {
    fontSize: 18,
  },
  itemQuantity: {
    fontSize: 20,
    backgroundColor: 'black',
    color: 'white',
  },
  itemImage: {
    width: 70,
    height: 70,
  },
  itemname: {
    fontSize: 20,
    color: 'black'
  },
  totalContainer: {
    borderWidth: 1,
    borderColor: 'black',
    padding: 10,
    marginTop: 10,
    alignItems: 'center',
  },
  totalText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginTop: 30,

  },
  stepContainer: {
    alignItems: 'center',
    position: 'relative',
    width: 250
  },
  step: {
    width: 10,
    height: 10,
    borderRadius: 30,
    backgroundColor: 'gray',
  },
  completedStep: {
    backgroundColor: 'green',
  },
  stepText: {
    fontSize: 18,
    marginTop: 5,
  },
  line: {
    position: 'absolute',
    width: '84%',
    height: 1.5,
    backgroundColor: 'gray',
    top: 4,
    left: '8%',
  },
});

export default FlatListmodalCmd;




