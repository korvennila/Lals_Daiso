/*!
 * Copyright (c) Microsoft Corporation.
 * All rights reserved. See LICENSE in the project root for license information.
 */

import { ISearchKeywordViewProps } from '@msdyn365-commerce-modules/search';
import { INodeProps, Node } from '@msdyn365-commerce-modules/utilities';
import React from 'react';

/**
 * Render keywords heading.
 * @param keywordsHeading -The Keywords result heading.
 * @returns The JSX Element.
 */
const renderKeywordSuggestionsTitle = (keywordsHeading: string): JSX.Element => {
    const categoryAutoSuggestionHeading = keywordsHeading ? keywordsHeading : 'Keywords';

    return <div className='msc-autoSuggest_keywordsResults-title'>{categoryAutoSuggestionHeading}</div>;
};

/**
 * Render keywords reults.
 * @param keywordSuggest -The Keywords suggest Node props.
 * @param ulKeyword -The List Node props.
 * @param keywordsHeading -The Keywords result heading.
 * @param noResultText -The "No Result" text.
 * @param  keywordSuggestions -The Keywords suggestion result.
 * @param isLoadingAutoSuggest - The autosuggestion loading flag.
 * @param isLoadingNode - The autosuggestion loading node.
 * @returns -The JSX Element.
 */
export const KeywordSuggestionsComponent = (
    keywordSuggest: INodeProps,
    ulKeyword: INodeProps,
    keywordsHeading: string,
    noResultText: string,
    keywordSuggestions?: ISearchKeywordViewProps,
    isLoadingAutoSuggest?: boolean,
    isLoadingNode?: React.ReactNode
): JSX.Element => {
    return keywordSuggestions ? (
        <Node {...keywordSuggest}>
            {renderKeywordSuggestionsTitle(keywordsHeading)}
            <Node {...ulKeyword}>
                {isLoadingAutoSuggest && isLoadingNode}
                {!isLoadingAutoSuggest &&
                    keywordSuggestions.text.map(text => {
                        return text;
                    })}
            </Node>
        </Node>
    ) : (
        <Node {...keywordSuggest}>
            {renderKeywordSuggestionsTitle(keywordsHeading)}
            <Node {...ulKeyword}>
                <li className='msc-autoSuggest__keywordResults-no-results'>{noResultText}</li>
            </Node>
        </Node>
    );
};
