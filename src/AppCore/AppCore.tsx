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

/* Logging and Console styling */
import { style_out } from '../Logger/Output'

/* Util, Models, Events */
import { EVT_ENUM,LVL } from '../Data/Models'

/* SVG */
import stevelux_logo from '../assets/logo_stevelux_logotype_940x150.svg'


//--------------- AUGMENT WINDOW OBJECT -----------------

interface CustomWindow extends Window {
	port_isAwaiting_resize_timeout: boolean;
	port_resizeTimeout: ReturnType<typeof setTimeout>;
}

declare let window: CustomWindow;



//--------------- COMPONENT -----------------

export default function AppCore() {

	const debug:boolean = false;

	const o = (msg:string,l:LVL) => {
		return style_out(msg,l)
	}

	console.log(o("AppCore.tsx - INIT",LVL.effect))

	const {ee} = useContext(PortfolioContext) 



	const [ content_width, set_content_width 	] = useState(window.outerWidth * .75)
	const [ content_left, set_content_left		] = useState(window.outerWidth * .125)




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

				ee.emit(EVT_ENUM.WINDOW_RESIZE,{'source':'AppCore'})

				//turn off flag
				window['port_isAwaiting_resize_timeout'] = false;

			}, resize_delay);

		}//end event
	
	})

	
	////////////////////// EVENTS //////////////////////


	ee.on(EVT_ENUM.WINDOW_RESIZE,()=>{

		if (debug) {
			console.log(o("AppCore.tsx - EVT_ENUM.WINDOW_RESIZE",LVL.event))
		}

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

}//end f