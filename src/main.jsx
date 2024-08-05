import ReactDOM from 'react-dom/client';
import { legacy_createStore } from 'redux';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { reducers } from './store/store';
import App from './App.jsx';
import './index.css';

const globalStore = legacy_createStore(reducers);

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={globalStore}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);
