import './tailwind.css';
import { ScrollProvider } from './context/ScrollContext';
import { AppRouter } from './router';

function App() {
  return (
    <ScrollProvider>
      <AppRouter />
    </ScrollProvider>
  );
}

export default App;
