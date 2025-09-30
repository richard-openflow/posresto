
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getMenu } from '../../redux/actions/menuAction';



const Item = ({ title, onPress, selected }) => (
  <TouchableOpacity onPress={onPress} style={[styles.item, { backgroundColor: selected ? 'gray' : 'white' }]}>
    <Text style={styles.title}>{title}</Text>
  </TouchableOpacity>
);

const FlaListcomponent = () => {
  const dispatch = useDispatch();
  const { menu } = useSelector(state => state.menu);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
   // dispatch(getMenu());
  }, []);


  const renderMenuContent = () => {
    if (selectedItem) {
      const category = menu.data.find(item => item.CategoryMenu._id === selectedItem);
      return (
        <View style={{ padding: 0 }}>
          {/* Ajouter ici le code pour afficher les articles de la catégorie sélectionnée */}
          <ScrollView>

            <View style={{ flexDirection: 'row', flexWrap: "wrap" }}>
              {category.items?.map(item => (
                <Card key={item.id} title={item.title} price={item.price} />
              ))}

            </View>
            {/* Ajouter d'autres cartes ici si nécessaire */}
          </ScrollView>
        </View>
      );
    }
  };

  const renderItem = ({ item }) => {
   
    return (
      <Item
        title={item.title}
        onPress={() => setSelectedItem(item._id)}
        selected={item._id === selectedItem}
      />
    )
  };

  return (
    <View style={styles.container}>
      <View style={{ flex: 0.2 }}>
        <FlatList
          data={menu[0]?.CategoryMenu?.map(item => {
          
            return ({
              id: item._id,
              title: item.name
            })
          })}

          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      </View>
      <View style={{ flex: 0.8 }}>{renderMenuContent()}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  item: {
    padding: 12,
    margin: 3,
    shadowColor: 'black',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.2,
    elevation: 0,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  
});

export default FlaListcomponent;


