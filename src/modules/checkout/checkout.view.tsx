/*!
 * Copyright (c) Microsoft Corporation.
 * All rights reserved. See LICENSE in the project root for license information.
 */

/* eslint-disable no-duplicate-imports */
import { Module, Node, Waiting } from '@msdyn365-commerce-modules/utilities';
import * as React from 'react';
import get from 'lodash/get';

import {
    ICheckoutViewProps,
    ILineItem,
    ILineItemDeliveryGroup,
    ILineItems,
    IOrderSummary,
    IPickUpAtStore,
    IEmailDelivery,
    IInvoicePaymentSummary,
    ICheckoutResources,
    ICustomOrderSummary
} from './index';
import { CustomPaymentMethod } from '../../shared/PaymentMethodEnum';
import { ICheckoutState } from '@msdyn365-commerce/global-state';

export const PickUpAtStoreComponent: React.FC<IPickUpAtStore> = ({ PickUpAtStore, label, location }) => (
    <Node {...PickUpAtStore}>
        {label}
        {location}
    </Node>
);

export const EmailDeliveryComponent: React.FC<IEmailDelivery> = ({ EmailDelivery, label }) => <Node {...EmailDelivery}>{label}</Node>;

export const LineItemComponent: React.FC<ILineItem> = ({ LineItem, item, pickUpAtStore, emailDelivery }) => (
    <Node {...LineItem}>
        {item}
        {pickUpAtStore && <PickUpAtStoreComponent {...pickUpAtStore} />}
        {emailDelivery && <EmailDeliveryComponent {...emailDelivery} />}
    </Node>
);

export const LineItemGroupComponent: React.FC<ILineItemDeliveryGroup> = ({ LineItemDeliveryGroup, LineItemList, heading, lineItems }) => (
    <Node {...LineItemDeliveryGroup}>
        {heading}
        <Node {...LineItemList}>
            {lineItems.map(lineItem => (
                <LineItemComponent key={lineItem.LineId} {...lineItem} />
            ))}
        </Node>
    </Node>
);

export const LineItemGroupComponentWithMultiplePickUp: React.FC<ILineItemDeliveryGroup> = ({
    LineItemDeliveryGroup,
    LineItemList,
    heading,
    lineItems,
    lineItemWraper,
    lineItemWraperIcon
}) => (
    <Node {...LineItemDeliveryGroup}>
        {lineItemWraperIcon}
        {lineItemWraper}
        {heading}
        <Node {...LineItemList}>
            {lineItems.map(lineItem => (
                <LineItemComponentWithMultiplePickUp key={lineItem.LineId} {...lineItem} />
            ))}
        </Node>
    </Node>
);

export const LineItemComponentWithMultiplePickUp: React.FC<ILineItem> = ({ LineItem, item, pickUpAtStore, emailDelivery }) => (
    <Node {...LineItem}>
        {item}
        {emailDelivery && <EmailDeliveryComponent {...emailDelivery} />}
    </Node>
);

export const PickUpAtStoreComponentWithMultiplePickUp: React.FC<IPickUpAtStore> = ({ PickUpAtStore, label, location }) => (
    <Node {...PickUpAtStore}>
        {label}
        {location}
    </Node>
);

export const LineItemsComponent: React.FC<ILineItems> = ({
    LineItems,
    Header,
    heading,
    editLink,
    itemsForPickup,
    itemsForShip,
    itemsForEmail,
    itemsGroupWithMulitplePickupMode
}) => (
    <Node {...LineItems}>
        <Node {...Header}>
            {heading}
            {editLink}
        </Node>
        {itemsGroupWithMulitplePickupMode === undefined && itemsForPickup && <LineItemGroupComponent {...itemsForPickup} />}
        {itemsGroupWithMulitplePickupMode === undefined && itemsForEmail && <LineItemGroupComponent {...itemsForEmail} />}
        {itemsGroupWithMulitplePickupMode === undefined && itemsForShip && <LineItemGroupComponent {...itemsForShip} />}
        {itemsGroupWithMulitplePickupMode !== undefined
            ? itemsGroupWithMulitplePickupMode.map((item, index) => {
                  return <LineItemGroupComponentWithMultiplePickUp {...item} key={index} />;
              })
            : null}
    </Node>
);

