function setUpMenu(){
	function listRecentClosed(sessionInfos){
		chrome.contextMenus.removeAll()

		let i=0
		for (let sessionInfo of sessionInfos) {
			let item, itemTitle, tab, url
			if(sessionInfo.tab){
				item = sessionInfo.tab
				tab = sessionInfo.tab
				itemTitle = item.title
			}else{
				item = sessionInfo.window
				try{
					itemTitle = 'w) '+sessionInfo.window.tabs[0].title
					tab = sessionInfo.window.tabs[0]
				}catch(e){}
			}
			url = new URL(tab.url)

			if(!item) continue
			//console.log(`sessionInfo.item: ${itemTitle}`)
			chrome.contextMenus.create({ id: "recentlyclosed-" + (i++), title: itemTitle, contexts: ["all"], enabled: true, onclick: ()=>{
				browser.sessions.restore(item.sessionId)
			}
				, icons: {16: url.origin+"/favicon.ico"}
			})
		}
	}

	var gettingSessions = browser.sessions.getRecentlyClosed({
		//maxResults: 25
	})

	gettingSessions.then(listRecentClosed, (error)=>{
		console.log(error)
	})

}

chrome.webNavigation.onCompleted.addListener(  /* page loaded */
	setUpMenu
)

chrome.tabs.onUpdated.addListener(  /* URL updated */
	setUpMenu
)


chrome.tabs.onActivated.addListener(  /* tab selected */
	setUpMenu
)

