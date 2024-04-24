/*!
 * Copyright (c) Microsoft Corporation.
 * All rights reserved. See LICENSE in the project root for license information.
 */

import { buildMockCoreContext, buildMockModuleProps } from '@msdyn365-commerce/core';
import {
    Address,
    AsyncResult,
    ChannelDeliveryOptionConfiguration,
    ChannelIdentity,
    FeatureState,
    LoyaltyCard,
    OrgUnitLocation,
    SalesOrder,
    SimpleProduct,
    TenderLine,
    TenderType
} from '@msdyn365-commerce/retail-proxy';
import {
    IOrderDetailsConfig,
    IOrderDetailsData,
    IOrderDetailsProps,
    IOrderDetailsResources,
    OrderDetails
} from '@msdyn365-commerce-modules/order-management';
import { wrapInResolvedAsyncResult } from '@msdyn365-commerce-modules/retail-actions';
import * as React from 'react';
import * as renderer from 'react-test-renderer';

import renderView from '../views/order-details.view';

const mockShippingAddress: Address = {
    Name: 'Gloria Deng',
    Street: 'One Microsoft Way',
    City: 'Redmond',
    State: 'wa',
    ZipCode: '98052',
    ThreeLetterISORegionName: 'usa'
};

const mockStoreAddress: Address = {
    Name: 'Fabrikam Company Store',
    FullAddress: '15010 NE 36th St↵Redmond, WA 98052↵USA',
    Street: '15010 NE 36th St',
    City: 'Redmond',
    County: 'KING',
    ThreeLetterISORegionName: 'USA',
    State: 'WA',
    ZipCode: '98052'
};

const mockShipments = [
    {
        ShipmentId: '123',
        TrackingNumber: '123456',
        TrackingUrl: '/tracking'
    }
];

const mockTenderLines: TenderLine[] = [
    {
        TenderTypeId: '3',
        MaskedCardNumber: '************1111',
        Currency: 'USD',
        CardTypeId: 'VISA'
    },
    {
        TenderTypeId: '8',
        GiftCardId: 'gldeng_100_3',
        Currency: 'USD',
        Amount: 100
    },
    {
        TenderTypeId: '1',
        Currency: 'USD',
        Amount: 100
    },
    {
        TenderTypeId: '10',
        LoyaltyCardId: '890609',
        Currency: 'USD',
        Amount: 100
    },
    {
        TenderTypeId: '4',
        CustomerId: '005221', // Does this need to be changed to a dedicated test account once customer account payment functionality is fleshed out?
        Currency: 'USD',
        Amount: 400
    }
];

const mockTenderLinesWithAuthorizedAmount: TenderLine[] = [
    {
        AuthorizedAmount: 10,
        TenderTypeId: '3',
        MaskedCardNumber: '************1111',
        Currency: 'USD',
        CardTypeId: 'VISA'
    },
    {
        TenderTypeId: '8',
        GiftCardId: 'gldeng_100_3',
        Currency: 'USD',
        Amount: 100
    },
    {
        TenderTypeId: '1',
        Currency: 'USD',
        Amount: 100
    },
    {
        TenderTypeId: '10',
        LoyaltyCardId: '890609',
        Currency: 'USD',
        Amount: 100
    },
    {
        TenderTypeId: '4',
        CustomerId: '005221', // Does this need to be changed to a dedicated test account once customer account payment functionality is fleshed out?
        Currency: 'USD',
        Amount: 400
    }
];

const mockSalesOrderWithAmount: SalesOrder = {
    Id: '0HHRKonY4riLeLAjxZAZTltqsZrMVPvt',
    ReceiptEmail: 'john@example.com',
    ChannelId: 5637145359,
    ChannelReferenceId: 'C764D04GLDEN',
    CurrencyCode: 'USD',
    SalesId: '012660',
    SalesLines: [
        {
            ProductId: 22565430654,
            TotalAmount: 300,
            SalesStatusValue: 0,
            Quantity: 1,
            DeliveryMode: '60',
            ShippingAddress: mockShippingAddress,
            TrackingId: '123'
        },
        {
            ProductId: 22565430655,
            TotalAmount: 200,
            SalesStatusValue: 0,
            Quantity: 2,
            DeliveryMode: '70',
            ShippingAddress: mockStoreAddress
        }
    ],
    Shipments: mockShipments,
    SubtotalAmount: 300,
    ChargeAmount: 0,
    SubtotalAmountWithoutTax: 300,
    TaxAmount: 19.5,
    TotalAmount: 319.5,
    TenderLines: mockTenderLinesWithAuthorizedAmount
};

