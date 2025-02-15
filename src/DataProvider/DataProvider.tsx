import { createContext, useState, useEffect } from 'react'
import portfolio_data from '../DataProvider/siteData4.json'
import _ from 'lodash'
import EventEmitter from '../EVENTS/EventEmitter'



/* ------------ INIT CONTEXT ------------ */
export const PortfolioContext = createContext({});



/* -------------- CONTEXT PROVIDER ----------- */

export const PortfolioContextProvider = ({children}) => {
	

	//----------- TEST STATE OBJ ------------
	const [global_count, set_global_count] = useState(1)

	const [global_ui_nav_classMap, set_global_ui_nav_classMap] = useState({
		"skills_marketing":"nav_marketing",
		"skills_uiux"			:"nav_uiux",
		"skills_webDev"		:"nav_webDev",
		"skills_gameDev"	:"nav_gameDev"
	});


	const ee = new EventEmitter()



	const anim_sequence_subnav_click = () => {

		set_global_subnav_opacity(0)
		set_global_subnav_scale(.8)

		set_global_skillset_opacity(0)
		set_global_skillset_scale(.8)
		
		//fade in subnav, then fade in skillset 
		ee.fadeIn500(

			()=>{

				//NAV - set opacity to 1 (transition anim)
				set_global_subnav_opacity(1)	
				set_global_subnav_scale(1)			

				//fade in skillset
				ee.fadeIn500(
					() => {
						set_global_skillset_opacity(1)
						set_global_skillset_scale(1)
					}
				)
				
			}

		)

	}//end f



	const [	local_portfolioInit, set_local_portfolioInit											] 	= useState(false)



	///////////////////// < 3D ROTATE VALUES > /////////////////////

	const [ global_content_overview_rotateY, set_global_content_overview_rotateY		] = useState(0)
	const [ global_content_skillset_rotateY, set_global_content_skillset_rotateY		] = useState(90)
	const [ global_content_portfolio_rotateY, set_global_content_portfolio_rotateY	] = useState(180)

	const [ global_content_3d_translateZ, set_global_content_3d_translateZ					] = useState(200)

	

	///////////////////// < PORTFOLIO > /////////////////////

	//ACCESS - Nav.tsx - iterates over DATA:skillsets->skills_roles to build HTML
	//Array
	const [	global_portfolio																									] 	= useState<Array<object>>(portfolio_data.portfolio)

	//ACCESS - Portfolio_subNav.tsx uses to render conditional JSX
	//String - "skillset", "portfolio"
	const [	global_portfolio_mode, set_global_portfolio_mode									] 	= useState<string>("overview")

	//ACCESS - set by - ctrl_portfolio_filter_bySkillArray()
	//Array - filtered portfolio items
	const [	global_portfolio_filtered, set_global_portfolio_filtered					] 	= useState([])

	//ACCESS - set by - ctrl_set_global_portfolio_item_current()
	//integer - single portfolio item id
	const [	global_portfolio_item_current, set_global_portfolio_item_current	] 	= useState<object>({})

	//ACCESS - set by ...
	//string - "details", "skills", "media"
	const [	global_portfolio_item_mode, set_global_portfolio_item_mode				] 	= useState<string>("details")

	const [	global_nav_isOpen, set_global_nav_isOpen													]		= useState<boolean>(true)

	const [	global_nav_openHeight, set_global_nav_openHeight									]		= useState<number>(0)


	///////////////////// < SKILLS > /////////////////////

	//ACCESS - Nav.tsx - builds UI from
	//Aray of objects
	const [	global_roles																											] 	= useState<Array<object>>(portfolio_data.skillsets.skills_roles)


	//ACCESS - Nav.tsx - UI clicks

	//String 	- "skills_marketing", "skills_uiux", 
	// 				- "skills_webDev", "skills_gameDev"

	const [	global_role_current, set_global_role_current											] 	= useState<object>(portfolio_data.skillsets.skills_roles[0])

	const [ global_role_current_skills, set_global_role_current_skills 				] 	= useState<Array<string>>(portfolio_data.skillsets.skills_roles[0].skill_keys.split(','))

	const [	global_role_skillsRated_all																				] 	= useState<Array<object>>(portfolio_data.skillsets.skills_rated)

	const [	global_role_skillsRanked, set_global_role_skillsRanked						] 	= useState<Array<object>>([portfolio_data.skillsets.skills_rated[0]])



	///////////////////// < SUBNAV > /////////////////////

	const	[	global_subnav_opacity, set_global_subnav_opacity									]		= useState(0)
	const	[	global_subnav_scale, set_global_subnav_scale											]		= useState(1)

	const	[	global_skillset_opacity, set_global_skillset_opacity							]		= useState(0)
	const	[	global_skillset_scale, set_global_skillset_scale									]		= useState(1)



	// ----------- 3D ROTATE - FUNCTION --------------

	const ctrl_set_rotateY = (mode_str_in) => {

		if (mode_str_in === "overview") {

			set_global_content_overview_rotateY(0)
			set_global_content_skillset_rotateY(90)
			set_global_content_portfolio_rotateY(180)

		}

		if (mode_str_in === "skillset") {

			set_global_content_overview_rotateY(-90)
			set_global_content_skillset_rotateY(0)
			set_global_content_portfolio_rotateY(90)

		}

		if (mode_str_in === "portfolio") {

			set_global_content_overview_rotateY(-180)
			set_global_content_skillset_rotateY(-90)
			set_global_content_portfolio_rotateY(0)

		}

	}


	//----------------- PORTFOLIO - FUNCTIONS -----------------

	//ACCESS - Nav.tsx UI clicks
	const ctrl_portfolio_filter_bySkillArray = (role_in) => {

		console.log("ctrl_portfolio_filter_bySkillArray()")

		console.log("role_in: " + role_in);

		

		//console.dir(global_role_current_skills)

		let skills_arr = [];

		portfolio_data.skillsets.skills_roles.forEach((item,i)=>{
			if(item.key===role_in) {
				skills_arr = item.skill_keys.split(',')
			}
		})

		//console.log("skills arr")
		//console.dir(skills_arr)

		let matching_items:object[] = []

		//----------- Portfolio Items -----------

		global_portfolio.forEach(

			// --------- item ---------
			(item) => {

				let port_item_skills = item.skillset.split(",")


				let port_item_matchingSkills = _.intersection( skills_arr, port_item_skills )

				//=== skills_arr_in.length

				if (port_item_matchingSkills.length > 0) {
					//console.log("length:"+port_item_matchingSkills.length);
					matching_items.push(item)
				}
				
			}

		)

		//sort by latest (newest) id for good chronology
		let matching_items_sorted = _.sortBy(matching_items,['id'],['desc'])

		console.log("-------------- NEW PORTFOLIO --------------")

		console.dir(matching_items_sorted)

		matching_items_sorted.reverse()

		set_global_portfolio_filtered(matching_items_sorted)

		//console.dir(matching_items)

	}//end f

	const ctrl_set_global_portfolio_item_current = (id_in):void => {

		console.log("set_global_portfolio_byID() - id_in: " + id_in);

		let portfolio_item = {}; 

		global_portfolio.forEach((item) => {

			if(item.id == id_in) {
				console.dir(item);
				portfolio_item = item;
			}

		})

		//set global state
		set_global_portfolio_item_current(portfolio_item);

	}//end f
	

	//----------------- SKILLS - FUNCTIONS -----------------

	const ctrl_set_global_role_skillsData = (role_in:string) => {

		console.log("ctrl_set_global_role_skillsData()");

		portfolio_data.skillsets.skills_roles.forEach(

			(item) => {

				if (role_in === item.key) {
					console.dir(item)
					set_global_role_current(item)
					set_global_role_current_skills(item.skill_keys.split(','))
				}
			}

		)

	}//end f


	const ctrl_set_global_role_skillsRanked = (role_in:string) => {

		let final_skills = []

		portfolio_data.skillsets.skills_rated.forEach(

			(item) => {
				//console.log("ctrl_set_global_role_skillsRanked() - role_in: " + role_in + " - item.category: " + item.category);
				if (role_in === item.category) {
					//console.dir(item)
					final_skills.push(item)
				}
			}

		)//end forEach

		set_global_role_skillsRanked(final_skills)
	
	}//end f

	const ctrl_skillsRated_get_byPortfolioID = (int_id) => {

		//get this portfolio item
		let portfolioItem = _.filter(global_portfolio,{'id':int_id})

		let portfolioItem_skillset_arr = portfolioItem[0].skillset.split(',')

		let matches = []

		portfolioItem_skillset_arr.forEach((key_str)=> {
		//console.log(key_str)
			matches.push(_.filter(global_role_skillsRated_all,{'key':key_str})[0])
		})

		return matches

	}//end f

	useEffect(()=>{
		
		if (local_portfolioInit) { return }

		console.log("DataProvider.tsx - useEffect() - INIT!!!!!!!!!!!!!!!")

		set_local_portfolioInit(true) 

		ctrl_portfolio_filter_bySkillArray(portfolio_data.skillsets.skills_roles[0].skill_keys.split(','))

		ctrl_skillsRated_get_byPortfolioID(3)

	},[
		local_portfolioInit,
		ctrl_portfolio_filter_bySkillArray,
		ctrl_skillsRated_get_byPortfolioID
	])

	
	return (

    <PortfolioContext.Provider value={{ 

			global_count, set_global_count, 

			global_roles,

			global_portfolio,

			global_role_skillsRated_all,

			global_role_skillsRanked,

			global_nav_openHeight, set_global_nav_openHeight,

			global_role_current, set_global_role_current,

			global_portfolio_mode, set_global_portfolio_mode,

			global_portfolio_filtered, set_global_portfolio_filtered,

			global_portfolio_item_current, set_global_portfolio_item_current,

			global_portfolio_item_mode, set_global_portfolio_item_mode,
			
			global_ui_nav_classMap, set_global_ui_nav_classMap,

			global_nav_isOpen, set_global_nav_isOpen,


			global_subnav_opacity,

			global_subnav_scale,

			global_skillset_opacity,

			global_skillset_scale,

			anim_sequence_subnav_click,


			ctrl_set_rotateY,
			global_content_overview_rotateY,
			global_content_skillset_rotateY,
			global_content_portfolio_rotateY,

			global_content_3d_translateZ,
			set_global_content_3d_translateZ,
			

			ctrl_set_global_role_skillsRanked,

			ctrl_set_global_role_skillsData,

			ctrl_set_global_portfolio_item_current,

			ctrl_portfolio_filter_bySkillArray, 

			ctrl_skillsRated_get_byPortfolioID,

			ee, 

			EVT

			}}>

      {children}

    </PortfolioContext.Provider>

  )//end return()

}//end class



/* -------- MODELS ---------- */
enum EVT {

	//MAIN NAV EVENT
	"NAV_CLICK" = "NAV_CLICK",

	//SUBNAV EVENTS 
	"SUBNAV_CLICK" = "SUBNAV_CLICK",
	"SUBNAV_ANIM_DONE" = "SUBNAV_ANIM_DONE",
	"SKILLS_ANIM_DONE" = "SKILLS_ANIM_DONE",

	//PORTFOLIO ITEM EVENT
	"PORTFOLIO_ITEM_CLICK" = "PORTFOLIO_ITEM_CLICK"

}