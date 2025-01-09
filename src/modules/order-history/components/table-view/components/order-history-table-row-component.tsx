/*!
 * Copyright (c) Microsoft Corporation.
 * All rights reserved. See LICENSE in the project root for license information.
 */

/* eslint-disable no-duplicate-imports */
import MsDyn365, { IComponentProps, ICoreContext, IDateFormatOptions, isOboRequest } from '@msdyn365-commerce/core';
import { ChannelIdentity, Customer, format, OrderOriginator, OrderShipments, OrgUnitLocation } from '@msdyn365-commerce/retail-proxy';
import { ArrayExtensions, StringExtensions } from '@msdyn365-commerce-modules/retail-actions';
import { Button, isMobile, VariantType } from '@msdyn365-commerce-modules/utilities';
import React from 'react';

import {
    getOrderChannelAddress,
    getOrderChannelName,
    getOrderChannelTypeValue,
    isOnlineStoreChannel
} from '@msdyn365-commerce-modules/order-management';
import { countItems } from '@msdyn365-commerce-modules/order-management';
import { getOrderDetailsPageUrl } from '../../get-sales-order';

/**
 * Data required to render each order history row.
 */
export interface IOrderHistoryTableRowData {
    salesOrder: OrderShipments;
    channelIdentities?: ChannelIdentity[];
    orgUnitLocations?: OrgUnitLocation[];
    customer?: Customer;
    originator?: OrderOriginator;
}

/**
 * Resources for order history table rows.
 */
export interface IOrderHistoryTableRowResources {
    orderHistoryViewDetailsButtonText: string;
    orderHistoryViewDetailsButtonAriaLabel: string;
    orderHistoryCreatedDateMobileDescriptionText: string;
    orderHistoryOrderNumberIsNotAvailable: string;
    onlineStoreChannelNameText: string;
    posChannelNameText: string;
    orderPlacedByFullText?: string;
    orderPlacedByYouText?: string;
    orderOnBehalfOfText?: string;
}

/**
 * Configuration for the order history rows.
 */
export interface IOrderHistoryTableRowProps extends IComponentProps<IOrderHistoryTableRowData> {
    context: ICoreContext;
    className: string;

    resources: IOrderHistoryTableRowResources;

    shouldShowChannelInfo: boolean;
    shouldShowOrderPlacedBy?: boolean;
}

/**
 * Formats amount.
 * @param context - Core context.
 * @param amount - Amount to display.
 * @param currencyCode - Currency for the amount.
 * @returns String value.
 */
const formatAmount = (context: ICoreContext, amount: number | undefined, currencyCode: string | undefined) => {
    if (amount === undefined) {
        return '';
    }
    return context.cultureFormatter.formatCurrency(amount, currencyCode);
};

/**
 * Formats date.
 * @param context - Core context.
 * @param date - Date to display.
 * @returns String value.
 */
const formatDate = (context: ICoreContext, date: Date | undefined) => {
    if (date === undefined) {
        return '';
    }

    const dateOptions: IDateFormatOptions = { year: 'numeric', month: 'numeric', day: 'numeric' };
    return context.cultureFormatter.formatDate(date, dateOptions);
};

const getShortEllipsisText = (originalText: string, maxTextLength: number) => {
    const isRtl = document.body.parentElement?.getAttribute('dir') === 'rtl';
    return originalText.length > maxTextLength
        ? isRtl
            ? `…${originalText.substring(0, maxTextLength - 1)}`
            : `${originalText.substring(0, maxTextLength - 1)}…`
        : originalText;
};

/**
 * Renders rows for desktop view.
 * @param props - Configuration for the rows.
 * @returns A react node with a list of order history rows for desktop view.
 */
