import React, { Component } from 'react';
import WebSite from '../website/Website';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:8080/';

class App extends Component {
	render() {
		return (
			<BrowserRouter>
				<WebSite />
			</BrowserRouter>
		);
	}
}



export default App;
