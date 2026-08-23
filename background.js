chrome.action.onClicked.addListener(async (tab) => {

    if (!tab.id) {
        console.error('SINapse-Conversor: aba sem ID');
        return;
    }

    try {

        await chrome.scripting.executeScript({
            target: {
                tabId: tab.id
            },
            files: ['converter.js']
        });

        console.log(
            'SINapse-Conversor: conversor executado'
        );

    } catch (erro) {

        console.error(
            'SINapse-Conversor:',
            erro
        );
    }
});