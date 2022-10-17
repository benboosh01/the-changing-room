<template>
    <button @click="(()=> {toDelete = true})">Delete this listing</button>
    <div v-show="toDelete">
<p>Are you sure you wish to delete this item's listing? This cannot be undone</p>
<button @click="deleteItem">Yes, I'm sure</button>
    </div>
    
  <form @submit.prevent="onSubmit">
    <label for="item_name">Item</label>
    <input id="item_name" type="text" v-model="itemName" />

    <label for="description">Description</label>
    <input id="description" type="text" v-model="itemDescription" />

    <label for="category_id">Category</label>

    <select v-model="itemCategory">
      <option value="0" selected disabled>---- Select Category ----</option>
      <option value="1">Formal Wear</option>
      <option value="2">Outdoor Gear</option>
      <option value="3">Coats and Jackets</option>
      <option value="4">Footwear</option>
      <option value="5">Dresses and Skirts</option>
      <option value="6">Trousers</option>
    </select>

    <label for="condition">Condition</label>
    <input id="condition" type="text" v-model="itemCondition" />

    <label for="item_preview_url">Image</label>
    <input
      id="item_preview_url"
      type="file"
      @change="setFiles"
      accept="image/jpeg, image/png, image/jpg"
    />

    <input
      type="submit"
      class="button block primary"
      :value="loading ? 'Loading ...' : 'Submit'"
      :disabled="loading"
    />
  </form>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { supabase } from "../supabase";

const props = defineProps(["id"]);
const emit = defineEmits(["clickEditRemove"]);
const loading = ref(true);
const itemName = ref("");
const itemDescription = ref("");
const itemCondition = ref("");
const itemCategory = ref("");
const itemOwnerId = ref("");
const itemOwner = ref("");
const itemImage = ref("");
const itemFile = ref("");
const toDelete = ref(false)

function setFiles(event) {
  itemFile.value = event.target.files[0];
}
async function deleteItem() {
    try {
        const { item, error } = await supabase.from('items').delete().eq('id', props.id)
        if (error) throw error
    } catch (error) {
        alert(error.message)
    } finally {
        toDelete.value = false
        emit('clickEditRemove');
    }
    
}
async function getItemById() {
  try {
    const { data, error } = await supabase
      .from("items")
      .select("*, categories (category_name)")
      .eq("id", props.id);

    itemName.value = data[0].item_name;
    itemDescription.value = data[0].description;
    itemCondition.value = data[0].condition;
    itemCategory.value = data[0].category_id;
    itemOwner.value = data[0].owner_username;
    itemOwnerId.value = data[0].owner_id;
    itemImage.value = data[0].item_preview_url;

    if (error) throw error;
  } catch (error) {
    alert(error.message);
  } finally {
    loading.value = false;
  }
}
async function onSubmit() {
  try {
    loading.value = true;

    if (itemFile.value) {
      const { file, error1 } = await supabase.storage
        .from("item-images")
        .remove([itemImage.value]);

      itemImage.value = itemImage.value + new Date().getTime();

      const { image, error2 } = await supabase.storage
        .from("item-images")
        .upload(itemImage.value, itemFile.value, { upsert: true });
    }

    const updatedItem = {
      item_name: itemName.value,
      description: itemDescription.value,
      category_id: itemCategory.value,
      condition: itemCondition.value,
      owner_id: itemOwnerId.value,
      item_preview_url: itemImage.value,
      owner_username: itemOwner.value,
    };

    const { error } = await supabase
      .from("items")
      .update(updatedItem)
      .eq("id", props.id);

    if (error) throw error;
  } catch (error) {
    alert(error.message);
  } finally {
    getItemById();
    loading.value = false;
    emit('clickEditRemove');
    alert("details updated");
  }
}

onMounted(() => {
  getItemById();
});
</script>
