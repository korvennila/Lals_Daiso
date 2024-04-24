/*!
 * Copyright (c) Microsoft Corporation.
 * All rights reserved. See LICENSE in the project root for license information.
 */

import * as Msdyn365 from '@msdyn365-commerce/core';
import { SimpleProduct } from '@msdyn365-commerce/retail-proxy';
import {
    IHeader,
    IOrderDetailsData,
    IOrderDetailsProps,
    IOrderHistory,
    IOrderHistoryResources,
    IOrderHistoryViewProps
} from '@msdyn365-commerce-modules/order-management';
import { render } from 'enzyme';
import * as React from 'react';

import OrderHistoryView from '../views/order-history.view';

const mockConfigResources = {
    orderSummaryHeading: 'Order summary',
    receiptEmailMessage: 'Confirmation email sent to ',
    receiptIdLabel: 'Receipt#',
    loadingLabel: 'Loading...',
    freePriceText: 'FREE',
    orderSummaryItemsTotalLabel: 'Subtotal',
    orderSummaryShippingFeeLabel: 'Shipping',
    orderSummaryTaxLabel: 'Tax',
    orderSummaryGrandTotalLabel: 'Grand total',
    salesLineQuantityText: 'Quantity:',
    processingLabel: 'Processing',
    creditCardEndingLabel: 'card ending in',
    giftCardEndingLabel: 'Gift card ending in',
    amountCoveredLabel: 'Amount covered:',
    loyaltyCardUsedLabel: 'Loyalty card used',
    cashUsedLabel: 'Cash',
    customerAccountUsedLabel: 'Customer Account',
    orderIdLabel: 'Order ID:',
    confirmationIdLabel: 'Confirmation Id',
    orderSummaryTitle: 'Order summary',
    paymentMethodsTitle: 'Payment method',
    shippingAddressTitle: 'Shipping address',
    noSalesOrderDetailsText: 'No order details found',
    needHelpLabel: 'Need help?',
    helpLineNumberLabel: 'Call',
    helpLineContactAriaLabel: 'Need help, call',
    orderItemLabel: 'item',
    orderItemsLabel: 'items',
    pickedUpSalesLines: 'Store pickup',
    deliveredSalesLines: 'Delivery',
    carryOutSalesLines: 'Purchased',
    orderStatusReadyForPickup: 'Ready for pickup',
    orderStatusProcessing: 'Processing',
    orderStatusShipped: 'Shipped',
    orderStatusPickedUp: 'Picked up',
    orderStatusCanceled: 'Canceled',
    phoneLabel: 'Phone: ',
    phoneAriaLabel: 'Shop phone',
    buyItAgainLabel: 'Buy it again',
    buyItAgainAriaLabel: 'Buy it again for {productName}',
    shipToLabel: 'Ship to',
    storeLabel: 'Store',
    productDimensionTypeColor: 'Color:',
    productDimensionTypeSize: 'Size:',
    productDimensionTypeStyle: 'Style:',
    productDimensionTypeAmount: 'Amount',
    genericErrorMessage: 'Something went wrong. Please try again later.',
    trackingLabel: 'Tracking number:',
    trackingComingSoonLabel: 'Not yet available',
    trackingAriaLabel: 'Track your order',
    pointsEarnedLabel: 'Points earned',
    backToShopping: 'Back to shopping',
    configString: 'Configuration',
    discountStringText: 'Savings ',
    posChannelNameText: 'Purchased at ',
    onlineStoreChannelNameText: 'Online purchase',
    emailSalesLines: 'Email delivery',
    orderStatusEmailed: 'Emailed',
    pickupDateTimeslotText: 'Pickup date and time slot',
    pickupTimeslotPlaceHolder: '{0} - {1}',
    shippingCharges: 'Shipping Charges',
    orderDetailsListViewModeAriaLabel: 'orderDetailsListViewModeAriaLabel',
    orderDetailsDetailedViewModeAriaLabel: 'orderDetailsDetailedViewModeAriaLabel',
    orderDetailsProductNumberText: 'orderDetailsProductNumberText',
    orderDetailsProductText: 'orderDetailsProductText',
    orderDetailsUnitPriceText: 'orderDetailsUnitPriceText',
    orderDetailsModeOfDeliveryText: 'orderDetailsModeOfDeliveryText',
    orderDetailsStatusText: 'orderDetailsStatusText',
    orderDetailsQuantityText: 'orderDetailsQuantityText',
    orderDetailsUnitOfMeasureText: 'orderDetailsUnitOfMeasureText',
    orderDetailsTotalText: 'orderDetailsTotalText',
    orderDetailsProductDimensionsSeparator: 'orderDetailsProductDimensionsSeparator',
    orderDetailsQuantityMobileText: 'orderDetailsQuantityMobileText',
    orderDetailsActionsText: 'orderDetailsActionsText',
    orderDetailsViewDetailsButtonText: 'orderDetailsViewDetailsButtonText',
    orderDetailsViewDetailsButtonAriaLabel: 'orderDetailsViewDetailsButtonAriaLabel',
    orderDetailsBuySelectedButtonText: 'orderDetailsBuySelectedButtonText',
    orderDetailsBuySelectedButtonAriaLabel: 'orderDetailsBuySelectedButtonAriaLabel',
    orderDetailsSelectAllRadioAriaLabelText: 'orderDetailsSelectAllRadioAriaLabelText',
    orderDetailsSelectRadioAriaLabelText: 'orderDetailsSelectRadioAriaLabelText',
    orderDetailsBuySelectedAddingToCartErrorNotificationTitle: 'orderDetailsBuySelectedAddingToCartErrorNotificationTitle',
    orderDetailsBuySelectedAddingToCartErrorNotificationCloseAriaLabel:
        'orderDetailsBuySelectedAddingToCartErrorNotificationCloseAriaLabel',
    orderDetailsBuyItAgainButtonText: 'orderDetailsBuyItAgainButtonText',
    orderDetailsBuyItAgainButtonAriaLabel: 'orderDetailsBuyItAgainButtonAriaLabel',
    orderDetailsDisableSelectionButtonText: 'orderDetailsDisableSelectionButtonText',
    orderDetailsDisableSelectionButtonAriaLabel: 'orderDetailsDisableSelectionButtonAriaLabel',
    orderDetailsEnableSelectionButtonText: 'orderDetailsEnableSelectionButtonText',
    orderDetailsEnableSelectionButtonAriaLabel: 'orderDetailsEnableSelectionButtonAriaLabel',
    orderDetailsGoToCartText: 'orderDetailsGoToCartText',
    orderDetailsDialogCloseText: 'orderDetailsDialogCloseText',
    orderDetailsSingleItemText: 'orderDetailsSingleItemText',
    orderDetailsMultiLineItemFormatText: 'orderDetailsMultiLineItemFormatText',
    orderDetailsMultiLinesFormatText: 'orderDetailsMultiLinesFormatText',
    orderDetailsHeaderMessageText: 'orderDetailsHeaderMessageText',
    orderDetailsBuyItemsAgainHeaderText: 'orderDetailsBuyItemsAgainHeaderText',
    addedQuantityText: 'addedQuantityText',
    originalPriceText: 'originalPriceText',
    currentPriceText: 'currentPriceText',
    qrCodeSrText: 'qrCodeSrText',
    orderDetailsMultiItemsValidationErrorMessage: 'orderDetailsMultiItemsValidationErrorMessage',
    orderDetailsOneErrorText: 'orderDetailsOneErrorText',
    orderDetailsMultiErrorText: 'orderDetailsMultiErrorText',
    orderDetailsUnavailableProductText: 'orderDetailsUnavailableProductText',
    orderPlacedByText: 'orderPlacedByText',
    orderPlacedByFullText: 'orderPlacedByFullText',
    orderOnBehalfOfText: 'orderOnBehalfOfText',
    orderPlacedByYouText: 'orderPlacedByYouText',
    orderDetailsConfirmedShipDateText: 'orderDetailsConfirmedShipDateText',
    orderDetailsConfirmedShipDateTextForTableHeader: 'orderDetailsConfirmedShipDateTextForTableHeader'
};

