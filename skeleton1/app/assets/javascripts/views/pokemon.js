Pokedex.Views.Pokemon = Backbone.View.extend({
  initialize: function () {
    this.$pokeList = this.$el.find('.pokemon-list');
    this.$pokeDetail = this.$el.find('.pokemon-detail');
    this.$newPoke = this.$el.find('.new-pokemon');
    this.$toyDetail = this.$el.find('.toy-detail');
    this.pokemon = new Pokedex.Collections.Pokemon();

    this.$pokeList.on("click", "li", this.selectPokemonFromLst.bind(this));
    this.$newPoke.on("submit", this.submitPokemonForm.bind(this));
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
    var $detail = $("<div>").addClass("detail");
    var $image = $("<img>")
                .attr("src", pokemon.get("image_url"))
                .attr("alt", pokemon.get("name"));
    var $ulToys = $("<ul>").addClass("toys");
    $detail.append($image);
    var html = "";
    _.each(pokemon.attributes, function(attr) {
      html += "attr: " + attr + "<br>";
    })
    $detail.append(html);
    $ulToys.on("click", "li", this.selectToyFromList.bind(this));
    this.$pokeDetail.html($detail).append($ulToys);
    pokemon.fetch({
      success: function(model, response, options) {
        pokemon.toys().forEach(this.addToyToToyList.bind(this));
      }.bind(this)
    })
  },

  addToyToToyList: function(toy) {
    var $toyItem = $("<li>").addClass("toy-list-item");
    var nameText = "Name: " + toy.get("name");
    var happyText = " Happiness: " + toy.get("happiness");
    var priceText = " Price: " + toy.get("price");
    $toyItem.text(nameText + happyText + priceText);
    $toyItem.data("id", toy.id);
    $toyItem.data("pokemon-id", toy.get("pokemon_id"));
    this.$pokeDetail.find(".toys").append($toyItem);
  },

  renderToyDetail: function(toy) {
    var $detailDiv = $("<div>").addClass("detail");
    var $image = $("<img>")
                .attr("src", toy.get("image_url"))
                .attr("alt", toy.get("name"));
    var $select = $("<select>")
                .data("pokemon-id", toy.get("pokemon_id"))
                .data("toy-id", toy.id);

    this.pokemon.forEach(function(pokemon) {
      var $option = $("<option>").val(pokemon.id);

      if (pokemon.id === toy.get("pokemon_id")) {
        $option.attr("selected", "selected");
      };
      $option.text(pokemon.get("name"));
      $select.append($option);
    })

    $detailDiv.html($image);
    $detailDiv.append($select);
    $select.on("change", this.reassignToy.bind(this));
    this.$toyDetail.html($detailDiv);
  },

  reassignToy: function(e) {
    var oldPokemon = this.pokemon.get($(e.currentTarget).data("pokemon-id"));
    var toy = oldPokemon.toys().get($(e.currentTarget).data("toy-id"));
    var newPokemon = this.pokemon.get($(e.currentTarget).find(":selected").val());
    toy.save({pokemon_id: newPokemon.id}, {
      success: function(model, response, options) {
        oldPokemon.toys().remove(toy);
        this.renderPokemonDetail(oldPokemon);
        this.$toyDetail.empty();
      }.bind(this)
    })
  },

  selectToyFromList: function(e) {
    var $toy = $(e.currentTarget);
    var toyId = $toy.data("id");
    var pokemonId = $toy.data("pokemon-id");
    var pokemon = this.pokemon.get(pokemonId);
    this.renderToyDetail(pokemon.toys().get(toyId));
  },

  selectPokemonFromLst: function(e) {
    // debugger
    var pokeId = $(e.currentTarget).data("id");
    var pokemon = this.pokemon.get(pokeId);
    this.renderPokemonDetail(pokemon);
  },

  createPokemon: function(attributes, renderPokemon) {
    var newPokemon = new Pokedex.Models.Pokemon(attributes);
    newPokemon.save({}, {
      success: function(model, response, options) {
        this.pokemon.push(newPokemon);
        this.addPokemonToList(newPokemon);
        renderPokemon(newPokemon);
        debugger
      }.bind(this),
      error: function(model, response, options) {}
    });
  },

  submitPokemonForm: function (e) {
    e.preventDefault();
    this.createPokemon(
      $(e.target).serializeJSON(),
      this.renderPokemonDetail.bind(this)
    );
  }
});