const OrderSummaryComponent: React.FC<IOrderSummary & {
    isPaymentOptionSelected: string | undefined;
    resources: ICheckoutResources;
    checkoutState: ICheckoutState | undefined;
    customOrderSummaryLine: ICustomOrderSummary | undefined;
}> = ({ heading, lines, isPaymentOptionSelected, resources, checkoutState, customOrderSummaryLine }) => {
    console.log('checkoutState', checkoutState);
    return (
        <div className='msc-order-summary-wrapper'>
            {heading}
            <div className='msc-order-summary__items'>
                {isPaymentOptionSelected && isPaymentOptionSelected === CustomPaymentMethod.COD ? (
                    <>
                        {customOrderSummaryLine?.subtotal}
                        {customOrderSummaryLine?.totalDiscounts}
                        {customOrderSummaryLine?.codCharges}
                        {customOrderSummaryLine?.otherCharge}
                        {customOrderSummaryLine?.shipping}
                        {customOrderSummaryLine?.tax}
                        {customOrderSummaryLine?.loyalty}
                        {customOrderSummaryLine?.customerAccount}
                        {customOrderSummaryLine?.giftCard}
                        {customOrderSummaryLine?.orderTotal}
                    </>
                ) : (
                    lines && (
                        <>
                            {lines.subtotal}
                            {lines.shipping}
                            {lines.otherCharge}
                            {lines.tax}
                            {lines.totalDiscounts}
                            {lines.loyalty}
                            {lines.customerAccount}
                            {lines.giftCard}
                            {lines.orderTotal}
                        </>
                    )
                )}
            </div>
        </div>
    );
};

const PaymentSummaryComponent: React.FC<IInvoicePaymentSummary> = ({ heading, lines }) => (
    <div className='msc-invoice-summary-wrapper'>
        {heading}
        <div className='msc-invoice-summary__items'>
            {lines && (
                <>
                    {lines.invoices}
                    {lines.giftCard}
                    {lines.loyalty}
                    {lines.orderTotal}
                </>
            )}
        </div>
    </div>
);

const CheckoutView: React.FC<ICheckoutViewProps> = props => {
    const {
        isPaymentVerificationRedirection,
        shouldEnableSinglePaymentAuthorizationCheckout,
        canShow,
        checkoutProps,
        headerProps,
        hasSalesOrder,
        hasInvoiceLine,
        bodyProps,
        mainProps,
        // mainControlProps,
        sideProps,
        sideControlFirstProps,
        sideControlSecondProps,
        termsAndConditionsProps,
        orderConfirmation,
        loading,
        alert,
        title,
        guidedForm,
        orderSummary,
        invoicePaymentSummary,
        lineItems,
        placeOrderButton,
        termsAndConditions,
        keepShoppingButton,
        checkoutExpressPaymentContainer,
        checkoutErrorRef,
        isPaymentOptionSelected,
        resources,
        data: { checkout },
        customOrderSummaryLine,
        codPlaceOrderButton
        // isPlaceOrderForCustOrderSummary
    } = props;

    const checkoutState = get(checkout, 'result');

    return (
        <Module {...checkoutProps} ref={checkoutErrorRef}>
            {!hasSalesOrder && !checkoutExpressPaymentContainer && <Node {...headerProps}>{title}</Node>}
            {!hasSalesOrder && isPaymentVerificationRedirection && shouldEnableSinglePaymentAuthorizationCheckout && !alert && !loading && (
                <Waiting className='msc-waiting-circular msc-waiting-lg' />
            )}
            {!hasSalesOrder && (
                <Node {...bodyProps}>
                    {loading}
                    {alert}
                    {canShow && (
                        <>
                            <Node {...mainProps}>
                                <Node className='msc-guided-form-mainContainer'>
                                    {checkoutExpressPaymentContainer}
                                    {checkoutExpressPaymentContainer && <Node {...headerProps}>{title}</Node>}
                                    {guidedForm}
                                    <Node {...termsAndConditionsProps}>{termsAndConditions}</Node>
                                    {/* <Node {...mainControlProps}>
                                        {placeOrderButton}
                                        {keepShoppingButton}
                                    </Node> */}
                                </Node>
                                <Node className='msc-shopping-cart-mainContainer'>
                                    {lineItems && <LineItemsComponent {...lineItems} />}
                                </Node>
                            </Node>
                            <Node {...sideProps}>
                                {!hasInvoiceLine
                                    ? orderSummary && (
                                          <OrderSummaryComponent
                                              {...orderSummary}
                                              isPaymentOptionSelected={isPaymentOptionSelected}
                                              resources={resources}
                                              checkoutState={checkoutState}
                                              customOrderSummaryLine={customOrderSummaryLine}
                                          />
                                      )
                                    : invoicePaymentSummary && <PaymentSummaryComponent {...invoicePaymentSummary} />}
                                {isPaymentOptionSelected !== CustomPaymentMethod.COD ? (
                                    <>
                                        <Node {...sideControlFirstProps}>
                                            <Node {...termsAndConditionsProps}>{termsAndConditions}</Node>
                                            {placeOrderButton}
                                            {keepShoppingButton}
                                        </Node>
                                        <Node {...sideControlSecondProps}>
                                            <Node {...termsAndConditionsProps}>{termsAndConditions}</Node>
                                            {placeOrderButton}
                                            {keepShoppingButton}
                                        </Node>
                                    </>
                                ) : (
                                    <>
                                        <Node {...sideControlFirstProps}>
                                            <Node {...termsAndConditionsProps}>{termsAndConditions}</Node>
                                            {codPlaceOrderButton}
                                            {keepShoppingButton}
                                        </Node>
                                    </>
                                )}
                            </Node>
                        </>
                    )}
                </Node>
            )}
            {hasSalesOrder && orderConfirmation}
        </Module>
    );
};

export default CheckoutView;
