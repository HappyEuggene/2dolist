import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';  // Assuming you have a global CSS file
import App from './App';
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
	document.getElementById('root')
);

// If you want to measure performance using React DevTools
reportWebVitals();
