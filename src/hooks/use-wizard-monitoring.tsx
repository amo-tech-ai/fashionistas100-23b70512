/**
 * React hook for wizard monitoring
 * 
 * Automatically tracks wizard lifecycle events
 */

import { useEffect, useRef } from 'react';
import { wizardMonitoring } from '@/lib/event-wizard/monitoring';

interface UseWizardMonitoringOptions {
  sessionId: string;
  currentStage: string;
  isComplete: boolean;
}

export function useWizardMonitoring({
  sessionId,
  currentStage,
  isComplete
}: UseWizardMonitoringOptions) {
  const hasStarted = useRef(false);
  const stageStartTime = useRef<number>(Date.now());
  const wizardStartTime = useRef<number>(Date.now());
  const previousStage = useRef<string>(currentStage);

  // Track wizard start
  useEffect(() => {
    if (!hasStarted.current && sessionId) {
      wizardMonitoring.trackWizardStart(sessionId);
      hasStarted.current = true;
      wizardStartTime.current = Date.now();
    }
  }, [sessionId]);

  // Track stage changes
  useEffect(() => {
    if (currentStage !== previousStage.current && previousStage.current) {
      const stageDuration = Date.now() - stageStartTime.current;
      wizardMonitoring.trackStageCompleted(sessionId, previousStage.current, stageDuration);
      stageStartTime.current = Date.now();
    }
    previousStage.current = currentStage;
  }, [currentStage, sessionId]);

  // Track completion
  useEffect(() => {
    if (isComplete) {
      const totalDuration = Date.now() - wizardStartTime.current;
      wizardMonitoring.trackWizardCompleted(sessionId, totalDuration);
    }
  }, [isComplete, sessionId]);

  // Track abandonment on unmount
  useEffect(() => {
    return () => {
      if (!isComplete && hasStarted.current) {
        wizardMonitoring.trackWizardAbandoned(sessionId, currentStage);
      }
    };
  }, [sessionId, currentStage, isComplete]);

  return {
    trackAIInteraction: (action: string) => {
      wizardMonitoring.trackAIInteraction(sessionId, currentStage, action);
    },
    trackError: (error: Error) => {
      wizardMonitoring.trackError(sessionId, currentStage, error);
    }
  };
}
