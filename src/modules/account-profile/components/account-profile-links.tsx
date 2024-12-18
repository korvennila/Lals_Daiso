/*!
 * Copyright (c) Microsoft Corporation.
 * All rights reserved. See LICENSE in the project root for license information.
 */

/* eslint-disable no-duplicate-imports */
import * as Msdyn365 from '@msdyn365-commerce/core';
import { ILinkData } from '@msdyn365-commerce/core';
import { getPayloadObject, getTelemetryAttributes, ITelemetryContent } from '@msdyn365-commerce-modules/utilities';
import * as React from 'react';

export interface ILinksData {
    linkText?: string;
    linkUrl: ILinkData;
    ariaLabel?: string;
    openInNewTab?: boolean;
    isDisabled?: boolean;
}

export interface IAccountProfileLinks {
    links: ILinksData[];
    requestContext: Msdyn365.IRequestContext;

    /**
     * The telemetry content
     */
    telemetryContent?: ITelemetryContent;
    onTextChange?(index: number): (event: Msdyn365.ContentEditableEvent) => void;
}

const AccountProfileLinks: React.FC<IAccountProfileLinks> = ({ links, telemetryContent, requestContext, onTextChange }) => {
    if (links.length === 0) {
        return null;
    }
    const editableLinks = _mapEditableLinks(links, telemetryContent);
    return (
        <div className='ms-account-profile__section-links'>
            {editableLinks && editableLinks.length > 0 ? (
                <Msdyn365.Links links={editableLinks} editProps={{ onTextChange, requestContext }} />
            ) : null}
        </div>
    );
};

const _mapEditableLinks = (linkdata: ILinksData[], telemetryContent?: ITelemetryContent): Msdyn365.ILinksData[] | null => {
    if (!linkdata || linkdata.length === 0) {
        return null;
    }
    const editableLinks: Msdyn365.ILinksData[] = [];
    const payLoad = getPayloadObject('click', telemetryContent!, '');
    linkdata.forEach((link, index) => {
        payLoad.contentAction.etext = link.linkText;
        const attributes = getTelemetryAttributes(telemetryContent!, payLoad);
        const editableLink: Msdyn365.ILinksData = {
            ariaLabel: link.ariaLabel,
            className: link.isDisabled ? 'ms-account-profile__section-link-disable' : 'ms-account-profile__section-link',
            linkText: link.linkText,
            linkUrl: link.linkUrl.destinationUrl,
            openInNewTab: link.openInNewTab,
            role: 'link',
            additionalProperties: attributes
        };
        editableLinks.push(editableLink);
    });

    return editableLinks;
};

export default AccountProfileLinks;
