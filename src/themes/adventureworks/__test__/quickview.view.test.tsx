/*!
 * Copyright (c) Microsoft Corporation.
 * All rights reserved. See LICENSE in the project root for license information.
 */

import { AddToWishlistComponent, IWishlistActionErrorResult } from '@msdyn365-commerce/components';
import { buildMockModuleProps } from '@msdyn365-commerce/core';
import { AsyncResult, CommerceList, Customer, FeatureState, SimpleProduct } from '@msdyn365-commerce/retail-proxy';
import { IQuickviewData, IQuickviewViewProps } from '@msdyn365-commerce-modules/buybox';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from '@msdyn365-commerce-modules/utilities';
import { render, shallow } from 'enzyme';
import * as React from 'react';

import { QuickViewFunctionalComponent } from '../views/quickview.view';

interface IQuickViewTestResources {
    quickViewbuttonText: string;
    quickViewPictureText1: string;
    quickViewPictureText2: string;
    quickViewPictureText3: string;
    quickViewTitle: string;
    quickViewDescription: string;
    quickViewPrice: string;
    quickViewInventoryLevelLabel: string;
    quickViewAddtoCartErrors: string;
    quickViewAddtoCartButton: string;
    quickViewAddtoWishlistButton: string;
    quickViewAddtoWishlistErrors: string;
    quickViewQuantityHeading: string;
    quickViewQuantityErrors: string;
    quickViewQuantityInput: string;
    quickViewKeyInPriceHeading: string;
    quickViewDropdownHeading1: string;
    quickViewDropdownErrors1: string;
    quickViewDropdownSelect1: string;
    quickViewDropdownHeading2: string;
    quickViewDropdownErrors2: string;
    quickViewDropdownSelect2: string;
    quickViewRating: string;
    priceText: string;
    skuText: string;
}

const testResources: IQuickViewTestResources = {
    quickViewbuttonText: 'Quick View',
    quickViewPictureText1: 'Picture 1',
    quickViewPictureText2: 'Picture 2',
    quickViewPictureText3: 'Picture 3',
    quickViewTitle: 'Title',
    quickViewDescription: 'Description',
    quickViewPrice: 'Price',
    quickViewInventoryLevelLabel: 'Inventory Level Label',
    quickViewAddtoCartErrors: 'Add to cart errors',
    quickViewAddtoCartButton: 'Add to cart button',
    quickViewAddtoWishlistButton: 'Add to wishlist button',
    quickViewAddtoWishlistErrors: 'Add to wishlist errors',
    quickViewQuantityHeading: 'Heading',
    quickViewQuantityErrors: 'Errors',
    quickViewQuantityInput: 'Input',
    quickViewKeyInPriceHeading: 'Price',
    quickViewDropdownHeading1: 'Heading 1',
    quickViewDropdownErrors1: 'Errors 1',
    quickViewDropdownSelect1: 'Select 1',
    quickViewDropdownHeading2: 'Heading 2',
    quickViewDropdownErrors2: 'Errors 2',
    quickViewDropdownSelect2: 'Select 2',
    quickViewRating: 'Rating',
    priceText: 'Price',
    skuText: 'SKU:'
};

const mockState = {
    productPrice: { ItemId: '123' }
};

const mockStateWithoutproductPrice = {};

