/*!
 * Copyright (c) Microsoft Corporation.
 * All rights reserved. See LICENSE in the project root for license information.
 */

import { IOrderTemplateActionErrorResult } from '@msdyn365-commerce/components';
import { ICoreContext } from '@msdyn365-commerce/core';
import { AsyncResult, Customer, ProductListLine, SimpleProduct } from '@msdyn365-commerce/retail-proxy';
import { IBuyboxData, IBuyboxState, IBuyboxViewProps } from '@msdyn365-commerce-modules/buybox';
import * as RetailActions from '@msdyn365-commerce-modules/retail-actions';

import { IBuyboxProps as IBuyboxExtentionProps, IBuyboxResources } from '../../definition-extensions/buybox.ext.props.autogenerated';
import { renderAddToOrderTemplateButton } from '../../views/components/buybox-add-to-order-template';

describe('Add To Order Template Button unit tests - View', () => {
    const productListLine: ProductListLine = {
        ProductListId: 'product-list-id',
        LineId: 'line-id',
        ProductId: 42,
        Quantity: 12,
        UnitOfMeasure: 'ea'
    };

    const emptyOrderTemplate: RetailActions.OrderTemplate = {
        productList: {
            Id: 'id'
        },
        orderTemplateLines: [],
        totalLines: 0
    };

    const orderTemplatesT: RetailActions.OrderTemplate[] = [
        {
            productList: {
                Id: 'id',
                ProductListLines: [productListLine]
            },
            orderTemplateLines: [{ productListLine }],
            totalLines: 0
        },
        emptyOrderTemplate
    ];

    const b2bCustomer: Customer = {
        AccountNumber: 'customer-id',
        IsB2b: true
    };

    // @ts-expect-error partial mock
    const mockData: IBuyboxData = {
        orderTemplates: {
            status: 'FAILED',
            result: orderTemplatesT
        } as AsyncResult<RetailActions.OrderTemplate[]>,
        customerInformation: {
            status: 'SUCCESS',
            result: b2bCustomer
        } as AsyncResult<Customer>
    };

    // @ts-expect-error partial mock
    const mockData1: IBuyboxData = {
        orderTemplates: {
            status: 'FAILED',
            result: undefined
        } as AsyncResult<RetailActions.OrderTemplate[]>,
        customerInformation: {
            status: 'SUCCESS',
            result: undefined
        } as AsyncResult<Customer>
    };

    // @ts-expect-error partial mock
    const mockContext: ICoreContext = {};

    const mockResources: IBuyboxResources = {
        findInStoreLinkText: 'ms-buybox',
        findInStoreHeaderText: 'ms-buybox',
        findInStoreDescriptionText: 'ms-buybox',
        priceFree: 'ms-buybox',
        originalPriceText: 'ms-buybox',
        currentPriceText: 'ms-buybox',
        addToCartText: 'ms-buybox',
        outOfStockText: 'ms-buybox',
        averageRatingAriaLabel: 'ms-buybox',
        selectDimensionFormatString: 'ms-buybox',
        productDimensionTypeColor: 'ms-buybox',
        productDimensionTypeConfiguration: 'ms-buybox',
        productDimensionTypeSize: 'ms-buybox',
        productDimensionTypeStyle: 'ms-buybox',
        productDimensionTypeAmount: 'ms-buybox',
        createOrderTemplateHeader: 'ms-buybox',
        orderTemplateTitle: 'ms-buybox',
        orderTemplateNameAriaLabel: 'ms-buybox',
        createOrderTemplateDescription: 'ms-buybox',
        createNewOrderTemplateButtonText: 'ms-buybox',
        createOrderTemplateButtonText: 'ms-buybox',
        cancelNewOrderTemplateCreationButtonText: 'ms-buybox',
        defaultOrderTemplateName: 'ms-buybox',
        addToOrderTemplateHeader: 'ms-buybox',
        addToOrderTemplateButtonTooltip: 'ms-buybox',
        noOrderTemplatesMessage: 'ms-buybox',
        noOrderTemplatesDescription: 'ms-buybox',
        createAnOrderTemplateButtonText: 'ms-buybox',
        cancelOrderTemplateCreationButtonText: 'ms-buybox',
        selectTemplatesText: 'ms-buybox',
        addToTemplateButtonText: 'ms-buybox',
        lineItemsText: 'ms-buybox',
        addToOrderTemplateButtonText: 'ms-buybox',
        addToOrderTemplateMessage: 'ms-buybox',
        addItemToOrderTemplateError: 'ms-buybox',
        viewOrderTemplateButtonText: 'ms-buybox',
        continueShoppingButtonText: 'ms-buybox',
        itemAddedToOrderTemplateHeaderItemOneText: 'ms-buybox',
        itemAddedToOrderTemplateHeaderItemFormatText: 'ms-buybox',
        itemAddedToOrderTemplateHeaderMessageText: 'ms-buybox',
        duplicatedProductsHeader: 'ms-buybox',
        duplicatedProductsDescription: 'ms-buybox',
        updateQuantityButtonText: 'ms-buybox',
        cancelDuplicateItemsButtonText: 'ms-buybox',
        addToWishlistButtonText: 'ms-buybox',
        removeFromWishlistButtonText: 'ms-buybox',
        nameOfWishlist: 'ms-buybox',
        inputQuantityAriaLabel: 'ms-buybox',
        addToWishlistMessage: 'ms-buybox',
        removedFromWishlistMessage: 'ms-buybox',
        addItemToWishlistError: 'ms-buybox',
        removeItemFromWishlistError: 'ms-buybox',
        productQuantityHeading: 'ms-buybox',
        errorMessageOutOfStock: 'ms-buybox',
        errorMessageOutOfRangeOneLeft: 'ms-buybox',
        errorMessageOutOfRangeFormat: 'ms-buybox',
        productDimensionTypeColorErrorMessage: 'ms-buybox',
        productDimensionTypeConfigurationErrorMessage: 'ms-buybox',
        productDimensionTypeSizeErrorMessage: 'ms-buybox',
        productDimensionTypeStyleErrorMessage: 'ms-buybox',
        productDimensionTypeAmountErrorMessage: 'ms-buybox',
        buyboxErrorMessageHeader: 'ms-buybox',
        addedToCartFailureMessage: 'ms-buybox',
        maxQuantityLimitText: 'ms-buybox',
        invalidSmallCustomAmountText: 'ms-buybox',
        invalidLargeCustomAmountText: 'ms-buybox',
        shopSimilarLooksText: 'ms-buybox',
        shopSimilarDescriptionText: 'ms-buybox',
        buyBoxGoToCartText: 'ms-buybox',
        buyBoxContinueShoppingText: 'ms-buybox',
        buyBoxSingleItemText: 'ms-buybox',
        buyBoxMultiLineItemFormatText: 'ms-buybox',
        buyBoxHeaderMessageText: 'ms-buybox',
        maxQuantityText: 'ms-buybox',
        minQuantityText: 'ms-buybox',
        addedQuantityText: 'ms-buybox',
        buyboxKeyInPriceLabelHeading: 'ms-buybox',
        descriptionTextToShowAllPickupOptions: 'ms-buybox',
        closeNotificationLabel: 'ms-buybox',
        findInStoreNotAvailableTextButton: 'ms-buybox',
        findInStoreNotAvailableDescription: 'ms-buybox',
        ariaLabelForSelectedSwatchValue: 'ms-buybox',
        informationIconText: 'ms-buybox',
        priceRangeSeparator: 'ms-buybox',
        availabilityAtPreferredStoreText: 'Availability at preferred store',
        inStockText: 'In stock',
        bulkPurchaseLinkText: 'Bulk Purchase Link Text',
        swatchItemAriaLabel: 'Product',
        priceText: 'Price',
        shopText: 'Shop',
        descriptionText: 'Description',
        findText: 'Pickup and Delivery Methods',
        skuText: 'SKU:',
        decrementButtonAriaLabel: 'Decrease the quantity by 1',
        incrementButtonAriaLabel: 'Increase quantity by 1',
        salesAgreementPricePrompt: 'Contract price and terms may apply.',
        salesAgreementExpirationDatePrompt: 'Available period: {0} - {1}',
        salesAgreementCommittedQuantityPrompt: 'Quantity commitment: {0}',
        salesAgreementRemainingQuantityPrompt: 'Remaining quantity to qualify: {0}',
        notifyMeSuccessMessage: '',
        notifyMeFailureMessage: '',
        emailRequiredText: '',
        emailValidateText: '',
        buttonNotifyMeText: '',
        titleNotifyMeText: '',
        textForNotificationWhenAvailable: '',
        notifyMeAlreadySentMessage: '',
        productSpecificationTitle: '',
        trueValueText: '',
        falseValueText: '',
        additionalDownloadsText: '',
        estimatedDeliveryDate: ''
    };

    // @ts-expect-error partial mock
    const mockState: IBuyboxState = {
        quantity: 1
    };

    // @ts-expect-error partial mock
    const mockEmptyState: IBuyboxState = {};

    // @ts-expect-error partial mock
    const mockProps: IBuyboxViewProps & IBuyboxExtentionProps<IBuyboxData> = {
        id: '123',
        typeName: 'type name',
        context: mockContext,
        data: mockData,
        resources: mockResources,
        config: {
            imageSettings: undefined
        }
    };

    const mockCallbacks = {
        updateQuantity: jest.fn(),
        updateKeyInPrice: jest.fn(),
        updateErrorState: jest.fn(),
        initializeDimension: jest.fn(),
        dimensionSelectedAsync: jest.fn(),
        updateSelectedProduct: jest.fn(),
        getDropdownName: jest.fn(),
        changeModalOpen: jest.fn(),
        changeUpdatingDimension: jest.fn()
    };

    const mockProduct: SimpleProduct = {
        Name: 'Crew neck server',
        RecordId: 123,
        MasterProductId: 123,
        BasePrice: 25,
        Price: 25,
        AdjustedPrice: 25,
        ProductTypeValue: 1,
        Dimensions: [
            {
                DimensionTypeValue: 3,
                DimensionValue: {
                    RecordId: 1,
                    Value: 'S'
                }
            },
            {
                DimensionTypeValue: 4,
                DimensionValue: {
                    RecordId: 3,
                    Value: 'Large'
                }
            }
        ]
    };

    it('renders correctly', () => {
        const component = renderAddToOrderTemplateButton(mockProps, mockState, mockCallbacks, mockProduct) as React.Component<
            IBuyboxViewProps & IBuyboxExtentionProps<IBuyboxData>
        >;

        const errorResult: IOrderTemplateActionErrorResult = {
            status: 'FAILED'
        };

        // @ts-expect-error
        component.props.onError(errorResult);

        errorResult.status = 'MISSING_DIMENSION';

        // @ts-expect-error
        component.props.onError(errorResult);

        expect(component).toMatchSnapshot();
    });

    it('renders correctly with mock data 1', () => {
        mockProps.data = mockData1;
        const component = renderAddToOrderTemplateButton(mockProps, mockEmptyState, mockCallbacks, mockProduct);
        expect(component).toMatchSnapshot();
    });

    it('renders correctly mock empty', () => {
        const component = renderAddToOrderTemplateButton(mockProps, mockEmptyState, mockCallbacks, mockProduct);
        expect(component).toMatchSnapshot();
    });
});
