import React, { Component } from 'react';
import WebSite from '../website/Website';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:9000/';

class App extends Component {
	render() {
		return (
			<MemoryRouter>
				<WebSite />
			</MemoryRouter>
		);
	}
}



export default App;
