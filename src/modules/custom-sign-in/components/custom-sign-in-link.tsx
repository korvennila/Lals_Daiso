/*!
 * Copyright (c) Microsoft Corporation.
 * All rights reserved. See LICENSE in the project root for license information.
 */

/* eslint-disable no-duplicate-imports */
import { getPayloadObject, getTelemetryAttributes, ITelemetryContent } from '@msdyn365-commerce-modules/utilities';
import * as React from 'react';

export interface ISignInLink {
    id?: string;
    className: string;
    href: string;
    ariaLabel: string;
    text: string;
    telemetryContent?: ITelemetryContent;
}

const SignInLink: React.FC<ISignInLink> = ({ id, className, href, telemetryContent, ariaLabel, text }) => {
    const payLoad = getPayloadObject('click', telemetryContent!, text);
    const attributes = getTelemetryAttributes(telemetryContent!, payLoad);
    return (
        <a id={id} className={className} href={href} aria-label={ariaLabel} {...attributes}>
            {text}
        </a>
    );
};

export default SignInLink;
