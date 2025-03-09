import { useContext, useEffect, useState } from 'react'
import { PortfolioContext } from '../Data/DataProvider'
import _ from 'lodash'

import { style_out } from '../Logger/Output'

//CSS
import './Content_Skillset.css'
import { LVL } from '../Data/Models'


export default function Content_Skillset() {

	const debug:boolean = false;

	const o = (msg:string,l:LVL) => {
		return style_out(msg,l)
	}

	////////////////////// GLOBAL VARIABLES //////////////////////

	const {
		global_content_3d_translateZ,
		global_content_skillset_rotateY,
		global_skillset_opacity: global_skillset_opacity,
		global_skillset_scale: global_skillset_scale,
		global_skills_role_current: global_skills_role_current, 
		global_role_skillsRanked: global_role_skillsRanked, 
		global_nav_openHeight} 	= useContext(PortfolioContext)
	



	////////////////////// LOCAL VARIABLES //////////////////////

	const [local_skills, set_local_skills] = useState([])



	////////////////////// FUNCTIONS //////////////////////


	const search_skills = (e) => {

		if (debug) { console.log( o("search_skills",LVL.function)) }

		const search_str = e.target.value

		const raw_arr = global_role_skillsRanked;

		let final_arr = []

		final_arr = _.filter(raw_arr,(item)=>{
			if (item.title.toLowerCase().includes(search_str.toLowerCase())) {
				return item;
			}
		})

		if (debug) { console.log( o("final_arr",LVL.line), final_arr) }


		set_local_skills(final_arr)
	}



	////////////////////// EFFECTS //////////////////////

	useEffect(() => { 

		if (debug) { 
			console.log( o("Content_Skillset.tsx",LVL.effect) )
			console.log( o("- global_role_skillsRanked: ",LVL.line), global_role_skillsRanked )
		}

		set_local_skills(global_role_skillsRanked)

	},[
		global_content_3d_translateZ,
		global_skillset_opacity,
		global_skillset_scale,
		global_skills_role_current, 
		global_role_skillsRanked,
		global_nav_openHeight,
		debug
	])
	


	////////////////////// RENDER //////////////////////

	return (

		<div 	id="skillset" 
					data-testid="skillset"
					className="skills" 
					style={{
						opacity:global_skillset_opacity, 
						transform:'rotateY('+global_content_skillset_rotateY+'deg) translateZ('+global_content_3d_translateZ+'px)'}}>

		<div className="skills_header">
			<div className="skills_search_title">{global_skills_role_current.title} Skills ({global_role_skillsRanked.length})</div>
			<div className="skills_search_input">
				<input 
					type="text" 
					id="skills_search_input" 
					data-testid="skills-search-input"  // Added this
					name="fname" 
					placeholder='Search' 
					onChange={search_skills}/>
			</div>
		</div>

		<div className="skills_content">

			<div className="column col2">

				<div className="skills_fuelBars">

					{

						local_skills.map(

							(item, i) => (
								
								<div className="skill_row" key={i}>
									<div className="skill_row_title">{ item.title }</div>
									<div className="skill_row_fuelBar skill_bar_horizontal">
										<div className={"skill_bar_horizontal_fuel type_" + item.category + " bar_width"+item.strength}></div>
									</div>
								</div>

							)

						)

					}

				</div>

			</div>

		</div>
			
	</div>

	)//end render

}//end class