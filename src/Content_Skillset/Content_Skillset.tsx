import { useContext, useEffect, useState } from 'react'
import { PortfolioContext } from '../Data/DataProvider'

//CSS
import './Content_Skillset.css'


export default function Content_Skillset() {

	const {
		global_content_3d_translateZ,
		global_content_skillset_rotateY,
		global_skillset_opacity,
		global_skillset_scale,
		global_role_current, 
		global_role_skillsRanked, 
		global_nav_openHeight} 	= useContext(PortfolioContext)

	const [local_resume_url_byRole, set_local_resume_url_byRole] 									= useState("")
	const [local_resume_label_byRole, set_local_resume_label_byRole] 							= useState("")


	const resume_url_byRole = (role_in:string) => {
		
		let final_url = "";

		switch(role_in) {

			case "skills_marketing": 
				final_url = "marketingresume.pdf"
				break

			case "skills_uiux":
				final_url = "uiuxresume.pdf"
				break

			case "skills_webDev":
				final_url = "webDevresume.pdf"
				break

			case "skills_gameDev":
				final_url = "gameDevResume.pdf"
				break

			default:
				break

		}
		
		set_local_resume_url_byRole(final_url)
		
	}


	const resume_label_byRole = (role_in:string) => {

		//console.log("resume_label_byRole() - role_in: " + role_in);

		let final_label = ""

		switch(role_in) {

			case "skills_marketing":
				final_label = "Marketing Resume"
				break

			case "skills_uiux":
				final_label = "UI/UX Resume"
				break

			case "skills_webDev":
				final_label = "Web Development Resume"
				break

			case "skills_gameDev":
				final_label = "Game Development Resume"
				break

			default:
				break
		}

		//console.log("resume_label_byRole() - final_label: " + final_label);

		set_local_resume_label_byRole(final_label)

	}//end f


	useEffect(() => { 
		//console.log("Skillset.tsx - useEffect( - local_resume_label_byRole: " + local_resume_label_byRole);
		//console.log("Skillset.tsx - useEffect() - local_resume_url_byRole: " + local_resume_url_byRole);
		//console.dir(global_role_current)
		//console.dir(global_role_skillsRanked)

		resume_url_byRole(global_role_current.key)
		resume_label_byRole(global_role_current.key)

	},[
		global_content_3d_translateZ,
		global_skillset_opacity,
		global_skillset_scale,
		global_role_current, 
		global_role_skillsRanked,
		global_nav_openHeight,
		local_resume_url_byRole,
		local_resume_label_byRole
	])
	


	return (
		<div id="skillset" className="skills" style={{opacity:global_skillset_opacity, transform:'rotateY('+global_content_skillset_rotateY+'deg) translateZ('+global_content_3d_translateZ+'px)'}}>

		<div className="skills_content">

			<div className="column col2">

				<div className="skills_fuelBars">

			{

				global_role_skillsRanked.map(

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
	)

}//end class