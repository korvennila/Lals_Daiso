/**
 * Copyright (c) Microsoft Corporation
 * All rights reserved. See License.txt in the project root for license information.
 * ISearch contentModule Interface Properties
 * THIS FILE IS AUTO-GENERATED - MANUAL MODIFICATIONS WILL BE LOST
 */

import * as Msdyn365 from '@msdyn365-commerce/core';

export interface ISearchConfig extends Msdyn365.IModuleConfig {
    suggestionTypeCriterion?: ISuggestionTypeCriterionData[];
    topResultsCount?: number;
    imageSettings?: Msdyn365.IImageSettings;
    hideSearchLabel?: boolean;
    disableSubmitSearch?: boolean;
    searchplaceholderText?: string;
    shouldShowFullCategoryPath?: boolean;
    className?: string;
    clientRender?: boolean;
    noSearchResultImage?: Msdyn365.IImageData;
}

export interface ISearchResources {
    searchtext: string;
    searchLabelArialLabel: string;
    cancelBtnAriaLabel: string;
    searchBtnAriaLabel: string;
    submitBtnAriaLabel: string;
    autoSuggestFoundMessage: string;
    noAutoSuggestionMessage: string;
    productSuggestionHeading: string;
    categorySuggestionHeading: string;
    autoSuggestResultLoadingMessage: string;
    freePriceText: string;
    searchSuggestionHeading: string;
    keywordsHeading: string;
    noResultText: string;
    noResultContentHeadingText: string;
    noResultContentParagraphText: string;
    clearSearchButtonText: string;
    emptyMobileSearchTextHeading: string;
    emptyMobileSearchText: string;
}

export const enum SuggestionTypeCriterionSuggestionType {
    product = 'product',
    keyword = 'keyword',
    scopedCategory = 'scopedCategory'
}

export interface ISuggestionTypeCriterionData {
    SuggestionType?: SuggestionTypeCriterionSuggestionType;
}

export interface ISearchProps<T> extends Msdyn365.IModule<T> {
    resources: ISearchResources;
    config: ISearchConfig;
}