const mockSalesOrderWithAuthorizedAmount: SalesOrder = {
    Id: '0HHRKonY4riLeLAjxZAZTltqsZrMVPvt',
    ReceiptEmail: 'john@example.com',
    ChannelId: 5637145359,
    ChannelReferenceId: 'C764D04GLDEN',
    CurrencyCode: 'USD',
    SalesId: '012660',
    SalesLines: [
        {
            ProductId: 22565430654,
            TotalAmount: 300,
            SalesStatusValue: 0,
            Quantity: 1,
            DeliveryMode: '60',
            ShippingAddress: mockShippingAddress,
            TrackingId: '123'
        },
        {
            ProductId: 22565430655,
            TotalAmount: 200,
            SalesStatusValue: 0,
            Quantity: 2,
            DeliveryMode: '70',
            ShippingAddress: mockStoreAddress
        }
    ],
    Shipments: mockShipments,
    SubtotalAmount: 300,
    ChargeAmount: 0,
    SubtotalAmountWithoutTax: 300,
    TaxAmount: 19.5,
    TotalAmount: 319.5,
    TenderLines: mockTenderLinesWithAuthorizedAmount
};

const mockSalesOrder: SalesOrder = {
    Id: '0HHRKonY4riLeLAjxZAZTltqsZrMVPvt',
    ReceiptEmail: 'john@example.com',
    ChannelId: 5637145359,
    ChannelReferenceId: 'C764D04GLDEN',
    CurrencyCode: 'USD',
    SalesId: '012660',
    SalesLines: [
        {
            RecordId: 13231,
            ProductId: 22565430654,
            TotalAmount: 300,
            SalesStatusValue: 0,
            Quantity: 1,
            DeliveryMode: '60',
            ShippingAddress: mockShippingAddress,
            TrackingId: '123'
        },
        {
            RecordId: 13231,
            ProductId: 22565430655,
            TotalAmount: 200,
            SalesStatusValue: 0,
            Quantity: 2,
            DeliveryMode: '70',
            ShippingAddress: mockStoreAddress
        }
    ],
    Shipments: mockShipments,
    SubtotalAmount: 300,
    ChargeAmount: 0,
    SubtotalAmountWithoutTax: 300,
    TaxAmount: 19.5,
    TotalAmount: 319.5,
    TenderLines: mockTenderLines
};

const mockSalesOrderWithReceiptId: SalesOrder = {
    ...mockSalesOrder,
    ReceiptId: '012660-RECEIPT-ID',
    SalesId: ''
};

const mockSalesOrderWithReceiptIdAndOrderId: SalesOrder = {
    ...mockSalesOrder,
    ReceiptId: '012660-RECEIPT-ID',
    SalesId: '012660-ORDER-ID'
};

const mockTransaction: SalesOrder = {
    Id: 'UiE~EWeXya9o0byTIE7KeP8bIEjpGv9-',
    ReceiptEmail: 'john@example.com',
    ChannelId: 5637145359,
    ChannelReferenceId: '0641E90GLDEN',
    CurrencyCode: 'USD',
    SalesId: undefined,
    SalesLines: [
        {
            ProductId: 22565430654,
            TotalAmount: 300,
            SalesStatusValue: 0,
            Quantity: 1,
            DeliveryMode: '60',
            ShippingAddress: mockShippingAddress
        },
        {
            ProductId: 22565430655,
            TotalAmount: 200,
            SalesStatusValue: 0,
            Quantity: 2,
            DeliveryMode: '70',
            ShippingAddress: mockStoreAddress
        }
    ],
    SubtotalAmount: 300,
    ChargeAmount: 0,
    SubtotalAmountWithoutTax: 300,
    TaxAmount: 19.5,
    TotalAmount: 319.5,
    TenderLines: mockTenderLines
};

