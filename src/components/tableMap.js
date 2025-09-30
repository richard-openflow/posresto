import { useDispatch, useSelector } from 'react-redux';
//import { getTable } from '../redux/actions/tableAction';

import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Alert, Dimensions, ScrollView, StyleSheet, View } from 'react-native';
import Draggable from 'react-native-draggable';
import { COLORS } from '../assets/styles/styleGuide';
import { convertToTimeZoneManual } from '../utils/lib/convertToTimezoneGlobal';
import { useSQLQuery } from '../../utils/sqliteDB';
import { PureTwoPerson } from '../utils/tables';
import ZoneSelector from './zoneSelector';
import { hideModalActionTableMap, showModalActionTableMap } from '../redux/actions/ModalReducer';
import { ModalAskTableCommand } from './ModalAskTableCommand';
import { CommandController } from '../utils/realmDB/service/commandService';
import { getBookingInformationToOrder, updateOrder } from '../redux/actions/orderActions';
import { LoadingFetchBookingModal } from './LoadingFetchBooking';

const TableMap = ({
  affectTable,
  setAffectTable,
  selectedUnits,
  setSelectedUnits,
  currentDate,
  todayBookings,
  pointOfSale,
  navigation,
  Zone,
  isLinked,
  setShowQuickBookModal,
  selectedBooking,
  size = 1,
  setSelectedTable,
  ords
}) => {
  const dispatch = useDispatch();

  const [selectedZone, setselectedZone] = useState(null);
  const [showingNext, SethowingNext] = useState(true);

  const unitsAll = useSQLQuery('Unit');


  const units = pointOfSale?._id
    ? unitsAll
      ?.filtered(
        'pointOfSale._id == $0',
        new Realm.BSON.ObjectId(pointOfSale?._id),
      )
      ?.toJSON()
    : unitsAll;


  useEffect(() => {
    if (!selectedZone) setselectedZone(Zone[0]?.nameSlug);
  }, [Zone]);


  const TableC = ({
    table,
    selectedUnits,
    showingNext,

  }) => {

    const [color, setColor] = useState('black');
    const refresh = useSelector(state => state.Modal);
    const { enableSelectUnit } = refresh

    useEffect(() => {

      const e = ords?.filter(e => e?.unit?._id == table?._id);

      if (e?.length > 0) setColor('orange');
      else setColor('#000');
    }, [ords, refresh]);

    const onPressTable = () => {




      if (!enableSelectUnit) {
        dispatch(getBookingInformationToOrder(table))

      }
      else {
        Alert.alert(
          'Transfer command',
          'Do you Confirm the transfer?',
          [
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
    const onPressChair = () => {
      onPressTable();
    };

    return (
      <PureTwoPerson

        pointOfSale={pointOfSale}
        showingNext={showingNext}
        size={size}
        data={{
          ...table,
          tableStatus: color,
        }}
        tableSelected={selectedUnits.some(e => e == table?._id + '')}
        isRound={table?.shape === 'circle'}
        onPressTable={onPressTable}

        onPressChair={onPressChair}
      />
    );
  };

  const TableView = ({
    table,
    selectedUnits,
    setSelectedUnits,
    affectTable,
    selectedBooking,
    setAffectTable,
    getColorUnit = () => { },
    showingNext,

  }) => {
    const BookingReducer = []// useSelector(state => state.BookingReducer)?.booking;
    const [color, setColor] = useState(/*getColorUnit(table?._id)*/'red');

    const changeTable = async bounds => {
      // updatePositionTable(table._id, bounds.left, bounds.top);
      let data = { ...JSON.parse(JSON.stringify(table)) };
      data.localX = bounds.left;
      data.localY = bounds.top;

      dispatch({
        type: 'UPDATEUNITS',
        payload: { ...data },
      });
    };

    useEffect(() => {
      setColor(getColorUnit(table?._id));
    }, [BookingReducer.length, currentDate]);

    return (
      <Draggable
        key={`${table.x}-${table.y}`}
        disabled={true}
        x={table.x / 1.8 || 0}
        y={table.y / 1.8 || 0}
        shouldReverse={false}
        onDragRelease={async (event, gestureState, bounds) => {

        }}
      >
        <TableC

          showingNext={showingNext}
          reletedBooking={BookingReducer
            ?.filter((f) => f.status == 'coming')
            ?.filter((f) => {
              return f.STime >= ((new Date()).getTime() - (new Date()).getTimezoneOffset() * 10000)
            })
            ?.filter((e) => {
              return e?.units?.some(f => f?._id == table?._id)
            })}
          table={{ ...JSON.parse(JSON.stringify(table)), chairs: [] }}
          ords={ords}
          selectedUnits={selectedUnits}
          selectedBooking={selectedBooking}
          setSelectedUnits={setSelectedUnits}
          affectTable={affectTable}
          setAffectTable={setAffectTable}
          color={color}
          setShowQuickBookModal={setShowQuickBookModal}
          setSelectedTable={setSelectedTable}
        />
      </Draggable>
    );
  };

  const getColorUnit = unitId => {
    const time = convertToTimeZoneManual(currentDate, pointOfSale?.timezone);
    const B = todayBookings?.filter(b => {
      return time >= b.STime && b.duration > time;
    });
    const b = B?.find(b => {
      return b.units.some(u => {
        return '' + u._id === '' + unitId;
      });
    });

    if (b?.status === 'coming') {
      return '#d50000';
    } else if (b?.status === 'check-in') {
      return '#ff6d00';
    } else if (b?.status === 'waiting') {
      return '#d50000';
    } else if (b?.status === 'check-out') {
      const bookingUpdate = convertToTimeZoneManual(new Date(b?.updatedAt).getTime(), 'ETC/GMT');
      const nowTime = convertToTimeZoneManual(new Date().getTime(), 'ETC/GMT');
      const duration = nowTime - bookingUpdate;
      const diffDuration = moment.duration(duration).asMinutes();
      if (diffDuration <= 5) return '#ffd600';
      else return '#000000';
    } else {
      const b = todayBookings
        ?.filter(b => {
          return b?.units?.some(u => {
            return '' + u._id === '' + unitId;
          });
        })
        ?.sort((a, b) => a.STime - b.STime)
        ?.filter(e => ['check-in'].some(ss => ss == e.status));

      if (b?.length > 0) {
        if (
          convertToTimeZoneManual(b[0]?.duration, pointOfSale?.timezone) <
          convertToTimeZoneManual(new Date().getTime(), pointOfSale?.timezone)
        ) {
          return 'black'//'#616161';
        } else return '#ff6d00';
      } else return 'black'// '#ccc';
    }
  };

  return (
    <View style={[styles.main, {
      alignItems: 'flex-end',

    }]}>
      <View style={styles.mapContainer}>
        <View
          style={{
            flexDirection: 'row',


          }}
        >
          {/* vertical swiper */}

          <View style={{ flexGrow: 1, flexDirection: 'row', }}>
            <ZoneSelector
              showingNext={showingNext}
              SethowingNext={SethowingNext}
              selectedZone={selectedZone}
              setselectedZone={setselectedZone}
              zone={Zone}
              navigation={navigation}
            />
          </View>

        </View>
        <ScrollView
          contentContainerStyle={styles.container}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
        >
          <ScrollView
            contentContainerStyle={styles.innerContainer}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.largeContainer}>
              {units?.filter(
                u => '' + u.localization === '' + selectedZone,
              ).map((table, index) => {

                return (
                  <TableView
                    ords={ords}
                    showingNext={showingNext}
                    setShowQuickBookModal={setShowQuickBookModal}
                    affectTable={affectTable}
                    setAffectTable={setAffectTable}
                    selectedUnits={selectedUnits}
                    setSelectedUnits={setSelectedUnits}
                    selectedBooking={selectedBooking}
                    table={table}
                    getColorUnit={getColorUnit}
                    selected={true}
                  />
                );
              })}
            </View>
          </ScrollView>
        </ScrollView>
      </View>

      <ModalAskTableCommand isLinked={isLinked} />
      <LoadingFetchBookingModal />


    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
    flexDirection: 'row',
    borderColor: COLORS.DANGER,
  },
  mapContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  canvas: {
    flex: 10,
    shadowColor: '#000',
    zIndex: -9000,
    flexDirection: 'column',
    flexWrap: 'nowrap',
  },
  innerContainer: {
    flexDirection: 'column',
    flexWrap: 'nowrap',
  },
  container: {
    flexDirection: 'column',
    flexWrap: 'nowrap',
  },
  box: {
    width: 20550,
    height: 200,
    margin: 10,
    backgroundColor: 'lightblue',
    justifyContent: 'center',
    alignItems: 'center',
  },
  largeContainer: {
    width: 3000,
    height: 3000,
    backgroundColor: '',//'#161719',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
export default TableMap;