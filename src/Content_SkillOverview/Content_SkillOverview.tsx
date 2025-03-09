import { useContext, useEffect, useState } from 'react'
import { PortfolioContext } from '../Data/DataProvider'

//CSS
import './Content_SkillOverview.css'


export default function Content_SkillOverview() {


	////////////////////// GLOBAL VARIABLES //////////////////////

	const {
		global_content_3d_translateZ,
		global_content_overview_rotateY,
		global_skillset_opacity: global_skillset_opacity,
		global_skillset_scale: global_skillset_scale,
		global_skills_role_current: global_skills_role_current, 
		global_role_skillsRanked: global_role_skillsRanked, 
		global_nav_openHeight} 	= useContext(PortfolioContext)




	////////////////////// LOCAL VARIABLES //////////////////////

	const [local_resume_url_byRole, set_local_resume_url_byRole] 									= useState("")
	const [local_resume_label_byRole, set_local_resume_label_byRole] 							= useState("")




	////////////////////// FUNCTIONS //////////////////////

	
	//---- CONTENT ------
	
	const resume_url_byRole = (role_in:string) => {
		
		let final_url = "";


		//TODO - these need to be pulled from Context

		switch(role_in) {

			case "skills_marketing": 
				final_url = "./resumes/resume_SteveLux_Marketing_2024.pdf"
				break

			case "skills_uiux":
				final_url = "./resumes/resume_SteveLux_UIUX_2023.pdf"
				break

			case "skills_webDev":
				final_url = "./resumes/resume_SteveLux_UnityDev_2023.pdf"
				break

			case "skills_gameDev":
				final_url = "./resumes/resume_SteveLux_webDev_2024.pdf"
				break

			default:
				break

		}
		
		set_local_resume_url_byRole(final_url)
		
	}



	//---- STYLING ------

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



	////////////////////// EFFECTS //////////////////////

	useEffect(() => {

		resume_url_byRole(global_skills_role_current.key)
		resume_label_byRole(global_skills_role_current.key)

	},[
		global_content_3d_translateZ,
		global_skillset_opacity,
		global_skillset_scale,
		global_skills_role_current, 
		global_role_skillsRanked,
		global_nav_openHeight,
		local_resume_url_byRole,
		local_resume_label_byRole
	])



	////////////////////// RENDER //////////////////////

	return (
		
		<div 	id="skillset_overview" 
					data-testid="skillset-overview"
					style={{
						opacity:global_skillset_opacity, 
						transform: 	'rotateY('+global_content_overview_rotateY+'deg) ' + 
												'translateZ('+global_content_3d_translateZ+'px)'
					}}>
		<div className="skills_overview">
			<div className="column col1">
				<div className="skills_desc">{ global_skills_role_current.desc }</div>
				<div className="skills_link">
					<img className="acrobat_icon" src="./images/icon_acrobat.svg"/>
					<a href={ local_resume_url_byRole } target="_blank">{ local_resume_label_byRole }</a>
				</div>				
			</div>

		</div>
			
	</div>

	)//end render

}//end class