/* eslint-disable @typescript-eslint/no-unused-vars */
import { createContext, useState, useEffect, useMemo, useCallback, ReactNode } from 'react'
import portfolio_data from './siteData4.json'
import _ from 'lodash'
import EventEmitter from '../EVENTS/EventEmitter'
import { 
	IPortfolio_item, Portfolio_item, 
	ISkills_role, Skills_role,
	ISkills_rated, Skills_rated,
	IAppMode, AppMode,
	LVL,
} from './Models'

import { style_out } from '../Logger/Output'


/* ------------ INIT CONTEXT ------------ */
export const PortfolioContext = createContext({ 



	//////////////////// APP /////////////////////

	// Variables -----------

	global_nav_openHeight:0,
	global_nav_isOpen:true,
	global_ui_nav_classMap:new AppMode(),
	global_subnav_opacity:0,
	global_subnav_scale:1,

	global_content_overview_rotateY:0,
	global_content_skillset_rotateY:90,
	global_content_portfolio_rotateY:180,
	global_content_3d_translateZ:200,
	
	// Setters -----------

	global_set_nav_openHeight:				(_value: number):void => {},
	global_set_nav_isOpen:						(_value: boolean):void => {},
	global_set_ui_nav_classMap: 			(_value: { skills_marketing: string; skills_uiux: string; skills_webDev: string; skills_gameDev: string; }):void => {},
	global_set_content_3d_translateZ:	(_value: number):void => {},


	// Functions -----------

	ctrl_set_rotateY:									(_value: string):void=>{},

	anim_sequence_subnav_click:				()=>{},


	
	//////////////////// SKILLS /////////////////////


	// Variables -----------

	global_skills_roles:								[] as ISkills_role[],

	global_skills_role_current:					new Skills_role(),

	global_role_skillsRanked_all:				[] as ISkills_rated[],
	global_role_skillsRanked:						[] as ISkills_rated[],
	global_skills_role_current_skills:	[] as string[],

	global_skillset_opacity:0,
	global_skillset_scale:1,


	// Setters ----------

	global_set_skills_role_current:			(_value: ISkills_role):void=>{},


	// Functions ----------

	ctrl_set_global_role_skillsRanked:	(_value: string):void=>{},
	ctrl_set_global_role_skillsData:		(_value: string):void=>{},
	ctrl_portfolio_filter_byRole:				(_value: string):void=>{},



	//////////////////// PORTFOLIO /////////////////////


	// Variables -----------

	global_portfolio_mode:					"overview",
	global_portfolio:								[] as IPortfolio_item[],
	global_portfolio_filtered:			[] as IPortfolio_item[],
	global_portfolio_item_current:	new Portfolio_item(),
	global_portfolio_item_mode:			"details",


	// Setters -----------

	global_set_portfolio_filtered:			(_value: IPortfolio_item[]):void => {},
	global_set_portfolio_mode:					(_value: string):void=>{},
	global_set_portfolio_item_current:	(_value: IPortfolio_item)=>{},
	global_set_portfolio_item_mode:			(_value: string):void=>{},


	// Functions -----------

	ctrl_global_set_portfolio_item_current:	(_value: number):void=>{},
	ctrl_skillsRated_get_byPortfolioID:			(_value:number):ISkills_rated[] => {return [new Skills_rated()]},
	ee:new EventEmitter(),

	global_debug:false,

});

/* -------------- CONTEXT PROVIDER ----------- */

