import { useContext, useEffect, useRef, useState } from 'react'
import './Nav.css'
import { PortfolioContext } from '../DataProvider/DataProvider'


export default function Nav() {

	//DOM references for swapping classes on <div class="nav"> and measuring nav height
	const dom_nav 										= useRef(null) //Nav Container whole
	const dom_nav_header 							= useRef(null) //AS A SENIOR LEVEL:
	const dom_nav_role_item 					= useRef(null) //Nav Items
	const dom_nav_role_list						= useRef(null) //skill list container


	//======================= GLOBAL CONTEXT - PORTFOLIO DATA =======================


	//----------- SKILL ROLES ------------

	//All skill data objects (key, title, desc, resume)
	const {
		global_roles, 
		anim_sequence_subnav_click,
		set_global_content_3d_translateZ,
		global_content_3d_translateZ
	} = useContext(PortfolioContext)

	const {global_nav_isOpen, set_global_nav_isOpen} = useContext(PortfolioContext)

	//the main lane switcher for the portfolio silo based on type of role
	//values - skills_marketing, skills_uiux, skills_webDev, skills_gameDev
	const {global_role_current, set_global_role_current} = useContext(PortfolioContext)


	const {ctrl_set_global_role_skillsData, ctrl_set_global_role_skillsRanked} = useContext(PortfolioContext)


	const {global_nav_openHeight, set_global_nav_openHeight} = useContext(PortfolioContext)

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

	//------------ get collection of portfolio items by skills -------------

	const {ctrl_portfolio_filter_bySkillArray} = useContext(PortfolioContext);



	//======================= LOCAL STATE =======================

	//one time var we use to trigger init calcs in useEffect 1 time
	const [
		local_nav_isFirstLoad, 
		local_set_nav_isFirstLoad] 				= useState(true)

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



	const calc_nav_openCloseHeights = () => {

		const skillHeight = 
			(dom_nav_role_list.current.children.length + 1) * 
			refs.current["skills_gameDev"].getBoundingClientRect().height + 
			dom_nav_header.current.getBoundingClientRect().height

		local_set_nav_heightOpenDOMready(skillHeight)
		local_set_nav_heightOpen(skillHeight)

		let skillHeightClose = 	
			dom_nav_header.current.getBoundingClientRect().height +
			(refs.current["skills_gameDev"].getBoundingClientRect().height)

		local_set_nav_heightClosed(skillHeightClose)

		set_global_nav_openHeight(skillHeightClose)

	}//end f



	window.onresize = () => {

		calc_nav_openCloseHeights() //do dem calcs

		//UI - update height calcs
		//ui_nav_setHeight(local_nav_isOpen)
		ui_nav_setHeight(global_nav_isOpen)

		set_global_content_3d_translateZ(window.outerWidth * .4)


	}


	const ui_bold_nav = (skillset_in:string) => {

		if (global_role_current === skillset_in) {
			return "nav_role_item_active"
		}

		return ""

	}//end f


	const ui_nav_setHeight = (setOpen_bool) => {

		if (setOpen_bool === true) {
			console.log("ui_nav_setHeight() - set to OPEN height")
			local_set_nav_heightOpenDOMready(local_nav_heightOpen)
			return;
		}

		if (setOpen_bool === false) {
			console.log("ui_nav_setHeight() - set to CLOSED height")
			local_set_nav_heightOpenDOMready(local_nav_heightClosed)
		}

	}


	const ui_handle_skill_click = (e) => {

		console.log("--------------------- CLICK NAV --------------------- ");

		//scope the data-key attribute
		const role:string = e.target.dataset.key

		//GLOBAL - update current role skillset data obj
		ctrl_set_global_role_skillsData(role)

		//GLOBAL - update current ranked skills
		ctrl_set_global_role_skillsRanked(role)

		//GLOBAL - update current skillset
		ctrl_set_global_role_skillsData(role)
		//set_global_role_current(role)

		//UI - update current skillset CSS class
		ui_switch_navSkillsetCSS(role)

		//LOCAL - invert isOpen boolean
		//local_set_nav_isOpen(!local_nav_isOpen)
		set_global_nav_isOpen(!global_nav_isOpen)

		//UI - update height calcs
		ui_nav_setHeight(!global_nav_isOpen)

		//UI - swap order via CSS classes
		ui_switch_navOrdering(role)

		//TEST - see if we can call a function to filter portfolio
		ctrl_portfolio_filter_bySkillArray(role)

		console.log("handle_skill_click() - END - global_nav_isOpen: " + global_nav_isOpen)

		//if it's a different NAV item then animate page
		if (role !== global_role_current.key) {

			anim_sequence_subnav_click()

		}

		if (role === global_role_current.key && global_nav_isOpen) {
			anim_sequence_subnav_click()
		}
	
	}//end f

	const ui_switch_navSkillsetCSS = (skillset_in:string) => {

		console.log("switch_css() - skillset_in: " + skillset_in)
		
		local_set_nav_skillset_navStyling(global_ui_nav_classMap[skillset_in])

	}//end f


	const ui_switch_navOrdering = (skillset_in:string) => {

		refs.current["skills_marketing"].classList.remove("textBold","orderMinus1");
		refs.current["skills_uiux"].classList.remove("textBold","orderMinus1");
		refs.current["skills_webDev"].classList.remove("textBold","orderMinus1");
		refs.current["skills_gameDev"].classList.remove("textBold","orderMinus1");

		refs.current[skillset_in].classList.add("textBold","orderMinus1");
		
	}

	//TODO - refactor past thgis v1
	const refs = useRef({});

	const handleRef = (key,ref) => {
		refs.current[key] = ref
	}



	//---------- when component mounts -----------
	
	useEffect(()=>{


		//for some reason it takes a few cycles for setState to catch up ... fkn React
		if (dom_nav.current.getBoundingClientRect().height === 0) { return; }

		//trigger init calcs
		if (local_nav_isFirstLoad) { 

			calc_nav_openCloseHeights() //do dem calcs
			local_set_nav_isFirstLoad(false) //turn off so we don't keep re-initializaing

			ctrl_set_global_role_skillsRanked(global_role_current.key)

			set_global_content_3d_translateZ(window.outerWidth * .4)

		}//end if

	},[
		local_nav_heightOpen, 
		calc_nav_openCloseHeights,
		local_nav_heightOpenDOMready, 
		local_set_nav_heightOpenDOMready, 
		local_nav_heightClosed, 
		local_nav_isFirstLoad,
		global_nav_isOpen,
		global_role_current,
		ctrl_set_global_role_skillsRanked,
		set_global_content_3d_translateZ
	])



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
									onClick={ui_handle_skill_click} 
									data-key={item.key}
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
