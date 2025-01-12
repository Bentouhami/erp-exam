// path: src/components/lists/AdminList.tsx
'use client';

import UsersList from "@/components/lists/UsersList";

export default function AdminList() {
    return (
        <UsersList role="ADMIN" />
    );
}
