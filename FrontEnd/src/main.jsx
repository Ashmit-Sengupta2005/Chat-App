import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter} from "react-router-dom";
import {Toaster} from "react-hot-toast";
import { GoogleOAuthProvider } from '@react-oauth/google';
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <GoogleOAuthProvider clientId="40796496070-9tovp9r1t2op59cejjrai13n92oprhou.apps.googleusercontent.com">
    <App />
    </GoogleOAuthProvider>
    <Toaster/>
    </BrowserRouter>
  </StrictMode>,
)
