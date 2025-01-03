// path: src/components/UnitsDropDown.tsx
// show a dropdown list with all the units

'use client';

import React, {useEffect, useState} from 'react';

import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from '@/components/ui/select';
import {Label} from '@/components/ui/label';
import {useToast} from '@/hooks/use-toast';

interface UnitDropDownProps {
    onSubmit: (data: any) => Promise<void>;
    data: any;
}

export default function UnitsDropDown({onSubmit, data}: UnitDropDownProps) {
    const {toast} = useToast();
    const [loading, setLoading] = useState(false);



    return (
        <div className="space-y-2">

        </div>
    );
}