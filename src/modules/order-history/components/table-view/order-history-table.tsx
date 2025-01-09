/*!
 * Copyright (c) Microsoft Corporation.
 * All rights reserved. See LICENSE in the project root for license information.
 */

/* eslint-disable no-duplicate-imports */
import { IComponentProps, ICoreContext } from '@msdyn365-commerce/core';
import { ChannelIdentity, Customer, OrderOriginator, OrgUnitLocation } from '@msdyn365-commerce/retail-proxy';
import React from 'react';

import { IOrderHistory } from '../../actions/get-order-shipment-history';
import { IOrderHistoryTableHeaderResources, OrderHistoryTableHeaderComponent } from './components/order-history-table-header-component';
import { IOrderHistoryTableRowResources, OrderHistoryTableRowComponent } from './components/order-history-table-row-component';

/**
 * Interface with the data required for order history.
 */
export interface IOrderHistoryTableData {
    orderHistory: IOrderHistory;
    channelIdentities?: ChannelIdentity[];
    orgUnitLocations?: OrgUnitLocation[];
    customer?: Customer;
    originators?: OrderOriginator[];
}

/**
 * Resources needed to render order history table.
 */
export interface IOrderHistoryTableResources extends IOrderHistoryTableHeaderResources, IOrderHistoryTableRowResources {}

/**
 * Configuration of order history table.
 */
export interface IOrderHistoryTableProps extends IComponentProps<IOrderHistoryTableData> {
    context: ICoreContext;
    className: string;

    resources: IOrderHistoryTableResources;

    shouldShowChannelInfo: boolean;
    shouldShowOrderPlacedBy?: boolean;
}

/**
 * Renders order history table.
 * @param props - Configuration for order history table.
 * @returns React node with the table.
 */
export const OrderHistoryTableComponent: React.FC<IOrderHistoryTableProps> = (props: IOrderHistoryTableProps) => {
    const rowClassName = `${props.className}__row`;
    const headerClassName = `${props.className}__header`;

    return (
        <table className={props.className}>
            <OrderHistoryTableHeaderComponent
                context={props.context}
                typeName={props.typeName}
                id={headerClassName}
                className={headerClassName}
                resources={props.resources}
                data={{}}
                shouldShowChannelInfo={props.shouldShowChannelInfo}
                shouldShowOrderPlacedBy={props.shouldShowOrderPlacedBy}
            />
            {props.data.orderHistory.salesOrders.map((salesOrder, index) => {
                return (
                    <OrderHistoryTableRowComponent
                        context={props.context}
                        typeName={props.typeName}
                        id={`${rowClassName}-${index}`}
                        key={salesOrder.SalesId}
                        className={rowClassName}
                        resources={props.resources}
                        data={{
                            salesOrder,
                            channelIdentities: props.data.channelIdentities,
                            orgUnitLocations: props.data.orgUnitLocations,
                            customer: props.data.customer,
                            originator: props.data.originators?.find(
                                o =>
                                    (salesOrder.SalesId && o.SalesId === salesOrder.SalesId) ||
                                    (salesOrder.TransactionId && o.TransactionId === salesOrder.TransactionId)
                            )
                        }}
                        shouldShowChannelInfo={props.shouldShowChannelInfo}
                        shouldShowOrderPlacedBy={props.shouldShowOrderPlacedBy}
                    />
                );
            })}
        </table>
    );
};