const mockProducts: SimpleProduct[] = [
    {
        RecordId: 22565430654,
        ItemId: '81307',
        Name: 'Red Leather Bag',
        Description:
            'Whether you need a carry-everything or evening clutch, our selection covers all of your needs with a variety of handbags to match any occasion.',
        ProductTypeValue: 4,
        BasePrice: 300,
        Price: 300,
        AdjustedPrice: 300,
        PrimaryImageUrl: 'Products/81307_000_001.png'
    }
];

const mockResources: IOrderHistoryResources = {
    loadingLabel: 'loadingLabel',
    genericErrorMessage: 'genericErrorMessage',
    noOrderHistoryLable: 'noOrderHistoryLable',
    orderIdLabel: 'orderIdLabel',
    processingLabel: 'processingLabel',
    confirmationIdLabel: 'confirmationIdLabel',
    detailsLabel: 'detailsLabel',
    detailsAriaLabel: 'detailsAriaLabel',
    orderCountLabel: 'orderCountLabel',
    ordersCountLabel: 'ordersCountLabel',
    orderItemLabel: 'orderItemLabel',
    orderItemsLabel: 'orderItemsLabel',
    trackingLabel: 'trackingLabel',
    trackingComingSoonLabel: 'trackingComingSoonLabel',
    trackingAriaLabel: 'trackingAriaLabel',
    backToShopping: 'backToShopping',
    moreButtonText: 'moreButtonText',
    receiptEmailMessage: 'receiptEmailMessage',
    receiptIdLabel: 'receiptIdLabel',
    freePriceText: 'freePriceText',
    pickedUpSalesLines: 'pickedUpSalesLines',
    deliveredSalesLines: 'deliveredSalesLines',
    carryOutSalesLines: 'carryOutSalesLines',
    emailSalesLines: 'emailSalesLines',
    orderStatusEmailed: 'orderStatusEmailed',
    orderStatusReadyForPickup: 'orderStatusReadyForPickup',
    orderStatusProcessing: 'orderStatusProcessing',
    orderStatusShipped: 'orderStatusShipped',
    orderStatusPickedUp: 'orderStatusPickedUp',
    orderStatusCanceled: 'orderStatusCanceled',
    phoneAriaLabel: 'phoneAriaLabel',
    buyItAgainLabel: 'buyItAgainLabel',
    buyItAgainAriaLabel: 'buyItAgainAriaLabel',
    shipToLabel: 'shipToLabel',
    storeLabel: 'storeLabel',
    shippingAddressTitle: 'shippingAddressTitle',
    phoneLabel: 'phoneLabel',
    productDimensionTypeColor: 'productDimensionTypeColor',
    productDimensionTypeSize: 'productDimensionTypeSize',
    productDimensionTypeStyle: 'productDimensionTypeStyle',
    configString: 'configString',
    salesLineQuantityText: 'salesLineQuantityText',
    discountStringText: 'discountStringText',
    posChannelNameText: 'posChannelNameText',
    onlineStoreChannelNameText: 'onlineStoreChannelNameText',
    orderHistoryFilterYourOrderHistory: 'orderHistoryFilterYourOrderHistory',
    orderHistoryFilterOrganizationWide: 'orderHistoryFilterOrganizationWide',
    pickupDateTimeslotText: 'pickupDateTimeslotText',
    pickupTimeslotPlaceHolder: 'pickupTimeslotPlaceHolder',
    orderHistoryListViewModeAriaLabel: 'orderHistoryListViewModeAriaLabel',
    orderHistoryDetailedViewModeAriaLabel: 'orderHistoryDetailedViewModeAriaLabel',
    orderHistoryOrderNumberText: 'orderHistoryOrderNumberText',
    orderHistoryCreatedDateText: 'orderHistoryCreatedDateText',
    orderHistoryItemsText: 'orderHistoryItemsText',
    orderHistoryTotalText: 'orderHistoryTotalText',
    orderHistoryOriginText: 'orderHistoryOriginText',
    orderHistoryViewDetailsButtonText: 'orderHistoryViewDetailsButtonText',
    orderHistoryViewDetailsButtonAriaLabel: 'orderHistoryViewDetailsButtonAriaLabel',
    orderHistoryCreatedDateMobileDescriptionText: 'orderHistoryCreatedDateMobileDescriptionText',
    orderHistoryOrderNumberIsNotAvailable: 'orderHistoryOrderNumberIsNotAvailable',
    orderHistoryExpandProductsButtonText: 'orderHistoryExpandProductsButtonText',
    callCenterChannelNameText: 'callCenterChannelNameText',
    orderPlacedByText: 'orderPlacedByText',
    orderPlacedByFullText: 'orderPlacedByFullText',
    orderPlacedByYouText: 'orderPlacedByYouText',
    orderOnBehalfOfText: 'orderOnBehalfOfText'
};

