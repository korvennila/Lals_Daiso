/*!
 * Copyright (c) Microsoft Corporation.
 * All rights reserved. See LICENSE in the project root for license information.
 */

import { IComponent, IComponentProps } from '@msdyn365-commerce/core';
import { ICartState } from '@msdyn365-commerce/global-state';
import { Coupon } from '@msdyn365-commerce/retail-proxy/dist/Entities/CommerceTypes.g';
import { ArrayExtensions } from '@msdyn365-commerce-modules/retail-actions';
import {
    Button,
    format,
    getPayloadObject,
    getTelemetryAttributes,
    IPayLoad,
    ITelemetryContent,
    TelemetryConstant
} from '@msdyn365-commerce-modules/utilities';
import * as React from 'react';

/**
 * IPromoCodeProps: Interface for promo code component.
 */
export interface IPromoCodeProps extends IComponentProps<{}> {
    cart: ICartState | undefined;
    promoCodeHeadingText: string;
    appliedPromoCodeHeadingText: string;
    removePromoAriaLabelFormat: string;
    promoPlaceholderText: string;
    promoCodeApplyButtonText: string;
    collapseTimeOut: number;
    removePromoText: string;
    invalidPromoCodeErrorText: string;
    failedToAddPromoCodeErrorText: string;
    duplicatePromoCodeErrorText: string;
    failedToRemovePromoCodeErrorText: string;

    /**
     * The telemetry content.
     */
    telemetryContent?: ITelemetryContent;
    promoCodeApplyCallback?(): void;
}

/**
 * IPromoCodeProps: Interface for promo code component.
 */
export interface IPromoCodeComponent extends IComponent<IPromoCodeProps> {}

/**
 * IPromoCodeProps: Interface for promo code state.
 */
interface IPromoCodeState {
    promoCodeInputValue: string;
    error: string;
    canApply: boolean;
}

/**
 *
 * The PromoCode component renders the promocode section.
 * @extends {React.PureComponent<IRefineSubmenuProps>}
 */
class PromoCode extends React.PureComponent<IPromoCodeProps, IPromoCodeState> {
    private readonly payLoad: IPayLoad;

    public constructor(props: IPromoCodeProps) {
        super(props);
        this.payLoad = getPayloadObject('click', this.props.telemetryContent!, TelemetryConstant.ApplyPromoCode);
        this.state = {
            promoCodeInputValue: '',
            error: '',
            canApply: false
        };
    }

    public render(): JSX.Element {
        return (
            <div>
                <div className='msc-promo-code-heading'>{this.props.promoCodeHeadingText}</div>
                {this._renderForm(this.props.promoPlaceholderText, this.props.promoCodeApplyButtonText, this.props.cart)}
                <p className={this.state.error ? 'msc-alert-danger' : ''} aria-live='assertive'>
                    {this.state.error}
                </p>
                {this._renderAppliedPromoCode(this.props)}
            </div>
        );
    }

    /**
     * On input change method.
     * @param event - Change event.
     */
    private readonly _onInputChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        const error = event.target.value === '' ? '' : this.state.error;
        this.setState({
            promoCodeInputValue: event.target.value.trim(),
            error,
            canApply: !!event.target.value
        });
    };

    /**
     * Apply promo code method.
     * @param cartState - Cart state interface.
     */
    private readonly _applyPromotion = (cartState: ICartState | undefined) => {
        if (!cartState) {
            return;
        }
        const appliedPromo = this.state.promoCodeInputValue;

        cartState
            .addPromoCode({ promoCode: appliedPromo })
            .then(result => {
                if (result.status === 'SUCCESS') {
                    // Show success text
                    this.setState({ promoCodeInputValue: '', error: '', canApply: false });
                } else if (result.substatus === 'ALREADYADDED') {
                    this.setState({ error: this.props.duplicatePromoCodeErrorText });
                } else {
                    this.setState({ error: this.props.invalidPromoCodeErrorText });
                }
            })
            .catch(() => {
                this.setState({ error: this.props.failedToAddPromoCodeErrorText });
            });
    };

    /**
     * On submit action.
     * @param cartState - Cart state.
     * @returns Apply promotion.
     */
    private readonly _onSubmitHandler = (cartState: ICartState | undefined) => (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        this._applyPromotion(cartState);
    };

    /**
     * On apply promotion.
     * @param cartState - Cart state.
     * @returns Apply promotion.
     */
    private readonly applyPromotionHandler = (cartState: ICartState | undefined) => () => {
        this._applyPromotion(cartState);
    };

    /**
     * Renders promo code form.
     * @param promoPlaceholderText - Promo code input box placeholder string.
     * @param promoCodeApplyButtonText - Promo code button text string.
     * @param cartState - Cart state interface.
     * @returns Promo code form.
     */
    private readonly _renderForm = (promoPlaceholderText: string, promoCodeApplyButtonText: string, cartState: ICartState | undefined) => {
        const attributes = getTelemetryAttributes(this.props.telemetryContent!, this.payLoad);

        return (
            <form onSubmit={this._onSubmitHandler(cartState)} className='msc-promo-code__form-container'>
                <div className='msc-promo-code__group'>
                    <input
                        className='msc-promo-code__input-box'
                        onChange={this._onInputChangeHandler}
                        value={this.state.promoCodeInputValue}
                        placeholder={promoPlaceholderText}
                    />
                    <Button
                        title={promoCodeApplyButtonText}
                        className='msc-promo-code__apply-btn btn'
                        onClick={this.applyPromotionHandler(cartState)}
                        disabled={!this.state.canApply}
                        {...attributes}
                    />
                </div>
            </form>
        );
    };

    /**
     * Remove promo code method.
     * @param cartState - Cart state interface.
     * @param event - Mouse event.
     */
    private readonly _removePromotion = (cartState: ICartState | undefined, event: React.MouseEvent) => {
        if (!cartState) {
            return;
        }
        const code = event.currentTarget.getAttribute('data-value') ?? '';
        cartState
            .removePromoCodes({
                promoCodes: [code]
            })
            .then(result => {
                if (result.status === 'SUCCESS') {
                    this.setState({ error: '' });
                }
            })
            .catch(() => {
                this.setState({ error: this.props.failedToRemovePromoCodeErrorText });
            });
    };

    /**
     * Renders applied promo code form.
     * @param props - Promo code component props.
     * @returns Applied promo code.
     */
    private readonly _renderAppliedPromoCode = (props: IPromoCodeProps) => {
        if (!props.cart || !props.cart.cart.Coupons || !ArrayExtensions.hasElements(props.cart.cart.Coupons)) {
            return;
        }

        /**
         * On remove promotion action.
         * @param event - Mouse event.
         */
        const removePromotionHandler = (event: React.MouseEvent<HTMLElement>) => {
            this._removePromotion(props.cart, event);
        };

        return (
            <>
                {props.cart.cart.Coupons.map((coupon: Coupon) => {
                    const ariaLabel = props.removePromoAriaLabelFormat
                        ? format(props.removePromoAriaLabelFormat, props.removePromoText, coupon.Code)
                        : '';

                    return (
                        <div key={coupon.Code} className='msc-promo-code__line-container'>
                            <div className='msc-promo-code__line-value'>
                                {'Code '}
                                <span className='msc-promo-code__line-value-code'>{coupon.Code}</span>
                                {'Applied '}
                            </div>
                            <Button
                                title={props.removePromoText}
                                className='msc-promo-code__line__btn-remove'
                                onClick={removePromotionHandler}
                                data-value={coupon.Code}
                                aria-label={ariaLabel}
                            />
                        </div>
                    );
                })}
            </>
        );
    };
}

export default PromoCode;
