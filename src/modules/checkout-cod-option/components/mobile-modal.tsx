import React, { useState } from 'react';
import { INodeProps, Node, Modal, Button } from '@msdyn365-commerce-modules/utilities';
import { IImageData, Image } from '@msdyn365-commerce/core';
import { ICheckoutGiftCardViewProps } from '../checkout-cod-option';
import { PhoneRegex } from '@msdyn365-commerce-modules/retail-actions';

interface MobileModalProps {
    isOpen: boolean;
    resources: {
        mobileNumberHeadingLabel: string;
        mobileNumberHeadingDescription: string;
        mobileNumberInputLabel: string;
        mobileNumberCodeMessage: string;
        mobileNumberGetOTPText: string;
        otpVerificationHeadingLabel: string;
        otpVerificationChangePhoneLabel: string;
        otpVerificationValidationMessage: string;
        otpVerificationConfirmOtpLabel: string;
        otpVerificationResendLabel: string;
    };
    props: ICheckoutGiftCardViewProps;
    codMobileNumber: string | undefined;
}

const MobileModal: React.FC<MobileModalProps> = ({ isOpen, resources, props, codMobileNumber }) => {
    const [currentStep, setCurrentStep] = useState<'enterMobile' | 'verifyOtp'>('enterMobile');
    const [mobileNumber, setMobileNumber] = useState<string>(codMobileNumber || '');
    const [mobileNumberOTP, setMobileNumberOTP] = useState('');
    const [otpFromResponse, setOtpFromResponse] = useState('');
    const [otpErrorMessage, setOtpErrorMessage] = useState('');
    const [mobileNumberErrorMessage, setMobileNumberErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleMobileNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMobileNumber(e.target.value);
    };

    const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (/^\d{0,4}$/.test(value)) {
            setMobileNumberOTP(value);
        }
    };

    const handleMobileNumberSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const mobileNumberPattern = new RegExp(PhoneRegex.defaultRegex); // Create RegExp object using the pattern
        if (!mobileNumberPattern.test(mobileNumber)) {
            setMobileNumberErrorMessage('Please enter a valid mobile number.');
            return;
        }

        setLoading(true);
        const cRetailURL = props.context.request.apiSettings.baseUrl;
        const cRetailOUN = props.context.request.apiSettings.oun ? props.context.request.apiSettings.oun : '';

        const cKORSendOTP = `${cRetailURL}commerce/KORSendOTP?api-version=7.3`;
        try {
            // Replace this with your actual API call
            const response = await fetch(cKORSendOTP, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    OUN: cRetailOUN,
                    'User-Agent': 'Mozilla/5.0 (Windows NT 6.3; Win64; x64; rv:58.0) Gecko/20100101 Firefox/58.0'
                },
                body: JSON.stringify({ MobileNumer: mobileNumber })
            });

            const result = await response.json();

            if (response.ok && result.isOtpSent) {
                setCurrentStep('verifyOtp');
                setOtpFromResponse('1234');
                setMobileNumberErrorMessage('');
            } else {
                // Handle error in sending OTP
                setMobileNumberErrorMessage(result.errorMessage || 'Failed to send OTP. Please try again.');
                setCurrentStep('verifyOtp');
                setOtpFromResponse('1234');
            }
        } catch (error) {
            setMobileNumberErrorMessage('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleOtpSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Implement your OTP verification logic
        const isOtpValid = mobileNumberOTP === otpFromResponse;
        setLoading(false);

        if (isOtpValid) {
            // Handle successful OTP verification
            props.setOTPVerified(isOtpValid);
            props.closeModal();
            props.handleCODButtonCheck(true);
            props.setCodSelected();
        } else {
            setOtpErrorMessage(resources.otpVerificationValidationMessage);
        }
    };

    const _notifyMeModalContainer = (): INodeProps => {
        return {
            tag: Modal,
            placement: 'center',
            hideArrow: true,
            className: 'ms-mobile-number-verify_modal-container',
            wrapClassName: 'ms-mobile-number-verify__modal',
            isOpen,
            toggle: props.closeModal
        };
    };

    const renderMobileNumberOTPImage = (props: ICheckoutGiftCardViewProps): JSX.Element | null => {
        const mobileNumberOTPImage: IImageData | undefined = props.config.mobileNumberOTPImage;
        if (!mobileNumberOTPImage || !mobileNumberOTPImage.src) {
            return null;
        }
        return (
            <Image
                altText={mobileNumberOTPImage.altText}
                className='msc-autoSuggest__productResults-no-results-image-img'
                gridSettings={props.context.request.gridSettings!}
                src={mobileNumberOTPImage.src}
            />
        );
    };

    const renderOTPVerificationImage = (props: ICheckoutGiftCardViewProps): JSX.Element | null => {
        const otpVerificationImage: IImageData | undefined = props.config.otpVerificationImage;
        if (!otpVerificationImage || !otpVerificationImage.src) {
            return null;
        }
        return (
            <Image
                altText={otpVerificationImage.altText}
                className='msc-autoSuggest__productResults-no-results-image-img'
                gridSettings={props.context.request.gridSettings!}
                src={otpVerificationImage.src}
            />
        );
    };

    return (
        <Node {..._notifyMeModalContainer()}>
            <Node className='ms-mobile-number-verify__header msc-modal__header'>
                <Button className='msc-modal__close-button' aria-label='Close' onClick={props.closeModal}></Button>
            </Node>
            <Node className='ms-mobile-number-verify__body msc-modal__body'>
                {loading && <p>Loading...</p>}
                {!loading && currentStep === 'enterMobile' && (
                    <form onSubmit={handleMobileNumberSubmit}>
                        {renderMobileNumberOTPImage(props)}
                        <h2>{resources.mobileNumberHeadingLabel}</h2>
                        <p>{resources.mobileNumberHeadingDescription}</p>
                        <input
                            type='text'
                            value={mobileNumber}
                            onChange={handleMobileNumberChange}
                            placeholder={resources.mobileNumberInputLabel}
                        />
                        {mobileNumberErrorMessage && <p className='error'>{mobileNumberErrorMessage}</p>}
                        <Button type='submit'>{resources.mobileNumberGetOTPText}</Button>
                    </form>
                )}
                {!loading && currentStep === 'verifyOtp' && (
                    <form onSubmit={handleOtpSubmit}>
                        {renderOTPVerificationImage(props)}
                        <h2>{resources.otpVerificationHeadingLabel}</h2>
                        <Button className='msc-change_phone-button' onClick={() => setCurrentStep('enterMobile')}>
                            {resources.otpVerificationChangePhoneLabel}
                        </Button>
                        <input type='text' value={mobileNumberOTP} onChange={handleOtpChange} placeholder='Enter OTP' />
                        {otpErrorMessage && <p className='error'>{otpErrorMessage}</p>}
                        <Button type='submit'>{resources.otpVerificationConfirmOtpLabel}</Button>
                    </form>
                )}
            </Node>
        </Node>
    );
};

export default MobileModal;
