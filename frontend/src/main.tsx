import { Provider } from "./providers/QueryProvider"
import { createRoot } from 'react-dom/client'
import { App } from './App.tsx'

import "antd/dist/reset.css";
import "./index.css";

createRoot(document.getElementById('root')!).render(
  <Provider>
    <App />
  </Provider>
)
