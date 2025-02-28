import { useContext, useEffect, useRef, useState, useCallback } from 'react'
import { PortfolioContext } from '../Data/DataProvider'

import { EVT_ENUM, LVL } from '../Data/Models'
import { chalk_out } from '../Util/Output'

//CSS
import './SubNav.css'


export default function SubNav() {

	const debug:boolean = true;

	const o = (msg:string,l:LVL) => {
		return chalk_out(msg,l)
	}


	////////////////////// REFERENCES //////////////////////

	const dom_ref_overview 							= useRef<HTMLDivElement>(null)
	const dom_ref_overview_container 		= useRef<HTMLDivElement>(null)

	const dom_ref_skillset 							= useRef<HTMLDivElement>(null)
	const dom_ref_skillset_container 		= useRef<HTMLDivElement>(null)

	const dom_ref_portfolio 						= useRef<HTMLDivElement>(null)
	const dom_ref_portfolio_container 	= useRef<HTMLDivElement>(null)

	const dom_ref_stick 								= useRef<HTMLDivElement>(null)
	const dom_ref_stick_container				= useRef<HTMLDivElement>(null)



	////////////////////// GLOBAL VARIABLES //////////////////////

	const {
		ee,
		ctrl_set_rotateY,
		global_subnav_opacity,
		global_subnav_scale,
		global_skills_role_current: global_skills_role_current, global_portfolio_mode, 
		global_set_portfolio_mode: global_set_portfolio_mode,
		global_nav_isOpen
	} = useContext(PortfolioContext)




	////////////////////// LOCAL VARIABLES //////////////////////

	const [local_firstRun, set_local_firstRun] 										= useState(true)
	const [local_stick_move, set_local_stick_move] 								= useState(false)
	//const [local_resize_move, set_local_resize_move]							= useState(false)
	const [local_stick_x, set_local_stick_x] 											= useState(0)
	const [local_stick_x_overview, set_local_stick_x_overview] 		= useState(0)
	const [local_stick_x_skillset, set_local_stick_x_skillset] 		= useState(0)
	const [local_stick_x_portfolio, set_local_stick_x_portfolio] 	= useState(0)
	const [ee_assigned, set_ee_assigned] 													= useState(false)




	////////////////////// FUNCTIONS //////////////////////

	//---- UI STYLING ------
	const ui_subnav_overview_active = () => {

		console.log(debug && o("ui_subnav_overview_active",LVL.function))

		let active_css = "subnav_active"
		if (global_portfolio_mode !== "overview") {
			active_css = "";
		}
		return active_css;
	}

	const ui_subnav_skillset_active = () => {

		console.log(debug && o("ui_subnav_skillset_active",LVL.function))

		let active_css = "subnav_active"
		if (global_portfolio_mode !== "skillset") {
			active_css = "";
		}
		return active_css;
	}

	const ui_subnav_portfolio_active = () => {

		console.log(debug && o("ui_subnav_portfolio_active",LVL.function))

		let active_css = "subnav_active"
		if (global_portfolio_mode !== "portfolio") {
			active_css = "";
		}
		return active_css;
	}


	//---- CLICK ------
	const ui_click_overview = () => {

		console.log(debug && o("ui_click_overview",LVL.function))

		set_local_stick_move(true)

		global_set_portfolio_mode("overview")
		ui_stick_move()

		ctrl_set_rotateY("overview")

		ee.emit(EVT_ENUM.SUBNAV_CLICK,{'subnav':'overview'})

	}

	const ui_click_skillset = () => {

		console.log(debug && o("ui_click_skillset",LVL.function))

		set_local_stick_move(true)

		global_set_portfolio_mode("skillset")
		ui_stick_move()

		ctrl_set_rotateY("skillset")

		ee.emit(EVT_ENUM.SUBNAV_CLICK,{'subnav':'skillset'})

	}

	const ui_click_portfolio = () => {

		console.log(debug && o("ui_click_portfolio",LVL.function))

		set_local_stick_move(true)

		global_set_portfolio_mode("portfolio")
		ui_stick_move()

		ctrl_set_rotateY("portfolio")

		ee.emit(EVT_ENUM.SUBNAV_CLICK,{'subnav':'portfolio'})

	}


	//---- ANIMATE ------
	const ui_stick_move = useCallback(() => {
		
		console.log(debug && o("ui_stick_move",LVL.function))

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

		console.log(debug && o("ui_stick_calcs",LVL.function))


		const overview_rect 						= dom_ref_overview.current ?					 	dom_ref_overview.current.getBoundingClientRect() : 0

		const skillset_rect 						= dom_ref_skillset.current ? 						dom_ref_skillset.current.getBoundingClientRect() : 0

		const portfolio_rect 						= dom_ref_portfolio.current ? 					dom_ref_portfolio.current.getBoundingClientRect() : 0

		const stick_parent_rect 				= dom_ref_stick_container.current ? 		dom_ref_stick_container.current.getBoundingClientRect() : 0


		console.log(debug && o("Overview:",LVL.line)		,overview_rect			)
		console.log(debug && o("Skillset:",LVL.line)		,skillset_rect			)
		console.log(debug && o("Portfolio:",LVL.line)	,portfolio_rect			)
		console.log(debug && o("Stick Row:",LVL.line)	,stick_parent_rect	)

		
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
		local_firstRun
	])



	////////////////////// EFFECTS //////////////////////

	useEffect(()=>{

		console.log(debug && o("SubNav.tsx",LVL.effect))

		if (local_firstRun) {
			ui_stick_calcs()
			set_local_firstRun(false)
		}

		if(local_stick_move) {

			console.log(debug && o("SubNav.tsx - useEffect - local_stick_move:true",LVL.line))

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
		set_ee_assigned,
		debug
	])



	////////////////////// EVENTS //////////////////////

	ee.on(EVT_ENUM.WINDOW_RESIZE,()=>{

		console.log("SubNav.tsx - EVT_ENUM.WINDOW_RESIZE")

		ui_stick_calcs()

		ee.delay500(()=>{

			ui_stick_move()

		})

		/*
		if (local_resize_move === true) { return }


		console.log("SubNav.tsx - EVT_ENUM.WINDOW_RESIZE - run calcs")

		ui_stick_calcs()

		ee.delay1000(()=>{

			ui_stick_move()

			set_local_resize_move(true)

		})

		*/
		


		
		console.log("local_stick_x_overview: " + local_stick_x_overview)
		console.log("local_stick_x_skillset: " + local_stick_x_skillset)
		console.log("local_stick_x_portfolio: " + local_stick_x_portfolio)

		/*

		ee.delay500(()=>{

			console.log("DELAY 1")
			console.log("local_stick_x_overview: " + local_stick_x_overview)
			console.log("local_stick_x_skillset: " + local_stick_x_skillset)
			console.log("local_stick_x_portfolio: " + local_stick_x_portfolio)

			ui_stick_calcs()
			ui_stick_move()

			ee.delay500(()=>{

				console.log("DELAY 2")
				console.log("local_stick_x_overview: " + local_stick_x_overview)
				console.log("local_stick_x_skillset: " + local_stick_x_skillset)
				console.log("local_stick_x_portfolio: " + local_stick_x_portfolio)

				//ui_stick_calcs()
				ui_stick_move()	

				ee.delay500(()=>{

					console.log("DELAY 3")
					console.log("local_stick_x_overview: " + local_stick_x_overview)
					console.log("local_stick_x_skillset: " + local_stick_x_skillset)
					console.log("local_stick_x_portfolio: " + local_stick_x_portfolio)

					//ui_stick_calcs()
					ui_stick_move()	

					set_local_stick_move(false)

				})

			})

		})
			*/
		
	})



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