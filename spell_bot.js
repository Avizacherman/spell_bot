var RtmClient = require('slack-client').RtmClient
var SLACK_EVENTS = require('slack-client').RTM_EVENTS
var request = require('request')
var botToken = process.env.SPELL_BOT_TOKEN
var SpellHelpers = require('./spellhelpers')
var _ = require('underscore')

console.log(RtmClient)

var slack = new RtmClient(botToken, {logLevel: "debug"})
slack.start()

slack.on(SLACK_EVENTS.WS_ERROR, (err)=>{console.log(err)} )

slack.on(SLACK_EVENTS.RTM_CONNECTION_OPENED, function(){

	// _.map(slack.channels, function(channel) {
	// 	slack.getChannelGroupOrDMByID(channel).send("With a POOF I've arrived")
	// })
})


slack.on(SLACK_EVENTS.MESSAGE, function(message){
	request('https://spell-buddy.herokuapp.com/api/spell_names', function(err, response, body){
		if(err) console.log(err)

		console.log(message)
		spellNames = JSON.parse(body)
		spellNames.forEach(function(spellName){
				if(message.text){
					if(message.text.toLowerCase().match(spellName.name.toLowerCase())) {
						request(`https://spell-buddy.herokuapp.com/api/spells/${spellName.id}`, function(err, response, body){
							var spell = JSON.parse(body)[0]
							var helper = new SpellHelpers(spell)

							slack.sendMessage(`\`\`\`${spell.name}\n Levels: ${spell.spell_level} \n School: ${spell.school} \t ${helper.subschool()} \t ${helper.descriptor()} \n Save: ${spell.saving_throw} \t Spell Resistance: ${spell.spell_resistence} \n Casting Time: ${spell.casting_time} \t Duration: ${spell.duration} Components: ${spell.components} \n Range: ${spell.range} \t ${helper.areaOrTargets()} \n \n ${spell.description} \`\`\``, message.channel)
					})
				}
			}

		})
	})
})

slack.login()
