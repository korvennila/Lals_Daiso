/*!
 * Copyright (c) Microsoft Corporation.
 * All rights reserved. See LICENSE in the project root for license information.
 */

import { KeywordSuggestionsComponent } from '../../views/components/search.keywordsuggest';

const keywordSuggest = { className: 'node-class-KeywordSuggest' };
const ulKeyword = { className: 'node-class-UlKeyword' };
let keywordsHeading = 'heading';
const noResultText = 'No Result';
const autosuggestKeyword = { screenReader: 'screenReader', text: ['keywordText'] };
describe('Search unit tests - Keyword Suggestions Component', () => {
    it('renders correctly', () => {
        const component = KeywordSuggestionsComponent(keywordSuggest, ulKeyword, keywordsHeading, noResultText, autosuggestKeyword);
        expect(component).toMatchSnapshot();
    });

    it('render empty keyword heading', () => {
        keywordsHeading = '';
        const component = KeywordSuggestionsComponent(keywordSuggest, ulKeyword, keywordsHeading, noResultText, autosuggestKeyword);
        expect(component).toMatchSnapshot();
    });

    it('render without auto suggest keywords', () => {
        const component = KeywordSuggestionsComponent(keywordSuggest, ulKeyword, keywordsHeading, noResultText, undefined);
        expect(component).toMatchSnapshot();
    });
});
