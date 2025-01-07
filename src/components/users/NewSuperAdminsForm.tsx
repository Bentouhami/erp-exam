'use client'

import React from 'react';
import { MultiStepRegistrationForm } from './MultiStepRegistrationForm';

export const NewSuperAdmin: React.FC = () => {
    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Create New Super Admin</h1>
            <MultiStepRegistrationForm role="SUPER_ADMIN" />
        </div>
    );
};

