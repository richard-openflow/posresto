import React, { useEffect, useState } from 'react';
import { Dimensions, Modal, TextInput, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useDispatch, useSelector } from 'react-redux';
import { FlatListCommande } from '../components/Lists/FlatListCommande';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { height } = Dimensions.get('screen')


const Historique = ({ onPress, navigation }) => {
  const { currentRestaurant: a } = useSelector(state => state.user)
  // const currentRestaurant = new Realm.BSON.ObjectId(a)
  // const data = JSON.parse(JSON.stringify(useSQLQuery('Orders').filtered('pointOfSale._id == $0 && Z == null', currentRestaurant) || []))
  const { orders, uniqueId } = useSelector(state => state.order)
  const [showDelete, setShowDelete] = useState(false)
  const [showDialogDelete, setShowDialogDelete] = useState({
    show: false,
    callback: () => { }
  })
  const { isMaster } = useSelector(state => state.user)
  useEffect(() => {
    (async () => {
      const rltm = await AsyncStorage.getItem('realTimeOrder')

      setShowDelete(rltm != 'true')

    })()
  }, [])

  const confirmDelete = (data) => {
    setShowDialogDelete(data)
  }

  return (
    <View style={{ flex: 1 }}>
      <FlatListCommande
        confirmDelete={confirmDelete}
        showDelete={showDelete}
        isMaster={isMaster}
        uniqueId={uniqueId}
        data={orders
          ?.filter(e => {
            return e?.pointOfSale?._id == a?._id

          })
          ?.filter((c) => {
            const total = c?.commandProduct?.reduce((total, { product, clickCount, status, linkToFormula, addablePrice }) => {
              if (status == 'cancel')
                return total
              return total + (linkToFormula ? addablePrice : product?.price) * clickCount;
            }, 0)

            const totalPayed = c?.paidHistory?.reduce((total, { amount }) => {
              return total + amount;
            }, 0)

            return (total <= totalPayed && c?.commandProduct?.map((e) => e?.orderClassifying).every((f) => f <= c?.nextInKitchen)) && c?.commandProduct.length != 0 && total != 0
          }).sort((b, a) => { return new Date(a?.createdAt) - new Date(b?.createdAt) })} />
      <SecretDeleteCommand setShowDialogDelete={setShowDialogDelete} showDialogDelete={showDialogDelete} />
    </View>
  );
};


const SecretDeleteCommand = ({ showDialogDelete, setShowDialogDelete }) => {

  const { stuff, } = useSelector(state => state.stuff)
  const [unitNumber, setUnitNumber] = useState('')
  const [tp, setTp] = useState({
    sender: null,
    receiver: null
  })
  const dispatch = useDispatch()
  return (
    <Modal visible={showDialogDelete.show} transparent statusBarTranslucent={true}>
      <View style={{
        flex: 1,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <View style={{ width: 390, backgroundColor: 'white', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>


          <View style={{ flexDirection: 'row', width: '100%', borderWidth: StyleSheet.hairlineWidth, }}>
            <TextInput secureTextEntry placeholder='PIN' editable={false} value={unitNumber} style={{ flexGrow: 1, fontSize: 25, textAlign: 'center', color: 'red', height: 80 }} />

          </View>

          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 'Clear', 0, 'OK']?.map((e) => {
            return (
              <TouchableOpacity key={e} style={{ width: '33.33%', }} onPress={async () => {
                if (e == 'Cancel') {
                  dispatch({ type: 'HIDE_KEY_PAD' })
                }
                else if (e == 'Clear') {

                  setUnitNumber('')

                } else if (e == 'Close') {

                  setShow(false)

                }
                else if (e != 'OK') {
                  setUnitNumber((f) => f + '' + e)
                  if (unitNumber.length >= 3) {

                    let a = stuff.filter((f) => f.pin == (unitNumber + '' + e))[0]
                    if (a) {
                      if (a?.role == 'ROLE_DIRECTOR') {
                        showDialogDelete?.callback()
                      }
                      setShowDialogDelete({ show: false, callback: () => { } })
                      setUnitNumber('')

                    }
                  }
                }
              }}>
                <View style={{ borderWidth: StyleSheet.hairlineWidth, height: 80, justifyContent: 'center', alignItems: 'center' }} >
                  <Text style={{ color: 'black', fontSize: e != 'Cancel' ? 25 : 14 }}>{e}</Text>
                </View>
              </TouchableOpacity>
            )
          })}
        </View>
      </View>

    </Modal>
  )
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: 'white',


  },
  itemText: {

    fontSize: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    flexGrow: 1,
    backgroundColor: 'white',

  },
  closeButton: {
    height: 30,
    width: 30,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#00000088"
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },

});





export default Historique