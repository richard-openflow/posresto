import React from 'react';
import { View } from 'react-native';
import { useSelector } from 'react-redux';
import { FlatListCommande } from '../components/Lists/FlatListCommande';

const Commande = () => {
  const { currentRestaurant: a } = useSelector(state => state.user)
  const { orders, uniqueId } = useSelector(state => state.order)
  const { isMaster } = useSelector(state => state.user)
  return (
    <View style={{ flex: 1, padding: 10 }}>
      <FlatListCommande
        isMaster={isMaster}
        uniqueId={uniqueId}
        data={orders
          ?.filter(e => {
            console.log(JSON.stringify({ eorders: e }))
            return e?.pointOfSale?._id == a?._id

          })
          ?.filter((c) => {
            const total = c?.commandProduct?.
              reduce((total, { product, addableIngredientsChoose, addableProductsChoose, clickCount, status, linkToFormula, addablePrice }) => {
                if (status == 'cancel') return total
                let subtotal = addableIngredientsChoose?.reduce((t, a) => {
                  let aaa = a?.options?.reduce((i, j) => i + j?.price * j?.quantity, 0)
                  return t + aaa
                }, 0) || 0
                let subtotalproduct = addableProductsChoose?.reduce((t, a) => {
                  let aaa = a?.options?.reduce((i, j) => i + j?.price * j?.quantity, 0)
                  return t + aaa
                }, 0) || 0

                return total + ((linkToFormula ? addablePrice : product?.price * clickCount) + subtotal + subtotalproduct);
              }, 0)

            const totalPayed = c?.paidHistory?.reduce((total, { amount }) => {
              return total + amount;
            }, 0)

            return !(total <= totalPayed && c?.commandProduct?.map((e) => e?.orderClassifying).every((f) => f <= c?.nextInKitchen)) || c?.commandProduct?.length == 0
          })

        } />
    </View>
  );
};

export default Commande;



