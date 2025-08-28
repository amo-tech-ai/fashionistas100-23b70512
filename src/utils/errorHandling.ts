import { useToast } from '@/hooks/use-toast';

export interface ErrorWithMessage {
  message: string;
}

export function isErrorWithMessage(error: unknown): error is ErrorWithMessage {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as Record<string, unknown>).message === 'string'
  );
}

export function toErrorWithMessage(maybeError: unknown): ErrorWithMessage {
  if (isErrorWithMessage(maybeError)) return maybeError;

  try {
    return new Error(JSON.stringify(maybeError));
  } catch {
    return new Error(String(maybeError));
  }
}

export function getErrorMessage(error: unknown): string {
  return toErrorWithMessage(error).message;
}

// Network error handling
export const handleNetworkError = (error: unknown, toast: ReturnType<typeof useToast>['toast']) => {
  const message = getErrorMessage(error);
  
  if (message.includes('fetch')) {
    toast({
      title: 'Connection Error',
      description: 'Please check your internet connection and try again.',
      variant: 'destructive',
    });
  } else if (message.includes('timeout')) {
    toast({
      title: 'Request Timeout',
      description: 'The request took too long. Please try again.',
      variant: 'destructive',
    });
  } else {
    toast({
      title: 'Error',
      description: message || 'An unexpected error occurred.',
      variant: 'destructive',
    });
  }
};

// Async operation wrapper with error handling
export const withErrorHandling = async <T>(
  operation: () => Promise<T>,
  toast: ReturnType<typeof useToast>['toast'],
  customErrorMessage?: string
): Promise<T | null> => {
  try {
    return await operation();
  } catch (error) {
    if (customErrorMessage) {
      toast({
        title: 'Error',
        description: customErrorMessage,
        variant: 'destructive',
      });
    } else {
      handleNetworkError(error, toast);
    }
    return null;
  }
};