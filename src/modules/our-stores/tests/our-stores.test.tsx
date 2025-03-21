/*!
 * Copyright (c) Microsoft Corporation.
 * All rights reserved. See LICENSE in the project root for license information.
 */

import { buildMockModuleProps } from '@msdyn365-commerce/core-internal';
/// <reference types="jest" />

import * as React from 'react';
import * as renderer from 'react-test-renderer';

import OurStores from '../our-stores';
import { IOurStoresData } from '../our-stores.data';
import { IOurStoresConfig, IOurStoresProps } from '../our-stores.props.autogenerated';

const mockData: IOurStoresData = {
    actionResponse: {
        text: 'Sample Response Data'
    }
};

const mockConfig: IOurStoresConfig = {
    showText: 'our-stores'
};

const mockActions = {};

describe('OurStores', () => {
    let moduleProps: IOurStoresProps<IOurStoresData>;
    beforeAll(() => {
        moduleProps = buildMockModuleProps(mockData, mockActions, mockConfig) as IOurStoresProps<IOurStoresData>;
    });
    it('renders correctly', () => {
        const component: renderer.ReactTestRenderer = renderer.create(<OurStores {...moduleProps} />);
        const tree: renderer.ReactTestRendererJSON | renderer.ReactTestRendererJSON[] | null = component.toJSON();
        expect(tree).toMatchSnapshot();
    });
});
