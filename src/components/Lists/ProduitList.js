import { Text, StyleSheet, View, Dimensions, ScrollView, TouchableHighlight } from 'react-native';
import React, { useState } from 'react';
import DoubleTap from '../DoubleTap';
import { useWatch } from 'react-hook-form';
import { useSelector } from 'react-redux';
import Feather from 'react-native-vector-icons/Feather'
import uuid from 'react-native-uuid'


const { width, height } = Dimensions.get("window")

const RenderItem = ({ role, ownership, paid, item, onPress, onLongPress, onDoublePress, setValue, getValues, isMaster = "false", heightSizeInit = 80 }) => {
  // const { show } = useSelector(state => state.setting)
  const show = false
  let heightSize = heightSizeInit
  return (
    <DoubleTap
      singleTap={() => {
        if (paid) {
          alert('Changes cannot be made to an order that has already been paid. Please create a new order')
          return
        }
        if ((ownership && role != 'ROLE_SUPERVISOR') && !isMaster) {
          alert('Changes cannot be made to an order that has been created from other devices.')
          return
        }
        const unid = uuid.v4()

        setValue('selectedProductsList', [...getValues().selectedProductsList, { product: { ...item, unid: item?.isFormula ? unid : null }, clickCount: 1, sent: 0, _id: generateId() }])
        onPress(unid);
      }}
      doubleTap={() => {
        onDoublePress(item?.Product);
      }}
      delay={100}
      style={[styles.item, show ? {} : { height: heightSize, backgroundColor: "white", margin: 0, width: (width - 483) / 3, padding: 0, marginVertical: 3 }]}
      onLongPress={() => onLongPress(item?.Product)}
    >
      <View style={{ borderColor: "#00000022", backgroundColor: "black", borderWidth: StyleSheet.hairlineWidth, padding: 0, justifyContent: "center", alignItems: "center", borderBottomColor: 'red', borderBottomWidth: 4 }}>

        <View style={[{ flexDirection: "column", justifyContent: "center", alignItems: "flex-start", height: heightSize, marginTop: 5 }]}>
          <Text numberOfLines={3} ellipsizeMode='tail' style={[styles.title, show ? {} : { height: heightSize - 25, backgroundColor: "black", color: 'white', marginBottom: 0, padding: 0, minWidth: '99%', fontSize: 16, textTransform: 'uppercase' }]}>{item?.itemName}</Text>
          <Text style={[styles.price, { fontSize: 16, textAlign: "right", paddingRight: 5, alignSelf: 'flex-end', color: 'white' }]}>{item?.price}</Text>
        </View>
        {/* } */}
      </View>
    </DoubleTap>
  );
}

