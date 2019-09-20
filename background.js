function setUpMenu(request, sender, sendResponse){
	//if (request.cmd !== "updateListRecentlyClosed" && !request.TabId) return

	function listRecentClosed(sessionInfos){
		chrome.contextMenus.removeAll() //{{{

		let i=0
		for (let sessionInfo of sessionInfos) {
			let itemTitle=null, url=null, tab=null

			if(sessionInfo.tab){
				tab= sessionInfo.tab
				itemTitle = tab.title? tab.title: tab.url
			}else{
				tab = sessionInfo.window.tabs[0]
				itemTitle = 'w) '+ (tab.title? tab.title : tab.url)
			}
			url = new URL(tab.url)

			//console.log(`sessionInfo.item: ${itemTitle}`)
			if(itemTitle.length >61 ){
				const beg = itemTitle.slice(0, 27)
				const end = itemTitle.slice(-28)
				itemTitle = beg+'...'+end
			}

			chrome.contextMenus.create({ id: "recentlyclosed-" + i++, title: itemTitle, contexts: ["all"], enabled: true, onclick: ()=>{
				let sessionId
				if (sessionInfo.tab){
					sessionId = sessionInfo.tab.sessionId
				} else {
					sessionId = sessionInfo.window.sessionId
				}
				browser.sessions.restore(sessionId)
				
			}
				, icons: {16: url.origin+"/favicon.ico"}
			})
		}
	} //}}}

	var gettingSessions = browser.sessions.getRecentlyClosed({ //maxResults: 25
	})

	gettingSessions.then(listRecentClosed, error=>{
		console.log(error)
	})

}

browser.runtime.onMessage.addListener(setUpMenu)

chrome.tabs.onRemoved.addListener(
	setUpMenu
)

chrome.tabs.onActivated.addListener( /* tab selected */
	setUpMenu
)

