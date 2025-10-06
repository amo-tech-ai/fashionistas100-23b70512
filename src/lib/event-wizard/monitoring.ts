/**
 * Event Wizard Monitoring & Analytics
 * 
 * Tracks wizard usage, completion rates, and AI interactions
 * for production monitoring and optimization
 */

export interface WizardEvent {
  session_id: string;
  event_type: 'wizard_started' | 'stage_completed' | 'wizard_completed' | 'wizard_abandoned' | 'ai_interaction' | 'error_occurred';
  stage?: string;
  metadata?: Record<string, any>;
  timestamp: number;
}

export interface WizardMetrics {
  total_sessions: number;
  completed_sessions: number;
  abandoned_sessions: number;
  completion_rate: number;
  average_completion_time_minutes: number;
  stage_drop_off: Record<string, number>;
  ai_interactions: number;
  errors: number;
}

class WizardMonitoring {
  private events: WizardEvent[] = [];
  private readonly MAX_EVENTS = 100;

  /**
   * Track wizard event
   */
  trackEvent(event: Omit<WizardEvent, 'timestamp'>): void {
    const fullEvent: WizardEvent = {
      ...event,
      timestamp: Date.now()
    };

    this.events.push(fullEvent);

    // Keep only last MAX_EVENTS
    if (this.events.length > this.MAX_EVENTS) {
      this.events = this.events.slice(-this.MAX_EVENTS);
    }

    // Log to console in development
    if (import.meta.env.DEV) {
      console.log('[Wizard Monitor]', event.event_type, event);
    }

    // Send to analytics service (PostHog, Mixpanel, etc.) if configured
    this.sendToAnalytics(fullEvent);
  }

  /**
   * Track wizard start
   */
  trackWizardStart(sessionId: string): void {
    this.trackEvent({
      session_id: sessionId,
      event_type: 'wizard_started',
      metadata: {
        user_agent: navigator.userAgent,
        screen_width: window.innerWidth
      }
    });
  }

  /**
   * Track stage completion
   */
  trackStageCompleted(sessionId: string, stage: string, durationMs: number): void {
    this.trackEvent({
      session_id: sessionId,
      event_type: 'stage_completed',
      stage,
      metadata: {
        duration_ms: durationMs
      }
    });
  }

  /**
   * Track wizard completion
   */
  trackWizardCompleted(sessionId: string, totalDurationMs: number): void {
    this.trackEvent({
      session_id: sessionId,
      event_type: 'wizard_completed',
      metadata: {
        total_duration_ms: totalDurationMs,
        total_duration_minutes: Math.round(totalDurationMs / 60000)
      }
    });
  }

  /**
   * Track wizard abandonment
   */
  trackWizardAbandoned(sessionId: string, lastStage: string): void {
    this.trackEvent({
      session_id: sessionId,
      event_type: 'wizard_abandoned',
      stage: lastStage
    });
  }

  /**
   * Track AI interaction
   */
  trackAIInteraction(sessionId: string, stage: string, action: string): void {
    this.trackEvent({
      session_id: sessionId,
      event_type: 'ai_interaction',
      stage,
      metadata: {
        action
      }
    });
  }

  /**
   * Track error
   */
  trackError(sessionId: string, stage: string, error: Error): void {
    this.trackEvent({
      session_id: sessionId,
      event_type: 'error_occurred',
      stage,
      metadata: {
        error_message: error.message,
        error_stack: error.stack
      }
    });
  }

  /**
   * Get metrics for analysis
   */
  getMetrics(): WizardMetrics {
    const sessions = new Set(this.events.map(e => e.session_id));
    const totalSessions = sessions.size;
    
    const completedSessions = new Set(
      this.events.filter(e => e.event_type === 'wizard_completed').map(e => e.session_id)
    ).size;

    const abandonedSessions = new Set(
      this.events.filter(e => e.event_type === 'wizard_abandoned').map(e => e.session_id)
    ).size;

    const stageDropOff: Record<string, number> = {};
    this.events
      .filter(e => e.event_type === 'wizard_abandoned' && e.stage)
      .forEach(e => {
        stageDropOff[e.stage!] = (stageDropOff[e.stage!] || 0) + 1;
      });

    const completionTimes = this.events
      .filter(e => e.event_type === 'wizard_completed' && e.metadata?.total_duration_minutes)
      .map(e => e.metadata!.total_duration_minutes);

    const avgCompletionTime = completionTimes.length > 0
      ? completionTimes.reduce((a, b) => a + b, 0) / completionTimes.length
      : 0;

    return {
      total_sessions: totalSessions,
      completed_sessions: completedSessions,
      abandoned_sessions: abandonedSessions,
      completion_rate: totalSessions > 0 ? (completedSessions / totalSessions) * 100 : 0,
      average_completion_time_minutes: Math.round(avgCompletionTime),
      stage_drop_off: stageDropOff,
      ai_interactions: this.events.filter(e => e.event_type === 'ai_interaction').length,
      errors: this.events.filter(e => e.event_type === 'error_occurred').length
    };
  }

  /**
   * Send to external analytics service
   */
  private sendToAnalytics(event: WizardEvent): void {
    // PostHog integration (if available)
    if (typeof window !== 'undefined' && 'posthog' in window) {
      (window as any).posthog?.capture(event.event_type, {
        session_id: event.session_id,
        stage: event.stage,
        ...event.metadata
      });
    }

    // Google Analytics 4 (if available)
    if (typeof window !== 'undefined' && 'gtag' in window) {
      (window as any).gtag?.('event', event.event_type, {
        event_category: 'event_wizard',
        event_label: event.stage,
        ...event.metadata
      });
    }
  }

  /**
   * Export events for debugging
   */
  exportEvents(): WizardEvent[] {
    return [...this.events];
  }

  /**
   * Clear all events
   */
  clearEvents(): void {
    this.events = [];
  }
}

// Singleton instance
export const wizardMonitoring = new WizardMonitoring();
