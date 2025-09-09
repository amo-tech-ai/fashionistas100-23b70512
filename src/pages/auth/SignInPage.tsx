import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Shield, Zap } from 'lucide-react';

export default function SignInPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left Side - Sign In Form */}
      <div className="flex-1 flex items-center justify-center bg-white dark:bg-gray-900 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Logo and Header */}
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="flex justify-center mb-6"
            >
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 rounded-2xl">
                <Sparkles className="h-10 w-10 text-white" />
              </div>
            </motion.div>
            
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl font-extrabold text-gray-900 dark:text-white"
            >
              Welcome Back
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-2 text-lg text-gray-600 dark:text-gray-400"
            >
              Sign in to manage your fashion events
            </motion.p>
          </div>

          {/* Simple Sign In Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email
              </label>
              <input
                type="email"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Password
              </label>
              <input
                type="password"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                placeholder="Enter your password"
              />
            </div>
            <button
              onClick={() => window.location.href = '/dashboard'}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              Sign In
            </button>
          </motion.div>

          {/* Additional Links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center space-y-4"
          >
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Don't have an account?{' '}
              <Link 
                to="/sign-up" 
                className="font-medium text-purple-600 hover:text-purple-500 dark:text-purple-400"
              >
                Sign up for free
              </Link>
            </p>
            
            <div className="flex items-center justify-center space-x-6 text-xs text-gray-500">
              <Link to="/terms" className="hover:text-gray-700 dark:hover:text-gray-300">
                Terms
              </Link>
              <Link to="/privacy" className="hover:text-gray-700 dark:hover:text-gray-300">
                Privacy
              </Link>
              <Link to="/help" className="hover:text-gray-700 dark:hover:text-gray-300">
                Help
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Feature Showcase */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-purple-600 to-pink-600 items-center justify-center p-12">
        <div className="max-w-lg text-white space-y-8">
          <motion.h3
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="text-3xl font-bold"
          >
            Manage Fashion Events with Ease
          </motion.h3>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="space-y-6"
          >
            <FeatureItem
              icon={<Zap />}
              title="3-Minute Event Creation"
              description="Create professional fashion events 10x faster than traditional platforms"
            />
            
            <FeatureItem
              icon={<Shield />}
              title="Secure & Reliable"
              description="Enterprise-grade security with Clerk authentication"
            />
            
            <FeatureItem
              icon={<ArrowRight />}
              title="All-in-One Platform"
              description="Manage models, designers, venues, and tickets in one place"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="pt-8 border-t border-white/20"
          >
            <p className="text-sm opacity-90">
              Trusted by 1,000+ fashion professionals worldwide
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function FeatureItem({ icon, title, description }: { 
  icon: React.ReactNode; 
  title: string; 
  description: string;
}) {
  return (
    <div className="flex space-x-4">
      <div className="flex-shrink-0">
        <div className="bg-white/20 backdrop-blur-sm p-3 rounded-lg">
          {icon}
        </div>
      </div>
      <div>
        <h4 className="font-semibold mb-1">{title}</h4>
        <p className="text-sm opacity-90">{description}</p>
      </div>
    </div>
  );
}