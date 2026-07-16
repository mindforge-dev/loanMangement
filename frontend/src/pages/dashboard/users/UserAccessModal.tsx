import { useEffect, useMemo, useState } from "react";
import {
    useRoles,
    usePermissions,
    useAssignRoles,
    useSyncPermissions,
} from "../../../hooks/useUsers";
import type { User } from "../../../services/userService";

interface UserAccessModalProps {
    user: User | null;
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

function titleCase(mod: string): string {
    return mod
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
}

export default function UserAccessModal({
    user,
    isOpen,
    onClose,
    onSuccess,
}: UserAccessModalProps) {
    const { data: roles = [] } = useRoles();
    const { data: permissions = [] } = usePermissions();
    const assignRolesMutation = useAssignRoles();
    const syncPermissionsMutation = useSyncPermissions();

    const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
    const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
    const [submitError, setSubmitError] = useState<string | null>(null);

    // Reset selections whenever the target user changes
    useEffect(() => {
        if (user) {
            setSelectedRoles(user.roles ?? []);
            setSelectedPermissions(user.permissions ?? []);
            setSubmitError(null);
        }
    }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

    // Group permissions by module prefix (e.g. "users:view" -> "users")
    const groupedPermissions = useMemo(() => {
        const map = new Map<string, string[]>();
        for (const p of permissions) {
            const [mod] = p.name.split(":");
            if (!map.has(mod)) map.set(mod, []);
            map.get(mod)!.push(p.name);
        }
        return [...map.entries()].sort((a, b) => a[0].localeCompare(b[0]));
    }, [permissions]);

    const toggleRole = (name: string) =>
        setSelectedRoles((prev) =>
            prev.includes(name) ? prev.filter((r) => r !== name) : [...prev, name],
        );

    const togglePermission = (name: string) =>
        setSelectedPermissions((prev) =>
            prev.includes(name)
                ? prev.filter((p) => p !== name)
                : [...prev, name],
        );

    const isSaving =
        assignRolesMutation.isPending || syncPermissionsMutation.isPending;

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        setSubmitError(null);
        try {
            await Promise.all([
                assignRolesMutation.mutateAsync({
                    id: user.id,
                    roles: selectedRoles,
                }),
                syncPermissionsMutation.mutateAsync({
                    id: user.id,
                    permissions: selectedPermissions,
                }),
            ]);
            onSuccess?.();
            onClose();
        } catch (err) {
            console.error("Failed to update user access:", err);
            setSubmitError(
                "Failed to update access. Check that you have the users:manage permission.",
            );
        }
    };

    if (!isOpen || !user) return null;

    const Chip = ({
        label,
        active,
        onClick,
    }: {
        label: string;
        active: boolean;
        onClick: () => void;
    }) => (
        <button
            type="button"
            onClick={onClick}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                active
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                    : "bg-white text-gray-600 border-gray-300 hover:border-indigo-400 hover:text-indigo-600"
            }`}
        >
            {label}
        </button>
    );

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            <div className="flex min-h-full items-center justify-center p-4">
                <div
                    className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl transform transition-all"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="relative px-8 pt-8 pb-6 border-b border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                                    Manage Access
                                </h2>
                                <p className="mt-1 text-sm text-gray-500">
                                    Assign roles &amp; permissions for{" "}
                                    <span className="font-semibold text-gray-700">
                                        {user.name}
                                    </span>{" "}
                                    ({user.email})
                                </p>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                                disabled={isSaving}
                            >
                                <svg
                                    className="w-6 h-6 text-gray-400"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <form onSubmit={handleSave} className="px-8 py-6 space-y-8">
                        {/* Roles */}
                        <div>
                            <h3 className="text-sm font-semibold text-gray-700 mb-1">
                                Roles
                            </h3>
                            <p className="text-xs text-gray-400 mb-3">
                                Roles grant a bundle of permissions. The{" "}
                                <span className="font-medium">super-admin</span>{" "}
                                role bypasses all permission checks.
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {roles.length === 0 && (
                                    <p className="text-sm text-gray-400">
                                        No roles available.
                                    </p>
                                )}
                                {roles.map((role) => (
                                    <Chip
                                        key={role.id}
                                        label={role.name}
                                        active={selectedRoles.includes(role.name)}
                                        onClick={() => toggleRole(role.name)}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Direct permissions */}
                        <div>
                            <h3 className="text-sm font-semibold text-gray-700 mb-1">
                                Direct Permissions
                            </h3>
                            <p className="text-xs text-gray-400 mb-3">
                                Extra permissions granted directly to this user
                                (in addition to those from roles).
                            </p>
                            <div className="space-y-4 max-h-72 overflow-y-auto pr-2">
                                {groupedPermissions.map(([mod, perms]) => (
                                    <div key={mod}>
                                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
                                            {titleCase(mod)}
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {perms.map((name) => {
                                                const action = name.split(":")[1];
                                                return (
                                                    <Chip
                                                        key={name}
                                                        label={action}
                                                        active={selectedPermissions.includes(
                                                            name,
                                                        )}
                                                        onClick={() =>
                                                            togglePermission(name)
                                                        }
                                                    />
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {submitError && (
                            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-sm text-red-600">{submitError}</p>
                            </div>
                        )}

                        {/* Footer */}
                        <div className="flex gap-4 justify-end pt-2 border-t border-gray-100">
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={isSaving}
                                className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSaving}
                                className="px-6 py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold hover:from-indigo-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {isSaving ? (
                                    <>
                                        <svg
                                            className="animate-spin h-5 w-5"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            ></circle>
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            ></path>
                                        </svg>
                                        Saving...
                                    </>
                                ) : (
                                    "Save Changes"
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
