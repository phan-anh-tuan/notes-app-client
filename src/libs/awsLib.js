import { Storage } from 'aws-amplify'

export async function s3Upload(file) {
    const filename = `${Date.now()}-${file.name}`

    try {
        const stored = await Storage.vault.put(filename,file, {
            contentType: file.type
        })
        return stored.key    
    } catch (error) {
        throw error
    }
}


export async function s3Remove(filename) {

    try {
        await Storage.vault.remove(filename)
    } catch (error) {
        throw error
    }
}