export const PortfolioContextProvider = ({children}: {children: ReactNode}) => {

	const debug:boolean = true;

	const out = useCallback((msg:string,l:LVL) => {
	
		return style_out(msg,l)

	},[])


	
	const [global_debug] = useState(false)

	const [global_ui_nav_classMap, global_set_ui_nav_classMap] = useState<IAppMode>(new AppMode());


	const ee = useMemo(() => new EventEmitter(), []); // Stable instance



	const anim_sequence_subnav_click = () => {

		if (debug) console.log(out("anim_sequence_subnav_click",LVL.function))

		set_global_subnav_opacity(0)
		set_global_subnav_scale(.8)

		set_global_skillset_opacity(0)
		set_global_skillset_scale(.8)
		
		//fade in subnav, then fade in skillset 
		ee.delay500(

			()=>{

				if (debug) console.log(out("anim_sequence_subnav_click - delay500",LVL.line))

				//NAV - set opacity to 1 (transition anim)
				set_global_subnav_opacity(1)	
				set_global_subnav_scale(1)			

				//fade in skillset
				ee.delay500(
					() => {

						if (debug) console.log(out("anim_sequence_subnav_click - SECOND delay500",LVL.line))

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

	const [ global_content_3d_translateZ, global_set_content_3d_translateZ					] = useState(200)

	

	///////////////////// < PORTFOLIO > /////////////////////

	//ACCESS - Nav.tsx - iterates over DATA:skills -> roles to build HTML
	//Array
	const [	global_portfolio																									] 	= useState<Array<IPortfolio_item>>(portfolio_data.portfolio)

	//ACCESS - Portfolio_subNav.tsx uses to render conditional JSX
	//String - "skillset", "portfolio"
	const [	global_portfolio_mode, global_set_portfolio_mode									] 	= useState<string>("overview")

	//ACCESS - set by - ctrl_portfolio_filter_byRole()
	//Array - filtered portfolio items
	const [	global_portfolio_filtered, global_set_portfolio_filtered					] 	= useState<Array<IPortfolio_item>>([
		portfolio_data.portfolio[0]
	])

	//ACCESS - set by - ctrl_global_set_portfolio_item_current()
	//integer - single portfolio item id
	const [	global_portfolio_item_current, global_set_portfolio_item_current	] 	= useState<IPortfolio_item>(new Portfolio_item())
	

	//ACCESS - set by ...
	//string - "details", "skills", "media"
	const [	global_portfolio_item_mode, global_set_portfolio_item_mode				] 	= useState<string>("details")

	const [	global_nav_isOpen, global_set_nav_isOpen													]		= useState<boolean>(true)

	const [	global_nav_openHeight, global_set_nav_openHeight									]		= useState<number>(0)


	///////////////////// < SKILLS > /////////////////////

	//ACCESS - Nav.tsx - builds UI from
	//Aray of objects
	const [	global_skills_roles																									] 	= useState<Array<ISkills_role>>(portfolio_data.skills.skills_roles)


	//ACCESS - Nav.tsx - UI clicks

	//String 	- "skills_marketing", "skills_uiux", 
	// 				- "skills_webDev", "skills_gameDev"

	const [	global_skills_role_current, global_set_skills_role_current									] 	= useState<ISkills_role>(portfolio_data.skills.skills_roles[0]) 

	const [ global_skills_role_current_skills, global_set_skills_role_current_skills 		] 	= useState<Array<string>>(portfolio_data.skills.skills_roles[0].skill_keys.split(','))

	const [	global_role_skillsRanked_all																				] 	= useState<Array<ISkills_rated>>(portfolio_data.skills.skills_rated)

	const [	global_role_skillsRanked, set_global_role_skillsRanked							] 	= useState<Array<(ISkills_rated)>>([portfolio_data.skills.skills_rated[0]])



	///////////////////// < SUBNAV > /////////////////////

	const	[	global_subnav_opacity, set_global_subnav_opacity									]		= useState(0)
	const	[	global_subnav_scale, set_global_subnav_scale											]		= useState(1)

	const	[	global_skillset_opacity, set_global_skillset_opacity							]		= useState(0)
	const	[	global_skillset_scale, set_global_skillset_scale									]		= useState(1)




	// ----------- 3D ROTATE - FUNCTION --------------

	const ctrl_set_rotateY = (mode_str_in: string) => {

		if (debug) {
			console.log(out("ctrl_set_rotateY",LVL.function))
			console.log(out("- mode_str_in: " + mode_str_in,LVL.line))
		}

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
	const ctrl_portfolio_filter_byRole = useCallback((role_in: string):void => {

		if (debug) {
			console.log(out("ctrl_portfolio_filter_byRole",LVL.function))
			console.log(out("- role_in: " + role_in,LVL.line))
		}

		if (!role_in) {
			console.log(out('Role not found:' + role_in,LVL.line));
			//set_global_portfolio_filtered([]);
			return;
		}

		let skills_arr:string[] = [];

		portfolio_data.skills.skills_roles.forEach((item)=>{
			if(item.key===role_in) {
				skills_arr = item.skill_keys.split(',')
			}
		})



		const matching_items:object[] = []

		//----------- Portfolio Items -----------

		global_portfolio.forEach(

			// --------- item ---------
			(item) => {

				const port_item_skills = item.skillset.split(",")


				const port_item_matchingSkills = _.intersection( skills_arr, port_item_skills )

				//=== skills_arr_in.length

				if (port_item_matchingSkills.length > 0) {
					//console.log("length:"+port_item_matchingSkills.length);
					matching_items.push(item)
				}
				
			}

		)

		//sort by latest (newest) id for good chronology
		const matching_items_sorted = _.sortBy(matching_items,['id'],['desc']) as IPortfolio_item[]

		if (debug) {
			console.log(out("-------------- NEW PORTFOLIO --------------",LVL.line))
			console.log(out("matching_items_sorted",LVL.line),matching_items_sorted)
		}


		matching_items_sorted.reverse()

		global_set_portfolio_filtered(matching_items_sorted)


	},[global_portfolio,debug,out])//end f

	

	const ctrl_global_set_portfolio_item_current = (id_in: number):void => {

		if (debug) {
			console.log(out("set_global_portfolio_byID",LVL.function));
			console.log(out("- id_in: " + id_in,LVL.line));
		}

		let portfolio_item:IPortfolio_item = new Portfolio_item(); 

		global_portfolio.forEach((item) => {

			if(item.id === id_in) {
				if (debug) { console.dir(item); }
				portfolio_item = item;
			}

		})

		//set global state
		global_set_portfolio_item_current(portfolio_item);

	}//end f
	

	//----------------- SKILLS - FUNCTIONS -----------------

	const ctrl_set_global_role_skillsData = (role_in:string):void => {

		if (debug) { console.log(out("ctrl_set_global_role_skillsData",LVL.function)) }

		portfolio_data.skills.skills_roles.forEach(

			(item) => {

				if (role_in === item.key) {
					global_set_skills_role_current(item)
					global_set_skills_role_current_skills(item.skill_keys.split(','))
				}
			}

		)

	}//end f


	const ctrl_set_global_role_skillsRanked = (role_in:string) => {

		if (debug) { 
			console.log( out("ctrl_set_global_role_skillsRanked",LVL.function) )
		 }

		const final_skills: ISkills_rated[] = [new Skills_rated()]

		portfolio_data.skills.skills_rated.forEach(

			(item) => {
				if (role_in === item.category) {
					final_skills.push(item)
				}
			}

		)//end forEach

		//dirty 0 slot 
		final_skills.splice(0,1)

		if (debug) { console.log( out("ctrl_set_global_role_skillsRanked - final_skills",LVL.line),final_skills) }

		set_global_role_skillsRanked(final_skills)
	
	}//end f


	const ctrl_skillsRated_get_byPortfolioID = useCallback((int_id:number):ISkills_rated[] => {

		if (debug) { console.log(out("ctrl_skillsRated_get_byPortfolioID",LVL.function)) }

		//get this portfolio item
		const portfolioItem:IPortfolio_item[] = _.filter(global_portfolio,{'id':int_id})

		const portfolioItem_skillset_arr:string[] = portfolioItem[0].skillset.split(',')

		const matches: ISkills_rated[] = [] 

		portfolioItem_skillset_arr.forEach((key_str: string)=> {
			matches.push(_.filter(global_role_skillsRanked_all,{'key':key_str})[0])
		})

		//send back the first match
		return matches

	},
		[global_portfolio,global_role_skillsRanked_all,debug]
	)//end f



	////////////////////// EFFECTS //////////////////////


	useEffect(()=>{

		if (debug) { console.log( out("DataProvider.tsx",LVL.effect)) }

		if (local_portfolioInit) { return }

		if (debug) { console.log( out("DataProvider.tsx - ",LVL.line)) }

		set_local_portfolioInit(true) 

		ctrl_portfolio_filter_byRole(portfolio_data.skills.skills_roles[0].key)

		ctrl_skillsRated_get_byPortfolioID(3)

	},[
		out,
		local_portfolioInit,
		ctrl_portfolio_filter_byRole,
		ctrl_skillsRated_get_byPortfolioID,
		debug
	])

	
	return (

    <PortfolioContext.Provider value={{ 

			//////////////////// APP /////////////////////

			// Variables -----------

			global_debug,

			ee, 

			global_nav_openHeight,

			global_ui_nav_classMap,
			global_nav_isOpen,


			global_subnav_opacity,
			global_subnav_scale,

			global_skillset_opacity,
			global_skillset_scale,

			global_content_overview_rotateY,
			global_content_skillset_rotateY,
			global_content_portfolio_rotateY,

			global_content_3d_translateZ,



			// Setters -----------

			global_set_nav_openHeight,
			global_set_ui_nav_classMap,
			global_set_nav_isOpen,
			global_set_content_3d_translateZ,



			// Functions -----------
			ctrl_set_rotateY,




			//////////////////// SKILLS /////////////////////


			// Variables -----------

			global_skills_roles,
			global_skills_role_current,
			global_role_skillsRanked_all,
			global_skills_role_current_skills,
			global_role_skillsRanked,


			// Setters -----------

			global_set_skills_role_current,


			// Functions -----------
			ctrl_set_global_role_skillsRanked,

			ctrl_set_global_role_skillsData,

			ctrl_skillsRated_get_byPortfolioID,





			//////////////////// PORTFOLIO /////////////////////

			// Variables -----------

			global_portfolio,
			global_portfolio_mode, 
			global_portfolio_filtered,
			global_portfolio_item_current,
			global_portfolio_item_mode, 
			
			
			// Setters -----------

			global_set_portfolio_mode,
			global_set_portfolio_filtered,
			global_set_portfolio_item_current,

			global_set_portfolio_item_mode,
			


			anim_sequence_subnav_click,
	
			

			// Functions -----------

			ctrl_global_set_portfolio_item_current,
			ctrl_portfolio_filter_byRole, 

			}}>

      {children}

    </PortfolioContext.Provider>

  )//end return()

}//end class

