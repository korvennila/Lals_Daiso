/*!
 * Copyright (c) Microsoft Corporation.
 * All rights reserved. See LICENSE in the project root for license information.
 */

/* eslint-disable no-duplicate-imports */
import { getPayloadObject, getTelemetryAttributes } from '@msdyn365-commerce-modules/utilities';
import * as React from 'react';

import { IGetHelpInput, IHelp } from '@msdyn365-commerce-modules/order-management';

export const getOrderConfirmationHelp = ({
    needHelpLabel,
    helpLineNumberLabel,
    contactNumber,
    helpLineContactAriaLabel,
    telemetryContent
}: IGetHelpInput): IHelp => {
    const payLoad = getPayloadObject('click', telemetryContent!, '');
    const attribute = getTelemetryAttributes(telemetryContent!, payLoad);
    return {
        helpProps: { className: 'ms-order-confirmation__help' },
        needHelpLabel: <p className='ms-order-confirmation__help-title'>{needHelpLabel}</p>,
        helpLineNumberLabel: <span className='ms-order-confirmation__help-label'>{helpLineNumberLabel}</span>,
        contactNumber: (
            <a
                className='ms-order-confirmation__help-content-number'
                aria-label={`${helpLineContactAriaLabel} ${contactNumber}`}
                href={`tel:${contactNumber}`}
                {...attribute}
            >
                {contactNumber}
            </a>
        )
    };
};
