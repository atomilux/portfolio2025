
/* COMPONENTS */
import AppCore from './AppCore/AppCore'
import { PortfolioContextProvider } from './Data/DataProvider'

/* CSS */
import './App.css'

function App() {

	return (

		<PortfolioContextProvider>

			<AppCore/>

		</PortfolioContextProvider>

	)//end return()

}//end f

export default App
