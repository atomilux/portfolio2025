import { useContext, useEffect, useState, useRef, useCallback } from 'react'
import { PortfolioContext } from '../Data/DataProvider'
import './Content_PortfolioDetail.css'


export default function Content_PortfolioDetail() {


	////////////////////// REFERENCES //////////////////////

	const ref_overlay = useRef<HTMLDivElement>(null)




	////////////////////// GLOBAL VARIABLES //////////////////////

	const {
		ee,
		EVT_ENUM,
		global_portfolio_item_current
	} = useContext(PortfolioContext)




	////////////////////// LOCAL VARIABLES //////////////////////

	const [local_links, set_local_links] 				= useState(false)

	const [local_isOpen, set_local_isOpen] 			= useState(true)

	const [local_firstRun, set_local_firstRun] 	= useState(true)

	const [local_css, set_local_css] 						= useState(
		{
			top:'50vw',
			right:'50vw',
			bottom:'50vw',
			left:'50vw',
			opacity:0
		}
	)



	////////////////////// FUNCTIONS //////////////////////


	const link_icon = (link:string) => {

		//console.log("link_icon() - link: " + link);

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

		if (global_portfolio_item_current.links && 
				global_portfolio_item_current.links.length > 0) {

			return(<h3 key={"key"}>LINKS</h3>)

		}//end if

		return(<></>)

	}//end f

	const render_links = () => {

		console.dir(global_portfolio_item_current.links)
		
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

	const render_imagesAndVideos = () => {

		if (global_portfolio_item_current.images && 
				global_portfolio_item_current.images.length > 0) {

			const images = global_portfolio_item_current.images.map(

				(item,i) => {
					console.log("PORTFOLIO IMAGE: " + item);

					if (image_isVimeo(item)) {
						return(
							<div className="port_detail_item" key={"image_"+i}>
								<iframe title="vimeo-player" src={item+"&transparent=0"} width="100%" height={videoHeight()} style={{border:0, background:"black"}} allowFullScreen={true}></iframe>
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

		let h:number = window.screen.width * .5
		
		if (window.screen.width < 415) {
			h = 180;
		} 

		return h;

	}//end f


	//----- VIMEO --------

	const image_isVimeo = (str_url:string):boolean => {
		return str_url.includes('vimeo')
	}


	//----- CLICK --------

	const click_closeMe = ():void => {

		console.log("close me");
		console.dir(local_css)
		//set_local_isOpen(true)

		render_inlineCSS(false)

	}//end f



	//----- STYLING --------

	const render_inlineCSS = useCallback((showMe_in:boolean) => {

		console.log("render_inlineCSS()")

		let css = {
			top:'0',
			right:'0',
			bottom:'0',
			left:'0',
			opacity:1
		}

		if (showMe_in === false) {
			css = {
				top:'50vw',
				right:'50vw',
				bottom:'50vw',
				left:'50vw',
				opacity:0
			}
		}

		set_local_css(css)

	},[])//end f



	////////////////////// EFFECTS //////////////////////


	useEffect(()=>{

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
		local_links
	])


	////////////////////// EVENTS //////////////////////
	ee.on(EVT_ENUM.PORTFOLIO_ITEM_CLICK,(data)=>{

		console.dir(data)
		console.dir(ref_overlay.current)

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
	
	
			{/* ----------------- PORTFOLIO ITEM: MEDIA ---------------- */}

			<div className='port_images'>
				{ render_imagesAndVideos() }
			</div>

		</div>
	)
}