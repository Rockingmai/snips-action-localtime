import { IntentMessage, NluSlot, slotType } from 'hermes-javascript'

function geometricMean (dataSet: number[]) {
    return Math.pow(dataSet.reduce((accumulator, element) => accumulator * element, 1), 1/dataSet.length)
}

type GetSlotsByNameReturn<T, S extends slotType> =
    T extends false ? NluSlot<S>[] :
    T extends true ? NluSlot<S> | null :
    NluSlot<S>[]

export const message = {
    // Helper to filter slots given their name, and potentially a lower threshold for the confidence level.
    // You can also use the onlyMostConfident boolean to return only a single slot with the highest confidence.
    // If no slot match the criterias, then returns null.
    getSlotsByName: <S extends slotType = slotType, T extends boolean = false>(
        message: IntentMessage,
        slotName: string,
        { threshold = 0, onlyMostConfident = undefined }: { threshold?: number, onlyMostConfident?: T } = {}
    ): GetSlotsByNameReturn<T, S> => {
        if(onlyMostConfident) {
            return message.slots.reduce((acc, slot) => {
                if(slot.slotName === slotName && slot.confidenceScore > threshold) {
                    if(!acc || acc.confidenceScore < slot.confidenceScore)
                        return slot
                }
                return acc
            }, null as any)
        }
        return message.slots.filter(slot => slot.slotName === slotName && slot.confidenceScore > threshold) as any
    },
    getAsrConfidence(message: IntentMessage): number {
        if(!message.asrTokens || message.asrTokens.length < 1 || !message.asrTokens[0])
            return 1
        return geometricMean(message.asrTokens[0].map(token => token.confidence))
    }
}
