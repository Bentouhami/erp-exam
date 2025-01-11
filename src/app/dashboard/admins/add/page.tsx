// path: src/app/dashboard/admins/add/page.tsx

'use client';

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { CreateAdminDTO } from "@/services/dtos/UserDtos";

import React, { useState } from "react";
import { RoleDTO } from "@/services/dtos/EnumsDtos";
import { RegisterForm } from "@/components/RegisterForm";

export default function AddUserForm() {
    const { data: session } = useSession();
    const router = useRouter();

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        mobile: "",
        password: "",
        role: RoleDTO.ADMIN,
    });

    const updateFormData = (newData: Partial<typeof formData>) => {
        setFormData((prevData) => ({ ...prevData, ...newData }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const userData: CreateAdminDTO = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            mobile: formData.mobile,
            password: formData.password,
            role: formData.role,
        };
        console.log("New user created:", userData);
        router.push("/dashboard/admin/users");
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 w-full max-w-md px-4">
            <RegisterForm
                formData={formData}
                updateFormData={updateFormData}
                handleSubmit={handleSubmit}
            />
        </form>
    );
}
