import { useDispatch, useSelector } from 'react-redux';

import Slider from '@react-native-community/slider';
import React, { createRef, useEffect, useState } from 'react';
import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import Draggable from 'react-native-draggable';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
// import {  EightPerson, FourPerson, SixPerson,  ThreePerson, TwelvePerson, TwoPerson, ZoneSelector } from '../components';

import { Realm } from '@realm/react';
import moment from 'moment';
import { ActivityIndicator, MD2Colors } from 'react-native-paper';
import { COLORS } from '../assets/styles/styleGuide';
import { ModalAskTableCommand } from '../components/ModalAskTableCommand';
import {
    EightPerson,
    FourPerson,
    SixPerson,
    ThreePerson,
    TwelvePerson,
    TwoPerson,
} from '../components/tables';
import ElevenPerson from '../components/tables/elevenPerson';
import FivePerson from '../components/tables/fivePerson';
import NinePerson from '../components/tables/ninePerson';
import OnePerson from '../components/tables/onePerson';
import SevenPerson from '../components/tables/sevenPerson';
import TenPerson from '../components/tables/tenPerson';
import ZoneSelector from '../components/zoneSelector';
import {
    hideModalActionTableMap,
    showModalActionTableMap,
} from '../redux/actions/ModalReducer';
import { updateOrder } from '../redux/actions/orderActions';
import { Unit } from '../utils/realmDB/modals/Unit';
import { CommandController } from '../utils/realmDB/service/commandService';
import { realmConfig, useObject } from '../utils/realmDB/store';

