import { Provider } from "./providers/QueryProvider"
import { createRoot } from 'react-dom/client'
import { App } from './App.tsx'
import { SettingsProvider } from "./context/SettingsContext";

import "antd/dist/reset.css";
import "./index.css";

createRoot(document.getElementById('root')!).render(
  <Provider>
    <SettingsProvider>
      <App />
    </SettingsProvider>
  </Provider>
)
