/*!
 * Copyright (c) Microsoft Corporation.
 * All rights reserved. See LICENSE in the project root for license information.
 */

/* eslint-disable no-duplicate-imports */
import { getPayloadObject, getTelemetryAttributes, IPayLoad, TelemetryConstant } from '@msdyn365-commerce-modules/utilities';
import * as React from 'react';

import { IGetHelpInput, IHelp } from '@msdyn365-commerce-modules/order-management';

export const getOrderDetailsHelp = ({
    needHelpLabel,
    helpLineNumberLabel,
    contactNumber,
    helpLineContactAriaLabel,
    telemetryContent
}: IGetHelpInput): IHelp => {
    const payLoad: IPayLoad = getPayloadObject('click', telemetryContent!, TelemetryConstant.ContactNumber);
    const attributes = getTelemetryAttributes(telemetryContent!, payLoad);
    return {
        helpProps: { className: 'ms-order-details__help' },
        needHelpLabel: <p className='ms-order-details__help-title'>{needHelpLabel}</p>,
        helpLineNumberLabel: <span className='ms-order-details__help-label'>{helpLineNumberLabel}</span>,
        contactNumber: (
            <a
                className='ms-order-details__help-content-number'
                aria-label={`${helpLineContactAriaLabel} ${contactNumber}`}
                href={`tel:${contactNumber}`}
                {...attributes}
            >
                {contactNumber}
            </a>
        )
    };
};
