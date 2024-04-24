/*!
 * Copyright (c) Microsoft Corporation.
 * All rights reserved. See LICENSE in the project root for license information.
 */

import { buildMockModuleProps, IGridSettings, IImageData, Image } from '@msdyn365-commerce/core';
import { AsyncResult, MediaLocation } from '@msdyn365-commerce/retail-proxy';
import {
    IMediaGalleryConfig,
    IMediaGalleryData,
    IMediaGalleryProps,
    IMediaGalleryResources,
    IMediaGalleryState,
    IMediaGalleryViewProps
} from '@msdyn365-commerce-modules/media-gallery';
import { ISelectedProduct } from '@msdyn365-commerce-modules/retail-actions';
import { KeyCodes } from '@msdyn365-commerce-modules/utilities';
import { mount, render } from 'enzyme';
import * as React from 'react';

import MediaGalleryView from '../views/media-gallery.view';

const mockState: IMediaGalleryState = {
    animating: false,
    activeIndex: 1,
    mediaGalleryItems: [],
    isImageZoomed: false,
    modalIsOpen: false,
    lastUpdate: 1
};

const modalContent = <div />;

const imageData: IImageData = {
    src: 'https://cms-ppe-imageresizer-mr.trafficmanager.net/cms/api/jswzvrwzrf/imageFileData/LAkPa?ver=fac0',
    altText: 'Home',
    width: 203,
    height: 203,
    title: '',
    imageSettings: {
        quality: 80,
        disableLazyLoad: false,
        lazyload: true,
        viewports: {
            xs: { w: 300, h: 350, q: 'w=300&h=350&q=80&m=6&f=jpg' },
            lg: { w: 300, h: 350, q: 'w=300&h=350&q=80&m=6&f=jpg' },
            xl: { w: 300, h: 350, q: 'w=300&h=350&q=80&m=6&f=jpg' }
        }
    }
};

const testGridSettings: IGridSettings = {
    xs: {
        w: 767
    },
    sm: {
        w: 991
    },
    md: {
        w: 1199
    },
    lg: {
        w: 1599
    },
    xl: {
        w: 1600
    }
};

const data: IMediaGalleryData = {
    product: {
        status: 'SUCCESS',
        result: undefined
    } as AsyncResult<ISelectedProduct>,
    mediaLocations: {
        status: 'SUCCESS',
        result: undefined
    } as AsyncResult<MediaLocation[]>,
    mediaLocationsForSelectedVariant: {
        status: 'SUCCESS',
        result: undefined
    } as AsyncResult<MediaLocation[]>
};

const mockResources: IMediaGalleryResources = {
    nextScreenshotFlipperText: 'string',
    previousScreenshotFlipperText: 'string',
    fullScreenTitleText: 'string',
    ariaLabelForSlide: 'string',
    playLabel: 'play',
    pauseLabel: 'pause',
    pausedLabel: 'paused',
    playingLabel: 'playing',
    muteLabel: 'mute',
    unMuteLabel: 'unmute',
    fullScreenLabel: 'full screen',
    exitFullScreenLabel: 'exit full screen',
    seekBarLabel: 'Seek bar',
    videoTimeDurationLabel: 'Video time duration',
    closedCaptionLabel: 'Closed caption',
    optionButtonLabel: 'More Options',
    sliderThumbLabel: 'slider thumb',
    volumeThumbLabel: 'volume thumb',
    playVideoTitleText: 'play video'
};

