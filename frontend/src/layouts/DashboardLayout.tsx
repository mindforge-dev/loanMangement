import { useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router'
import {
    HomeIcon,
    UsersIcon,
    UserGroupIcon,
    DocumentTextIcon,
    CreditCardIcon,
    ChartBarIcon,
    CogIcon,
    Bars3Icon,
    XMarkIcon,
    BellIcon,
    UserCircleIcon
} from '@heroicons/react/24/outline'
import { useAuth } from '../hooks/useAuth'
const navigation = [
    { name: 'Dashboard', href: '/', icon: HomeIcon },
    { name: 'Users', href: '/users', icon: UsersIcon },
    { name: 'Loans', href: '/loans', icon: DocumentTextIcon },
    { name: 'Borrowers', href: '/borrowers', icon: UserGroupIcon },
    { name: 'Payments', href: '/payments', icon: CreditCardIcon },
    { name: 'Reports', href: '/reports', icon: ChartBarIcon },
    { name: 'Settings', href: '/settings', icon: CogIcon },
]

function DashboardLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const location = useLocation()
    const { user, logout } = useAuth()

    const isActive = (path: string) => {
        return location.pathname === path
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Mobile sidebar backdrop */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-gray-900 bg-opacity-50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
          fixed top-0 left-0 z-50 h-full w-64 bg-gradient-to-b from-indigo-900 to-indigo-800 
          transform transition-transform duration-300 ease-in-out lg:translate-x-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
            >
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="flex items-center justify-between h-16 px-6 bg-indigo-950">
                        <h1 className="text-2xl font-bold text-white">LoanManager</h1>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="lg:hidden text-white hover:text-gray-200"
                        >
                            <XMarkIcon className="h-6 w-6" />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                        {navigation.map((item) => {
                            const Icon = item.icon
                            const active = isActive(item.href)
                            return (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    onClick={() => setSidebarOpen(false)}
                                    className={`
                    flex items-center px-4 py-3 rounded-lg transition-all duration-200
                    ${active
                                            ? 'bg-indigo-700 text-white shadow-lg'
                                            : 'text-indigo-100 hover:bg-indigo-800 hover:text-white'
                                        }
                  `}
                                >
                                    <Icon className="h-5 w-5 mr-3" />
                                    <span className="font-medium">{item.name}</span>
                                </Link>
                            )
                        })}
                    </nav>

                    {/* User profile */}
                    <div className="p-4 border-t border-indigo-700">
                        <div className="flex items-center space-x-3 px-4 py-3 rounded-lg bg-indigo-800">
                            <UserCircleIcon className="h-10 w-10 text-indigo-200" />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white truncate">{user?.name}</p>
                                <p className="text-xs text-indigo-300 truncate">{user?.email}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main content */}
            <div className="lg:pl-64">
                {/* Top header */}
                <header className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden text-gray-500 hover:text-gray-700"
                        >
                            <Bars3Icon className="h-6 w-6" />
                        </button>

                        <div className="flex-1 flex justify-center lg:justify-start">
                            <h2 className="text-xl font-semibold text-gray-800">
                                {navigation.find(item => isActive(item.href))?.name || 'Dashboard'}
                            </h2>
                        </div>

                        <div className="flex items-center space-x-4">
                            {/* Notifications */}
                            <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                                <BellIcon className="h-6 w-6" />
                                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
                            </button>

                            {/* Profile & Logout */}
                            <div className="flex items-center space-x-3">
                                <button className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                    <UserCircleIcon className="h-8 w-8 text-gray-500" />
                                </button>
                                <button
                                    onClick={() => logout()}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <main className="p-4 sm:p-6 lg:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}

export default DashboardLayout
