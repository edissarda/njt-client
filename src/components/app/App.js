import React, { Component } from 'react';
import WebSite from '../website/Website';
import { MemoryRouter } from 'react-router-dom';

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
