import AsyncStorage from '@react-native-async-storage/async-storage'
import { Realm } from '@realm/react'
import React, { useEffect, useState } from 'react'
import { Modal, ScrollView, StyleSheet, Text, TouchableHighlight, View } from 'react-native'
import { Dropdown, MultiSelect } from 'react-native-element-dropdown'
import { ActivityIndicator, Checkbox, Chip, DataTable, RadioButton, Switch, TextInput } from 'react-native-paper'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { useDispatch, useSelector } from 'react-redux'
import TinyEmitter from 'tiny-emitter/instance'
import { getDevices } from '../redux/actions/DevicesActions'
import { addPrinter, deletePrinter, editPrinter } from '../redux/actions/printerActions'
import { defineMasteringType, isLinkedToOrder, setUserRole } from '../redux/actions/userActions'
import { getUniqueId } from '../utils/helpers'
import { PrinterServices } from '../utils/realmDB/service/PrinterService'
import { SendMessage } from '../utils/Udp/services'
import { useQuery } from '../utils/realmDB/store'
import BackgroundService from 'react-native-background-actions';
import { VeryIntensiveTask } from '../utils/background/Worker'
let idbv = null
const options = {
    taskName: 'Example',
    taskTitle: 'Openflow',
    taskDesc: 'Background Task Services',
    taskIcon: {
        name: 'ic_launcher',
        type: 'mipmap',
    },
    color: '#ccc',
    parameters: {
        delay: 1000,
    },
};

