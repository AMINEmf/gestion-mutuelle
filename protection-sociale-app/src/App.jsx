import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css';

function App() {
  return <RouterProvider router={router} />;
}

export default App;
