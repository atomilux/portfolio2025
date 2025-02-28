import { createRoot } from 'react-dom/client'
import './index.css'

import AppCore from './AppCore/AppCore'

import { output_intro } from './Util/Output'

import { PortfolioContextProvider } from './Data/DataProvider'
import { StrictMode } from 'react'

output_intro()

createRoot(document.getElementById('root')!).render(

	<StrictMode>

		<PortfolioContextProvider>
				
			<AppCore/>

		</PortfolioContextProvider>

	</StrictMode>

)