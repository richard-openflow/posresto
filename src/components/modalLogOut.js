import { Realm } from '@realm/react';
import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { realmConfig } from '../utils/realmDB/store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';

const ModalLogout = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const dispatch = useDispatch()

    const handleLogout = async () => {
        AsyncStorage.clear();
      dispatch({ type: "LOGOUT" })
    };

    return (
        <View>
            <TouchableOpacity onPress={() => setModalVisible(true)}>
                <FontAwesome5 name="power-off" style={{ fontSize: 40, paddingLeft: 965, color: '#E0E0E0' }} />
            </TouchableOpacity>

            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{ backgroundColor: 'white', padding: 30 }}>
                        <Text>Voulez-vous quitter ?</Text>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <Text>Non</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={handleLogout}>
                                <Text>Oui</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default ModalLogout;



