'use strict';

var Slack = require('slack-client');
var request = require('request');
var botToken = process.env.SPELL_BOT_TOKEN;
var SpellHelpers = require('./spellhelpers');

var slack = new Slack(botToken, true, true);

slack.on('error', function (err) {
	console.log(err);
});

slack.on('open', function () {
	console.log('Connected to ' + slack.team.name);
	console.log(slack.channels);
	var _iteratorNormalCompletion = true;
	var _didIteratorError = false;
	var _iteratorError = undefined;

	try {
		for (var _iterator = slack.channels[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
			channel = _step.value;

			slack.getChannelGroupOrDMByID(channel).send("With a POOF I've arrived");
		}
	} catch (err) {
		_didIteratorError = true;
		_iteratorError = err;
	} finally {
		try {
			if (!_iteratorNormalCompletion && _iterator['return']) {
				_iterator['return']();
			}
		} finally {
			if (_didIteratorError) {
				throw _iteratorError;
			}
		}
	}
});

slack.on('message', function (message) {
	request('https://spell-buddy.herokuapp.com/api/spell_names', function (err, response, body) {
		if (err) console.log(err);

		var channel = slack.getChannelGroupOrDMByID(message.channel);
		spellNames = JSON.parse(body);
		spellNames.forEach(function (spellName) {
			if (message.text) {
				if (message.text.toLowerCase().match(spellName.name.toLowerCase())) {
					request('https://spell-buddy.herokuapp.com/api/spells/' + spellName.id, function (err, response, body) {
						var spell = JSON.parse(body)[0];
						var helper = new SpellHelpers(spell);

						channel.send('```' + spell.name + '\n Levels: ' + spell.spell_level + ' \n School: ' + spell.school + ' \t ' + helper.subschool() + ' \t ' + helper.descriptor() + ' \n Save: ' + spell.saving_throw + ' \t Spell Resistance: ' + spell.spell_resistence + ' \n Casting Time: ' + spell.casting_time + ' \t Duration: ' + spell.duration + ' Components: ' + spell.components + ' \n Range: ' + spell.range + ' \t ' + helper.areaOrTargets() + ' \n \n ' + spell.description + ' ```');
					});
				}
			}
		});
	});
});

slack.login();

//# sourceMappingURL=es5_spell_bot.js.map