'use client'

import { useEffect } from 'react'

export default function LaunchListWidget() {
    useEffect(() => {
        const id = 'launchlist-widget-script'
        if (document.getElementById(id)) return // Don't load again

        const script = document.createElement('script')
        script.id = id
        script.src = 'https://getlaunchlist.com/js/widget.js'
        script.defer = true
        document.body.appendChild(script)
    }, [])

    return (
        <div
            className="launchlist-widget"
            data-key-id="qOdleM"
        />
    )
}
