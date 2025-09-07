import { SignUp } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, CheckCircle, Users, TrendingUp } from 'lucide-react';

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left Side - Benefits */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-purple-600 to-pink-600 items-center justify-center p-12">
        <div className="max-w-lg text-white space-y-8">
          <motion.h3
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="text-3xl font-bold"
          >
            Join the Fashion Revolution
          </motion.h3>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="space-y-6"
          >
            <BenefitItem
              icon={<Users />}
              title="Connect with Industry Leaders"
              description="Network with top designers, models, and fashion professionals"
            />
            
            <BenefitItem
              icon={<TrendingUp />}
              title="Grow Your Business"
              description="Reach new audiences and expand your fashion brand"
            />
            
            <BenefitItem
              icon={<CheckCircle />}
              title="Streamline Operations"
              description="Manage everything from one powerful dashboard"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="pt-8 border-t border-white/20"
          >
            <h4 className="font-semibold mb-3">What's included:</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-2" />
                Unlimited event creation
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-2" />
                Advanced analytics dashboard
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-2" />
                24/7 customer support
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-2" />
                Free for first 100 tickets
              </li>
            </ul>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Sign Up Form */}
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
              Create Your Account
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-2 text-lg text-gray-600 dark:text-gray-400"
            >
              Start managing fashion events in minutes
            </motion.p>
          </div>

          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="flex items-center justify-center space-x-4"
          >
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
              No credit card required
            </div>
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
              Free tier available
            </div>
          </motion.div>

          {/* Clerk SignUp Component */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <SignUp 
              appearance={{
                elements: {
                  rootBox: "mx-auto",
                  card: "shadow-none",
                }
              }}
            />
          </motion.div>

          {/* Additional Links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center space-y-4"
          >
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
              <Link 
                to="/sign-in" 
                className="font-medium text-purple-600 hover:text-purple-500 dark:text-purple-400"
              >
                Sign in
              </Link>
            </p>
            
            <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
              By signing up, you agree to our{' '}
              <Link to="/terms" className="underline">Terms of Service</Link>
              {' '}and{' '}
              <Link to="/privacy" className="underline">Privacy Policy</Link>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function BenefitItem({ icon, title, description }: { 
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