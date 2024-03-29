function setUpMenu(request, sender, sendResponse){
	//if (request.cmd === "updateListRecentlyClosed" ){
	//console.log(`RecentlyClosed OnContextMenu cmd: ${request.cmd}`)
	//}

	function listRecentClosed(sessionInfos){
		browser.menus.removeAll() //{{{

		let i=0
		for (let sessionInfo of sessionInfos) {
			let itemTitle, url, tab, sessionId=null

			if(sessionInfo.tab){
				tab= sessionInfo.tab
				itemTitle = tab.title? tab.title: tab.url
				sessionId = sessionInfo.tab.sessionId
			}else if(sessionInfo.window){
				tab = sessionInfo.window.tabs[0]
				if(!tab)continue
				itemTitle = 'w) '+ (tab.title? tab.title : tab.url)
				sessionId = sessionInfo.window.sessionId
			}
			if(!sessionId)continue
			url = new URL(tab.url)

			//console.log(`sessionInfo.item: ${itemTitle}`)
			if(itemTitle.length >61 ){
				const beg = itemTitle.slice(0, 27)
				const end = itemTitle.slice(-28)
				itemTitle = beg+'...'+end
			}

			browser.menus.create({ id: (("recentlyclosed"+ i++ +"-") + sessionId), title: itemTitle, contexts: ["all"], enabled: true/*, onclick: (info, tab)=>{
				let idx = info.menuItemId.indexOf('-'),
					sesId = info.menuItemId.slice(idx+1)

				browser.sessions.restore(sesId)
				
			}*/
				, icons: {16: url.origin+"/favicon.ico"}
			})
		}
	} //}}}

	var gettingSessions = browser.sessions.getRecentlyClosed({
		maxResults: 25
  })

	gettingSessions.then(listRecentClosed, error=>{
		console.log(error)
	})
}

browser.menus.onClicked.addListener((info, tab)=>{
	let idx = info.menuItemId.indexOf('-'),
		sesId = info.menuItemId.slice(idx+1)

	browser.sessions.restore(sesId)

})

browser.runtime.onMessage.addListener(setUpMenu)

browser.tabs.onRemoved.addListener(
	setUpMenu
)

browser.tabs.onActivated.addListener( /* tab selected */
	setUpMenu
)

