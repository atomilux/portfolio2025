import { useContext, useEffect, useState, useRef, useCallback } from 'react'
import { PortfolioContext } from '../Data/DataProvider'
import { EVT_ENUM, ISkills_rated, LVL } from '../Data/Models'

import { chalk_out } from '../Logger/Output'


import './Content_PortfolioDetail.css'



export default function Content_PortfolioDetail() {

	const debug:boolean = false;

	const o = (msg:string,l:LVL) => {
		return chalk_out(msg,l)
	}


	////////////////////// GLOBAL VARIABLES //////////////////////

	const {
		ee,
		global_portfolio_item_current,
		ctrl_skillsRated_get_byPortfolioID
	} = useContext(PortfolioContext)
	

	////////////////////// REFERENCES //////////////////////

	const ref_overlay = useRef<HTMLDivElement>(null)








	////////////////////// LOCAL VARIABLES //////////////////////

	const [local_links, set_local_links] 				= useState(false)

	const [local_isOpen, set_local_isOpen] 			= useState(true)

	const [local_firstRun, set_local_firstRun] 	= useState(true)

	const [local_col_count, set_local_col_count] = useState(0)

	const [local_css, set_local_css] 						= useState(
		{
			top:'50vw',
			right:'50vw',
			bottom:'50vw',
			left:'50vw',
			opacity:0,
			overflowY:'auto'
		}
	)



	////////////////////// FUNCTIONS //////////////////////


	const link_icon = (link:string) => {

		if (debug) {
			console.log(o("link_icon",LVL.function))
			console.log(o("link: " + link,LVL.line))
		}

		const r_pdf = /.pdf/;

		const str_linkIcon = "/images/icon_newWindow_256x256.svg";
		const str_pdfIcon = "/images/icon_acrobat.svg";

		let str_finalIconURL:string = str_linkIcon;

		if (link.match(r_pdf)) {
			str_finalIconURL = str_pdfIcon;
		}

		return str_finalIconURL;

	}//end f



	//---- RENDER ------

	const render_links_title = () => {

		if (debug) {
			console.log(o("render_links_title",LVL.function))
		}
		

		if (global_portfolio_item_current.links && 
				global_portfolio_item_current.links.length > 0) {

			return(<h3 key={"key"}>LINKS</h3>)

		}//end if

		return(<></>)

	}//end f

	const render_links = () => {

		if (debug) {
			console.log( o("render_links",LVL.function))
		}
		

		//sometimes obj isn't initialized properly - checks
		if (global_portfolio_item_current.links && 
				global_portfolio_item_current.links.length > 0 &&
				typeof global_portfolio_item_current.links[0] === 'object'
		){

				const links = global_portfolio_item_current.links.map(

					(item,i) => {

						return(
							<div className="link" key={"link_"+i}>
								<div>
									<img className="link_icon" src={ link_icon(item.url) }/>
								</div>
								<div>
									<a href={item.url} target="_blank" className="link">
										{ item.title }
									</a>
								</div>
							</div>
						)
					}
				)

				return links


		}//end if

	}//end f

	const render_solutions = () => {

		if (debug) {
			console.log( o("render_solutions",LVL.function))
		}
		
		if (global_portfolio_item_current.solution && 
				global_portfolio_item_current.solution.length > 0) {

			const solutions = global_portfolio_item_current.solution.map(

				(item,i) => {
					return (<li key={"solution_"+i}>{item}</li>)
				}

			)

			return solutions

		}//end if

	}//end f

	/*
	const calc_column_count = () => {

		const local_skills = ctrl_skillsRated_get_byPortfolioID(global_portfolio_item_current.id);

		if (local_skills.length === 0) { return; }

		const skills_marketing:ISkills_rated[] 	= []
		const skills_uiux:ISkills_rated[] 			= []
		const skills_webDev:ISkills_rated[] 		= []
		const skills_gameDev:ISkills_rated[] 			= []

		let col_count = 0;

		if (skills_marketing.length) col_count++
		if (skills_uiux.length) col_count++
		if (skills_webDev.length) col_count++
		if (skills_gameDev.length) col_count++

		//update local state
		set_local_col_count("col_count_"+col_count)

	}
		*/

	const render_skills = () => {

		const local_skills = ctrl_skillsRated_get_byPortfolioID(global_portfolio_item_current.id);

		if (local_skills.length === 0) { return; }

		const skills_marketing:ISkills_rated[] 	= []
		const skills_uiux:ISkills_rated[] 			= []
		const skills_webDev:ISkills_rated[] 		= []
		const skills_gameDev:ISkills_rated[] 			= []

		local_skills.forEach((item) => {

			switch (item.category) {
				case "skills_marketing":
					skills_marketing.push(item)
					break;
				case "skills_uiux":
					skills_uiux.push(item)
					break;
				case "skills_webDev":
					skills_webDev.push(item)
					break;
				case "skills_gameDev":
					skills_gameDev.push(item)
					break;
				default:
					break;
			}
		})

		let col_count = 0;

		if (skills_marketing.length) col_count++
		if (skills_uiux.length) col_count++
		if (skills_webDev.length) col_count++
		if (skills_gameDev.length) col_count++

		if (col_count !== local_col_count) {
			set_local_col_count(col_count)
		}

		return (
			<>

				{
					/* ----------- MARKETING ------------- */

					skills_marketing.length > 0 && 
					(
						<div className={"porItem_skills_category col_count_"+col_count}>
							<h3>MARKETING</h3>
							{
								skills_marketing.map (
									(item,i) =>{
										return (
											<div className="skill_row" key={i}>
												<div className="skill_row_title">{ item.title }</div>
												<div className="skill_row_fuelBar skill_bar_horizontal">
													<div className={"skill_bar_horizontal_fuel type_" + item.category + " bar_width"+item.strength}></div>
												</div>
											</div>
										)
									}
								)
							}
						</div>
					)
				}



				{

					/* ----------- MARKETING ------------- */

					skills_uiux.length > 0 &&
					(
						<div className={"porItem_skills_category col_count_"+col_count}>
							<h3>UI/UX</h3>
							{
								skills_uiux.map (
									(item,i) =>{
										return (
											<div className="skill_row" key={i}>
												<div className="skill_row_title">{ item.title }</div>
												<div className="skill_row_fuelBar skill_bar_horizontal">
													<div className={"skill_bar_horizontal_fuel type_" + item.category + " bar_width"+item.strength}></div>
												</div>
											</div>
										)
									}
								)
							}
						</div>
					)
				}
				


				{

					/* ----------- WEB DEV ------------- */

					skills_webDev.length > 0 &&
					(
						<div className={"porItem_skills_category col_count_"+col_count}>
							<h3>Web Developer</h3>
							{
								skills_webDev.map (
									(item,i) =>{
										return (
											<div className="skill_row" key={i}>
												<div className="skill_row_title">{ item.title }</div>
												<div className="skill_row_fuelBar skill_bar_horizontal">
													<div className={"skill_bar_horizontal_fuel type_" + item.category + " bar_width"+item.strength}></div>
												</div>
											</div>
										)
									}
								)
							}
						</div>
					)
				}


				{

					/* ----------- GAME DEV ------------- */

					skills_gameDev.length > 0 &&
					(
						<div className={"porItem_skills_category col_count_"+col_count}>
							<h3>Game Developer</h3>
							{
								skills_gameDev.map (
									(item,i) =>{
										return (
											<div className="skill_row" key={i}>
												<div className="skill_row_title">{ item.title }</div>
												<div className="skill_row_fuelBar skill_bar_horizontal">
													<div className={"skill_bar_horizontal_fuel type_" + item.category + " bar_width"+item.strength}></div>
												</div>
											</div>
										)
									}
								)
							}
						</div>
					)

				}

			</>
		)

	}

	const render_imagesAndVideos = () => {

		if (debug) {
			console.log( o("render_imagesAndVideos",LVL.function))
		}

		if (global_portfolio_item_current.images && 
				global_portfolio_item_current.images.length > 0) {

			const images = global_portfolio_item_current.images.map(

				(item,i) => {

					if (image_isVimeo(item)) {
						return(
							<div className="port_detail_item" key={"image_"+i}>
								<iframe title="vimeo-player"
								 				src={item+"&transparent=0"} 
												width="100%" height={videoHeight()} 
												style={{border:0, background:"black"}} 
												allowFullScreen={true}>
								</iframe>
							</div>
						)
					} else {
						return (
							<div className="port_detail_item" key={"image_"+i}>
								<img src={item}/>
							</div>
						)
					}

				}

			)

			return images

		}//end if

	}//end f



	//----- CALCULATIONS --------

	const videoHeight = ():number => {

		if (debug) {
			console.log( o("videoHeight",LVL.function))
		}

		let h:number = window.screen.width * .5
		
		if (window.screen.width < 415) {
			h = 180;
		} 

		return h;

	}//end f


	//----- VIMEO --------

	const image_isVimeo = (str_url:string):boolean => {

		if (debug) {
			console.log( o("image_isVimeo",LVL.function))
		}

		return str_url.includes('vimeo')

	}


	//----- CLICK --------

	const click_closeMe = ():void => {

		if (debug) {
			console.log(o("click_closeMe",LVL.function))
			console.log(o("local_css: ",LVL.line),local_css)
		}

		console.dir(local_css)

		render_inlineCSS(false)

	}//end f



	//----- STYLING --------

	const render_inlineCSS = useCallback((showMe_in:boolean) => {

		if (debug) {
			console.log( o("render_inlineCSS",LVL.function))
		}

		let css = {
			overflowY:'scroll',
			top:'0',
			right:'0',
			bottom:'0',
			left:'0',
			opacity:1
		}

		if (showMe_in === false) {
			css = {
				overflowY:'hidden',
				top:'0',
				right:'0',
				bottom:'0',
				left:'10000px',
				opacity:0
			}
		}

		set_local_css(css)

	},[debug])//end f



	////////////////////// EFFECTS //////////////////////


	useEffect(()=>{

		if (debug) {
			console.log( o("Content_PortfolioCollection.tsx",LVL.effect))
		}

		if (local_firstRun) { 
			render_inlineCSS(false)
			set_local_firstRun(false)
		}

		if (global_portfolio_item_current.links && global_portfolio_item_current.links.length > 0) {
			set_local_links(true)
		}

	},[
		local_firstRun,
		render_inlineCSS,
		local_css,
		local_isOpen,
		set_local_isOpen,
		global_portfolio_item_current,
		local_links,
		debug
	])


	////////////////////// EVENTS //////////////////////

	ee.on(EVT_ENUM.PORTFOLIO_ITEM_CLICK,(data)=>{

		if (debug) {
			console.log(o("Nav.tsx - EVT_ENUM.WINDOW_RESIZE",LVL.event))
			console.log(o("data: ",LVL.line),data)
			console.log(o("ref_overlay.current: ",LVL.line),ref_overlay.current)
		}

		render_inlineCSS(true)

		if (ref_overlay.current) {
			ref_overlay.current.scrollTo(0,0)
		}

	})



	////////////////////// RENDER //////////////////////

	return (

		<div id="portItem_media" className="portItem_detailPanel" style={{...local_css}} ref={ref_overlay}>


			{/* ----------------- PORTFOLIO ITEM: TITLE ---------------- */}

			<div className="port_detail_title" onClick={click_closeMe}>
				<div className="title">
					{global_portfolio_item_current.title}
				</div>
				<h4 className="close">X</h4>
			</div>


			{/* ----------------- PORTFOLIO ITEM: DESCRIPTION ---------------- */}
			<div className="port_detail_description">

				<div className="column">
					
					<div className="port_detail_objective">
						<h3>OBJECTIVE:</h3>
						<div>{ global_portfolio_item_current.objective }</div>
					</div>

				</div>

				<div className="column">
					
					<div className="port_detail_solution">
						<h3>SOLUTION:</h3>
						<ul>
							{ render_solutions() }
						</ul>
					</div>

				</div>


				{
					
				local_links? 

				<div className="column">
					<div className="port_detail_links">
					
						{ 	render_links_title() 	}
							
						{ 	render_links() 				}
					
					</div>

				</div>

				: null
				}

			</div>
	
			<div className={"portItem_skills_cont col_count_" + local_col_count}>
				{ render_skills() }
			</div>
	
			{/* ----------------- PORTFOLIO ITEM: MEDIA ---------------- */}

			<div className='port_images'>
				{ render_imagesAndVideos() }
			</div>

		</div>
	)
}