/*
 * parameters = {
 *  keyCodes: { userInterface: String, help: String, statistics: String }
 * }
 */

export default class Player {
    constructor(parameters) {
        for (const [key, value] of Object.entries(parameters)) {
            this[key] = value;
        }
        this.keyStates = { statistics: false, userInterface: false, help: false };
    }
}