/*!
 * Copyright (c) Microsoft Corporation.
 * All rights reserved. See LICENSE in the project root for license information.
 */

/* eslint-disable no-duplicate-imports */
import { Module } from '@msdyn365-commerce-modules/utilities';
import React from 'react';

import { ISocialShareItemViewProps } from './social-share-item';

export const SocialShareItemView: React.FC<ISocialShareItemViewProps> = props => {
    const { SocialShareItem, SocialShareItemElement } = props;

    if (!SocialShareItemElement) {
        props.context.telemetry.error('Social media is not valid, module wont render');
        return null;
    }
    return <Module {...SocialShareItem}>{SocialShareItemElement}</Module>;
};

export default SocialShareItemView;
