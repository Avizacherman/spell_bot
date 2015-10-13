var SpellHelpers = function(spell){
	this.spell = spell

	this.subschool = function(){
		if(this.spell.subschool){
			return "Subschool: " + this.spell.subschool
		} else {
			return ""
		}
	}

	this.descriptor = function(){
		if(this.spell.descriptor){
			return "Descriptor:" + this.spell.descriptor
		} else {
			return ""
		}
	}

	this.areaOrTargets = function(){
		if(this.spell.area){
			return "Area: " + this.spell.area
		} else if (this.spell.target) {
			return "Targets: " + this.spell.targets
		} else {
			return ""
		}
	}
}

module.exports = SpellHelpers