const ProduitList = ({ orderNumber, role, ownership, paid, control, setValue, getValues, onPress, onLongPress, onDoublePress, formule, setFormule }) => {
  const productList = useWatch({ control, name: 'productList' })
  const { isMaster } = useSelector(state => state.user)

  return (
    <ScrollView style={{ width: width - 50, }} contentContainerStyle={{ flexDirection: "row", flexWrap: "wrap", gap: 2, marginLeft: 2, backgroundColor: (formule.show && orderNumber) ? 'white' : 'transparent' }}>

      {(formule.show && orderNumber) &&
        <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', }}>
          <Text style={{ fontSize: 16, padding: 5 }}>Formule: {formule?.product?.itemName}</Text>
          <TouchableHighlight onPress={() => {
            setFormule({
              show: false,
              product: null,
              addablePrice: 0,
              unid: null
            })
          }
          }>
            <View style={{ backgroundColor: 'red', padding: 8 }}>
              <Feather name={'x'} color={'white'} size={25} />
            </View>
          </TouchableHighlight>
        </View>
      }
      {(formule.show && orderNumber) &&
        formule?.product.option.map(a => {

          return (
            <>
              <Text style={{ width: '100%', paddingVertical: 10 }}>{a?.title}</Text>
              {
                a?.productOptions?.map((i, index) => {
                  return <RenderItem
                    isMaster={isMaster}
                    role={role}
                    heightSizeInit={60}
                    ownership={ownership}
                    paid={paid}
                    setValue={setValue}
                    getValues={getValues}
                    key={index}
                    item={{ ...i?.product, price: i?.addablePrice, productionTypes: formule?.product?.productionTypes }}
                    onDoublePress={() => onDoublePress(i.product)}
                    onPress={(unid) => {

                      onPress({ product: i?.product, linkToFormula: formule.show ? formule.product._id : null, addablePrice: i.addablePrice, unid: formule?.unid })
                    }}
                    onLongPress={() => onLongPress({ product: i?.product, linkToFormula: formule.show ? formule.product._id : null, addablePrice: i.addablePrice, unid: formule?.unid })}

                  />
                })}
            </>
          )

        })}



      {!(formule.show && orderNumber) &&
        productList?.map((item, index) => {

          return (
            <RenderItem
              isMaster={isMaster}
              role={role}
              ownership={ownership}
              paid={paid}
              setValue={setValue}
              getValues={getValues}
              key={index}
              item={item?.product}
              onDoublePress={() => onDoublePress(item.product)}
              onPress={(unid) => {
                onPress({ product: { ...item?.product, unid }, unid })
              }}
              onLongPress={() => {
                const unid = uuid.v4();
                onLongPress({ product: item?.product, unid })
              }}

            />
          )
        })

      }
      <View style={{ width: width - 50, backgroundColor: 'transparent', height: 500 }}></View>


    </ScrollView>
  )
}

export { ProduitList };

const styles = StyleSheet.create({
  item: {
    backgroundColor: 'white',
    // height: 150,
    width: 150,
    margin: 2,
  },
  title: {
    fontSize: 14,
    marginBottom: 10,
    flexGrow: 1,
    maxWidth: 100,
    color: 'black',
    paddingLeft: 5,
  },
  price: {
    fontSize: 10,
    zIndex: 1500,
    color: "black",
    height: 25,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
    textAlignVertical: "center",
    textAlign: "center"
  },
  itemImage: {
    flexGrow: 1,
    height: 110,
    width: 110,
    marginHorizontal: 5,
    marginVertical: 1
  },
});




// import { FlatList, Text, StyleSheet, TouchableOpacity, View, ScrollView } from 'react-native';
// import React from 'react'
// import DoubleTap from '../DoubleTap';

// const RenderItem = ({ item, onPress, onLongPress,onDoublePress }) => (

//   <DoubleTap
//     singleTap={() => {
//
//        onPress(item?.products);
//     }}
//     doubleTap={() => {
//
//       onDoublePress(item?.products);
//     }}
//     delay={200}
//     style={styles.item}
//   // onPress={() => onPress(item?.products)}
//    onLongPress={() => onLongPress(item?.products)}
//   >
//     <View style={{ height: '100%' }}>
//       <Text numberOfLines={2} ellipsizeMode='tail' style={styles.title}>{item?.itemName}</Text>
//       <Text style={styles.price}>{item?.price}</Text>
//     </View>
//   </DoubleTap>


// );
// // const keyExtractor = item => item?._id;




// const ProduitList = ({ data = [], onPress, onLongPress ,onDoublePress}) => {
//
//   return (
//     <View>
//       <FlatList

//         numColumns={4}
//         data={data}
//         renderItem={({ item }) => {

//           return (


//             <RenderItem item={item?.product} onDoublePress={() => onDoublePress(item?.product)} onPress={() => onPress(item?.product)} onLongPress={() => onLongPress(item?.product)} />

//           )
//         }}
//       // keyExtractor={keyExtractor}
//       />

//     </View>

//   )
// }

// export { ProduitList };

// const styles = StyleSheet.create({
//   item: {
//     backgroundColor: 'white',


//     padding: 15,

//     height: 110,
//     width: 127,
//     marginHorizontal: 2,
//     margin: 2

//   },
//   title: {


//     fontSize: 20,
//     fontWeight: 'bold',
//     marginBottom: 10,
//     flexGrow: 1
//   },
//   price: {
//     fontSize: 18,
//     textAlign: 'right',
//     width: '100%'

//   },
// })






