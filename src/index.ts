import { withHermes } from 'hermes-javascript'
import bootstrap from './bootstrap'
import handlers from './handlers'
import { translation, logger } from './utils'

// Initialize hermes
export default function ({ hermesOptions = {}, bootstrapOptions = {} } = {}) : Promise<() => void> {
    return new Promise((resolve, reject) => {
        withHermes(async (hermes, done) => {
            try {
                // Bootstrap config, locale, i18n…
                await bootstrap(bootstrapOptions)
                const dialog = hermes.dialog()
                // This is a placeholder! Replace that by something valid!
                dialog.flows([
                    {
                        intent: 'snips-assistant:GetLocalTime',
                        action : handlers.getLocalTime
                    }, {
                        intent: 'snips-assistant:CheckTime',
                        action: handlers.getLocalTime
                    }, {
                        intent: 'snips-assistant:ConvertTime',
                        action : handlers.convertTime
                    }, {
                        intent: 'snips-assistant:GetTimezone',
                        action : handlers.getTimeZone
                    }, {
                        intent: 'snips-assistant:GetTimeDifference',
                        action : handlers.getTimeDifference
                    }
                ])
                resolve(done)
            } catch (error) {
                console.log(error)
                
                // Output initialization errors to stderr and exit
                const message = await translation.errorMessage(error)
                
                logger.error(message)
                logger.error(error)
                // Exit
                done()
                // Reject
                reject(error)
            }
        }, hermesOptions)
    })
}