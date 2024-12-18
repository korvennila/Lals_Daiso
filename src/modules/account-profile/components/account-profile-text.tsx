/*!
 * Copyright (c) Microsoft Corporation.
 * All rights reserved. See LICENSE in the project root for license information.
 */

/* eslint-disable no-duplicate-imports */
import * as React from 'react';

interface IAccountProfileText {
    className: string;
    text: string;
}

// eslint-disable-next-line no-redeclare
const IAccountProfileText: React.FC<IAccountProfileText> = ({ className, text }) => <span className={className}>{text}</span>;

export default IAccountProfileText;
