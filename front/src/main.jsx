import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

import axios from 'axios'
axios.defaults.baseURL="http://localhost:3001";

ReactDOM.createRoot(document.getElementById('root')).render(
  <App />
)
