class CreateAutocompleteLocations < ActiveRecord::Migration[5.2]
  def change
    create_table :autocomplete_locations do |t|
      t.integer :city_id
      t.string :city
      t.integer :state
      t.decimal :latitude, precision: 7, scale: 4
      t.decimal :longitude, precision: 7, scale: 4
      t.boolean :default_city
    end
  end
end
