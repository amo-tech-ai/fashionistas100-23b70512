import React, { createContext, useContext, ReactNode } from 'react';

/**
 * Mock Clerk Provider for Development
 * Bypasses authentication while keeping Clerk API compatible
 * Set VITE_USE_MOCK_AUTH=true in .env to enable
 */

// Mock user object matching Clerk's User type
const mockUser = {
  id: 'dev_mock_user_organizer',
  primaryEmailAddress: {
    emailAddress: 'dev@fashionistas.test',
    id: 'email_mock_id'
  },
  emailAddresses: [{
    emailAddress: 'dev@fashionistas.test',
    id: 'email_mock_id'
  }],
  firstName: 'Dev',
  lastName: 'Organizer',
  fullName: 'Dev Organizer',
  imageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=DevOrganizer',
  username: 'dev_organizer',
  publicMetadata: {
    role: 'organizer'
  },
  unsafeMetadata: {},
  organizationMemberships: [],
  createdAt: new Date(),
  updatedAt: new Date(),
};

// Mock Auth Context
const MockAuthContext = createContext({
  isLoaded: true,
  isSignedIn: true,
  userId: mockUser.id,
  sessionId: 'mock_session_id',
  actor: null,
  orgId: null,
  orgRole: null,
  orgSlug: null,
  getToken: async () => 'mock_jwt_token',
  signOut: async () => {},
});

// Mock User Context
const MockUserContext = createContext({
  isLoaded: true,
  isSignedIn: true,
  user: mockUser,
});

// Mock Clerk Context
const MockClerkContext = createContext({
  loaded: true,
  user: mockUser,
  session: { id: 'mock_session_id' },
  client: {},
  openSignIn: () => console.log('🚧 Mock: SignIn opened'),
  openSignUp: () => console.log('🚧 Mock: SignUp opened'),
  closeSignIn: () => {},
  closeSignUp: () => {},
  setActive: async () => {},
});

export const MockClerkProvider = ({ children }: { children: ReactNode }) => {
  console.log('🚧 DEV MODE: Using Mock Clerk Authentication');
  console.log('🚧 Mock User:', mockUser.emailAddresses[0].emailAddress, '| Role:', mockUser.publicMetadata.role);

  return (
    <MockClerkContext.Provider value={{
      loaded: true,
      user: mockUser,
      session: { id: 'mock_session_id' },
      client: {},
      openSignIn: () => console.log('🚧 Mock: SignIn opened'),
      openSignUp: () => console.log('🚧 Mock: SignUp opened'),
      closeSignIn: () => {},
      closeSignUp: () => {},
      setActive: async () => {},
    }}>
      <MockAuthContext.Provider value={{
        isLoaded: true,
        isSignedIn: true,
        userId: mockUser.id,
        sessionId: 'mock_session_id',
        actor: null,
        orgId: null,
        orgRole: null,
        orgSlug: null,
        getToken: async () => 'mock_jwt_token',
        signOut: async () => console.log('🚧 Mock: Sign out requested'),
      }}>
        <MockUserContext.Provider value={{
          isLoaded: true,
          isSignedIn: true,
          user: mockUser,
        }}>
          {children}
        </MockUserContext.Provider>
      </MockAuthContext.Provider>
    </MockClerkContext.Provider>
  );
};

// Mock hooks that match Clerk's API
export const useAuth = () => useContext(MockAuthContext);
export const useUser = () => useContext(MockUserContext);
export const useClerk = () => useContext(MockClerkContext);
export const useSignIn = () => ({
  isLoaded: true,
  signIn: null,
  setActive: async () => {},
});
export const useSignUp = () => ({
  isLoaded: true,
  signUp: null,
  setActive: async () => {},
});

// Mock components that match Clerk's API
export const SignIn = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="p-8 border rounded-lg bg-white shadow-lg max-w-md">
      <h2 className="text-2xl font-bold mb-4">🚧 Mock Sign In</h2>
      <p className="text-gray-600 mb-4">Authentication is mocked in dev mode.</p>
      <p className="text-sm text-gray-500">You're automatically signed in as: <strong>{mockUser.emailAddresses[0].emailAddress}</strong></p>
      <button 
        onClick={() => window.location.href = '/dashboard'}
        className="mt-4 w-full bg-black text-white py-2 px-4 rounded hover:bg-gray-800"
      >
        Continue to Dashboard
      </button>
    </div>
  </div>
);

export const SignUp = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="p-8 border rounded-lg bg-white shadow-lg max-w-md">
      <h2 className="text-2xl font-bold mb-4">🚧 Mock Sign Up</h2>
      <p className="text-gray-600 mb-4">Authentication is mocked in dev mode.</p>
      <p className="text-sm text-gray-500">You're automatically signed in as: <strong>{mockUser.emailAddresses[0].emailAddress}</strong></p>
      <button 
        onClick={() => window.location.href = '/dashboard'}
        className="mt-4 w-full bg-black text-white py-2 px-4 rounded hover:bg-gray-800"
      >
        Continue to Dashboard
      </button>
    </div>
  </div>
);

export const UserButton = () => (
  <div className="flex items-center gap-2 p-2 border rounded bg-gray-50">
    <img src={mockUser.imageUrl} alt="User" className="w-8 h-8 rounded-full" />
    <span className="text-sm font-medium">{mockUser.fullName}</span>
    <span className="text-xs text-gray-500">🚧 Mock</span>
  </div>
);
