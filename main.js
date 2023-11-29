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

function newModeTable(slug) {
    let s = document.createElement('section')
    document.getElementById('main').appendChild(s)

    let h = document.createElement('h2')
    h.innerText = slug
    s.appendChild(h)

    let n = document.createElement('a')
    n.innerText = slug
    n.href = `#${slug}`
    n.appendChild(document.createElement('br'))
    document.getElementById('nav').appendChild(n)

    let t = document.createElement('table')
    t.className = 'sortable'
    t.id = slug
    addHeader(t)
    s.appendChild(t)

    return t
}

(async function () {

    let modeData = []
    await fetch('https://xplay.gg/api/play/getCurrentOnlineStatus', {
        method: 'GET', headers: {
            'Accept': 'application/json'
        },
    })
        .then(res => res.json())
        .then(data => modeData = data.GameModes)
        .catch(err => console.log(`Failed to fetch modes; ${err}`))

    const modes = new Map();
    for (const mode of modeData) {
        modes.set(mode.GameModeID, mode)
    }

    for (const mode of modes.values()) {
        mode.Table = newModeTable(mode.Slug)
        mode.Cmds = []
    }

    let allData = []
    await fetch('https://xplay.gg/api/play/getAllServers', {
        method: 'GET', headers: {
            'Accept': 'application/json'
        },
    })
        .then(res => res.json())
        .then(data => allData = data)
        .catch(err => console.log(`Failed to fetch servers and commands; ${err}`))

    for (let server of allData.serversList) {
        let row = modes.get(server.GameModeID).Table.insertRow()
        let cell = row.insertCell()
        let link = document.createElement('a')
        link.innerText = `${server.IP}:${server.Port}`
        link.href = `steam://connect/${server.IP}:${server.Port}`
        cell.appendChild(link)
        for (let text of [server.CurrentMap, server.Online, server.TotalSlots, server.AverageFaceItLvl, server.CountryCode, Math.round(server.TickRate)]) {
            let cell = row.insertCell()
            let p = document.createElement('p')
            p.innerText = text
            cell.appendChild(p)
        }
    }

    for (let cmd of allData.commandsList) {
        if (cmd.CS2 === 1) {
            modes.get(cmd.GameModeID).Cmds.push(cmd)
        }
    }

    for (const mode of modes.values()) {
        sorttable.makeSortable(mode.Table);
        for (const cmd of mode.Cmds) {
            console.log(cmd.Command, "-", cmd.Description)
        }
    }

})()
