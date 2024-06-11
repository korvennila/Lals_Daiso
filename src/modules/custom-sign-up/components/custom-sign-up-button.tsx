/*!
 * Copyright (c) Microsoft Corporation.
 * All rights reserved. See LICENSE in the project root for license information.
 */

/* eslint-disable no-duplicate-imports */
import { Button } from '@msdyn365-commerce-modules/utilities';
import * as React from 'react';

export interface ISignUpButton {
    id?: string;
    className: string;
    text: string;
    ariaLabel: string;
    disabled?: boolean;
    onClick?(event: React.MouseEvent<HTMLElement>): void;
}

const SignUpButton: React.FC<ISignUpButton> = ({ id, className, text, ariaLabel, disabled, onClick }) => (
    <Button id={id} className={className} aria-label={ariaLabel} disabled={disabled} onClick={onClick}>
        {text}
    </Button>
);

export default SignUpButton;
