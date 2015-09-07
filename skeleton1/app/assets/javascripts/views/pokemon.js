Pokedex.Views.Pokemon = Backbone.View.extend({
  initialize: function () {
    this.$pokeList = this.$el.find('.pokemon-list');
    this.$pokeDetail = this.$el.find('.pokemon-detail');
    this.$newPoke = this.$el.find('.new-pokemon');
    this.$toyDetail = this.$el.find('.toy-detail');

    this.pokemon = new Pokedex.Collections.Pokemon();
  },

  addPokemonToList: function(pokemon) {
    var html = "<li class=\"poke-list-item\">" +
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
  }
});
