import { ActivityIndicator, Modal, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useSelector } from 'react-redux'

const LoadingDownloading = () => {
    const { isLoading: a } = useSelector(state => state.menu)
    const { isLoading: b } = useSelector(state => state.table)
    const { isLoading: c } = useSelector(state => state.stuff)
    return (
        <Modal statusBarTranslucent visible={a || b || c} transparent>
            <View style={{ flex: 1, backgroundColor: '#00000055', justifyContent: "center", alignItems: 'center' }}>
                <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 4, gap: 5 }}>
                    <ActivityIndicator accessibilityLabel={`ActivityIndicator`}
                        testID={`ActivityIndicator`} size={25} />
                    <Text>Downloading ...</Text>
                </View>
            </View>
        </Modal>
    )
}

export { LoadingDownloading }

const styles = StyleSheet.create({})