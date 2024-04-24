/*!
 * Copyright (c) Microsoft Corporation.
 * All rights reserved. See LICENSE in the project root for license information.
 */

import { IFooterViewProps } from '@msdyn365-commerce-modules/footer';
import { Module, Node } from '@msdyn365-commerce-modules/utilities';
import * as React from 'react';

/**
 *
 * FooterItemView component.
 * @extends {React.PureComponent<IFooterViewProps>}
 */
export class FooterItemView extends React.PureComponent<IFooterViewProps> {
    public render(): JSX.Element | null {
        // eslint-disable-next-line @typescript-eslint/naming-convention -- Cannot change the prop names as props are from business logic.
        const { FooterItem } = this.props;
        return <Module {...FooterItem}>{this._renderElement(this.props)}</Module>;
    }

    private _renderElement(props: IFooterViewProps): React.ReactNode | null {
        // eslint-disable-next-line @typescript-eslint/naming-convention -- Cannot change the prop names as props are from business logic.
        const { heading, HeadingContainer, Link, linkText, image, text, EditableLink } = props;
        if (heading) {
            return (
                <Node {...HeadingContainer}>
                    {' '}
                    <Node tag='i' className='ms-footer__heading__title-icon' aria-hidden='true' />
                    {heading}{' '}
                </Node>
            );
        } else if (Link && image) {
            return (
                <Node {...Link}>
                    {linkText}
                    {image}
                </Node>
            );
        } else if (Link) {
            return EditableLink;
        }
        return (
            <>
                {text}
                {image}
            </>
        );
    }
}

export default FooterItemView;
