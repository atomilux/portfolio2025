import { useContext, useEffect, useState, useRef } from 'react'
import { PortfolioContext } from '../Data/DataProvider'
import './Content_PortfolioDetail.css'


export default function Content_PortfolioDetail() {

	const {
		ee,
		EVT
	} = useContext(PortfolioContext)

	ee.on(EVT.PORTFOLIO_ITEM_CLICK,(data)=>{
		console.dir(data)
		render_inlineCSS(true)
		console.dir(ref_overlay.current)
		ref_overlay.current.scrollTo(0,0)
	})

	const ref_overlay = useRef(null)

	const {global_portfolio_item_current} = useContext(PortfolioContext)

	const [local_links, set_local_links] = useState(false)

	const [local_isOpen, set_local_isOpen] = useState(true)

	const [local_firstRun, set_local_firstRun] = useState(true)

	const [local_css, set_local_css] 
	= useState(
		{
			top:'50vw',
			right:'50vw',
			bottom:'50vw',
			left:'50vw',
			opacity:0
		}
	)

	const link_icon = (str_name) => {

		const r_pdf = /.pdf/;

		const str_linkIcon = "/images/icon_newWindow_256x256.svg";
		const str_pdfIcon = "/images/icon_acrobat.svg";

		let str_finalIconURL = str_linkIcon;

		if (str_name.match(r_pdf)) {
			str_finalIconURL = str_pdfIcon;
		}

		return str_finalIconURL;

	}//end f

	const render_links_title = () => {

		if (global_portfolio_item_current.links && 
				global_portfolio_item_current.links.length > 0) {

			return(<h3>LINKS</h3>)

		}//end if

		return(<></>)

	}//end f

	const render_links = () => {
		
		if (global_portfolio_item_current.links && 
				global_portfolio_item_current.links.length > 0) {

			let links = global_portfolio_item_current.links.map(

				(item,i) => {

					return(
						<div className="link">
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

			let solutions = global_portfolio_item_current.solution.map(

				(item) => {
					return (<li>{item}</li>)
				}

			)

			return solutions

		}//end if

	}//end f

	const render_imagesAndVideos = () => {

		if (global_portfolio_item_current.images && 
				global_portfolio_item_current.images.length > 0) {

			const images = global_portfolio_item_current.images.map(

				(item) => {
					console.log("PORTFOLIO IMAGE: " + item);

					if (image_isVimeo(item)) {
						return(
							<div className="port_detail_item">
								<iframe title="vimeo-player" src={item+"&transparent=0"} width="100%" height={videoHeight()} style={{border:0, background:"black"}} allowFullScreen={true}></iframe>
							</div>
						)
					} else {
						return (
							<div className="port_detail_item">
								<img src={item}/>
							</div>
						)
					}

				}
			)

			return images

		}//end if

	}//end f

	const videoHeight = ():number => {

		let h:number = window.screen.width * .5
		
		if (window.screen.width < 415) {
			h = 180;
		} 

		return h;

	}//end f

	const image_isVimeo = (str_url:string):boolean => {
		return str_url.includes('vimeo')
	}

	const closeMe = ():void => {

		console.log("close me");
		console.dir(local_css)
		//set_local_isOpen(true)

		render_inlineCSS(false)

	}//end f

	const render_inlineCSS = (showMe_in):object => {

		console.log("render_inlineCSS()")

		let css

		if (showMe_in === true) {
			css = {
				top:'0',
				right:'0',
				bottom:'0',
				left:'0',
				opacity:1
			}
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

	}

	useEffect(()=>{

		//console.log("PortfolioDetails.tsx");
		//console.dir(global_portfolio_item_current)

		//console.dir(local_css)

		if (local_firstRun) { 
			render_inlineCSS(false)
			set_local_firstRun(false)
		}

		if (global_portfolio_item_current.links && global_portfolio_item_current.links > 0) {
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

	return (

		<div id="portItem_media" className="portItem_detailPanel" style={{...local_css}} ref={ref_overlay}>


			{/* ----------------- PORTFOLIO ITEM: TITLE ---------------- */}

			<div className="port_detail_title" onClick={closeMe}>
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