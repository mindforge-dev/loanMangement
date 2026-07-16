// Frontend mirror of the backend `ModulePermission` enum (module:action strings).
// Keep these in sync with backend/src/modules/rbac/enums/permissions.ts.
export const Permissions = {
    // Users
    USERS_VIEW: 'users:view',
    USERS_MANAGE: 'users:manage',
    // Borrowers
    BORROWERS_VIEW: 'borrowers:view',
    BORROWERS_CREATE: 'borrowers:create',
    BORROWERS_EDIT: 'borrowers:edit',
    BORROWERS_DELETE: 'borrowers:delete',
    // Loans
    LOANS_VIEW: 'loans:view',
    LOANS_CREATE: 'loans:create',
    LOANS_EDIT: 'loans:edit',
    LOANS_DELETE: 'loans:delete',
    LOANS_UPDATE_STATUS: 'loans:update-status',
    // Transactions
    TRANSACTIONS_VIEW: 'transactions:view',
    TRANSACTIONS_CREATE: 'transactions:create',
    TRANSACTIONS_EDIT: 'transactions:edit',
    TRANSACTIONS_DELETE: 'transactions:delete',
    // Interest rates
    INTEREST_RATES_VIEW: 'interest-rates:view',
    INTEREST_RATES_CREATE: 'interest-rates:create',
    INTEREST_RATES_EDIT: 'interest-rates:edit',
    INTEREST_RATES_DELETE: 'interest-rates:delete',
    // Contracts
    CONTRACTS_VIEW: 'contracts:view',
    CONTRACTS_CREATE: 'contracts:create',
    CONTRACTS_DOWNLOAD: 'contracts:download',
    // Profile & Dashboard
    PROFILE_VIEW: 'profile:view',
    DASHBOARD_VIEW: 'dashboard:view',
} as const

export type Permission = (typeof Permissions)[keyof typeof Permissions]

export const SUPER_ADMIN_ROLE = 'super-admin'

export interface PermissionedUser {
    roles: string[]
    permissions: string[]
}

/** Super-admin bypasses every permission check. */
export const isSuperAdmin = (user: PermissionedUser | null | undefined): boolean =>
    !!user && user.roles.includes(SUPER_ADMIN_ROLE)

/** True if the user holds the given permission (or is a super-admin). */
export const hasPermission = (
    user: PermissionedUser | null | undefined,
    permission: string,
): boolean => {
    if (!user) return false
    if (user.roles.includes(SUPER_ADMIN_ROLE)) return true
    return user.permissions.includes(permission)
}

/** True if the user holds ANY of the given permissions (or is a super-admin). */
export const hasAnyPermission = (
    user: PermissionedUser | null | undefined,
    permissions: string[],
): boolean => {
    if (!user) return false
    if (user.roles.includes(SUPER_ADMIN_ROLE)) return true
    if (permissions.length === 0) return true
    return permissions.some((p) => user.permissions.includes(p))
}
