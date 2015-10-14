var Slack = require('slack-client');
var request = require('request')
var botToken = process.env.SPELL_BOT_TOKEN
var SpellHelpers = require('./spellhelpers')

slack = new Slack(botToken, true, true)

slack.on('open', function(){
	console.log(`Connected to ${slack.team.name}`)
	for (channel in slack.channels) {
		slack.getChannelGroupOrDMByID(channel).send("With a POOF I've arrived")
	}
})


slack.on('message', function(message){
	request('https://spell-buddy.herokuapp.com/api/spell_names', function(err, response, body){
		if(err) console.log(err)

		var channel = slack.getChannelGroupOrDMByID(message.channel)
		spellNames = JSON.parse(body)
		spellNames.forEach(function(spellName){
				if(message.text.toLowerCase().match(spellName.name.toLowerCase())) {
					request(`https://spell-buddy.herokuapp.com/api/spells/${spellName.id}`, function(err, response, body){
						var spell = JSON.parse(body)[0]
						var helper = new SpellHelpers(spell)

						channel.send(`\`\`\`${spell.name}\n Levels" ${spell.spell_level} \n School: ${spell.school} \t ${helper.subschool()} \t ${helper.descriptor()} \n Save: ${spell.saving_throw} \t Spell Resistance: ${spell.spell_resistence} \n Casting Time: ${spell.casting_time} \t Duration: ${spell.duration} Components: ${spell.components} \n Range: ${spell.range} \t ${helper.areaOrTargets()} \n \n ${spell.description} \`\`\``)
					})
				}
			
		})
	})
})

slack.login()