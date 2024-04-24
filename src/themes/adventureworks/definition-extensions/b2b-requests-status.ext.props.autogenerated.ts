/**
 * Copyright (c) Microsoft Corporation
 * All rights reserved. See License.txt in the project root for license information.
 * IB2bRequestsStatus contentModule Interface Properties
 * THIS FILE IS AUTO-GENERATED - MANUAL MODIFICATIONS WILL BE LOST
 */

import * as Msdyn365 from '@msdyn365-commerce/core';

export interface IB2bRequestsStatusConfig extends Msdyn365.IModuleConfig {
    heading: IHeadingData;
    className?: string;
    clientRender?: boolean;
}

export interface IB2bRequestsStatusResources {
    b2bRequestsTypeCreateProspect: string;
    b2bRequestsTypeAddUser: string;
    b2bRequestsTypeEditUser: string;
    b2bRequestsTypeDeleteUser: string;
    b2bRequestsTypeRequestAccountStatement: string;
    b2bRequestsTypeRequestInvoiceCopy: string;
    b2bRequestsTypeUnknown: string;
    b2bRequestsStatusRequested: string;
    b2bRequestsStatusProcessed: string;
    b2bRequestsStatusError: string;
    b2bRequestsNumberOfItems: string;
    b2bRequestsNumberOfItemsSingular: string;
    b2bRequestsNameDisplay: string;
    b2bRequestsPreviousText: string;
    b2bRequestsNextText: string;
    b2bRequestsUserColumn: string;
    b2bRequestsStatusColumn: string;
    b2bRequestsRequestDateColumn: string;
    b2bRequestsTypeColumn: string;
    b2bRequestsDescriptionColumn: string;
    b2bRequestsAccountStatementDetails: string;
    b2bRequestsInvoiceCopyDetails: string;
    businessUserSelectCheckBoxAriaLabelText: string;
    columnSortAriaLabel: string;
    sortByAscending: string;
    sortByDescending: string;
    continueShoppingButtonTitle: string;
    headingForEmptyRequestStatus: string;
    textForEmptyRequestStatus: string;
}

export const enum HeadingTag {
    h1 = 'h1',
    h2 = 'h2',
    h3 = 'h3',
    h4 = 'h4',
    h5 = 'h5',
    h6 = 'h6'
}

export interface IHeadingData {
    text: string;
    tag?: HeadingTag;
}

export interface IB2bRequestsStatusProps<T> extends Msdyn365.IModule<T> {
    resources: IB2bRequestsStatusResources;
    config: IB2bRequestsStatusConfig;
}
