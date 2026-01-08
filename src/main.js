let tabId = 0;
let sessionExists = false;
let originalWindowState = 'none';
let originalWindowId = 0;
let thatWindow = { id: 0 };
let iii = 0;

console.log('Test 6,7');
console.log('rizz ohio')

async function genericHandler(tab) {
    try {
        const url = new URL(tab.url);
        if((
            url.pathname.endsWith('/startquiz')
            || url.pathname.endsWith('/viewform')
        ) && url.hash === '#gfu') {
            tabId = tab.id;
            sessionExists = true;
            await browser.tabs.update(tab.id, { active: true });
            originalWindowId = tab.windowId;
            originalWindowState = (await browser.windows.getCurrent()).state;
            thatWindow = await browser.windows.create({
                tabId: tab.id,
                state: 'fullscreen',
                //allowScriptsToClose: true
            });
            iii = setInterval(async () => {
                if(!sessionExists) returb;
                const lf = await browser.windows.getLastFocused();
                if(lf.id != thatWindow.id)
                    onupd();
            }, 100);
        }
    } catch (error) {
        console.warn(error);
    }
}

browser.tabs.onCreated.addListener(tab => {
    if(sessionExists) {
        return browser.tabs.remove(tab.id);
    }
    genericHandler(tab);
});

async function onupd(tab) {
    tab = tab || await browser.tabs.get(tabId);
    let id = tab.id;
    if(tab.id === tabId) {
        const url = new URL(tab.url);
        if(!((
            url.pathname.endsWith('/startquiz')
            || url.pathname.endsWith('/viewform')
        )&&url.hash==='#gfu')) {
            sessionExists = false;
            await browser.tabs.move(id, {
                windowId: originalWindowId,
                index: -1
            });
            await browser.tabs.update(id, { active: true });
            clearInterval(iii);
        } else {
            await browser.tabs.update(id, { active: true })
            await browser.windows.update(thatWindow.id, {
                state: 'fullscreen',
                focused: true
            });
        }
    } else {
        await browser.tabs.update(id, { active: true })
        await browser.windows.update(thatWindow.id, {
            state: 'fullscreen',
            focused: true
        });
    }
}

browser.tabs.onActivated.addListener((_,id) => {
    if(!sessionExists) return;
    if(id !== tabId) onupd();
});


browser.windows.onFocusChanged.addListener(async (id) => {
    if(!sessionExists) return;
    if(id !== thatWindow.id) await browser.update(thatWindow.id, {
        state: 'fullscreen',
        focused: true
    });
});

browser.tabs.onUpdated.addListener(async (id, _, tab) => {
    if(sessionExists) {
        onupd(tab);
    } else {
        genericHandler(tab);
    }
});

browser.tabs.onRemoved.addListener(id => {
    if(id === tabId && sessionExists) {
        sessionExists = false;
        tabId = null; 
        clearInterval(iii);
    }
});

browser.runtime.onMessage.addListener((message, sender) => {
    if(message === 'fsnp' && sender.tab && thatWindow && sessionExists) {
        browser.windows.update(thatWindow.id, {
            state: "fullscreen",
            focused: true,
            drawAttention: true
        });
    }
});


browser.webRequest.onBeforeSendHeaders.addListener(
    async (details) => {
        const headers = details.requestHeaders || details.headers;
        for (const header of headers) {
            if(header.name.toLowerCase() === 'user-agent') {
                header.value = 'Mozilla/5.0 (X11; CrOS x86_64 16181.61.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36';
            }
        }
        return { requestHeaders: headers };
    },
    {
        urls: [
            '*://docs.google.com/forms/*'
        ]
    },
    [ 'requestHeaders', 'blocking' ]
);