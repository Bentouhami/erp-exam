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

// Define the form type using Zod inference
const userSchema = z.object({
    firstName: z.string().min(1, 'Required'),
    lastName: z.string().min(1, 'Required'),
    email: z.string().email(),
    role: z.enum(['CUSTOMER', 'ADMIN', 'ACCOUNTANT', 'SUPER_ADMIN']),
    isEnterprise: z.boolean().optional(),
    companyName: z.string().optional(),
    vatNumber: z.string().optional(),
    phone: z.string().optional(),
    mobile: z.string().optional(),
    fax: z.string().optional(),
    paymentTermDays: z.number().optional(),
})

type FormData = z.infer<typeof userSchema>

export default function UsersForm({ userId }: { userId: string }) {
    const { data: session } = useSession()
    const [user, setUser] = useState<FormData | null>(null)
    const [loading, setLoading] = useState(true)

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

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch(`/api/v1/users/${userId}`)
                if (!response.ok) throw new Error('Failed to fetch user')
                const data: FormData = await response.json()
                setUser(data)
                reset(data)
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
            const response = await fetch(`/api/v1/users/${userId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            })

            if (!response.ok) throw new Error('Failed to update user')
            toast.success('User updated successfully')
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