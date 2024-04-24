/**
 * Copyright (c) Microsoft Corporation
 * All rights reserved. See License.txt in the project root for license information.
 * IBusinessOrganizationList contentModule Interface Properties
 * THIS FILE IS AUTO-GENERATED - MANUAL MODIFICATIONS WILL BE LOST
 */

import * as Msdyn365 from '@msdyn365-commerce/core';

export interface IBusinessOrganizationListConfig extends Msdyn365.IModuleConfig {
    heading: IHeadingData;
    tableSort?: boolean;
    showPagination?: boolean;
    paginationItemPerPage?: number;
    className?: string;
    clientRender?: boolean;
    maxLength?: string;
    showBecomeSellerLink?: boolean;
}

export interface IBusinessOrganizationListResources {
    businessUserViewUserButtonText: string;
    businessUserAddUserButtonText: string;
    businessUserFirstNameLabelText: string;
    businessUserFirstNameMaxLength: string;
    businessUserLastNameLabelText: string;
    businessUserLastNameMaxLength: string;
    businessUserEmailAddressLabelText: string;
    businessUserSpendingLimitLabelText: string;
    businessUserSaveButtonText: string;
    businessUserSaveButtonArialabel: string;
    businessUserCancelButtonText: string;
    businessUserCancelButtonArialabel: string;
    businessUserRemoveUserButtonText: string;
    businessUserRemoveUserButtonArialabel: string;
    businessUserCancelRemoveUserButtonText: string;
    businessUserCancelRemoveUserButtonArialabel: string;
    businessUserEditUserFormHeadingText: string;
    businessUserAddUserFormHeadingText: string;
    businessUserRequiredFieldMissingSummaryError: string;
    businessUserFieldIncorrectErrorText: string;
    businessUserActionErrorText: string;
    businessUserPaginationPreviousButtonText: string;
    businessUserPaginationAriaLabel: string;
    businessUserPaginationNextButtonText: string;
    businessUserEditButtonText: string;
    businessUserDeleteButtonText: string;
    businessUserActionButtonText: string;
    businessUserActiveStatusText: string;
    businessUserPendingStatusText: string;
    businessUserRemovedStatusText: string;
    businessUserRemoveModalHeaderText: string;
    businessUserRemoveModalDescription: string;
    businessUserViewModalHeaderText: string;
    businessUserEmptyListMessage: string;
    businessUserLoadingMessage: string;
    businessUserErrorGettingUsersMessage: string;
    businessUserErrorUpdatingUsersMessage: string;
    businessUserAllFieldsRequiredMessage: string;
    businessUserTableNameHeadingText: string;
    businessUserTableEmailHeadingText: string;
    businessUserTableStatusHeadingText: string;
    businessUserTableSpendingLimitHeadingText: string;
    businessUserTableSpendingLimitZeroHoverText: string;
    requestStatementButtonLabel: string;
    statementRequestModalHeaderLabel: string;
    sendToEmailLabel: string;
    fromDateLabel: string;
    toDateLabel: string;
    submitRequestLabel: string;
    cancelLabel: string;
    userAccountStatementLabel: string;
    fullOrganizationLabel: string;
    promoteToSellerActionLabel: string;
    requestAccountStatementActionLabel: string;
    requestOrganizationStatementActionLabel: string;
    selectedUserLabel: string;
    selectedOrganizationLabel: string;
    businessUserSelectedUserDisplayName: string;
    businessUserSelectCheckBoxAriaLabelText: string;
    columnSortAriaLabel: string;
    sortByAscending: string;
    sortByDescending: string;
    asteriskAfterLabel: string;
    tableAriaLabel: string;
    modalAriaLabel: string;
    headingForEmptyUserOrganizationList: string;
    textForEmptyUserOrganizationList: string;
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

export interface IBusinessOrganizationListProps<T> extends Msdyn365.IModule<T> {
    resources: IBusinessOrganizationListResources;
    config: IBusinessOrganizationListConfig;
}
