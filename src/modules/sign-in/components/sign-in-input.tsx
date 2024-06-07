/*!
 * Copyright (c) Microsoft Corporation.
 * All rights reserved. See LICENSE in the project root for license information.
 */

/* eslint-disable no-duplicate-imports */
import { INodeProps } from '@msdyn365-commerce-modules/utilities';
import * as React from 'react';

export interface ISignInInputProps {
    id?: string;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    type: any;
    value?: string;
    pattern?: string;
    className: string;
    maxLength?: string;
    ariaLabel?: string;
    onChange?(event: React.ChangeEvent<HTMLInputElement>): void;
}

export interface ISignInInput {
    key: string;
    AddressItem: INodeProps;
    label: React.ReactNode;
    alert: React.ReactNode;
    input: React.ReactNode;
}

const GetMaxLength = (maxLength?: string): number | undefined => {
    if (maxLength) {
        const parsedMaxLength = Number.parseInt(maxLength, 10);
        if (!isNaN(parsedMaxLength)) {
            return parsedMaxLength;
        }
    }

    return undefined;
};

const SignInInput: React.FC<ISignInInputProps> = ({ id, type, value, pattern, className, maxLength, ariaLabel, onChange }) => (
    <input
        id={id}
        type={type}
        value={value}
        className={`${className}-input ${className}-${id}`}
        pattern={pattern !== '' ? pattern : undefined}
        aria-required='true'
        maxLength={GetMaxLength(maxLength)}
        onChange={onChange}
        aria-label={ariaLabel}
    />
);

export default SignInInput;
