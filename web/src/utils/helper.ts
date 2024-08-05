export function formatTime(secs: number) {
    secs = Math.floor(secs)
    const hours = Math.floor(secs / 3600) || 0;
    const minutes = Math.floor((secs - (hours * 3600)) / 60) || 0;
    const seconds = secs - (hours * 3600) - (minutes * 60) || 0 ;

    const hours_s = hours < 10 ? "0" + hours : hours.toString() 
    const minutes_s = minutes < 10 ? "0" + minutes : minutes.toString() 
    const seconds_s = seconds < 10 ? "0" + seconds : seconds.toString() 

    return hours_s === "00" ? minutes_s+':'+seconds_s : hours_s+':'+minutes_s+':'+seconds_s;
}