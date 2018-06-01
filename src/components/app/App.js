import React, { Component } from 'react';
import WebSite from '../website/Website';
import { BrowserRouter } from 'react-router-dom';

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
