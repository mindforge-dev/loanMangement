

import { useAuth } from '../../../hooks/useAuth'
import { useDashboardSummary } from '../../../hooks/useDashboard'

function Dashboard() {
    const { user } = useAuth()
    const { data, isLoading, error } = useDashboardSummary()

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="p-6 bg-red-50 border border-red-200 rounded-xl text-red-700">
                Failed to load dashboard data: {error.message}
            </div>
        )
    }

    const stats = [
        { name: 'Total Loans', value: data?.stats?.totalLoans?.toLocaleString() ?? '0', change: '+12.5%', positive: true },
        { name: 'Active Users', value: data?.stats?.activeUsers?.toLocaleString() ?? '0', change: '+8.2%', positive: true },
        { name: 'Pending Payments', value: `$${data?.stats?.pendingPayments?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) ?? '0.00'}`, change: '-3.1%', positive: false },
        { name: 'Total Revenue', value: `$${data?.stats?.totalRevenue?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) ?? '0.00'}`, change: '+15.3%', positive: true },
    ]

    return (
        <div className="space-y-6">
            {/* Welcome section */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-lg p-8 text-white">
                <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name || 'User'}!</h1>
                <p className="text-indigo-100">Here's what's happening with your loan management system today.</p>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <div key={stat.name} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                        <p className="text-sm font-medium text-gray-600 mb-1">{stat.name}</p>
                        <p className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</p>
                        <p className={`text-sm font-medium ${stat.positive ? 'text-green-600' : 'text-red-600'}`}>
                            {stat.change} from last month
                        </p>
                    </div>
                ))}
            </div>

            {/* Recent activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Loans</h3>
                    <div className="space-y-4">
                        {(data?.recentLoans ?? []).map((loan) => (
                            <div key={loan.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                <div>
                                    <p className="font-medium text-gray-900">Loan #{loan.id.slice(0, 8).toUpperCase()}</p>
                                    <p className="text-sm text-gray-600">{loan.borrowerName}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold text-gray-900">${loan.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                        loan.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                        {loan.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                        {(!data?.recentLoans || data.recentLoans.length === 0) && (
                            <p className="text-gray-500 text-center py-4">No recent loans found.</p>
                        )}
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Payments</h3>
                    <div className="space-y-4">
                        {(data?.upcomingPayments ?? []).map((payment) => (
                            <div key={payment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                <div>
                                    <p className="font-medium text-gray-900">Payment #{payment.paymentNumber}</p>
                                    <p className="text-xs text-gray-400 mb-1">{payment.borrowerName}</p>
                                    <p className="text-sm text-gray-600">Due in {payment.dueDays} days</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold text-gray-900">${payment.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                        payment.dueDays <= 7 ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                        {payment.dueDays <= 7 ? 'Urgent' : 'Pending'}
                                    </span>
                                </div>
                            </div>
                        ))}
                        {(!data?.upcomingPayments || data.upcomingPayments.length === 0) && (
                            <p className="text-gray-500 text-center py-4">No upcoming payments found.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard
