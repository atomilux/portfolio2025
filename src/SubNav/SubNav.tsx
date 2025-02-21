import { useContext, useEffect, useRef, useState, useCallback } from 'react'
import { PortfolioContext } from '../Data/DataProvider'

//CSS
import './SubNav.css'


export default function SubNav() {


	////////////////////// REFERENCES //////////////////////

	const dom_ref_overview 	= useRef(null)
	const dom_ref_skillset 	= useRef(null)
	const dom_ref_portfolio = useRef(null)
	const dom_ref_stick 		= useRef(null)



	////////////////////// GLOBAL VARIABLES //////////////////////

	const {
		ee,
		EVT,
		ctrl_set_rotateY,
		global_subnav_opacity,
		global_subnav_scale,
		global_role_current, global_portfolio_mode, 
		set_global_portfolio_mode,
		global_nav_isOpen
	} = useContext(PortfolioContext)




	////////////////////// LOCAL VARIABLES //////////////////////

	const [local_firstRun, set_local_firstRun] 										= useState(true)
	const [local_stick_move, set_local_stick_move] 								= useState(false)
	const [local_stick_x, set_local_stick_x] 											= useState(0)
	const [local_stick_x_overview, set_local_stick_x_overview] 		= useState(0)
	const [local_stick_x_skillset, set_local_stick_x_skillset] 		= useState(0)
	const [local_stick_x_portfolio, set_local_stick_x_portfolio] 	= useState(0)
	const [ee_assigned, set_ee_assigned] 													= useState(false)




	////////////////////// FUNCTIONS //////////////////////

	//---- UI STYLING ------
	const ui_subnav_overview_active = () => {
		let active_css = "subnav_active"
		if (global_portfolio_mode !== "overview") {
			active_css = "";
		}
		return active_css;
	}

	const ui_subnav_skillset_active = () => {
		let active_css = "subnav_active"
		if (global_portfolio_mode !== "skillset") {
			active_css = "";
		}
		return active_css;
	}

	const ui_subnav_portfolio_active = () => {
		let active_css = "subnav_active"
		if (global_portfolio_mode !== "portfolio") {
			active_css = "";
		}
		return active_css;
	}


	//---- CLICK ------
	const ui_click_overview = () => {

		set_local_stick_move(true)

		set_global_portfolio_mode("overview")
		ui_stick_move()

		ctrl_set_rotateY("overview")

		ee.emit(EVT.SUBNAV_CLICK,{'subnav':'overview'})

	}

	const ui_click_skillset = () => {

		set_local_stick_move(true)

		set_global_portfolio_mode("skillset")
		ui_stick_move()

		ctrl_set_rotateY("skillset")

		ee.emit(EVT.SUBNAV_CLICK,{'subnav':'skillset'})

	}

	const ui_click_portfolio = () => {

		set_local_stick_move(true)

		set_global_portfolio_mode("portfolio")
		ui_stick_move()

		ctrl_set_rotateY("portfolio")

		ee.emit(EVT.SUBNAV_CLICK,{'subnav':'portfolio'})

	}


	//---- ANIMATE ------
	const ui_stick_move = useCallback(() => {
		
		
		if (global_portfolio_mode === "overview") {
			set_local_stick_x(local_stick_x_overview)
		}

		if (global_portfolio_mode === "skillset") {
			set_local_stick_x(local_stick_x_skillset)
		}

		if (global_portfolio_mode === "portfolio") {
			set_local_stick_x(local_stick_x_portfolio)
		}

	})


	//----- UI CALCULATIONS --------
	const ui_stick_calcs = useCallback(() => {

		const overview_rect 	= dom_ref_overview.current.getBoundingClientRect()
		const skillset_rect 	= dom_ref_skillset.current.getBoundingClientRect()
		const portfolio_rect 	= dom_ref_portfolio.current.getBoundingClientRect()
		
		if (local_firstRun === true) {
			set_local_stick_x(overview_rect.left)
		}

		set_local_stick_x_overview(overview_rect.left)
		set_local_stick_x_skillset(skillset_rect.left)
		set_local_stick_x_portfolio(portfolio_rect.left)

	})


	////////////////////// EFFECTS //////////////////////

	useEffect(()=>{

		if (local_firstRun) {
			ui_stick_calcs()
			set_local_firstRun(false)
		}

		if(local_stick_move) {

			console.log("SubNav.tsx - useEffect()")

			ui_stick_move()

			set_local_stick_move(false)

		}

	},[
		local_stick_move,
		local_firstRun,
		ui_stick_calcs,
		global_subnav_opacity,
		global_subnav_scale,
		global_nav_isOpen, 
		local_stick_x, 
		set_local_stick_x, 
		global_portfolio_mode,
		ui_stick_move,
		ee_assigned,
		set_ee_assigned
	])



	////////////////////// EVENTS //////////////////////

	ee.on(EVT.WINDOW_RESIZE,()=>{

		console.log("SubNav.tsx - EVT.WINDOW_RESIZE");
		ui_stick_calcs()

		ee.delay500(()=>{
			ui_stick_move()
		})
		
	})



	////////////////////// RENDER //////////////////////

	return (
					
		<div id="subnav_category" className={"subnav subnav_" + global_role_current.key} style={{opacity:global_subnav_opacity, transform:'scale('+global_subnav_scale+')'}}>

			<div className="content_subnav">

			<div className="content_subnav_item">

				<div 
					className={"subnav_title " + ui_subnav_overview_active()} 
					onClick={ui_click_overview} 
					ref={dom_ref_overview}
				>

						OVERVIEW

					</div>

				</div>


				<div className="content_subnav_item">

					<div 
						className={"subnav_title " + ui_subnav_skillset_active()} 
						onClick={ui_click_skillset} 
						ref={dom_ref_skillset}
					>

						SKILLSET

					</div>

				</div>

				<div className="content_subnav_item">

					<div 
						className={"subnav_title " + ui_subnav_portfolio_active()} 
						onClick={ui_click_portfolio} 
						ref={dom_ref_portfolio}
					>
						
						PORTFOLIO
						
					</div>

				</div>
				
			</div>

			<div className="subnav_stick_row">
				<div className="subnav_stick" ref={dom_ref_stick} style={{left:local_stick_x+"px"}}></div>
			</div>
		</div>

	)

}