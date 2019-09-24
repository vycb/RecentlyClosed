function setUpMenu(request, sender, sendResponse){
	//if (request.cmd !== "updateListRecentlyClosed" && !request.TabId) return

	function listRecentClosed(sessionInfos){
		chrome.contextMenus.removeAll() //{{{

		for (let sessionInfo of sessionInfos) {
			let itemTitle, url, tab, sessionId

			if(sessionInfo.tab){
				tab= sessionInfo.tab
				itemTitle = tab.title? tab.title: tab.url
				sessionId = sessionInfo.tab.sessionId
			}else{
				tab = sessionInfo.window.tabs[0]
				itemTitle = 'w) '+ (tab.title? tab.title : tab.url)
				sessionId = sessionInfo.window.sessionId
			}
			url = new URL(tab.url)

			//console.log(`sessionInfo.item: ${itemTitle}`)
			if(itemTitle.length >61 ){
				const beg = itemTitle.slice(0, 27)
				const end = itemTitle.slice(-28)
				itemTitle = beg+'...'+end
			}

			chrome.contextMenus.create({ id: "recentlyclosed-" + sessionId, title: itemTitle, contexts: ["all"], enabled: true, onclick: (info, tab)=>{
				let idx = info.menuItemId.indexOf('-'),
					sessionId = info.menuItemId.slice(idx+1)

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

