
import { Realm } from '@realm/react'
import { realmConfig } from '../store'

const PrinterServices = {}

PrinterServices.create = async ({ printer, currentRestaurant, callback = () => { } }) => {
    console.log({ printer })
    try {
        let a = {}
        const realm = await Realm.open(realmConfig)
        realm.write(() => {
            const pos = realm.objects('PointOfSale').filtered('_id == $0', new Realm.BSON.ObjectId(currentRestaurant))[0]
            const production = realm.objects('ProductionTypes').filtered('_id IN $0', printer.production.map((f) => new Realm.BSON.ObjectId(f)))
            let _id = new Realm.BSON.ObjectId()
            if (printer?._id)
                _id = new Realm.BSON.ObjectId(printer?._id)
            a = realm.create('Printer', {
                _id,
                name: printer.name,
                type: printer.type,
                ipAdress: printer.ipAdress,
                openCashbox: printer.openCashbox,
                autoCut: printer.autoCut,
                printerNbrCharactersPerLine: parseInt(printer.printerNbrCharactersPerLine),
                port: parseInt(printer.port),
                pointOfSale: pos,
                productionTypes: production,
                main: printer?.main
            }, 'modified')

        })
        callback(a)
    } catch (error) {
        console.log({ aaaa: error })
    }

}


PrinterServices.toggle = async ({ _id, callback = () => { } }) => {

    const realm = await Realm.open(realmConfig)
    let Printer = {}
    realm.write(() => {
        Printer = realm.objects('Printer').filtered('_id == $0', new Realm.BSON.ObjectId(_id))[0]

        Printer.enbaled = !Printer.enbaled


    })
    callback(Printer)

}

PrinterServices.delete = async ({ _id, callback = () => { } }) => {

    const realm = await Realm.open(realmConfig)
    let Printer = {}
    realm.write(() => {
        Printer = realm.objects('Printer').filtered('_id == $0', new Realm.BSON.ObjectId(_id))
        realm.delete(Printer)



    })
    callback(Printer)

}

PrinterServices.getPrinterByPointOfSale = async ({ _id, callback = () => { } }) => {
    console.log({ aaaa: _id })
    const realm = await Realm.open(realmConfig)
    let Printer = {}
    realm.write(() => {
        Printer = realm.objects('Printer').filtered('pointOfSale._id == $0', new Realm.BSON.ObjectId(_id))
    })
    callback(JSON.parse(JSON.stringify(Printer)))

}

export {
    PrinterServices
}