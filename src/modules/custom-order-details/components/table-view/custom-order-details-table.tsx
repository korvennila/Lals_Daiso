/*!
 * Copyright (c) Microsoft Corporation.
 * All rights reserved. See LICENSE in the project root for license information.
 */

/* eslint-disable no-duplicate-imports */
import { OrderDetailsProduct } from '@msdyn365-commerce/components';
import { IComponentProps, ICoreContext, IImageSettings } from '@msdyn365-commerce/core';
import { ChannelDeliveryOptionConfiguration, ProductDeliveryOptions, SalesOrder } from '@msdyn365-commerce/retail-proxy';
import { ArrayExtensions } from '@msdyn365-commerce-modules/retail-actions';
import React from 'react';

import {
    IOrderDetailsTableHeaderResources,
    OrderDetailsTableHeaderComponent
} from './components/custom-order-details-table-header-component';
import { IOrderDetailsTableRowResources, OrderDetailsTableRowComponent } from './components/custom-order-details-table-row-component';

/**
 * Interface with the data required for order details.
 */
export interface IOrderDetailsTableData {
    order: SalesOrder;
    products: OrderDetailsProduct[];
    deliveryOptions: ProductDeliveryOptions[];
    channelDeliveryOptionConfig?: ChannelDeliveryOptionConfiguration;
}

/**
 * Resources needed to render order details table.
 */
export interface IOrderDetailsTableResources extends IOrderDetailsTableHeaderResources, IOrderDetailsTableRowResources {}

/**
 * Configuration of order details table.
 */
export interface IOrderDetailsTableProps extends IComponentProps<IOrderDetailsTableData> {
    context: ICoreContext;
    className: string;

    imageSettings?: IImageSettings;
    isCashAndCarryTransaction: boolean;
    isReorderingEnabled?: boolean;
    isRetailMultiplePickUpOptionEnabled?: boolean;
    isSelectionModeEnabled: boolean;

    resources: IOrderDetailsTableResources;
    isChannelMultipleCatalogsFeatureEnabled?: boolean;
}

/**
 * On select all function.
 * @param props - Invoice table props.
 * @returns On change.
 */
const onSelectAllHandler = (props: IOrderDetailsTableProps) => (isSelected: boolean) => {
    for (const product of props.data.products) {
        product.isSelected = isSelected;
    }
};

/**
 * Renders order details table.
 * @param props - Configuration for order details table.
 * @returns React node with the table.
 */
export const OrderDetailsTableComponent: React.FC<IOrderDetailsTableProps> = (props: IOrderDetailsTableProps) => {
    const rowClassName = `${props.className}__row`;
    const headerClassName = `${props.className}__header`;
    const products = props.data.products;
    const availableProducts = products.filter(product => product.isProductAvailable);

    return (
        <table className={props.className}>
            <OrderDetailsTableHeaderComponent
                context={props.context}
                typeName={props.typeName}
                id={headerClassName}
                className={headerClassName}
                resources={props.resources}
                data={{}}
                isCashAndCarryTransaction={props.isCashAndCarryTransaction}
                isSelectionModeEnabled={props.isSelectionModeEnabled}
                isSelectedAll={ArrayExtensions.all(availableProducts, (product: OrderDetailsProduct) => product.isSelected)}
                onSelectAll={onSelectAllHandler(props)}
                isChannelMultipleCatalogsFeatureEnabled={props.isChannelMultipleCatalogsFeatureEnabled}
            />
            {products.map((product, index) => {
                return (
                    <OrderDetailsTableRowComponent
                        context={props.context}
                        typeName={props.typeName}
                        id={`${rowClassName}-${index}`}
                        key={product.salesLine.ItemId}
                        className={rowClassName}
                        resources={props.resources}
                        imageSettings={props.imageSettings}
                        isCashAndCarryTransaction={props.isCashAndCarryTransaction}
                        isReorderingEnabled={props.isReorderingEnabled}
                        isRetailMultiplePickUpOptionEnabled={props.isRetailMultiplePickUpOptionEnabled}
                        isSelectionModeEnabled={props.isSelectionModeEnabled}
                        data={{
                            salesOrder: props.data.order,
                            product,
                            deliveryOptions: props.data.deliveryOptions,
                            channelDeliveryOptionConfig: props.data.channelDeliveryOptionConfig
                        }}
                        isChannelMultipleCatalogsFeatureEnabled={props.isChannelMultipleCatalogsFeatureEnabled}
                    />
                );
            })}
        </table>
    );
};
