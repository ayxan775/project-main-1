import React, { useEffect } from 'react';

interface CertificationAnalyticsProps {
  page: string;
}

export function CertificationAnalytics({ page }: CertificationAnalyticsProps) {
  useEffect(() => {
    // Mock analytics tracking
    console.log(`Certification page viewed: ${page}`);
    
    // This would typically make an API call to track page views
    const trackPageView = async () => {
      try {
        // In a real implementation, this would be an API call to your analytics service
        // await fetch('/api/analytics/page-view', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ page, timestamp: new Date().toISOString() })
        // });
      } catch (error) {
        console.error('Error tracking page view:', error);
      }
    };

    trackPageView();
  }, [page]);

  // This component doesn't render anything visible
  return null;
} 