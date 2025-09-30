import { Dimensions, Modal, ScrollView, StyleSheet, Text, TouchableHighlight, View } from 'react-native'
import { TextInput } from 'react-native-paper'
import React, { useEffect, useRef, useState } from 'react'
import Feather from 'react-native-vector-icons/Feather'
import PhoneInput from 'react-native-phone-input';
import { useDispatch } from 'react-redux';
import { getContactByPhone } from '../redux/actions/userActions';
const { height } = Dimensions.get('screen')
const QuickViewModal = ({ visible, setVisible, order, pointOfSale, onChange = () => { } }) => {
    const dispatch = useDispatch()
    const [client, setClient] = useState({
        phone: order?.phone || '',
        email: order?.email || '',
        firstName: order?.firstName || '',
        lastName: order?.lastName || '',
        addresse: order?.addresse || '',
        Ice: order?.addresse || '',
        Company: order?.addresse || '',
    })
    const ref = useRef();
    useEffect(() => {
        setClient({
            phone: order?.phone || '',
            email: order?.email || '',
            firstName: order?.firstName || '',
            lastName: order?.lastName || '',
            addresse: order?.addresse || '',
            Ice: order?.addresse || '',
            Company: order?.addresse || '',
        })
    }, [visible])

    useEffect(() => {
        if (ref?.current?.isValidNumber()) {
            dispatch(getContactByPhone({
                phone: client?.phone,
                restaurantId: pointOfSale?._id,
                callback: (data) => {
                    setClient((a) => {
                        return {
                            ...a,
                            firstName: data?.orders?.firstName,
                            lastName: data?.orders?.lastName,
                            email: data?.orders?.email,
                        }
                    })
                }
            }))
            console.log('Phone Valid')
        } else {
            console.log('Phone Not Valid yet')
        }
    }, [client.phone])


    return (
        <Modal visible={visible} statusBarTranslucent transparent>
            <ScrollView>
                <View style={{ backgroundColor: '#00000080', flexGrow: 1, flexDirection: 'row', justifyContent: 'flex-end' }}>

                    <View style={{ backgroundColor: 'white', minHeight: '100%', width: 350, }}>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                            <TouchableHighlight disabled onPress={() => { setVisible(false) }} style={{ backgroundColor: 'white', padding: 8, }} >
                                <Feather name={'x'} color={'white'} size={25} />
                            </TouchableHighlight>
                            <Text style={{ fontSize: 24, textAlignVertical: 'center' }}>Client order</Text>
                            <TouchableHighlight onPress={() => { setVisible(false) }} style={{ backgroundColor: 'red', padding: 8 }} >
                                <Feather name={'x'} color={'white'} size={25} />
                            </TouchableHighlight>
                        </View>

                        <View style={{ gap: 15, marginHorizontal: 10 }}>
                            <PhoneInput
                                ref={ref}
                                initialCountry={'ma'}
                                onChangePhoneNumber={e => {
                                    setClient(b => {
                                        return { ...b, phone: e };
                                    });
                                }}
                                initialValue={client?.phone}
                                style={{
                                    backgroundColor: 'white',
                                    borderWidth: StyleSheet.hairlineWidth,
                                    // borderColor: primaryBookTableColor,
                                    borderRadius: 5,
                                    height: 45,
                                    paddingLeft: 5,
                                }}
                            />
                            {/* <TextInput value={client?.phone} onChangeText={(txt) => setClient((t) => { return { ...t, phone: txt } })} mode='outlined' style={styles.input} placeholder='Phone' label={'Phone'} /> */}
                            <TextInput value={client?.email} onChangeText={(txt) => setClient((t) => { return { ...t, email: txt } })} mode='outlined' style={styles.input} placeholder='Email' label={'Email'} />
                            <TextInput value={client?.firstName} onChangeText={(txt) => setClient((t) => { return { ...t, firstName: txt } })} mode='outlined' style={styles.input} placeholder='First Name' label={'First Name'} />
                            <TextInput value={client?.lastName} onChangeText={(txt) => setClient((t) => { return { ...t, lastName: txt } })} mode='outlined' style={styles.input} placeholder='Last Name' label={'Last Name'} />
                            <TextInput value={client?.addresse} onChangeText={(txt) => setClient((t) => { return { ...t, addresse: txt } })} mode='outlined' style={styles.input} placeholder='Addresse' label={'Addresse'} />
                            <TextInput value={client?.Ice} onChangeText={(txt) => setClient((t) => { return { ...t, Ice: txt } })} mode='outlined' style={styles.input} placeholder='ICE' label={'ICE'} />
                            <TextInput value={client?.Company} onChangeText={(txt) => setClient((t) => { return { ...t, Company: txt } })} mode='outlined' style={styles.input} placeholder='Societe' label={'Societe'} />
                        </View>
                        <View style={{ gap: 15, marginHorizontal: 10, flexDirection: 'row', justifyContent: 'flex-end', marginTop: 35 }}>

                            <TouchableHighlight underlayColor style={{ borderRadius: 5 }} onPress={() => {
                                if (ref?.current?.isValidNumber()) {
                                    onChange(client)
                                    setVisible(false)
                                } else {
                                    alert('Phone Invalid')
                                }
                            }}>
                                <View style={[{ width: 80, height: 50, justifyContent: "center", alignItems: "center", borderWidth: StyleSheet.hairlineWidth, borderColor: "black", }, { backgroundColor: 'red', borderRadius: 3 }]}>
                                    <Text style={{ color: 'white' }}> Confirm</Text>
                                </View>
                            </TouchableHighlight>

                            <TouchableHighlight underlayColor style={{ borderRadius: 5 }} onPress={() => {
                                setVisible(false)
                            }}>
                                <View style={[{ width: 80, height: 50, justifyContent: "center", alignItems: "center", borderWidth: StyleSheet.hairlineWidth, borderColor: "black", }, { backgroundColor: 'white', borderRadius: 3 }]}>
                                    <Text style={{ color: 'black' }}>Cancel</Text>
                                </View>
                            </TouchableHighlight>

                        </View>
                    </View>
                </View>
                <View style={{ height: height - 200 }} />
            </ScrollView>
        </Modal >
    )
}

export { QuickViewModal }

const styles = StyleSheet.create({
    input: {
        fontSize: 25,
        height: 40,
        fontSize: 15,
    }
})