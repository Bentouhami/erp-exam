// path: src/components/users/UsersList.tsx

'use client';

import React, {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {ArrowUpDown, MoreHorizontal} from 'lucide-react';
import {toast} from 'react-toastify';
import {ListSkeleton} from "@/components/skeletons/ListSkeleton";
import axios from "axios";
import {API_DOMAIN} from "@/lib/utils/constants";

type User = {
    id: string;
    userNumber: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
};

type SortConfig = {
    key: keyof User;
    direction: 'asc' | 'desc';
};

interface UsersListProps {
    role?: string;
}

export default function UsersList({role}: UsersListProps) {
    const [users, setUsers] = useState<User[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState<SortConfig>({key: 'userNumber', direction: 'asc'});
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(10);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        fetchUsers();
    }, [role]);

    useEffect(() => {
        const filtered = users.filter(user =>
            Object.values(user).some(value =>
                value.toString().toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
        setFilteredUsers(filtered);
        setCurrentPage(1);
    }, [searchTerm, users]);

    const fetchUsers = async () => {
        if (!role) {
            console.warn('Role is undefined, skipping fetchUsers');
            return;
        }

        setLoading(true);

        try {
            const response = await axios.get(`${API_DOMAIN}/users/role/${role}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 200) {
                const data = response.data;
                setUsers(data);
                setFilteredUsers(data);
            } else {
                throw new Error('Failed to fetch users');
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            toast.error('Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };


    const handleSort = (key: keyof User) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({key, direction});

        const sortedUsers = [...filteredUsers].sort((a, b) => {
            if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
            if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
            return 0;
        });
        setFilteredUsers(sortedUsers);
    };

    const handleEdit = (userId: string) => {
        router.push(`/users/${userId}/edit`);
    };

    const handleDelete = async (userId: string) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                const response = await fetch(`/api/v1/users/${userId}`, {
                    method: 'DELETE',
                });
                if (!response.ok) {
                    throw new Error('Failed to delete user');
                }
                toast.success('User deleted successfully');
                fetchUsers();
            } catch (error) {
                console.error('Error deleting user:', error);
                toast.error('Failed to delete user');
            }
        }
    };

    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    if (loading) {
        return <ListSkeleton/>;
    }

    return (
        <div className="space-y-4">

            {/* Search section */}
            <Input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
            />

            {/* Users' table */}
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>
                            <Button variant="ghost" onClick={() => handleSort('userNumber')}>
                                User Number
                                <ArrowUpDown className="ml-2 h-4 w-4"/>
                            </Button>
                        </TableHead>
                        <TableHead>
                            <Button variant="ghost" onClick={() => handleSort('firstName')}>
                                First Name
                                <ArrowUpDown className="ml-2 h-4 w-4"/>
                            </Button>
                        </TableHead>
                        <TableHead>
                            <Button variant="ghost" onClick={() => handleSort('lastName')}>
                                Last Name
                                <ArrowUpDown className="ml-2 h-4 w-4"/>
                            </Button>
                        </TableHead>
                        <TableHead>
                            <Button variant="ghost" onClick={() => handleSort('email')}>
                                Email
                                <ArrowUpDown className="ml-2 h-4 w-4"/>
                            </Button>
                        </TableHead>
                        <TableHead>
                            <Button variant="ghost" onClick={() => handleSort('role')}>
                                Role
                                <ArrowUpDown className="ml-2 h-4 w-4"/>
                            </Button>
                        </TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {currentUsers.map((user) => (
                        <TableRow key={user.id}>
                            <TableCell>{user.userNumber}</TableCell>
                            <TableCell>{user.firstName}</TableCell>
                            <TableCell>{user.lastName}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.role}</TableCell>
                            <TableCell className="text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                            <span className="sr-only">Open menu</span>
                                            <MoreHorizontal className="h-4 w-4"/>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end"> <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                        <DropdownMenuItem onClick={() => handleEdit(user.id)}>Edit</DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() => handleDelete(user.id)}>Delete</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <div className="flex justify-between items-center">
                <div>
                    Showing {indexOfFirstUser + 1} to {Math.min(indexOfLastUser, filteredUsers.length)} of {filteredUsers.length} users
                </div>
                <div className="flex space-x-2">
                    <Button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
                        Previous
                    </Button>
                    <Button onClick={() => paginate(currentPage + 1)}
                            disabled={indexOfLastUser >= filteredUsers.length}>
                        Next
                    </Button>
                </div>
            </div>
        </div>
    );
}
