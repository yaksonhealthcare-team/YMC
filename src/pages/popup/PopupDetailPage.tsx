import ErrorPage from '@/components/ErrorPage';
import LoadingIndicator from '@/components/LoadingIndicator';
import { useLayout } from '@/contexts/LayoutContext';
import { usePopupDetail } from '@/queries/useContentQueries';
import { Box, Container, Typography } from '@mui/material';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function PopupDetailPage() {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const { setHeader, setNavigation } = useLayout();

  // Fetch popup detail data
  const {
    data: popup,
    isLoading,
    error,
    isError
  } = usePopupDetail(code || '', {
    // Ensure query doesn't run with undefined code
    enabled: !!code
  });

  useEffect(() => {
    // Fix: Update setHeader call according to LayoutContext types
    setHeader({
      display: true,
      title: '팝업 상세',
      left: 'back', // Use "back" string for back button
      onClickBack: () => navigate('/', { replace: true }), // Navigate home on back click
      right: undefined, // No right icon
      backgroundColor: 'bg-white' // Set background to white
    });
    // Hide bottom navigation
    setNavigation({ display: false });

    // Cleanup on unmount
    return () => {
      setHeader({ display: false });
      setNavigation({ display: true });
    };
  }, [setHeader, setNavigation, navigate]);

  if (isLoading) {
    // Wrap LoadingIndicator in a Box with top padding
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 'calc(100vh - 100px)',
          pt: 10
        }}
      >
        <LoadingIndicator />
      </Box>
    );
  }

  if (isError || !popup) {
    console.error('Error fetching popup detail:', error);
    // Fix: Render ErrorPage without props
    return <ErrorPage />;
  }

  // Get the image URL from the first file, if available
  const imageUrl = popup.files?.[0]?.fileurl;

  return (
    <Container maxWidth="sm" sx={{ pt: 2, pb: 4 }}>
      <Typography variant="h5" component="h1" gutterBottom>
        {popup.title}
      </Typography>

      {imageUrl && (
        <Box sx={{ my: 2 }}>
          <img
            src={imageUrl}
            alt={popup.title} // Use title as alt text
            style={{ width: '100%', height: 'auto', borderRadius: '8px' }}
          />
        </Box>
      )}

      {/* Render HTML content if available (sanitize first!) */}
      {popup.content && (
        <Box
          sx={{ mt: 2, '& img': { maxWidth: '100%', height: 'auto' } }}
          dangerouslySetInnerHTML={{
            __html: popup.content /* IMPORTANT: Sanitize this HTML */
          }}
        />
      )}

      {/* Add more details as needed (e.g., dates) */}
      <Typography variant="caption" display="block" sx={{ mt: 2, color: 'text.secondary' }}>
        기간: {popup.sdate} ~ {popup.edate}
      </Typography>
    </Container>
  );
}

export default PopupDetailPage;
