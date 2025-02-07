import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

type User = {
    id: string;
    firstName: string;
    lastName: string;
    userNumber: string;
    vatNumber?: string;
    name: string;
    isEnterprise: boolean;
    paymentTermDays: number;
    companyName?: string;
    companyNumber?: string;
    exportNumber?: string;
    email: string;
    phone?: string;
    mobile?: string;
    createdAt: string;
    countryId?: number;
    countryName?: string;
};

interface CustomerSelectProps {
    customersList: User[];
    selectedUserId?: string;
    onSelect: (userId: string) => void;
}

export default function CustomerSelect({ customersList, selectedUserId, onSelect }: CustomerSelectProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const customersPerPage = 5; // ✅ Adjust number of customers per page

    // Filter customers based on search term
    const filteredUsers = customersList.filter(user =>
        user.userNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.vatNumber && user.vatNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (user.countryName && user.countryName.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    // Pagination Logic
    const totalPages = Math.ceil(filteredUsers.length / customersPerPage);
    const paginatedUsers = filteredUsers.slice(
        (currentPage - 1) * customersPerPage,
        currentPage * customersPerPage
    );

    const selectedUser = customersList.find(u => u.id === selectedUserId);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left">
                    {selectedUser
                        ? `${selectedUser.name} (${selectedUser.userNumber}) - ${selectedUser.countryName || 'Unknown'}`
                        : 'Select a customer'}
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Select Customer</DialogTitle>
                </DialogHeader>
                <Input
                    placeholder="Search by customer number, name, VAT number, or country..."
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1); // Reset to first page on new search
                    }}
                    className="mb-4"
                />
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Customer Number</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>VAT Number</TableHead>
                            <TableHead>Country</TableHead>
                            <TableHead>Payment Terms</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedUsers.map((user) => (
                            <TableRow
                                key={user.id}
                                className="cursor-pointer hover:bg-gray-100"
                                onClick={() => {
                                    onSelect(user.id);
                                    setIsOpen(false);
                                }}
                            >
                                <TableCell>{user.userNumber}</TableCell>
                                <TableCell>{user.isEnterprise ? 'Enterprise' : 'Individual'}</TableCell>
                                <TableCell>{user.name}</TableCell>
                                <TableCell>{user.vatNumber || '-'}</TableCell>
                                <TableCell>{user.countryName || '-'}</TableCell>
                                <TableCell>{user.paymentTermDays || '-'}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                {/* Pagination Controls */}
                <div className="flex justify-between items-center mt-4">
                    <Button
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </Button>
                    <span>
                        Page {currentPage} of {totalPages}
                    </span>
                    <Button
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage >= totalPages}
                    >
                        Next
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
