json.extract!(
  pokemon, :id, :attack, :defense, :image_url, :moves, :name, :poke_type
)

if display_toys
  json.toys do |toy|
    json.partial!  "/toys/toy", collection: pokemon.toys, as: :toy
  end
end
