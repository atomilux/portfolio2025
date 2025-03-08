import { useContext, useEffect, useRef, useState, useCallback } from 'react'
import { PortfolioContext } from '../Data/DataProvider'

import { EVT_ENUM, LVL } from '../Data/Models'

import { chalk_out } from '../Logger/Output'


//CSS
import './SubNav.css'


export default function SubNav() {

	const debug:boolean = false;

	const o = (msg:string,l:LVL) => {
		return chalk_out(msg,l)
	}


	////////////////////// GLOBAL VARIABLES //////////////////////

	const {
		ee,
		ctrl_set_rotateY,
		global_subnav_opacity,
		global_subnav_scale,
		global_skills_role_current: global_skills_role_current, global_portfolio_mode, 
		global_set_portfolio_mode: global_set_portfolio_mode
	} = useContext(PortfolioContext)



	////////////////////// REFERENCES //////////////////////

	const dom_ref_overview 							= useRef<HTMLDivElement>(null)
	const dom_ref_overview_container 		= useRef<HTMLDivElement>(null)

	const dom_ref_skillset 							= useRef<HTMLDivElement>(null)
	const dom_ref_skillset_container 		= useRef<HTMLDivElement>(null)

	const dom_ref_portfolio 						= useRef<HTMLDivElement>(null)
	const dom_ref_portfolio_container 	= useRef<HTMLDivElement>(null)

	const dom_ref_stick 								= useRef<HTMLDivElement>(null)
	const dom_ref_stick_container				= useRef<HTMLDivElement>(null)








	////////////////////// LOCAL VARIABLES //////////////////////

	const [local_firstRun, set_local_firstRun] 										= useState(true)
	//const [local_stick_move, set_local_stick_move] 								= useState(false)
	//const [local_resize_move, set_local_resize_move]							= useState(false)
	const [local_stick_x, set_local_stick_x] 											= useState(0)
	const [local_stick_x_overview, set_local_stick_x_overview] 		= useState(0)
	const [local_stick_x_skillset, set_local_stick_x_skillset] 		= useState(0)
	const [local_stick_x_portfolio, set_local_stick_x_portfolio] 	= useState(0)




	////////////////////// FUNCTIONS //////////////////////

	//---- UI STYLING ------
	const ui_subnav_overview_active = () => {

		if (debug) { console.log( o("ui_subnav_overview_active",LVL.function)) }

		let active_css = "subnav_active"
		if (global_portfolio_mode !== "overview") {
			active_css = "";
		}
		return active_css;
	}

	const ui_subnav_skillset_active = () => {

		if (debug) { console.log( o("ui_subnav_skillset_active",LVL.function) ) }

		let active_css = "subnav_active"
		if (global_portfolio_mode !== "skillset") {
			active_css = "";
		}
		return active_css;
	}

	const ui_subnav_portfolio_active = () => {

		if (debug) { console.log( o("ui_subnav_portfolio_active",LVL.function) ) }

		let active_css = "subnav_active"
		if (global_portfolio_mode !== "portfolio") {
			active_css = "";
		}
		return active_css;
	}


	//---- CLICK ------
	const ui_click_overview = () => {

		if (debug) { console.log( o("ui_click_overview",LVL.function) ) }

		//set_local_stick_move(true)

		global_set_portfolio_mode("overview")
		ui_stick_move()

		ctrl_set_rotateY("overview")

		ee.emit(EVT_ENUM.SUBNAV_CLICK,{'subnav':'overview'})

	}

	const ui_click_skillset = () => {

		if (debug) { console.log( o("ui_click_skillset",LVL.function) ) }

		//set_local_stick_move(true)

		global_set_portfolio_mode("skillset")
		ui_stick_move()

		ctrl_set_rotateY("skillset")

		ee.emit(EVT_ENUM.SUBNAV_CLICK,{'subnav':'skillset'})

	}

	const ui_click_portfolio = () => {

		if (debug) { console.log(  o("ui_click_portfolio",LVL.function) ) }

		//(true)

		global_set_portfolio_mode("portfolio")
		ui_stick_move()

		ctrl_set_rotateY("portfolio")

		ee.emit(EVT_ENUM.SUBNAV_CLICK,{'subnav':'portfolio'})

	}


	//---- ANIMATE ------
	const ui_stick_move = useCallback(() => {

		if (debug) { console.log(  o("ui_stick_move",LVL.function) ) }

		if (global_portfolio_mode === "overview") {
			set_local_stick_x(local_stick_x_overview)
		}

		if (global_portfolio_mode === "skillset") {
			set_local_stick_x(local_stick_x_skillset)
		}

		if (global_portfolio_mode === "portfolio") {
			set_local_stick_x(local_stick_x_portfolio)
		}

		//set_local_resize_move(false)

	},[
		global_portfolio_mode,
		set_local_stick_x,
		local_stick_x_overview,
		local_stick_x_skillset,
		local_stick_x_portfolio,
		debug
	])


	//----- UI CALCULATIONS --------
	const ui_stick_calcs = useCallback(() => {

		if (debug) { console.log(  o("ui_stick_calcs",LVL.function) ) }

		/*
		if (dom_ref_stick_container.current) {
			console.log("Asking for offsetWidth - forces window calcs to update: " + dom_ref_stick_container.current.offsetWidth)
		}
			*/

		const overview_rect 						= dom_ref_overview.current ?					 	dom_ref_overview.current.getBoundingClientRect() : 0

		const skillset_rect 						= dom_ref_skillset.current ? 						dom_ref_skillset.current.getBoundingClientRect() : 0

		const portfolio_rect 						= dom_ref_portfolio.current ? 					dom_ref_portfolio.current.getBoundingClientRect() : 0

		const stick_parent_rect 				= dom_ref_stick_container.current ? 		dom_ref_stick_container.current.getBoundingClientRect() : 0 	
	


		if (debug) { 
			console.log( o("Overview:",LVL.line)		,overview_rect			)
			console.log( o("Skillset:",LVL.line)		,skillset_rect			)
			console.log( o("Portfolio:",LVL.line)		,portfolio_rect			)
			console.log( o("Stick Row:",LVL.line)		,stick_parent_rect	)
		}

		
		if (local_firstRun === true) {
			if (overview_rect) set_local_stick_x(overview_rect.left)
		}

		if (overview_rect) {
			set_local_stick_x_overview(overview_rect.left)
		} 

		if (skillset_rect) {
			set_local_stick_x_skillset(skillset_rect.left*.95) //PITA - some CSS problem TODO - fix this
		} 
		
		if (portfolio_rect) {
			set_local_stick_x_portfolio(portfolio_rect.left)
		} 

	},[
		local_firstRun,
		debug
	])



	////////////////////// EFFECTS //////////////////////

	
	useEffect(()=>{

		if (debug) { console.log( o("SubNav.tsx",LVL.effect) ) }

		if (debug) { console.log( o("SubNav.tsx - useEffect - local_firstRun:true",LVL.line) ) }

		ui_stick_calcs()
		set_local_firstRun(false)

	})


	//--------- Initialize and assign the resize listener -----------

	useEffect(() => {

		if (debug) {
			console.log(o("SubNav.tsx - Setting up WINDOW_RESIZE listener", LVL.effect));
		}
	
		const handleResize = () => {
			if (debug) {
				console.log(o("SubNav.tsx - EVT_ENUM.WINDOW_RESIZE", LVL.event));
			}
			ui_stick_calcs();
		};
	
		ee.on(EVT_ENUM.WINDOW_RESIZE, handleResize);
	
		return () => {
			if (debug) {
				console.log(o("SubNav.tsx - Cleaning up WINDOW_RESIZE listener", LVL.effect));
			}
			ee.off(EVT_ENUM.WINDOW_RESIZE, handleResize);
		};
	}, [ui_stick_calcs, debug]);


	//--------- When to move the stick -----------
	
	useEffect(() => {
		if (debug) {
			console.log(o("SubNav.tsx - State changed, moving stick", LVL.effect));
		}
		ui_stick_move();
	}, [
		local_stick_x_overview, 
		local_stick_x_skillset, 
		local_stick_x_portfolio, 
		ui_stick_move, 
		debug]);




	////////////////////// RENDER //////////////////////

	return (
					
		<div id="subnav_category" className={"subnav subnav_" + global_skills_role_current.key} style={{opacity:global_subnav_opacity, transform:'scale('+global_subnav_scale+')'}}>

			<div className="content_subnav">

			<div className="content_subnav_item" ref={dom_ref_overview_container}>

				<div 
					className={"subnav_title " + ui_subnav_overview_active()} 
					onClick={ui_click_overview} 
					ref={dom_ref_overview}
				>

						OVERVIEW

					</div>

				</div>


				<div className="content_subnav_item" ref={dom_ref_skillset_container}>

					<div 
						className={"subnav_title " + ui_subnav_skillset_active()} 
						onClick={ui_click_skillset} 
						ref={dom_ref_skillset}
					>

						SKILLSET

					</div>

				</div>

				<div className="content_subnav_item" ref={dom_ref_portfolio_container}>

					<div 
						className={"subnav_title " + ui_subnav_portfolio_active()} 
						onClick={ui_click_portfolio} 
						ref={dom_ref_portfolio}
					>
						
						PORTFOLIO
						
					</div>

				</div>
				
			</div>

			<div className="subnav_stick_row" ref={dom_ref_stick_container}>
				<div className="subnav_stick" ref={dom_ref_stick} style={{left:local_stick_x+"px"}}></div>
			</div>
		</div>

	)

}