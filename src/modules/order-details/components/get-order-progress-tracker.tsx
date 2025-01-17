import React from 'react';

interface OrderProgressTrackerProps {
    steps: string[];
    currentStep: string; // Index of the current step
}

const OrderProgressTracker: React.FC<OrderProgressTrackerProps> = ({ steps, currentStep }) => {
    // Normalize the current step
    const normalizedCurrentStep = currentStep.replace(/\s+/g, '').toLowerCase();

    // Find the index of the current step in the steps array
    const currentStepIndex = steps.findIndex(step => step.replace(/\s+/g, '').toLowerCase() === normalizedCurrentStep);

    return (
        <div className='progress-tracker'>
            <ul className='progress-list'>
                {steps.map((step, index) => {
                    // Normalize the current step for comparison
                    const normalizedStep = step.replace(/\s+/g, '').toLowerCase();

                    // Determine if the step is completed
                    const isCompleted = index <= currentStepIndex;

                    // Determine if the step is the current active step
                    const isActive = normalizedStep === normalizedCurrentStep;

                    return (
                        <li key={index} className={`progress-item ${isCompleted ? 'completed' : ''} ${isActive ? 'current' : ''}`}>
                            <div className='step-circle'>
                                <span className='step-label'></span>
                            </div>
                            <span className='step-name'>{step}</span>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default OrderProgressTracker;
