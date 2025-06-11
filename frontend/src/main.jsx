import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import { UserProvider } from './Context/UserContext';
import BusinessContext from './Context/BusinessContext';
import { PaymentProvider } from './Context/PaymentContext';
import { GrantsContextProvider } from './Context/GrantsContext';
GrantsContextProvider

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <UserProvider>
        <BusinessContext>
          <PaymentProvider>
            <GrantsContextProvider>
              <App />
            </GrantsContextProvider>
          </PaymentProvider>
        </BusinessContext>
      </UserProvider>
    </BrowserRouter>
  </StrictMode>
)
