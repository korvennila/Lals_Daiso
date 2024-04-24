/*!
 * Copyright (c) Microsoft Corporation.
 * All rights reserved. See LICENSE in the project root for license information.
 */

import {
    IContentBlockAdditionalContentItemViewProps,
    IContentBlockAdditionalContentViewProps,
    IContentBlockViewProps
} from '@msdyn365-commerce-modules/content-block';
import { Module, Node } from '@msdyn365-commerce-modules/utilities';
import * as React from 'react';

/**
 * Render Additional Content.
 * @param additionalContent - Additional content view props.
 * @returns JSX Element.
 */
const renderAdditionalContent = (additionalContent: IContentBlockAdditionalContentViewProps) => {
    return (
        <Node {...additionalContent.additionalContentNode}>
            {additionalContent.additionalContentItems?.map((item: IContentBlockAdditionalContentItemViewProps) => {
                return (
                    <>
                        {item.heading}
                        <Node {...item.additionalContentItemContainer}>
                            {item.text}
                            <Node {...item.additionalContentItemLinks}>{item.links}</Node>
                        </Node>
                    </>
                );
            })}
        </Node>
    );
};

/**
 * Render View.
 * @param props - The view props.
 * @returns -The JSX Element.
 */
const contentBlockView: React.FC<IContentBlockViewProps> = props => {
    const {
        contentBlockContainer,
        imageContainer,
        detailsContainer,
        title,
        text,
        links,
        image,
        contentBlockAnchorTag,
        imageLink,
        imageAriaLabel,
        additionalContent
    } = props;

    // @ts-expect-error HTML element need to be clear on run time.
    const hasImage: boolean = image.props.src;
    const imageClass: string = hasImage ? `${detailsContainer.className} withImage` : `${detailsContainer.className} withoutImage`;

    if (imageLink) {
        return (
            <Module {...contentBlockContainer}>
                <Node
                    {...contentBlockAnchorTag}
                    href={imageLink}
                    className={contentBlockAnchorTag ? contentBlockAnchorTag.className : ''}
                    aria-label={imageAriaLabel}
                >
                    <Node {...imageContainer}>{image}</Node>
                </Node>
                <Node {...detailsContainer}>
                    {title}
                    {text}
                    {links}
                    {additionalContent && renderAdditionalContent(additionalContent)}
                </Node>
            </Module>
        );
    }
    return (
        <Module {...contentBlockContainer}>
            <Node {...imageContainer}>{image}</Node>
            <Node className={imageClass}>
                {title}
                {text}
                {links}
                {additionalContent && renderAdditionalContent(additionalContent)}
            </Node>
        </Module>
    );
};

export default contentBlockView;
