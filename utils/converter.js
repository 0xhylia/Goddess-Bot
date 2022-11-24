class Converter {
    constructor() {
    }

    convertVtuberProfileToXml(vtuberProfile) {
        const xmlTemplate = `<?xml version="1.0" encoding="UTF-8" ?>
        <root>
          <id role="string">${vtuberProfile._id}</id>
          <userId role="string">${vtuberProfile.userId}</userId> 
          <youtube role="string">${vtuberProfile.youtube}</youtube>
          <twitter role="string">${vtuberProfile.twitter}</twitter>
          <twitch role="string">${vtuberProfile.twitch}</twitch>
          <instagram role="string">${vtuberProfile.instagram}</instagram>
          <tiktok role="string">${vtuberProfile.tiktok}</tiktok>
          <discord role="string">${vtuberProfile.discord}</discord>
          <isPremium role="boolean">${vtuberProfile.isPremium}</isPremium>
          <isStaff role="boolean">${vtuberProfile.isStaff}</isStaff>
          <description role="string">${vtuberProfile.description}</description>
          <banner role="string">${vtuberProfile.banner}</banner>
          <nickname role="string">${vtuberProfile.nickname}</nickname>
          <throne role="string">${vtuberProfile.throne}</throne>
          <vtuberModal role="string">${vtuberProfile.vtuberModal}</vtuberModal>
        </root>`

        const xml = xmlTemplate

        return xml;
    }

    convertVtuberProfileToJson(vtuberProfile) {
        const json = {
            _id: vtuberProfile._id,
            userId: vtuberProfile.userId,
            youtube: vtuberProfile.youtube,
            twitter: vtuberProfile.twitter,
            twitch: vtuberProfile.twitch,
            instagram: vtuberProfile.instagram,
            tiktok: vtuberProfile.tiktok,
            discord: vtuberProfile.discord,
            isPremium: vtuberProfile.isPremium,
            isStaff: vtuberProfile.isStaff,
            description: vtuberProfile.description,
            banner: vtuberProfile.banner,
            nickname: vtuberProfile.nickname,
            throne: vtuberProfile.throne,
            vtuberModal: vtuberProfile.vtuberModal,
        }

        return json;
    }
}

module.exports = Converter;