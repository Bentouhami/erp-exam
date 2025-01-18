// path: src/lib/utils/accessControlHelper.ts


import {Session} from "next-auth";

export const accessControlHelper = {
    canManageUsers: ( session : Session) => {
        const isSuperAdmin = session?.user?.role === 'SUPER_ADMIN';
        const isAdm = session?.user?.role === 'ADMIN';
        return isSuperAdmin || isAdm;
    }
}