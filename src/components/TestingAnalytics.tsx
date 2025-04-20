import React, { useEffect } from 'react';

interface TestingAnalyticsProps {
  page: string;
}

export function TestingAnalytics({ page }: TestingAnalyticsProps) {
  useEffect(() => {
    // Mock analytics tracking
    console.log(`Testing page viewed: ${page}`);
    
    // This would typically make an API call to track page views
    const trackPageView = async () => {
      try {
        // In a real implementation, this would be an API call to your analytics service
        // await fetch('/api/analytics/testing/page-view', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ page, timestamp: new Date().toISOString() })
        // });
      } catch (error) {
        console.error('Error tracking testing page view:', error);
      }
    };

    trackPageView();
  }, [page]);

  // This component doesn't render anything visible
  return null;
} 