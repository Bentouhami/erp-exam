// path: src/app/dashboard/users/page.tsx

'use client';

import UsersList from "@/components/lists/UsersList";
import {useEffect, useState} from "react";
import {useSession} from "next-auth/react";
import RequireAuth from "@/components/auth/RequireAuth";

export default function UsersPage() {
    const {data: session, status,} = useSession();
    const [role, setRole] = useState('');

    useEffect(() => {
        // get users based on the role
        if (status === 'unauthenticated') {
            return;
        }
        setRole(session?.user?.role);
    }, [status, role]);
    //
    // useEffect(() => {
    //     if (role) {
    //         // fetch users based on the role
    //         fetch(`/api/users?role=${role}`)
    //             .then((response) => response.json())
    //             .then((data) => {
    //                 setUsers(data);
    //             });
    //     }
    // }, [role]);


    return (
        <RequireAuth>
            <div className="container mx-auto py-10">
                <h1 className="text-3xl font-bold mb-6">Users Management</h1>
                <UsersList role={role}/>
            </div>
        </RequireAuth>
    );
}

