import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClient,QueryClientProvider } from '@tanstack/react-query'
import App from './App.jsx'
import { Provider } from "react-redux";
import store from "./store";
const queryClient = new QueryClient()
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      
    <ReactQueryDevtools initialIsOpen={false} />
      <Provider store={store}>
      <App />
    </Provider>
      </QueryClientProvider>  
  </StrictMode>,
)
