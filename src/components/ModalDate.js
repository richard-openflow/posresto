import { View, Text, Modal, StyleSheet, ActivityIndicator } from 'react-native'
import React from 'react'

export default function ModalDate({ isLoading }) {
    return (
        <Modal animationType='fade'
            transparent={true}
            visible={isLoading}
            statusBarTranslucent={true}>
            <View style={Styles.centeredView}>
                <View style={Styles.modalView}>
                    <ActivityIndicator size="large" color={'gray'} />

                    <Text style={Styles.modalText}>Loding..</Text>

                </View>

            </View>

        </Modal>
    )
}
const Styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: '#00000099'
    },
    modalView: {
        margin: 20,
        width: 200,
        height: 70,
        backgroundColor: "white",
        borderRadius: 5,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalText: {
        marginVertical: 15,
        textAlign: "center",
        fontSize: 17,
        marginLeft: 15,
    }
}
)
