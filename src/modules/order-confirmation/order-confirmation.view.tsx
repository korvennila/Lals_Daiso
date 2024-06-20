/*!
 * Copyright (c) Microsoft Corporation.
 * All rights reserved. See LICENSE in the project root for license information.
 */

/* eslint-disable no-duplicate-imports */
import { Module, Node } from '@msdyn365-commerce-modules/utilities';
import * as React from 'react';

import { IHelp, IOrderSummary, IPaymentMethods } from '@msdyn365-commerce-modules/order-management';
import { IGroup, IGroupDelivery, IGroups } from '@msdyn365-commerce-modules/order-management';
import { IOrderInformation } from '@msdyn365-commerce-modules/order-management';
import { ISalesLine } from '@msdyn365-commerce-modules/order-management';
import { IOrderConfirmationViewProps } from './order-confirmation';

export const OrderConfirmationOrderInfomation: React.FC<IOrderInformation> = ({
    orderInformationProps,
    receiptEmail,
    createdDate,
    channelReferenceId
}) => (
    <Node {...orderInformationProps}>
        {/* {createdDate} */}
        {channelReferenceId}
        {/* {receiptEmail} */}
    </Node>
);

export const OrderConfirmationSalesLine: React.FC<ISalesLine> = ({ salesLineProps, salesLine, buyAgainButton }) => (
    <Node {...salesLineProps}>{salesLine}</Node>
);

export const OrderConfirmationGroupDelivery: React.FC<IGroupDelivery> = ({
    deliveryProps,
    heading,
    count,
    processing,
    address,
    trackingInfo,
    pickupDateTimeslot
}) => (
    <Node {...deliveryProps}>
        {heading}
        {address}
        {pickupDateTimeslot}
    </Node>
);

export const OrderConfirmationGroup: React.FC<IGroup> = ({ groupProps, delivery, salesLinesProps, salesLines }) => (
    <Node {...groupProps}>
        {delivery && <OrderConfirmationGroupDelivery {...delivery} />}
        {delivery && delivery.shippingItemsToYou}
        {salesLines && (
            <Node {...salesLinesProps}>
                {salesLines.map((salesLine: ISalesLine) => (
                    <OrderConfirmationSalesLine key={salesLine.data.salesLine.LineId} {...salesLine} />
                ))}
            </Node>
        )}
    </Node>
);

export const OrderConfirmationGroups: React.FC<IGroups> = ({ groupsProps, groups }) => (
    <Node {...groupsProps}>
        {groups.map((group: IGroup, index: number) => (
            <OrderConfirmationGroup key={index} {...group} />
        ))}
    </Node>
);

export const OrderConfirmationOrderSummary: React.FC<IOrderSummary> = ({
    orderSummaryProps,
    heading,
    subtotal,
    shipping,
    tax,
    totalAmount,
    earnedPoints
}) => (
    <Node {...orderSummaryProps}>
        {heading}
        {subtotal}
        {shipping}
        {tax}
        {totalAmount}
        {earnedPoints}
    </Node>
);

export const OrderConfirmationPayment: React.FC<IPaymentMethods> = ({ paymentMethodsProps, title, methods }) => (
    <Node {...paymentMethodsProps}>
        {title}
        {methods}
    </Node>
);

export const OrderConfirmationHelp: React.FC<IHelp> = ({ helpProps, needHelpLabel, helpLineNumberLabel, contactNumber }) => (
    <Node {...helpProps}>
        {needHelpLabel}
        {helpLineNumberLabel}
        {contactNumber}
    </Node>
);

const OrderConfirmationView: React.FC<IOrderConfirmationViewProps> = ({
    moduleProps,
    // heading,
    // backToShoppingLink,
    // alert,
    // loading,
    orderInfomation
    // orderSummary,
    // payment,
    // help,
    // groups
}) => {
    return (
        <Module {...moduleProps}>
            {/* {heading}
            {alert}
            {loading} */}
            {orderInfomation && <OrderConfirmationOrderInfomation {...orderInfomation} />}
            {/* {backToShoppingLink}
            {groups && <OrderConfirmationGroups {...groups} />}
            {payment && <OrderConfirmationPayment {...payment} />}
            {orderSummary && <OrderConfirmationOrderSummary {...orderSummary} />}
            {help && <OrderConfirmationHelp {...help} />} */}
        </Module>
    );
};

export default OrderConfirmationView;