const mockTransactionWithEmptyChannelReferenceIdAndWithEmptySalesId: SalesOrder = {
    Id: 'UiE~EWeXya9o0byTIE7KeP8bIEjpGv9-',
    ReceiptEmail: 'john@example.com',
    ChannelId: 5637145359,
    ChannelReferenceId: '',
    CurrencyCode: 'USD',
    SalesId: undefined,
    SalesLines: [
        {
            ProductId: 22565430654,
            TotalAmount: 300,
            SalesStatusValue: 0,
            Quantity: 1,
            DeliveryMode: '60',
            ShippingAddress: mockShippingAddress
        },
        {
            ProductId: 22565430655,
            TotalAmount: 200,
            SalesStatusValue: 0,
            Quantity: 2,
            DeliveryMode: '70',
            ShippingAddress: mockStoreAddress
        }
    ],
    SubtotalAmount: 300,
    ChargeAmount: 0,
    SubtotalAmountWithoutTax: 300,
    TaxAmount: 19.5,
    TotalAmount: 319.5,
    TenderLines: mockTenderLines
};

const mockProducts: SimpleProduct[] = [
    {
        RecordId: 22565430654,
        ItemId: '81307',
        Name: 'Red Leather Bag',
        ProductTypeValue: 4,
        BasePrice: 300,
        Price: 300,
        AdjustedPrice: 300,
        PrimaryImageUrl:
            'https://img-prod-cms-mr-microsoft-com.akamaized.net/cms/api/fabrikam/imageFileData/search?fileName=/Products%2F81307_000_001.png'
    },
    {
        RecordId: 22565430655,
        ItemId: '81308',
        Name: 'Brown Leather Bag',
        ProductTypeValue: 4,
        BasePrice: 200,
        Price: 200,
        AdjustedPrice: 200,
        PrimaryImageUrl:
            'https://img-prod-cms-mr-microsoft-com.akamaized.net/cms/api/fabrikam/imageFileData/search?fileName=/Products%2F81307_000_001.png',

        Dimensions: [
            {
                DimensionTypeValue: 1,

                // @ts-expect-error only mock partial data
                DimensionValue: {
                    Value: 'Brown'
                }
            },
            {
                DimensionTypeValue: 3,

                // @ts-expect-error only mock partial data
                DimensionValue: {
                    Value: 'Map'
                }
            },
            {
                DimensionTypeValue: 4,

                // @ts-expect-error only mock partial data
                DimensionValue: {
                    Value: 'Cool'
                }
            }
        ]
    }
];

const mockProductsWithGiftcard: SimpleProduct[] = [
    {
        RecordId: 22565430654,
        ItemId: '81307',
        Name: 'Red Leather Bag',
        ProductTypeValue: 4,
        BasePrice: 300,
        Price: 300,
        AdjustedPrice: 300,
        PrimaryImageUrl:
            'https://img-prod-cms-mr-microsoft-com.akamaized.net/cms/api/fabrikam/imageFileData/search?fileName=/Products%2F81307_000_001.png',
        IsGiftCard: true
    },
    {
        RecordId: 22565430655,
        ItemId: '81308',
        Name: 'Brown Leather Bag',
        ProductTypeValue: 4,
        BasePrice: 200,
        Price: 200,
        AdjustedPrice: 200,
        PrimaryImageUrl:
            'https://img-prod-cms-mr-microsoft-com.akamaized.net/cms/api/fabrikam/imageFileData/search?fileName=/Products%2F81307_000_001.png',
        IsGiftCard: true,

        Dimensions: [
            {
                DimensionTypeValue: 1,

                // @ts-expect-error only mock partial data
                DimensionValue: {
                    Value: 'Brown'
                }
            },
            {
                DimensionTypeValue: 3,

                // @ts-expect-error only mock partial data
                DimensionValue: {
                    Value: 'Map'
                }
            },
            {
                DimensionTypeValue: 4,

                // @ts-expect-error only mock partial data
                DimensionValue: {
                    Value: 'Cool'
                }
            }
        ]
    }
];

