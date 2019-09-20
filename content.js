//const extensionId = browser.runtime.id

addEventListener('contextmenu', eve => {
	var sending = browser.runtime.sendMessage({
    cmd: "updateListRecentlyClosed"
  })
  sending.then(null//message =>{
		//console.log(`from the background script:  ${message.response}`) //handleResponse
		//}
		, error =>{
			console.log(`Error: ${error}`)
		} //handleError
	)
}, false)
