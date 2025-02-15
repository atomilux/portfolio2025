import { useContext, useEffect, useState, useRef } from 'react'
import './Content_PortfolioCollection.css'
import { PortfolioContext } from '../DataProvider/DataProvider'

export default function Content_PortfolioCollection () {

	const {
		ee,
		EVT,
		global_skillset_opacity,
		global_content_3d_translateZ,
		global_content_portfolio_rotateY,
		global_portfolio_filtered, 
		ctrl_skillsRated_get_byPortfolioID, 
		ctrl_set_global_portfolio_item_current} = useContext(PortfolioContext)

	ee.on(EVT.NAV_CLICK,(data)=>{
		dom_ref_me.current.scrollTo(0,0)
	})

	const dom_ref_me = useRef(null)


	const [local_vimeoThumbnailURLs, set_local_vimeoThumbnailURLs] = useState({})

	const [local_vimeoAPIcallsTriggered, set_local_vimeoAPIcallsTriggered] = useState(false)

	const [local_height, set_local_height] = useState(200)


	const click_ui_portfolioItem = (e) => {

		console.dir(e)
		console.log("port ID: " + e.target.dataset.key)

		ctrl_set_global_portfolio_item_current(e.target.dataset.key)

		ee.emit(EVT.PORTFOLIO_ITEM_CLICK,{"id":e.target.dataset.key})
		
	}

	const image_isThumbnail = (str_url) => {

		let r_img = /(png|jpg|gif)/
		let b_isTrue = false;
		let match = r_img.test(str_url)
		
		if (match != false){
			b_isTrue = true;
		}
		return b_isTrue
	}

	const image_isVimeo = (str_url) => {
		return str_url.includes('vimeo')
	}


	const init_vimeoThumbnails = () => {

		console.log("init_vimeoThumbnails()");

		if (global_portfolio_filtered.length === 0) { return; }

		console.log("init_vimeoThumbnails() - running ...");
		console.dir(local_vimeoThumbnailURLs)
		console.dir(global_portfolio_filtered.length)

		//loop through the images
		global_portfolio_filtered.forEach((item,i)=>{

			//regex
			let r_vidID = /[0-9]+/;

			let thumbs_obj:object = {}

			if ( image_isVimeo(item.images[0]) ) {

				const int_id = item.images[0].match(r_vidID)[0];

				thumbs_obj[int_id] = ''

				//trigger
				fetch_getVimeoThumbnail(item.images[0])

			}

			set_local_vimeoThumbnailURLs(thumbs_obj)

		})//enf forEach

	}//end f

	const get_vimeoID = (url_str) => {

		const r_vidID = /[0-9]+/

		const int_id = url_str.match(r_vidID)[0]

		return (int_id)
		
	}


	const fetch_getVimeoThumbnail = ( str_url) => {		
				
		//let r_vidID = /[0-9]+/;
		//let int_id = str_url.match(r_vidID)[0];

		const int_id = get_vimeoID(str_url)
		
		const url = 'http://vimeo.com/api/v2/video/' + int_id + '.json';

		//http://vimeo.com/api/v2/video/791934386.json
		//xhr.open("GET", url, true);

		console.log(url);

		//grab a copy of state
		let tmp_thumbPaths_obj = local_vimeoThumbnailURLs

		//set to empty string for now
		tmp_thumbPaths_obj[int_id] = ''

		//update state
		set_local_vimeoThumbnailURLs(tmp_thumbPaths_obj)


		//trigger the xhr call
		//xhr.onreadystatechange = function () {
		fetch(url)
		.then((response) => response.json())
		.then((data)=>{

			console.log("----------- FETCH RESPONSE -------------");

			console.dir(data)

			//grab a copy of state
			let tmp_thumbPaths_obj = local_vimeoThumbnailURLs

			//set to empty string for now
			tmp_thumbPaths_obj[int_id] = data[0].thumbnail_large

			//update state
			set_local_vimeoThumbnailURLs(tmp_thumbPaths_obj)

		})
		.catch((error) => console.log(error));

		
	}//end f

	const render_vimeoThumb_onCallback = (image_path_str, item_obj) => {
		return(<img className="port_thumbnail" src={image_path_str} data-key={item_obj.id} key={item_obj.id+"_thumb"}/>)
	}//end f


	

	useEffect(()=>{

		//look for a portfolio array that's populated 
		//AND flag indicating Fetch calls not yet triggered
		if (	global_portfolio_filtered.length > 0 && 
					local_vimeoAPIcallsTriggered === false) {

			init_vimeoThumbnails()
			set_local_vimeoAPIcallsTriggered(true)

		}

		/*
		console.log("PortfolioCollection - useEffect()")

		//console.dir(global_portfolio_filtered)
		//console.dir(ee.events[EVT.SUBNAV_CLICK_SKILLSET])

		if (ee.events[EVT.SUBNAV_CLICK_SKILLSET] === undefined) {


			ee.on(EVT.SUBNAV_CLICK_SKILLSET,(obj) => {
				console.log("HEARD THIS!!!!!!!!!")
				console.dir(obj)
			})

		}
			*/
	},[
		local_vimeoAPIcallsTriggered,
		global_skillset_opacity,
		global_portfolio_filtered,
		global_content_3d_translateZ
	])

	

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
											render_vimeoThumb_onCallback(
												local_vimeoThumbnailURLs[get_vimeoID(item.images[0])],
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

