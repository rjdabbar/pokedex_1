Pokedex.Views.Pokemon = Backbone.View.extend({
  initialize: function () {
    this.$pokeList = this.$el.find('.pokemon-list');
    this.$pokeDetail = this.$el.find('.pokemon-detail');
    this.$newPoke = this.$el.find('.new-pokemon');
    this.$toyDetail = this.$el.find('.toy-detail');

    this.pokemon = new Pokedex.Collections.Pokemon();

    this.$pokeList.on("click", "li", this.selectPokemonFromLst.bind(this));
  },

  addPokemonToList: function(pokemon) {
    var html = "<li class=\"poke-list-item\" data-id=\"" + pokemon.id + "\">" +
      pokemon.get("name") + " -- " +
      pokemon.get("poke_type") + "</li>";
    this.$pokeList.append(html);
  },

  refreshPokemon: function() {
    this.pokemon.fetch({
      success: function() {
        this.pokemon.models.forEach(this.addPokemonToList.bind(this))
      }.bind(this),
      error: function () {}
    });
  },

  renderPokemonDetail: function(pokemon) {
    var $detail = $("<div class=\"detail\"></div>");
    var image = "<img src=\"" + pokemon.get("image_url") +
      "\" alt=\"" + pokemon.get("name") + "\">";
    $detail.append(image);
    var html = "";
    _.each(pokemon.attributes, function(attr) {
      html += "attr: " + attr + "<br>";
    })
    $detail.append(html);
    this.$pokeDetail.html($detail);
  },

  selectPokemonFromLst: function(e) {
    var pokeId = $(e.currentTarget).data("id");
    console.log(this.pokemon.fetch());
    var pokemon = this.pokemon.get(pokeId);
    this.renderPokemonDetail(pokemon);
  },

  createPokemon: function(attributes) {
    this.pokemon.fetch();
    var newPokemon = new Pokedex.Models.Pokemon(attributes);
    newPokemon.save({}, {
      success: function(model, response, options) {
        this.pokemon.push(newPokemon);
        this.addPokemonToList(newPokemon);
      }.bind(this),
      error: function(model, response, options) {}
    });
  }
});