export const OrderHistoryDesktopTableRowCellComponent: React.FC<IOrderHistoryTableRowProps> = (props: IOrderHistoryTableRowProps) => {
    const {
        data: { salesOrder, channelIdentities, orgUnitLocations, customer, originator },
        resources: { orderPlacedByFullText, orderPlacedByYouText, orderOnBehalfOfText }
    } = props;

    const linkToOrderHistoryDetails = getOrderDetailsPageUrl(props.context.actionContext, props.data.salesOrder);

    const defaultCount = 0;
    const itemsCount = ArrayExtensions.hasElements(salesOrder.SalesLines) ? countItems(salesOrder.SalesLines) : defaultCount;
    const channelName = getOrderChannelName(salesOrder, channelIdentities);
    const channelAddress = getOrderChannelAddress(salesOrder, orgUnitLocations);
    const channelTypeValue = getOrderChannelTypeValue(salesOrder, channelIdentities);
    const isOnlineStore = isOnlineStoreChannel(channelTypeValue, channelAddress);

    const columnWithNumberClassName = `${props.className}__column-with-number`;

    let orderNumberCellText = props.resources.orderHistoryOrderNumberIsNotAvailable;
    if (!StringExtensions.isNullOrWhitespace(salesOrder.SalesId)) {
        orderNumberCellText = salesOrder.SalesId!;
    }

    const isYou =
        !isOboRequest(props.context.request) &&
        originator?.CustomerId &&
        originator?.CustomerName &&
        !originator?.StaffId &&
        !originator?.StaffName &&
        customer?.AccountNumber === originator?.CustomerId
            ? true
            : false;
    const isYouObo = !isYou && !isOboRequest(props.context.request);
    let placedByName =
        originator?.StaffId && originator.StaffName
            ? originator.StaffName
            : originator?.CustomerId && originator.CustomerName
            ? originator.CustomerName
            : '-';
    placedByName = `${placedByName} ${isYou ? orderPlacedByYouText : ''}`;
    const isOnBehalfOfOrder = isOnlineStore && originator?.StaffName && customer?.Name;
    const maxOrderTextLength = window.innerWidth > 700 ? 20 : 12;
    const placedByText = `${orderPlacedByFullText} ${placedByName}`;
    const onBehalfOfText = `${orderOnBehalfOfText} ${customer?.Name} ${isYouObo ? orderPlacedByYouText : ''}`;

    return (
        <>
            {props.shouldShowOrderPlacedBy && (
                <td>
                    <span
                        className={`${props.className}__placed-by`}
                        data-title={`${placedByName} ${isOnBehalfOfOrder ? onBehalfOfText : ''}`}
                    >
                        {placedByName}
                        {isOnBehalfOfOrder && (
                            <>
                                <br /> {getShortEllipsisText(onBehalfOfText, maxOrderTextLength)}
                            </>
                        )}
                    </span>
                </td>
            )}
            <td>
                <span className={`${props.className}__order-number`}>{orderNumberCellText}</span>
                {isOnBehalfOfOrder && !props.shouldShowOrderPlacedBy && (
                    <>
                        <span className={`${props.className}__placed-by`} data-title={placedByText}>
                            {getShortEllipsisText(placedByText, maxOrderTextLength)}
                        </span>
                    </>
                )}
            </td>
            <td>{formatDate(props.context, salesOrder.CreatedDateTime)}</td>
            <td className={columnWithNumberClassName}>{itemsCount}</td>
            <td className={columnWithNumberClassName}>{formatAmount(props.context, salesOrder.TotalAmount, salesOrder.CurrencyCode)}</td>
            {props.shouldShowChannelInfo && (
                <td>
                    {channelName &&
                        (channelAddress
                            ? `${props.resources.posChannelNameText} ${channelName}`
                            : props.resources.onlineStoreChannelNameText)}
                </td>
            )}
            <td>
                <Button
                    className={`${props.className}__view-details-button`}
                    href={linkToOrderHistoryDetails}
                    title={props.resources.orderHistoryViewDetailsButtonText}
                    aria-label={props.resources.orderHistoryViewDetailsButtonAriaLabel}
                >
                    {props.resources.orderHistoryViewDetailsButtonText}
                </Button>
            </td>
        </>
    );
};

/**
 * Renders rows for mobile view.
 * @param props - Configuration for the rows.
 * @returns A react node with a list of order history rows for mobile view.
 */
export const OrderHistoryMobileTableRowCellComponent: React.FC<IOrderHistoryTableRowProps> = (props: IOrderHistoryTableRowProps) => {
    const {
        data: { salesOrder }
    } = props;

    const linkToOrderHistoryDetails = getOrderDetailsPageUrl(props.context.actionContext, props.data.salesOrder);

    const onClickViewDetails = React.useCallback(() => {
        if (MsDyn365.isBrowser) {
            window.location.href = linkToOrderHistoryDetails;
        }
    }, [linkToOrderHistoryDetails]);

    const orderNumber = StringExtensions.isNullOrWhitespace(salesOrder.SalesId)
        ? props.resources.orderHistoryOrderNumberIsNotAvailable
        : salesOrder.SalesId!;

    const dateText = format(
        props.resources.orderHistoryCreatedDateMobileDescriptionText,
        formatDate(props.context, salesOrder.CreatedDateTime)
    );

    const cellClassName = `${props.className}__mobile-cell`;

    return (
        <>
            <td className={cellClassName}>
                <div
                    className={`${cellClassName}__open-details`}
                    onClick={onClickViewDetails}
                    onKeyPress={onClickViewDetails}
                    role='button'
                    tabIndex={0}
                >
                    <span className={`${cellClassName}__mobile-order-id`}>{orderNumber}</span>
                    <span className={`${cellClassName}__mobile-created-date`}>{dateText}</span>
                </div>
            </td>
            <td>
                <Button
                    className={`${cellClassName}__view-details-button`}
                    href={linkToOrderHistoryDetails}
                    title={props.resources.orderHistoryViewDetailsButtonText}
                    aria-label={props.resources.orderHistoryViewDetailsButtonAriaLabel}
                >
                    {props.resources.orderHistoryViewDetailsButtonText}
                </Button>
            </td>
        </>
    );
};

/**
 * Renders order history rows.
 * @param props - Configuration for the rows.
 * @returns A react node with a list of order history rows.
 */
export const OrderHistoryTableRowComponent: React.FC<IOrderHistoryTableRowProps> = (props: IOrderHistoryTableRowProps) => {
    const isMobileView = isMobile({ variant: VariantType.Viewport, context: props.context.request }) === 'xs';

    return (
        <tr className={props.className}>
            {isMobileView ? (
                <OrderHistoryMobileTableRowCellComponent {...props} />
            ) : (
                <OrderHistoryDesktopTableRowCellComponent {...props} />
            )}
        </tr>
    );
};
