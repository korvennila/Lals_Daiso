/*!
 * Copyright (c) Microsoft Corporation.
 * All rights reserved. See LICENSE in the project root for license information.
 */

/* eslint-disable no-duplicate-imports */
import { Module, Node } from '@msdyn365-commerce-modules/utilities';
import * as React from 'react';

import { IAccountPreference, IAccountPreferences, IAccountProfileItem, IAccountProfileViewProps } from './account-profile';

const AccountPreferencesSection: React.FC<IAccountPreferences> = ({ accountPreferences, heading, personalization, extraPreferences }) => {
    return (
        <Node {...accountPreferences}>
            {heading}
            <AccountPreferenceSection {...personalization} />
            {extraPreferences &&
                extraPreferences.map((preferenceSecton, index) => {
                    return <AccountPreferenceSection {...preferenceSecton} key={index} />;
                })}
        </Node>
    );
};

const AccountPreferenceSection: React.FC<IAccountPreference> = ({
    accountPreference,
    heading,
    description,
    buttonWrapper,
    buttonYesText,
    button,
    buttonNoText
}) => {
    return (
        <Node {...accountPreference}>
            {heading}
            {description}
            <Node {...buttonWrapper}>
                {buttonNoText}
                {button}
                {buttonYesText}
            </Node>
        </Node>
    );
};

const AccountProfileSection: React.FC<IAccountProfileItem> = ({ AccountProfileItem, heading, links, description }) => {
    return (
        <Node {...AccountProfileItem}>
            {heading}
            {description}
            {links}
        </Node>
    );
};

const AccountProfileView: React.FC<IAccountProfileViewProps> = props => {
    const {
        AccountProfile,
        infoMessageBar,
        accountProfileWrapper,
        heading,
        emailSection,
        nameSection,
        preferenceSection,
        customerAttributesWrapper,
        customerAttributesSection
    } = props;

    return (
        <Module {...AccountProfile}>
            {infoMessageBar}
            {accountProfileWrapper && (
                <Node {...accountProfileWrapper}>
                    {heading}
                    <AccountProfileSection {...emailSection} />
                    <AccountProfileSection {...nameSection} />
                    <AccountPreferencesSection {...preferenceSection} />
                </Node>
            )}
            {customerAttributesWrapper && <Node {...customerAttributesWrapper}>{customerAttributesSection}</Node>}
        </Module>
    );
};

export default AccountProfileView;
