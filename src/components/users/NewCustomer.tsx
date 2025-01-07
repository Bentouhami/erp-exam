'use client'

import React from 'react';
import { MultiStepRegistrationForm } from './MultiStepRegistrationForm';

export const NewCustomer: React.FC = () => {
    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Create New Customer</h1>
            <MultiStepRegistrationForm role="CUSTOMER" />
        </div>
    );
};

