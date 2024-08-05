import { Howl } from 'howler'

export function addHowlerListener(howl: Howl, ...args: Parameters<Howl['on']>) {
    howl.on(...args)
    return () => {howl.off(...args)}
}