import { motion } from 'framer-motion';
import { Bell, Info, CheckCircle, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';

const notifications = [
  {
    id: '1',
    title: 'Campaign Update',
    message: 'New campaign strategy document is ready for review',
    type: 'info',
    timestamp: new Date(2024, 2, 15, 14, 30),
  },
  {
    id: '2',
    title: 'Member Milestone',
    message: 'Party membership has reached 25,000!',
    type: 'success',
    timestamp: new Date(2024, 2, 15, 12, 45),
  },
  {
    id: '3',
    title: 'Urgent: Policy Review',
    message: 'Please review updated policy guidelines',
    type: 'warning',
    timestamp: new Date(2024, 2, 15, 10, 15),
  },
];

const getIcon = (type: string) => {
  switch (type) {
    case 'info':
      return <Info className="w-5 h-5 text-cyber-400" />;
    case 'success':
      return <CheckCircle className="w-5 h-5 text-emerald-400" />;
    case 'warning':
      return <AlertTriangle className="w-5 h-5 text-amber-400" />;
    default:
      return <Bell className="w-5 h-5 text-brand-400" />;
  }
};

export default function NotificationPanel () {
    return (
        <div className="glass gradient-border rounded-3xl p-6 h-full">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold font-display">Notifications</h2>
            <span className="bg-brand-gradient text-white text-sm py-1 px-3 rounded-full font-semibold shadow-lg">
              {notifications.length} New
            </span>
          </div>

          <div className="space-y-3">
            {notifications.map((notification, index) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start space-x-4 p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.07] hover:border-brand-400/40 transition-colors"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/5 border border-white/10">
                  {getIcon(notification.type)}
                </span>
                <div className="flex-1">
                  <h3 className="font-medium text-white">{notification.title}</h3>
                  <p className="text-sm text-white/60 mt-1">{notification.message}</p>
                  <span className="text-xs text-white/40 mt-2 block">
                    {format(notification.timestamp, 'MMM d, yyyy h:mm a')}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            className="w-full mt-6 text-white border border-white/15 bg-white/5 py-2.5 px-4 rounded-xl hover:bg-white/10 hover:border-brand-400 transition-colors"
          >
            View All Notifications
          </motion.button>
        </div>
      );
}