const SettingScreen = () => {
    const pp = useQuery('PointOfSale')

    const dispatch = useDispatch()
    const { currentRestaurant: a, role } = useSelector(state => state.user)
    const { devices } = useSelector(state => state.Device)
    const { stuff, activeStuff } = useSelector(state => state.stuff)
    const [page, setPage] = React.useState(0);
    const [master, setMaster] = React.useState(false);
    const [linked, setLinked] = React.useState(false);
    const [glovoTickets, setGlovoTickets] = React.useState(false);
    const [managerTickets, setManagerTickets] = React.useState(false);
    const [connecting, setConnecting] = React.useState(false);
    const [internet, setInternet] = React.useState(true);
    const [KitchenDisplay, setKitchenDisplay] = React.useState(false);
    const [realTimeOrder, setRealTimeOrder] = React.useState(false);
    const [AssociateWaiter, setAssociateWaiter] = React.useState(false);
    const [AssociateWaiterId, setAssociateWaiterId] = React.useState('');
    const [show, setShow] = React.useState(false);
    const [masterUiid, setMasterUiid] = React.useState('');
    const [slaveMasterUiid, setslaveMasterUiid] = React.useState('');
    const [numberOfItemsPerPageList] = React.useState([10, 20, 30]);
    const [devicess, setDevices] = useState([])
    const [pin, setPin] = useState('')
    const [itemsPerPage, onItemsPerPageChange] = React.useState(
        numberOfItemsPerPageList[0]
    );
    const { printer } = useSelector(state => state.printer)
    const { ModalAddPrinter, } = useSelector(state => state.Modal)

    const from = page * itemsPerPage;
    const to = Math.min((page + 1) * itemsPerPage, printer.length);

    React.useEffect(() => {
        setPage(0);
    }, [itemsPerPage]);

    React.useEffect(() => {
        AsyncStorage.getItem('kitchenDisplay').then((e) => {
            setKitchenDisplay(e == 'true')
        })
        AsyncStorage.getItem('realTimeOrder').then((e) => {
            setRealTimeOrder(e == 'true')
        })

        AsyncStorage.getItem('AssociateWaiter').then((e) => {
            setAssociateWaiter(e == 'true')
        })

        AsyncStorage.getItem('internetType').then((e) => {
            setInternet(e == 'true')
        })

        AsyncStorage.getItem('MasterDevices').then((e) => {
            setMaster(e == 'true')
        })
        AsyncStorage.getItem('linkedOrder').then((e) => {
            setLinked(e == 'true')
        })

        AsyncStorage.getItem('glovoTickets').then((e) => {
            setGlovoTickets(e == 'true')
        })

        AsyncStorage.getItem('managerTickets').then((e) => {
            setManagerTickets(e == 'true')
        })

        AsyncStorage.getItem('uiid').then((e) => {
            setMasterUiid(e)
        })

        AsyncStorage.getItem('duiid').then((e) => {
            setslaveMasterUiid(e)
        })

        getUniqueId().then((a) => {
            setAssociateWaiterId(a)
        })

    }, []);


    useEffect(() => {
        dispatch(getDevices({ pointOfSaleId: a?._id }))
        TinyEmitter.off('DEVICES')
        TinyEmitter.on('DEVICES', (data) => {

            setDevices((e) => { return { ...data } })

        })
    }, [])
    const connection = () => {
        idbv = setInterval(() => {
            const a = Object?.keys(devicess)?.every((e) => {
                return (devicess[e]?.iceConnectionState == 'connected' || devicess[e]?.iceConnectionState == 'completed')
            })
            SendMessage({ event: 'CONNECT_TO_ME' })
        }, 10000);

        setTimeout(() => {
            clearInterval(idbv)
            setConnecting(false)
        }, 20000);

    }

    const restartBackgroundServices = () => {

        if (BackgroundService?.isRunning()) {

            BackgroundService?.stop()?.then(() => {
                BackgroundService?.start(VeryIntensiveTask, { ...options, parameters: { pp: JSON.parse(JSON.stringify(pp)) } })
            })
        } else {
            BackgroundService?.start(VeryIntensiveTask, { ...options, parameters: { pp: JSON.parse(JSON.stringify(pp)) } })
        }

    }
    if (!show)
        return (
            <View style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, justifyContent: 'center', alignItems: 'center', gap: 8 }}>
                <Text>Settings are protected by pin</Text>
                <TextInput placeholder='Pin' keyboardType='numeric' defaultValueValue={''} onChangeText={(txt) => { if (txt == '0906') setShow(true) }} style={{ width: 250, height: 35 }} />
            </View>
        )
    return (
        <ScrollView >
            {role != 'ROLE_POS' &&
                <View style={{ backgroundColor: "white", margin: 15, borderRadius: 10, borderWidth: StyleSheet.hairlineWidth, paddingVertical: 10 }}>
                    <Text style={{ paddingLeft: 15, paddingTop: 5, fontSize: 18, color: 'black' }}>POS Activation </Text>
                    <Text style={{ paddingLeft: 15, paddingTop: 5, fontSize: 12, color: 'black' }}>Turn this device into POS </Text>
                    <View style={{ flexDirection: 'row', paddingLeft: 20, marginTop: 10 }}>
                        <TextInput secureTextEntry value={pin} onChangeText={(txt) => { setPin(txt) }} style={{ width: 250, height: 35 }} />
                        <TouchableHighlight onPress={async () => {
                            if (stuff.find(a => a.pin == pin)?.role == 'ROLE_DIRECTOR') {
                                dispatch(setUserRole('ROLE_POS'))
                                AsyncStorage.setItem('ROLE', 'ROLE_POS')
                                alert('You are now a pos')
                            } else
                                alert('PIN incorrect')
                        }}>
                            <View style={{ backgroundColor: 'black', height: 35, width: 100, justifyContent: 'center', alignItems: 'center' }}>

                                <Text style={{ color: 'white' }}>OK</Text>

                            </View>
                        </TouchableHighlight>
                    </View>
                </View>}
            <View style={{ backgroundColor: "white", margin: 15, borderRadius: 10, borderWidth: StyleSheet.hairlineWidth, paddingVertical: 10, }}>
                <Text style={{ paddingLeft: 15, paddingTop: 5, fontSize: 18, color: 'black' }}>Master Devices </Text>
                <Text style={{ paddingLeft: 15, paddingTop: 5, fontSize: 12, color: 'black' }}>Make this device that responsable to comuncation with server</Text>
                {masterUiid && <Text style={{ paddingLeft: 15, paddingTop: 5, fontSize: 12, color: 'black' }}>use this code on other deivces : {masterUiid}</Text>}
                <View>
                    <Switch onValueChange={() => {
                        setMaster((t) => {
                            const value = !t ? "true" : 'false'
                            if (!t) {
                                const a = (Date.now() + '').slice(7)
                                AsyncStorage.setItem('uiid', a)
                                setMasterUiid(a)
                            } else
                                setMasterUiid('')
                            AsyncStorage.setItem('MasterDevices', value)
                            dispatch(defineMasteringType(value == 'true'))
                            return !t
                        })
                    }}
                        style={{ paddingHorizontal: 15, flexGrow: 1 }}
                        value={master}
                    />
                </View>


                <View style={{ backgroundColor: "white", margin: 15, borderRadius: 10, borderWidth: StyleSheet.hairlineWidth, paddingVertical: 10, }}>
                    <Text style={{ paddingLeft: 15, paddingTop: 5, fontSize: 18, color: 'black' }}>Device Communication</Text>
                    <Text style={{ paddingLeft: 15, paddingTop: 5, fontSize: 12, color: 'black' }}>Choose which type you prefer this devices uses to communicate with other devices</Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                        <View style={{ marginRight: 25 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <RadioButton onPress={() => {
                                    setInternet(true)
                                    AsyncStorage.setItem('internetType', "true")
                                }}
                                    style={{}}
                                    status={internet ? 'checked' : 'unchecked'}
                                />
                                <Text>INTERNET</Text>

                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <RadioButton onPress={() => {
                                    setInternet(false)
                                    AsyncStorage.setItem('internetType', 'false')
                                }}
                                    style={{}}
                                    status={!internet ? 'checked' : 'unchecked'}
                                />
                                <Text>WIFI</Text>

                            </View>
                        </View>

                    </View>
                    {(!master) &&
                        <View style={{ paddingLeft: 25 }}>
                            <Text style={{}}>Master Device Code</Text>
                            <View style={{ flexDirection: 'row' }}>
                                <TextInput value={slaveMasterUiid} onChangeText={(txt) => { setslaveMasterUiid(txt) }} style={{ width: 250, height: 35 }} />
                                <TouchableHighlight onPress={async () => {


                                    await AsyncStorage.setItem('duiid', slaveMasterUiid)
                                    SendMessage({ event: 'CONNECT_TO_ME' })
                                    setConnecting(true)
                                    connection()

                                }}>
                                    <View style={{ backgroundColor: 'black', height: 35, width: 100, justifyContent: 'center', alignItems: 'center' }}>
                                        {!connecting ?
                                            <Text style={{ color: 'white' }}>Save</Text>
                                            :
                                            <ActivityIndicator color='white' />}
                                    </View>
                                </TouchableHighlight>
                            </View>
                        </View>
                    }
                    <View style={{ marginTop: 20 }}>
                        <DevicesSection devices={devicess} setDevices={setDevices} />

                    </View>
                </View>
                {master && <View style={{ backgroundColor: "white", margin: 15, borderRadius: 10, borderWidth: StyleSheet.hairlineWidth, paddingVertical: 10 }}>
                    <Text style={{ paddingLeft: 15, paddingTop: 5, fontSize: 18, color: 'black' }}>Kitchen Display </Text>
                    <Text style={{ paddingLeft: 15, paddingTop: 5, fontSize: 12, color: 'black' }}>Turn on Kitchen display</Text>
                    <View>
                        <Switch onValueChange={() => setKitchenDisplay((t) => {
                            AsyncStorage.setItem('kitchenDisplay', !t ? "true" : 'false')
                            return !t
                        })}
                            style={{ paddingHorizontal: 15, flexGrow: 1 }}
                            value={KitchenDisplay}
                        />
                    </View>
                </View>}

                <View style={{ backgroundColor: "white", margin: 15, borderRadius: 10, borderWidth: StyleSheet.hairlineWidth, paddingVertical: 10 }}>
                    <Text style={{ paddingLeft: 15, paddingTop: 5, fontSize: 18, color: 'black' }}>Real Time Order  </Text>
                    <Text style={{ paddingLeft: 15, paddingTop: 5, fontSize: 12, color: 'black' }}>enable weather you send order in real time to server or not and enables supression of unsent orders </Text>
                    <View>
                        <Switch onValueChange={() => setRealTimeOrder((t) => {
                            AsyncStorage.setItem('realTimeOrder', !t ? "true" : 'false')
                            return !t
                        })}
                            style={{ paddingHorizontal: 15, flexGrow: 1 }}
                            value={realTimeOrder}
                        />
                    </View>
                </View>
                <View style={{ backgroundColor: "white", margin: 15, borderRadius: 10, borderWidth: StyleSheet.hairlineWidth, paddingVertical: 10, }}>
                    <Text style={{ paddingLeft: 15, paddingTop: 5, fontSize: 18, color: 'black' }}>Link Booking</Text>
                    <Text style={{ paddingLeft: 15, paddingTop: 5, fontSize: 12, color: 'black' }}></Text>
                    <View>
                        <Switch onValueChange={() => {
                            setLinked((t) => {
                                let value = !t ? "true" : 'false'
                                AsyncStorage.setItem('linkedOrder', value)
                                dispatch(isLinkedToOrder(value == 'true'))
                                return !t
                            })
                        }}
                            style={{ paddingHorizontal: 15, flexGrow: 1 }}
                            value={linked}
                        />
                    </View>
                </View>
            </View>

            {master &&
                <View style={{ backgroundColor: "white", margin: 15, borderRadius: 10, borderWidth: StyleSheet.hairlineWidth, paddingVertical: 10 }}>
                    <Text style={{ paddingLeft: 15, paddingTop: 5, fontSize: 18, color: 'black' }}>Ticket Controller </Text>
                    <Text style={{ paddingLeft: 15, paddingTop: 5, fontSize: 12, color: 'black' }}>Take control of the action of the order received online aaaaa</Text>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{ paddingLeft: 15, paddingTop: 5, fontSize: 18, color: 'black' }}>Openflow </Text>
                        <Switch onValueChange={() => setManagerTickets((t) => {
                            AsyncStorage.setItem('ManagerTickets', !t ? "true" : 'false')
                            return !t
                        })}
                            style={{ paddingHorizontal: 15, }}
                            value={managerTickets}
                        />
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{ paddingLeft: 15, paddingTop: 5, fontSize: 18, color: 'black' }}>Glovo </Text>
                        <Switch onValueChange={() => setGlovoTickets((t) => {
                            AsyncStorage.setItem('glovoTickets', !t ? "true" : 'false')
                            return !t
                        })}
                            style={{ paddingHorizontal: 15, }}
                            value={glovoTickets}
                        />
                    </View>
                </View>}

            {master &&
                <View style={{ backgroundColor: "white", margin: 15, borderRadius: 10, borderWidth: StyleSheet.hairlineWidth, paddingVertical: 10, }}>
                    <Text style={{ paddingLeft: 15, paddingTop: 5, fontSize: 18, color: 'black' }}>List of printers</Text>
                    <DataTable>
                        <DataTable.Header>
                            <DataTable.Title>Princple</DataTable.Title>
                            <DataTable.Title>Print name</DataTable.Title>
                            <DataTable.Title>Print type</DataTable.Title>
                            <DataTable.Title>Ip adresse</DataTable.Title>
                            <DataTable.Title>Port</DataTable.Title>
                            <DataTable.Title>Ticket cut</DataTable.Title>
                            <DataTable.Title>Cash open</DataTable.Title>
                            <DataTable.Title>Production</DataTable.Title>
                            <DataTable.Title style={{ justifyContent: 'center', alignItems: 'center' }}>
                                <TouchableHighlight
                                    style={{ borderWidth: StyleSheet.hairlineWidth, paddingVertical: 5, paddingHorizontal: 10 }}
                                    onPress={() => {
                                        dispatch({ type: 'SHOW_MODAL_ADD_PRINTER' })
                                    }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 5 }}>
                                        <MaterialCommunityIcons name={'connection'} />
                                        <Text>Add</Text>
                                    </View>
                                </TouchableHighlight>
                            </DataTable.Title>
                        </DataTable.Header>

                        {[...printer].slice(from, to).map((item) => (

                            <DataTable.Row key={item.key}>
                                <DataTable.Cell>{item.main ? 'Main' : 'Dedicated'}</DataTable.Cell>
                                <DataTable.Cell>{item.name}</DataTable.Cell>
                                <DataTable.Cell>{item.type ? "Wifi" : "Bluetooth"}</DataTable.Cell>
                                <DataTable.Cell>{item.ipAdress}</DataTable.Cell>
                                <DataTable.Cell>:{item.port}</DataTable.Cell>
                                <DataTable.Cell>{item.openCashbox ? 'Auto' : 'Manual'}</DataTable.Cell>
                                <DataTable.Cell>{item.autoCut ? 'Auto' : 'Manual'}</DataTable.Cell>
                                <DataTable.Cell >{item?.productionTypes.length > 0 && <Chip selected mode='outlined' icon="printer-pos" onPress={() => { }}>{item?.productionTypes?.map((e) => e?.name).join(', ')}</Chip>
                                }</DataTable.Cell>

                                <DataTable.Cell>
                                    <View>
                                        <Switch value={item?.enbaled} onValueChange={() => {
                                            PrinterServices.toggle({
                                                _id: item?._id,
                                                callback: (data) => {
                                                    dispatch(editPrinter(data))
                                                }
                                            })
                                        }} />
                                    </View>
                                </DataTable.Cell>
                                <DataTable.Cell>
                                    <View style={{ flexDirection: 'row', gap: 5 }}>
                                        <TouchableHighlight underlayColor style={{ borderRadius: 5 }} onPress={() => {
                                            dispatch({ type: 'SHOW_MODAL_EDIT_PRINTER', payload: item?._id })
                                        }}>
                                            <View style={[{ width: 45, height: 20, justifyContent: "center", alignItems: "center", borderWidth: StyleSheet.hairlineWidth, borderColor: "black", }, { borderRadius: 3 }]}>
                                                <Text style={{ color: 'black', fontSize: 14 }}>Edit</Text>
                                            </View>
                                        </TouchableHighlight>

                                        <TouchableHighlight underlayColor style={{ borderRadius: 5 }} onPress={() => {
                                            dispatch(deletePrinter(item?._id))
                                        }}>
                                            <View style={[{ width: 45, height: 20, justifyContent: "center", alignItems: "center", borderWidth: StyleSheet.hairlineWidth, borderColor: "black", }, { borderRadius: 3 }]}>
                                                <Text style={{ color: 'black', fontSize: 14 }}>Delete</Text>
                                            </View>
                                        </TouchableHighlight>
                                    </View>
                                </DataTable.Cell>
                            </DataTable.Row>
                        ))}

                        <DataTable.Pagination
                            page={page}
                            numberOfPages={Math.ceil(printer.length / itemsPerPage)}
                            onPageChange={(page) => setPage(page)}
                            label={`${from + 1}-${to} of ${printer.length}`}
                            numberOfItemsPerPageList={numberOfItemsPerPageList}
                            numberOfItemsPerPage={itemsPerPage}
                            onItemsPerPageChange={onItemsPerPageChange}
                            showFastPaginationControls
                            selectPageDropdownLabel={'Rows per page'}
                        />
                    </DataTable>
                    {ModalAddPrinter && <AddOrEditPrintModal printers={printer} />}
                </View>
            }
            <View style={{ height: 250 }} />

        </ScrollView>
    );
}
const AddOrEditPrintModal = ({ printers = [] }) => {
    const { ModalAddPrinter, printerId } = useSelector(state => state.Modal)
    const { currentRestaurant: a } = useSelector(state => state.user)
    const currentRestaurant = new Realm.BSON.ObjectId(a?._id)

    const { ProductionTypes } = useSelector(state => state.productionTypes)

    const dispatch = useDispatch()

    const [printer, setPrinter] = useState({
        main: false,
        name: 'Printer 1',
        type: 1,
        ipAdress: '192.168.1.120',
        port: '9100',
        production: [],
        macAdress: '00:00:00:00:00',
        autoCut: true,
        openCashbox: false,
        printerNbrCharactersPerLine: 48,
    })

    const [isFocus, setIsFocus] = useState(false);

    useEffect(() => {
        setTimeout(() => {

            if (printerId) {
                const a = printers.find((e) => e?._id + '' == printerId + '')
                console.log({ a })
                setPrinter({
                    ...a,
                    port: a?.port + '' || '9100',
                    _id: a?._id + '',
                    printerNbrCharactersPerLine: a?.printerNbrCharactersPerLine + '' || 48,
                    type: a?.type || 1,
                    autoCut: a?.autoCut || true,
                    main: a?.main || false,
                    name: a?.name || 'Printer 1',
                    openCashbox: a?.openCashbox || false,
                    production: a?.productionTypes?.map((b) => {
                        return b?._id + ''
                    }) || [],
                    ipAdress: a?.ipAdress || '192.168.1.120'
                })
                setIsFocus(true)
                setTimeout(() => {
                    setIsFocus(false)
                }, 100);
            } else {
                setPrinter({
                    main: false,
                    name: 'Printer 1',
                    type: 1,
                    ipAdress: '192.168.1.120',
                    port: '9100',
                    production: [],
                    macAdress: '00:00:00:00:00',
                    autoCut: true,
                    openCashbox: false,
                    printerNbrCharactersPerLine: 48,
                })
            }
        }, 200);

    }, [ModalAddPrinter])


    return (
        <Modal visible={ModalAddPrinter} >
            <ScrollView style={{ flex: 1, backgroundColor: 'white' }}>
                <View style={{ backgroundColor: 'red', height: '100%', }}>

                    <View style={{ backgroundColor: 'white', padding: 15, paddingHorizontal: 25, minWidth: 550, gap: 10 }}>
                        <Text style={{ fontSize: 18, color: 'black', marginBottom: 15 }}>Add Print</Text>
                        <View style={{ flexDirection: 'row', width: '100%', gap: 15 }}>

                            <View style={{ flexGrow: 1, }} >
                                <Checkbox.Item onPress={() => setPrinter((t) => { return { ...t, main: true } })}
                                    style={{ borderWidth: StyleSheet.hairlineWidth, paddingHorizontal: 15, flexGrow: 1 }}
                                    label="Main"
                                    status={printer.main ? "checked" : 'unchecked'}
                                />
                            </View>
                            <View style={{ flexGrow: 1, }} >
                                <Checkbox.Item
                                    onPress={() => setPrinter((t) => { return { ...t, main: false } })}
                                    style={{ borderWidth: StyleSheet.hairlineWidth, paddingHorizontal: 15, flexGrow: 1 }}
                                    label="Dedicated"
                                    status={!printer.main ? "checked" : 'unchecked'}
                                />
                            </View>
                        </View>

                        <TextInput value={printer.name} onChangeText={(txt) => setPrinter((t) => { return { ...t, name: txt } })} mode='outlined' style={{ fontSize: 25, height: 40, fontSize: 15 }} placeholder='Printer Name' label={'Printer Name'} />

                        <View style={{ marginTop: 10 }}>
                            <Text style={[{
                                position: 'absolute',
                                backgroundColor: 'white',
                                left: 10,
                                top: -8,
                                zIndex: 999,
                                paddingHorizontal: 8,
                                fontSize: 14,
                                color: 'black'
                            }, isFocus && { color: 'red' }]}>
                                Printer Type
                            </Text>
                            <Dropdown
                                onFocus={() => setIsFocus(true)}
                                onBlur={() => setIsFocus(false)}
                                style={{ borderWidth: StyleSheet.hairlineWidth, paddingHorizontal: 15, paddingVertical: 7 }}
                                onChange={(txt) => {
                                    setPrinter((t) => { return { ...t, type: txt?.value } });
                                    setIsFocus(false);
                                }}
                                value={printer?.type}
                                labelField={'label'} valueField={'value'} data={[{ label: 'WIFI', value: 1 }, { label: 'BLUETOOTH', value: 0 }]} />
                        </View>

                        {printer.type == 0 &&
                            <TextInput value={printer.macAdress} onChangeText={(txt) => setPrinter((t) => { return { ...t, macAdress: txt } })} mode='outlined' style={{ fontSize: 25, height: 40, fontSize: 15 }} placeholder='Mac Adress' label={'Mac Adress'} />}
                        {printer.type != 0 &&
                            <TextInput value={printer.ipAdress} onChangeText={(txt) => setPrinter((t) => { return { ...t, ipAdress: txt } })} mode='outlined' style={{ fontSize: 25, height: 40, fontSize: 15 }} placeholder='IP Adresse' label={'IP Adresse'} />
                        }<TextInput value={printer.port} onChangeText={(txt) => setPrinter((t) => { return { ...t, port: txt } })} mode='outlined' style={{ fontSize: 25, height: 40, fontSize: 15 }} placeholder='PORT' label={'PORT'} />
                        <TextInput value={printer.printerNbrCharactersPerLine + ''} onChangeText={(txt) => setPrinter((t) => { return { ...t, printerNbrCharactersPerLine: parseInt(txt) } })} mode='outlined' style={{ fontSize: 25, height: 40, fontSize: 15 }} placeholder='printer Nbr Characters Per Line' label={'printer Nbr Characters Per Line'} />
                        <View style={{}} >
                            <View style={{ flexDirection: 'row' }} >
                                <Checkbox.Item onPress={() => setPrinter((t) => { return { ...t, autoCut: !t.autoCut } })}
                                    style={{ paddingHorizontal: 15, width: 200 }}
                                    label="auto Cut Ticket"
                                    status={printer.autoCut ? 'checked' : 'unchecked'}
                                />
                            </View>
                            <View style={{ flexDirection: 'row' }} >
                                <Checkbox.Item onPress={() => setPrinter((t) => { return { ...t, openCashbox: !t.openCashbox } })}
                                    style={{ paddingHorizontal: 15, width: 200 }}
                                    label="open Cash box"
                                    status={printer.openCashbox ? 'checked' : 'unchecked'}
                                />
                            </View>
                        </View>
                        {!printer.main &&
                            <MultiSelect
                                placeholder={'Production'}
                                style={{ borderWidth: StyleSheet.hairlineWidth, paddingHorizontal: 15, paddingVertical: 7 }}
                                labelField="label"
                                valueField="value"
                                data={ProductionTypes.map(p => ({ label: p?.name, value: p?._id + '' }))}
                                value={printer?.production}
                                onChange={item => {
                                    setPrinter(i => ({ ...i, production: item }));
                                }}
                                activeColor={'gray'}
                            />}
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', marginTop: 15, gap: 10 }}>
                            <TouchableHighlight underlayColor style={{ borderRadius: 5 }} onPress={() => { dispatch({ type: 'HIDE_MODAL_ADD_PRINTER' }) }}>
                                <View style={[{ width: 80, height: 50, justifyContent: "center", alignItems: "center", borderWidth: StyleSheet.hairlineWidth, borderColor: "black", }, { backgroundColor: 'grey', borderRadius: 3 }]}>
                                    <Text style={{ color: 'white' }}>Cancel</Text>
                                </View>
                            </TouchableHighlight>
                            <TouchableHighlight underlayColor style={{ borderRadius: 5 }} onPress={() => {
                                PrinterServices.create({
                                    printer,
                                    currentRestaurant,
                                    callback: (data) => {
                                        dispatch({ type: 'HIDE_MODAL_ADD_PRINTER' })
                                        dispatch(addPrinter(JSON.parse(JSON.stringify(data))))
                                    }
                                })
                            }}>
                                <View style={[{ width: 80, height: 50, justifyContent: "center", alignItems: "center", borderWidth: StyleSheet.hairlineWidth, borderColor: "black", }, { backgroundColor: 'red', borderRadius: 3 }]}>
                                    <Text style={{ color: 'white' }}>{printerId ? 'Edit' : 'Add'}</Text>
                                </View>
                            </TouchableHighlight>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </Modal>
    )
}

