

import { FlashList } from '@shopify/flash-list';
import React from 'react';
import { useWatch } from 'react-hook-form';
import { FlatList, Text, StyleSheet, TouchableOpacity, View, ScrollView, ActivityIndicator, Dimensions } from 'react-native';
const { height } = Dimensions.get("window")

const RenderItem = ({ item, setValue, selectedCategoryId, onPress }) => (
    <>
        <TouchableOpacity onPress={() => {
            setValue('selectedCategoryId', item?._id)
            setValue('productList', item?.products)
            onPress()
        }} style={[styles.item, { backgroundColor: item._id + '' == selectedCategoryId + '' ? "black" : "white" }]} >
            <Text style={{ color: item._id + '' !== selectedCategoryId + '' ? "black" : "white" }}>{item?.name}</Text>
        </TouchableOpacity>
        <View style={{ height: 4, marginBottom: 4, backgroundColor: item?.color || 'red' /*"#00000055"*/ }} />
    </>

);

const keyExtractor = item => item?.id;

const CategorieList = ({ control, setValue, onPress }) => {
    const categorieList = useWatch({ control, name: 'categorieList' })
    const selectedCategoryId = useWatch({ control, name: 'selectedCategoryId' })
    return (
        <View style={{ width: 175, padding: 4, }}>
            <FlashList
                estimatedItemSize={20}
                extraData={selectedCategoryId}
                contentContainerStyle={{ position: 'relative', zIndex: -5000, }}
                style={{ maxHeight: height * 0.9, zIndex: -5000, position: 'relative', }}
                data={categorieList}
                renderItem={({ item }) => {
                    return (
                        <RenderItem onPress={onPress} item={item} setValue={setValue} selectedCategoryId={selectedCategoryId} />
                    )
                }}
                ListFooterComponent={() => {
                    return (
                        <View style={{ height: 500 }} />
                    )
                }}
            />

        </View>

    );
};

export { CategorieList };

const styles = StyleSheet.create({

    item: {
        padding: 10,
        paddingVertical: 12,
        height: 80,
        borderWidth: 0.5,
        justifyContent: "center",
        alignItems: "center"

    },

});

