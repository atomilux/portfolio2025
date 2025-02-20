/* REACT */
import { useState, useContext  } from 'react'

/* COMPONENTS */
import Nav from '../Nav/Nav'
import SubNav from '../SubNav/SubNav'
import Content_SkillOverview from '../Content_SkillOverview/Content_SkillOverview'
import Content_Skillset from '../Content_Skillset/Content_Skillset'
import PortfolioDetail from '../Content_PortfolioDetail/Content_PortfolioDetail'
import Content_PortfolioCollection from '../Content_PortfolioCollection/Content_PortfolioCollection'
import { PortfolioContext } from '../Data/DataProvider'

/* SVG */
import stevelux_logo from '../assets/logo_stevelux_logotype_940x150.svg'

export default function AppCore() {

	const [ content_width, set_content_width 	] = useState(100)
	const [ content_left, set_content_left		] = useState(100)

	const {ee,EVT} = useContext(PortfolioContext) 


	/* //////////////////////////////////////////////////


								GLOBAL WINDOW RESIZE EVENT


	///////////////////////////////////////////////////// */

	//config
	const resize_delay = 500

	//used as a flag for interval finish state
	window['port_isAwaiting_resize_timeout'] = false;


	//create app wide event listener and custom event emission

	window.addEventListener("resize", ()  => {

		//if we're waiting for a resize ... then fk off
		if (window['port_isAwaiting_resize_timeout'] === true) { return; }

		//if we're not waiting for a resize then let's set one up
		if (window['port_isAwaiting_resize_timeout'] === false) {

			//clear previous interval
			clearInterval(window['port_resizeTimeout'])

			//set the timeout
			window['port_resizeTimeout'] = setTimeout(() => {

				ee.emit(EVT.WINDOW_RESIZE,{'source':'AppCore'})

				//turn off flag
				window['port_isAwaiting_resize_timeout'] = false;

			}, resize_delay);

		}//end event
	
	})

	//------------------ EVENTS ------------------

	ee.on(EVT.WINDOW_RESIZE,()=>{

		//resize 
		set_content_width(window.outerWidth * .75)
		set_content_left(window.outerWidth * .125)

	})

	return (

		<>

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

		</>

	)//end return()

}