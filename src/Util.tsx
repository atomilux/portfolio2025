
export function comment(txt:string) {
	return (
		<span dangerouslySetInnerHTML = {{__html:'<!---------- ' + txt + '---------->'}} ></span>
	)
}


export default comment;