const mockActionContext = Msdyn365.buildHydratedMockActionContext();

const mockContext: Msdyn365.ICoreContext = {
    actionContext: mockActionContext,

    // @ts-expect-error - Mocking context.
    request: {},

    // @ts-expect-error - Mocking context.
    cultureFormatter: {
        formatCurrency: jest.fn(price => `$${price}`),
        formatDate: jest.fn(date => `$${date.toLocaleString()}`)
    }
};

const mockOrderHistory: IOrderHistory = {
    salesOrders: [{ SalesId: '12' }],
    products: mockProducts,
    nextPageToken: 'next Page Token'
};

const orderHeader: IHeader = {
    headerProps: { className: 'xyz' },
    heading: '<h1>heading</h1>'
};

describe('Order history table row component', () => {
    it('Renders as expected when no data present', () => {
        const modulePropsWithSalesOrderWithAmount: IOrderDetailsProps<IOrderDetailsData> = {
            ...(Msdyn365.buildMockModuleProps({}, {}, {}, mockContext) as IOrderDetailsProps<IOrderDetailsData>),
            resources: mockConfigResources,
            renderModuleAttributes: jest.fn()
        };
        const moduleProps: IOrderHistoryViewProps = {
            orderHistory: mockOrderHistory,
            orderHistoryProps: { className: 'class', moduleProps: modulePropsWithSalesOrderWithAmount },
            alert: 'alert',
            list: {
                listProps: { className: 'class' },
                salesOrders: [
                    {
                        salesOrderProps: { className: 'class' },
                        orderInfomation: {
                            orderInformationProps: { className: 'class' },
                            channelName: 'store',
                            channelAddress: 'address',
                            salesId: '2',
                            receiptId: '012660-RECEIPT-ID',
                            receiptEmail: 'john@example.com',
                            createdDate: '01/01/1970',
                            count: 3,
                            amount: 300,
                            channelReferenceId: '0641E90GLDEN',
                            placedBy: undefined
                        },
                        groups: {
                            groupsProps: { className: 'class' },
                            groups: [
                                {
                                    groupProps: { className: 'class' },
                                    salesLinesProps: { className: 'class' },

                                    // @ts-expect-error
                                    data: {
                                        count: 1
                                    },
                                    isCashAndCarryTransaction: true
                                }
                            ]
                        },
                        orderDetailsLink: <div />
                    }
                ]
            },
            resources: mockResources,
            header: orderHeader,
            id: 'id',
            typeName: 'typeName'
        };

        const orderRow = render(<OrderHistoryView {...moduleProps} />);

        expect(orderRow).toMatchSnapshot();
    });
});
