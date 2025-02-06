'use client'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { toast } from 'react-toastify'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {API_DOMAIN} from "@/lib/utils/constants";
import apiClient from "@/lib/axiosInstance";
import {useRouter} from "next/navigation";

// Update the Zod schema to handle empty strings as null
const userSchema = z.object({
    firstName: z.string().min(1, 'Required'),
    lastName: z.string().min(1, 'Required'),
    name: z.string().min(1, 'Required'),
    email: z.string().email(),
    role: z.enum(['CUSTOMER', 'ADMIN', 'ACCOUNTANT', 'SUPER_ADMIN']),
    isEnterprise: z.boolean().optional(),
    companyName: z.preprocess(
        (val) => val === "" ? null : val,
        z.string().nullable().optional()
    ),
    vatNumber: z.preprocess(
        (val) => val === "" ? null : val,
        z.string().nullable().optional()
    ),
    phone: z.preprocess(
        (val) => val === "" ? null : val,
        z.string().nullable().optional()
    ),
    mobile: z.preprocess(
        (val) => val === "" ? null : val,
        z.string().nullable().optional()
    ),
    fax: z.preprocess(
        (val) => val === "" ? null : val,
        z.string().nullable().optional()
    ),
    paymentTermDays: z.preprocess(
        (val) => val === "" ? null : Number(val),
        z.number().nullable().optional()
    ),
})

type FormData = z.infer<typeof userSchema>

export default function UsersForm({ userId }: { userId: string }) {
    const { data: session } = useSession()
    const [user, setUser] = useState<FormData | null>(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        setValue,
        reset,
    } = useForm<FormData>({
        resolver: zodResolver(userSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            name: '',
            email: '',
            role: 'CUSTOMER',
            isEnterprise: false,
            companyName: '',
            vatNumber: '',
            phone: '',
            mobile: '',
            fax: '',
            paymentTermDays: 0,
        }
    })

    const isEnterprise = watch('isEnterprise')
    const currentUserRole = session?.user?.role
    const isStaff = ['ADMIN', 'ACCOUNTANT', 'SUPER_ADMIN'].includes(user?.role || '')

    // Update the fetchUser effect to handle null values
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch(`${API_DOMAIN}/users/${userId}`)
                if (!response.ok) throw new Error('Failed to fetch user')
                const data: FormData = await response.json()

                // Convert null values to empty strings for form inputs
                const formData = {
                    ...data,

                    companyName: data.companyName || '',
                    vatNumber: data.vatNumber || '',
                    phone: data.phone || '',
                    mobile: data.mobile || '',
                    fax: data.fax || '',
                    paymentTermDays: data.paymentTermDays || null,
                }

                setUser(formData)
                reset(formData)
                setLoading(false)
            } catch (error) {
                toast.error('Failed to load user data')
                setLoading(false)
            }
        }
        fetchUser()
    }, [userId, reset])

    const onSubmit = async (data: FormData) => {
        try {
            const response = await apiClient.put(`${API_DOMAIN}/users/${userId}`, data);
            if (response.status !== 201) throw new Error('Failed to update user');
            toast.success('User updated successfully');
            reset(data);
            setLoading(false);
            setUser(data);
            router.push(`/dashboard/users`);
        } catch (error) {
            toast.error('Failed to update user')
        }
    }

    if (loading) return <div>Loading...</div>

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label>First Name</Label>
                    <Input {...register('firstName')} />
                    {errors.firstName && (
                        <span className="text-red-500 text-sm">
                            {errors.firstName.message?.toString()}
                        </span>
                    )}
                </div>

                <div>
                    <Label>Last Name</Label>
                    <Input {...register('lastName')} />
                    {errors.lastName && (
                        <span className="text-red-500 text-sm">
                            {errors.lastName.message?.toString()}
                        </span>
                    )}
                </div>

                <div>
                    <Label>Name</Label>
                    <Input {...register('name')} />
                    {errors.name && (
                        <span className="text-red-500 text-sm">
                            {errors.name.message?.toString()}
                        </span>
                    )}
                </div>

                <div className="col-span-2">
                    <Label>Email</Label>
                    <Input type="email" {...register('email')} />
                    {errors.email && (
                        <span className="text-red-500 text-sm">
                            {errors.email.message?.toString()}
                        </span>
                    )}
                </div>

                {currentUserRole === 'SUPER_ADMIN' && (
                    <div className="col-span-2">
                        <Label>Role</Label>
                        <select
                            {...register('role')}
                            className="w-full p-2 border rounded"
                            disabled={currentUserRole !== 'SUPER_ADMIN'}
                        >
                            <option value="CUSTOMER">Customer</option>
                            <option value="ADMIN">Admin</option>
                            <option value="ACCOUNTANT">Accountant</option>
                            <option value="SUPER_ADMIN">Super Admin</option>
                        </select>
                    </div>
                )}

                {user?.role === 'CUSTOMER' && (
                    <>
                        <div className="col-span-2 flex items-center gap-2">
                            <Label>Enterprise Customer?</Label>
                            <Switch
                                checked={isEnterprise}
                                onCheckedChange={(val) => setValue('isEnterprise', val)}
                            />
                        </div>

                        {isEnterprise && (
                            <>
                                <div>
                                    <Label>Company Name</Label>
                                    <Input {...register('companyName')} />
                                </div>
                                <div>
                                    <Label>VAT Number</Label>
                                    <Input {...register('vatNumber')} />
                                </div>
                            </>
                        )}
                    </>
                )}

                <div>
                    <Label>Phone</Label>
                    <Input {...register('phone')} />
                    {errors.phone && (
                        <span className="text-red-500 text-sm">
                            {errors.phone.message?.toString()}
                        </span>
                    )}
                </div>

                <div>
                    <Label>Mobile</Label>
                    <Input {...register('mobile')} />
                    {errors.mobile && (
                        <span className="text-red-500 text-sm">
                            {errors.mobile.message?.toString()}
                        </span>
                    )}
                </div>

                <div>
                    <Label>Fax</Label>
                    <Input {...register('fax')} />
                    {errors.fax && (
                        <span className="text-red-500 text-sm">
                            {errors.fax.message?.toString()}
                        </span>
                    )}
                </div>

                <div>
                    <Label>Payment Terms (days)</Label>
                    <Input
                        type="number"
                        {...register('paymentTermDays', { valueAsNumber: true })}
                    />
                    {errors.paymentTermDays && (
                        <span className="text-red-500 text-sm">
                            {errors.paymentTermDays.message?.toString()}
                        </span>
                    )}
                </div>
            </div>

            {isStaff && (
                <div className="mt-6">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => {/* Implement password reset logic */}
                        }
                    >
                        Reset Password
                    </Button>
                </div>
            )}

            <Button type="submit" className="mt-6">
                Save Changes
            </Button>
        </form>
    )
}