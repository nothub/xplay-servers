function addHeader(table) {
    let row = table.insertRow()
    for (let text of [
        'link',
        'map',
        'online',
        'max',
        'faceit',
        'country',
        'tick'
    ]) {
        let th = document.createElement('th')
        th.innerText = text
        row.appendChild(th)
    }
}

function addServer(table, server) {
    let row = table.insertRow()
    let cell = row.insertCell()
    let link = document.createElement('a')
    link.innerText = `${server.IP}:${server.Port}`
    link.href = `steam://connect/${server.IP}:${server.Port}`
    cell.appendChild(link)
    for (let text of [
        server.CurrentMap,
        server.Online,
        server.TotalSlots,
        server.AverageFaceItLvl,
        server.CountryCode,
        server.TickRate
    ]) {
        let cell = row.insertCell()
        cell.innerText = text
    }
}

(async function () {
    let modes = []
    await fetch('https://xplay.gg/api/play/getCurrentOnlineStatus', {
        method: 'GET', headers: {
            'Accept': 'application/json'
        },
    })
        .then(res => res.json())
        .then(data => modes = data.GameModes.cs2)
        .catch(err => console.log(`Failed to fetch modes; ${err}`))

    for (const mode of modes) {
        let s = document.createElement('section')
        document.getElementById('main').appendChild(s)

        let h = document.createElement('h2')
        h.innerText = mode.Slug
        s.appendChild(h)

        let n = document.createElement('a')
        n.innerText = mode.Slug
        n.href = `#${mode.Slug}`
        n.appendChild(document.createElement('br'))
        document.getElementById('nav').appendChild(n)

        let t = document.createElement('table')
        t.className = 'sortable'
        t.id = mode.Slug
        addHeader(t);
        s.appendChild(t)

        let servers = []
        await fetch('https://xplay.gg/api/play/getServers', {
            method: 'POST', body: JSON.stringify({modeID: mode.GameModeID, showFullServers: true}), headers: {
                'Accept': 'application/json', 'Content-Type': 'application/json'
            },
        })
            .then(res => res.json())
            .then(data => servers = data)
            .catch(err => console.log(`Failed to fetch servers for ${mode.Slug}; ${err}`))

        for (let server of servers) {
            addServer(t, server);
        }

        sorttable.makeSortable(t);
    }
})()
