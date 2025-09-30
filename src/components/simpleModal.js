import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Modal, TextInput, StatusBar, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { sendCommand } from '../redux/actions/commandeClientAction';
import moment from 'moment'

import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import FontAwesome from 'react-native-vector-icons/MaterialIcons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

import SelectDropdown from 'react-native-select-dropdown'
import { getTable } from '../redux/actions/tableAction';
import DropdownComponent, { DropDown } from './SelectDropDownComponent';


const WIDTH = Dimensions.get('window').width;
const HEIGHT_MODAL = 250;
const SimpleModal = ({ changeModalVisible, setData, selectedProductsList, visible }) => {
   
    const dispatch = useDispatch();
    const { table } = useSelector((state) => state.table);


    const [valid, setvalid] = useState({
        firstName: '',
        lasttName: '',
        email: '',
        phone: '',
    });
    useEffect(() => {
        // dispatch(getTable());
    }, [visible]);
    const handlePress = (data) => {
     
    };
    closeModal = (modal, data) => {
        changeModalVisible(modal);
        setData(data);
        // if(data === 'confirmer'){
        const command =
        {
            restaurantId: "629f392f297a647b71389af5",//
            orderDate: moment().format('YYYY-MM-DD'),
            orderTime: moment().format('HH:mm'),
            orderOrigin: "manager",
            typeOrder: "on_spot",
            // unit:{
            //    unitName:'' ,
            //    unitNumber:'' ,
            //    seatsNumber:''
            // }, 
            firstName: valid.firstName,
            lastName: valid.lasttName,
            email: valid.email,
            phone: valid.phone,
            menu: "629f6c36d5952c2b67d04023",
            orderLines: selectedProductsList.map((item) => {
                return (
                    {
                        product: item.product._id,
                        addableProductPrice: 0,
                        addableIngredientsPrice: 0,
                        quantity: item.clickCount,
                        menuProduct: item._id,
                        productPrice: 9,
                        conditionsChoose: [],
                        addableIngredientsChoose: [],
                        removableIngredientsChoose: [],
                        addableProductsChoose: [],
                        isLocked: 0
                    }
                )
            }),
            expectedTime: moment().add(20, "minute"),
            tips: 0,
            cutleryRequested: false,
            allergyInfo: "",
            customerNotes: "",
            discount: 0,
            socketId: "socket.id"
        };

        dispatch(sendCommand(command))


        // } 
    }
    fermeModal = (modal, data) => {
        changeModalVisible(modal);
        setData(data);
    }
    return (

        <Modal statusBarTranslucent transparent={true}
            animationType='fade'
            visible={visible}>
            <View style={{ backgroundColor: "#00000077", flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ScrollView contentContainerStyle={{ justifyContent: "center", alignItems: "center", flexGrow: 1 }}>
                    <TouchableOpacity
                        disabled={true}
                        style={styles.container}>
                        <View style={[styles.modal, { width: 500, }]}>
                            <View style={styles.textView}>
                                <Text style={styles.text}>vous etes sur!</Text>
                                <DropdownComponent data={table} onChange={handlePress} />
                            </View>
                            <View style={styles.buttonsView}>
                                <TouchableOpacity style={styles.touchable} onPress={() => fermeModal(false, 'Cancel')}>
                                    <Text styles={styles.textbutton}>Annuler</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.touchable} onPress={() => closeModal(false, 'confirmer')}>
                                    <Text styles={styles.text}>Confirmer</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableOpacity>
                </ScrollView>

            </View>

        </Modal>

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',

    },
    modal: {
        paddingTop: 10,
        backgroundColor: 'white',
        borderRadius: 10,

    },
    textView: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    text: {
        margin: 25,
        fontSize: 20,
        fontWeight: 'bold'
    },
    buttonsView: {
        width: '100%',
        flexDirection: 'row'
    },
    touchable: {
        flex: 1,
        paddingVertical: 20,
        alignItems: 'center',

    },
    input: {
        flex: 1,
        paddingVertical: 0,
    },
    textbutton: {
        margin: 5,
        fontSize: 30,
        fontWeight: 'bold'
    },

    containerInput: {
        flexDirection: 'row',
        borderBottomColor: '#ccc',
        borderBottomWidth: 2,
        paddingBottom: 10,
        marginBottom: 10,
        width: 180
    },

})

export { SimpleModal }