/*!
 * Copyright (c) Microsoft Corporation.
 * All rights reserved. See LICENSE in the project root for license information.
 */

import { buildMockModuleProps } from '@msdyn365-commerce/core';
import { IFooterItemConfig, IFooterItemProps, IFooterViewProps } from '@msdyn365-commerce-modules/footer';
import { render } from 'enzyme';
import * as React from 'react';

import FooterItemView from '../views/footer-item.view';

describe('footer item view tests', () => {
    it('renders correctly', () => {
        const moduleConfig: IFooterItemConfig = {
            className: 'class-mock'
        };

        // @ts-expect-error
        const moduleProps: IFooterItemProps<IFooterItemConfig> = buildMockModuleProps({}, {}, moduleConfig);
        const viewprops: IFooterViewProps = {
            ...moduleProps,
            heading: '{heading}',
            text: '{text}',
            image: '{image}',
            linkText: 'link text',
            FooterItem: { moduleProps, className: 'module-class-FooterItem' },
            Link: { className: 'mock-class-Link' },
            HeadingContainer: { className: 'mock-class-HeadingContainer' },
            ItemContainer: { className: 'mock-class-ItemContainer' },
            EditableLink: '{link}'
        };

        const view = render(<FooterItemView {...viewprops} />);
        expect(view).toMatchSnapshot();
    });

    it('renders correctly without heading', () => {
        const moduleConfig: IFooterItemConfig = {
            className: 'class-mock'
        };

        // @ts-expect-error
        const moduleProps: IFooterItemProps<IFooterItemConfig> = buildMockModuleProps({}, {}, moduleConfig);
        const viewprops: IFooterViewProps = {
            ...moduleProps,
            heading: '',
            text: '{text}',
            image: '{image}',
            linkText: 'link text',
            FooterItem: { moduleProps, className: 'module-class-FooterItem' },
            Link: { className: 'mock-class-Link' },
            HeadingContainer: { className: 'mock-class-HeadingContainer' },
            ItemContainer: { className: 'mock-class-ItemContainer' },
            EditableLink: '{link}'
        };

        const view = render(<FooterItemView {...viewprops} />);
        expect(view).toMatchSnapshot();
    });

    it('renders correctly without heading & image', () => {
        const moduleConfig: IFooterItemConfig = {
            className: 'class-mock'
        };

        // @ts-expect-error
        const moduleProps: IFooterItemProps<IFooterItemConfig> = buildMockModuleProps({}, {}, moduleConfig);
        const viewprops: IFooterViewProps = {
            ...moduleProps,
            heading: '',
            text: '{text}',
            image: '',
            linkText: 'link text',
            FooterItem: { moduleProps, className: 'module-class-FooterItem' },
            Link: { className: 'mock-class-Link' },
            HeadingContainer: { className: 'mock-class-HeadingContainer' },
            ItemContainer: { className: 'mock-class-ItemContainer' },
            EditableLink: '{link}'
        };

        const view = render(<FooterItemView {...viewprops} />);
        expect(view).toMatchSnapshot();
    });
});