describe('Media gallery view tests', () => {
    it('renders correctly with no items', () => {
        const moduleProps: IMediaGalleryProps<IMediaGalleryData> = buildMockModuleProps({}, {}) as IMediaGalleryProps<IMediaGalleryData>;
        const mockProps: IMediaGalleryViewProps = {
            ...moduleProps,
            data,
            Modal: modalContent,
            state: mockState,
            MediaGallery: { moduleProps, className: 'module-class-MediaGallery' },
            CarouselProps: { moduleProps, className: 'module-class-carousel' },
            Thumbnails: {
                ThumbnailsContainerProps: { className: 'node-class-ThumbnailsContainer' },
                SingleSlideCarouselComponentProps: { className: 'node-class-SingleSlideCarouselComponent' }
            }
        };
        const component = render(<MediaGalleryView {...mockProps} />);
        expect(component).toMatchSnapshot();
    });

    it('renders correctly with empty item', () => {
        const moduleProps: IMediaGalleryProps<IMediaGalleryData> = buildMockModuleProps({}, {}) as IMediaGalleryProps<IMediaGalleryData>;
        const mockConfig: IMediaGalleryConfig = {
            thumbnailImageSettings: imageData.imageSettings
        };
        moduleProps.resources = mockResources;
        moduleProps.config = mockConfig;

        mockState.mediaGalleryItems = [imageData, imageData];
        const mockProps: IMediaGalleryViewProps = {
            ...moduleProps,
            data,
            Modal: modalContent,
            state: mockState,
            MediaGallery: { moduleProps, className: 'module-class-MediaGallery' },
            CarouselProps: { moduleProps, className: 'module-class-carousel' },
            Thumbnails: {
                ThumbnailsContainerProps: { className: 'node-class-ThumbnailsContainer' },
                SingleSlideCarouselComponentProps: { className: 'node-class-SingleSlideCarouselComponent' },
                items: [
                    {
                        ThumbnailItemContainerProps: { className: 'node-class-ThumbnailItemContainer' },
                        Picture: <Image src='empty' gridSettings={testGridSettings} />
                    }
                ]
            }
        };
        const component = render(<MediaGalleryView {...mockProps} />);
        expect(component).toMatchSnapshot();
    });

    it('renders correctly with more than 1 item', () => {
        const moduleProps: IMediaGalleryProps<IMediaGalleryData> = buildMockModuleProps({}, {}) as IMediaGalleryProps<IMediaGalleryData>;
        const mockConfig: IMediaGalleryConfig = {
            thumbnailImageSettings: imageData.imageSettings
        };
        moduleProps.resources = mockResources;
        moduleProps.config = mockConfig;

        mockState.mediaGalleryItems = [imageData, imageData];
        const mockProps: IMediaGalleryViewProps = {
            ...moduleProps,
            data,
            Modal: modalContent,
            state: mockState,
            MediaGallery: { moduleProps, className: 'module-class-MediaGallery' },
            CarouselProps: { moduleProps, className: 'module-class-carousel' },
            Thumbnails: {
                ThumbnailsContainerProps: { className: 'node-class-ThumbnailsContainer' },
                SingleSlideCarouselComponentProps: { className: 'node-class-SingleSlideCarouselComponent' },
                items: [
                    {
                        ThumbnailItemContainerProps: { className: 'node-class-ThumbnailItemContainer' },
                        Picture: <span />
                    },
                    {
                        ThumbnailItemContainerProps: { className: 'node-class-ThumbnailItemContainer' },
                        Picture: <span />
                    }
                ]
            }
        };
        const component = render(<MediaGalleryView {...mockProps} />);
        expect(component).toMatchSnapshot();
    });

    it('renders correctly with media gallery items', () => {
        const moduleProps: IMediaGalleryProps<IMediaGalleryData> = buildMockModuleProps({}, {}) as IMediaGalleryProps<IMediaGalleryData>;
        const mockConfig: IMediaGalleryConfig = {
            thumbnailImageSettings: imageData.imageSettings
        };
        moduleProps.resources = mockResources;
        moduleProps.config = mockConfig;

        mockState.mediaGalleryItems = [imageData, imageData];

        const mockProps: IMediaGalleryViewProps = {
            ...moduleProps,
            data,
            Modal: modalContent,
            state: mockState,
            MediaGallery: { moduleProps, className: 'module-class-MediaGallery' },
            CarouselProps: { moduleProps, className: 'module-class-carousel' },
            Thumbnails: {
                ThumbnailsContainerProps: { className: 'node-class-ThumbnailsContainer' },
                SingleSlideCarouselComponentProps: { className: 'node-class-SingleSlideCarouselComponent' }
            }
        };

        const wrapper = mount(<MediaGalleryView {...mockProps} />);
        const button = wrapper.find('button');
        expect(button).toBeDefined();
        wrapper.setProps({ callbackToggle: jest.fn(), callbackThumbnailClick: jest.fn() });
        wrapper.unmount();
    });

    it('renders correctly with media gallery items and callback functions', () => {
        const moduleProps: IMediaGalleryProps<IMediaGalleryData> = buildMockModuleProps({}, {}) as IMediaGalleryProps<IMediaGalleryData>;
        const mockConfig: IMediaGalleryConfig = {
            thumbnailImageSettings: undefined
        };
        moduleProps.resources = mockResources;
        moduleProps.config = mockConfig;

        mockState.mediaGalleryItems = [imageData, imageData];
        mockState.activeIndex = 1;

        const mockProps: IMediaGalleryViewProps = {
            ...moduleProps,
            data,
            Modal: modalContent,
            state: mockState,
            MediaGallery: { moduleProps, className: 'module-class-MediaGallery' },
            CarouselProps: { moduleProps, className: 'module-class-carousel' },
            Thumbnails: {
                ThumbnailsContainerProps: { className: 'node-class-ThumbnailsContainer' },
                SingleSlideCarouselComponentProps: { className: 'node-class-SingleSlideCarouselComponent' },
                items: [
                    {
                        ThumbnailItemContainerProps: { className: 'node-class-ThumbnailItemContainer' },
                        Picture: <span />
                    },
                    {
                        ThumbnailItemContainerProps: { className: 'node-class-ThumbnailItemContainer' },
                        Picture: <span />
                    },
                    {
                        ThumbnailItemContainerProps: { className: 'node-class-ThumbnailItemContainer' },
                        Picture: <span />
                    },
                    {
                        ThumbnailItemContainerProps: { className: 'node-class-ThumbnailItemContainer' },
                        Picture: <span />
                    }
                ]
            },
            callbackToggle: jest.fn(),
            callbackThumbnailClick: jest.fn(),
            callbackThumbnailKeyDown: jest.fn()
        };

        const wrapper = mount(<MediaGalleryView {...mockProps} />);
        const button = wrapper.find('button');
        button.at(0).simulate('click');
        button.at(0).simulate('keydown', { keyCode: KeyCodes.Enter });
        expect(button).toBeDefined();
        wrapper.unmount();
    });
});
