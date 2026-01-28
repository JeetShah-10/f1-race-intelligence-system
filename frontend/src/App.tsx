import { useState } from 'react';
import './tailwind.css';
import { ScrollProvider } from './context/ScrollContext';
import { AppRouter } from './router';
import { LoadingScreen } from './components/loading/LoadingScreen';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      {isLoading && (
        <LoadingScreen
          onComplete={() => setIsLoading(false)}
          minDisplayTime={3000}
        />
      )}
      <ScrollProvider>
        <AppRouter />
      </ScrollProvider>
    </>
  );
}

export default App;