const mockProductDimensions = [
    {
        DimensionTypeValue: 3,
        DimensionValues: [
            {
                RecordId: 22565421223,
                Value: '32',
                ExtensionProperties: []
            },
            {
                RecordId: 22565421225,
                Value: '36',
                ExtensionProperties: []
            },
            {
                RecordId: 22565421226,
                Value: '38',
                ExtensionProperties: []
            },
            {
                RecordId: 22565421227,
                Value: '40',
                ExtensionProperties: []
            },
            {
                RecordId: 22565421228,
                Value: '42',
                ExtensionProperties: []
            },
            {
                RecordId: 22565421229,
                Value: '44',
                ExtensionProperties: []
            },
            {
                RecordId: 22565421230,
                Value: '46',
                ExtensionProperties: []
            },
            {
                RecordId: 22565421231,
                Value: '48',
                ExtensionProperties: []
            }
        ]
    },
    {
        DimensionTypeValue: 1,
        DimensionValues: [
            {
                RecordId: 22565421201,
                Value: 'Light Blue',
                ExtensionProperties: []
            }
        ]
    },
    {
        DimensionTypeValue: 4,
        DimensionValues: [
            {
                RecordId: 5637144584,
                Value: 'Big',
                ExtensionProperties: []
            },
            {
                RecordId: 5637144583,
                Value: 'Regular',
                ExtensionProperties: []
            }
        ]
    },
    {
        DimensionTypeValue: 2,
        DimensionValues: [
            {
                RecordId: 56371445841,
                ExtensionProperties: []
            },
            {
                RecordId: 56371445831,
                ExtensionProperties: []
            }
        ]
    },
    {
        DimensionTypeValue: 5
    }
];
const mockSimpleProduct: SimpleProduct = {
    Name: 'Crew neck server',
    RecordId: 123,
    MasterProductId: 123,
    BasePrice: 25,
    Price: 25,
    AdjustedPrice: 25,
    ProductTypeValue: 1,
    PrimaryImageUrl: 'Products/93048_000_001.png',
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

const mockProductDetails = {
    productDimensions: mockProductDimensions,
    product: mockSimpleProduct
};

const mockProductDetailsWithoutProduct = {
    productDimensions: mockProductDimensions,
    product: null
};

const productId: number = 123456;
const mockWishlist = { Id: 333, CommerceListLines: [{ ProductId: productId }] };
const mockFeatureState = [
    { Name: 'Dynamics.AX.Application.RetailDefaultOrderQuantityLimitsFeature', IsEnabled: true },
    { Name: 'Dynamics.AX.Application.EcommerceQuantityLimitConfigurationsFeature', IsEnabled: true }
];

// @ts-expect-error
const mockData: IQuickviewData = {
    wishlists: ({
        status: 'SUCCESS',
        result: mockWishlist
    } as unknown) as AsyncResult<CommerceList[]>,
    customerInformation: ({
        status: 'SUCCESS',
        result: { AccountNumber: 99999 }
    } as unknown) as AsyncResult<Customer>,
    featureState: AsyncResult.resolve(mockFeatureState as FeatureState[])
};

const mockSlots = {
    mediaGallery: [],
    textBlocks: [],
    productComparisonButton: []
};

describe('quickView unit tests - View', () => {
    it('renders correctly', () => {
        const moduleProps: IQuickviewViewProps = { ...(buildMockModuleProps({}, {}) as IQuickviewViewProps), slots: mockSlots };
        const mockProps = {
            ...moduleProps,
            quickView: {
                moduleProps,
                className: 'ms-quick-View',
                tag: 'div'
            },
            resources: testResources,
            quickViewButton: (
                <Button title='Quick View button' className='ms-quick-View__button' aria-label='Quick View'>
                    {testResources.quickViewbuttonText}
                </Button>
            ),
            ProductInfoContainerProps: {
                className: 'ms-quickView__content'
            },
            MediaGalleryContainerProps: {
                className: 'ms-quickView__media-gallery',
                CarouselProps: { moduleProps, className: 'module-class-carousel' },
                Thumbnails: {
                    ThumbnailsContainerProps: { className: 'node-class-ThumbnailsContainer' },
                    SingleSlideCarouselComponentProps: { className: 'node-class-SingleSlideCarouselComponent' },
                    items: [
                        {
                            ThumbnailItemContainerProps: { className: 'node-class-ThumbnailItemContainer' },
                            Picture: <span>{testResources.quickViewPictureText1}</span>
                        },
                        {
                            ThumbnailItemContainerProps: { className: 'node-class-ThumbnailItemContainer' },
                            Picture: <span>{testResources.quickViewPictureText2}</span>
                        },
                        {
                            ThumbnailItemContainerProps: { className: 'node-class-ThumbnailItemContainer' },
                            Picture: <span>{testResources.quickViewPictureText3}</span>
                        }
                    ]
                }
            },
            callbacks: {
                updateQuantity: jest.fn(),
                updateKeyInPrice: jest.fn(),
                updateErrorState: jest.fn(),
                initializeDimension: jest.fn(),
                dimensionSelectedAsync: jest.fn(),
                updateSelectedProduct: jest.fn(),
                getDropdownName: jest.fn(),
                changeModalOpen: jest.fn(),
                changeUpdatingDimension: jest.fn()
            },
            title: <div>{testResources.quickViewTitle}</div>,
            description: <div>{testResources.quickViewDescription}</div>,
            price: <div>{testResources.quickViewPrice}</div>,
            inventoryLevelLabel: <div>{testResources.quickViewInventoryLevelLabel}</div>,
            addToCart: {
                ContainerProps: {
                    className: 'ms-quick-View__add-to-cart-container'
                },
                errorBlock: <div>{testResources.quickViewAddtoCartErrors}</div>,
                button: <div>{testResources.quickViewAddtoCartButton}</div>
            },
            addToWishlist: {
                ContainerProps: {
                    className: 'ms-quick-View__add-to-wishlist-container'
                },
                errorBlock: <div>{testResources.quickViewAddtoWishlistErrors}</div>,
                button: <div>{testResources.quickViewAddtoWishlistButton}</div>
            },
            rating: <div>{testResources.quickViewRating}</div>,
            quantity: {
                ContainerProps: {
                    className: 'ms-quick-View__quantity'
                },
                LabelContainerProps: {
                    className: 'ms-quick-View__quantity-label'
                },
                heading: <div>{testResources.quickViewQuantityHeading}</div>,
                errors: <div>{testResources.quickViewQuantityErrors}</div>,
                input: <div>{testResources.quickViewQuantityInput}</div>
            },
            keyInPrice: {
                ContainerProps: {
                    className: 'ms-quickView__key_in_price'
                },
                LabelContainerProps: {
                    tag: 'label',
                    className: 'ms-quickView__key_in_price-label',
                    htmlFor: 'ms-quickView__key_in_price'
                },
                heading: <div className='ms-quickView__key_in_price-label-heading'>{testResources.quickViewKeyInPriceHeading}</div>,
                input: <input type='number' className='ms-quickView__key_in_price_custom-amount__input' aria-label='abc' />
            },
            configure: {
                ContainerProps: {
                    className: 'ms-quick-View__configure'
                },

                dropdowns: [
                    {
                        ContainerProps: { className: 'ms-quick-View__configure-dropdown' },
                        LabelContainerProps: { className: 'ms-quick-View__configure-dropdown-label' },
                        heading: <div>{testResources.quickViewDropdownHeading1}</div>,
                        errors: <div>{testResources.quickViewDropdownErrors1}</div>,
                        select: <div>{testResources.quickViewDropdownSelect1}</div>
                    },
                    {
                        ContainerProps: { className: 'ms-quick-View__configure-dropdown' },
                        LabelContainerProps: { className: 'ms-quick-View__configure-dropdown-label' },
                        heading: <div>{testResources.quickViewDropdownHeading2}</div>,
                        errors: <div>{testResources.quickViewDropdownErrors2}</div>,
                        select: <div>{testResources.quickViewDropdownSelect2}</div>
                    }
                ]
            }
        };

        // @ts-expect-error
        const component = render(<QuickViewFunctionalComponent {...mockProps} />);
        expect(component).toMatchSnapshot();
    });

    it('renders correctly when modal open', () => {
        const moduleProps: IQuickviewViewProps = buildMockModuleProps({}, {}) as IQuickviewViewProps;
        const mockProps = {
            ...moduleProps,
            isModalOpen: true,
            quickView: {
                moduleProps,
                className: 'ms-quick-View',
                tag: 'div'
            },
            resources: testResources,
            slots: mockSlots,
            state: mockState,
            productDetails: mockProductDetails,
            data: mockData,
            quickViewButton: (
                <Button title='Quick View button' className='ms-quick-View__button' aria-label='Quick View'>
                    {testResources.quickViewbuttonText}
                </Button>
            ),
            ModalContainer: {
                moduleProps,
                tag: Modal,
                className: 'ms-quickView__dialog'
            },
            ModalHeaderContainer: {
                tag: ModalHeader,
                className: 'ms-quickView__header'
            },
            ModalFooterContainer: {
                tag: ModalFooter,
                className: 'ms-quickView__footer'
            },
            ModalHeaderContent: '',
            ModalBodyContainer: {
                tag: ModalBody,
                className: 'ms-quickView__body'
            },
            ProductInfoContainerProps: {
                className: 'ms-quickView__content'
            },
            MediaGalleryContainerProps: {
                className: 'ms-quickView__media-gallery',
                CarouselProps: { moduleProps, className: 'module-class-carousel' },
                Thumbnails: {
                    ThumbnailsContainerProps: { className: 'node-class-ThumbnailsContainer' },
                    SingleSlideCarouselComponentProps: { className: 'node-class-SingleSlideCarouselComponent' },
                    items: [
                        {
                            ThumbnailItemContainerProps: { className: 'node-class-ThumbnailItemContainer' },
                            Picture: <span>{testResources.quickViewPictureText1}</span>
                        },
                        {
                            ThumbnailItemContainerProps: { className: 'node-class-ThumbnailItemContainer' },
                            Picture: <span>{testResources.quickViewPictureText2}</span>
                        },
                        {
                            ThumbnailItemContainerProps: { className: 'node-class-ThumbnailItemContainer' },
                            Picture: <span>{testResources.quickViewPictureText3}</span>
                        }
                    ]
                }
            },
            callbacks: {
                updateQuantity: jest.fn(),
                updateKeyInPrice: jest.fn(),
                updateErrorState: jest.fn(),
                initializeDimension: jest.fn(),
                dimensionSelectedAsync: jest.fn(),
                updateSelectedProduct: jest.fn(),
                getDropdownName: jest.fn(),
                changeModalOpen: jest.fn(),
                changeUpdatingDimension: jest.fn()
            },
            title: <div>{testResources.quickViewTitle}</div>,
            description: <div>{testResources.quickViewDescription}</div>,
            price: <div>{testResources.quickViewPrice}</div>,
            inventoryLevelLabel: <div>{testResources.quickViewInventoryLevelLabel}</div>,
            addToCart: {
                ContainerProps: {
                    className: 'ms-quick-View__add-to-cart-container'
                },
                errorBlock: <div>{testResources.quickViewAddtoCartErrors}</div>,
                button: <div>{testResources.quickViewAddtoCartButton}</div>
            },
            addToWishlist: {
                ContainerProps: {
                    className: 'ms-quick-View__add-to-wishlist-container'
                },
                errorBlock: <div>{testResources.quickViewAddtoWishlistErrors}</div>,
                button: <div>{testResources.quickViewAddtoWishlistButton}</div>
            },
            rating: <div>{testResources.quickViewRating}</div>,
            quantity: {
                ContainerProps: {
                    className: 'ms-quick-View__quantity'
                },
                LabelContainerProps: {
                    className: 'ms-quick-View__quantity-label'
                },
                heading: <div>{testResources.quickViewQuantityHeading}</div>,
                errors: <div>{testResources.quickViewQuantityErrors}</div>,
                input: <div>{testResources.quickViewQuantityInput}</div>
            },
            keyInPrice: {
                ContainerProps: {
                    className: 'ms-quickView__key_in_price'
                },
                LabelContainerProps: {
                    tag: 'label',
                    className: 'ms-quickView__key_in_price-label',
                    htmlFor: 'ms-quickView__key_in_price'
                },
                heading: <div className='ms-quickView__key_in_price-label-heading'>{testResources.quickViewKeyInPriceHeading}</div>,
                input: <input type='number' className='ms-quickView__key_in_price_custom-amount__input' aria-label='abc' />
            },
            configure: {
                ContainerProps: {
                    className: 'ms-quick-View__configure'
                },

                dropdowns: [
                    {
                        ContainerProps: { className: 'ms-quick-View__configure-dropdown' },
                        LabelContainerProps: { className: 'ms-quick-View__configure-dropdown-label' },
                        heading: <div>{testResources.quickViewDropdownHeading1}</div>,
                        errors: <div>{testResources.quickViewDropdownErrors1}</div>,
                        select: <div>{testResources.quickViewDropdownSelect1}</div>
                    },
                    {
                        ContainerProps: { className: 'ms-quick-View__configure-dropdown' },
                        LabelContainerProps: { className: 'ms-quick-View__configure-dropdown-label' },
                        heading: <div>{testResources.quickViewDropdownHeading2}</div>,
                        errors: <div>{testResources.quickViewDropdownErrors2}</div>,
                        select: <div>{testResources.quickViewDropdownSelect2}</div>
                    }
                ]
            }
        };

        // @ts-expect-error
        const wrapper = shallow(<QuickViewFunctionalComponent {...mockProps} />);

        const wishlistComponent = wrapper.find(AddToWishlistComponent);

        try {
            // @ts-expect-error
            wishlistComponent
                .at(0)
                .props()
                .onError({} as IWishlistActionErrorResult);
            // eslint-disable-next-line no-empty
        } catch {}

        // @ts-expect-error
        const component = render(<QuickViewFunctionalComponent {...mockProps} />);
        expect(component).toMatchSnapshot();
    });

    it('renders correctly when modal open -- No product', () => {
        const moduleProps: IQuickviewViewProps = buildMockModuleProps({}, {}) as IQuickviewViewProps;
        const mockProps = {
            ...moduleProps,
            isModalOpen: true,
            quickView: {
                moduleProps,
                className: 'ms-quick-View',
                tag: 'div'
            },
            resources: testResources,
            slots: mockSlots,
            state: mockStateWithoutproductPrice,
            productDetails: mockProductDetailsWithoutProduct,
            data: mockData,
            quickViewButton: (
                <Button title='Quick View button' className='ms-quick-View__button' aria-label='Quick View'>
                    {testResources.quickViewbuttonText}
                </Button>
            ),
            ModalContainer: {
                moduleProps,
                tag: Modal,
                className: 'ms-quickView__dialog'
            },
            ModalHeaderContainer: {
                tag: ModalHeader,
                className: 'ms-quickView__header'
            },
            ModalFooterContainer: {
                tag: ModalFooter,
                className: 'ms-quickView__footer'
            },
            ModalHeaderContent: '',
            ModalBodyContainer: {
                tag: ModalBody,
                className: 'ms-quickView__body'
            },
            ProductInfoContainerProps: {
                className: 'ms-quickView__content'
            },
            MediaGalleryContainerProps: {
                className: 'ms-quickView__media-gallery',
                CarouselProps: { moduleProps, className: 'module-class-carousel' },
                Thumbnails: {
                    ThumbnailsContainerProps: { className: 'node-class-ThumbnailsContainer' },
                    SingleSlideCarouselComponentProps: { className: 'node-class-SingleSlideCarouselComponent' },
                    items: [
                        {
                            ThumbnailItemContainerProps: { className: 'node-class-ThumbnailItemContainer' },
                            Picture: <span>{testResources.quickViewPictureText1}</span>
                        },
                        {
                            ThumbnailItemContainerProps: { className: 'node-class-ThumbnailItemContainer' },
                            Picture: <span>{testResources.quickViewPictureText2}</span>
                        },
                        {
                            ThumbnailItemContainerProps: { className: 'node-class-ThumbnailItemContainer' },
                            Picture: <span>{testResources.quickViewPictureText3}</span>
                        }
                    ]
                }
            },
            callbacks: {
                updateQuantity: jest.fn(),
                updateKeyInPrice: jest.fn(),
                updateErrorState: jest.fn(),
                initializeDimension: jest.fn(),
                dimensionSelectedAsync: jest.fn(),
                updateSelectedProduct: jest.fn(),
                getDropdownName: jest.fn(),
                changeModalOpen: jest.fn(),
                changeUpdatingDimension: jest.fn()
            },
            title: <div>{testResources.quickViewTitle}</div>,
            description: <div>{testResources.quickViewDescription}</div>,
            price: <div>{testResources.quickViewPrice}</div>,
            inventoryLevelLabel: <div>{testResources.quickViewInventoryLevelLabel}</div>,
            addToCart: {
                ContainerProps: {
                    className: 'ms-quick-View__add-to-cart-container'
                },
                errorBlock: <div>{testResources.quickViewAddtoCartErrors}</div>,
                button: <div>{testResources.quickViewAddtoCartButton}</div>
            },
            addToWishlist: {
                ContainerProps: {
                    className: 'ms-quick-View__add-to-wishlist-container'
                },
                errorBlock: <div>{testResources.quickViewAddtoWishlistErrors}</div>,
                button: <div>{testResources.quickViewAddtoWishlistButton}</div>
            },
            rating: <div>{testResources.quickViewRating}</div>,
            quantity: {
                ContainerProps: {
                    className: 'ms-quick-View__quantity'
                },
                LabelContainerProps: {
                    className: 'ms-quick-View__quantity-label'
                },
                heading: <div>{testResources.quickViewQuantityHeading}</div>,
                errors: <div>{testResources.quickViewQuantityErrors}</div>,
                input: <div>{testResources.quickViewQuantityInput}</div>
            },
            keyInPrice: {
                ContainerProps: {
                    className: 'ms-quickView__key_in_price'
                },
                LabelContainerProps: {
                    tag: 'label',
                    className: 'ms-quickView__key_in_price-label',
                    htmlFor: 'ms-quickView__key_in_price'
                },
                heading: <div className='ms-quickView__key_in_price-label-heading'>{testResources.quickViewKeyInPriceHeading}</div>,
                input: <input type='number' className='ms-quickView__key_in_price_custom-amount__input' aria-label='abc' />
            },
            configure: {
                ContainerProps: {
                    className: 'ms-quick-View__configure'
                },

                dropdowns: [
                    {
                        ContainerProps: { className: 'ms-quick-View__configure-dropdown' },
                        LabelContainerProps: { className: 'ms-quick-View__configure-dropdown-label' },
                        heading: <div>{testResources.quickViewDropdownHeading1}</div>,
                        errors: <div>{testResources.quickViewDropdownErrors1}</div>,
                        select: <div>{testResources.quickViewDropdownSelect1}</div>
                    },
                    {
                        ContainerProps: { className: 'ms-quick-View__configure-dropdown' },
                        LabelContainerProps: { className: 'ms-quick-View__configure-dropdown-label' },
                        heading: <div>{testResources.quickViewDropdownHeading2}</div>,
                        errors: <div>{testResources.quickViewDropdownErrors2}</div>,
                        select: <div>{testResources.quickViewDropdownSelect2}</div>
                    }
                ]
            }
        };

        // @ts-expect-error
        const component = render(<QuickViewFunctionalComponent {...mockProps} />);
        expect(component).toMatchSnapshot();
    });

    it('renders correctly when modal open -- loading', () => {
        const moduleProps: IQuickviewViewProps = buildMockModuleProps({}, {}) as IQuickviewViewProps;
        const mockProps = {
            ...moduleProps,
            isModalOpen: true,
            quickView: {
                moduleProps,
                className: 'ms-quick-View',
                tag: 'div'
            },
            quickViewButton: (
                <Button title='Quick View button' className='ms-quick-View__button' aria-label='Quick View'>
                    {testResources.quickViewbuttonText}
                </Button>
            ),
            title: <div>{testResources.quickViewTitle}</div>,
            loading: true,
            resources: testResources,
            slots: mockSlots,
            state: mockStateWithoutproductPrice,
            ModalContainer: {
                moduleProps,
                tag: Modal,
                className: 'ms-quickView__dialog'
            },
            ModalHeaderContainer: {
                tag: ModalHeader,
                className: 'ms-quickView__header'
            },
            ModalFooterContainer: {
                tag: ModalFooter,
                className: 'ms-quickView__footer'
            },
            ModalHeaderContent: '',
            ModalBodyContainer: {
                tag: ModalBody,
                className: 'ms-quickView__body'
            }
        };

        // @ts-expect-error
        const component = render(<QuickViewFunctionalComponent {...mockProps} />);
        expect(component).toMatchSnapshot();
    });
});
