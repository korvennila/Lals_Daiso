/*!
 * Copyright (c) Microsoft Corporation.
 * All rights reserved. See LICENSE in the project root for license information.
 */

import { buildMockModuleProps } from '@msdyn365-commerce/core';
import { ISearchData, ISearchProps } from '@msdyn365-commerce-modules/search';

import { MobileAutoSuggestEmptyComponent } from '../../views/components/search.mobile.empty';

const moduleProps: ISearchProps<ISearchData> = buildMockModuleProps({}, {}) as ISearchProps<ISearchData>;

describe('Search unit tests - mobile empty Component', () => {
    it('renders correctly with request grid settings', () => {
        const mockProps = {
            Search: { moduleProps, className: 'module-class-Search' },
            AutoSuggestAriaLabel: { className: 'node-class-AutoSuggestAriaLable' },
            AutoSuggestAriaLabelText: '',
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
            },
            searchText: 'test',
            config: {
                noSearchResultImage: {
                    src: '123'
                }
            },
            resources: {
                productSuggestionHeading: '123',
                emptyMobileSearchTextHeading: 'text',
                emptyMobileSearchText: 'text'
            }
        };

        // @ts-expect-error partial mock
        const component = MobileAutoSuggestEmptyComponent(mockProps);
        expect(component).toMatchSnapshot();
    });

    it('renders correctly with noSearchResultImage as undefined', () => {
        const mockProps = {
            Search: { moduleProps, className: 'module-class-Search' },
            AutoSuggestAriaLabel: { className: 'node-class-AutoSuggestAriaLable' },
            AutoSuggestAriaLabelText: '',
            searchText: 'test',
            config: { noSearchResultImage: undefined },
            resources: {
                productSuggestionHeading: '123',
                emptyMobileSearchTextHeading: 'text',
                emptyMobileSearchText: 'text'
            }
        };

        // @ts-expect-error partial mock
        const component = MobileAutoSuggestEmptyComponent(mockProps);
        expect(component).toMatchSnapshot();
    });
});
