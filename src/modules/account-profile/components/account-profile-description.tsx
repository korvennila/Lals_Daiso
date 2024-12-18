/*!
 * Copyright (c) Microsoft Corporation.
 * All rights reserved. See LICENSE in the project root for license information.
 */

/* eslint-disable no-duplicate-imports */
import * as React from 'react';

interface IAccountProfileDescription {
    className: string;
    description: string;
}

// eslint-disable-next-line no-redeclare
const IAccountProfileDescription: React.FC<IAccountProfileDescription> = ({ className, description }) => (
    <p className={className}>{description}</p>
);

export default IAccountProfileDescription;
