import { useContext, useEffect, useState, useRef, useCallback } from 'react'
import { PortfolioContext } from '../Data/DataProvider'

import './Content_PortfolioCollection.css'
import { IPortfolio_item, Portfolio_item, EVT_ENUM, LVL } from '../Data/Models'

import { chalk_out } from '../Util/Output'

import play_icon from '../assets/play_icon.svg'


export default function Content_PortfolioCollection () {

		const debug:boolean = true;
	
		const o = (msg:string,l:LVL) => {
			return chalk_out(msg,l)
		}


	////////////////////// REFERENCES //////////////////////

	const dom_ref_me = useRef<HTMLDivElement>(null) 



	////////////////////// GLOBAL VARIABLES //////////////////////

	const {
		ee,
		global_skillset_opacity: global_skillset_opacity,
		global_content_3d_translateZ,
		global_content_portfolio_rotateY,
		global_portfolio_filtered, 
		ctrl_skillsRated_get_byPortfolioID, 
		ctrl_global_set_portfolio_item_current} = useContext(PortfolioContext)

	ee.on(EVT_ENUM.NAV_CLICK,()=>{
		dom_ref_me.current?.scrollTo(0,0)
	})



	////////////////////// LOCAL VARIABLES //////////////////////

	const [local_vimeoThumbnailURLs, set_local_vimeoThumbnailURLs] 					= useState<{ [key: string]: string }>({})
	const [local_vimeoAPIcallsTriggered, set_local_vimeoAPIcallsTriggered] 	= useState(false)



	////////////////////// FUNCTIONS //////////////////////


	//---- CLICK ------
	const click_ui_portfolioItem = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {

		if (debug){
			console.log(o("click_ui_portfolioItem",LVL.function))
			console.log(o("click e:",LVL.line),e)
			console.log(o("port ID: " + e.currentTarget.dataset.key,LVL.line))
		}

		ctrl_global_set_portfolio_item_current(Number(e.currentTarget.dataset.key) || 0)

		ee.emit(EVT_ENUM.PORTFOLIO_ITEM_CLICK,{"id":e.currentTarget.dataset.key})
		
	}

	const image_isThumbnail = (str_url:string):boolean => {

		if (debug) {
			console.log(o("image_isThumbnail",LVL.function))
			console.log(o("str_url: " + str_url,LVL.line))
		}

		const r_img = /(png|jpg|gif)/
		let b_isTrue = false;
		const match = r_img.test(str_url)
		
		if (match != false){
			b_isTrue = true;
		}
		return b_isTrue
	}



	//---- VIMEO ------

	const image_isVimeo = (str_url:string) => {

		if (debug) {
			console.log(o("image_isVimeo",LVL.function))
			console.log(o("str_url: " + str_url,LVL.line))
		}

		return str_url.includes('vimeo')

	}


	const vimeo_initThumbnails = useCallback((port_in:Portfolio_item[]) => {

		if (debug) {
			console.log(o("init_vimeoThumbnails",LVL.function))
			console.log(o("port_in: " + port_in,LVL.line))
		}

		if (global_portfolio_filtered.length === 0) { return }

		console.log(debug && o("init_vimeoThumbnails - running ...",LVL.line))

		//loop through the images
		global_portfolio_filtered.forEach((item)=>{

			//regex
			const r_vidID = /[0-9]+/;

			const thumbs_obj: { [key: string]: string } = {}

			if ( image_isVimeo(item.images[0]) ) {

				console.log("init_vimeoThumbnails() - image_isVimeo() TRUE");

				const match = item.images[0].match(r_vidID);
				const int_id = match ? match[0] : '';

				thumbs_obj[int_id] = ''

				//trigger
				vimeo_fetch_getVideoJSONdata(item.images[0])

			}

			set_local_vimeoThumbnailURLs(thumbs_obj)

		})//enf forEach

	},[
		global_portfolio_filtered,
		debug,
		image_isVimeo
	]
)//end f



	const vimeo_getID = (url:string) => {

		if (debug) {
			console.log(o("vimeo_getID",LVL.function))
			console.log(o("url: " + url,LVL.line))
		}

		const r_vidID = /[0-9]+/

		const match = url.match(r_vidID) 
		
		if (!match) throw new Error('No valid Vimeo ID found in URL')

		const int_id = match[0]

		return (int_id)
		
	}


	const vimeo_fetch_getVideoJSONdata = ( str:string) => {		

		if (debug) {
			console.log(o('',LVL.spacer))
			console.log(o("vimeo_fetch_getVideoJSONdata",LVL.function))
			console.log(o("str: " + str,LVL.line))
		}
				
		const int_id = vimeo_getID(str)
		
		const url = 'http://vimeo.com/api/v2/video/' + int_id + '.json';

		//grab a copy of state
		const tmp_thumbPaths_obj = local_vimeoThumbnailURLs

		//set to empty string for now
		tmp_thumbPaths_obj[int_id] = ''

		//update state
		set_local_vimeoThumbnailURLs(tmp_thumbPaths_obj)


		//trigger the xhr call
		fetch(url)
		.then((response) => response.json())
		.then((data)=>{

			if (debug) {
				console.log(o("----------- FETCH RESPONSE -------------",LVL.line))
				console.log(o("data: ",LVL.line),data)

			}

			//grab a copy of state
			const tmp_thumbPaths_obj = local_vimeoThumbnailURLs

			//set to empty string for now
			tmp_thumbPaths_obj[int_id] = data[0].thumbnail_large

			//update state
			set_local_vimeoThumbnailURLs(tmp_thumbPaths_obj)

		})
		.catch((error) => console.log(error));

		
	}//end f



	//---- RENDER ------
	const vimeo_renderThumb_onCallback = (image_path_str:string, item_obj: IPortfolio_item) => {

		if (debug) {
			console.log(o("vimeo_renderThumb_onCallback",LVL.function))
			console.log(o("image_path_str: " + image_path_str,LVL.line))
			console.log(o("item_obj: ",LVL.line), item_obj)
		}
		
		return(
		<>
			<img className="port_videoIcon" src={play_icon} />
			<img className="port_thumbnail" src={image_path_str} data-key={item_obj.id} key={item_obj.id+"_thumb"}/>
		</>)
	}//end f




	////////////////////// EFFECTS //////////////////////

	useEffect(()=>{

		//console.log("useEffect - Content_PortfolioCollection.tsx - OUTSIDE");
		//console.dir(global_portfolio_filtered)

		//look for a portfolio array that's populated 
		//AND flag indicating Fetch calls not yet triggered
		//Greater than 1 because on init there's a default portfolio item at id:0
		if (	global_portfolio_filtered.length > 1 && 
					local_vimeoAPIcallsTriggered === false) {
						
			console.log("useEffect - Content_PortfolioCollection.tsx INSIDE")
			console.dir(global_portfolio_filtered)

			vimeo_initThumbnails(global_portfolio_filtered)
			set_local_vimeoAPIcallsTriggered(true)

		}

	},[
		vimeo_initThumbnails,
		local_vimeoThumbnailURLs,
		local_vimeoAPIcallsTriggered,
		global_skillset_opacity,
		global_portfolio_filtered,
		global_content_3d_translateZ
	])

	

	////////////////////// RENDER //////////////////////

	return (

		<div 	id="portfolio" className="portfolio"
					ref={dom_ref_me} 
					style={{opacity:global_skillset_opacity, transform:'rotateY('+global_content_portfolio_rotateY+'deg) translateZ('+global_content_3d_translateZ+'px)'}}>

			<div className="portfolio_content">

				{

					global_portfolio_filtered.map(

						(item) => (

							<div className="port_item" onClick={click_ui_portfolioItem} data-key={item.id} key={item.id}>

								<div className="port_item_small">

									<div className="port_item_img_container">

										{ 
											image_isThumbnail(item.images[0]) ?
											<img className="port_thumbnail" src={item.images[0]} data-key={item.id} key={item.id+"_thumb"}/> : null
										}

										{
											image_isVimeo(item.images[0]) ?
											vimeo_renderThumb_onCallback(
												local_vimeoThumbnailURLs[vimeo_getID(item.images[0])],
												item
											)
											: null
										}
										
									
										<div className="port_item_title_bar">
											
											<div className="port_item_title">{ item.title }</div> 

											<div className="port_item_category"> 

												{

													ctrl_skillsRated_get_byPortfolioID(item.id).map (

														(item_skill,j) => (

															<div className="port_item_stat" key={j}>
																<div className="skill_bar_vertical">
																	<div className={"skill_bar_vertical_fuel type_" + item_skill.category + " bar_height" + item_skill.strength }></div>
																</div>
															</div>
	
														)

													)

												}
		
											</div>
																						
										</div>

									</div>

								</div>

							</div>

						)

					)

				}
				
			</div>

		</div>
		
	)

}//end class

