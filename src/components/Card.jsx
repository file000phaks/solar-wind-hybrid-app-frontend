import { useAppStore } from "../store/store";
import classNames from 'classnames';

// Card Component
const Card = ({ title, value, unit, icon: Icon, color = "blue", trend, className = "", children }) => {
    const { theme } = useAppStore();

    return (

        <div
            className={classNames(
                "p-6 rounded-xl shadow-lg border transition-all duration-300 hover:shadow-xl hover:scale-105",
                theme === 'dark' ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200",
                className
            )}>

            <div className="flex items-start justify-between">

                <div className="flex-1">

                    <h3 className={classNames(
                        "text-sm font-medium mb-2",
                        theme === 'dark' ? "text-gray-300" : "text-gray-600"
                    )}>
                        {title}
                    </h3>

                    {
                        value &&
                        (
                            <div className="flex items-baseline gap-2">

                                <span className={classNames(
                                    "text-2xl font-bold",
                                    theme === 'dark' ? "text-white" : "text-gray-900"
                                )}>
                                    {value}
                                </span>

                                {unit && <span className="text-sm text-gray-500">{unit}</span>}

                            </div>
                        )
                    }

                    {
                        trend && (
                            <div
                                className={classNames(
                                    "text-xs mt-1",
                                    trend > 0 ? "text-green-500" : "text-red-500"
                                )}
                            >
                                {trend > 0 ? "↑" : "↓"} {Math.abs(trend)}%
                            </div>
                        )
                    }
                </div>

                {
                    Icon && (
                        <div
                            className={classNames(
                                "p-3 rounded-lg",
                                `bg-${color}-100 text-${color}-600`,
                                theme === 'dark' && `bg-${color}-900 text-${color}-400`
                            )}
                        >
                            <Icon />
                        </div>
                    )
                }

            </div>

            {children}

        </div>

    );

};

export default Card;