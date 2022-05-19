import React from 'react'
import ReactDOM from 'react-dom'
import '@shoelace-style/shoelace/dist/themes/light.css'
import '@shoelace-style/shoelace/dist/themes/dark.css'
import './index.module.css'
import App from './components/App'

ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById('root'),
)
