import { useContext, useEffect, useRef, useState, useCallback } from 'react'
import { PortfolioContext } from '../Data/DataProvider'

import { EVT_ENUM, LVL } from '../Data/Models'

//import { style_out } from '../Logger/Output'
//CSS
import './Nav.css'

export default function Nav() {

	const debug:boolean = true;
	
	/*
	const o = (msg: string, l: LVL) => {
		return style_out(msg, l)
	}
	*/

	////////////////////// GLOBAL VARIABLES //////////////////////

	//All skill data objects (key, title, desc, resume)
	const {
		ee,
		global_skills_roles, 
		anim_sequence_subnav_click,
		global_set_content_3d_translateZ,
		global_nav_isOpen, 
		global_set_nav_isOpen,
		global_skills_role_current,
		ctrl_set_global_role_skillsData,
		ctrl_set_global_role_skillsRanked,
		global_ui_nav_classMap,
		ctrl_portfolio_filter_byRole
	} = useContext(PortfolioContext)


	////////////////////// REFERENCES //////////////////////

	//DOM references for swapping classes on <div class="nav"> and measuring nav height
	const dom_nav 										= useRef<HTMLDivElement>(null) //Nav Container whole
	const dom_nav_header 							= useRef<HTMLDivElement>(null) //AS A SENIOR LEVEL:
	const dom_nav_role_list						= useRef<HTMLDivElement>(null) //skill list container

	//TODO - refactor past thgis v1
	const refs = useRef<{ [key: string]: HTMLDivElement | null }>({});

	const handleRef = (key: string,ref: HTMLDivElement | null) => {
		refs.current[key] = ref
	}


	//----------- PORTFOLIO ------------


	////////////////////// LOCAL VARIABLES //////////////////////


	//one time var we use to trigger init calcs in useEffect 1 time
	const [
		local_nav_isFirstLoad, 
		local_set_nav_isFirstLoad] 				= useState(true)

	//TODO - track down if we need to swap these for global
	//open height value 

	/*
	const [
		local_nav_heightOpen, 
		local_set_nav_heightOpen] 				= useState(0)

	//close height value
	const [
		local_nav_heightClosed,
		local_set_nav_heightClosed] 			= useState(0)
		*/

	//DOM height storage for inline CSS height/animations to work
	const [
		local_nav_heightOpenDOMready, 
		local_set_nav_heightOpenDOMready] = useState(10)

	//DOM - swappable CSS styling class for skillset
	const [
		local_nav_skillset_navStyling, 
		local_set_nav_skillset_navStyling] = useState("nav_marketing")

	//DOM - man nav size
	const [
		local_nav_item_height,
		local_set_local_nav_item_height] = useState(10)
	


	////////////////////// DATA MODELS //////////////////////

	interface HeightsObject {
		skillHeight:number,
		skillHeightClose:number
	}



	////////////////////// FUNCTIONS //////////////////////

	//----- UI CALCULATIONS --------
	const calc_nav_itemHeight = useCallback(() => {

		if (debug) console.log("calc_nav_itemHeight",LVL.function)

		let font_size_fraction = 1.0
		const window_width = window.innerWidth

		//mobile
		if (window_width < 510){
			font_size_fraction = .08
		}

		//tablet
		if (window_width >= 510 && window_width <= 768){
			font_size_fraction = .06
		}	

		//laptop	
		if (window_width >= 768 && window_width <= 1024) {
			font_size_fraction = .04
		}

		//desktop
		if (window_width > 1024){
			font_size_fraction = .03
		}

		//console.log(font_size_fraction)

		const final_size_px = (window.innerWidth * font_size_fraction)

		//console.log(final_size_px)

		return final_size_px


	},[debug])//end f


	const calc_nav_openCloseHeights = useCallback(() => {

		if (debug) console.log("calc_nav_openCloseHeights",LVL.function)

		//const nav_cont_height = calc_get_nav_height()
		const nav_cont_height = dom_nav_role_list.current ? dom_nav_role_list.current.getBoundingClientRect().height : 0
	
		//const nav_firstItem_height = calc_get_nav_firstItemHeight()
		const nav_firstItem_height = refs.current["skills_marketing"] ? refs.current["skills_marketing"].getBoundingClientRect().height : 0

		//const nav_header_height = calc_get_nav_headerHeight()
		const nav_header_height = dom_nav_header.current ? dom_nav_header.current.getBoundingClientRect().height : 0

		const skillHeight = nav_cont_height + nav_header_height
		const skillHeightClose = nav_header_height + nav_firstItem_height

		if (debug)
			console.log("skillHeight:"+skillHeight,LVL.line)
			console.log("skillHeightClose:"+skillHeightClose,LVL.line)
		

		return {
			skillHeight,
			skillHeightClose
		}

	},[debug])//end f




	//---- STATE ------
	const local_set_heightsData = useCallback((heights_obj:HeightsObject, setOpen_bool:boolean) => {

		if (debug) 
			console.log( "local_set_heightsData",				LVL.function						) 					
			console.log( "heights_obj: ",								LVL.line, heights_obj		)	
			console.log( "setOpen_bool:"+setOpen_bool,	LVL.line								) 							
		

		//toggling DOM height
		if (setOpen_bool === true) {
			if (debug) console.log("local_set_heightsData() - set to OPEN height",LVL.line)
			local_set_nav_heightOpenDOMready(heights_obj.skillHeight)
			return;
		}

		if (setOpen_bool === false) {
			if (debug) console.log("local_set_heightsData() - set to CLOSED height",LVL.line)
			local_set_nav_heightOpenDOMready(heights_obj.skillHeightClose)
		}

	},[debug])


	//---- UI STYLING ------
	const ui_bold_nav = (skillset_in:string):string => {

		if(debug) console.log("ui_bold_nav",LVL.function)

		if (global_skills_role_current.key === skillset_in) {
			return "nav_role_item_active"
		}

		return ""

	}//end f


	const ui_switch_navSkillsetCSS = (skillset_in:string):string => {

		if (debug) console.log("ui_switch_navSkillsetCSS",LVL.function)
		
		if (skillset_in in global_ui_nav_classMap) {
			return global_ui_nav_classMap[skillset_in as keyof typeof global_ui_nav_classMap]
		}
		return ''

	}//end f


	const ui_switch_navOrdering = (skillset_in:string) => {

		if (debug) console.log("ui_click_skill",LVL.function)

		if (refs.current["skills_marketing"]) {
			refs.current["skills_marketing"].classList.remove("textBold","orderMinus1")
		}
		
		if (refs.current["skills_uiux"]) {
			refs.current["skills_uiux"].classList.remove("textBold","orderMinus1")
		}

		if (refs.current["skills_webDev"]) {
			refs.current["skills_webDev"].classList.remove("textBold","orderMinus1")
		}

		if (refs.current["skills_gameDev"]) {
			refs.current["skills_gameDev"].classList.remove("textBold","orderMinus1")
		}

		if (refs.current[skillset_in]) {
			refs.current[skillset_in].classList.add("textBold","orderMinus1")
		}
		
	}//end f



	//---- CLICK ------
	const ui_click_skill = (e: React.MouseEvent<HTMLDivElement>) => {

		if (debug) console.log("ui_click_skill",LVL.function)

		//scope the data-key attribute
		const role:string = (e.target as HTMLDivElement).dataset.key || ''


		//----------- GLOBAL STATE----------

		//GLOBAL - update current role skillset data obj
		ctrl_set_global_role_skillsData(role)

		//GLOBAL - update current ranked skills
		ctrl_set_global_role_skillsRanked(role)

		//GLOBAL - update current skillset
		ctrl_set_global_role_skillsData(role)

		//GLOBAL - see if we can call a function to filter portfolio
		ctrl_portfolio_filter_byRole(role)



		//----------- OPEN/CLOSE ----------

		//LOCAL - invert isOpen boolean
		global_set_nav_isOpen(!global_nav_isOpen)

		//RESPONSIVE
		//Calculate dynamic height of nav items based on window width
		const final_size_px = calc_nav_itemHeight()
		local_set_local_nav_item_height(final_size_px)


		//UI - update height calcs
		//NOTE - state still thinks its the oppisite of what we is going to be set, hence the !

		//responsieve - calc height of nav item container open and closed
		const heights_obj = calc_nav_openCloseHeights()

		//STATE - updates multiple state vars
		//NOTE - state still thinks its the oppisite of what we is going to be set, hence the !
		local_set_heightsData(heights_obj,!global_nav_isOpen)


		//----------- STYLING ----------

		//UI - swap order via CSS classes
		ui_switch_navOrdering(role)

		//GET - CSS nav class mapping
		const nav_class = ui_switch_navSkillsetCSS(role)

		//STATE - update current skillset CSS class
		local_set_nav_skillset_navStyling(nav_class)


		//----------- ANIMATION ----------

		//if it's a different NAV item then animate page
		if (role !== global_skills_role_current.key) {
			anim_sequence_subnav_click()
		}

		//if it's the same item and NAV is OPEN
		if (role === global_skills_role_current.key && global_nav_isOpen) {
			anim_sequence_subnav_click()
		}
	
	}//end f




	////////////////////// EFFECTS //////////////////////
	
	useEffect(()=>{

		if (debug) console.log("Nav.tsx",LVL.effect)

		//for some reason it takes a few cycles for setState to catch up ... fkn React
		if (dom_nav.current && dom_nav.current.getBoundingClientRect().height === 0) { 
			
			if (debug) 
				console.dir(dom_nav.current);
				console.dir(dom_nav.current.getBoundingClientRect())
				console.log("- return",LVL.line)

			return; 
		
		}

		//trigger init calcs
		if (local_nav_isFirstLoad) { 

			if (debug) { console.log("- local_nav_isFirstLoad",LVL.line) }

			//----------- OPEN/CLOSE ----------

			//RESPONSIVE
			//Calculate dynamic height of nav items based on window width
			const final_size_px = calc_nav_itemHeight()
			local_set_local_nav_item_height(final_size_px)

			//wait a second for next loop
			ee.delay1000(
				
				()=>{

					//responsieve - calc height of nav item container open and closed
					const heights_obj = calc_nav_openCloseHeights()

					//STATE - updates multiple state vars
					//NOTE - state still thinks its the oppisite of what we is going to be set, hence the !

					local_set_heightsData(heights_obj,global_nav_isOpen)

				}

			)

			local_set_nav_isFirstLoad(false) //turn off so we don't keep re-initializaing

			ctrl_set_global_role_skillsRanked(global_skills_role_current.key)

			global_set_content_3d_translateZ(window.outerWidth * .4)

		}//end if

	},[
		ee,
		local_nav_item_height,
		local_set_heightsData,
		calc_nav_openCloseHeights,
		local_nav_heightOpenDOMready,
		local_nav_isFirstLoad,
		global_nav_isOpen,
		global_skills_role_current,
		ctrl_set_global_role_skillsRanked,
		global_set_content_3d_translateZ,
		calc_nav_itemHeight,
		debug
	])

	


	////////////////////// EVENTS //////////////////////


	ee.on(EVT_ENUM.WINDOW_RESIZE,()=>{

		if (debug) console.log("Nav.tsx - EVT_ENUM.WINDOW_RESIZE",LVL.event); 

		ee.delay1000(

			()=>{

				//----------- OPEN/CLOSE ----------

				//RESPONSIVE
				//Calculate dynamic height of nav items based on window width
				const final_size_px = calc_nav_itemHeight()
				local_set_local_nav_item_height(final_size_px)

				ee.delay500(()=>{

					calc_nav_openCloseHeights()

					ee.delay500(()=>{

											//responsieve - calc height of nav item container open and closed
						const heights_obj = calc_nav_openCloseHeights()

						//STATE - updates multiple state vars
						//NOTE - state still thinks its the oppisite of what we is going to be set, hence the !
						local_set_heightsData(heights_obj,global_nav_isOpen)
	
					})

				})
				
			}
		
		)

		global_set_content_3d_translateZ(window.outerWidth * .4)

	})




	////////////////////// RENDER //////////////////////


	return (

		<div 
			className={ "nav a-fade-in a-delay-1s nav_short " + local_nav_skillset_navStyling } 
			ref={ dom_nav } 
			style={{ height: local_nav_heightOpenDOMready + "px" }}
		>
						
			<div className="nav_role" ref={dom_nav_header}>
				<div className="nav_role_control">
					<div className="nav_role_title">AS A SENIOR LEVEL:</div>
				</div>
			</div> 

			<div className="nav_role_list_container" ref={dom_nav_role_list}>

				{
					global_skills_roles.map(
						
						(item, i) => (
					
							<div 
								className={'nav_role_item ' + item.key} 
								key={i} 
								ref={ref => handleRef(item.key,ref)}
							>

								<div 
									className={"nav_role_item_link " + ui_bold_nav(item.key)} 
									onClick={ui_click_skill} 
									data-key={item.key}
									style={{fontSize:local_nav_item_height + 'px'}}
								>
									
									{ item.title }

								</div>

							</div>

						)

					)//end map

				}

			</div>

		</div>

	)//end return()

}//end class
