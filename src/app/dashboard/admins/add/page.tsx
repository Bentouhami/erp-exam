// path: src/app/dashboard/admin/users/add/page.tsx
'use client';

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { CreateAdminDTO } from "@/services/dtos/UserDtos";

import { Button } from "@/components/ui/button";
import React, {useState} from "react";
import {RoleDTO} from "@/services/dtos/EnumsDtos";
import {RegisterForm} from "@/components/RegisterForm";

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
        role: RoleDTO.ADMIN, // Default role is ADMIN; can be changed via dropdown
    });


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
        // const newUser = await apiCalls.createAdmin(userData);
        console.log("New user created:");
        router.push("/dashboard/admin/users"); // Redirect to user list after creation
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 w-full max-w-md px-4">
            {/* Form fields for first name, last name, email, phone, mobile, password */}
            {/* Role selection dropdown */}
            <RegisterForm />

            <Button type="submit">Add User</Button>
        </form>
    );
}
