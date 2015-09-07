json.extract!(
  pokemon, :id, :attack, :defense, :image_url, :moves, :name, :poke_type
)

json.toys do |toy|
  json.partial!  "/toys/toy", collection: pokemon.toys, as: :toy, display_toys: display_toys
end
