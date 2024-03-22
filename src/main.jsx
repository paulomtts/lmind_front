import React from 'react'
import ReactDOM from 'react-dom/client'

import App from './App'
import { ChakraProvider } from '@chakra-ui/react'
import { MouseProvider } from './providers/MouseProvider'
import { NotificationProvider } from './providers/NotificationProvider'
import { OverlayProvider } from './providers/OverlayProvider.tsx'
import { DataProvider } from './providers/data/DataProvider'
import { AuthProvider } from './providers/AuthProvider'
import { ReactFlowProvider } from 'reactflow'

import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
    <ChakraProvider>
      <MouseProvider>
        <NotificationProvider>
          <OverlayProvider>
            <DataProvider>
              <AuthProvider>
                <ReactFlowProvider>
                  <App />
                </ReactFlowProvider>
              </AuthProvider>
            </DataProvider>
          </OverlayProvider>
        </NotificationProvider>
      </MouseProvider>
    </ChakraProvider>
  // </React.StrictMode>,
)
