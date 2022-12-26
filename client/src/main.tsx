import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux';
import {persistor, store} from './redux/app/store';
import {QueryClientProvider, QueryClient} from 'react-query';
import App from './App'
import './index.css'
import { PersistGate } from 'redux-persist/integration/react';


 const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
    <Provider store={store}> 
    <PersistGate loading={null} persistor={persistor}>
    <App />
    </PersistGate>
    </Provider>
  </QueryClientProvider>
  </React.StrictMode>
)
