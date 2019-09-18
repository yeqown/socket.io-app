/**
 * getNowTimestamp get timestamp (ms)
 */
export const getNowTimestamp = (): number => {
    return new Date().getTime()
}

/**
 * rmSlashLeft if s starts with '/'
 * @param s 
 */
export const rmSlashLeft = (s: string): string => {
    if (s[0] !== "/") return s
    return s.slice(1)
}

/**
 * addSlashLeft if s not start with '/'
 * @param s 
 */
export const addSlashLeft = (s: string): string => {
    if (s[0] !== "/") return "/" + s
    return s
}