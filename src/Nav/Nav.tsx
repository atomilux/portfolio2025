import { useContext, useEffect, useRef, useState, useCallback } from 'react'
import { PortfolioContext } from '../Data/DataProvider'

//CSS
import './Nav.css'


export default function Nav() {


	////////////////////// REFERENCES //////////////////////

	//DOM references for swapping classes on <div class="nav"> and measuring nav height
	const dom_nav 										= useRef(null) //Nav Container whole
	const dom_nav_header 							= useRef(null) //AS A SENIOR LEVEL:
	const dom_nav_role_list						= useRef(null) //skill list container

	//TODO - refactor past thgis v1
	const refs = useRef({});

	const handleRef = (key,ref) => {
		refs.current[key] = ref
	}


	////////////////////// GLOBAL VARIABLES //////////////////////


	//----------- SKILL ------------

	//All skill data objects (key, title, desc, resume)
	const {
		ee,
		EVT,
		global_roles, 
		anim_sequence_subnav_click,
		set_global_content_3d_translateZ,
	} = useContext(PortfolioContext)

	const {global_nav_isOpen, set_global_nav_isOpen} = useContext(PortfolioContext)

	//the main lane switcher for the portfolio silo based on type of role
	//values - skills_marketing, skills_uiux, skills_webDev, skills_gameDev
	const {global_role_current, set_global_role_current} = useContext(PortfolioContext)


	const {ctrl_set_global_role_skillsData, ctrl_set_global_role_skillsRanked} = useContext(PortfolioContext)


	//TODO - take this back to local or answer why it's in global if not
	//const {global_nav_openHeight, set_global_nav_openHeight} = useContext(PortfolioContext)

	//the Nav CSS styling class for role flavor
	/*
		{
			"skills_marketing":"nav_marketing",
			"skills_uiux"			:"nav_uiux",
			"skills_webDev"		:"nav_webDev",
			"skills_gameDev"	:"nav_gameDev"
		}
	*/
	const {global_ui_nav_classMap} = useContext(PortfolioContext)


	//----------- PORTFOLIO ------------

	//get collection of portfolio items by skills
	const {ctrl_portfolio_filter_bySkillArray} = useContext(PortfolioContext);





	////////////////////// LOCAL VARIABLES //////////////////////


	//one time var we use to trigger init calcs in useEffect 1 time
	const [
		local_nav_isFirstLoad, 
		local_set_nav_isFirstLoad] 				= useState(true)

	//TODO - track down if we need to swap these for global
	//open height value 
	const [
		local_nav_heightOpen, 
		local_set_nav_heightOpen] 				= useState(0)

	//close height value
	const [
		local_nav_heightClosed,
		local_set_nav_heightClosed] 			= useState(0)

	//DOM height storage for inline CSS height/animations to work
	const [
		local_nav_heightOpenDOMready, 
		local_set_nav_heightOpenDOMready] = useState(0)

	//DOM - swappable CSS styling class for skillset
	const [
		local_nav_skillset_navStyling, 
		local_set_nav_skillset_navStyling] = useState("nav_marketing")

	//DOM - man nav size
	const [
		local_nav_item_height,
		local_set_local_nav_item_height] = useState(10)
	


	////////////////////// FUNCTIONS //////////////////////

	//----- UI CALCULATIONS --------
	const calc_nav_itemHeight = () => {

		console.log("calc_nav_itemHeight()");

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
			font_size_fraction = .05
		}

		console.log(font_size_fraction)

		const final_size_px = (window.innerWidth * font_size_fraction)

		console.log(final_size_px)

		return final_size_px


	}//end f


	const calc_nav_openCloseHeights = useCallback(() => {

		//console.log("calc_nav_openCloseHeights()");

		//const nav_cont_height = calc_get_nav_height()
		const nav_cont_height = dom_nav_role_list.current.getBoundingClientRect().height
	
		//const nav_firstItem_height = calc_get_nav_firstItemHeight()
		const nav_firstItem_height = refs.current["skills_marketing"].getBoundingClientRect().height

		//const nav_header_height = calc_get_nav_headerHeight()
		const nav_header_height = dom_nav_header.current.getBoundingClientRect().height

		const skillHeight = nav_cont_height + nav_header_height
		const skillHeightClose = nav_header_height + nav_firstItem_height

		return {
			skillHeight,
			skillHeightClose
		}

	})//end f


	//---- STATE ------
	const local_set_heightsData = (heights_obj, setOpen_bool) => {

		//console.log("local_set_heightsData()");

		console.log("local_set_heightsData() - setOpen_bool: " + setOpen_bool);
		console.dir(heights_obj)

		//open height
		local_set_nav_heightClosed(heights_obj.skillHeight)

		//close height
		local_set_nav_heightOpen(heights_obj.skillHeightClose)

		//toggling DOM height
		if (setOpen_bool === true) {
			console.log("local_set_heightsData() - set to OPEN height")
			local_set_nav_heightOpenDOMready(heights_obj.skillHeight)
			return;
		}

		if (setOpen_bool === false) {
			console.log("local_set_heightsData() - set to CLOSED height")
			local_set_nav_heightOpenDOMready(heights_obj.skillHeightClose)
		}

	}


	//---- UI STYLING ------
	const ui_bold_nav = (skillset_in:string):string => {

		if (global_role_current === skillset_in) {
			return "nav_role_item_active"
		}

		return ""

	}//end f


	const ui_switch_navSkillsetCSS = (skillset_in:string):string => {

		console.log("switch_css() - skillset_in: " + skillset_in)
		
		return global_ui_nav_classMap[skillset_in]

	}//end f


	const ui_switch_navOrdering = (skillset_in:string) => {

		refs.current["skills_marketing"].classList.remove("textBold","orderMinus1");
		refs.current["skills_uiux"].classList.remove("textBold","orderMinus1");
		refs.current["skills_webDev"].classList.remove("textBold","orderMinus1");
		refs.current["skills_gameDev"].classList.remove("textBold","orderMinus1");

		refs.current[skillset_in].classList.add("textBold","orderMinus1");
		
	}//end f



	//---- CLICK ------
	const ui_click_skill = (e) => {

		console.log("--------------------- CLICK NAV --------------------- ");

		//scope the data-key attribute
		const role:string = e.target.dataset.key


		//----------- GLOBAL STATE----------

		//GLOBAL - update current role skillset data obj
		ctrl_set_global_role_skillsData(role)

		//GLOBAL - update current ranked skills
		ctrl_set_global_role_skillsRanked(role)

		//GLOBAL - update current skillset
		ctrl_set_global_role_skillsData(role)

		//GLOBAL - see if we can call a function to filter portfolio
		ctrl_portfolio_filter_bySkillArray(role)



		//----------- OPEN/CLOSE ----------

		//LOCAL - invert isOpen boolean
		set_global_nav_isOpen(!global_nav_isOpen)

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


		console.log("handle_skill_click() - END - global_nav_isOpen: " + global_nav_isOpen)


		//----------- ANIMATION ----------

		//if it's a different NAV item then animate page
		if (role !== global_role_current.key) {
			anim_sequence_subnav_click()
		}

		//if it's the same item and NAV is OPEN
		if (role === global_role_current.key && global_nav_isOpen) {
			anim_sequence_subnav_click()
		}
	
	}//end f




	////////////////////// EFFECTS //////////////////////
	
	useEffect(()=>{

		console.log("------ Nav.tsx - useEffect() -----------");
		console.log("local_set_nav_heightOpenDOMready: " + local_nav_heightOpenDOMready);


		//for some reason it takes a few cycles for setState to catch up ... fkn React
		if (dom_nav.current.getBoundingClientRect().height === 0) { return; }

		//trigger init calcs
		if (local_nav_isFirstLoad) { 


			//----------- OPEN/CLOSE ----------

			//LOCAL - invert isOpen boolean
			//set_global_nav_isOpen(!global_nav_isOpen)

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

			ctrl_set_global_role_skillsRanked(global_role_current.key)

			set_global_content_3d_translateZ(window.outerWidth * .4)

		}//end if

	},[
		ee,
		local_nav_item_height,
		calc_nav_openCloseHeights,
		local_nav_heightOpenDOMready,
		local_nav_isFirstLoad,
		global_nav_isOpen,
		global_role_current,
		ctrl_set_global_role_skillsRanked,
		set_global_content_3d_translateZ
	])

	


	////////////////////// EVENTS //////////////////////


	ee.on(EVT.WINDOW_RESIZE,()=>{

		//console.log("EVT.WINDOW_RESIZE - Nav.tsx");

		ee.delay1000(

			()=>{

				//----------- OPEN/CLOSE ----------

				//LOCAL - invert isOpen boolean
				//set_global_nav_isOpen(!global_nav_isOpen)

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

		set_global_content_3d_translateZ(window.outerWidth * .4)

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
					global_roles.map(
						
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
