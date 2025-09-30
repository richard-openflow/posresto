import { createRealmContext } from '@realm/react';
import { Menu } from './modals/Menu';
import { MenuProduct } from './modals/MenuProduct';
import { CategoryItems } from './modals/CategoryItems';
import { CategoryMenu } from './modals/CategoryMenu';
import { FileUpload } from './modals/FileUpload';
import { Unit } from './modals/Unit';
import { Zone } from './modals/Zone';
import { CommandProduct } from './modals/CommandProduct';
import { Orders } from './modals/orders';
import { PayHistory } from './modals/payHistory';
import { PointOfSale } from './modals/PointOfSale';
import { ProductionTypes } from './modals/productionTypes';
import { User } from './modals/User';
import { Printer } from './modals/Printer';
import { BoxInformation } from './modals/BoxInformation';
import { Options } from './modals/Options';
import { Ingredient } from './modals/Ingredient';
import { AddableIngredientsChoose } from './modals/addableIngredientsChoose';
import { ConditionsChoose } from './modals/conditionsChoose';
import { RemovableIngredientsChoose } from './modals/removableIngredientsChoose';
import { AddableIngredientsChooseOption } from './modals/addableIngredientsChooseOption';
import { ProductOptions } from './modals/ProductOptions';

// Create a configuration object
const realmConfig = {
    schema: [
        CategoryMenu,
        FileUpload,
        Menu,
        MenuProduct,
        CategoryItems,
        Unit,
        Zone,
        CommandProduct,
        Orders,
        PayHistory,
        PointOfSale,
        ProductionTypes,
        User,
        Printer,
        BoxInformation,
        Options,
        Ingredient,
        AddableIngredientsChoose,
        ConditionsChoose,
        RemovableIngredientsChoose,
        AddableIngredientsChooseOption,
        ProductOptions
    ],
    schemaVersion: 76,

};

const { RealmProvider, getDatabase } = createRealmContext(realmConfig);


export {
    RealmProvider, getDatabase, realmConfig
}