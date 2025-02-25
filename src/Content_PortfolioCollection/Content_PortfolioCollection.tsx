import { useContext, useEffect, useState, useRef, useCallback } from 'react'
import { PortfolioContext } from '../Data/DataProvider'

import './Content_PortfolioCollection.css'
import { IPortfolio_item } from '../Data/Models'


export default function Content_PortfolioCollection () {



	////////////////////// REFERENCES //////////////////////

	const dom_ref_me = useRef<HTMLDivElement>(null) 



	////////////////////// GLOBAL VARIABLES //////////////////////

	const {
		ee,
		EVT_ENUM,
		global_skillset_opacity: global_skillset_opacity,
		global_content_3d_translateZ,
		global_content_portfolio_rotateY,
		global_portfolio_filtered, 
		ctrl_skillsRated_get_byPortfolioID, 
		ctrl_global_set_IPortfolio_item_current} = useContext(PortfolioContext)

	ee.on(EVT_ENUM.NAV_CLICK,()=>{
		dom_ref_me.current?.scrollTo(0,0)
	})



	////////////////////// LOCAL VARIABLES //////////////////////

	const [local_vimeoThumbnailURLs, set_local_vimeoThumbnailURLs] 					= useState<{ [key: string]: string }>({})
	const [local_vimeoAPIcallsTriggered, set_local_vimeoAPIcallsTriggered] 	= useState(false)



	////////////////////// FUNCTIONS //////////////////////


	//---- CLICK ------
	const click_ui_portfolioItem = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {

		console.dir(e)
		console.log("port ID: " + e.currentTarget.dataset.key)

		ctrl_global_set_IPortfolio_item_current(e.currentTarget.dataset.key ?? '')

		ee.emit(EVT_ENUM.IPortfolio_item_CLICK,{"id":e.currentTarget.dataset.key})
		
	}

	const image_isThumbnail = (str_url:string):boolean => {

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
		return str_url.includes('vimeo')
	}


	const vimeo_initThumbnails = useCallback(() => {

		console.log("init_vimeoThumbnails()");

		if (global_portfolio_filtered.length === 0) { return; }

		console.log("init_vimeoThumbnails() - running ...");
		console.dir(local_vimeoThumbnailURLs)
		console.dir(global_portfolio_filtered.length)

		//loop through the images
		global_portfolio_filtered.forEach((item)=>{

			//regex
			const r_vidID = /[0-9]+/;

			const thumbs_obj: { [key: string]: string } = {}

			if ( image_isVimeo(item.images[0]) ) {

				const match = item.images[0].match(r_vidID);
				const int_id = match ? match[0] : '';

				thumbs_obj[int_id] = ''

				//trigger
				vimeo_fetch_getVideoJSONdata(item.images[0])

			}

			set_local_vimeoThumbnailURLs(thumbs_obj)

		})//enf forEach

	},[])//end f



	const vimeo_getID = (url:string) => {

		const r_vidID = /[0-9]+/

		const match = url.match(r_vidID) 
		
		if (!match) throw new Error('No valid Vimeo ID found in URL')

		const int_id = match[0]

		return (int_id)
		
	}


	const vimeo_fetch_getVideoJSONdata = ( str:string) => {		
				

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

			console.log("----------- FETCH RESPONSE -------------");

			console.dir(data)

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
		return(<img className="port_thumbnail" src={image_path_str} data-key={item_obj.id} key={item_obj.id+"_thumb"}/>)
	}//end f




	////////////////////// EFFECTS //////////////////////

	useEffect(()=>{

		//look for a portfolio array that's populated 
		//AND flag indicating Fetch calls not yet triggered
		if (	global_portfolio_filtered.length > 0 && 
					local_vimeoAPIcallsTriggered === false) {

			vimeo_initThumbnails()
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
					style={{opacity:global_skillset_opacity, transform:'rotateY('+global_content_portfolio_rotateY+'deg)  translateZ('+global_content_3d_translateZ+'px)'}}>

			<div className="portfolio_content">

				{

					global_portfolio_filtered.map(

						(item,i) => (

							<div className="port_item" onClick={click_ui_portfolioItem} data-key={item.id} key={item.id}>

								<div className="port_item_small">

									<div className="port_item_title_main">

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

