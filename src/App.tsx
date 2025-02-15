/* REACT */
import { useState, useContext } from 'react'

/* COMPONENTS */
import Nav from './Nav/Nav'
import SubNav from './SubNav/SubNav'
import Content_SkillOverview from './Content_SkillOverview/Content_SkillOverview'
import Content_Skillset from './Content_Skillset/Content_Skillset'
import PortfolioDetail from './Content_PortfolioDetail/Content_PortfolioDetail'
import Content_PortfolioCollection from './Content_PortfolioCollection/Content_PortfolioCollection'
import {PortfolioContextProvider} from './DataProvider/DataProvider'

/* SVG */
import stevelux_logo from './assets/logo_stevelux_logotype_940x150.svg'

/* CSS */
import './App.css'

function App() {

	const [ content_width, set_content_width 	] = useState(window.outerWidth * .75)
	const [ content_left, set_content_left		] = useState(window.outerWidth * .125)

	window.onresize = () => {
		set_content_width(window.outerWidth * .75)
		set_content_left(window.outerWidth * .125)
	}

	return (

		<PortfolioContextProvider>

			<div id="header_full" className="a-fade-in-scale">
				<img src={stevelux_logo} />
			</div>

			<Nav></Nav>

			<SubNav></SubNav>


			<div className="page_content" style={{width:content_width+'px', left:content_left+'px'}}>

				<div className="content_stage">

					<div className="content_cube">

						
						<Content_SkillOverview/>
				
						<Content_Skillset/>

						<Content_PortfolioCollection/>

						

					</div>

				</div>

			</div>

			<PortfolioDetail/>

		</PortfolioContextProvider>

	)//end return()

}//end f

export default App
