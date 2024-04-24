/*!
 * Copyright (c) Microsoft Corporation.
 * All rights reserved. See LICENSE in the project root for license information.
 */

import * as React from 'react';

import { ProductSuggestionsComponent } from '../../views/components/search.productsuggest';

const productSuggest = { className: 'node-class-AutoSuggest' };
const ulProduct = { className: 'node-class-AutoSuggest' };
const productSuggestions = {
    title: <div />,
    items: [
        {
            text: 'test',
            price: 'test',
            thumbnail: 'test',
            LiProduct: { className: 'node-class-LiProduct' },
            AProduct: { className: 'node-class-AProduct' },
            id: 'id'
        },
        {
            text: 'test1',
            price: 'test1',
            thumbnail: 'test1',
            LiProduct: { className: 'node-class-LiProduct2' },
            AProduct: { className: 'node-class-AProduct2' },
            id: 'id'
        }
    ]
};

describe('Search unit tests - Product Suggestions Component', () => {
    it('Search unit tests - Product Suggestions Component with props data', () => {
        const mockProps = {
            config: { noSearchResultImage: 'test' },
            resources: { productSuggestionHeading: '123' }
        };

        // @ts-expect-error partial mock
        const component = ProductSuggestionsComponent(productSuggest, ulProduct, mockProps, productSuggestions);
        expect(component).toMatchSnapshot();
    });

    it('Search unit tests - Product Suggestions Component with productSuggestionHeading as undefined', () => {
        const mockProps = {
            config: { noSearchResultImage: 'test' },
            resources: { productSuggestionHeading: undefined }
        };

        // @ts-expect-error partial mock
        const component = ProductSuggestionsComponent(productSuggest, ulProduct, mockProps, productSuggestions);
        expect(component).toMatchSnapshot();
    });

    it('Search unit tests - Product Suggestions Component with productSuggestions as undefined', () => {
        const mockProps = {
            config: { noSearchResultImage: 'test' },
            resources: { productSuggestionHeading: undefined }
        };

        // @ts-expect-error partial mock
        const component = ProductSuggestionsComponent(productSuggest, ulProduct, mockProps, undefined);
        expect(component).toMatchSnapshot();
    });

    it('Search unit tests - Product Suggestions Component with productSuggestions id as undefined', () => {
        const mockProps = {
            config: { noSearchResultImage: 'test' },
            resources: { productSuggestionHeading: undefined }
        };
        const productSuggestions2 = {
            title: <div />,
            items: [
                {
                    text: 'test',
                    price: 'test',
                    thumbnail: 'test',
                    LiProduct: { className: 'node-class-LiProduct' },
                    AProduct: { className: 'node-class-AProduct' },
                    id: undefined
                },
                {
                    text: 'test1',
                    price: 'test1',
                    thumbnail: 'test1',
                    LiProduct: { className: 'node-class-LiProduct2' },
                    AProduct: { className: 'node-class-AProduct2' },
                    id: undefined
                }
            ]
        };

        // @ts-expect-error partial mock
        const component = ProductSuggestionsComponent(productSuggest, ulProduct, mockProps, productSuggestions2);
        expect(component).toMatchSnapshot();
    });

    it('Search unit tests - Product Suggestions Component with request grid settings object', () => {
        const mockProps = {
            config: {
                noSearchResultImage: {
                    src: '123'
                }
            },
            resources: { productSuggestionHeading: undefined },
            context: {
                request: {
                    gridSettings: {
                        xs: {
                            w: 1,
                            h: 2
                        },
                        sm: {
                            w: 1,
                            h: 2
                        },
                        md: {
                            w: 1,
                            h: 2
                        },
                        lg: {
                            w: 1,
                            h: 2
                        },
                        xl: {
                            w: 1,
                            h: 2
                        }
                    }
                }
            }
        };
        const productSuggestions2 = {
            title: <div />,
            items: [
                {
                    text: 'test',
                    price: 'test',
                    thumbnail: 'test',
                    LiProduct: { className: 'node-class-LiProduct' },
                    AProduct: { className: 'node-class-AProduct' },
                    id: undefined
                },
                {
                    text: 'test1',
                    price: 'test1',
                    thumbnail: 'test1',
                    LiProduct: { className: 'node-class-LiProduct2' },
                    AProduct: { className: 'node-class-AProduct2' },
                    id: undefined
                }
            ]
        };

        // @ts-expect-error partial mock
        const component = ProductSuggestionsComponent(productSuggest, ulProduct, mockProps, productSuggestions2);
        expect(component).toMatchSnapshot();
    });

    it('Search unit tests - Product Suggestions Component with noSearchResultImage src data', () => {
        const mockProps = {
            config: {
                noSearchResultImage: {
                    src: '123'
                }
            },
            resources: { productSuggestionHeading: undefined },
            context: {
                request: {
                    gridSettings: {
                        xs: {
                            w: 1,
                            h: 2
                        },
                        sm: {
                            w: 1,
                            h: 2
                        },
                        md: {
                            w: 1,
                            h: 2
                        },
                        lg: {
                            w: 1,
                            h: 2
                        },
                        xl: {
                            w: 1,
                            h: 2
                        }
                    }
                }
            }
        };

        // @ts-expect-error partial mock
        const component = ProductSuggestionsComponent(productSuggest, ulProduct, mockProps, productSuggestions);
        expect(component).toMatchSnapshot();
    });
});
