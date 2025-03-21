/*!
 * Copyright (c) Microsoft Corporation.
 * All rights reserved. See LICENSE in the project root for license information.
 */

/* eslint-disable no-duplicate-imports */
import { getUrlSync, IActionContext } from '@msdyn365-commerce/core';
import {
    ChannelDeliveryOptionConfiguration,
    ChannelIdentity,
    Customer,
    format,
    OrderOriginator,
    OrderShipments,
    OrgUnitLocation,
    SimpleProduct
} from '@msdyn365-commerce/retail-proxy';
import { ObjectExtensions } from '@msdyn365-commerce-modules/retail-actions';
import {
    Button,
    getPayloadObject,
    getTelemetryAttributes,
    INodeProps,
    ITelemetryContent,
    TelemetryConstant
} from '@msdyn365-commerce-modules/utilities';
import { Observer } from 'mobx-react';
import * as React from 'react';

import { ExpandButtonState, SalesLineState } from '@msdyn365-commerce-modules/order-management';
import { getGroups, IGroups } from '@msdyn365-commerce-modules/order-management';
import { getOrderInformation, getOrderInformationInput, IOrderInformation } from '@msdyn365-commerce-modules/order-management';
import { ISalesLine } from '@msdyn365-commerce-modules/order-management';
import { getSalesLines, getSalesLinesInput, IGetSalesLinesInput } from '@msdyn365-commerce-modules/order-management';
import { IOrderHistoryData } from '../order-history.data';
import { IOrderHistoryProps } from '../order-history.props.autogenerated';

export interface ISalesOrderProps extends IOrderHistoryProps<IOrderHistoryData> {
    salesOrder: OrderShipments;
    products: SimpleProduct[];
    channelIdentities?: ChannelIdentity[];
    orgUnitLocations?: OrgUnitLocation[];
    customer?: Customer;
    originator?: OrderOriginator;
    showChannelInfo?: boolean;
    telemetryContent?: ITelemetryContent;
    retailMultiplePickUpOptionEnabled?: boolean;
    channelDeliveryOptionConfig?: ChannelDeliveryOptionConfiguration;
    salesLinesLimit?: number;
}

export interface ISalesOrder {
    salesOrderProps: INodeProps;
    orderInfomation: IOrderInformation;
    groups?: IGroups;
    orderDetailsLink: React.ReactNode;
    expandProductsButton?: React.ReactNode;
}

/**
 * Retrieves the url for order details page.
 * @param actionContext - Core action context.
 * @param salesOrder - Order information.
 * @returns Url to order details.
 */
export const getOrderDetailsPageUrl = (actionContext: IActionContext, salesOrder: OrderShipments): string => {
    const orderDetailsUrl = getUrlSync('orderDetails', actionContext) || '';
    const separator = orderDetailsUrl.includes('?') ? '&' : '?';
    if (salesOrder.SalesId) {
        // Redirect with sales order sales id
        return `${orderDetailsUrl}${separator}salesId=${salesOrder.SalesId}`;
    }

    // Redirect with sales order transaction id
    return `${orderDetailsUrl}${separator}transactionId=${salesOrder.TransactionId!}`;
};

/**
 * Updates product states to show all products.
 * @param expandButtonState - Expand button state.
 * @param productStates - Product states.
 * @returns Callback method.
 */
const onExpandProductsCallback = (expandButtonState: ExpandButtonState, productStates: SalesLineState[]) => () => {
    for (const productState of productStates) {
        productState.isHidden = false;
    }
    expandButtonState.extraProductsCount = 0;
};

export const getSalesOrder = (input: ISalesOrderProps): ISalesOrder => {
    const {
        id,
        typeName,
        context,
        telemetry,
        products,
        salesOrder,
        showChannelInfo,
        channelIdentities,
        orgUnitLocations,
        customer,
        originator,
        telemetryContent,
        resources: { freePriceText, detailsAriaLabel, detailsLabel, orderItemLabel, orderItemsLabel },
        context: { actionContext },
        retailMultiplePickUpOptionEnabled,
        channelDeliveryOptionConfig
    } = input;

    const moduleName = 'ms-order-history';

    const priceContext = {
        id,
        typeName,
        context,
        telemetry,
        freePriceText
    };

    const salesOrderProps = { className: 'ms-order-history__sales-order', key: salesOrder.SalesId || salesOrder.TransactionId };

    const orderInfomationInput = getOrderInformationInput(
        input,
        moduleName,
        salesOrder,
        priceContext,
        channelIdentities,
        orgUnitLocations,
        customer,
        originator,
        showChannelInfo
    );

    const orderInfomation = getOrderInformation(orderInfomationInput);

    const salesLinesInput =
        products &&
        getSalesLinesInput(
            input,
            moduleName,
            salesOrder,
            products,
            priceContext,
            undefined,
            undefined,
            undefined,
            retailMultiplePickUpOptionEnabled,
            channelDeliveryOptionConfig
        );

    let salesLines: ISalesLine[] | undefined;
    let expandProductsButton: React.ReactNode;
    if (salesLinesInput) {
        const getSalesLinesInputProps: IGetSalesLinesInput = { ...salesLinesInput, imageOnly: true };
        if (!ObjectExtensions.isNullOrUndefined(input.salesLinesLimit)) {
            const extraProductsCount = getSalesLinesInputProps.salesLines.length - input.salesLinesLimit;
            getSalesLinesInputProps.salesLineStates = getSalesLinesInputProps.salesLines.map(
                (salesLine, index) => new SalesLineState(`${salesLine.LineId ?? ''}-${index}`, index >= input.salesLinesLimit!)
            );
            if (extraProductsCount > 0) {
                const expandButtonState = new ExpandButtonState(extraProductsCount);
                expandProductsButton = (
                    <>
                        <Observer>
                            {() => {
                                const text = format(
                                    input.resources.orderHistoryExpandProductsButtonText,
                                    expandButtonState.extraProductsCount
                                );
                                return (
                                    expandButtonState.extraProductsCount > 0 && (
                                        <Button
                                            className={`${moduleName}__sales-order__expand-products-button`}
                                            title={text}
                                            role='button'
                                            onClick={onExpandProductsCallback(expandButtonState, getSalesLinesInputProps.salesLineStates!)}
                                            aria-label={text}
                                        >
                                            {text}
                                        </Button>
                                    )
                                );
                            }}
                        </Observer>
                    </>
                );
            }
        }
        salesLines = getSalesLines(getSalesLinesInputProps);
    }

    expandProductsButton = (
        <>
            {expandProductsButton}
            <div className={`${moduleName}__sales-order__expand-products-button-wrapper`} />
        </>
    );

    const payLoad = getPayloadObject('click', telemetryContent!, TelemetryConstant.OrderDetails);
    const orderDetailsAttributes = getTelemetryAttributes(telemetryContent!, payLoad);

    const groups =
        salesLines &&
        getGroups({
            moduleName,
            salesLines,
            resources: { orderItemLabel, orderItemsLabel },
            retailMultiplePickUpOptionEnabled
        });

    const orderDetailsLink = (
        <Button
            href={getOrderDetailsPageUrl(actionContext, salesOrder)}
            role='button'
            aria-label={
                salesOrder.ChannelReferenceId && detailsAriaLabel
                    ? detailsAriaLabel.replace('{orderId}', salesOrder.ChannelReferenceId)
                    : ''
            }
            className='ms-order-history__btn-order-details'
            {...orderDetailsAttributes}
        >
            {detailsLabel}
        </Button>
    );

    return {
        salesOrderProps,
        orderInfomation,
        groups,
        orderDetailsLink,
        expandProductsButton
    };
};
