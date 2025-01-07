'use client'

import React from 'react';
import { MultiStepRegistrationForm } from './MultiStepRegistrationForm';

export const NewAccountant: React.FC = () => {
    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Create New Accountant</h1>
            <MultiStepRegistrationForm role="ACCOUNTANT" />
        </div>
    );
};

