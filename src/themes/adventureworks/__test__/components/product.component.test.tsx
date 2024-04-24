/*!
 * Copyright (c) Microsoft Corporation.
 * All rights reserved. See LICENSE in the project root for license information.
 */

import { buildMockCoreContext, ICoreContext, IImageSettings } from '@msdyn365-commerce/core';
import { ProductSearchResult } from '@msdyn365-commerce/retail-proxy';
import { ITelemetryContent } from '@msdyn365-commerce-modules/utilities';
import { render } from 'enzyme';
import * as React from 'react';

import { ProductComponent } from '../../views/components/product.component';

const mockProduct: ProductSearchResult = {
    RecordId: 22565429819,
    ItemId: '81120',
    Name: 'Cotton Polo',
    Description: 'Casual shirts are made. Our custom fitting shirts are relaxed enough to be comfortable without looking baggy.',
    BasePrice: 59.99,
    Price: 59.99,
    TotalRatings: 182,
    AverageRating: 3.71428571428571,
    PrimaryImageUrl:
        'https://cms-ppe-imageresizer-mr.trafficmanager.net/cms/api/fabrikamsb/imageFileData/search?fileName=/Products%2F91032_000_001.png',
    AttributeValues: [
        {
            AttributeValueId: 0,
            KeyName: 'Color',
            Swatches: undefined
        }
    ]
};

const mockProductWithSwatch: ProductSearchResult = {
    AttributeValues: [
        {
            AttributeValueId: 0,
            KeyName: 'Color',
            Swatches: [
                {
                    IsDefault: false,
                    ProductImageUrls: [
                        'Products/92078 ^  ^ 10 ^ Brown ^ Regular_000_002.png',
                        'Products/92078 ^  ^ 10 ^ Brown ^ Regular_000_001.png'
                    ],
                    SwatchColorHexCode: '#964B01',
                    SwatchImageUrl: 'Color/Brown_000_001.jpeg',
                    SwatchValue: 'Brown'
                },
                {
                    IsDefault: false,
                    ProductImageUrls: [
                        'Products/92078 ^  ^ 10 ^ Black ^ Regular_000_002.png',
                        'Products/92078 ^  ^ 10 ^ Black ^ Regular_000_001.png'
                    ],
                    SwatchColorHexCode: '#000000',
                    SwatchImageUrl: 'Color/Black_000_001.jpeg',
                    SwatchValue: undefined
                }
            ]
        }
    ],
    RecordId: 22565429819,
    ItemId: '81120',
    Name: 'Cotton Polo',
    Description: 'Our custom fitting shirts are relaxed enough to be comfortable without looking baggy.',
    BasePrice: 59.99,
    Price: 59.99,
    TotalRatings: 182,
    AverageRating: 3.71428571428571,
    PrimaryImageUrl:
        'https://cms-ppe-imageresizer-mr.trafficmanager.net/cms/api/fabrikamsb/imageFileData/search?fileName=/Products%2F91032_000_001.png'
};

const mockProductWithoutImage: ProductSearchResult = {
    RecordId: 22565429819,
    ItemId: '81120',
    Name: 'Cotton Polo',
    Description: 'Casual shirts are made. Our custom fitting shirts are relaxed enough to be comfortable without looking baggy.',
    BasePrice: 59.99,
    Price: 59.99,
    TotalRatings: 182,
    AverageRating: 3.71428571428571
};

const mockProductWithoutName: ProductSearchResult = {
    RecordId: 22565429819,
    ItemId: '81120',
    Name: '',
    Description: 'Casual shirts are made. Our custom fitting shirts are relaxed enough to be comfortable without looking baggy.',
    BasePrice: 59.99,
    Price: 59.99,
    TotalRatings: 182,
    AverageRating: 3.71428571428571,
    PrimaryImageUrl:
        'https://cms-ppe-imageresizer-mr.trafficmanager.net/cms/api/fabrikamsb/imageFileData/search?fileName=/Products%2F91032_000_001.png'
};

const mockProductWithoutRating: ProductSearchResult = {
    RecordId: 22565429819,
    ItemId: '81120',
    Name: undefined,
    Description: 'Casual shirts are made. Our custom fitting shirts are relaxed enough to be comfortable without looking baggy.',
    BasePrice: 59.99,
    Price: 59.99,
    PrimaryImageUrl:
        'https://cms-ppe-imageresizer-mr.trafficmanager.net/cms/api/fabrikamsb/imageFileData/search?fileName=/Products%2F91032_000_001.png'
};

const defaultImageSettings: IImageSettings = {
    viewports: {
        xs: { q: 'w=315&h=315&m=6', w: 0, h: 0 },
        lg: { q: 'w=315&h=315&m=6', w: 0, h: 0 }
    },
    lazyload: true
};

