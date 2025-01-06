// path: src/components/StepIndicator.tsx

import { CheckIcon, UserIcon, BuildingOfficeIcon, KeyIcon } from '@heroicons/react/24/solid'

interface StepIndicatorProps {
    currentStep: number;
}

export function StepIndicator({ currentStep }: StepIndicatorProps) {
    const steps = [
        { name: 'Personal', icon: UserIcon },
        { name: 'Account', icon: KeyIcon },
    ]

    return (
        <div className="mb-8">
            <h2 className="sr-only">Steps</h2>

            <div className="after:mt-4 after:block after:h-1 after:w-full after:rounded-lg after:bg-gray-200">
                <ol className="grid grid-cols-2 text-sm font-medium text-gray-500">
                    {steps.map((step, index) => (
                        <li
                            key={step.name}
                            className={`relative flex ${
                                index === 0 ? 'justify-start' : 'justify-end'
                            } ${index < currentStep ? 'text-blue-600' : ''}`}
                        >
                            <span
                                className={`absolute -bottom-[1.75rem] ${
                                    index === 0 ? 'start-0' : 'end-0'
                                } rounded-full ${index < currentStep ? 'bg-blue-600' : 'bg-gray-600'} text-white`}
                            >
                                {index < currentStep ? (
                                    <CheckIcon className="h-5 w-5" />
                                ) : (
                                    <step.icon className="h-5 w-5" />
                                )}
                            </span>

                            <span className="hidden sm:block">{step.name}</span>

                            <step.icon className="h-6 w-6 sm:hidden" />
                        </li>
                    ))}
                </ol>
            </div>
        </div>
    )
}