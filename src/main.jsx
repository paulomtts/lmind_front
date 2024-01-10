import React from 'react'
import ReactDOM from 'react-dom/client'

import App from './App'
import { ChakraProvider } from '@chakra-ui/react'
import { MouseProvider } from './providers/MouseProvider'
import { NotificationProvider } from './providers/NotificationProvider'
import { OverlayProvider } from './providers/OverlayProvider'

import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ChakraProvider>
      <MouseProvider>
        <NotificationProvider>
          <OverlayProvider>
            <App />
          </OverlayProvider>
        </NotificationProvider>
      </MouseProvider>
    </ChakraProvider>
  </React.StrictMode>,
)
