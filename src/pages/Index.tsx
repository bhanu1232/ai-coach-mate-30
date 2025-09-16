import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Hero from '@/components/Hero';

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const handleStartPracticing = () => {
    navigate('/login');
  };

  const handleUploadJobDescription = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-background">
      <Hero 
        onStartPracticing={handleStartPracticing}
        onUploadJobDescription={handleUploadJobDescription}
      />
    </div>
  );
};

export default Index;
