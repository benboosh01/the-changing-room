<template>
  <div class="edit-form">
    <form class="form-inputs" @submit.prevent="onSubmit">
      <label for="item_name">Item</label>
      <input id="item_name" type="text" v-model="itemName" />

      <label for="description">Description</label>
      <input id="description" type="text" v-model="itemDescription" />

      <label for="category_id">Category</label>

      <select v-model="itemCategory">
        <option value="0" selected disabled>---- Select Category ----</option>
        <option v-for="category in categoryList" :value="category.id">
          {{ category.category_name }}
        </option>
      </select>

      <label for="condition">Condition</label>
      <select id="condition" v-model="itemCondition">
        <option value="0" selected disabled>---- Select Condition ----</option>
        <option v-for="condition in conditionList" :value="condition.condition">
          {{ condition.condition }}
        </option>
      </select>

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
    <button
      class="primary"
      @click="
        () => {
          toDelete = true;
        }
      "
    >
      Delete this listing
    </button>
    <div v-show="toDelete">
      <p>
        Are you sure you wish to delete this item's listing? This cannot be
        undone
      </p>
      <button @click="deleteItem">Yes, I'm sure</button>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { supabase } from '../supabase';

const props = defineProps(['id']);
const emit = defineEmits(['clickEditRemove']);
const loading = ref(true);
const itemName = ref('');
const itemDescription = ref('');
const itemCondition = ref('');
const itemCategory = ref('');
const itemOwnerId = ref('');
const itemOwner = ref('');
const itemImage = ref('');
const itemFile = ref('');
const toDelete = ref(false);
const categoryList = ref([]);
const conditionList = ref([]);

function setFiles(event) {
  itemFile.value = event.target.files[0];
}
async function deleteItem() {
  try {
    const { item, error } = await supabase
      .from('items')
      .delete()
      .eq('id', props.id);
    if (error) throw error;
  } catch (error) {
    alert(error.message);
  } finally {
    toDelete.value = false;
    emit('clickEditRemove');
  }
}
async function getCategories() {
  try {
    loading.value = true;
    const { data, error } = await supabase.from('categories').select();

    if (error) throw error;

    if (data) {
      categoryList.value = data;
    }
  } catch (error) {
    alert(error.message);
  } finally {
    loading.value = false;
  }
}

async function getCondition() {
  try {
    loading.value = true;
    const { data, error } = await supabase
      .from('condition')
      .select()
      .order('id', { ascending: true });

    if (error) throw error;

    if (data) {
      conditionList.value = data;
    }
  } catch (error) {
    alert(error.message);
  } finally {
    loading.value = false;
  }
}
async function getItemById() {
  try {
    const { data, error } = await supabase
      .from('items')
      .select('*, categories (category_name)')
      .eq('id', props.id);

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
        .from('item-images')
        .remove([itemImage.value]);

      itemImage.value = itemImage.value + new Date().getTime();

      const { image, error2 } = await supabase.storage
        .from('item-images')
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
      .from('items')
      .update(updatedItem)
      .eq('id', props.id);

    if (error) throw error;
  } catch (error) {
    alert(error.message);
  } finally {
    getItemById();
    loading.value = false;
    emit('clickEditRemove');
    alert('details updated');
  }
}

onMounted(() => {
  getItemById();
  getCondition();
  getCategories();
});
</script>
<style scoped>
input[type='text'] {
  border: 1px solid black;
}
.button {
  max-width: 100px;
}
.delete-button {
  max-width: 100px;
  display: flex;
  flex-direction: column;
}

.edit-form {
  display: flex;
  flex-direction: column;
}

.form-inputs {
  display: flex;
  flex-direction: column;
}
</style>
