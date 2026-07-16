import { useState } from "react";
import { useRoles, usePermissions } from "../../../hooks/useUsers";
import { useHasPermission } from "../../../hooks/useAuth";
import { Permissions } from "../../../lib/permissions";
import CreateRoleModal from "../users/CreateRoleModal";
import CreatePermissionModal from "../users/CreatePermissionModal";

function Settings() {
    const { data: roles = [], isLoading: loadingRoles } = useRoles();
    const { data: permissions = [], isLoading: loadingPerms } = usePermissions();
    const canManage = useHasPermission(Permissions.USERS_MANAGE);

    const [activeSubTab, setActiveSubTab] = useState<"general" | "rbac">("general");
    const [showCreateRole, setShowCreateRole] = useState(false);
    const [showCreatePermission, setShowCreatePermission] = useState(false);

    // Mock form states
    const [currency, setCurrency] = useState("USD");
    const [timezone, setTimezone] = useState("UTC");
    const [theme, setTheme] = useState("light");

    return (
        <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div>
                <h2 className="text-3xl font-extrabold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">Settings</h2>
                <p className="text-gray-500 mt-1.5 text-sm">Configure system settings and manage access controls</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Nested sub-navigation */}
                <div className="w-full lg:w-64 shrink-0 flex flex-row lg:flex-col gap-2 border-b lg:border-b-0 lg:border-r border-gray-200 pb-4 lg:pb-0 lg:pr-6">
                    <button
                        onClick={() => setActiveSubTab("general")}
                        className={`flex-1 lg:flex-initial px-4 py-3 rounded-xl text-sm font-semibold text-left transition-all ${
                            activeSubTab === "general"
                                ? "bg-indigo-50 text-indigo-700 shadow-sm"
                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        }`}
                    >
                        General Settings
                    </button>
                    <button
                        onClick={() => setActiveSubTab("rbac")}
                        className={`flex-1 lg:flex-initial px-4 py-3 rounded-xl text-sm font-semibold text-left transition-all ${
                            activeSubTab === "rbac"
                                ? "bg-indigo-50 text-indigo-700 shadow-sm"
                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        }`}
                    >
                        Roles &amp; Permissions
                    </button>
                </div>

                {/* Tab content */}
                <div className="flex-1">
                    {activeSubTab === "general" && (
                        <div className="space-y-6 max-w-2xl">
                            {/* Profile Mock Settings */}
                            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
                                <h3 className="text-lg font-bold text-gray-900">Application Configuration</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Base Currency</label>
                                        <select
                                            value={currency}
                                            onChange={(e) => setCurrency(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none bg-white text-gray-900"
                                        >
                                            <option value="USD">USD ($)</option>
                                            <option value="EUR">EUR (€)</option>
                                            <option value="GBP">GBP (£)</option>
                                            <option value="MMK">MMK (K)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Timezone</label>
                                        <select
                                            value={timezone}
                                            onChange={(e) => setTimezone(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none bg-white text-gray-900"
                                        >
                                            <option value="UTC">UTC (GMT+0)</option>
                                            <option value="EST">EST (GMT-5)</option>
                                            <option value="MMT">MMT (GMT+6:30)</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Security Mock Settings */}
                            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
                                <h3 className="text-lg font-bold text-gray-900">Security Preferences</h3>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">System Theme</label>
                                    <div className="flex gap-4">
                                        {["light", "dark", "system"].map((t) => (
                                            <button
                                                key={t}
                                                onClick={() => setTheme(t)}
                                                className={`px-4 py-2 text-xs font-semibold rounded-lg border capitalize transition-all ${
                                                    theme === t
                                                        ? "bg-indigo-600 border-indigo-600 text-white shadow-sm"
                                                        : "bg-white border-gray-300 text-gray-600 hover:bg-gray-50"
                                                }`}
                                            >
                                                {t}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <button
                                type="button"
                                className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-blue-700 transition-all shadow-md"
                                onClick={() => alert("Configurations updated successfully (mocked)!")}
                            >
                                Save Settings
                            </button>
                        </div>
                    )}

                    {activeSubTab === "rbac" && (
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                            {/* Roles Card */}
                            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
                                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900">System Roles</h3>
                                        <p className="text-xs text-gray-500 mt-0.5">Define role entities and bundle permissions</p>
                                    </div>
                                    {canManage && (
                                        <button
                                            onClick={() => setShowCreateRole(true)}
                                            className="px-4 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors shadow-sm"
                                        >
                                            + Add Role
                                        </button>
                                    )}
                                </div>
                                <div className="p-6 divide-y divide-gray-100 max-h-[600px] overflow-y-auto flex-1">
                                    {loadingRoles ? (
                                        <div className="py-8 text-center text-sm text-gray-400">Loading roles...</div>
                                    ) : roles.length === 0 ? (
                                        <p className="text-sm text-gray-500 text-center py-4">No roles defined.</p>
                                    ) : (
                                        roles.map((role) => (
                                            <div key={role.id} className="py-4 first:pt-0 last:pb-0">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-sm font-bold text-gray-800 bg-gray-100 px-2.5 py-1 rounded-md">
                                                        {role.name}
                                                    </span>
                                                    <span className="text-xs text-gray-400">
                                                        {(role.permissions ?? []).length} permissions
                                                    </span>
                                                </div>
                                                <div className="flex flex-wrap gap-1.5 mt-2">
                                                    {(role.permissions ?? []).length === 0 ? (
                                                        <span className="text-xs text-gray-400 italic">No permissions assigned (full bypass for super-admin).</span>
                                                    ) : (
                                                        (role.permissions ?? []).map((perm) => (
                                                            <span
                                                                key={perm.id}
                                                                className="px-2 py-0.5 text-xs font-medium rounded bg-indigo-50 text-indigo-700 border border-indigo-100/50"
                                                            >
                                                                {perm.name}
                                                            </span>
                                                        ))
                                                    )}
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>

                            {/* Permissions Card */}
                            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
                                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900">System Permissions</h3>
                                        <p className="text-xs text-gray-500 mt-0.5">Manage fine-grained capabilities</p>
                                    </div>
                                    {canManage && (
                                        <button
                                            onClick={() => setShowCreatePermission(true)}
                                            className="px-4 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors shadow-sm"
                                        >
                                            + Add Permission
                                        </button>
                                    )}
                                </div>
                                <div className="p-6 max-h-[600px] overflow-y-auto flex-1">
                                    {loadingPerms ? (
                                        <div className="py-8 text-center text-sm text-gray-400">Loading permissions...</div>
                                    ) : permissions.length === 0 ? (
                                        <p className="text-sm text-gray-500 text-center py-4">No permissions defined.</p>
                                    ) : (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {permissions.map((perm) => (
                                                <div
                                                    key={perm.id}
                                                    className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between"
                                                >
                                                    <span className="text-xs font-mono font-semibold text-gray-700">
                                                        {perm.name}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Modals */}
            <CreateRoleModal
                isOpen={showCreateRole}
                onClose={() => setShowCreateRole(false)}
            />

            <CreatePermissionModal
                isOpen={showCreatePermission}
                onClose={() => setShowCreatePermission(false)}
            />
        </div>
    );
}

export default Settings;
