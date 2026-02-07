

function Dashboard() {
    const stats = [
        { name: 'Total Loans', value: '1,234', change: '+12.5%', positive: true },
        { name: 'Active Users', value: '567', change: '+8.2%', positive: true },
        { name: 'Pending Payments', value: '$45,678', change: '-3.1%', positive: false },
        { name: 'Total Revenue', value: '$123,456', change: '+15.3%', positive: true },
    ]

    return (
        <div className="space-y-6">
            {/* Welcome section */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-lg p-8 text-white">
                <h1 className="text-3xl font-bold mb-2">Welcome back, Admin!</h1>
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
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                <div>
                                    <p className="font-medium text-gray-900">Loan #{1000 + i}</p>
                                    <p className="text-sm text-gray-600">Customer Name {i}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold text-gray-900">${(i * 5000).toLocaleString()}</p>
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                        Approved
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Payments</h3>
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                <div>
                                    <p className="font-medium text-gray-900">Payment #{2000 + i}</p>
                                    <p className="text-sm text-gray-600">Due in {i} days</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold text-gray-900">${(i * 1000).toLocaleString()}</p>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${i === 1 ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                        {i === 1 ? 'Urgent' : 'Pending'}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard
