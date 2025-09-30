import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { useForm, useWatch } from 'react-hook-form';
import TableMap from '../components/tableMap';
import { CommandController } from '../utils/realmDB/service/commandService';

const TabletMapOptimized = () => {
    const { control, setValue } = useForm({
        defaultValues: {
            date: new Date(),
            word: '',
            filterType: 'user',
            showQuickBookModal: false,
            size: 3,
            showQuickCheckInBookModal: false,
            selectedTable: [],
            selectedShfits: {},
            locked: true,
            affectTable: false,
            selectedBooking: {},
            selectedUnits: [],
            table: [],
            units: [],
            booking: {
                type: 'phone',
                lastName: '',
                firstName: '',
                nbrPeople: 2,
                email: '',
                phone: '',
                date: new Date(),
                time: new Date(),
                nbrPeople: 2,
                bookingId: null,
                dateBirth: new Date()
            }
        }
    })
    const [TimezoneDate, setTimezoneDate] = useState(new Date().getTime());

    const { zone } = useSelector(state => state.zone)
    const { table } = useSelector(state => state.table)

    const selectedBooking = useWatch({ control, name: 'selectedBooking' })
    const selectedUnits = useWatch({ control, name: 'selectedUnits' })
    const affectTable = useWatch({ control, name: 'affectTable' })
    const size = useWatch({ control, name: 'size' })
    const [ors, setOrs] = useState([]);
    const BookingReducer = []
    const { currentRestaurant, isLinked } = useSelector(state => state.user);
    const { orders } = useSelector(state => state.order);
    const refresh = useSelector(state => state.Modal);


    useEffect(() => {
        CommandController.getUnPaidCommmand({
            orders, pointOfSaleId: currentRestaurant?._id, dt: moment().format('YYYY/MM/DD')
        })?.then(a => setOrs(a));
    }, [refresh]);

    return (
        <View style={{ flexGrow: 1 }} >
            <TableMap
                isLinked={isLinked}
                ords={ors}
                currentDate={TimezoneDate}
                todayBookings={BookingReducer.filter(b => !['cancel', 'no-show'].includes(b.status))}
                selectedUnits={selectedUnits}
                setSelectedUnits={(su) => setValue('selectedUnits', su)}
                affectTable={affectTable}
                setAffectTable={(af) => setValue('affectTable', af)}
                pointOfSale={currentRestaurant}
                setFilterType={(t) => setValue('filterType', t)}
                setWord={(txt) => setValue('word', txt)}
                SearchClient={() => { }}
                setBooking={(b) => setValue('booking', b)}
                setShowQuickCheckInBookModal={(sq) => setValue('showQuickCheckInBookModal', sq)}
                navigation={console}
                Zone={zone}
                setShowQuickBookModal={(sq) => setValue('showQuickBookModal', sq)}
                table={table}
                size={size}
                setSelectedTable={(u) => setValue('selectedTable', u)}
                selectedBooking={selectedBooking}
            />
        </View>
    )
}

export { TabletMapOptimized };

const styles = StyleSheet.create({})