describe('Product component renders correctly', () => {
    const mockCoreContext = buildMockCoreContext({
        app: {
            config: {
                hideRating: false,
                unitOfMeasureDisplayType: 'buyboxAndBrowse',
                dimensionToPreSelectInProductCard: 'none',
                enableStockCheck: true
            }
        }
    }) as ICoreContext;
    mockCoreContext.request.apiSettings.baseUrl = 'https://comme2e-tie-ring1f9397e098fb7bd4fret.cloud.retail.test.dynamics.com/';
    mockCoreContext.request.apiSettings.baseImageUrl =
        'https://cms-ppe-imageresizer-mr.trafficmanager.net/cms/api/gfhwnkhdlh/imageFileData/search?fileName=/';
    const telemetryContent = {
        pageName: 'Homepage',
        moduleName: 'Product Collection',
        telemetry: mockCoreContext.telemetry
    } as ITelemetryContent;
    const quickViewLabel = 'Quick View';

    const mockCoreContextWithSwatchConfig = buildMockCoreContext({
        app: {
            config: {
                hideRating: false,
                dimensionsInProductCard: ['color', 'size'],
                dimensionsAsSwatchType: ['color', 'size'],
                dimensionToPreSelectInProductCard: 'color'
            }
        }
    }) as ICoreContext;
    mockCoreContextWithSwatchConfig.request.apiSettings.baseUrl =
        'https://comme2e-tie-ring1f9397e098fb7bd4fret.cloud.retail.test.dynamics.com/';
    mockCoreContextWithSwatchConfig.request.apiSettings.baseImageUrl =
        'https://cms-ppe-imageresizer-mr.trafficmanager.net/cms/api/gfhwnkhdlh/imageFileData/search?fileName=/';

    const dimensionAvailabilities = [
        {
            value: '',
            isDisabled: true,
            masterProductId: 1
        }
    ];

    it('renders product correctly', () => {
        const wrapper = render(
            <ProductComponent
                dimensionAvailabilities={dimensionAvailabilities}
                context={mockCoreContext}
                imageSettings={defaultImageSettings}
                id='test'
                typeName='test'
                data={{ product: mockProduct }}
                telemetryContent={telemetryContent}
                quickViewButton={<button>{quickViewLabel}</button>}
            />
        );
        expect(wrapper).toMatchSnapshot();
    });

    it('returns null for a null product', () => {
        const wrapper = render(
            <ProductComponent
                context={mockCoreContext}
                imageSettings={defaultImageSettings}
                id='test'
                typeName='test'
                data={{}}
                telemetryContent={telemetryContent}
                quickViewButton={<button>{quickViewLabel}</button>}
            />
        );
        expect(wrapper.find('a')).toHaveLength(0);
    });

    it('Image is not displayed for invalid images', () => {
        const wrapper = render(
            <ProductComponent
                inventoryLabel=''
                context={mockCoreContext}
                imageSettings={defaultImageSettings}
                id='test'
                typeName='test'
                data={{ product: mockProductWithoutImage }}
                telemetryContent={telemetryContent}
                quickViewButton={<button>{quickViewLabel}</button>}
            />
        );
        expect(wrapper).toMatchSnapshot();
    });

    it('Product without a name', () => {
        const wrapper = render(
            <ProductComponent
                inventoryLabel='true'
                context={mockCoreContext}
                imageSettings={defaultImageSettings}
                id='test'
                typeName='test'
                data={{ product: mockProductWithoutName }}
                telemetryContent={telemetryContent}
                quickViewButton={<button>{quickViewLabel}</button>}
            />
        );
        expect(wrapper).toMatchSnapshot();
    });

    it('Product without image alttext', () => {
        const wrapper = render(
            <ProductComponent
                context={mockCoreContext}
                imageSettings={defaultImageSettings}
                id='test'
                typeName='test'
                data={{ product: mockProductWithoutName }}
                telemetryContent={telemetryContent}
                quickViewButton={<button>{quickViewLabel}</button>}
            />
        );
        expect(wrapper).toMatchSnapshot();
    });

    it('Product without rating information', () => {
        const wrapper = render(
            <ProductComponent
                context={mockCoreContext}
                imageSettings={defaultImageSettings}
                id='test'
                typeName='test'
                data={{ product: mockProductWithoutRating }}
                telemetryContent={telemetryContent}
                quickViewButton={<button>{quickViewLabel}</button>}
            />
        );
        expect(wrapper).toMatchSnapshot();
    });

    it('Product with swatch information', () => {
        const wrapper = render(
            <ProductComponent
                context={mockCoreContext}
                imageSettings={defaultImageSettings}
                id='test'
                typeName='test'
                data={{ product: mockProductWithSwatch }}
                telemetryContent={telemetryContent}
            />
        );
        expect(wrapper).toMatchSnapshot();
    });

    it('Product with swatch inventory information', () => {
        const wrapper = render(
            <ProductComponent
                context={mockCoreContextWithSwatchConfig}
                imageSettings={defaultImageSettings}
                id='test'
                typeName='test'
                data={{ product: mockProductWithSwatch }}
                telemetryContent={telemetryContent}
                ratingAriaLabel='test'
                ratingCountAriaLabel='test'
            />
        );
        expect(wrapper).toMatchSnapshot();
    });
});
