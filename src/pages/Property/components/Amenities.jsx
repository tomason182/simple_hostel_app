import styles from "./Amenities.module.css";

export default function Amenities() {
  return (
    <div>
      <div>
        <select>
          <option>Room 1</option>
          <option>Room2</option>
          <option>Room2</option>
        </select>
      </div>
      <div>
        <form className={styles.amenitiesForm}>
          <fieldset>
            <legend>Basic amenities</legend>
            <label>
              Personal lockers
              <input type="checkbox" name="personal_lockers" />
            </label>
            <label>
              Bedside shelf
              <input type="checkbox" name="bedside_shelf" />
            </label>
            <label>
              Reading light
              <input type="checkbox" name="reading_light" />
            </label>
            <label>
              Power outlet
              <input type="checkbox" name="power_outlet" />
            </label>
            <label>
              Free wifi
              <input type="checkbox" name="free_wifi" />
            </label>
          </fieldset>
          <fieldset>
            <legend>Comfort amenities</legend>
            <label>
              Air conditioning
              <input type="checkbox" name="air_conditioning" />
            </label>
            <label>
              Hangers
              <input type="checkbox" name="hangers" />
            </label>
            <label>
              Clothes storage
              <input type="checkbox" name="clothes_storage" />
            </label>
            <label>
              Laundry_basket
              <input type="checkbox" name="laundry_basket" />
            </label>
          </fieldset>
          <fieldset>
            <legend>Hygiene and extras amenities</legend>
            <label>
              Ensuite bathroom
              <input type="checkbox" name="ensuite_bathroom" />
            </label>
            <label>
              Share bathroom
              <input type="checkbox" name="share_bathroom" />
            </label>
            <label>
              Private bathroom
              <input type="checkbox" name="private_bathroom" />
            </label>
            <label>
              towels
              <input type="checkbox" name="towels" />
            </label>
            <label>
              linens
              <input type="checkbox" name="linens" />
            </label>
            <label>
              Soap and shampoo
              <input type="checkbox" name="soap_and_shampoo" />
            </label>
            <label>
              Hairdryer
              <input type="checkbox" name="hairdryer" />
            </label>
            <label>
              Trash bin
              <input type="checkbox" name="trash_bin" />
            </label>
          </fieldset>
          <fieldset>
            <legend>Additional amenities</legend>
            <label>
              Fridge
              <input type="checkbox" name="fridge" />
            </label>
            <label>
              Mini fridge
              <input type="checkbox" name="mini_fridge" />
            </label>
            <label>
              Safe box
              <input type="checkbox" name="safe_box" />
            </label>
            <label>
              Sound proofing
              <input type="checkbox" name="sound_proofing" />
            </label>
          </fieldset>
          <button>SAVE</button>
        </form>
      </div>
    </div>
  );
}
