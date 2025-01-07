'use client'

import React from 'react';
import { MultiStepRegistrationForm } from './MultiStepRegistrationForm';

export const NewAdmin: React.FC = () => {
    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Create New Admin</h1>
            <MultiStepRegistrationForm role="ADMIN" />
        </div>
    );
};

