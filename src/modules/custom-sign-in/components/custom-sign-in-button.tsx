/*!
 * Copyright (c) Microsoft Corporation.
 * All rights reserved. See LICENSE in the project root for license information.
 */

/* eslint-disable no-duplicate-imports */
import { Button, getPayloadObject, getTelemetryAttributes, ITelemetryContent } from '@msdyn365-commerce-modules/utilities';
import * as React from 'react';

export interface ISignInButton {
    id?: string;
    className: string;
    text: string;
    ariaLabel: string;
    disabled?: boolean;
    telemetryContent?: ITelemetryContent;
    onClick?(event: React.MouseEvent<HTMLElement>): void;
}

const SignInButton: React.FC<ISignInButton> = ({ id, className, text, ariaLabel, telemetryContent, disabled, onClick }) => {
    const payLoad = getPayloadObject('click', telemetryContent!, text);
    const attributes = getTelemetryAttributes(telemetryContent!, payLoad);
    return (
        <Button id={id} className={className} aria-label={ariaLabel} disabled={disabled} onClick={onClick} {...attributes}>
            {text}
        </Button>
    );
};

export default SignInButton;
