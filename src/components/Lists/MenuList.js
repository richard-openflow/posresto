import React, { useEffect } from 'react';
import { FlatList, Text, StyleSheet, TouchableOpacity, View } from 'react-native';
import { FlashList } from "@shopify/flash-list";
import { useWatch } from 'react-hook-form';

const MenuItem = ({ data, item, setValue, selectedMenuId, onPress }) => {
    return (
        <TouchableOpacity key={item?._id} onPress={() => {
            const d = data.find((m) => m._id + '' === '' + item?._id)
            setValue('selectedMenuId', item._id)
            setValue('categorieList', d?.CategoryMenu || [])
            setValue('selectedCategoryId', d?.CategoryMenu[0]?._id)
            setValue('productList', d?.CategoryMenu[0]?.products)
            onPress()
        }} style={[styles.item, { backgroundColor: /*item._id + '' == selectedMenuId + '' ? "black" :*//* "#e3f9f9",*/'white' }]}>
            <Text style={{ color: item._id + '' !== selectedMenuId + '' ? "black" : "red", }}>{item?.menuName}</Text>
        </TouchableOpacity>
    );
};

const keyExtractor = (item) => item._id;

const MenuList = ({ data = [], setValue, control, activeUser, onPress }) => {
    const selectedMenuId = useWatch({ control, name: 'selectedMenuId' })

    return (
        <View style={{ flexDirection: 'row' }}>
            <FlatList
                style={{ flexGrow: 1, padding: 4, backgroundColor: 'transparent' }}
                ListEmptyComponent={() => {
                    return (
                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>

                            <Text>Loading ... </Text>
                        </View>
                    )
                }}
                showsHorizontalScrollIndicator={false}
                horizontal
                ItemSeparatorComponent={() => <View style={{ width: 3 }} />}
                data={data?.filter((e) => activeUser?.role == 'ROLE_DIRECTOR' || activeUser?.accessibleMenu?.some((a) => a == e?._id))}
                extraData={selectedMenuId}
                renderItem={({ item }) => <MenuItem onPress={onPress} data={data} item={item} setValue={setValue} selectedMenuId={selectedMenuId} />}
                keyExtractor={keyExtractor}
                estimatedItemSize={20}

            />
            <View style={{ flexGrow: 1 }} />
        </View>
    );
};
export { MenuList };
const styles = StyleSheet.create({
    item: {
        padding: 12,
        minWidth: 150,
        marginHorizontal: 1,
        borderRightColor: "#00000055",
        borderRightWidth: StyleSheet.hairlineWidth
    },
});