const TableMapOld = () => {
    const dispatch = useDispatch();
    // const { table = [] } = useSelector((state) => state.table);
    const refresh = useSelector(state => state.Modal);
    const { currentRestaurant } = useSelector(state => state.user);
    const { enableSelectUnit } = useSelector(state => state.Modal);
    const [ors, setOrs] = useState([]);
    const zoomableViewRef = createRef();

    const [size, setSize] = useState(20);
    const [locked, setLocked] = useState(true);
    const [showTables, setShowTables] = useState(false);
    const [zoomSettings, setZoomSettings] = useState({});
    const [reload, setReload] = useState(false);
    const { zone } = useSelector(state => state.zone)
    const { table } = useSelector(state => state.table)
    const { orders } = useSelector(state => state.order)

    // const zone = useQuery('Zone')?.filtered(
    //     'pointOfSale._id == $0',
    //     new Realm.BSON.ObjectID(currentRestaurant),
    // );
    // const table = useQuery('Unit')
    //     ?.filtered(
    //         'pointOfSale._id == $0',
    //         new Realm.BSON.ObjectID(currentRestaurant),
    //     )
    //     ?.toJSON(); 
    const [selectedZone, setselectedZone] = useState(
        zone.length > 0 ? zone[0]?.nameSlug : 0,
    );

    useEffect(() => {
        //dispatch(getTable());

        AsyncStorage.getItem('POS_SIZE_TABLE_MAP').then(e => {
            if (e && typeof parseInt(e) === 'number') setSize(parseInt(e));
        });

        setTimeout(() => {
            setShowTables(true)
        }, 1);
    }, []);
    // const handlePress = (data) => {
  
    // };

    const getFilteredData = () => {
        if (selectedZone == 0) {
            return table;
        } else {
            const filtered = table.filter(tb => tb.localization == selectedZone);
            return filtered;
        }
    };

    useEffect(() => {
        CommandController.getUnPaidCommmand({
            orders,
            pointOfSaleId: currentRestaurant?._id,
            dt: moment().format('YYYY/MM/DD'),
        }
        )?.then(a => {
            setOrs(a);
        });
    }, [refresh, orders]);

    const TableC = ({ table, ords }) => {
        // const ords = await CommandController.getUnPaidCommmand(currentRestaurant, moment().format('YYYY/MM/DD'), unit?.unitNumber)
        const [color, setColor] = useState('#000');
        const refresh = useSelector(state => state.Modal);
        useEffect(() => {
            const e = ords.filter(e => e?.unit?.unitNumber == table?.unitNumber);

            if (e.length > 0) setColor('orange');
            else setColor('#000');
        }, [ords, refresh]);
        const onPressTable = () => {
            if (!enableSelectUnit) dispatch(showModalActionTableMap(table));
            else {
                Alert.alert('Transfer command', 'Do you Confirm the transfer?', [
                    {
                        text: 'Cancel',
                        onPress: () => dispatch(hideModalActionTableMap(null)),
                        style: 'cancel',
                    },
                    {
                        text: 'OK',
                        onPress: () => {
                            CommandController.changeUnitOfCommand(ords, enableSelectUnit, table, (data) => {
                                dispatch(updateOrder({ ...data, type: 'unit' }))
                            });

                            dispatch(hideModalActionTableMap(null));
                        },
                    },
                ]);
            }
        };
        const onPressChair = () => { };
        switch (table.seatsNumber) {
            case 1:
                return (
                    <OnePerson
                        size={size}
                        data={{ ...table, tableStatus: color }}
                        isRound={table?.shape === 'circle'}
                        onPressTable={onPressTable}
                        onPressChair={onPressChair}
                    />
                );
            case 2:
                return (
                    <TwoPerson
                        size={size}
                        data={{ ...table, tableStatus: color }}
                        isRound={table?.shape === 'circle'}
                        onPressTable={onPressTable}
                        onPressChair={onPressChair}
                    />
                );
            case 3:
                return (
                    <ThreePerson
                        size={size}
                        data={{ ...table, tableStatus: color }}
                        isRound={table?.shape === 'circle'}
                        onPressTable={onPressTable}
                        onPressChair={onPressChair}
                    />
                );
            case 4:
                return (
                    <FourPerson
                        size={size}
                        data={{ ...table, tableStatus: color }}
                        isRound={table?.shape === 'circle'}
                        onPressTable={onPressTable}
                        onPressChair={onPressChair}
                    />
                );
            case 5:
                return (
                    <FivePerson
                        size={size}
                        data={{ ...table, tableStatus: color }}
                        isRound={table?.shape === 'circle'}
                        onPressTable={onPressTable}
                        onPressChair={onPressChair}
                    />
                );
            case 6:
                return (
                    <SixPerson
                        size={size}
                        data={{ ...table, tableStatus: color }}
                        isRound={table?.shape === 'circle'}
                        onPressTable={onPressTable}
                        onPressChair={onPressChair}
                    />
                );
            case 7:
                return (
                    <SevenPerson
                        size={size}
                        data={{ ...table, tableStatus: color }}
                        isRound={table?.shape === 'circle'}
                        onPressTable={onPressTable}
                        onPressChair={onPressChair}
                    />
                );
            case 8:
                return (
                    <EightPerson
                        size={size}
                        data={{ ...table, tableStatus: color }}
                        isRound={table?.shape === 'circle'}
                        onPressTable={onPressTable}
                        onPressChair={onPressChair}
                    />
                );
            case 9:
                return (
                    <NinePerson
                        size={size}
                        data={{ ...table, tableStatus: color }}
                        isRound={table?.shape === 'circle'}
                        onPressTable={onPressTable}
                        onPressChair={onPressChair}
                    />
                );
            case 10:
                return (
                    <TenPerson
                        data={{ ...table, tableStatus: color }}
                        size={size}
                        isRound={table?.shape === 'circle'}
                        onPressTable={onPressTable}
                        onPressChair={onPressChair}
                    />
                );
            case 11:
                return (
                    <ElevenPerson
                        data={{ ...table, tableStatus: color }}
                        size={size}
                        isRound={table?.shape === 'circle'}
                        onPressTable={onPressTable}
                        onPressChair={onPressChair}
                    />
                );
            case 12:
                return (
                    <TwelvePerson
                        data={{ ...table, tableStatus: color }}
                        size={size}
                        isRound={table?.shape === 'circle'}
                        onPressTable={onPressTable}
                        onPressChair={onPressChair}
                    />
                );
            default:
                return (
                    <TwoPerson
                        size={size}
                        data={{ ...table, tableStatus: color }}
                        isRound={table?.shape === 'circle'}
                        onPressTable={onPressTable}
                        onPressChair={onPressChair}
                    />
                );
        }
    };

    const TableView = ({ table }) => {
        const myTable = useObject(Unit, table?._id);


        const changeTable = async (realm, bounds) => {

            realm.write(async () => {
                myTable.localX = bounds.left;
                myTable.localY = bounds.top;
            })
        }
        return (
            <Draggable
                key={`${table.localX}-${table.localY}`}
                disabled={locked}
                x={table.localX || 0}
                y={table.localY || 0}
                shouldReverse={false}
                onDragRelease={async (event, gestureState, bounds) => {

                    Realm.open(realmConfig).then(async realm => {
                        changeTable(realm, bounds).then(r => { })
                    });

                }}
            >
                <TableC table={{ ...table, chairs: [] }} ords={ors} />
            </Draggable>
        );
    };

    const Loader = () => {
        return (
            <View
                style={{
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    right: 0,
                    left: 0,
                    backgroundColor: 'rgba(52, 52, 52, 0.5)',
                    zIndex: 9999999,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <ActivityIndicator
                    animating={true}
                    color={MD2Colors.white}
                    size={'large'}
                />
            </View>
        );
    };

    return (
        <View style={styles.main}>
            {/* {reload && <Loader />} */}
            <View style={styles.mapContainer}>
                <View style={{ flexDirection: 'row' }}>
                    <ZoneSelector
                        selectedZone={selectedZone}
                        setselectedZone={setselectedZone}
                        zone={zone}
                    />
                    <Slider
                        disabled={locked}
                        style={{ flex: 1, height: 40 }}
                        minimumValue={0}
                        maximumValue={100}
                        minimumTrackTintColor="#380b44"
                        maximumTrackTintColor="#000000"
                        value={size}
                        onSlidingComplete={data => {
                            setSize(data);
                        }}
                        onValueChange={data => {
                            // setSize(data)
                        }}
                    />

                    <TouchableOpacity
                        onPress={() => {
                            if (!locked)
                                AsyncStorage.setItem('POS_SIZE_TABLE_MAP', '' + size);
                            setLocked(!locked);
                        }}
                        style={{
                            alignSelf: 'flex-end',
                            marginRight: 25,
                        }}
                    >
                        {locked ? (
                            <FontAwesome name="lock" size={40} color={'black'} />
                        ) : (
                            <FontAwesome name="unlock" size={40} color={'black'} />
                        )}
                    </TouchableOpacity>
                </View>

                <View style={[styles.canvas, {}]}>
                    {showTables && getFilteredData().map((table, index) => {
                        return <TableView table={table} />;
                    })}
                </View>
            </View>

            <ModalAskTableCommand />
        </View>
    );
};

const styles = StyleSheet.create({
    main: {
        flex: 1,
        paddingBottom: 25,
        backgroundColor: COLORS.BACKGROUND,
        flexDirection: 'row',
        borderColor: COLORS.DANGER,
    },
    mapContainer: {
        flex: 1,
    },
    canvas: {
        flex: 10,
        shadowColor: '#000',
        backgroundColor: COLORS.BACKGROUND,
    },
});
export default TableMapOld;