const mockTenderTypes: TenderType[] = [
    {
        Function: 0,
        TenderTypeId: '1',
        Name: 'Cash',
        OperationId: 200,
        OperationName: 'Pay cash'
    },
    {
        Function: 1,
        TenderTypeId: '3',
        Name: 'Cards',
        OperationId: 201,
        OperationName: 'Pay card'
    },
    {
        Function: 0,
        TenderTypeId: '8',
        Name: 'Gift Card',
        OperationId: 214,
        OperationName: 'Pay gift card'
    },
    {
        Function: 1,
        TenderTypeId: '10',
        Name: 'Loyalty Cards',
        OperationId: 207,
        OperationName: 'Pay loyalty card'
    },
    {
        Function: 3,
        TenderTypeId: '4',
        Name: 'Customer Account',
        OperationId: 202,
        OperationName: 'Pay customer account'
    }
];

/**
 * Mocked resources.
 */
const mockConfigResources: IOrderDetailsResources = {
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
    orderDetailsHeaderMessageText: 'orderDetailsHeaderMessageText',
    addedQuantityText: 'addedQuantityText',
    originalPriceText: 'originalPriceText',
    currentPriceText: 'currentPriceText',
    orderDetailsMultiLinesFormatText: 'orderDetailsMultiLinesFormatText',
    orderDetailsBuyItemsAgainHeaderText: 'orderDetailsBuyItemsAgainHeaderText',
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

// @ts-expect-error
const mockContext: ICoreContext = buildMockCoreContext({
    request: {
        gridSettings: {
            xs: { w: 767, h: 0 },
            sm: { w: 991, h: 0 },
            md: { w: 1199, h: 0 },
            lg: { w: 1599, h: 0 },
            xl: { w: 1600, h: 0 }
        },

        // @ts-expect-error only mock partial data
        apiSettings: {
            channelId: 5637145359
        },

        // @ts-expect-error only mock partial data
        channel: {
            PickupDeliveryModeCode: '70'
        },

        app: {
            config: { isEnableShowOrHideSalesTaxECommerceEnabled: false }
        }
    }
});

const loyaltyCard: LoyaltyCard = {
    CardNumber: '1234567890',
    LoyaltyEnrollmentDate: new Date('Wed Jul 03 2019 14:44:37 GMT-0700'),
    RewardPoints: [
        {
            RewardPointId: 'Fabrikam',
            RewardPointTypeValue: 1,
            RewardPointCurrency: 'USD',
            IsRedeemable: true,
            PointsExpiringSoon: 34,
            ActivePoints: 90,
            Description: 'Fabrikam awesome points'
        }
    ]
};

const mockDataWithSalesOrderWithAmount: IOrderDetailsData = {
    orderHydration: {
        status: 'SUCCESS',
        result: {
            salesOrder: mockSalesOrderWithAmount,
            products: mockProducts
        }
    } as AsyncResult<{
        salesOrder: SalesOrder;
        products: SimpleProduct[];
    }>,
    tenderTypes: wrapInResolvedAsyncResult(mockTenderTypes),
    loyaltyCard: wrapInResolvedAsyncResult(loyaltyCard),
    channels: wrapInResolvedAsyncResult({
        channelIdentities: [] as ChannelIdentity[]
    }),
    orgUnitLocations: wrapInResolvedAsyncResult({
        orgUnitLocations: [] as OrgUnitLocation[]
    }),
    channelDeliveryOptionConfig: {
        status: 'SUCCESS',
        result: {}
    } as AsyncResult<ChannelDeliveryOptionConfiguration>,
    featureState: AsyncResult.resolve([] as FeatureState[])
};

const mockDataWithSalesOrderWithAuthorizedAmount: IOrderDetailsData = {
    orderHydration: {
        status: 'SUCCESS',
        result: {
            salesOrder: mockSalesOrderWithAuthorizedAmount,
            products: mockProducts
        }
    } as AsyncResult<{
        salesOrder: SalesOrder;
        products: SimpleProduct[];
    }>,
    tenderTypes: wrapInResolvedAsyncResult(mockTenderTypes),
    loyaltyCard: wrapInResolvedAsyncResult(loyaltyCard),
    channels: wrapInResolvedAsyncResult({
        channelIdentities: [] as ChannelIdentity[]
    }),
    orgUnitLocations: wrapInResolvedAsyncResult({
        orgUnitLocations: [] as OrgUnitLocation[]
    }),
    channelDeliveryOptionConfig: {
        status: 'SUCCESS',
        result: {}
    } as AsyncResult<ChannelDeliveryOptionConfiguration>,
    featureState: AsyncResult.resolve([] as FeatureState[])
};

const mockDataWithSalesOrder: IOrderDetailsData = {
    orderHydration: {
        status: 'SUCCESS',
        result: {
            salesOrder: mockSalesOrder,
            products: mockProducts
        }
    } as AsyncResult<{
        salesOrder: SalesOrder;
        products: SimpleProduct[];
    }>,
    tenderTypes: wrapInResolvedAsyncResult(mockTenderTypes),
    loyaltyCard: wrapInResolvedAsyncResult(loyaltyCard),
    channels: wrapInResolvedAsyncResult({
        channelIdentities: [] as ChannelIdentity[]
    }),
    orgUnitLocations: wrapInResolvedAsyncResult({
        orgUnitLocations: [] as OrgUnitLocation[]
    }),
    channelDeliveryOptionConfig: {
        status: 'SUCCESS',
        result: {}
    } as AsyncResult<ChannelDeliveryOptionConfiguration>,
    featureState: AsyncResult.resolve([] as FeatureState[])
};

const mockDataWithTransaction: IOrderDetailsData = {
    orderHydration: {
        status: 'SUCCESS',
        result: {
            salesOrder: mockTransaction,
            products: mockProducts
        }
    } as AsyncResult<{
        salesOrder: SalesOrder;
        products: SimpleProduct[];
    }>,
    tenderTypes: wrapInResolvedAsyncResult(mockTenderTypes),
    loyaltyCard: wrapInResolvedAsyncResult(loyaltyCard),
    channels: wrapInResolvedAsyncResult({
        channelIdentities: [] as ChannelIdentity[]
    }),
    orgUnitLocations: wrapInResolvedAsyncResult({
        orgUnitLocations: [] as OrgUnitLocation[]
    }),
    channelDeliveryOptionConfig: {
        status: 'SUCCESS',
        result: {}
    } as AsyncResult<ChannelDeliveryOptionConfiguration>,
    featureState: AsyncResult.resolve([] as FeatureState[])
};

const mockDataWithTransactionWithEmptyChannelReferenceIdAndWithEmptySalesId: IOrderDetailsData = {
    orderHydration: {
        status: 'SUCCESS',
        result: {
            salesOrder: mockTransactionWithEmptyChannelReferenceIdAndWithEmptySalesId,
            products: mockProducts
        }
    } as AsyncResult<{
        salesOrder: SalesOrder;
        products: SimpleProduct[];
    }>,
    tenderTypes: wrapInResolvedAsyncResult(mockTenderTypes),
    loyaltyCard: wrapInResolvedAsyncResult(loyaltyCard),
    channels: wrapInResolvedAsyncResult({
        channelIdentities: [] as ChannelIdentity[]
    }),
    orgUnitLocations: wrapInResolvedAsyncResult({
        orgUnitLocations: [] as OrgUnitLocation[]
    }),
    channelDeliveryOptionConfig: {
        status: 'SUCCESS',
        result: {}
    } as AsyncResult<ChannelDeliveryOptionConfiguration>,
    featureState: AsyncResult.resolve([] as FeatureState[])
};

const mockDataWithSalesOrderWithReceiptId: IOrderDetailsData = {
    orderHydration: {
        status: 'SUCCESS',
        result: {
            salesOrder: mockSalesOrderWithReceiptId,
            products: mockProducts
        }
    } as AsyncResult<{
        salesOrder: SalesOrder;
        products: SimpleProduct[];
    }>,
    tenderTypes: wrapInResolvedAsyncResult(mockTenderTypes),
    loyaltyCard: wrapInResolvedAsyncResult(loyaltyCard),
    channels: wrapInResolvedAsyncResult({
        channelIdentities: [] as ChannelIdentity[]
    }),
    orgUnitLocations: wrapInResolvedAsyncResult({
        orgUnitLocations: [] as OrgUnitLocation[]
    }),
    channelDeliveryOptionConfig: {
        status: 'SUCCESS',
        result: {}
    } as AsyncResult<ChannelDeliveryOptionConfiguration>,
    featureState: AsyncResult.resolve([] as FeatureState[])
};

const mockDataWithSalesOrderWithReceiptIdAndOrderId: IOrderDetailsData = {
    orderHydration: {
        status: 'SUCCESS',
        result: {
            salesOrder: mockSalesOrderWithReceiptIdAndOrderId,
            products: mockProducts
        }
    } as AsyncResult<{
        salesOrder: SalesOrder;
        products: SimpleProduct[];
    }>,
    tenderTypes: wrapInResolvedAsyncResult(mockTenderTypes),
    loyaltyCard: wrapInResolvedAsyncResult(loyaltyCard),
    channels: wrapInResolvedAsyncResult({
        channelIdentities: [] as ChannelIdentity[]
    }),
    orgUnitLocations: wrapInResolvedAsyncResult({
        orgUnitLocations: [] as OrgUnitLocation[]
    }),
    channelDeliveryOptionConfig: {
        status: 'SUCCESS',
        result: {}
    } as AsyncResult<ChannelDeliveryOptionConfiguration>,
    featureState: AsyncResult.resolve([] as FeatureState[])
};

const mockDataWithSalesOrderWithGiftcard: IOrderDetailsData = {
    orderHydration: {
        status: 'SUCCESS',
        result: {
            salesOrder: mockSalesOrder,
            products: mockProductsWithGiftcard
        }
    } as AsyncResult<{
        salesOrder: SalesOrder;
        products: SimpleProduct[];
    }>,
    tenderTypes: wrapInResolvedAsyncResult(mockTenderTypes),
    loyaltyCard: wrapInResolvedAsyncResult(loyaltyCard),
    channels: wrapInResolvedAsyncResult({
        channelIdentities: [] as ChannelIdentity[]
    }),
    orgUnitLocations: wrapInResolvedAsyncResult({
        orgUnitLocations: [] as OrgUnitLocation[]
    }),
    channelDeliveryOptionConfig: {
        status: 'SUCCESS',
        result: {}
    } as AsyncResult<ChannelDeliveryOptionConfiguration>,
    featureState: AsyncResult.resolve([] as FeatureState[])
};

const mockConfigSalesOrder: IOrderDetailsConfig = {
    contactNumber: '123-456-7890',
    showChannelInfo: true,
    shouldShowQrCode: true
};

const mockConfigWithTransition: IOrderDetailsConfig = {
    heading: {
        text: 'Order details',
        tag: undefined
    },
    contactNumber: '000-000-0000'
};

const mockActions = {};

describe('OrderDetails', () => {
    let modulePropsWithSalesOrder: IOrderDetailsProps<IOrderDetailsData>;
    let modulePropsWithTransaction: IOrderDetailsProps<IOrderDetailsData>;
    let modulePropsWithTransactionWithEmptyChannelReferenceIdAndWithEmptySalesId: IOrderDetailsProps<IOrderDetailsData>;
    let modulePropsWithSalesOrderWithReceiptId: IOrderDetailsProps<IOrderDetailsData>;
    let modulePropsWithSalesOrderWithReceiptIdAndOrderId: IOrderDetailsProps<IOrderDetailsData>;
    let modulePropsWithSalesOrderWithGiftcard: IOrderDetailsProps<IOrderDetailsData>;

    it('renders correctly with sales order', () => {
        modulePropsWithSalesOrder = {
            ...(buildMockModuleProps(mockDataWithSalesOrder, mockActions, mockConfigSalesOrder, mockContext) as IOrderDetailsProps<
                IOrderDetailsData
            >),
            resources: mockConfigResources,

            // @ts-expect-error
            renderView
        };
        const component: renderer.ReactTestRenderer = renderer.create(<OrderDetails {...modulePropsWithSalesOrder} />);
        const tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('renders correctly with gift card sales order', () => {
        modulePropsWithSalesOrderWithGiftcard = {
            ...(buildMockModuleProps(
                mockDataWithSalesOrderWithGiftcard,
                mockActions,
                mockConfigSalesOrder,
                mockContext
            ) as IOrderDetailsProps<IOrderDetailsData>),
            resources: mockConfigResources,

            // @ts-expect-error
            renderView
        };
        const component: renderer.ReactTestRenderer = renderer.create(<OrderDetails {...modulePropsWithSalesOrderWithGiftcard} />);
        const tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('renders sales order with amount', () => {
        const modulePropsWithSalesOrderWithAmount: IOrderDetailsProps<IOrderDetailsData> = {
            ...(buildMockModuleProps(
                mockDataWithSalesOrderWithAmount,
                mockActions,
                mockConfigSalesOrder,
                mockContext
            ) as IOrderDetailsProps<IOrderDetailsData>),
            resources: mockConfigResources,

            // @ts-expect-error
            renderView
        };

        modulePropsWithSalesOrder = {
            ...(buildMockModuleProps(
                mockDataWithSalesOrderWithAmount,
                mockActions,
                mockConfigSalesOrder,
                mockContext
            ) as IOrderDetailsProps<IOrderDetailsData>),
            resources: mockConfigResources,

            // @ts-expect-error
            renderView
        };

        const component: renderer.ReactTestRenderer = renderer.create(<OrderDetails {...modulePropsWithSalesOrderWithAmount} />);
        const tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('renders sales order with authorized amount', () => {
        const modulePropsWithSalesOrderWithAuthorizedAmount: IOrderDetailsProps<IOrderDetailsData> = {
            ...(buildMockModuleProps(
                mockDataWithSalesOrderWithAuthorizedAmount,
                mockActions,
                mockConfigSalesOrder,
                mockContext
            ) as IOrderDetailsProps<IOrderDetailsData>),
            resources: mockConfigResources,

            // @ts-expect-error
            renderView
        };
        modulePropsWithSalesOrder = {
            ...(buildMockModuleProps(
                mockDataWithSalesOrderWithAuthorizedAmount,
                mockActions,
                mockConfigSalesOrder,
                mockContext
            ) as IOrderDetailsProps<IOrderDetailsData>),
            resources: mockConfigResources,

            // @ts-expect-error
            renderView
        };

        const component: renderer.ReactTestRenderer = renderer.create(<OrderDetails {...modulePropsWithSalesOrderWithAuthorizedAmount} />);
        const tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('renders correctly with transaction', () => {
        modulePropsWithTransaction = {
            ...(buildMockModuleProps(mockDataWithTransaction, mockActions, mockConfigWithTransition, mockContext) as IOrderDetailsProps<
                IOrderDetailsData
            >),
            resources: mockConfigResources,

            // @ts-expect-error
            renderView
        };
        const component: renderer.ReactTestRenderer = renderer.create(<OrderDetails {...modulePropsWithTransaction} />);
        const tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('renders correctly with transaction with empty channel reference id', () => {
        modulePropsWithTransactionWithEmptyChannelReferenceIdAndWithEmptySalesId = {
            ...(buildMockModuleProps(
                mockDataWithTransactionWithEmptyChannelReferenceIdAndWithEmptySalesId,
                mockActions,
                mockConfigWithTransition,
                mockContext
            ) as IOrderDetailsProps<IOrderDetailsData>),
            resources: mockConfigResources,

            // @ts-expect-error
            renderView
        };
        const component: renderer.ReactTestRenderer = renderer.create(
            <OrderDetails {...modulePropsWithTransactionWithEmptyChannelReferenceIdAndWithEmptySalesId} />
        );
        const tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('renders correctly with sales order with receipt id only', () => {
        modulePropsWithSalesOrderWithReceiptId = {
            ...(buildMockModuleProps(
                mockDataWithSalesOrderWithReceiptId,
                mockActions,
                mockConfigSalesOrder,
                mockContext
            ) as IOrderDetailsProps<IOrderDetailsData>),
            resources: mockConfigResources,

            // @ts-expect-error
            renderView
        };
        const component: renderer.ReactTestRenderer = renderer.create(<OrderDetails {...modulePropsWithSalesOrderWithReceiptId} />);
        const tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('renders correctly with sales order with receipt id and order id', () => {
        modulePropsWithSalesOrderWithReceiptIdAndOrderId = {
            ...(buildMockModuleProps(
                mockDataWithSalesOrderWithReceiptIdAndOrderId,
                mockActions,
                mockConfigSalesOrder,
                mockContext
            ) as IOrderDetailsProps<IOrderDetailsData>),
            resources: mockConfigResources,

            // @ts-expect-error
            renderView
        };
        const component: renderer.ReactTestRenderer = renderer.create(
            <OrderDetails {...modulePropsWithSalesOrderWithReceiptIdAndOrderId} />
        );
        const tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });
});
