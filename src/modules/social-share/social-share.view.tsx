/*!
 * Copyright (c) Microsoft Corporation.
 * All rights reserved. See LICENSE in the project root for license information.
 */

/* eslint-disable no-duplicate-imports */
import { Module, Node } from '@msdyn365-commerce-modules/utilities';
import React, { ReactNode } from 'react';

import { ISocialShareViewProps } from './social-share';

export const SocialShareView: React.FC<ISocialShareViewProps> = props => {
    const { SocialShareList, SocialShareItemElements, SocialShareItem, SocialShare } = props;
    if (SocialShareItemElements.length === 0) {
        props.context.telemetry.error('Social media list is empty, module wont render');
        return null;
    }
    return (
        <Module {...SocialShare}>
            <Node {...SocialShareList}>
                {SocialShareItemElements.map((SocialShareElement: ReactNode, index: number) => {
                    return (
                        <Node {...SocialShareItem} key={index}>
                            {SocialShareElement}
                        </Node>
                    );
                })}
            </Node>
        </Module>
    );
};

export default SocialShareView;