let idInter = null
let idstate = null
const DevicesSection = ({ devices }) => {

    const [devicesState, setDevicesState] = useState([])

    useEffect(() => {


        TinyEmitter.off('DVC')
        clearInterval(idInter)
        clearInterval(idstate)



        TinyEmitter.on('DVC', ({ data }) => {
            setDevicesState(a => [...a.filter(e => e.uniqueId != data?.uniqueId), { ...data }])

        })
        setTimeout(() => {
            TinyEmitter.emit('GET_DEVICES_STATE')
            TinyEmitter.emit('GETDEVICES')
        }, 2000);

        idInter = setInterval(() => {
            TinyEmitter.emit('GETDEVICES')
        }, 5 * 1000);

        idstate = setInterval(() => {
            TinyEmitter.emit('GET_DEVICES_STATE')
        }, 60 * 1000);

        return () => {
            TinyEmitter.off('DEVICES')
            TinyEmitter.off('DVC')
            clearInterval(idInter)
            clearInterval(idstate)
        }
    }, [])


    return (
        <View>
            {
                Object?.keys(devices)?.map((e) => {

                    return (
                        <TouchableHighlight underlayColor onPress={() => {
                            TinyEmitter.emit('GET_DEVICES_STATE')

                        }}>
                            <View style={{ borderColor: '#00000025', borderWidth: StyleSheet.hairlineWidth, marginHorizontal: 10, flexDirection: 'row', gap: 10, alignItems: 'center', flexWrap: "wrap" }}>

                                <View style={{ backgroundColor: (devices[e]?.iceConnectionState == 'connected' || devices[e]?.iceConnectionState == 'completed') ? 'green' : 'red', width: 15, height: 15, borderRadius: 15 }} />
                                <View>
                                    <Text style={{ width: 100, height: 35, textAlignVertical: 'center' }}>{e}</Text>
                                    <TouchableHighlight underlayColor onPress={() => {
                                        TinyEmitter.emit('DECONNECT_FROM_ALL', e)
                                    }}>
                                        <Text style={{ backgroundColor: 'red', color: 'white', padding: 5, paddingHorizontal: 15, borderRadius: 15 }}>DECONNECT</Text>
                                    </TouchableHighlight>

                                    {/* {!(devices[e]?.iceConnectionState == 'connected' || devices[e]?.iceConnectionState == 'completed') && (
                                        <TouchableHighlight underlayColor onPress={() => {
                                            SendMessage({ event: 'CONNECT_TO_ME', iceRestart: true });
                                        }}>
                                            <Text style={{ backgroundColor: 'green', color: 'white', padding: 10, paddingHorizontal: 15, }}>Retry</Text>
                                        </TouchableHighlight>
                                    )} */}
                                </View>
                                {(devices[e]?.iceConnectionState == 'connected' || devices[e]?.iceConnectionState == 'completed') && (
                                    <>
                                        <Text style={{ width: 60, fontSize: 10, color: 'black', fontWeight: "700" }}>{devicesState?.find(a => a?.ipAddress == e)?.user?.firstName}</Text>
                                        <View style={{ width: StyleSheet.hairlineWidth, height: '102%', backgroundColor: '#00000025' }} />
                                        <Text style={{ width: 60, fontSize: 10, color: 'black', fontWeight: "700" }}>{devicesState?.find(a => a?.ipAddress == e)?.user?.lastName}</Text>
                                        <View style={{ width: StyleSheet.hairlineWidth, height: '102%', backgroundColor: '#00000025' }} />
                                        <Text style={{ width: 60, fontSize: 10, color: 'black', }}>{devicesState?.find(a => a?.ipAddress == e)?.brand}</Text>
                                        <View style={{ width: StyleSheet.hairlineWidth, height: '102%', backgroundColor: '#00000025' }} />
                                        <Text style={{ width: 60, fontSize: 10, color: 'black', }}>{devicesState?.find(a => a?.ipAddress == e)?.model}</Text>
                                        <View style={{ width: StyleSheet.hairlineWidth, height: '102%', backgroundColor: '#00000025' }} />
                                        <Text style={{ width: 100, fontSize: 10, color: 'black', }}>{devicesState?.find(a => a?.ipAddress == e)?.uniqueId}</Text>
                                        <View style={{ width: StyleSheet.hairlineWidth, height: '102%', backgroundColor: '#00000025' }} />
                                        <Text style={{ width: 100, fontSize: 10, color: 'black', }}>{devicesState?.find(a => a?.ipAddress == e)?.buildId}</Text>
                                        <View style={{ width: StyleSheet.hairlineWidth, height: '102%', backgroundColor: '#00000025' }} />
                                        <Text style={{ width: 90, fontSize: 10, color: 'black', }}>{devicesState?.find(a => a?.ipAddress == e)?.user?.role}</Text>
                                        <View style={{ width: StyleSheet.hairlineWidth, height: '102%', backgroundColor: '#00000025' }} />
                                        <Text style={{ width: 35, fontSize: 10, color: 'black', }}>{parseInt(devicesState?.find(a => a?.ipAddress == e)?.BatteryLevel * 100)}%</Text>
                                        <View style={{ width: StyleSheet.hairlineWidth, height: '102%', backgroundColor: '#00000025' }} />
                                        <Text style={{ width: 25, fontSize: 10, color: 'black', }}>{devicesState?.find(a => a?.ipAddress == e)?.totalOrder}</Text>

                                    </>
                                )}


                            </View>
                        </TouchableHighlight>
                    )
                })
            }
        </View >
    )
}
export {
    SettingScreen
}

