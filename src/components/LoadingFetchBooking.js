import React from 'react'
import { ActivityIndicator, Modal, StyleSheet, Text, View } from 'react-native'
import { useSelector } from 'react-redux'

const LoadingFetchBookingModal = () => {

    const { isFetchLoading, tempoBooking } = useSelector(state => state.order)
  

    return (
        <Modal visible={isFetchLoading} transparent statusBarTranslucent>
            <View style={{ flex: 1, backgroundColor: '#00000020', justifyContent: "center", alignItems: 'center' }}>

                <View style={{ backgroundColor: 'white', padding: 15, flexDirection: "row", gap: 5 }}>
                    <ActivityIndicator />
                    <Text> Please Wait...</Text>

                </View>

            </View>
        </Modal>
    )
}

export { LoadingFetchBookingModal }

const styles = StyleSheet.create({})